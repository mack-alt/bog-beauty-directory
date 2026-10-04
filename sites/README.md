# Sample shop sites

These are one-page sample websites Kenny can show a shop owner. They are not part of the directory.

Each site is a folder with `index.html` and `site.json`. Shared layout and wording live in `template/`. The page is `noindex`. The page build keeps `/sites/` out of `sitemap.xml` and `llms.txt`. Do not link a sample site from the directory.

## Add a shop

1. Copy `sites/queenie-nails-and-spa/` to `sites/<slug>/`.
2. Edit `site.json`: name, tagline, phone, address, hours, services, and the Google Maps search link. Set `accent` to that shop’s color.
3. Leave a service `price` as `""` when the price is not verified. The page shows “ask for price.”
4. Write a `SOURCES.md` in that folder naming the source for each fact.
5. Use only free Unsplash or Pexels photos, and keep the “Sample photo” tag. Do not use a photo of a person from the shop’s card.

Shop names, addresses, hours, and service names stay as written in `site.json`. Language chips translate the buttons and section labels only.

## Featured offer

The card under the hero reads `featuredOffer` in `site.json`:

- `title`
- `detail`
- `finePrint`
- `isSample`

Use a real offer only when it can be checked in public: a Google, Yelp, Booksy, Facebook, or Instagram post, the shop’s old website, or signage in a photo. Also allowed: the offer printed on the shop’s own card, when that card is already the source for the listing. Write the source in this file and in the shop’s `SOURCES.md`.

If no offer can be verified, leave the placeholder and set `isSample` to `true`. The page then shows a “Sample offer” tag. Do not write an invented reward with `isSample` set to `false`.

```json
"featuredOffer": {
  "title": "Your offer here — e.g. 10th visit free",
  "detail": "",
  "finePrint": "",
  "isSample": true
}
```

### Queenie Nails & Spa — verified

The shop’s card is a 10-circle loyalty stamp card. No reward is printed on it, and no public page states one, so the card does not say “10th visit free.” Source: `listings.json` id 19 (`offer`) and `shops/19.json` (`internalNote`).

### Kim's Lashes Beauty Salon — placeholder

No promo or loyalty reward for 17707 108th Ave SE #010, Renton was found on Google, Yelp, Booksy, Facebook, Instagram, or an old site. “Gift cards available” stays as its own line, from the shop’s card. The featured card is the sample placeholder.
