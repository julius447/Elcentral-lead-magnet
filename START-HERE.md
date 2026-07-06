# Elcentral-kollen — complete package (READ FIRST)

This is the full, current handover for the **Elcentral-kollen** lead magnet (v2.16.5) — the
two-axis diagnostic "Är din elcentral säker och redo?" (*Is your electrical panel safe and ready?*).

> **Language:** all documentation and code comments are in English. The **UI strings are Swedish
> by design** — they are the customer-facing product copy and must stay Swedish.

## Where do I go?

| I want to… | Open |
|---|---|
| **Implement it in Bricks / WordPress (this is Chris's path)** | **`fluent-snippets/`** → start with its `README.md`. Three files (CSS / PHP / JS) to paste into FluentSnippets, plus `[elcentralkollen]` in Bricks. A verified 1:1. |
| Give instructions to an AI agent (Claude) working in the code | `CLAUDE.md` |
| Read the human developer guide (plugin version) | `README.md` |
| Understand the product / scoring / archetype contract | `docs/SPEC.md` |
| See the launch checklist + architecture | `docs/CHECKLIST.md`, `docs/HANDOVER.md`, `docs/DESIGN.md` |
| See the sources behind the claims | `research/FACTS.md` |

## Two ways to run the same tool (pick ONE)

- **A) FluentSnippets (recommended for you)** — `fluent-snippets/`. Theme-independent, no plugin.
  This is what Chris asked for.
- **B) WordPress plugin** — the rest of the folder (`elcentral-kollen.php`, `includes/`, `assets/`,
  `data/`). The same tool packaged as an installable plugin. Use A *or* B, not both.

Both are the exact same design and behaviour (1:1). `fluent-snippets/` is built reproducibly from
the plugin source via `fluent-snippets/_build/build.py`.

## Remaining configuration before going live (same for A and B)
1. **Lead webhook** — `meta.lead_webhook_url` is `null` → the form drops leads. Set an n8n/Make URL.
   (In FluentSnippets the data lives in the PHP snippet; in the plugin it's `data/elcentralkollen-data.json`.)
2. **Fonts** — move the 4 woff2 to the ampy.se Media Library (GDPR). See `fluent-snippets/README.md`.
3. **Analytics** — wire GTM/GA4 + Meta pixel to the `ampy_ec_*` dataLayer events.
4. **OG image**, **`php -l` on staging**, **electrician sign-off** (`docs/CHECKLIST.md`).

## Canonical source
GitHub: **https://github.com/julius447/Elcentral-lead-magnet** (branch `main`). This folder is a
snapshot — for changes, edit in the repo and regenerate `fluent-snippets/` with the build script.
