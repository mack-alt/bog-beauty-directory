# New shop site in 15 minutes

One folder, one `site.json`. The HighLevel form URL goes in **`bookingUrl`**.

Leave `bookingUrl` as `""` until you have the real form link. Book still works: it scrolls to “Request a booking” and shows Call and Text. When you paste an `https` form URL, that section shows the form. The template adds `?shop_slug=` from the folder name. You do not type the slug into the file.

Example: folder `sites/fancy-nails/` sends `shop_slug=fancy-nails`.

## Steps

1. Photograph the business card (and a menu, if they hand you one). Read the name, phone, address, hours, and any offer printed on it.
2. Copy `sites/fancy-nails/` to `sites/<slug>/`. Use the directory slug when the shop is already listed, such as `fancy-nails` from `shops/17.json`.
3. Edit `site.json` (see the field list below). Change the `<title>` in `index.html` to the shop name. Leave `<meta name="robots" content="noindex">` as it is.
4. Publish to `main`. GitHub Pages serves the folder at `https://mack-alt.github.io/bog-beauty-directory/sites/<slug>/`.
5. On a phone, test Call, Text, Directions, and Book. Book should land on “Request a booking.” With `bookingUrl` empty, you see Call and Text. After you paste the form URL, you see the form, and a test submit should show up in HighLevel for that shop.

Do not link the sample from the directory. Do not add prices, reviews, ratings, or a reward that is not on the card.

## site.json

Required, from the card:

| Field | Example |
| --- | --- |
| `name` | `Fancy Nails` |
| `phone` | `(425) 235-8526` |
| `address` | `17919 108th Ave SE, Renton, WA 98055` |

Optional:

| Field | When to fill it |
| --- | --- |
| `hours` | The hours line from the card. A normal hyphen is fine: `Mon-Sat 9:30am-7:00pm; Sunday 10:00am-6:00pm`. If the card has no clock times, paste the words it does use, such as `We open 7 days a week`. |
| `tagline` | The short line from the card, if there is one. |
| `walkIns` | Only if the card says walk-ins or appointments. |
| `offer` | Only an offer printed on the card or already checked in public. |
| `offerConfirmed` | Set to `true` only when that offer is confirmed. If you leave it off, the page marks the offer Sample. |
| `services` | Service names only. Leave the price off. The page says “ask for price.” |
| `links` | A real `https` link, such as Instagram: `{ "label": "Instagram", "href": "https://..." }`. |
| `photos` | `{ "src": "...webp", "alt": "Sample photo of a manicure" }`. Stock photos stay labeled Sample. For a real photo of this shop, set `"sample": false` and write a real alt. |
| `accent` | A brand color from the card, like `#9c3d52`. Skip it to use the default. |
| `bookingUrl` | The HighLevel form URL (`https://...`). This is the only booking field. |

```json
{
  "name": "Shop name",
  "phone": "(425) 000-0000",
  "address": "Street, City, WA",
  "hours": "",
  "tagline": "",
  "offer": "",
  "photos": [],
  "bookingUrl": ""
}
```

## Nothing to configure

These work for every shop. Do not add fields for them.

- **Soft preview.** Open the page with `?variant=soft`. The default look is `?variant=bold` (or no query). Same shop, two looks.
- **Language.** The chip follows the phone language when we have that language (English, Vietnamese, Spanish, Chinese, Korean, Thai). A tap on a chip wins and is remembered.
- **Call now / Text us.** During open hours the main button says “Call now.” After hours it says “Text us.” If the hours line has no clock times, the buttons stay “Call” and “Text,” and no open/closed badge is shown.
- **Fonts, motion, dark mode.** One display font and one body font, a small scroll fade, and dark mode. They follow the phone. Reduced motion turns the fade off.

## Test the form

1. Publish with `"bookingUrl": ""`. Book shows Call and Text, not an empty frame.
2. Paste the HighLevel form URL into `bookingUrl` and publish again.
3. Open `.../sites/<slug>/`, tap Book, and submit a test with your own name and phone.
4. In HighLevel, the contact should be for that shop. The form address includes `shop_slug=<slug>`.
