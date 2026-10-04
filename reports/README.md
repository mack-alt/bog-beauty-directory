# Front Door Checkups

These are one-page sample reports Kenny can hand a shop owner. They are not part of the directory.

Each report is a folder with `index.html` and `report.json`. Shared layout and wording live in `template/`. The page is `noindex`. The page build keeps `/reports/` out of `sitemap.xml` and `llms.txt`. Do not link a checkup from the directory.

## Add a shop

1. Copy `reports/queenie-nails-and-spa/` to `reports/<slug>/`.
2. Edit `report.json`: shop name, check date, accent, headline, five areas, the “already did” links, the closing line, and the sources.
3. Each area needs `title`, `grade`, `found`, `why`, and `fix`.
4. `grade` is `green`, `yellow`, `red`, or `visit`. Use `visit` for a live test that has not been done. The page shows that row as “Test on visit” with a blank checkbox line in `checkLine`.
5. Put anything you could not verify in `notChecked`. Leave the finding out rather than guessing.
6. Optional `compare` rows are for real public numbers only. Name the source in `sources`.
7. Shop names, findings, and the closing line stay as written in `report.json`. Language chips translate the labels only.

The score line counts areas whose grade is `green`.

## Queenie Nails & Spa — October 2026

Checked 4 Oct 2026. Nothing in the report was guessed.

| Area | Grade | Evidence |
| --- | --- | --- |
| Google listing | Yellow | Birdeye page for Queenie Nail Salon, 648 Strander Blvd: 4.4 from 501 Google reviews. Tuesday opens 9:00 AM on that page. The card in `listings.json` id 19 says Monday–Saturday 9:30 AM. Other days match. Photo count and owner replies were not opened. |
| Website | Red | `queeniespanails.com` on 4 Oct 2026 is an unrelated Indonesian page, last modified 3 Oct 2026. `queenie-nail-spa.business.site` returns 404. Birdeye still lists the old domain. No shop price list is on that live domain. Mobile of a shop site: not checked. |
| Phone and texting | Test on visit | No call was placed to (425) 227-0954. |
| Online booking | Red | `listings.json` id 19 has no `bookingUrl`. No Booksy or Fresha page for 648 Strander Blvd. Fresha hits for other “Queen” salons are Everett and Queen Anne. |
| Reviews vs nearby | Yellow | Birdeye Google counts the same day: Queenie 4.4 / 501, HT Nail Bar at 331 Strander Blvd 4.5 / 635, TH Nail Bar & Spa at 17250 Southcenter Pkwy #140 4.6 / 1,030. That Southcenter phone is (206) 397-3959, the same door as directory id 21, Nail Bar & Spa. |

Do not copy another salon’s rating onto this page. Do not fill in the call line until Kenny places the call.
