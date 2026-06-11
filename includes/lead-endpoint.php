<?php
/**
 * REST-endpoint: POST /wp-json/ampy-ec/v1/lead
 *
 * AVSTÄNGD SOM STANDARD — laddas inte av plugin:en (se den utkommenterade
 * require:n i elcentral-kollen.php). PDF-rapport-capturen i verktyget kan
 * annars POST:a mot en befintlig Ampy-endpoint / n8n-webhook. Den här filen
 * är klar att slå på om du vill ta emot e-post inne i verktyget.
 *
 * Medvetet minimal: nonce + honeypot + GDPR-samtycke + validering + e-post.
 * GDPR: lägg en integritetspolicy-URL i samtyckestexten och dokumentera
 * lagringstid (DPA) innan du slår på detta på en EU-sajt.
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'rest_api_init', function () {
	register_rest_route( 'ampy-ec/v1', '/lead', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ampy_ec_handle_lead',
		'permission_callback' => function ( $request ) {
			return (bool) wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' );
		},
		'args' => array(
			'epost'     => array( 'required' => true,  'type' => 'string' ),
			'cell'      => array( 'required' => false, 'type' => 'string' ), // sr|si|rs|rr
			'vector'    => array( 'required' => false, 'type' => 'string' ), // ?q= svarsvektor
			'samtycke'  => array( 'required' => true,  'type' => 'boolean' ),
			'webbplats' => array( 'required' => false, 'type' => 'string' ), // honeypot
		),
	) );
} );

function ampy_ec_handle_lead( WP_REST_Request $request ) {
	// 1. Honeypot — bot om något finns i `webbplats`.
	if ( ! empty( $request->get_param( 'webbplats' ) ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 ); // låtsas-success
	}

	$epost    = sanitize_email( $request->get_param( 'epost' ) );
	$cell     = sanitize_key( $request->get_param( 'cell' ) );
	$vector   = preg_replace( '/[^a-z0-9.]/i', '', (string) $request->get_param( 'vector' ) );
	$samtycke = (bool) $request->get_param( 'samtycke' );

	if ( ! is_email( $epost ) ) {
		return new WP_Error( 'ampy_ec_epost', 'Ange en giltig e-postadress.', array( 'status' => 400 ) );
	}
	if ( ! $samtycke ) {
		return new WP_Error( 'ampy_ec_consent', 'Vi behöver ditt samtycke för att mejla rapporten.', array( 'status' => 400 ) );
	}
	if ( $cell && ! in_array( $cell, array( 'sr', 'si', 'rs', 'rr' ), true ) ) {
		return new WP_Error( 'ampy_ec_cell', 'Okänt utfall.', array( 'status' => 400 ) );
	}

	// Notifiera Ampy + (valfritt) persistera/POST:a till n8n via en action.
	$admin_email = get_option( 'admin_email' );
	$subject = sprintf( '[Elcentral-kollen] PDF-rapport: %s', strtoupper( $cell ?: '–' ) );
	$body = sprintf(
		"Ny rapport-capture via Elcentral-kollen\n\nE-post: %s\nUtfall: %s\nSvarsvektor: %s\n\nIP: %s\nTid: %s",
		$epost, strtoupper( $cell ?: '–' ), $vector ?: '–',
		isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '–',
		current_time( 'mysql' )
	);
	$sent = wp_mail( $admin_email, $subject, $body );

	do_action( 'ampy_ec_lead_received', array( 'epost' => $epost, 'cell' => $cell, 'vector' => $vector ) );

	if ( ! $sent ) {
		return new WP_Error( 'ampy_ec_mail', 'Kunde inte skicka just nu. Försök igen om en stund.', array( 'status' => 500 ) );
	}
	return new WP_REST_Response( array( 'ok' => true, 'message' => 'Tack! Rapporten är på väg till din inkorg.' ), 200 );
}
