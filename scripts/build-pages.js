#!/usr/bin/env node
/**
 * Build crawlable home cards, /shop/<slug>/ pages, sitemap.xml, robots.txt, and llms.txt.
 * Reads listings.json only. Does not invent hours, reviews, ratings, or services.
 * Run: node scripts/build-pages.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://mack-alt.github.io/bog-beauty-directory";
const ASSET = {
  css: "20260919g",
  looksCss: "20260926i",
  draft: "20260926y",
  phrases: "20260926x",
  looks: "20260926y",
  shop: "20260926y",
};

const CATS = {
  "Hair Salon": "hair",
  "Barber Shop": "barber",
  "Nail Salon": "nails",
  "Spa / Esthetics": "spa",
  "Massage": "massage",
  "Brows / Lashes": "brows",
  "Makeup": "makeup",
  "Skincare": "skin",
  "Beauty Salon": "beauty",
  "Wellness / Other": "wellness",
};

const CHIP = {
  hair: "Hair",
  barber: "Barber",
  nails: "Nails",
  spa: "Spa",
  massage: "Massage",
  brows: "Brows/Lashes",
  makeup: "Makeup",
  skin: "Skin",
  beauty: "Beauty",
  wellness: "Wellness",
};

const SCHEMA = {
  hair: "HairSalon",
  barber: "HealthAndBeautyBusiness",
  nails: "NailSalon",
  spa: "DaySpa",
  massage: "HealthAndBeautyBusiness",
  brows: "BeautySalon",
  makeup: "BeautySalon",
  skin: "BeautySalon",
  beauty: "BeautySalon",
  wellness: "HealthAndBeautyBusiness",
};

const SAMPLES = {
  hair: [
    { src: "images/styles/cards/hair-1.jpg", alt: "Sample photo of a hair salon appointment" },
    { src: "images/styles/cards/hair-2.jpg", alt: "Sample photo of a stylist consulting on hair color" },
    { src: "images/styles/cards/hair-3.jpg", alt: "Sample photo of a haircut in a salon" },
  ],
  barber: [
    { src: "images/styles/cards/barber-1.jpg", alt: "Sample photo of a barber styling hair" },
    { src: "images/styles/cards/barber-2.jpg", alt: "Sample photo of a barber shop interior" },
    { src: "images/styles/cards/barber-3.jpg", alt: "Sample photo of a barber giving a haircut" },
  ],
  nails: [
    { src: "images/styles/cards/nails-1.jpg", alt: "Sample photo of a manicure" },
    { src: "images/styles/cards/nails-2.jpg", alt: "Sample photo of nail art" },
    { src: "images/styles/cards/nails-3.jpg", alt: "Sample photo of nail extensions" },
  ],
  spa: [
    { src: "images/styles/cards/spa-1.jpg", alt: "Sample photo of a spa facial with warm stones" },
    { src: "images/styles/cards/spa-2.jpg", alt: "Sample photo of a spa facial massage" },
    { src: "images/styles/cards/spa-3.jpg", alt: "Sample photo of a spa eye treatment" },
  ],
  brows: [
    { src: "images/styles/cards/brows-1.jpg", alt: "Sample photo of eyelash extensions" },
    { src: "images/styles/cards/brows-2.jpg", alt: "Sample photo of an eyebrow treatment" },
    { src: "images/styles/cards/brows-3.jpg", alt: "Sample photo of a lash appointment" },
  ],
  beauty: [
    { src: "images/styles/cards/beauty-1.jpg", alt: "Sample photo of a bright beauty salon interior" },
    { src: "images/styles/cards/beauty-2.jpg", alt: "Sample photo of a salon reception" },
    { src: "images/styles/cards/beauty-3.jpg", alt: "Sample photo of stylists working in a salon" },
  ],
};
SAMPLES.massage = SAMPLES.spa;
SAMPLES.makeup = SAMPLES.beauty;
SAMPLES.skin = SAMPLES.spa;
SAMPLES.wellness = SAMPLES.spa;

const ICON_PHONE =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h3l1.2 2.8-1.8 1.1a11 11 0 0 0 5 5l1.1-1.8 2.8 1.2v3A1.8 1.8 0 0 1 16.6 20 14.2 14.2 0 0 1 4 7.4 1.8 1.8 0 0 1 5.8 5.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
const ICON_PIN =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="11" r="2.1" fill="currentColor"/></svg>';

function slugifyName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shopSlug(item) {
  if (item && item.slug) {
    const given = String(item.slug).trim().toLowerCase();
    if (given) return given;
  }
  return slugifyName(item && item.name);
}

function isHidden(item) {
  if (!item) return true;
  if (item.hidden === true || item.isDemo === true || item.demo === true) return true;
  if (Number(item.id) === 12) return true;
  if (String(item.slug || "").toLowerCase() === "11-fingers-and-toe") return true;
  return false;
}

function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function normalizePhone(phone) {
  if (!phone) return "";
  const raw = String(phone).trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (raw.startsWith("+")) return "+" + digits;
  return raw;
}

function formatPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length === 10) return "(" + local.slice(0, 3) + ") " + local.slice(3, 6) + "-" + local.slice(6);
  return String(phone || "").trim();
}

function websiteUrl(value) {
  const text = String(value || "").trim();
  return /^https?:\/\//i.test(text) ? text : "";
}

function parseAddress(raw) {
  const text = String(raw || "").trim();
  if (!text) return { reliable: false, streetAddress: "" };
  let match = text.match(/^(.+?),\s*([^,]+?),\s*([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/);
  if (!match) match = text.match(/^(.+?),\s*([A-Za-z][A-Za-z .'-]*?)\s+([A-Z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/);
  if (!match) return { reliable: false, streetAddress: text };
  const street = match[1].trim();
  const city = match[2].trim();
  const region = match[3];
  if (!street || !city || !/^[A-Z]{2}$/.test(region)) return { reliable: false, streetAddress: text };
  return {
    reliable: true,
    streetAddress: street,
    addressLocality: city,
    addressRegion: region,
    postalCode: match[4] || "",
  };
}

function catKey(category) {
  return CATS[category] || "beauty";
}

function sampleFor(item) {
  const key = catKey(item.category);
  const pool = SAMPLES[key] || SAMPLES.beauty;
  const id = parseInt(item.id, 10);
  const n = Number.isNaN(id) ? 0 : Math.abs(id);
  return pool[n % pool.length];
}

function placeLabel(item) {
  const parsed = parseAddress(item.address);
  if (parsed.reliable) return parsed.addressLocality + ", " + parsed.addressRegion;
  return String(item.address || "").trim();
}

function trustText(item) {
  if (item.verifiedByBog === true) return "Verified by BoG";
  if (item.confirmed === true) return "Claimed";
  return "";
}

function pageTitle(item, parsed) {
  if (parsed.reliable && parsed.addressLocality) {
    return item.name + " in " + parsed.addressLocality + " | South Seattle beauty directory";
  }
  return item.name + " | South Seattle beauty directory";
}

function metaDescription(item, parsed) {
  const parts = [];
  if (item.category && parsed.reliable) {
    parts.push(item.name + " is a " + item.category + " in " + parsed.addressLocality + ", " + parsed.addressRegion + ".");
  } else if (item.category) {
    parts.push(item.name + " is a " + item.category + ".");
  } else {
    parts.push(item.name + ".");
  }
  if (item.address) parts.push(String(item.address).trim() + ".");
  const phone = formatPhone(item.phone);
  if (phone) parts.push(phone + ".");
  const trust = trustText(item);
  if (trust) parts.push(trust + ".");
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function schemaType(category) {
  return SCHEMA[catKey(category)] || "HealthAndBeautyBusiness";
}

function businessLd(item, canonical) {
  const parsed = parseAddress(item.address);
  const data = {
    "@context": "https://schema.org",
    "@type": schemaType(item.category),
    name: item.name,
    url: canonical,
  };
  if (item.address) {
    if (parsed.reliable) {
      const address = {
        "@type": "PostalAddress",
        streetAddress: parsed.streetAddress,
        addressLocality: parsed.addressLocality,
        addressRegion: parsed.addressRegion,
        addressCountry: "US",
      };
      if (parsed.postalCode) address.postalCode = parsed.postalCode;
      data.address = address;
    } else {
      data.address = parsed.streetAddress;
    }
  }
  const telephone = normalizePhone(item.phone);
  if (telephone) data.telephone = telephone;
  const site = websiteUrl(item.website);
  if (site) data.sameAs = site;
  const photo = websiteUrl(item.photoUrl);
  if (photo) data.image = photo;
  return data;
}

function cardHtml(item, slug) {
  const href = "shop/" + slug + "/";
  const sample = sampleFor(item);
  const key = catKey(item.category);
  const chip = CHIP[key] || item.category || "";
  const place = placeLabel(item);
  const trust = trustText(item);
  const tel = normalizePhone(item.phone);
  const phoneLabel = "Call " + item.name;
  const dirLabel = "Directions to " + item.name;
  const map = item.address
    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.address)
    : "";
  const trustHtml = trust
    ? '<span class="trust-badge media-badge">' + esc(trust) + "</span>"
    : "";
  const icons = [];
  if (tel) {
    icons.push(
      '<a class="icon-btn" href="tel:' + esc(tel) + '" aria-label="' + esc(phoneLabel) + '">' + ICON_PHONE + "</a>"
    );
  }
  if (map) {
    icons.push(
      '<a class="icon-btn" href="' +
        esc(map) +
        '" aria-label="' +
        esc(dirLabel) +
        '" target="_blank" rel="noopener noreferrer">' +
        ICON_PIN +
        "</a>"
    );
  }
  return [
    '<article class="look-card is-in">',
    '<a class="card-media-link" href="' + esc(href) + '" tabindex="-1" aria-hidden="true">',
    '<div class="card-media photo-slot photo-slot-hero has-sample" data-cat="' + esc(key) + '">',
    '<img src="' + esc(sample.src) + '" alt="' + esc(sample.alt) + '" loading="lazy" decoding="async" />',
    '<span class="slot-note sample-tag">Sample photo</span>',
    trustHtml,
    "</div></a>",
    '<div class="card-body">',
    "<h2><a href=\"" + esc(href) + '">' + esc(item.name) + "</a></h2>",
    place ? '<p class="place-line">' + esc(place) + "</p>" : "",
    '<div class="card-foot">',
    chip ? '<span class="cat-tag">' + esc(chip) + "</span>" : "<span></span>",
    '<div class="icon-actions">' + icons.join("") + "</div>",
    "</div></div></article>",
  ].join("");
}

function shopPage(item, slug) {
  const canonical = SITE + "/shop/" + slug + "/";
  const parsed = parseAddress(item.address);
  const title = pageTitle(item, parsed);
  const description = metaDescription(item, parsed);
  const ld = businessLd(item, canonical);
  const trust = trustText(item);
  const tel = normalizePhone(item.phone);
  const prettyPhone = formatPhone(item.phone);
  const site = websiteUrl(item.website);
  const photo = websiteUrl(item.photoUrl);
  const facts = [
    '<section id="shop-static" class="shop-static">',
    '<p class="brand-mark">Blades of Grass</p>',
    "<h1>" + esc(item.name) + "</h1>",
    item.category ? "<p>" + esc(item.category) + "</p>" : "",
    item.address ? "<p>" + esc(item.address) + "</p>" : "",
    tel ? '<p><a href="tel:' + esc(tel) + '">' + esc(prettyPhone || tel) + "</a></p>" : "",
    site ? '<p><a href="' + esc(site) + '">' + esc(site) + "</a></p>" : "",
    trust ? "<p>" + esc(trust) + "</p>" : "",
    '<p><a href="index.html">Back to directory</a></p>',
    "</section>",
  ].join("\n");

  const imageMeta = photo
    ? '<meta property="og:image" content="' +
      esc(photo) +
      '" />\n  <meta name="twitter:card" content="summary_large_image" />'
    : '<meta name="twitter:card" content="summary" />';

  return `<!DOCTYPE html>
<html lang="en" data-shop-id="${esc(item.id)}" data-shop-slug="${esc(slug)}">
<head>
  <meta charset="UTF-8" />
  <base href="../../" />
  <script>document.documentElement.classList.add("js");</script>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta name="theme-color" content="#1a3a2a" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${esc(canonical)}" />
  ${imageMeta}
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <script type="application/ld+json">${jsonScript(ld)}</script>
  <script>
    document.documentElement.setAttribute("data-look", "1");
    document.documentElement.setAttribute("data-style", "a");
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css?v=${ASSET.css}" />
  <link rel="stylesheet" href="looks.css?v=${ASSET.looksCss}" />
  <link rel="stylesheet" href="styles-draft.css?v=${ASSET.draft}" />
</head>
<body class="shop-page">
  <!-- Generated by scripts/build-pages.js. Do not edit. -->
  ${facts}
  <header class="site-header shop-header">
    <div class="brand">
      <a id="shop-back-link" class="back-link" href="index.html">← Back to directory</a>
      <p class="brand-mark">Blades of Grass</p>
      <p class="tagline">Local shop page</p>
    </div>
  </header>
  <main class="wrap shop-wrap">
    <div id="shop-lang" class="lang-switch" role="group" aria-label="Language"></div>
    <p id="shop-status" class="count" aria-live="polite">Loading…</p>
    <article id="shop" class="shop hidden">
      <p id="shop-demo-banner" class="demo-banner hidden"><span id="shop-demo-banner-label">DEMO / TEMPLATE</span> — placeholder listing, not a real shop.</p>
      <p id="shop-locale-note" class="locale-note hidden"></p>
      <header class="shop-hero">
        <div class="shop-hero-top">
          <h1 id="shop-name" class="shop-name">${esc(item.name)}</h1>
          <div id="shop-badges" class="badges"></div>
        </div>
        <p id="shop-verified" class="verified hidden">Verified by BoG</p>
        <p id="shop-offer" class="offer-highlight hidden"></p>
        <p id="shop-oneliner" class="blurb hidden"></p>
        <p id="shop-rating" class="rating hidden"></p>
        <p id="shop-address" class="meta">${esc(item.address || "")}</p>
        <p id="shop-walkins" class="meta walkins hidden"></p>
        <p id="shop-hours" class="owner-block hidden"></p>
        <p id="shop-demo-note" class="demo-note hidden"></p>
      </header>
      <nav id="shop-actions" class="shop-actions" aria-label="Shop actions"></nav>
      <nav id="shop-socials" class="shop-socials hidden" aria-label="Social links"></nav>
      <section id="shop-story" class="shop-section hidden">
        <h3 id="shop-story-heading">Story</h3>
        <p id="shop-story-text" class="shop-story-text"></p>
      </section>
      <section id="shop-services" class="shop-section hidden">
        <h3 id="shop-services-heading">Services</h3>
        <div id="shop-service-chips" class="service-chips"></div>
      </section>
      <section id="shop-photos" class="shop-section hidden">
        <h3>Photos</h3>
        <div id="shop-photo-feed" class="photo-feed"></div>
      </section>
      <section id="shop-reel" class="shop-section hidden">
        <h3>Highlights</h3>
        <div id="shop-reel-slideshow" class="reel" aria-roledescription="carousel"></div>
      </section>
      <section id="shop-reviews" class="shop-section hidden">
        <h3>Reviews</h3>
        <p id="shop-aggregate-note" class="aggregate-note hidden"></p>
        <div id="shop-review-list" class="review-list"></div>
      </section>
    </article>
  </main>
  <footer class="site-footer">
    <p><a id="shop-footer-back" href="index.html">Back to directory</a></p>
    <p>Blades of Grass · South Seattle</p>
    <p class="fine">Only confirmed listing details and owner-supplied enrichment are shown. No invented reviews or photos.</p>
  </footer>
  <script src="i18n/phrases.js?v=${ASSET.phrases}"></script>
  <script src="looks.js?v=${ASSET.looks}"></script>
  <script src="shop.js?v=${ASSET.shop}"></script>
</body>
</html>
`;
}

function replaceMarked(html, name, inner) {
  const re = new RegExp("<!-- bog:" + name + " -->[\\s\\S]*?<!-- /bog:" + name + " -->");
  if (!re.test(html)) throw new Error("Missing marker bog:" + name);
  return html.replace(re, "<!-- bog:" + name + " -->\n" + inner + "\n<!-- /bog:" + name + " -->");
}

function assignSlugs(shops) {
  const used = new Set();
  return shops.map((item) => {
    let slug = shopSlug(item);
    if (!slug) slug = "shop-" + item.id;
    if (used.has(slug)) slug = slug + "-" + item.id;
    used.add(slug);
    return Object.assign({}, item, { _slug: slug });
  });
}

function main() {
  const listings = JSON.parse(fs.readFileSync(path.join(ROOT, "listings.json"), "utf8"));
  const shops = assignSlugs(listings.filter((item) => !isHidden(item)));
  if (shops.some((item) => /11 fingers/i.test(item.name || ""))) {
    throw new Error("Demo listing leaked into public pages");
  }

  const unreliable = shops.filter((item) => !parseAddress(item.address).reliable);
  unreliable.forEach((item) => {
    console.log("address kept as a single streetAddress string:", item.name, "—", item.address);
  });

  const cards = shops.map((item) => cardHtml(item, item._slug)).join("\n");
  const count = shops.length === 1 ? "1 listing" : shops.length + " listings";
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "South Seattle beauty directory",
    numberOfItems: shops.length,
    itemListElement: shops.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: SITE + "/shop/" + item._slug + "/",
    })),
  };

  let indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  indexHtml = replaceMarked(indexHtml, "itemlist", '<script type="application/ld+json">' + jsonScript(itemList) + "</script>");
  indexHtml = replaceMarked(indexHtml, "count", count);
  indexHtml = replaceMarked(indexHtml, "cards", cards);
  fs.writeFileSync(path.join(ROOT, "index.html"), indexHtml);

  const redirectMap = {};
  shops.forEach((item) => {
    const dest = "shop/" + item._slug + "/";
    redirectMap[String(item.id)] = dest;
    redirectMap[item._slug] = dest;
  });
  const redirectScript =
    "<script>\n" +
    "(function () {\n" +
    "  var map = " +
    JSON.stringify(redirectMap) +
    ";\n" +
    "  try {\n" +
    "    var q = new URLSearchParams(location.search);\n" +
    "    var id = q.get(\"id\");\n" +
    "    var slug = (q.get(\"slug\") || \"\").toLowerCase();\n" +
    "    if (id === \"12\" || slug === \"11-fingers-and-toe\") {\n" +
    "      location.replace(\"index.html\");\n" +
    "      return;\n" +
    "    }\n" +
    "    var path = (id && map[id]) || (slug && map[slug]);\n" +
    "    if (!path) return;\n" +
    "    var lang = (q.get(\"lang\") || \"\").toLowerCase();\n" +
    "    if ([\"en\", \"vi\", \"es\", \"zh\", \"ko\", \"th\"].indexOf(lang) !== -1) path += \"?lang=\" + lang;\n" +
    "    location.replace(path);\n" +
    "  } catch (e) {}\n" +
    "})();\n" +
    "</script>";
  let shopHtml = fs.readFileSync(path.join(ROOT, "shop.html"), "utf8");
  shopHtml = replaceMarked(shopHtml, "redirect", redirectScript);
  fs.writeFileSync(path.join(ROOT, "shop.html"), shopHtml);

  const shopRoot = path.join(ROOT, "shop");
  fs.mkdirSync(shopRoot, { recursive: true });
  const keep = new Set(shops.map((item) => item._slug));
  fs.readdirSync(shopRoot, { withFileTypes: true }).forEach((ent) => {
    if (!ent.isDirectory()) return;
    if (!keep.has(ent.name)) fs.rmSync(path.join(shopRoot, ent.name), { recursive: true, force: true });
  });
  shops.forEach((item) => {
    const dir = path.join(shopRoot, item._slug);
    fs.mkdirSync(dir, { recursive: true });
    const html = shopPage(item, item._slug);
    if (/\bAI\b/.test(html)) throw new Error("Blocked product wording in " + item._slug);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const parsed = JSON.parse(ld[1]);
    if (!parsed.name || !parsed["@type"] || !parsed.url) throw new Error("Bad JSON-LD for " + item.name);
    if (parsed.image) throw new Error("Unexpected image on " + item.name);
    fs.writeFileSync(path.join(dir, "index.html"), html);
  });

  const urls = [SITE + "/"].concat(shops.map((item) => SITE + "/shop/" + item._slug + "/"));
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((loc) => "  <url><loc>" + loc + "</loc></url>").join("\n") +
    "\n</urlset>\n";
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

  const robots =
    "# This file is served under the project site path.\n" +
    "# Google fetches robots.txt from the domain root, not from a project subpath.\n" +
    "User-agent: *\n" +
    "Allow: /\n" +
    "\n" +
    "Sitemap: " +
    SITE +
    "/sitemap.xml\n";
  fs.writeFileSync(path.join(ROOT, "robots.txt"), robots);

  const lines = [
    "# South Seattle beauty directory",
    "",
    "Blades of Grass lists beauty shops around South Seattle. Names, addresses, and phone numbers below are the public listings. The hidden demo listing is not included.",
    "",
    "Home: " + SITE + "/",
    "",
    "## Shops",
    "",
  ];
  shops.forEach((item) => {
    const parsed = parseAddress(item.address);
    const where = parsed.reliable ? parsed.addressLocality + ", " + parsed.addressRegion : item.address || "";
    const bits = [item.category, where, item.address, formatPhone(item.phone)].filter(Boolean);
    lines.push("- [" + item.name + "](" + SITE + "/shop/" + item._slug + "/): " + bits.join(". ") + ".");
  });
  lines.push("");
  fs.writeFileSync(path.join(ROOT, "llms.txt"), lines.join("\n"));

  const home = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  if (!home.includes("Stop 4 Nails") || !home.includes("Hair Nation")) {
    throw new Error("Home HTML is missing expected shop names");
  }
  if (/11 Fingers and Toe/.test(home) || /11-fingers-and-toe/.test(home)) {
    throw new Error("Demo listing is in the home HTML");
  }
  JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

  console.log("public shops:", shops.length);
  console.log("sitemap urls:", urls.length, "(home + shops)");
  shops.forEach((item) => console.log(item.id, item._slug, schemaType(item.category)));
}

main();
