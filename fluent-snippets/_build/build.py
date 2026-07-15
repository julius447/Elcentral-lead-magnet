#!/usr/bin/env python3
"""
Build the 3 Elcentral-kollen Fluent Snippets from the plugin sources.

FORMAT-ONLY port — NO design change:
  CSS  : every `rem` -> `px` (1rem = 10px, the plugin's 62.5% root) so it renders IDENTICALLY
         without a global `html{font-size:62.5%}` (dropped — it would pollute the WP/Bricks theme).
         @font-face URLs made absolute (Elcentral self-hosts fonts — GDPR). A zero-specificity
         `:where()` theme-hardening reset is prepended so the theme can't bleed into `.ampy-ec`.
  JS   : byte-identical to assets/elcentralkollen.js (data comes from the PHP snippet).
  PHP  : [elcentralkollen] shortcode -> mount + crawlable fallback + the data as
         `window.AmpyEC.data` (nowdoc, so the JS stays byte-identical).

Run:  python3 fluent-snippets/_build/build.py
"""
import re, json, pathlib

REPO = pathlib.Path(__file__).resolve().parents[2]
SRC_CSS  = REPO / 'assets' / 'elcentralkollen.css'
SRC_JS   = REPO / 'assets' / 'elcentralkollen.js'
SRC_DATA = REPO / 'data' / 'elcentralkollen-data.json'
OUT      = REPO / 'fluent-snippets'
FONTBASE = 'https://julius447.github.io/Elcentral-lead-magnet/assets/fonts'
VERSION  = json.loads(SRC_DATA.read_text())['meta']['version']

# ---------- helpers ----------
def rem_to_px(css: str) -> str:
    """Convert every <number>rem token to px at 1rem = 10px. Leaves em / vw / % / unitless alone."""
    def repl(m):
        px = float(m.group(1)) * 10
        s = ('%f' % px).rstrip('0').rstrip('.')
        return s + 'px'
    return re.sub(r'(-?\d*\.?\d+)rem\b', repl, css)

# ---------- CSS ----------
css = SRC_CSS.read_text()
css = re.sub(r'^\s*html\s*\{\s*font-size:\s*62\.5%;\s*\}\s*\n', '', css, flags=re.M)  # drop global root
css = rem_to_px(css)
css = re.sub(r"url\(fonts/([^)]+)\)", lambda m: "url('%s/%s')" % (FONTBASE, m.group(1)), css)

CSS_HEADER = (
"/* Elcentral-kollen v%s - Fluent Snippet 1/3 (type: CSS).\n"
"   FORMAT-ONLY port of assets/elcentralkollen.css: every rem -> px (1rem = 10px) so it renders\n"
"   identically WITHOUT a global html{font-size:62.5%%} (dropped; it would resize the whole WP theme).\n"
"   @font-face points at the hosted woff2 (swap to the ampy.se Media Library for GDPR - see README).\n"
"   No design value changed. Auto-built by _build/build.py - edit the sources + rebuild, not this file. */\n"
) % VERSION

CSS_HARDEN = (
"/* THEME HARDENING - zero-specificity :where() reset so the WordPress/Bricks theme cannot bleed\n"
"   into the tool. :where() = 0 specificity, so every real design rule below still wins. */\n"
".ampy-ec { font-size: 16px; line-height: 1.5; text-align: left; -webkit-text-size-adjust: 100%; }\n"
".ampy-ec :where(h1,h2,h3,h4,p,ul,ol,li,figure,blockquote,fieldset,legend) { margin: 0; padding: 0; border: 0; }\n"
".ampy-ec :where(ul,ol) { list-style: none; }\n"
".ampy-ec :where(button) { margin: 0; padding: 0; background: none; border: 0; font: inherit; color: inherit; text-align: inherit; cursor: pointer; }\n"
".ampy-ec :where(a) { color: inherit; text-decoration: none; }\n"
".ampy-ec :where(img,svg) { display: block; max-width: 100%; }\n"
".ampy-ec :where(input,textarea,select) { font: inherit; color: inherit; }\n\n"
)

(OUT / 'ampy-elcentral-kollen.css').write_text(CSS_HEADER + CSS_HARDEN + css)

# ---------- JS (byte-identical) ----------
JS_HEADER = (
"/* Elcentral-kollen - Fluent Snippet 3/3 (type: JS).\n"
"   BYTE-IDENTICAL to assets/elcentralkollen.js. The data is injected by the PHP snippet as\n"
"   window.AmpyEC.data (the plugin's own boot() reads it), so nothing here is modified. */\n"
)
(OUT / 'ampy-elcentral-kollen.js').write_text(JS_HEADER + SRC_JS.read_text())

# ---------- PHP (mount + fallback + data) ----------
data_raw = SRC_DATA.read_text().strip()
assert '</' not in data_raw and 'AMPYEC_DATA_EOF' not in data_raw, 'data needs escaping/terminator change'

PHP = '''<?php
/**
 * Elcentral-kollen v%(v)s - Fluent Snippet 2/3 (type: PHP).
 * -----------------------------------------------------------------------------
 * Install all THREE snippets in FluentSnippets, then drop [elcentralkollen] in Bricks:
 *   1. CSS -> ampy-elcentral-kollen.css   2. JS -> ampy-elcentral-kollen.js   3. PHP -> this file
 * This snippet registers the shortcode: it prints the mount, a crawlable SEO fallback, and the
 * tool DATA as window.AmpyEC.data (so the JS snippet stays byte-identical to the plugin).
 * The tool renders its own <h1> in the rail - do NOT add a duplicate heading in Bricks.
 * Auto-built by _build/build.py - rebuild rather than hand-editing the data below.
 * -----------------------------------------------------------------------------
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! function_exists( 'ampy_ec_shortcode_render' ) ) {
	function ampy_ec_shortcode_render() {
		$data = <<<'AMPYEC_DATA_EOF'
%(data)s
AMPYEC_DATA_EOF;
		ob_start();
		?>
		<div class="ampy-ec" lang="sv">
			<div class="ampy-ec__noscript">
				<div class="ampy-ec__block">
					<h1>Är din elcentral säker?</h1>
					<p><strong>Ta reda på om din central är säker och anpassad för framtida installationer!</strong></p>
					<p>Elcentral-kollen ställer några snabba frågor om din elcentral och ger ett besked på två axlar: <strong>Säker?</strong> och <strong>Redo?</strong> Frågorna:</p>
					<ol>
						<li>Hur gammalt är huset eller lägenheten?</li>
						<li>Är elcentralen utbytt eller original?</li>
						<li>Vilka säkringar har du i centralen?</li>
						<li>Finns det en jordfelsbrytare i centralen?</li>
						<li>Känner du igen något av det här hemma?</li>
						<li>Hur stor är din huvudsäkring?</li>
						<li>Har du planer på något av det här?</li>
					</ol>
					<p>Vill du gå vidare direkt? Läs om våra tjänster:</p>
					<ul>
						<li><a href="https://ampy.se/elservice/elbesiktning/">Elbesiktning</a></li>
						<li><a href="https://ampy.se/elservice/elcentral/">Byta elcentral</a></li>
						<li><a href="https://ampy.se/elservice/jordfelsbrytare/">Installera jordfelsbrytare</a></li>
						<li><a href="https://ampy.se/elservice/lastbalansering/">Lastbalansering</a></li>
						<li><a href="https://ampy.se/elservice/uppsakring/">Uppsäkring (öka huvudsäkringen)</a></li>
					</ul>
					<p class="ampy-ec__source-line">Vägledande bedömning baserad på dina svar. Den ersätter inte en besiktning på plats.</p>
				</div>
			</div>
		</div>
		<script>window.AmpyEC = window.AmpyEC || {}; window.AmpyEC.data = <?php echo $data; ?>;</script>
		<?php
		return ob_get_clean();
	}
	add_shortcode( 'elcentralkollen', 'ampy_ec_shortcode_render' );
}

/**
 * OPTIONAL dynamic Open Graph tags. DISABLED by default (leave the `return;`), because most Bricks
 * pages let the SEO plugin (Yoast / RankMath) set social tags - enabling both gives double OG.
 * To enable: delete the `return;` line and set $og_image to your 1200x630 image URL.
 */
if ( ! function_exists( 'ampy_ec_dynamic_og' ) ) {
	function ampy_ec_dynamic_og() {
		return; // <- delete this line to enable
		if ( ! is_page() && ! is_singular() ) { return; }
		$title    = 'Är din elcentral säker? | Ampy';
		$desc     = 'Ta reda på om din central är säker och anpassad för framtida installationer!';
		$og_image = '';
		echo "\\n<meta property=\\"og:title\\" content=\\"" . esc_attr( $title ) . "\\" />\\n";
		echo "<meta property=\\"og:description\\" content=\\"" . esc_attr( $desc ) . "\\" />\\n";
		echo "<meta name=\\"twitter:card\\" content=\\"summary_large_image\\" />\\n";
		if ( $og_image ) {
			echo "<meta property=\\"og:image\\" content=\\"" . esc_url( $og_image ) . "\\" />\\n";
			echo "<meta name=\\"twitter:image\\" content=\\"" . esc_url( $og_image ) . "\\" />\\n";
		}
	}
	add_action( 'wp_head', 'ampy_ec_dynamic_og' );
}
''' % {'v': VERSION, 'data': data_raw}

(OUT / 'ampy-elcentral-kollen.php').write_text(PHP)

# ---------- self-test (DEV ONLY; self-contained so it opens standalone) ----------
SELFTEST = '''<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <title>Elcentral-kollen - Fluent Snippet self-test (dev only)</title>
  <!-- (1) the CSS snippet, exactly as it deploys -->
  <link rel="stylesheet" href="ampy-elcentral-kollen.css" />
  <!-- TEST-ONLY: the CSS points @font-face at GitHub Pages (a sandboxed preview cannot reach it);
       re-declare the same families from the LOCAL fonts so this file renders the real typefaces.
       This block exists ONLY in this dev file, never in production. -->
  <style>
    @font-face { font-family:'Outfit'; font-style:normal; font-weight:400 600; font-display:swap; src:url(fonts/Outfit-latin.woff2) format('woff2'); }
    @font-face { font-family:'Plus Jakarta Sans'; font-style:normal; font-weight:500 700; font-display:swap; src:url(fonts/PlusJakartaSans-latin.woff2) format('woff2'); }
    html, body { margin:0; padding:0; min-height:100%; }
    body { font-family:'Outfit', system-ui, sans-serif; background: radial-gradient(130% 90% at 50% -10%, #fbfcff 0%, #f3f5fb 55%, #eceef6 100%) no-repeat fixed; }
  </style>
</head>
<body>
  <!-- (2) what the PHP shortcode outputs: the mount + the data as window.AmpyEC.data -->
  <div class="ampy-ec" lang="sv"></div>
  <script>window.AmpyEC = window.AmpyEC || {}; window.AmpyEC.data = __AMPY_EC_DATA__;</script>
  <!-- (3) the JS snippet, exactly as it deploys -->
  <script src="ampy-elcentral-kollen.js"></script>
</body>
</html>
'''.replace('__AMPY_EC_DATA__', data_raw)
(OUT / '_selftest.html').write_text(SELFTEST)

print('Built v%s:' % VERSION)
for f in ['ampy-elcentral-kollen.css', 'ampy-elcentral-kollen.js', 'ampy-elcentral-kollen.php']:
    print('  %-32s %6d bytes' % (f, (OUT / f).stat().st_size))
