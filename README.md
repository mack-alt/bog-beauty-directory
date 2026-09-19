# Blades of Grass — Beauty Directory

Renton / South King County beauty directory (mobile-friendly).

## Canonical shop model

1. **Card snap** — basics live: name, phone, directions, hours if known.
2. **First unlock** — EN | VI | ES | ZH | KO | TH switch on every shop page (skeletons included). Chrome and action labels come from `i18n/phrases.json` via `t(key)`. Story / vibe body is never machine-translated; missing locale falls back to EN for that key only.
3. **Interview** — unlocks story / vibe and confirms links. Empty link slots stay reserved and hidden.
4. **Action row** — only real hrefs: Call, Text (`textFirst` prefers Text), Directions, Reviews on Google, Share, then Website / IG / Facebook / TikTok / Email / Booking / Yelp when filled and unlocked.
5. **SHELF** — contested enrichment stays hidden until Kenny unlocks a toggle. Scraped reels/stars stay off the free door.
6. **Point card** — owner VI/ES points are a separate product. Not this site.

Real shops never get invented URLs. `shops/12.json` (`11 Fingers and Toe`) is a **DEMO / TEMPLATE** only.

Form source: Google Sheet BOG Directory Form.
