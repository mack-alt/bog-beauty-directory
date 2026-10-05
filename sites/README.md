# Sample shop sites

One-page sample sites for shop owners. They are not part of the directory. Each page is `noindex, nofollow`. The page build keeps `/sites/` out of `sitemap.xml` and `llms.txt`, and `robots.txt` disallows `/bog-beauty-directory/sites/`. Do not link a sample site from the directory.

Shared layout: `template/site.css` and `template/site.js`. Each shop is a folder with `index.html` and `site.json`.

To add a shop, follow [docs/new-shop-in-15-minutes.md](../docs/new-shop-in-15-minutes.md).

## Offers and photos

Put an offer in `site.json` only when it is printed on the card or already checked in public. Set `offerConfirmed` to `true` for those. If it is not confirmed, leave `offerConfirmed` off. The page shows a Sample label.

Prices, reviews, and rewards you cannot check stay off the page. An empty service price is shown as “ask for price.” Photos that are not of this shop stay labeled Sample.

### Queenie Nails & Spa

The card is a 10-circle loyalty stamp card. No reward is printed on it. The page does not say “10th visit free.” Source: `listings.json` id 19 (`offer`) and `shops/19.json` (`internalNote`).

### Kim's Lashes Beauty Salon

“Gift cards available” is on the card. No promo or loyalty reward for this Renton address was found in public, so the page does not invent one.

### Fancy Nails

Test shop built from `shops/17.json` and `listings.json` id 17, then checked against the card. The card adds “North Benson Fred Meyer Shopping Center.” That record has no offer and no service prices, so the page does not add them.

### Jerry's Barbershop

Private preview from the card and `shops/16.json`. Hours and the three printed lines are on the page. A handwritten margin note is not.

### HT Nail Bar

Private preview for 331 Strander Blvd, from the card and `shops/20.json`. Hours are not printed. The card’s second location is shown as a line under the name. Call and Directions stay on Strander.
