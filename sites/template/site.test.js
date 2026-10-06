"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const site = require("./site.js");

const QUEENIE = "Mon\u2013Sat 9:30am\u20137:00pm; Sunday 10:00am\u20136:00pm";
const KIMS = "Mon\u2013Sat 9:30 AM\u20137:00 PM; Sunday 10:00 AM\u20135:00 PM";

function at(iso) {
  return new Date(iso);
}

assert.strictEqual(site.chooseLang("?lang=ko", "es", ["vi-VN"]), "ko");
assert.strictEqual(site.chooseLang("", "es", ["vi-VN"]), "es");
assert.strictEqual(site.chooseLang("", "", ["vi-VN", "en-US"]), "vi");
assert.strictEqual(site.chooseLang("", "", ["fr-FR", "de"]), "en");
assert.strictEqual(site.chooseLang("?lang=fr", "", ["es-MX"]), "es");
assert.strictEqual(site.chooseLang("?variant=soft&lang=th", "en", ["en"]), "th");

assert.strictEqual(site.readVariant("?variant=soft"), "soft");
assert.strictEqual(site.readVariant("?variant=neutral"), "soft");
assert.strictEqual(site.readVariant("?variant=bold"), "bold");
assert.strictEqual(site.readVariant(""), "bold");

assert.strictEqual(
  site.slugFromPath("/bog-beauty-directory/sites/queenie-nails-and-spa/"),
  "queenie-nails-and-spa"
);
assert.strictEqual(
  site.slugFromPath("/sites/fancy-nails/index.html"),
  "fancy-nails"
);
assert.strictEqual(site.slugFromPath("/sites/template/"), "");

assert.strictEqual(site.formUrl(""), "");
assert.strictEqual(site.formUrl("PASTE_HIGHLEVEL_FORM_URL"), "");
assert.strictEqual(site.formUrl("http://example.com/form"), "");
assert.strictEqual(
  site.bookingSrc("https://forms.example/widget/abc", "fancy-nails"),
  "https://forms.example/widget/abc?shop_slug=fancy-nails"
);
assert.strictEqual(
  site.bookingSrc("https://forms.example/widget/abc?uid=1", "kims-lashes-beauty-salon"),
  "https://forms.example/widget/abc?uid=1&shop_slug=kims-lashes-beauty-salon"
);
assert.strictEqual(site.bookingSrc("", "fancy-nails"), "");
assert.strictEqual(site.isLeadForm("https://api.leadconnectorhq.com/widget/form/Bi8NlF4wVCXBNGLHlYpd"), true);
assert.strictEqual(site.isLeadForm("https://www.vagaro.com/mynailarea"), false);
assert.strictEqual(site.bookTarget("https://api.leadconnectorhq.com/widget/form/Bi8NlF4wVCXBNGLHlYpd"), "");
assert.strictEqual(site.bookTarget("https://www.vagaro.com/mynailarea"), "https://www.vagaro.com/mynailarea");
assert.strictEqual(site.bookTarget(""), "");
site.LOCALES.forEach(function (code) {
  assert.ok(site.COPY.bookOut[code], code + " book out");
});

assert.strictEqual(site.safeDirectory("../../shop/fancy-nails/"), "../../shop/fancy-nails/");
assert.strictEqual(
  site.safeDirectory("https://mack-alt.github.io/bog-beauty-directory/shop/ht-nail-bar/"),
  "https://mack-alt.github.io/bog-beauty-directory/shop/ht-nail-bar/"
);
assert.strictEqual(site.safeDirectory("javascript:alert(1)"), "");
assert.strictEqual(site.safeDirectory("../help/"), "");
assert.strictEqual(site.safeDirectory("/shop/fancy-nails/"), "");
assert.strictEqual(site.giftLine("Fancy Nails"), "A free gift for Fancy Nails from Blades of Grass");
site.LOCALES.forEach(function (code) {
  assert.ok(site.COPY.gift[code].indexOf("{name}") !== -1, code + " gift");
  assert.ok(site.COPY.giftListing[code], code + " listing label");
  assert.ok(site.COPY.giftHelp[code], code + " help label");
  assert.ok(!/\bAI\b/.test(site.COPY.gift[code] + site.COPY.giftListing[code] + site.COPY.giftHelp[code]));
});

assert.strictEqual(site.telDigits("(425) 227-0954"), "+14252270954");
assert.strictEqual(site.telDigits("+1 425-572-6271"), "+14255726271");

const queenieRows = site.splitHours(QUEENIE);
assert.strictEqual(queenieRows.length, 2);
assert.strictEqual(queenieRows[0].days, "Mon\u2013Sat");
assert.strictEqual(queenieRows[0].time, "9:30am\u20137:00pm");
assert.deepStrictEqual(site.splitHours("We open 7 days a week"), [
  { days: "We open 7 days a week", time: "" }
]);
assert.deepStrictEqual(site.splitHours("Mon\u2013Fri 9:00am\u20137:00pm; Sat\u2013Sun 9:00am\u20136:00pm"), [
  { days: "Mon\u2013Fri", time: "9:00am\u20137:00pm" },
  { days: "Sat\u2013Sun", time: "9:00am\u20136:00pm" }
]);

const diamondHours = "Mon\u2013Sat 10:00am\u20137:00pm; Sunday: call to confirm";
const diamondSun = site.statusFor(diamondHours, at("2026-10-04T18:00:00Z"));
assert.strictEqual(diamondSun.open, null);
assert.ok(/confirm/i.test(diamondSun.line));
assert.strictEqual(site.primaryAction(diamondSun).labelKey, "call");
const diamondMon = site.statusFor(diamondHours, at("2026-10-05T18:00:00Z"));
assert.strictEqual(diamondMon.open, true);
const diamondSat = site.statusFor(diamondHours, at("2026-10-04T03:00:00Z"));
assert.strictEqual(diamondSat.open, false);

const waveSun = site.statusFor("Tue\u2013Sat 10:00am\u20135:00pm; Sun\u2013Mon closed", at("2026-10-04T18:00:00Z"));
assert.strictEqual(waveSun.open, false);
assert.deepStrictEqual(site.splitHours([{ days: "Sunday", time: "10:00am\u20136:00pm" }]), [
  { days: "Sunday", time: "10:00am\u20136:00pm" }
]);

const satNight = site.statusFor(QUEENIE, at("2026-10-04T02:49:00Z"));
assert.strictEqual(satNight.open, false);
assert.strictEqual(site.primaryAction(satNight).labelKey, "textUs");

const sunLate = site.statusFor(QUEENIE, at("2026-10-04T18:00:00Z"));
assert.strictEqual(sunLate.open, true);
assert.strictEqual(site.primaryAction(sunLate).labelKey, "callNow");

const monEarly = site.statusFor(QUEENIE, at("2026-10-05T15:00:00Z"));
assert.strictEqual(monEarly.open, false);
assert.ok(monEarly.line.indexOf("9:30 AM") !== -1);

const kimSunOpen = site.statusFor(KIMS, at("2026-10-04T23:00:00Z"));
assert.strictEqual(kimSunOpen.open, true);
const kimSunClosed = site.statusFor(KIMS, at("2026-10-05T01:00:00Z"));
assert.strictEqual(kimSunClosed.open, false);

assert.strictEqual(site.statusFor("We open 7 days a week", at("2026-10-04T18:00:00Z")), null);
assert.strictEqual(site.primaryAction(null).labelKey, "call");

["#9c3d52", "#8a6232", "#9a3450", "#ffccdd", "#ffffff"].forEach(function (hex) {
  [false, true].forEach(function (dark) {
    const vars = site.accentVars(hex, dark);
    assert.ok(vars.fillContrast >= 4.5, hex + " fill " + vars.fillContrast);
    assert.ok(vars.markContrast >= 3, hex + " mark " + vars.markContrast);
  });
});

function ratio(fg, bg) {
  return site.contrast(site.hexToRgb(fg), site.hexToRgb(bg));
}

assert.ok(ratio("#504840", "#f6f1ea") >= 4.5);
assert.ok(ratio("#504840", "#fffdfb") >= 4.5);
assert.ok(ratio("#1d1614", "#f6f1ea") >= 4.5);
assert.ok(ratio("#e6dcd2", "#131110") >= 4.5);
assert.ok(ratio("#e6dcd2", "#221e1b") >= 4.5);
assert.ok(ratio("#f6f1ea", "#221e1b") >= 4.5);
assert.ok(ratio("#524c46", "#f3f2ef") >= 4.5);
assert.ok(ratio("#ffffff", "#9a3450") >= 4.5);
assert.ok(ratio("#d98a9e", "#131110") >= 3);
assert.ok(ratio("#1d1614", "#ffffff") >= 4.5);

assert.deepStrictEqual(site.serviceList(["Manicure", { name: "Pedicure", price: "" }]), [
  { name: "Manicure", price: "" },
  { name: "Pedicure", price: "" }
]);

function named(list) {
  return list.map(function (name) { return { name: name, price: "" }; });
}
const four = site.menuHtml(named(["A", "B", "C", "D"]));
assert.ok(four.indexOf("<details") === -1, "short menus stay open");
assert.strictEqual((four.match(/class="svc"/g) || []).length, 4);
const six = site.menuHtml(named(["1", "2", "3", "4", "5", "6"]));
assert.ok(six.indexOf("<details") === -1, "six services stay open");
const seven = site.menuHtml(named(["1", "2", "3", "4", "5", "6", "7"]));
assert.ok(/See all services \(7\)/.test(seven));
assert.ok(seven.indexOf(">6<") < seven.indexOf("<details"));
assert.ok(seven.indexOf("<details") < seven.indexOf(">7<"));
site.LOCALES.forEach(function (code) {
  assert.ok(site.COPY.seeAll[code].indexOf("{n}") !== -1, code + " see all");
});

const root = path.join(__dirname, "..");
function walk(dir, out) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (ent) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (/\.(html|js|css|json|md)$/.test(ent.name) && ent.name !== "site.test.js") out.push(full);
  });
  return out;
}
walk(root, []).forEach(function (file) {
  const text = fs.readFileSync(file, "utf8");
  assert.ok(!/\bAI\b/.test(text), "banned wording in " + file);
});

["queenie-nails-and-spa", "kims-lashes-beauty-salon", "fancy-nails", "tn-hair-salon"].forEach(function (slug) {
  const html = fs.readFileSync(path.join(root, slug, "index.html"), "utf8");
  const json = JSON.parse(fs.readFileSync(path.join(root, slug, "site.json"), "utf8"));
  assert.ok(/noindex,\s*nofollow/.test(html), slug + " noindex");
  assert.ok(json.name && json.phone && json.address, slug + " card fields");
  assert.strictEqual(
    json.bookingUrl,
    "https://api.leadconnectorhq.com/widget/form/Bi8NlF4wVCXBNGLHlYpd",
    slug + " bookingUrl"
  );
  assert.strictEqual(
    site.bookingSrc(json.bookingUrl, slug),
    json.bookingUrl + "?shop_slug=" + slug
  );
  assert.strictEqual(site.isLeadForm(json.bookingUrl), true);
  (json.photos || []).forEach(function (photo) {
    assert.ok(/\.webp(\?|$)/.test(photo.src), slug + " webp");
    assert.ok(photo.alt, slug + " alt");
  });
});

const ownBook = {
  "jerrys-barbershop": "https://jerrybarbershop.glossgenius.com/booking-flow",
  "ht-nail-bar": "https://booking.gocheckin.net/v2/13594",
  "beauty-wave": "https://beauty-wave.square.site/s/appointments",
  "diamond-nails": "https://booking.gocheckin.net/v2/18076"
};
Object.keys(ownBook).forEach(function (slug) {
  const html = fs.readFileSync(path.join(root, slug, "index.html"), "utf8");
  const json = JSON.parse(fs.readFileSync(path.join(root, slug, "site.json"), "utf8"));
  assert.ok(/noindex,\s*nofollow/.test(html), slug + " noindex");
  assert.strictEqual(json.bookingUrl, ownBook[slug], slug + " bookingUrl");
  assert.strictEqual(site.bookTarget(json.bookingUrl), ownBook[slug]);
  assert.strictEqual(site.isLeadForm(json.bookingUrl), false);
  assert.ok(!/[?&]shop_slug=/.test(site.bookTarget(json.bookingUrl)), slug + " shop_slug");
  (json.photos || []).forEach(function (photo) {
    assert.ok(/\.webp(\?|$)/.test(photo.src), slug + " webp");
    assert.ok(photo.alt, slug + " alt");
  });
});

const css = fs.readFileSync(path.join(__dirname, "site.css"), "utf8");
const js = fs.readFileSync(path.join(__dirname, "site.js"), "utf8");
assert.ok(/animation-timeline:\s*view\(\)/.test(css), "view timeline");
assert.ok(/animation-timeline:\s*scroll\(root\)/.test(css), "scroll timeline");
assert.ok(/prefers-reduced-motion:\s*reduce/.test(css), "reduced motion");
assert.ok(/IntersectionObserver/.test(js), "observer fallback");
assert.ok(/scroll-progress/.test(js), "progress mark");
assert.ok(!/Text us anytime/.test(js), "no text-back promise");
assert.ok(!/animation-timeline:\s*--frame/.test(css), "photos are not clip-revealed");
assert.ok(/\.gift\s*\{[^}]*position:\s*static/.test(css), "gift banner is in normal flow");
assert.ok(!/\.gift\s*\{[^}]*position:\s*(?:fixed|sticky)/.test(css), "gift banner is not stuck");
assert.ok(/class="gift"/.test(js), "gift banner markup");
assert.ok(/safeDirectory\(/.test(js), "listing url check");
assert.ok(!/\.gift[^\{]*position:\s*(?:fixed|sticky)/.test(css));
["queenie-nails-and-spa", "kims-lashes-beauty-salon", "fancy-nails", "jerrys-barbershop", "ht-nail-bar", "diamond-nails", "beauty-wave", "tn-hair-salon", "my-nail-area"].forEach(function (slug) {
  const json = JSON.parse(fs.readFileSync(path.join(root, slug, "site.json"), "utf8"));
  assert.ok(!json.motion && !json.animation, slug + " has no motion field");
});

["index.html", "shop.html", "sitemap.xml", "llms.txt", "README.md"].forEach(function (file) {
  const text = fs.readFileSync(path.join(root, "..", file), "utf8");
  assert.ok(text.indexOf("/sites/") === -1, file + " links a sample site");
});
["listings.json"].concat(fs.readdirSync(path.join(root, "..", "shops")).map(function (name) {
  return path.join("shops", name);
})).forEach(function (file) {
  const text = fs.readFileSync(path.join(root, "..", file), "utf8");
  assert.ok(text.indexOf("/sites/") === -1, file + " links a sample site");
});
const robots = fs.readFileSync(path.join(root, "..", "robots.txt"), "utf8");
assert.ok(/Disallow:\s*\/bog-beauty-directory\/sites\//.test(robots), "robots disallow");

const diamond = JSON.parse(fs.readFileSync(path.join(root, "diamond-nails", "site.json"), "utf8"));
assert.ok(!diamond.tagline && !diamond.walkIns && !diamond.links);
assert.ok(!/\$/.test(JSON.stringify(diamond.services)));
assert.ok(/call to confirm/i.test(diamond.hours));
const diamondMenu = site.menuHtml(site.serviceList(diamond.services));
assert.ok(/See all services \(27\)/.test(diamondMenu));
assert.ok(diamondMenu.indexOf("Classic Manicure") < diamondMenu.indexOf("Deluxe Pedicure"));
assert.ok(diamondMenu.indexOf("Deluxe Pedicure") < diamondMenu.indexOf("<details"));
assert.ok(diamondMenu.indexOf("<details") < diamondMenu.indexOf("Gel/Shellac add-on"));
assert.ok(diamondMenu.indexOf("Gel/Shellac add-on") < diamondMenu.indexOf("Polish change, hands or feet"));
const queenieMenu = site.menuHtml(site.serviceList(JSON.parse(fs.readFileSync(path.join(root, "queenie-nails-and-spa", "site.json"), "utf8")).services));
assert.ok(queenieMenu.indexOf("<details") === -1);
const wave = JSON.parse(fs.readFileSync(path.join(root, "beauty-wave", "site.json"), "utf8"));
const waveMenu = site.menuHtml(site.serviceList(wave.services));
assert.ok(/See all services \(10\)/.test(waveMenu));
assert.ok(waveMenu.indexOf("Hair cut only") < waveMenu.indexOf("<details"));
assert.ok(waveMenu.indexOf("<details") < waveMenu.indexOf("Perm spiral"));
const tn = JSON.parse(fs.readFileSync(path.join(root, "tn-hair-salon", "site.json"), "utf8"));
assert.ok(!tn.links);
assert.ok(!/tnhairsaloon/.test(JSON.stringify(tn)));
assert.strictEqual(tn.priceNote, "Prices from the shop's card; please confirm when booking.");
assert.strictEqual(site.statusFor(tn.hours, at("2026-10-05T18:00:00Z")).open, true);
assert.strictEqual(site.statusFor(tn.hours, at("2026-10-04T20:00:00Z")).open, true);
assert.strictEqual(wave.links[0].href, "https://beauty-wave.square.site/");
assert.ok(/booking page/i.test(wave.priceNote));
assert.ok(!/outlook/i.test(JSON.stringify(wave)));
const ht = JSON.parse(fs.readFileSync(path.join(root, "ht-nail-bar", "site.json"), "utf8"));
assert.ok(!ht.tagline);
assert.ok(/9:30am/.test(ht.hours));
assert.ok(/Second location/.test(ht.extra));
const nail = JSON.parse(fs.readFileSync(path.join(root, "my-nail-area", "site.json"), "utf8"));
const nailHtml = fs.readFileSync(path.join(root, "my-nail-area", "index.html"), "utf8");
assert.ok(/noindex,\s*nofollow/.test(nailHtml), "my-nail-area noindex");
assert.strictEqual(nail.bookingUrl, "https://www.vagaro.com/mynailarea/services");
assert.strictEqual(site.bookTarget(nail.bookingUrl), nail.bookingUrl);
assert.strictEqual(site.isLeadForm(nail.bookingUrl), false);
assert.ok(!/leadconnectorhq/.test(JSON.stringify(nail)));
assert.ok(!nail.walkIns);
assert.strictEqual(nail.offerConfirmed, true);
assert.ok(/please confirm when booking/.test(nail.priceNote));
assert.strictEqual(nail.links[1].href, "https://www.google.com/maps/search/?api=1&query=My%20Nail%20Area&query_place_id=ChIJNwuMOAddkFQRyZWXdltQZ3U");
const nailMenu = site.menuHtml(site.serviceList(nail.services));
assert.ok(/See all services \(16\)/.test(nailMenu));
assert.ok(nailMenu.indexOf("E-file manicure") < nailMenu.indexOf("<details"));
assert.ok(nailMenu.indexOf("<details") < nailMenu.indexOf("Men manicure"));
assert.strictEqual(site.statusFor(nail.hours, at("2026-10-05T17:00:00Z")).open, true);
assert.strictEqual(site.statusFor(nail.hours, at("2026-10-06T01:30:00Z")).open, false);
assert.strictEqual(site.statusFor(nail.hours, at("2026-10-03T18:00:00Z")).open, false);
assert.strictEqual(site.statusFor(nail.hours, at("2026-10-04T18:00:00Z")).open, false);
(nail.photos || []).forEach(function (photo) {
  assert.ok(/\.webp(\?|$)/.test(photo.src));
  assert.ok(photo.alt);
});

["queenie-nails-and-spa", "kims-lashes-beauty-salon", "fancy-nails", "jerrys-barbershop", "ht-nail-bar", "diamond-nails", "beauty-wave", "tn-hair-salon", "my-nail-area"].forEach(function (slug) {
  const json = JSON.parse(fs.readFileSync(path.join(root, slug, "site.json"), "utf8"));
  assert.strictEqual(json.directoryUrl, "../../shop/" + slug + "/", slug + " directoryUrl");
  assert.strictEqual(site.safeDirectory(json.directoryUrl), json.directoryUrl);
});

const help = fs.readFileSync(path.join(root, "help", "index.html"), "utf8");
assert.ok(/noindex,\s*nofollow/.test(help), "help noindex");
assert.ok(help.indexOf("206-743-6296") !== -1, "help text line");
assert.ok(help.indexOf("mack@lovebog.com") !== -1, "help email");
assert.strictEqual((help.match(/<p class="shop">/g) || []).length, 2, "both language blanks");
assert.ok(/querySelectorAll\("\.shop > span"\)/.test(help), "prefill targets the shop line");
assert.ok(/just like you/.test(help) && /đúng là tiệm của bạn/.test(help), "sheet copy");
assert.ok(/textContent/.test(help), "shop name is text, not html");
assert.ok(!/innerHTML/.test(help), "help does not inject html");
assert.ok(/@media print/.test(help), "print layout");
assert.ok(help.indexOf("/sites/") === -1, "help does not link a sample");

const kit = fs.readFileSync(path.join(root, "kit", "index.html"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "kit", "manifest.webmanifest"), "utf8"));
assert.ok(/noindex,\s*nofollow/.test(kit), "kit noindex");
assert.ok(kit.indexOf("<script") === -1, "kit has no script");
assert.strictEqual((kit.match(/class="shop"/g) || []).length, 10);
assert.strictEqual((kit.match(/sms:\?&amp;body=/g) || []).length, 10);
assert.ok(kit.indexOf("Beauty Wave") < kit.indexOf("Stop 4 Nails"));
assert.ok(kit.indexOf("Stop 4 Nails") < kit.indexOf("TN Hair Salon"));
assert.ok(kit.indexOf("TN Hair Salon") < kit.indexOf("My Nail Area"));
assert.ok(kit.indexOf('href="../fixes/stop-4-nails/"') !== -1);
assert.ok(kit.indexOf("3 quick fixes") !== -1);
assert.ok(kit.indexOf("3%20quick%20fixes%20that%20could%20bring%20in%20more%20bookings") !== -1);
const fixes = fs.readFileSync(path.join(root, "fixes", "stop-4-nails", "index.html"), "utf8");
assert.ok(/noindex,\s*nofollow/.test(fixes), "fixes noindex");
assert.ok(fixes.indexOf('href="../../../shop/stop-4-nails/"') !== -1);
assert.ok(fixes.indexOf(">Your free listing<") !== -1);
assert.ok(kit.indexOf(">My Nail Area<") < kit.indexOf("HT Nail Bar"));
assert.ok(kit.indexOf("sites%2Fmy-nail-area%2F") !== -1);
assert.ok(kit.indexOf('href="../help/"') !== -1);
assert.ok(kit.indexOf('href="scripts/"') !== -1, "kit scripts button");
assert.ok(kit.indexOf(">Scripts<") !== -1);
const scriptsHtml = fs.readFileSync(path.join(root, "kit", "scripts", "index.html"), "utf8");
const scriptsJs = fs.readFileSync(path.join(root, "kit", "scripts", "scripts.js"), "utf8");
assert.ok(/noindex,\s*nofollow/.test(scriptsHtml), "scripts noindex");
assert.ok(scriptsHtml.indexOf('href="../../') === -1 && scriptsHtml.indexOf("/sites/") === -1, "scripts stays inside the kit");
assert.ok(scriptsJs.indexOf('id: "visit-1"') !== -1 && scriptsJs.indexOf('id: "at-the-door"') !== -1, "deep link path");
assert.ok(scriptsJs.indexOf("Hi! I'm Kenny with Blades of Grass, the local beauty directory here in [city].") !== -1);
assert.ok(scriptsJs.indexOf("Founding shops pay $297 a month for the first 90 days.") !== -1);
assert.ok(scriptsJs.indexOf("Let me check that for your shop and tell you.") !== -1);
assert.ok(scriptsJs.indexOf("Let me check and tell you.") !== -1);
assert.ok(scriptsJs.indexOf('id: "guarantee"') === -1, "no empty guarantee scenario");
assert.ok(scriptsJs.indexOf('title: "Visit 1"') !== -1);
assert.ok(scriptsJs.indexOf('title: "Visit 2"') !== -1);
assert.ok(scriptsJs.indexOf('title: "She says yes"') !== -1);
assert.ok(scriptsJs.indexOf('title: "She says no / not now"') !== -1);
assert.ok(scriptsJs.indexOf('title: "Follow-up texts"') !== -1);
assert.strictEqual(manifest.name, "Kenny's Gift Kit");
assert.strictEqual(manifest.short_name, "Gift Kit");
assert.strictEqual(manifest.display, "standalone");
assert.strictEqual(manifest.start_url, "/bog-beauty-directory/sites/kit/");
assert.strictEqual(manifest.scope, "/bog-beauty-directory/sites/kit/");
assert.ok(fs.existsSync(path.join(root, "kit", "icon-192.png")));
assert.ok(fs.existsSync(path.join(root, "kit", "icon-512.png")));
assert.ok(fs.existsSync(path.join(root, "kit", "apple-touch-icon.png")));

console.log("site template tests passed");
