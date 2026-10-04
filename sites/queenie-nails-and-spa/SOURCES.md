# Queenie Nails & Spa — where each fact came from

Nothing on the sample page was guessed. Prices that could not be opened on a live page are shown as “ask for price.”

| Fact | Used on the page | Source |
| --- | --- | --- |
| Name: Queenie Nails & Spa | Yes | `listings.json` id 19, from the shop’s card |
| Address: 648 Strander Blvd, Tukwila, WA 98188 | Yes | `listings.json` id 19. Same address on the shop’s former site `queeniespanails.com` (DuckDuckGo index, 4 Oct 2026) and on the Google-style place record for this address |
| Phone: (425) 227-0954 | Yes | `listings.json` id 19. The former site’s contact line also showed 425 227 0954 |
| Hours: Mon–Sat 9:30am–7:00pm; Sunday 10:00am–6:00pm | Yes | `listings.json` id 19. A Yelp hours table indexed for Queenie Nail & Spa at 648 Strander Blvd matches these hours |
| Tagline: Professional Nail Art Services | Yes | `listings.json` id 19 (`oneLiner`) |
| Featured offer: Loyalty stamp card. A 10-circle stamp card is available. The reward is not printed on the card. | Yes, `isSample` false | `listings.json` id 19 (`offer`) and `shops/19.json` (`internalNote`: back of the card is a 10-circle loyalty stamp card with no printed reward). No public page states a reward, so “10th visit free” is not used |
| Services: manicure, pedicure, nail art, waxing | Yes, each with “ask for price” | The shop’s former site said it offers nail services, waxing, manicures, pedicure, and nail art (`queeniespanails.com`, DuckDuckGo index, 4 Oct 2026) |
| Map link | Yes | `listings.json` `googleMapsUrl` (Google Maps search for the name and address) |
| Photos | Yes, tagged “Sample photo” | Pexels nail photos already credited in `PHOTO_CREDITS.md`. They are not photos of this shop |

## Checked and not used

- `queeniespanails.com` was replaced on 3 Oct 2026. The live pages no longer show the salon, so item prices from old search snippets of `/services/` were not copied.
- `queenienailspa.com` is a different salon at 3542 Worthington Blvd #101, Frederick, MD. Its menu was not used.
- A Yelp snippet listed (206) 462-2959. That does not match the card or the shop’s own contact line, so it was not used.
- No reviews, ratings, review counts, or testimonials are shown.
