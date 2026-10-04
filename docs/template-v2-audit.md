# Template v2 audit

Queenie and Kim's before this pass:

- The hero was a photo with the name on it, in one sans font.
- The offer card and buttons used a thin border. No hand-drawn mark, no broken grid.
- Call, Text, and Directions were sticky. There was no Book button.
- Language chips ignored the phone language. The call button did not change after hours.
- Photos were JPEG. Sample labels, noindex, dark mode, and the open/closed badge were already in place.

v2 is still one shared template (`sites/template/`). A new shop is a folder plus `site.json`. Card fields are name, phone, address, and hours. Photos, offer, and `bookingUrl` are optional. Accent, fonts, and the soft color look need no fields.

Book scrolls to “Request a booking.” Paste the HighLevel form URL into `bookingUrl`. The frame adds `?shop_slug=` from the folder name. An empty `bookingUrl` shows Call and Text instead of a broken form.

Scroll motion is in the shared CSS. A shop does not add a field for it. Reduced motion turns it off.
