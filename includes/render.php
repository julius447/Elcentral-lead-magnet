<?php
/**
 * Server-render: mount-punkt + crawlbar HTML-fallback.
 *
 * VIKTIGT: fallbacken är INTE ett beräknat besked. Diagnosmotorn är JS-only
 * (ingen PHP-tvilling — se docs/SPEC.md §5). Sökmotorer och no-JS-besökare ser:
 *   - värdepropositionen,
 *   - frågorna som läsbar text,
 *   - ett starkt internlänk-block till de fyra servicesidorna (SEO-målet).
 * När JS bootar tas .ampy-ec__noscript bort.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ampy_ec_render_mount( $data ) {
	$heading  = isset( $data['meta']['page_heading'] ) ? $data['meta']['page_heading'] : 'Är din elcentral säker och redo?';
	$lead     = isset( $data['meta']['page_lead'] ) ? $data['meta']['page_lead'] : '';
	$disc     = isset( $data['meta']['disclaimer'] ) ? $data['meta']['disclaimer'] : '';
	$services = isset( $data['meta']['service_pages'] ) ? $data['meta']['service_pages'] : array();
	$qs       = isset( $data['questions'] ) ? $data['questions'] : array();

	$service_labels = array(
		'elbesiktning'    => 'Elbesiktning',
		'centralbyte'     => 'Byta elcentral',
		'jordfelsbrytare' => 'Installera jordfelsbrytare',
		'lastbalansering' => 'Lastbalansering',
		'uppsakring'      => 'Uppsäkring (öka huvudsäkringen)',
	);

	ob_start();
	?>
	<div class="ampy-ec" lang="sv" data-data-url="<?php echo esc_url( AMPY_EC_URL . 'data/elcentralkollen-data.json' ); ?>">
		<div class="ampy-ec__noscript">
			<div class="ampy-ec__block">
				<h1><?php echo esc_html( $heading ); ?></h1>
				<p><strong><?php echo esc_html( $lead ); ?></strong></p>
				<p>Elcentral-kollen ställer några snabba frågor om din elcentral och ger ett besked på två axlar: <strong>Säker?</strong> och <strong>Redo?</strong> Frågorna:</p>
				<ol>
					<?php foreach ( $qs as $q ) : ?>
						<li><?php echo esc_html( isset( $q['title'] ) ? $q['title'] : '' ); ?></li>
					<?php endforeach; ?>
				</ol>
				<p>Vill du gå vidare direkt? Läs om våra tjänster:</p>
				<ul>
					<?php foreach ( $service_labels as $key => $label ) : ?>
						<?php if ( ! empty( $services[ $key ] ) ) : ?>
							<li><a href="<?php echo esc_url( $services[ $key ] ); ?>"><?php echo esc_html( $label ); ?></a></li>
						<?php endif; ?>
					<?php endforeach; ?>
				</ul>
				<?php if ( $disc ) : ?>
					<p class="ampy-ec__source-line"><?php echo esc_html( $disc ); ?></p>
				<?php endif; ?>
			</div>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
