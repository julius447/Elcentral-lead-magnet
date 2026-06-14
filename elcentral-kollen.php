<?php
/**
 * Plugin Name:       Elcentral-kollen (Ampy)
 * Plugin URI:        https://ampy.se/
 * Description:       Elcentral-kollen — lead magnet där husägaren svarar på 7 snabba frågor och får ett tvåaxlat besked (Säker? / Redo?) med specifika fynd och en mjuk CTA (kostnadsfri rådgivning). Renderas i Bricks via shortcoden [elcentralkollen]. UI-copy är svensk by design.
 * Version:           2.7.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Ampy
 * License:           GPL-2.0-or-later
 * Text Domain:       ampy-ec
 *
 * VIKTIGT FÖR UTVECKLAREN:
 *  - AMPY_EC_VERSION nedan = cache-busting för CSS/JS. BUMPA vid varje ändring
 *    av assets/*.css eller assets/*.js. Håll i synk med "version" i datafilen.
 *  - All copy, alla regler, alla länkar lever i data/elcentralkollen-data.json.
 *    Ändra ALDRIG text i PHP/JS/CSS — ändra datafilen.
 *  - DIAGNOSMOTORN är JS-only (ingen PHP-tvilling). render.php ger en crawlbar
 *    fallback (värdeprop + frågorna + 4 servicelänkar), INTE ett beräknat besked.
 *  - LANSERINGSGRIND: en auktoriserad elinstallatör signerar arketyp-
 *    sanningstabellen (docs/SPEC.md §6) före publicering. Verktyget visar inga
 *    priser längre (mjuk rådgivnings-CTA). Se meta._pending_signoff i datafilen.
 *  - GDPR: fonterna är REDAN självhostade (woff2 i assets/fonts/) — inga Google-anrop.
 *  - DESIGN: tvåpanels-shell (rail + stage) på desktop, en kolumn på mobil. Rail-panelen
 *    bär verktygets egen H1 + lead. Lägg INTE en dubblerande rubrik i Bricks ovanför.
 *  - Full dokumentation: docs/HANDOVER.md + docs/DESIGN.md (utvecklare) + docs/CHECKLIST.md (människa).
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'AMPY_EC_VERSION', '2.7.0' );
define( 'AMPY_EC_FILE',    __FILE__ );
define( 'AMPY_EC_DIR',     plugin_dir_path( __FILE__ ) );
define( 'AMPY_EC_URL',     plugin_dir_url( __FILE__ ) );
define( 'AMPY_EC_DATA',    AMPY_EC_DIR . 'data/elcentralkollen-data.json' );

require_once AMPY_EC_DIR . 'includes/render.php';

// Valfri inline lead-endpoint (REST) för PDF-rapport-capturen. INTE laddad som
// standard — PDF-capturen kan annars peka mot en befintlig Ampy-endpoint / n8n.
// Avkommentera först när du vill ta emot e-post inne i verktyget.
// require_once AMPY_EC_DIR . 'includes/lead-endpoint.php';

/**
 * Ladda + cacha datafilen. Single source of truth — hårdkoda aldrig regler.
 * @return array|null
 */
function ampy_ec_get_data() {
	static $cached = null;
	if ( $cached !== null ) { return $cached; }
	if ( ! file_exists( AMPY_EC_DATA ) ) { return null; }
	$raw  = file_get_contents( AMPY_EC_DATA );
	$data = json_decode( $raw, true );
	if ( json_last_error() !== JSON_ERROR_NONE ) { return null; }
	$cached = $data;
	return $cached;
}

/**
 * Strippa interna nycklar (prefix "_", t.ex. _pending_signoff, _note, _reviewed_by)
 * rekursivt innan datan skickas till klienten. Defensivt: håller intern dokumentation
 * och lanseringsgrindar utanför den publika JS-payloaden även om de råkar ligga kvar
 * i datafilen.
 *
 * @param mixed $node
 * @return mixed
 */
function ampy_ec_strip_internal( $node ) {
	if ( ! is_array( $node ) ) { return $node; }
	$out = array();
	foreach ( $node as $k => $v ) {
		if ( is_string( $k ) && isset( $k[0] ) && '_' === $k[0] ) { continue; }
		$out[ $k ] = ampy_ec_strip_internal( $v );
	}
	return $out;
}

/**
 * Registrera assets — laddas bara på sidor som har shortcoden (ingen global vikt).
 */
function ampy_ec_register_assets() {
	wp_register_style( 'ampy-ec', AMPY_EC_URL . 'assets/elcentralkollen.css', array(), AMPY_EC_VERSION );
	wp_register_script( 'ampy-ec', AMPY_EC_URL . 'assets/elcentralkollen.js', array(), AMPY_EC_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'ampy_ec_register_assets' );

/**
 * Shortcode: [elcentralkollen]
 *  - Embed-preset per servicesida via attributet embed="elbesiktning" (valfritt,
 *    påverkar bara ev. framtida förvald kontext — verktyget startar alltid på F1).
 *
 * Verktyget bär nu sin egen H1 + lead i rail-panelen (v3-design). render.php skriver
 * dessutom H1 + lead server-side i den crawlbara fallbacken (SEO). Lägg därför INTE en
 * dubblerande rubrik i Bricks ovanför shortcoden.
 */
function ampy_ec_shortcode( $atts = array() ) {
	$atts = shortcode_atts( array( 'embed' => '' ), $atts, 'elcentralkollen' );
	$data = ampy_ec_get_data();
	if ( ! $data ) {
		return '<p>Elcentral-kollen kunde inte laddas (saknad eller skadad datafil).</p>';
	}

	wp_enqueue_style( 'ampy-ec' );
	wp_enqueue_script( 'ampy-ec' );

	// Injicera HELA datafilen till JS — undviker en andra HTTP-rundtur.
	wp_localize_script( 'ampy-ec', 'AmpyEC', array(
		'data'      => ampy_ec_strip_internal( $data ),
		'restUrl'   => esc_url_raw( rest_url( 'ampy-ec/v1/lead' ) ),
		'restNonce' => wp_create_nonce( 'wp_rest' ),
		'embed'     => sanitize_key( $atts['embed'] ),
	) );

	return ampy_ec_render_mount( $data );
}
add_shortcode( 'elcentralkollen', 'ampy_ec_shortcode' );

/**
 * Dynamisk OG — neutral, varumärkt. AVSIKTLIGT INTE per-cell/personlig:
 * en personlig "Säker ✓ / Redo ✗"-bild kan unfurla alarmistiskt i en
 * Facebook-husgrupp och underminera ärlighetsmoaten i just den kontext där
 * det inte finns plats för nyans (UI- + marknadsgranskningen). Det personliga
 * kortet bärs istället av det nedladdade/native-delade delningskortet (canvas),
 * som är vitt med små pillar — aldrig rödflödat.
 *
 * Designern släpper assets/og/elcentral-kollen.png (1200×630, neutral).
 */
function ampy_ec_dynamic_og() {
	$data = ampy_ec_get_data();
	if ( ! $data ) { return; }
	if ( ! is_singular() && ! is_page() ) { return; }
	$post = get_post();
	if ( ! $post || ! has_shortcode( (string) $post->post_content, 'elcentralkollen' ) ) { return; }

	$title = isset( $data['meta']['page_heading'] ) ? $data['meta']['page_heading'] . ' | Ampy' : 'Elcentral-kollen | Ampy';
	$desc  = isset( $data['meta']['page_lead'] ) ? $data['meta']['page_lead'] : '';
	$img   = AMPY_EC_URL . 'assets/og/elcentral-kollen.png';
	$has   = file_exists( AMPY_EC_DIR . 'assets/og/elcentral-kollen.png' );

	echo "\n<meta property=\"og:title\" content=\"" . esc_attr( $title ) . "\" />\n";
	echo "<meta property=\"og:description\" content=\"" . esc_attr( $desc ) . "\" />\n";
	if ( $has ) {
		echo "<meta property=\"og:image\" content=\"" . esc_url( $img ) . "\" />\n";
		echo "<meta name=\"twitter:image\" content=\"" . esc_url( $img ) . "\" />\n";
	}
	echo "<meta name=\"twitter:card\" content=\"summary_large_image\" />\n";
	echo "<meta name=\"twitter:title\" content=\"" . esc_attr( $title ) . "\" />\n";
	echo "<meta name=\"twitter:description\" content=\"" . esc_attr( $desc ) . "\" />\n";
}
add_action( 'wp_head', 'ampy_ec_dynamic_og' );
