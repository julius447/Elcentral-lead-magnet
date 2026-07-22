<?php
// <Internal Doc Start>
/*
*
* @description: 
* @tags: 
* @group: 
* @name: Ampy - Elcentral-kollen - Backend
* @type: PHP
* @status: published
* @created_by: 13
* @created_at: 2026-06-18 08:38:18
* @updated_at: 2026-07-21 22:59:56
* @is_valid: 1
* @updated_by: 13
* @priority: 10
* @run_at: all
* @load_as_file: 
* @load_in_block_editor: 
* @condition: {"status":"no","run_if":"assertive","items":[[]]}
*/
?>
<?php if (!defined("ABSPATH")) { return;} // <Internal Doc End> ?>
<?php

/**
 * Ampy - Elcentral-kollen - Backend
 * Fluent Snippets: Run everywhere (all). No opening <?php (FluentSnippets adds it).
 *
 * Folded from the standalone Elcentral-kollen plugin (base v2.16.5; data/design synced to v2.19.5) into one snippet.
 * Data is baked below (AMPYECJSON nowdoc = single source of truth; edit in place,
 * then bump AMPY_EC_VERSION). The diagnosis engine is JS-only; this file bakes the
 * data, injects it inline as window.AmpyEC.data (internal _keys stripped at runtime
 * by ampy_ec_strip_internal), serves the crawlable noscript fallback and the
 * [elcentralkollen] shortcode, and emits neutral OG tags. .ampy-ec is its own namespace
 * (no battery / EV / LED / Elkollen collision).
 */

if ( ! defined( 'AMPY_EC_VERSION' ) ) define( 'AMPY_EC_VERSION', '2.19.5' );

/* The lead-magnet post that holds Elcentral-kollen's settings (webhook URLs +
   fallback email) in its post-editor metabox. The shortcode can be embedded on
   any page; this constant tells the metabox and the REST handlers which post to
   read config from. Set to the Elcentral-kollen lead-magnet post.            */
if ( ! defined( 'AMPY_EC_POST_ID' ) ) define( 'AMPY_EC_POST_ID', 59003 );

/* ==========================================================================
   1. DATA  (single source of truth - baked in; edit here, then bump version)
   ========================================================================== */
function ampy_ec_baked_data(): array {
	$json = <<<'AMPYECJSON'
{"meta":{"version":"2.19.5","product_name":"Elcentral-kollen","page_heading":"Är din elcentral säker?","page_lead":"Ta reda på om din central är säker och anpassad för framtida installationer!","disclaimer":"Vägledande bedömning baserad på dina svar. Den ersätter inte en besiktning på plats.","primary_source":"Elsäkerhetsverket & Skatteverket","verify_company_url":"https://www.elsakerhetsverket.se/kollaelforetaget/foretagsregister/?foretag=12047521&sok=1","ampy_offert_url":"https://ampy.se/offert/","laddbox_calc_url":"https://ampy.se/laddboxkalkylator/","privacy_policy_url":"https://ampy.se/integritetspolicy/","pdf_webhook_url":null,"share_card_authority":"Auktoriserat elinstallationsföretag · registrerat hos Elsäkerhetsverket","share_card_cta":"Gör testet gratis →","result_readmore":{"pre":"Nyfiken på att läsa mer? ","label":"Se mer om elcentraler","url_key":"centralbyte"},"rail":{"credential_link":"Auktoriserat elinstallationsföretag","credential_rest":", registrerat hos Elsäkerhetsverket.","contact":{"phone_label":"010-265 79 79","phone_url":"tel:+46102657979","contact_label":"Kontakta oss","contact_url":"https://ampy.se/offert/"},"bullets":[{"icon":"check","text":"Byggt på Elsäkerhetslagen och Elsäkerhetsverket"},{"icon":"shield","text":"Registrerat elinstallationsföretag"},{"icon":"checkCircle","text":"Ett ärligt besked, byggt på dina egna svar"}],"contact_heading":"Hellre prata med en elektriker direkt?","stat":{"link":"Elsäkerhetsverket","url":"https://www.elsakerhetsverket.se/om-oss/publikationer/rapporter/elrelaterade-brander-i-bostader-2018-2022/","rest":" registrerade 298 händelser 2018–2022 där elcentralen var orsaken."}},"start":{"heading":"Då sätter vi igång","cta":"Starta testet","time_note":"Beräknad tid: 2 minuter"},"service_pages":{"elbesiktning":"https://ampy.se/elservice/elbesiktning/","centralbyte":"https://ampy.se/elservice/elcentral/","jordfelsbrytare":"https://ampy.se/elservice/jordfelsbrytare/","lastbalansering":"https://ampy.se/elservice/lastbalansering/","uppsakring":"https://ampy.se/elservice/uppsakring/"},"embed_pages":["/elservice/elcentral/","/elbesiktning/","/jordfelsbrytare/","/lastbalansering/"],"lead_form":{"title":"Få kostnadsfri rådgivning","intro":"En behörig elektriker går igenom dina svar och återkommer med en rådgivning inom 24 timmar!","back":"Tillbaka till beskedet","submit":"Boka rådgivning","submitting":"Skickar…","consent":"Genom att trycka på \"Boka rådgivning\" samtycker jag till att Ampy behandlar mina personuppgifter enligt vår ","consent_link":"integritetspolicy","error_required":"Fyll i alla fält.","error_send":"Något gick fel. Ring oss på 010-265 79 79 så hjälper vi dig.","success_title":"Tack! Vi hör av oss inom kort.","success_body":"En behörig elektriker återkommer med ett förslag, oftast inom en arbetsdag.","success_back":"Tillbaka till beskedet"},"lead_webhook_url":null},"questions":[{"id":"hus_alder","axis":"safety","type":"single","title":"Hur gammalt är huset eller lägenheten?","note":"Byggåret säger ofta en hel del om hur gammal elen är. Ungefärligt räcker.","options":[{"id":"fore_1970","label":"Före 1970"},{"id":"1970_1990","label":"1970–1990"},{"id":"1990_2010","label":"1990–2010"},{"id":"efter_2010","label":"Efter 2010"},{"id":"vet_inte","label":"Osäker"}]},{"id":"central_alder","axis":"safety","type":"single","title":"Är elcentralen utbytt eller original?","subtitle":"Elcentralen byts sällan ut, så många har kvar originalet i decennier.","note":"Tänk på själva elcentralen (elskåpet), inte huset. Är du inte säker? Välj det alternativ som stämmer bäst.","options":[{"id":"original","label":"Lika gammal som huset"},{"id":"recent","label":"Utbytt de senaste åren"},{"id":"older","label":"Utbytt, men för länge sedan"},{"id":"vet_inte","label":"Osäker"}]},{"id":"sakringstyp","axis":"safety","type":"single","title":"Vilka säkringar har du i centralen?","note":"Skruvsäkringar tyder ofta på en central som är 30+ år.","options":[{"id":"skruv","label":"Skruvsäkringar eller proppar","clarifier":"Runda säkringar man skruvar i"},{"id":"automat","label":"Automatsäkringar","clarifier":"Vippknappar man slår av och på"},{"id":"blandat","label":"Blandat","clarifier":"Både runda proppar och vippknappar i samma central"},{"id":"vet_inte","label":"Osäker"}]},{"id":"jordfelsbrytare","axis":"safety","type":"single","title":"Finns det en jordfelsbrytare i centralen?","note":"Jordfelsbrytaren bryter strömmen blixtsnabbt om något går fel, så att du inte får en farlig stöt. Den sitter ofta som en bred knapp märkt Test.","options":[{"id":"ja","label":"Ja"},{"id":"nej","label":"Nej"},{"id":"vet_inte","label":"Osäker"}]},{"id":"varningstecken","axis":"safety","type":"multi","title":"Känner du igen något av det här hemma?","subtitle":"Välj alla som stämmer.","note":"Värme och missfärgning är klassiska tecken på glappkontakt, en lös anslutning som hettar upp. Inget av detta? Det är ett bra svar.","options":[{"id":"loser_ut","label":"Säkringar som löser ut ofta"},{"id":"varma_uttag","label":"Uttag eller strömbrytare som blir varma"},{"id":"flimrar","label":"Lampor som flimrar"},{"id":"brand_lukt","label":"Bränd lukt eller missfärgade uttag"},{"id":"inget","label":"Inget av detta","exclusive":true}]},{"id":"huvudsakring","axis":"ready","type":"single","title":"Hur stor är din huvudsäkring?","note":"Är du osäker? På din elnätsfaktura hittar du storleken på din huvudsäkring. Vi kan också räkna utan.","options":[{"id":"16","label":"16 A"},{"id":"20","label":"20 A"},{"id":"25","label":"25 A"},{"id":"35","label":"35 A eller större"},{"id":"vet_inte","label":"Osäker"}]},{"id":"planer","axis":"ready","type":"multi","title":"Har du planer på något av det här?","note":"Det du väljer avgör hur mycket kapacitet, alltså effekt, centralen behöver. Inga planer är ett helt fint svar.","options":[{"id":"elbil","label":"Laddbox / Elbilsladdare"},{"id":"varmepump","label":"Värmepump"},{"id":"solceller","label":"Solceller eller batterilagring"},{"id":"renovering","label":"Renoverar kök eller badrum"},{"id":"inget","label":"Inget planerat","exclusive":true}]}],"scoring":{"weights":{"alder":{"fore_1970":3,"1970_1990":2,"1990_2010":1,"efter_2010":0},"sakringstyp":{"skruv":2,"blandat":1,"automat":0,"vet_inte":0},"jordfelsbrytare":{"nej":3,"ja":0,"vet_inte":0},"varningstecken":{"loser_ut":1,"varma_uttag":1,"flimrar":1,"brand_lukt":0,"inget":0}},"central_age_map":{"recent":"efter_2010","older":"1990_2010"},"thresholds":{"forhojd":3,"hog":6},"floors":{"present_symptom":{"trigger_ids":["loser_ut","varma_uttag","flimrar"],"min_level":"forhojd"},"escalation":{"trigger_id":"brand_lukt","min_level":"forhojd","_docs_note":"Engine reads ONLY trigger_id + min_level. The akut behavior (alert box, Ring-first CTA, green-block) is driven by dx.safety.escalation in the renderer, not by extra flags here."}},"uncertainty":{"counts_fields":["sakringstyp","jordfelsbrytare","huvudsakring"],"min_count":2},"ready":{"no_plan_state":"ej_bedomd","rules":[{"plan":"elbil","huvudsakring":["25","35"],"state":"redo_marginal"},{"plan":"elbil","huvudsakring":["20"],"state":"redo_med_atgard"},{"plan":"elbil","huvudsakring":["16"],"state":"inte_redo"},{"plan":"elbil","huvudsakring":["vet_inte"],"state":"kraver_bedomning"},{"plan":"varmepump","state":"kraver_bedomning"},{"plan":"solceller","state":"kraver_bedomning"},{"plan":"renovering","state":"kraver_bedomning"}],"pill_levels":{"redo_marginal":"success","redo_med_atgard":"info","kraver_bedomning":"info","inte_redo":"warning","ej_bedomd":"neutral"}},"cross_axis_rules":[{"if":{"central_age_in":["fore_1970","1970_1990"],"sakringstyp":"skruv","has_any_plan":true},"then":{"ready_finding":"central_full"}}]},"ready_states":{"ej_bedomd":{"label":"Inget planerat","axis_label":"Redo"},"redo_marginal":{"label":"Med marginal","axis_label":"Redo"},"redo_med_atgard":{"label":"Med lastbalansering","axis_label":"Redo"},"kraver_bedomning":{"label":"Kräver bedömning","axis_label":"Redo"},"inte_redo":{"label":"Behöver åtgärd","axis_label":"Redo"}},"safety_states":{"lag":{"label":"Låg risk","pill_level":"success","icon":"check"},"forhojd":{"label":"Förhöjd risk","pill_level":"warning","icon":"alert"},"hog":{"label":"Hög risk","pill_level":"error","icon":"ban"},"oklart":{"label":"Oklart","pill_level":"info","icon":"info"}},"verdict_matrix":{"sr":{"cell":"Säker och redo","headline":"Din central ser bra ut.","tone":"calm","summary":"Inga säkerhetsbrister i dina svar, och centralen har kapacitet för det du planerar.","cta":{"primary":null,"secondary":null,"link":"laddbox_bridge"},"summary_by_ready":{"ej_bedomd":"Inga säkerhetsbrister i dina svar. Centralen ser trygg ut, och har du inga planer just nu finns inget du behöver göra."},"summary_by_safety":{"oklart":"Vi ser inga tydliga risker, men en del svar var osäkra. Då kan vi inte ge ett helt grönt besked. En kort besiktning ger dig säkerheten."}},"si":{"cell":"Säker, men inte redo än","headline":"Säker i dag. Redo med en kapacitetsåtgärd.","headline_by_ready":{"redo_med_atgard":"Säker i dag. Redo för laddbox med lastbalansering.","inte_redo":"Säker i dag. Din plan behöver en åtgärd först.","kraver_bedomning":"Säker i dag. Redo-läget avgörs av en kort bedömning."},"tone":"constructive","summary":"Centralen ser trygg ut. För din plan behöver kapaciteten ses över.","summary_by_ready":{"kraver_bedomning":"Centralen ser trygg ut. Exakt vad din plan kräver avgörs av en kort bedömning.","redo_med_atgard":"Centralen ser trygg ut. Laddboxen behöver bara kombineras med lastbalansering, en liten enhet som fördelar strömmen så inget överbelastas."},"cta":{"primary":"radgivning","secondary":null,"link":null}},"rs":{"cell":"Redo, men något bör ses över","headline":"Något i säkerheten bör ses över innan du går vidare.","headline_by_ready":{"ej_bedomd":"Det finns något i säkerheten värt att kontrollera."},"headline_by_safety":{"hog":"Centralen har flera kända riskfaktorer som bör ses över."},"tone":"serious","summary":"Centralen klarar din plan. Men något i säkerheten bör kontrolleras först.","cta":{"primary":"radgivning","secondary":null,"link":null},"summary_by_ready":{"ej_bedomd":"Centralen ser ut att klara dagens behov, men något i säkerheten bör kontrolleras innan du går vidare."},"summary_by_safety":{"hog":"Centralen har flera riskfaktorer som bör åtgärdas. En kort besiktning visar vad som bör göras först."}},"rr":{"cell":"Varken säker eller redo","headline":"Både säkerhet och kapacitet behöver ses över.","headline_by_safety":{"hog":"Både säkerhet och kapacitet behöver åtgärdas, och säkerheten väger tyngst."},"tone":"serious","summary":"Ett nytt elskåp kan lösa både säkerheten och kapaciteten på en gång, och är ofta det mest prisvärda steget.","cta":{"primary":"radgivning","secondary":null,"link":null}}},"cta_defs":{"radgivning":{"kind":"primary","label":"Få kostnadsfri rådgivning","url":"ampy_offert_url","opens_form":true},"laddbox_bridge":{"kind":"link","label":"Räkna ut din besparing","url":"laddbox_calc_url","lead":"Din central klarar en laddbox."},"nedsakring_hook":{"kind":"link","label":"Du kanske kan säkra ned och sänka din nätavgift. Fråga oss.","url":"ampy_offert_url"},"ring":{"kind":"link","label":"Ring oss","url":"tel:+46102657979"},"centralbyte_how":{"kind":"secondary","label":"Se hur ett centralbyte går till","url_key":"centralbyte"},"redo_how":{"kind":"secondary","label":"Så gör vi centralen redo","url_key":"centralbyte"}},"findings":[{"id":"f_jfb_nej","rank":10,"when":{"jordfelsbrytare":"nej"},"icon":"warn","text":"Ingen jordfelsbrytare: skyddet som bryter strömmen blixtsnabbt om den tar fel väg, till exempel genom en person, saknas. Det krävs i nya installationer och går att komplettera i efterhand. Vi rekommenderar det starkt."},{"id":"f_central_old","rank":21,"when":{"central_age_in":["fore_1970","1970_1990"]},"icon":"warn","text":"Centralen är sannolikt 30 år eller äldre: centraler från den tiden är ofta för klent tilltagna för dagens elbehov och saknar nyare skydd."},{"id":"f_skruv","rank":22,"when":{"sakringstyp":"skruv"},"icon":"warn","text":"Skruvsäkringar: den äldre typen, som vanligtvis sitter i centraler från 1980-talet eller tidigare."},{"id":"f_central_full","rank":24,"when":{"cross_axis":"central_full"},"icon":"warn","text":"Centralen är sannolikt full: det finns inte plats för fler grupper, de separata kretsar som elen delas upp i, och ett byte ger både utrymme och bättre säkerhet på en gång."},{"id":"f_blandat","rank":26,"when":{"sakringstyp":"blandat"},"icon":"warn","text":"Blandade säkringar: en del av centralen är moderniserad, men annat är troligen kvar från en äldre generation."},{"id":"f_varma","rank":30,"when":{"varningstecken_has":"varma_uttag"},"icon":"warn","text":"Varma uttag eller strömbrytare: ett tydligt tecken på glappkontakt, alltså en lös anslutning som hettar upp där strömmen ska passera."},{"id":"f_loser_ut","rank":31,"when":{"varningstecken_has":"loser_ut"},"icon":"warn","text":"Säkringar som löser ut ofta: säkringen gör sitt jobb, men att den behöver göra det ofta tyder på överbelastning eller ett fel i kretsen."},{"id":"f_flimrar","rank":32,"when":{"varningstecken_has":"flimrar"},"icon":"warn","text":"Lampor som flimrar: kan bero på en glappande anslutning någonstans i installationen, men ibland på lampan eller dimmern själv."},{"id":"f_16a_block","rank":35,"when":{"ready_state":"inte_redo"},"icon":"warn","text":"Med 16 A räcker inte huvudsäkringen för en laddbox som den är. Det löses oftast med lastbalansering, en liten enhet som fördelar strömmen så inget överbelastas. Ibland med en uppsäkring, alltså en större huvudsäkring."},{"id":"f_lastbalansering","rank":45,"when":{"ready_state":"redo_med_atgard"},"icon":"info","text":"Med 20 A laddar du elbil bäst med lastbalansering: en liten enhet som fördelar strömmen mellan bilen och hushållet så inget överbelastas. Vanlig och okomplicerad lösning."},{"id":"f_ready_bedomning","rank":48,"when":{"ready_state":"kraver_bedomning"},"icon":"info","text":"Exakt marginal beror på hur mycket el du redan använder, till exempel elvärme eller varmvattenberedare. En kort bedömning på plats räknar ut det åt dig."},{"id":"f_central_okand","rank":50,"when":{"central_alder":"vet_inte"},"icon":"info","text":"Du är osäker på centralens ålder: helt vanligt, och inget vi tolkar som en risk. Det är just en sådan sak en besiktning ger svar på."},{"id":"f_jfb_vetinte","rank":51,"when":{"jordfelsbrytare":"vet_inte"},"icon":"info","text":"Du är osäker på om det finns en jordfelsbrytare: värt att titta efter i centralen, eller att låta en besiktning svara på. Det avgör vi inte på en gissning."},{"id":"f_huvudsakring_vetinte","rank":52,"when":{"huvudsakring":"vet_inte"},"icon":"info","text":"Du är osäker på huvudsäkringens storlek: mycket vanligt, den står på din elnätsfaktura. Vill du veta exakt vad din plan kräver hjälper en kort bedömning till."},{"id":"f_nedsakring","rank":55,"when":{"huvudsakring_in":["25","35"],"no_plan":true},"icon":"info","text":"Du är förhållandevis högt säkrad utan några stora planer: då kan en nedsäkring, att gå ner till en mindre huvudsäkring, sänka den fasta nätavgiften. Hur mycket du sparar beror på ditt elnätsbolag."},{"id":"f_central_recent","rank":58,"when":{"central_alder":"recent"},"icon":"ok","text":"Centralen är utbytt de senaste åren: då har du en modern central med dagens säkerhetsnivå. Bra utgångsläge."},{"id":"f_automat","rank":60,"when":{"sakringstyp":"automat"},"icon":"ok","text":"Du har automatsäkringar: vippknapparna du slår av och på, den moderna och säkra typen. Bra utgångsläge."},{"id":"f_jfb_ja","rank":61,"when":{"jordfelsbrytare":"ja"},"icon":"ok","text":"Jordfelsbrytare finns: det viktigaste personskyddet i en modern central, som bryter strömmen blixtsnabbt vid fel. Det är på plats hos dig."},{"id":"f_redo_marginal","rank":62,"when":{"ready_state":"redo_marginal"},"icon":"ok","text":"Huvudsäkringen räcker med marginal: du kan ladda elbilen samtidigt som hushållet drar ström, utan att det blir trångt om kapaciteten."},{"id":"f_inga_tecken","rank":65,"when":{"varningstecken_has":"inget"},"icon":"ok","text":"Inga varningstecken i vardagen: inga säkringar som löser ut, varma uttag eller flimrande lampor. Bra tecken."},{"id":"f_brand_lukt","rank":1,"when":{"varningstecken_has":"brand_lukt"},"icon":"warn","text":"Bränd lukt eller missfärgade uttag: det enda tecknet i kollen som alltid bör kontrolleras av en elektriker, oavsett resten av resultatet."}],"akut_notis":{"label":"Kontrollera detta först","text":"Du svarade att du känt bränd lukt eller sett missfärgade uttag. Det bör alltid kontrolleras av en elektriker, oavsett vad resten av kollen visar."},"facts":{"brand":{"text":"Elsäkerhetsverket registrerade 298 händelser 2018–2022 där elcentralen var orsaken. Villor och radhus är överrepresenterade.","source_pre":"Elsäkerhetsverket, rapporten ","source_link":"Elrelaterade bränder i bostäder 2018–2022","source_url":"https://www.elsakerhetsverket.se/om-oss/publikationer/rapporter/elrelaterade-brander-i-bostader-2018-2022/","source_post":"."}},"copy":{"findings_head":"Våra fynd","share_green_marginal":"Min elcentral är säker och redo för elbil. Testa din med Ampys Elcentral-kollen.","share_green":"Min elcentral fick grönt ljus i Ampys Elcentral-kollen. Testa din.","share_nudge_green":"Dela ditt gröna besked","pdf_capture":"Mejla mig rapporten som PDF, med en checklista att ta med när elektrikern kommer.","pdf_capture_green":"Vill du spara ditt gröna besked? Vi mejlar rapporten som PDF.","pdf_consent":"Jag godkänner att Ampy mejlar mig rapporten som PDF. Vi sparar din adress bara för det och du kan avsluta när du vill.","progress":"Fråga {n} av {total}","multi_aria":"Välj minst ett alternativ för att fortsätta.","share_neutral":"Jag testade min elcentral med Ampys Elcentral-kollen. Testa din."},"state_schema":{"order":["hus_alder","central_alder","sakringstyp","jordfelsbrytare","varningstecken","huvudsakring","planer"],"prefixes":{"hus_alder":"a","central_alder":"c","sakringstyp":"s","jordfelsbrytare":"j","varningstecken":"w","huvudsakring":"h","planer":"p"}}}
AMPYECJSON;
	$d = json_decode( $json, true );
	return is_array( $d ) ? $d : array();
}
function ampy_ec_get_data() {
	static $cached = null;
	if ( $cached !== null ) { return $cached; }
	$cached = ampy_ec_baked_data();
	return $cached;
}

/* Strip internal keys (prefix "_", e.g. _pending_signoff, _note, _reviewed_by)
   recursively before the data is sent to the client - keeps internal docs and
   the sign-off intent out of the public JS payload. */
function ampy_ec_strip_internal( $node ) {
	if ( ! is_array( $node ) ) { return $node; }
	$out = array();
	foreach ( $node as $k => $v ) {
		if ( is_string( $k ) && isset( $k[0] ) && '_' === $k[0] ) { continue; }
		$out[ $k ] = ampy_ec_strip_internal( $v );
	}
	return $out;
}

/* ==========================================================================
   2. CRAWLABLE MOUNT  (server-rendered fallback; JS removes .ampy-ec__noscript)
   The fallback is NOT a computed verdict (the engine is JS-only). Crawlers and
   no-JS visitors get the value prop, the questions as text, and the service links.
   ========================================================================== */
function ampy_ec_render_mount( $data ) {
	$heading  = isset( $data['meta']['page_heading'] ) ? $data['meta']['page_heading'] : 'Ar din elcentral saker och redo?';
	$lead     = isset( $data['meta']['page_lead'] ) ? $data['meta']['page_lead'] : '';
	$disc     = isset( $data['meta']['disclaimer'] ) ? $data['meta']['disclaimer'] : '';
	$services = isset( $data['meta']['service_pages'] ) ? $data['meta']['service_pages'] : array();
	$qs       = isset( $data['questions'] ) ? $data['questions'] : array();

	$service_labels = array(
		'elbesiktning'    => 'Elbesiktning',
		'centralbyte'     => 'Byta elcentral',
		'jordfelsbrytare' => 'Installera jordfelsbrytare',
		'lastbalansering' => 'Lastbalansering',
		'uppsakring'      => 'Uppsakring (oka huvudsakringen)',
	);

	ob_start();
	?>
	<div class="ampy-ec" lang="sv">
		<div class="ampy-ec__noscript">
			<div class="ampy-ec__block">
				<p><strong><?php echo esc_html( $lead ); ?></strong></p>
				<p>Elcentral-kollen staller nagra snabba fragor om din elcentral och ger ett besked pa tva axlar: <strong>Saker?</strong> och <strong>Redo?</strong> Fragorna:</p>
				<ol>
					<?php foreach ( $qs as $q ) : ?>
						<li><?php echo esc_html( isset( $q['title'] ) ? $q['title'] : '' ); ?></li>
					<?php endforeach; ?>
				</ol>
				<p>Vill du ga vidare direkt? Las om vara tjanster:</p>
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

/* ==========================================================================
   3. SHORTCODE  [elcentralkollen]  (optional embed="..." preset)
   The tool carries its own H1 + lead (rail panel + the noscript above), so do
   NOT add a duplicate heading in Bricks above the shortcode. Data is injected
   inline (replaces wp_localize_script); the engine reads window.AmpyEC.data.
   ========================================================================== */
function ampy_ec_shortcode( $atts = array() ) {
	$atts = shortcode_atts( array( 'embed' => '' ), $atts, 'elcentralkollen' );
	$data = ampy_ec_get_data();
	if ( ! $data ) {
		return '<p>Elcentral-kollen kunde inte laddas (saknad eller skadad datafil).</p>';
	}

	// Rail copy comes from the post's custom fields; baked values stay the fallback.
	$data = ampy_ec_apply_hero_fields( $data );

	$payload = wp_json_encode( ampy_ec_strip_internal( $data ) );
	$rest    = wp_json_encode( esc_url_raw( rest_url( 'ampy-ec/v1/lead' ) ) );
	$pdf     = wp_json_encode( esc_url_raw( rest_url( 'ampy-ec/v1/pdf' ) ) );
	$nonce   = wp_json_encode( wp_create_nonce( 'wp_rest' ) );
	$embed   = wp_json_encode( sanitize_key( $atts['embed'] ) );

	// The browser never sees the webhook URLs. It only learns whether each flow is
	// configured (so it can show/hide the PDF capture and simulate success in
	// preview), then submits to the WP REST endpoints which deliver server-side.
	$lead_on = wp_json_encode( (bool) get_post_meta( AMPY_EC_POST_ID, '_ampy_ec_lead_webhook_url', true ) );
	$pdf_on  = wp_json_encode( (bool) get_post_meta( AMPY_EC_POST_ID, '_ampy_ec_pdf_webhook_url',  true ) );

	$script  = '<script>window.AmpyEC=window.AmpyEC||{};'
	         . 'window.AmpyEC.data='        . $payload . ';'
	         . 'window.AmpyEC.restUrl='     . $rest    . ';'
	         . 'window.AmpyEC.pdfUrl='      . $pdf     . ';'
	         . 'window.AmpyEC.restNonce='   . $nonce   . ';'
	         . 'window.AmpyEC.leadEnabled=' . $lead_on . ';'
	         . 'window.AmpyEC.pdfEnabled='  . $pdf_on  . ';'
	         . 'window.AmpyEC.embed='       . $embed   . ';</script>';

	return $script . ampy_ec_render_mount( $data );
}
add_shortcode( 'elcentralkollen', 'ampy_ec_shortcode' );

/* ==========================================================================
   4. DYNAMIC OG META  (neutral / branded, intentionally NOT per-cell)
   A personal "Saker / Redo" card could unfurl alarmistically in a Facebook
   house group; the personal card is the in-tool downloadable share card instead.
   Drop assets/og/elcentral-kollen.png (1200x630) at the uploads path below.
   ========================================================================== */
function ampy_ec_dynamic_og() {
	$data = ampy_ec_get_data();
	if ( ! $data ) { return; }
	if ( ! is_singular() && ! is_page() ) { return; }
	$post = get_post();
	if ( ! $post ) { return; }
	if ( ! has_shortcode( (string) $post->post_content, 'elcentralkollen' ) ) {
		// Bricks stores page content in postmeta (_bricks_page_content_2), not post_content.
		$bricks = get_post_meta( $post->ID, '_bricks_page_content_2', true );
		if ( ! ( is_string( $bricks ) && strpos( $bricks, 'elcentralkollen' ) !== false ) ) { return; }
	}

	$title = isset( $data['meta']['page_heading'] ) ? $data['meta']['page_heading'] . ' | Ampy' : 'Elcentral-kollen | Ampy';
	$desc  = isset( $data['meta']['page_lead'] ) ? $data['meta']['page_lead'] : '';
	$img   = home_url( '/wp-content/uploads/elcentral/og/elcentral-kollen.png' );
	$has   = file_exists( WP_CONTENT_DIR . '/uploads/elcentral/og/elcentral-kollen.png' );

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


/* ==========================================================================
   5. SETTINGS METABOX  (post editor, lead-magnet post AMPY_EC_POST_ID)
   Webhook URLs + fallback email live on the post, never in wp-admin Settings
   and never sent to the browser. Mirrors EV/Battery/LED.
   ========================================================================== */
add_action( 'add_meta_boxes', function ( $post_type, $post ) {
	if ( $post_type !== 'lead-magnet' ) { return; }
	if ( AMPY_EC_POST_ID > 0 && (int) $post->ID !== (int) AMPY_EC_POST_ID ) { return; }
	add_meta_box( 'ampy_ec_settings', 'Elcentral-kollen - Settings', 'ampy_ec_render_metabox', 'lead-magnet', 'normal', 'high' );
}, 10, 2 );

function ampy_ec_render_metabox( WP_Post $post ): void {
	wp_nonce_field( 'ampy_ec_save_' . $post->ID, '_ampy_ec_nonce' );
	$lead_hook    = (string) get_post_meta( $post->ID, '_ampy_ec_lead_webhook_url', true );
	$pdf_hook     = (string) get_post_meta( $post->ID, '_ampy_ec_pdf_webhook_url',  true );
	$notify_email = (string) get_post_meta( $post->ID, '_ampy_ec_notify_email',     true );
	$fails        = (int) get_post_meta( $post->ID, '_ampy_ec_delivery_failures',   true );
	$last_err     = (string) get_post_meta( $post->ID, '_ampy_ec_last_delivery_error', true );
	echo '<p style="color:#666;margin:0 0 12px;">Offertförfrågan och PDF-rapport levereras server-side till dessa n8n/Make-webhookar. URL:erna lämnar aldrig servern. Lämna tomt för att stänga av respektive flöde.</p>';
	echo '<p><label style="display:block;font-weight:600;margin-bottom:4px;">Lead-webhook (n8n/Make)</label>';
	echo '<input type="url" name="ampy_ec_lead_webhook_url" value="' . esc_attr( $lead_hook ) . '" placeholder="https://your-n8n.com/webhook/..." style="width:100%;font-family:monospace;"></p>';
	echo '<p><label style="display:block;font-weight:600;margin-bottom:4px;">PDF-webhook (rapport via e-post)</label>';
	echo '<input type="url" name="ampy_ec_pdf_webhook_url" value="' . esc_attr( $pdf_hook ) . '" placeholder="https://your-n8n.com/webhook/..." style="width:100%;font-family:monospace;"></p>';
	echo '<p><label style="display:block;font-weight:600;margin-bottom:4px;">Reserv-e-post (fallback)</label>';
	echo '<input type="email" name="ampy_ec_notify_email" value="' . esc_attr( $notify_email ) . '" placeholder="' . esc_attr( get_option( 'admin_email' ) ) . '" style="width:100%;"></p>';
	echo '<p style="color:#888;font-size:12px;">Reserv-e-post används om lead-webhooken är tom eller inte svarar 2xx. Tom = webbplatsens admin-e-post.</p>';
	if ( $fails > 0 ) {
		echo '<p style="color:#b91c1c;font-size:12px;">Senaste leveransproblem (' . (int) $fails . '): ' . esc_html( $last_err ) . '</p>';
	}
}

add_action( 'save_post_lead-magnet', function ( int $post_id, WP_Post $post, bool $update ): void {
	if ( AMPY_EC_POST_ID > 0 && $post_id !== (int) AMPY_EC_POST_ID ) { return; }
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) { return; }
	if ( ! isset( $_POST['_ampy_ec_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['_ampy_ec_nonce'] ), 'ampy_ec_save_' . $post_id ) ) { return; }
	if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }
	update_post_meta( $post_id, '_ampy_ec_lead_webhook_url', esc_url_raw( wp_unslash( $_POST['ampy_ec_lead_webhook_url'] ?? '' ) ) );
	update_post_meta( $post_id, '_ampy_ec_pdf_webhook_url',  esc_url_raw( wp_unslash( $_POST['ampy_ec_pdf_webhook_url']  ?? '' ) ) );
	update_post_meta( $post_id, '_ampy_ec_notify_email',     sanitize_email( wp_unslash( $_POST['ampy_ec_notify_email'] ?? '' ) ) );
}, 10, 3 );


/* ==========================================================================
   6. REST  (server-side delivery; the browser only ever talks to WP)
   /lead  - offertförfrågan: webhook primary, email fallback, success only on
            durable delivery.
   /pdf   - rapport-capture: posts e-post + resultat to the PDF webhook.
   Both read their target from AMPY_EC_POST_ID's meta, so the URL stays private.
   ========================================================================== */
add_action( 'rest_api_init', function () {
	register_rest_route( 'ampy-ec/v1', '/lead', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ampy_ec_handle_lead',
		'permission_callback' => function ( $request ) {
			return (bool) wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' );
		},
	) );
	register_rest_route( 'ampy-ec/v1', '/pdf', array(
		'methods'             => WP_REST_Server::CREATABLE,
		'callback'            => 'ampy_ec_handle_pdf',
		'permission_callback' => function ( $request ) {
			return (bool) wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' );
		},
	) );
} );

function ampy_ec_handle_lead( WP_REST_Request $request ) {
	// Honeypot.
	if ( ! empty( $request->get_param( 'webbplats' ) ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}
	$namn       = sanitize_text_field( (string) $request->get_param( 'namn' ) );
	$epost      = sanitize_text_field( (string) $request->get_param( 'epost' ) );
	$telefon    = sanitize_text_field( (string) $request->get_param( 'telefon' ) );
	$postnummer = preg_replace( '/[^0-9]/', '', (string) $request->get_param( 'postnummer' ) );
	$cell       = sanitize_text_field( (string) $request->get_param( 'cell' ) );
	$vector     = sanitize_text_field( (string) $request->get_param( 'vector' ) );
	$samtycke   = (bool) $request->get_param( 'samtycke' );

	if ( ! $namn || ! $epost || ! $telefon || ! $postnummer ) {
		return new WP_Error( 'ampy_ec_missing', 'Fyll i alla fält.', array( 'status' => 400 ) );
	}
	if ( ! $samtycke ) {
		return new WP_Error( 'ampy_ec_consent', 'Vi behöver ditt samtycke.', array( 'status' => 400 ) );
	}
	if ( ! is_email( $epost ) ) {
		return new WP_Error( 'ampy_ec_epost', 'Ange en giltig e-postadress.', array( 'status' => 400 ) );
	}

	$payload = array(
		'tool'       => 'elcentral',
		'cell'       => $cell,
		'vector'     => $vector,
		'namn'       => $namn,
		'epost'      => $epost,
		'telefon'    => $telefon,
		'postnummer' => $postnummer,
		'samtycke'   => true,
		'ip'         => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
		'tid'        => current_time( 'mysql' ),
	);

	$webhook_url  = (string) get_post_meta( AMPY_EC_POST_ID, '_ampy_ec_lead_webhook_url', true );
	$notify_email = sanitize_email( (string) get_post_meta( AMPY_EC_POST_ID, '_ampy_ec_notify_email', true ) );
	if ( ! $notify_email || ! is_email( $notify_email ) ) { $notify_email = get_option( 'admin_email' ); }

	$delivered = false; $via = 'none'; $note = '';

	if ( $webhook_url ) {
		$resp = wp_remote_post( $webhook_url, array(
			'headers' => array( 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( $payload ),
			'timeout' => 8, 'blocking' => true, 'data_format' => 'body',
		) );
		if ( is_wp_error( $resp ) ) {
			$note = 'webhook WP_Error: ' . $resp->get_error_message();
		} else {
			$code = (int) wp_remote_retrieve_response_code( $resp );
			if ( $code >= 200 && $code < 300 ) { $delivered = true; $via = 'webhook'; }
			else { $note = 'webhook HTTP ' . $code; }
		}
	}
	if ( ! $delivered ) {
		$subject = sprintf( '[Elcentral-kollen] Lead: %s', strtoupper( $cell ?: '-' ) );
		$body = sprintf(
			"Ny offertförfrågan via Elcentral-kollen\n\nResultat: %s\nVector: %s\n\nNamn: %s\nE-post: %s\nTelefon: %s\nPostnummer: %s\n\nIP: %s\nTid: %s",
			$cell ?: '-', $vector ?: '-', $namn, $epost, $telefon ?: '-', $postnummer ?: '-', $payload['ip'] ?: '-', $payload['tid']
		);
		if ( wp_mail( $notify_email, $subject, $body ) ) {
			$delivered = true; $via = ( $note !== '' ) ? 'email_fallback' : 'email';
		} else {
			$note = trim( $note . ' | wp_mail failed' );
		}
	}

	do_action( 'ampy_ec_lead_received', $payload + array( 'delivery' => array( 'ok' => $delivered, 'via' => $via ) ) );

	if ( ! $delivered ) {
		$fails = (int) get_post_meta( AMPY_EC_POST_ID, '_ampy_ec_delivery_failures', true );
		update_post_meta( AMPY_EC_POST_ID, '_ampy_ec_delivery_failures', $fails + 1 );
		update_post_meta( AMPY_EC_POST_ID, '_ampy_ec_last_delivery_error', $note ?: 'no channel configured' );
		error_log( 'AMPY_EC LEAD (undelivered: ' . ( $note ?: 'no channel' ) . ') epost=' . $epost . ' tid=' . $payload['tid'] );
		return new WP_Error( 'ampy_ec_deliver', 'Något gick fel. Ring oss på 010-265 79 79 så hjälper vi dig.', array( 'status' => 502 ) );
	}
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}

function ampy_ec_handle_pdf( WP_REST_Request $request ) {
	if ( ! empty( $request->get_param( 'webbplats' ) ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}
	$epost    = sanitize_text_field( (string) $request->get_param( 'epost' ) );
	$cell     = sanitize_text_field( (string) $request->get_param( 'cell' ) );
	$vector   = sanitize_text_field( (string) $request->get_param( 'vector' ) );
	$samtycke = (bool) $request->get_param( 'samtycke' );
	if ( ! $epost || ! is_email( $epost ) ) {
		return new WP_Error( 'ampy_ec_epost', 'Ange en giltig e-postadress.', array( 'status' => 400 ) );
	}
	if ( ! $samtycke ) {
		return new WP_Error( 'ampy_ec_consent', 'Vi behöver ditt samtycke.', array( 'status' => 400 ) );
	}
	$webhook_url = (string) get_post_meta( AMPY_EC_POST_ID, '_ampy_ec_pdf_webhook_url', true );
	if ( ! $webhook_url ) {
		return new WP_Error( 'ampy_ec_pdf_off', 'PDF-utskick är inte aktiverat.', array( 'status' => 503 ) );
	}
	$resp = wp_remote_post( $webhook_url, array(
		'headers' => array( 'Content-Type' => 'application/json' ),
		'body'    => wp_json_encode( array(
			'tool' => 'elcentral', 'epost' => $epost, 'cell' => $cell, 'vector' => $vector,
			'samtycke' => true, 'tid' => current_time( 'mysql' ),
		) ),
		'timeout' => 8, 'blocking' => true, 'data_format' => 'body',
	) );
	if ( is_wp_error( $resp ) ) {
		return new WP_Error( 'ampy_ec_pdf_send', 'Kunde inte skicka just nu. Försök igen om en stund.', array( 'status' => 502 ) );
	}
	$code = (int) wp_remote_retrieve_response_code( $resp );
	if ( $code < 200 || $code >= 300 ) {
		return new WP_Error( 'ampy_ec_pdf_send', 'Kunde inte skicka just nu. Försök igen om en stund.', array( 'status' => 502 ) );
	}
	return new WP_REST_Response( array( 'ok' => true ), 200 );
}


/* ==========================================================================
   SHARED LEAD-MAGNET HERO HELPERS
   --------------------------------------------------------------------------
   Defined once and reused by Elkollen and Elcentral-kollen. Guarded, so it does
   not matter which snippet FluentSnippets loads first.

   Content model (nothing existing was re-keyed, nothing is lost):
     hero_heading   text      - already live, SCF group "Hero"
     hero_text      wysiwyg   - already live, SCF group "Hero"
     list_items     repeater  - already live, SCF group "Lead Magnet List Items"
                                 sub-fields: icon (image), text (wysiwyg)
     lm_cta_*       NEW       - registered below, so the two buttons stop being
                                 hard-coded in Bricks
   Every read falls back to the prototype's own string, so an empty field renders
   the prototype rather than a blank.
   ========================================================================== */

if ( ! function_exists( 'ampy_lm_source_id' ) ) {
/** Prefer the post being viewed when it carries hero copy, else the tool's own
 *  lead-magnet post. Keeps working when the tool is embedded on a service page. */
function ampy_lm_source_id( int $fallback ): int {
    /* Only a lead-magnet post may act as the source. `hero_heading` also exists on
       service / elektriker-i / eljour-i / elinstallation-i / laddbox-i /
       elektriker-for-x, so without this guard a tool embedded on a service page
       would take THAT page's hero heading, while its bullets and buttons (which
       only exist on lead-magnet) fell back to the prototype defaults. Mixed copy.
       The tool's own lead-magnet post is always the fallback. */
    $here = (int) get_the_ID();
    if ( $here && get_post_type( $here ) === 'lead-magnet' && function_exists( 'get_field' ) ) {
        $v = get_field( 'hero_heading', $here );
        if ( is_string( $v ) && trim( $v ) !== '' ) return $here;
    }
    return $fallback;
}}

if ( ! function_exists( 'ampy_lm_text' ) ) {
/** Plain-text field with a hard default. */
function ampy_lm_text( string $name, int $post_id, string $default = '' ): string {
    $v = function_exists( 'get_field' ) ? get_field( $name, $post_id ) : '';
    if ( ! is_scalar( $v ) || trim( (string) $v ) === '' ) {
        $v = get_post_meta( $post_id, $name, true );
    }
    if ( ! is_scalar( $v ) || trim( (string) $v ) === '' ) return $default;
    return trim( (string) $v );
}}

if ( ! function_exists( 'ampy_lm_rich' ) ) {
/** Rich-text field, sanitised, with a single wrapping <p> removed so the value can
 *  sit inside the prototype's own <p>. Returns plain text when $strip is true. */
function ampy_lm_rich( string $name, int $post_id, string $default = '', bool $strip = false ): string {
    $v = function_exists( 'get_field' ) ? get_field( $name, $post_id ) : '';
    if ( ! is_scalar( $v ) || trim( (string) $v ) === '' ) $v = get_post_meta( $post_id, $name, true );
    $html = is_scalar( $v ) ? trim( (string) $v ) : '';
    if ( $html === '' ) $html = $default;
    if ( $html === '' ) return '';
    if ( $strip ) return trim( wp_strip_all_tags( $html ) );
    $html = wp_kses_post( $html );
    if ( preg_match( '#^<p[^>]*>(.*)</p>$#is', $html, $m ) && stripos( $m[1], '<p' ) === false ) {
        $html = $m[1];
    }
    return $html;
}}

if ( ! function_exists( 'ampy_lm_icon' ) ) {
/** Icon for a hero bullet. An SVG chosen in the media library is inlined so it
 *  inherits currentColor exactly like the prototype's own icons; any other image
 *  becomes a 20x20 <img>. With no icon set you get the prototype's icon back. */
function ampy_lm_icon( $icon, string $fallback_svg ): string {
    $id = 0;
    if ( is_array( $icon ) )      $id = (int) ( $icon['ID'] ?? $icon['id'] ?? 0 );
    elseif ( is_numeric( $icon ) ) $id = (int) $icon;
    if ( ! $id ) return $fallback_svg;

    if ( get_post_mime_type( $id ) === 'image/svg+xml' ) {
        $file = get_attached_file( $id );
        if ( $file && file_exists( $file ) && filesize( $file ) < 51200 ) {
            $svg = (string) file_get_contents( $file );
            $svg = preg_replace( '#<\?xml.*?\?>#is', '', $svg );
            $svg = preg_replace( '#<!DOCTYPE.*?>#is', '', $svg );
            $svg = preg_replace( '#<!--.*?-->#s', '', $svg );
            $svg = preg_replace( '#<script.*?</script>#is', '', $svg );          // never inline script
            $svg = preg_replace( '#\son\w+\s*=\s*("[^"]*"|\x27[^\x27]*\x27)#i', '', $svg ); // strip handlers
            $svg = trim( (string) $svg );
            if ( stripos( $svg, '<svg' ) === 0 ) return $svg;
        }
    }
    $url = wp_get_attachment_image_url( $id, 'thumbnail' );
    if ( ! $url ) $url = wp_get_attachment_url( $id );
    if ( $url ) return '<img src="' . esc_url( $url ) . '" alt="" width="20" height="20" loading="lazy" decoding="async">';
    return $fallback_svg;
}}

if ( ! function_exists( 'ampy_lm_bullets' ) ) {
/** The `list_items` repeater, merged over the prototype's defaults.
 *  $defaults = [ [ 'svg' => '<svg…>', 'text' => '…' ], … ] */
function ampy_lm_bullets( int $post_id, array $defaults ): array {
    $rows = function_exists( 'get_field' ) ? get_field( 'list_items', $post_id ) : null;
    if ( ! is_array( $rows ) || ! $rows ) return $defaults;

    $out = array();
    foreach ( $rows as $i => $row ) {
        $text = isset( $row['text'] ) ? trim( wp_strip_all_tags( (string) $row['text'] ) ) : '';
        if ( $text === '' ) continue;
        $fallback = $defaults[ $i ]['svg'] ?? ( $defaults[0]['svg'] ?? '' );
        $out[] = array(
            'svg'  => ampy_lm_icon( $row['icon'] ?? 0, $fallback ),
            'text' => $text,
        );
    }
    return $out ? $out : $defaults;
}}

if ( ! function_exists( 'ampy_lm_cta' ) ) {
/** The two hero buttons. Text and links are fields; the SVGs are the design's. */
function ampy_lm_cta( int $post_id ): array {
    $phone_opt = function_exists( 'get_field' ) ? get_field( 'site_phone_number_local', 'option' ) : '';
    $phone_lbl = ( is_string( $phone_opt ) && trim( $phone_opt ) !== '' ) ? trim( $phone_opt ) : '010-265 79 79';
    return array(
        'primary_text' => ampy_lm_text( 'lm_cta_primary_text', $post_id, 'Kontakta oss' ),
        'primary_url'  => ampy_lm_text( 'lm_cta_primary_url',  $post_id, 'https://ampy.se/offert/' ),
        'phone_text'   => ampy_lm_text( 'lm_cta_phone_text',   $post_id, $phone_lbl ),
        'phone_url'    => ampy_lm_text( 'lm_cta_phone_url',    $post_id, 'tel:+46102657979' ),
    );
}}

if ( ! function_exists( 'ampy_lm_register_cta_fields' ) ) {
/** The two CTA buttons were hard-coded in Bricks. Register them as real fields so
 *  they can be edited in wp-admin. Existing groups (Hero, Lead Magnet List Items)
 *  are NOT touched: this is an additional local group, so no saved value is lost. */
function ampy_lm_register_cta_fields() {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) return;
    $mk = function ( $name, $label, $default, $ph = '' ) {
        return array(
            'key'           => 'field_' . $name,
            'label'         => $label,
            'name'          => $name,
            'type'          => 'text',
            'default_value' => $default,
            'placeholder'   => $ph ?: $default,
            'allow_in_bindings' => 1,
        );
    };
    acf_add_local_field_group( array(
        'key'    => 'group_ampy_lm_cta',
        'title'  => 'Lead magnet - hero buttons',
        'fields' => array(
            $mk( 'lm_cta_primary_text', 'Primary button label', 'Kontakta oss' ),
            $mk( 'lm_cta_primary_url',  'Primary button link',  'https://ampy.se/offert/' ),
            $mk( 'lm_cta_phone_text',   'Phone button label',   '010-265 79 79' ),
            $mk( 'lm_cta_phone_url',    'Phone button link',    'tel:+46102657979' ),
        ),
        'location' => array( array(
            array( 'param' => 'post_type', 'operator' => '==', 'value' => 'lead-magnet' ),
            array( 'param' => 'post',      'operator' => '!=', 'value' => '59306' ), // Eljour has its own copy group
        ) ),
        'menu_order'      => 5,
        'position'        => 'normal',
        'style'           => 'default',
        'label_placement' => 'top',
        'active'          => true,
    ) );
}
add_action( 'acf/init', 'ampy_lm_register_cta_fields' );
}


/* ==========================================================================
   ELCENTRAL HERO  -  the rail is data-driven, so we simply feed it the fields
   --------------------------------------------------------------------------
   renderRail() in the engine reads data.meta.page_heading, data.meta.page_lead
   and data.meta.rail.{bullets,contact}. Overriding those here means the rail is
   the prototype's exact DOM, with copy editable in wp-admin. The baked values
   remain the fallback for every key, so an empty field renders the prototype.

   NOTE on bullet icons: the engine draws them from a named icon set
   (check / shield / checkCircle / ...), not from an uploaded image, so the
   `icon` sub-field of `list_items` is ignored here and the design's own icon at
   that position is used. Only the bullet TEXT is editable.
   ========================================================================== */
if ( ! function_exists( 'ampy_ec_apply_hero_fields' ) ) {
function ampy_ec_apply_hero_fields( array $data ): array {
	if ( empty( $data['meta'] ) || ! is_array( $data['meta'] ) ) return $data;

	$pid  = ampy_lm_source_id( AMPY_EC_POST_ID );
	$meta = $data['meta'];

	$meta['page_heading'] = ampy_lm_text( 'hero_heading', $pid, (string) ( $meta['page_heading'] ?? '' ) );
	$meta['page_lead']    = ampy_lm_rich( 'hero_text',    $pid, (string) ( $meta['page_lead'] ?? '' ), true ); // rail lead is a text node

	$rail  = isset( $meta['rail'] ) && is_array( $meta['rail'] ) ? $meta['rail'] : array();
	$baked = isset( $rail['bullets'] ) && is_array( $rail['bullets'] ) ? $rail['bullets'] : array();

	$rows = function_exists( 'get_field' ) ? get_field( 'list_items', $pid ) : null;
	if ( is_array( $rows ) && $rows ) {
		$bullets = array();
		foreach ( $rows as $i => $row ) {
			$text = isset( $row['text'] ) ? trim( wp_strip_all_tags( (string) $row['text'] ) ) : '';
			if ( $text === '' ) continue;
			$b = array(
				'icon' => (string) ( $baked[ $i ]['icon'] ?? 'check' ),
				'text' => $text,
			);
			if ( ! empty( $baked[ $i ]['link'] ) ) $b['link'] = $baked[ $i ]['link'];
			$bullets[] = $b;
		}
		if ( $bullets ) $rail['bullets'] = $bullets;
	}

	$cta     = ampy_lm_cta( $pid );
	$contact = isset( $rail['contact'] ) && is_array( $rail['contact'] ) ? $rail['contact'] : array();
	$rail['contact'] = array_merge( $contact, array(
		'contact_label' => $cta['primary_text'],
		'contact_url'   => $cta['primary_url'],
		'phone_label'   => $cta['phone_text'],
		'phone_url'     => $cta['phone_url'],
	) );

	$meta['rail']  = $rail;
	$data['meta']  = $meta;
	return $data;
}}