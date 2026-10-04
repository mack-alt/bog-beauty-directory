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

assert.strictEqual(site.telDigits("(425) 227-0954"), "+14252270954");
assert.strictEqual(site.telDigits("+1 425-572-6271"), "+14255726271");

const queenieRows = site.splitHours(QUEENIE);
assert.strictEqual(queenieRows.length, 2);
assert.strictEqual(queenieRows[0].days, "Mon\u2013Sat");
assert.strictEqual(queenieRows[0].time, "9:30am\u20137:00pm");
assert.deepStrictEqual(site.splitHours("We open 7 days a week"), [
  { days: "We open 7 days a week", time: "" }
]);
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

["queenie-nails-and-spa", "kims-lashes-beauty-salon", "fancy-nails"].forEach(function (slug) {
  const html = fs.readFileSync(path.join(root, slug, "index.html"), "utf8");
  const json = JSON.parse(fs.readFileSync(path.join(root, slug, "site.json"), "utf8"));
  assert.ok(/noindex/.test(html), slug + " noindex");
  assert.ok(json.name && json.phone && json.address, slug + " card fields");
  assert.ok(Object.prototype.hasOwnProperty.call(json, "bookingUrl"), slug + " bookingUrl");
  (json.photos || []).forEach(function (photo) {
    assert.ok(/\.webp(\?|$)/.test(photo.src), slug + " webp");
    assert.ok(photo.alt, slug + " alt");
  });
});

console.log("site template tests passed");
