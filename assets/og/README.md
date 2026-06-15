# Open Graph-bild

Lägg den ägar-godkända delningsbilden här:

- **Filnamn:** `elcentral-kollen.png` (exakt — PHP:en pekar på just detta namn)
- **Mått:** 1200 × 630 px
- **Stil:** neutral och varumärkt (AVSIKTLIGT inte per-cell/personlig — en personlig
  "Säker ✓ / Redo ✗"-bild kan unfurla alarmistiskt i en husägargrupp och underminera
  ärlighetsmoaten). Det personliga kortet bärs av det native-delade canvas-kortet i verktyget.

PHP:en (`elcentral-kollen.php` → `ampy_ec_dynamic_og()`) skriver `og:image` + `twitter:image`
FÖRST när filen finns (`file_exists`-grind), så det är säkert att deploya utan bilden — men
sociala unfurls får ingen bild förrän den läggs in. Verifiera i Facebook Sharing Debugger
efter att filen lagts in.
