# WordPress (live) — Elcentral-kollen

The **deployed** WordPress FluentSnippets version of this tool, live on
https://ampy.se/ampy-elcentral-kollen/ (Ampy · Bricks + FluentSnippets). These are the exact snippet files in
`wp-content/fluent-snippet-storage/` on the production server, with the WP adaptations layered on
the standalone source in this repo: CSS scoped to the tool wrapper + self-hosted fonts, a
server-side (nonce/honeypot-gated) REST lead route with the webhook kept in post meta, backend
editability via a settings metabox and/or ACF fields, and conditional asset loading.

Snippets (see each PHP header for `@type` / `@run_at` / shortcode / post-meta keys):
- 45-ampy-elcentral-kollen.php
- 46-ampy-elcentral-kollen.php
- 47-ampy-elcentral-kollen.php
