# Sample shop sites

These are one-page sample websites Kenny can show a shop owner. They are not part of the directory.

Each site is a folder with `index.html` and `site.json`. Shared layout and wording live in `template/`. The page is `noindex`. The page build keeps `/sites/` out of `sitemap.xml` and `llms.txt`. Do not link a sample site from the directory.

## Add a shop

1. Copy `sites/queenie-nails-and-spa/` to `sites/<slug>/`.
2. Edit `site.json`: name, tagline, phone, address, hours, services, and the Google Maps search link. Leave `look` off for the light salon layout. Set `"look": "ink"` for the dark studio layout.
3. Leave a service `price` as `""` when the price is not verified. The page shows “ask for price.”
4. Write a `SOURCES.md` in that folder naming the source for each fact.
5. Use only free Unsplash or Pexels photos, and keep the “Sample photo” tag. Do not use a photo of a person from the shop’s card.

Shop names, addresses, hours, and service names stay as written in `site.json`. Language chips translate the buttons and section labels only.
