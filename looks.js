/**
 * Photo-first directory helpers. Pages always render this look.
 * Old ?look= query params are ignored.
 *
 * Image slots call mountSlot(). A real shop photo replaces the
 * category art when listing.photoUrl (or shop.photoUrl) is set.
 */
(function (root) {

  var CATS = {
    "Hair Salon": { key: "hair", label: "Hair", color: "#1f6b4a", soft: "#e4f1ea", ink: "#143d2c" },
    "Barber Shop": { key: "barber", label: "Barber", color: "#1d4e89", soft: "#e5eef8", ink: "#14365f" },
    "Nail Salon": { key: "nails", label: "Nails", color: "#9d3048", soft: "#f8e7ec", ink: "#6e2233" },
    "Spa / Esthetics": { key: "spa", label: "Spa", color: "#0e7c78", soft: "#e3f4f3", ink: "#0c4f4c" },
    "Massage": { key: "massage", label: "Massage", color: "#b8612d", soft: "#f8eee6", ink: "#7a3f1c" },
    "Brows / Lashes": { key: "brows", label: "Brows", color: "#68408f", soft: "#f1eaf7", ink: "#452a60" },
    "Makeup": { key: "makeup", label: "Makeup", color: "#a33b6b", soft: "#f8eaf1", ink: "#6d2748" },
    "Skincare": { key: "skin", label: "Skin", color: "#2a6f97", soft: "#e7f2f8", ink: "#1c4c68" },
    "Beauty Salon": { key: "beauty", label: "Beauty", color: "#9a3b2f", soft: "#f8ebe8", ink: "#6a2920" },
    "Wellness / Other": { key: "wellness", label: "Wellness", color: "#3d6b2f", soft: "#eaf3e7", ink: "#29481f" },
  };

  var FALLBACK = { key: "other", label: "Shop", color: "#3d5348", soft: "#e7eee9", ink: "#24362d" };

  function currentLook() {
    return "";
  }

  function currentStyle() {
    return "a";
  }

  var SAMPLES = {
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
  SAMPLES.other = SAMPLES.beauty;

  function sampleFor(item) {
    var meta = categoryMeta(item && item.category);
    var pool = SAMPLES[meta.key] || SAMPLES.beauty;
    var id = parseInt(item && item.id, 10);
    if (isNaN(id)) id = 0;
    return pool[Math.abs(id) % pool.length];
  }

  function bubbleFor(category) {
    var meta = categoryMeta(category);
    var pool = SAMPLES[meta.key] || SAMPLES.beauty;
    return pool[0];
  }

  function categoryMeta(category) {
    if (category && CATS[category]) return CATS[category];
    var copy = {
      key: FALLBACK.key,
      label: category ? String(category) : FALLBACK.label,
      color: FALLBACK.color,
      soft: FALLBACK.soft,
      ink: FALLBACK.ink,
    };
    return copy;
  }

  function svgEl(viewBox, markup, label) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("focusable", "false");
    if (label) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", label);
    } else {
      svg.setAttribute("aria-hidden", "true");
    }
    svg.innerHTML = markup;
    return svg;
  }

  function heroMarkup(key, soft, ink, mid) {
    var common = {
      hair:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<path d="M-20 108c70-62 120 62 190 0s120-62 190 8" fill="none" stroke="' + ink + '" stroke-width="22" stroke-linecap="round"/>' +
        '<path d="M-20 162c78-52 118 58 196 0s120-58 190 6" fill="none" stroke="' + mid + '" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="M-20 206c60-28 120 36 190 4s130-32 200 8" fill="none" stroke="' + ink + '" stroke-width="6" stroke-linecap="round" opacity="0.45"/>',
      barber:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<g transform="rotate(-32 200 140)">' +
        '<rect x="-80" y="-40" width="46" height="420" fill="' + ink + '"/>' +
        '<rect x="10" y="-40" width="28" height="420" fill="' + mid + '"/>' +
        '<rect x="78" y="-40" width="46" height="420" fill="' + ink + '"/>' +
        '<rect x="168" y="-40" width="18" height="420" fill="' + mid + '" opacity="0.85"/>' +
        '<rect x="230" y="-40" width="46" height="420" fill="' + ink + '"/>' +
        "</g>",
      nails:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<rect x="46" y="78" width="62" height="132" rx="30" fill="' + ink + '"/>' +
        '<rect x="128" y="48" width="70" height="168" rx="34" fill="' + mid + '"/>' +
        '<rect x="216" y="70" width="58" height="140" rx="28" fill="' + ink + '" opacity="0.82"/>' +
        '<rect x="292" y="96" width="48" height="112" rx="24" fill="' + mid + '" opacity="0.7"/>',
      spa:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<circle cx="168" cy="150" r="92" fill="none" stroke="' + ink + '" stroke-width="18"/>' +
        '<circle cx="168" cy="150" r="52" fill="none" stroke="' + mid + '" stroke-width="12"/>' +
        '<circle cx="250" cy="118" r="28" fill="' + mid + '" opacity="0.85"/>',
      massage:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<path d="M-10 168c60-90 110-20 160-70s90 20 170-46" fill="none" stroke="' + ink + '" stroke-width="26" stroke-linecap="round"/>' +
        '<path d="M-10 210c80-70 120 10 180-40s100 10 180-30" fill="none" stroke="' + mid + '" stroke-width="14" stroke-linecap="round"/>',
      brows:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<path d="M36 168c28-70 78-78 124-18" fill="none" stroke="' + ink + '" stroke-width="16" stroke-linecap="round"/>' +
        '<path d="M210 150c36-62 86-62 132-8" fill="none" stroke="' + ink + '" stroke-width="16" stroke-linecap="round"/>' +
        '<path d="M70 196c20 16 48 16 70-2" fill="none" stroke="' + mid + '" stroke-width="8" stroke-linecap="round"/>',
      makeup:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<circle cx="176" cy="140" r="78" fill="' + mid + '"/>' +
        '<path d="M176 62a78 78 0 0 1 0 156" fill="' + ink + '"/>' +
        '<circle cx="286" cy="92" r="26" fill="' + ink + '" opacity="0.8"/>',
      skin:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<path d="M150 36c38 52 70 78 70 118a70 70 0 0 1-140 0c0-40 32-66 70-118z" fill="' + mid + '"/>' +
        '<path d="M248 70c22 30 40 46 40 70a40 40 0 0 1-80 0c0-24 18-40 40-70z" fill="' + ink + '" opacity="0.85"/>',
      beauty:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<circle cx="200" cy="140" r="28" fill="' + ink + '"/>' +
        '<circle cx="200" cy="62" r="26" fill="' + mid + '"/>' +
        '<circle cx="268" cy="102" r="26" fill="' + ink + '" opacity="0.75"/>' +
        '<circle cx="246" cy="180" r="26" fill="' + mid + '"/>' +
        '<circle cx="154" cy="180" r="26" fill="' + ink + '" opacity="0.75"/>' +
        '<circle cx="132" cy="102" r="26" fill="' + mid + '"/>',
      wellness:
        '<rect width="400" height="280" fill="' + soft + '"/>' +
        '<path d="M200 228c62-48 86-100 58-156-46 16-62 48-58 86 0-38-12-70-58-86 28 56 4 108 58 156z" fill="' + ink + '"/>' +
        '<path d="M292 196c36-28 48-58 32-90-26 10-36 28-32 50 0-22-8-40-32-50 16 32 2 62 32 90z" fill="' + mid + '"/>',
    };
    return common[key] || common.spa;
  }

  function iconMarkup(key) {
    var paths = {
      hair: '<path d="M3 9c3-4 6 4 9 0s6-4 9 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 15c3-4 6 4 9 0s6-4 9 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      barber: '<path d="M6 3.5v17M12 3.5v17M18 3.5v17" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>',
      nails: '<rect x="3.5" y="8" width="4.5" height="9" rx="2.2" fill="currentColor"/><rect x="9.5" y="5" width="5" height="12" rx="2.4" fill="currentColor" opacity="0.8"/><rect x="16" y="9" width="4.2" height="8" rx="2" fill="currentColor" opacity="0.55"/>',
      spa: '<circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="6.6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.75"/>',
      massage: '<path d="M3 16c3.2-6 6.2-6 8.4-2.2S16.6 18 21 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      brows: '<path d="M3 15c2.4-5 5.2-5.2 7.6-1.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M13 14c2.2-4.2 5-4.4 8-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      makeup: '<circle cx="12" cy="12" r="6.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 5.8v12.4" stroke="currentColor" stroke-width="1.5"/>',
      skin: '<path d="M12 3.8c2.6 3.6 4.6 5.4 4.6 8.2a4.6 4.6 0 0 1-9.2 0c0-2.8 2-4.6 4.6-8.2z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
      beauty: '<circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="6.2" r="1.7" fill="currentColor"/><circle cx="17" cy="9.4" r="1.7" fill="currentColor" opacity="0.75"/><circle cx="15.2" cy="15.6" r="1.7" fill="currentColor"/><circle cx="8.8" cy="15.6" r="1.7" fill="currentColor" opacity="0.75"/><circle cx="7" cy="9.4" r="1.7" fill="currentColor"/>',
      wellness: '<path d="M12 20c4.4-3.4 5.6-7 3.8-11-3.2 1.1-4.2 3.2-3.8 5.8 0-2.6-.6-4.7-3.8-5.8 1.8 4 .6 7.6 3.8 11z" fill="currentColor"/>',
      other: '<circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    };
    return paths[key] || paths.other;
  }

  function photoUrlOf(item) {
    if (!item) return "";
    var raw = item.photoUrl || item.photo || "";
    if (raw && typeof raw === "object") raw = raw.url || raw.src || "";
    var value = String(raw || "").trim();
    return value;
  }

  /**
   * Fill an element with either the shop photo or category art.
   * mode: "hero" (large card / shop), "icon" (small badge), "block" (color field), "cover"
   */
  function mountSlot(el, item, mode) {
    if (!el) return;
    var meta = categoryMeta(item && item.category);
    var kind = mode || "hero";
    el.classList.add("photo-slot", "photo-slot-" + kind);
    el.setAttribute("data-cat", meta.key);
    el.style.setProperty("--cat", meta.color);
    el.style.setProperty("--cat-soft", meta.soft);
    el.style.setProperty("--cat-ink", meta.ink);
    el.innerHTML = "";

    var photo = photoUrlOf(item);
    if (photo) {
      var img = document.createElement("img");
      img.src = photo;
      img.alt = (item && item.name ? item.name + " — " : "") + "shop photo";
      img.loading = "lazy";
      el.appendChild(img);
      el.classList.add("has-photo");
      return;
    }

    if (currentStyle() && kind === "hero") {
      var sample = sampleFor(item);
      var sampleImg = document.createElement("img");
      sampleImg.src = sample.src;
      sampleImg.alt = sample.alt;
      sampleImg.loading = "lazy";
      sampleImg.decoding = "async";
      el.appendChild(sampleImg);
      el.classList.add("has-sample");
      var tag = document.createElement("span");
      tag.className = "slot-note sample-tag";
      tag.textContent = "Sample photo";
      el.appendChild(tag);
      return;
    }

    if (kind === "icon") {
      el.appendChild(svgEl("0 0 24 24", iconMarkup(meta.key), ""));
      return;
    }

    var label = meta.label + " category illustration";
    var mid = meta.color;
    el.appendChild(svgEl("0 0 400 280", heroMarkup(meta.key, meta.soft, meta.ink, mid), label));

    if (kind === "hero") {
      var note = document.createElement("span");
      note.className = "slot-note";
      note.textContent = "Category illustration";
      el.appendChild(note);
    }

    if (kind === "block" || kind === "cover") {
      var word = document.createElement("span");
      word.className = "slot-word";
      word.textContent = (item && item.category) || meta.label;
      el.appendChild(word);
    }
  }

  function withLook(href) {
    if (!href) return href;
    var url;
    try {
      url = new URL(href, root.location.href);
    } catch (err) {
      return href;
    }
    url.searchParams.delete("look");
    url.searchParams.delete("bare");
    url.searchParams.delete("style");
    var file = url.pathname.split("/").pop() || "index.html";
    return file + url.search + url.hash;
  }

  function trustBadge(item) {
    if (!item) return "";
    if (item.verifiedByBog === true) return "Verified by BoG";
    if (item.confirmed === true) return "Claimed";
    return "";
  }

  function placeLabel(address) {
    if (!address) return "";
    var text = String(address).trim();
    var paired = text.match(/,\s*([^,]+?),\s*([A-Z]{2})\b/);
    if (paired) return paired[1].trim() + ", " + paired[2];
    var loose = text.match(/,\s*([^,]+?)\s+([A-Z]{2})\b/);
    if (loose) return loose[1].trim() + ", " + loose[2];
    return text;
  }

  function hoursRows(text) {
    var raw = String(text || "").trim();
    if (!raw) return null;
    var parts = raw.split(/\s*;\s*|\s+\/\s+/).map(function (part) {
      return part.trim();
    }).filter(Boolean);
    var day = /^(mon|tue|wed|thu|fri|sat|sun)/i;
    if (parts.length < 2 || !parts.every(function (part) { return day.test(part); })) return null;
    return parts.map(function (part) {
      var split = part.match(/^(.+?)\s+(\d.*|closed.*)$/i);
      if (!split) return { label: part, value: "" };
      return { label: split[1].trim(), value: split[2].trim() };
    });
  }

  var HERO = {
    src: "images/styles/hero-seattle-skyline-blue.jpg",
    alt: "Seattle skyline with the Space Needle and Mount Rainier under a clear blue sky",
    author: "Aarav Chopra",
    fileUrl: "https://www.pexels.com/photo/seattle-skyline-with-space-needle-and-mount-rainier-34624718/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    subtle: true,
  };

  function heroFor() {
    return HERO;
  }

  function boot() {
    document.documentElement.setAttribute("data-look", "1");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  root.BogLooks = {
    currentLook: currentLook,
    currentStyle: currentStyle,
    heroFor: heroFor,
    categoryMeta: categoryMeta,
    bubbleFor: bubbleFor,
    mountSlot: mountSlot,
    withLook: withLook,
    trustBadge: trustBadge,
    placeLabel: placeLabel,
    hoursRows: hoursRows,
    HERO: HERO,
  };
})(typeof window !== "undefined" ? window : this);
