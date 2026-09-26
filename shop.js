(function () {
  const statusEl = document.getElementById("shop-status");
  const shopEl = document.getElementById("shop");
  const nameEl = document.getElementById("shop-name");
  const badgesEl = document.getElementById("shop-badges");
  const verifiedEl = document.getElementById("shop-verified");
  const oneLinerEl = document.getElementById("shop-oneliner");
  const offerEl = document.getElementById("shop-offer");
  const ratingEl = document.getElementById("shop-rating");
  const addressEl = document.getElementById("shop-address");
  const walkInsEl = document.getElementById("shop-walkins");
  const hoursEl = document.getElementById("shop-hours");
  const actionsEl = document.getElementById("shop-actions");
  const socialsEl = document.getElementById("shop-socials");
  const aggregateNoteEl = document.getElementById("shop-aggregate-note");
  const storySection = document.getElementById("shop-story");
  const storyText = document.getElementById("shop-story-text");
  const servicesSection = document.getElementById("shop-services");
  const serviceChips = document.getElementById("shop-service-chips");
  const photosSection = document.getElementById("shop-photos");
  const photoFeed = document.getElementById("shop-photo-feed");
  const reelSection = document.getElementById("shop-reel");
  const reelEl = document.getElementById("shop-reel-slideshow");
  const reviewsSection = document.getElementById("shop-reviews");
  const reviewList = document.getElementById("shop-review-list");
  const demoBannerEl = document.getElementById("shop-demo-banner");
  const demoBannerLabelEl = document.getElementById("shop-demo-banner-label");
  const langSwitchEl = document.getElementById("shop-lang");
  const localeNoteEl = document.getElementById("shop-locale-note");
  const demoNoteEl = document.getElementById("shop-demo-note");
  const backLinkEl = document.getElementById("shop-back-link");
  const footerBackEl = document.getElementById("shop-footer-back");
  const storyHeadingEl = document.getElementById("shop-story-heading");
  const servicesHeadingEl = document.getElementById("shop-services-heading");

  const LOCALES =
    window.BogPhrases && Array.isArray(window.BogPhrases.LOCALES)
      ? window.BogPhrases.LOCALES.slice()
      : ["en", "vi", "es", "zh", "ko", "th"];
  let currentListing = null;
  let currentEnrichment = null;
  let activeLocale = "en";

  function params() {
    const q = new URLSearchParams(window.location.search);
    const idRaw = (q.get("id") || "").trim();
    const slug = (q.get("slug") || "").trim().toLowerCase();
    const id = idRaw === "" ? null : Number(idRaw);
    const lang = (q.get("lang") || "").trim().toLowerCase();
    return {
      id: Number.isFinite(id) ? id : null,
      slug,
      lang: LOCALES.indexOf(lang) !== -1 ? lang : "",
    };
  }

  function hasValue(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === "number") return !Number.isNaN(v);
    return String(v).trim() !== "";
  }

  function slugify(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizePhone(phone) {
    if (!phone) return "";
    const digits = String(phone).replace(/[^\d+]/g, "");
    return digits.startsWith("+") ? digits : digits.replace(/^1?/, "+1");
  }

  function formatPhone(phone) {
    if (!phone) return "";
    const d = String(phone).replace(/\D/g, "");
    const local = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
    if (local.length === 10) {
      return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
    }
    return phone;
  }

  function isLive(item) {
    if (item.status === "live") return true;
    if (item.status === "pending") return false;
    return !!item.confirmed;
  }

  /**
   * Canonical model (source of truth):
   * 1. Card snap = basics (name, phone, directions, hours).
   * 2. Shop page always shows EN|VI|ES|ZH|KO|TH switch (skeletons included).
   *    Chrome and action labels come from i18n/phrases.js via t(key).
   *    Story/vibe body is never machine-translated. Missing locale falls
   *    back to EN for that key only.
   * 3. Interview unlocks story + confirmed links; empty slots stay hidden.
   * 4. Action row (real hrefs only): Call, Text (textFirst prefers Text),
   *    Directions, Reviews on Google, Share, then Website/IG/FB/TikTok/
   *    Email/Booking/Yelp when filled + unlocked.
   * 5. SHELF: contested enrichment hidden until a toggle is explicitly true.
   * 6. Owner point cards (VI/ES) are a separate product — not this site.
   *
   * Optional roster (null/absent = do not render; never invent URLs on real shops).
   */
  const SHELF_TOGGLE_KEYS = [
    "showStory",
    "showReviews",
    "showReel",
    "showGoogle",
    "showRating",
    "showPhotos",
    "showServices",
    "showBooking",
    "showWebsite",
    "showInstagram",
    "showIg",
    "showTiktok",
    "showTikTok",
    "showFacebook",
    "showEmail",
    "showYelp",
    "showLanguages",
    "showKnownFor",
  ];

  /** Shelf-safe: contested sections render only when the toggle is explicitly true. */
  function toggleOn(toggles, key) {
    if (!toggles || toggles[key] === undefined || toggles[key] === null) return false;
    return toggles[key] === true;
  }

  function socialToggleOn(toggles, keys) {
    return keys.some((key) => toggleOn(toggles, key));
  }

  function isDemoShop(shop) {
    return !!(shop && (shop.isDemo === true || shop.demo === true));
  }

  function isHiddenFromPublic(shop) {
    return !!(shop && (shop.hidden === true || isDemoShop(shop)));
  }

  function directoryHref() {
    if (window.BogLooks && window.BogLooks.withLook) return window.BogLooks.withLook("index.html");
    return "index.html";
  }

  const THEME_COLOR_DEFAULT = "#1a3a2a";
  const THEME_COLOR_BEAUTY = "#f4eee6";

  /** DEMO mock only. Stop 4 / real shops keep the default green theme until Kenny approves. */
  function applyBeautyTheme(on) {
    const root = document.documentElement;
    if (on) {
      root.setAttribute("data-theme", "beauty");
      document.body.classList.add("theme-beauty");
    } else {
      root.removeAttribute("data-theme");
      document.body.classList.remove("theme-beauty");
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", on ? THEME_COLOR_BEAUTY : THEME_COLOR_DEFAULT);
    }
  }

  /** Safe extras: show when a real href exists unless the toggle is explicitly false. */
  function extraLinkOn(toggles, key, href) {
    if (!isUsableHref(href)) return false;
    if (!toggles || toggles[key] === undefined || toggles[key] === null) return true;
    return toggles[key] === true;
  }

  function t(key) {
    if (window.BogPhrases && typeof window.BogPhrases.t === "function") {
      return window.BogPhrases.t(key, activeLocale);
    }
    return "";
  }

  function readStoredLocale() {
    try {
      const stored = localStorage.getItem("bog-shop-lang");
      if (LOCALES.indexOf(stored) !== -1) return stored;
    } catch (err) {}
    try {
      const stored = sessionStorage.getItem("bog-shop-lang");
      if (LOCALES.indexOf(stored) !== -1) return stored;
    } catch (err) {}
    return "";
  }

  function persistLocale(locale) {
    try {
      localStorage.setItem("bog-shop-lang", locale);
    } catch (err) {}
    try {
      sessionStorage.setItem("bog-shop-lang", locale);
    } catch (err) {}
    if (window.history && window.history.replaceState) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", locale);
        window.history.replaceState({}, "", url);
      } catch (err) {}
    }
    document.documentElement.lang = locale;
  }

  /** Strings are English source. Objects may key en/vi/es/zh/ko/th. Never invent a translation. */
  function localeBundle(value, locale) {
    if (value == null) return { text: "", fallback: false };
    if (typeof value === "object" && !Array.isArray(value)) {
      const hit = hasValue(value[locale]) ? String(value[locale]).trim() : "";
      if (hit) return { text: hit, fallback: false };
      const en = hasValue(value.en) ? String(value.en).trim() : "";
      return { text: en, fallback: locale !== "en" && !!en };
    }
    const text = hasValue(value) ? String(value).trim() : "";
    return { text: text, fallback: locale !== "en" && !!text };
  }

  function localeNote(locale) {
    const names = {
      vi: "Vietnamese",
      es: "Spanish",
      zh: "Simplified Chinese",
      ko: "Korean",
      th: "Thai",
    };
    const label = names[locale];
    if (!label) return "";
    return "Showing English — " + label + " isn’t on this page yet. We don’t guess a translation.";
  }

  function applyChrome() {
    if (backLinkEl) backLinkEl.textContent = "← " + t("backToDirectory");
    if (footerBackEl) footerBackEl.textContent = t("backToDirectory");
    if (langSwitchEl) langSwitchEl.setAttribute("aria-label", t("language"));
    if (verifiedEl) verifiedEl.textContent = t("verifiedByBog");
    if (storyHeadingEl) storyHeadingEl.textContent = t("story");
    if (servicesHeadingEl) servicesHeadingEl.textContent = t("services");
    if (demoBannerLabelEl) demoBannerLabelEl.textContent = t("demoTemplate");
    renderLangSwitch(activeLocale);
  }

  function renderLangSwitch(active) {
    if (!langSwitchEl) return;
    langSwitchEl.innerHTML = "";
    langSwitchEl.classList.remove("hidden");
    LOCALES.forEach((loc) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-btn";
      btn.textContent = loc.toUpperCase();
      btn.setAttribute("aria-pressed", loc === active ? "true" : "false");
      btn.addEventListener("click", function () {
        activeLocale = loc;
        persistLocale(loc);
        applyChrome();
        if (currentListing) render(currentListing, currentEnrichment || emptyEnrichment());
      });
      langSwitchEl.appendChild(btn);
    });
  }

  function resolveToggles(shop, enrichment) {
    const fromListing = {};
    SHELF_TOGGLE_KEYS.forEach((key) => {
      if (shop && shop[key] !== undefined) fromListing[key] = shop[key];
    });
    return Object.assign({}, fromListing, (enrichment && enrichment.toggles) || {});
  }

  function starLabel(rating) {
    const n = Number(rating);
    if (Number.isNaN(n)) return "";
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function findListing(listings, { id, slug }) {
    if (id != null) {
      return listings.find((item) => Number(item.id) === id) || null;
    }
    if (!slug) return null;
    return (
      listings.find((item) => {
        const itemSlug = (item.slug || slugify(item.name)).toLowerCase();
        return itemSlug === slug;
      }) || null
    );
  }

  function emptyEnrichment() {
    return {
      story: null,
      photos: [],
      services: [],
      reviews: [],
      googleRating: null,
      reviewCount: null,
      googlePlaceId: null,
      googleMapsUrl: null,
      googleReviewsUrl: null,
      facebook: null,
      email: null,
      yelpUrl: null,
      appleMapsUrl: null,
      languages: null,
      pageLocale: null,
      translateUrl: null,
      textFirst: false,
      isDemo: false,
      demo: false,
      demoNote: null,
      toggles: {},
      reel: {},
    };
  }

  function loadEnrichment(id) {
    if (id == null) return Promise.resolve(emptyEnrichment());
    return fetch("shops/" + encodeURIComponent(id) + ".json")
      .then((r) => {
        if (r.status === 404 || !r.ok) return emptyEnrichment();
        return r.json();
      })
      .catch(() => emptyEnrichment());
  }

  function reviewText(review) {
    if (!review || typeof review !== "object") return "";
    const text = review.text || review.quote || review.body || review.review;
    return hasValue(text) ? String(text).trim() : "";
  }

  function reviewAuthor(review) {
    if (!review || typeof review !== "object") return "";
    const name = review.author || review.name;
    return hasValue(name) ? String(name).trim() : "";
  }

  function reviewStars(review) {
    if (!review || typeof review !== "object") return null;
    if (typeof review.stars === "number") return review.stars;
    if (typeof review.rating === "number") return review.rating;
    return null;
  }

  function reviewHasContent(review) {
    if (!review || typeof review !== "object") return false;
    return (
      hasValue(reviewText(review)) ||
      hasValue(reviewAuthor(review)) ||
      reviewStars(review) != null ||
      hasValue(review.photo || review.photoUrl)
    );
  }

  function isImageUrl(url) {
    return /\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i.test(String(url || ""));
  }

  function httpHref(value) {
    if (!hasValue(value)) return "";
    const v = String(value).trim();
    return /^https?:\/\//i.test(v) ? v : "";
  }

  function mailtoHref(value) {
    if (!hasValue(value)) return "";
    const v = String(value).trim();
    if (/^mailto:/i.test(v)) return v;
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return "mailto:" + v;
    return "";
  }

  function isUsableHref(href) {
    if (!hasValue(href)) return false;
    return /^(https?:\/\/|tel:|sms:|mailto:)/i.test(String(href).trim());
  }

  function socialHref(value, kind) {
    const v = String(value || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    if (kind === "instagram" && /^@?[A-Za-z0-9._]+$/.test(v)) {
      return "https://instagram.com/" + v.replace(/^@/, "");
    }
    if (kind === "tiktok" && /^@?[A-Za-z0-9._]+$/.test(v)) {
      return "https://www.tiktok.com/@" + v.replace(/^@/, "");
    }
    return "";
  }

  const PAGES_SHOP = "https://mack-alt.github.io/bog-beauty-directory/shop.html";

  function canonicalShopUrl(shop) {
    const fallbackQuery =
      shop && shop.id != null && shop.id !== ""
        ? "id=" + encodeURIComponent(shop.id)
        : shop && hasValue(shop.slug)
          ? "slug=" + encodeURIComponent(String(shop.slug).trim())
          : "";
    const fallback = fallbackQuery ? PAGES_SHOP + "?" + fallbackQuery : PAGES_SHOP;
    try {
      let base = PAGES_SHOP;
      const protocol = window.location && window.location.protocol;
      if (protocol === "http:" || protocol === "https:") {
        const loc = new URL(window.location.href);
        if (/shop\.html$/i.test(loc.pathname)) {
          base = loc.origin + loc.pathname;
        } else {
          base = loc.origin + loc.pathname.replace(/[^/]*$/, "") + "shop.html";
        }
      }
      const url = new URL(base);
      url.search = "";
      url.hash = "";
      if (shop && shop.id != null && shop.id !== "") {
        url.searchParams.set("id", String(shop.id));
      } else if (shop && hasValue(shop.slug)) {
        url.searchParams.set("slug", String(shop.slug).trim());
      }
      return url.toString();
    } catch (err) {
      return fallback;
    }
  }

  function mapHref(shop) {
    const explicit = httpHref(shop && shop.googleMapsUrl);
    if (explicit) return explicit;
    if (shop && hasValue(shop.googlePlaceId)) {
      const query = encodeURIComponent(shop.name || shop.address || "place");
      return (
        "https://www.google.com/maps/search/?api=1&query=" +
        query +
        "&query_place_id=" +
        encodeURIComponent(String(shop.googlePlaceId).trim())
      );
    }
    if (shop && hasValue(shop.address)) {
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(shop.address);
    }
    return "";
  }

  function photoSrc(photo) {
    if (typeof photo === "string") return photo.trim();
    if (photo && typeof photo === "object") {
      return String(photo.url || photo.src || photo.photoUrl || "").trim();
    }
    return "";
  }

  function photoAlt(photo, fallback) {
    if (photo && typeof photo === "object" && hasValue(photo.alt)) {
      return String(photo.alt).trim();
    }
    return fallback;
  }

  function serviceLabel(service) {
    if (typeof service === "string") return service.trim();
    if (service && typeof service === "object") {
      return String(service.name || service.label || "").trim();
    }
    return "";
  }

  function appendBadge(text, className) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    badgesEl.appendChild(span);
  }

  function actionLink(href, label, extraClass) {
    const a = document.createElement("a");
    a.className = "btn " + (extraClass || "btn-secondary");
    a.href = href;
    a.textContent = label;
    return a;
  }

  /** Basics-safe link-out. Not a SHELF toggle — show when place id or URL is present. */
  function googleReviewsHref(shop) {
    const explicit = httpHref(shop && shop.googleReviewsUrl) || httpHref(shop && shop.googleMapsUrl);
    if (explicit) return explicit;
    const placeId = shop && shop.googlePlaceId;
    if (!hasValue(placeId)) return "";
    const query = encodeURIComponent(shop.name || shop.address || "place");
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      query +
      "&query_place_id=" +
      encodeURIComponent(String(placeId).trim())
    );
  }

  function shareShop(event, url, title) {
    if (!url) return;
    if (navigator.share) {
      event.preventDefault();
      navigator.share({ title: title, text: title, url: url }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      event.preventDefault();
      navigator.clipboard.writeText(url).then(function () {
        const el = event.currentTarget;
        if (!el) return;
        const prev = el.textContent;
        el.textContent = "Link copied";
        window.setTimeout(function () {
          el.textContent = prev;
        }, 1600);
      }).catch(function () {});
    }
  }

  function renderReviewCard(review) {
    const card = document.createElement("article");
    card.className = "review-card";

    const author = reviewAuthor(review);
    const text = reviewText(review);
    const rating = reviewStars(review);
    const photo = photoSrc(review.photo || review.photoUrl);

    if (rating != null) {
      const stars = document.createElement("p");
      stars.className = "rating";
      const s = document.createElement("span");
      s.className = "stars";
      s.setAttribute("aria-hidden", "true");
      s.textContent = starLabel(rating);
      stars.appendChild(s);
      const num = document.createElement("span");
      num.className = "rating-num";
      num.textContent = Number(rating).toFixed(1);
      stars.appendChild(num);
      card.appendChild(stars);
    }

    if (text) {
      const p = document.createElement("p");
      p.className = "review-text";
      p.textContent = text;
      card.appendChild(p);
    }

    if (author) {
      const by = document.createElement("p");
      by.className = "review-author";
      by.textContent = author;
      card.appendChild(by);
    }

    if (hasValue(review.source)) {
      const src = document.createElement("p");
      src.className = "review-source";
      src.textContent = String(review.source).trim();
      card.appendChild(src);
    }

    if (photo) {
      const img = document.createElement("img");
      img.src = photo;
      img.alt = photoAlt(review.photo, author ? "Photo from " + author : "Review photo");
      img.loading = "lazy";
      card.appendChild(img);
    }

    return card;
  }

  function renderReel(reviews, storyboard, shopName) {
    reelEl.innerHTML = "";
    const steps =
      Array.isArray(storyboard) && storyboard.length
        ? storyboard
        : reviews.map((_, quoteIndex) => ({ quoteIndex: quoteIndex, sec: 5 }));

    const viewport = document.createElement("div");
    viewport.className = "reel-viewport";

    const track = document.createElement("div");
    track.className = "reel-track";

    const slides = [];
    steps.forEach((step) => {
      const slide = document.createElement("div");
      slide.className = "reel-slide";
      if (step && step.endCard) {
        const end = document.createElement("article");
        end.className = "review-card reel-end-card";
        const heading = document.createElement("p");
        heading.className = "reel-end-name";
        heading.textContent = shopName;
        end.appendChild(heading);
        slide.appendChild(end);
        slides.push(slide);
      } else if (step && Number.isInteger(step.quoteIndex) && reviews[step.quoteIndex]) {
        slide.appendChild(renderReviewCard(reviews[step.quoteIndex]));
        slides.push(slide);
      }
      if (slide.childNodes.length) track.appendChild(slide);
    });
    if (!slides.length) return;
    viewport.appendChild(track);

    const controls = document.createElement("div");
    controls.className = "reel-controls";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "reel-nav";
    prev.setAttribute("aria-label", "Previous highlight");
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.type = "button";
    next.className = "reel-nav";
    next.setAttribute("aria-label", "Next highlight");
    next.textContent = "›";

    const dots = document.createElement("div");
    dots.className = "reel-dots";
    dots.setAttribute("role", "tablist");

    let index = 0;
    let timer = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function schedule() {
      clearTimer();
      if (reduceMotion || slides.length < 2) return;
      const step = steps[index] || {};
      const sec = Number(step.sec);
      const wait = Number.isFinite(sec) && sec > 0 ? sec * 1000 : 5000;
      timer = setTimeout(() => go(index + 1), wait);
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      Array.from(dots.children).forEach((dot, n) => {
        dot.setAttribute("aria-selected", n === index ? "true" : "false");
      });
      schedule();
    }

    slides.forEach((_, n) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "reel-dot";
      dot.setAttribute("aria-label", "Highlight " + (n + 1));
      dot.addEventListener("click", () => go(n));
      dots.appendChild(dot);
    });

    prev.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);

    reelEl.appendChild(viewport);
    reelEl.appendChild(controls);
    go(0);
  }

  function fail(message) {
    statusEl.textContent = message;
    shopEl.classList.add("hidden");
  }

  function hideEl(el) {
    if (!el) return;
    el.classList.add("hidden");
  }

  function render(listing, enrichment) {
    currentListing = listing;
    currentEnrichment = enrichment;
    const shop = Object.assign({}, listing, enrichment);
    const toggles = resolveToggles(shop, enrichment);
    const name = shop.name || "Shop";
    const demo = isDemoShop(shop);
    const lookOn = !!document.documentElement.getAttribute("data-look");
    applyBeautyTheme(demo && !lookOn);
    document.title = (demo ? "DEMO — " : "") + name + " — Blades of Grass";
    nameEl.textContent = name;

    hideEl(oneLinerEl);
    hideEl(offerEl);
    hideEl(ratingEl);
    hideEl(addressEl);
    hideEl(walkInsEl);
    hideEl(hoursEl);
    hideEl(storySection);
    hideEl(servicesSection);
    hideEl(photosSection);
    hideEl(reelSection);
    hideEl(reviewsSection);
    hideEl(aggregateNoteEl);
    hideEl(demoNoteEl);
    hideEl(localeNoteEl);
    if (ratingEl) ratingEl.innerHTML = "";

    applyChrome();

    if (demoBannerEl) {
      if (demo) demoBannerEl.classList.remove("hidden");
      else hideEl(demoBannerEl);
    }

    badgesEl.innerHTML = "";
    if (demo) {
      appendBadge(t("demoTemplate"), "demo-badge");
    }
    if (shop.category) {
      appendBadge(shop.category, "cat-badge");
    }
    if (lookOn && window.BogLooks) {
      const trust = window.BogLooks.trustBadge(shop);
      if (trust) appendBadge(trust, "trust-badge");
      verifiedEl.classList.add("hidden");
    } else if (isLive(shop)) {
      appendBadge("Live", "status-badge status-live");
    } else {
      appendBadge("Pending confirm", "status-badge status-pending");
    }
    if (!lookOn && shop.verifiedByBog === true) {
      verifiedEl.classList.remove("hidden");
    } else if (!lookOn) {
      verifiedEl.classList.add("hidden");
    }

    const offer = localeBundle(shop.offer || shop.offerHighlight, activeLocale);
    if (offerEl && hasValue(offer.text)) {
      offerEl.innerHTML = "";
      const lab = document.createElement("span");
      lab.className = "offer-label";
      lab.textContent = shop.loyalty === true ? t("loyalty") : t("offer");
      offerEl.appendChild(lab);
      offerEl.appendChild(document.createTextNode(offer.text));
      offerEl.classList.remove("hidden");
    }

    const oneLiner = localeBundle(shop.oneLiner || shop.blurb, activeLocale);
    if (hasValue(oneLiner.text) && oneLiner.text !== offer.text) {
      oneLinerEl.textContent = oneLiner.text;
      oneLinerEl.classList.remove("hidden");
    }

    const showGoogle =
      socialToggleOn(toggles, ["showGoogle", "showRating"]);
    const rating = typeof shop.googleRating === "number" ? shop.googleRating : null;
    const reviewCount = shop.reviewCount != null ? shop.reviewCount : shop.googleReviewCount;
    if (rating != null && showGoogle) {
      ratingEl.innerHTML = "";
      const stars = document.createElement("span");
      stars.className = "stars";
      stars.setAttribute("aria-hidden", "true");
      stars.textContent = starLabel(rating);
      ratingEl.appendChild(stars);
      const num = document.createElement("span");
      num.className = "rating-num";
      num.textContent = Number(rating).toFixed(1);
      ratingEl.appendChild(num);
      if (hasValue(reviewCount)) {
        const count = document.createElement("span");
        count.className = "rating-count";
        count.textContent =
          "(" + reviewCount + " review" + (Number(reviewCount) === 1 ? "" : "s") + ")";
        ratingEl.appendChild(count);
      }
      ratingEl.classList.remove("hidden");
    }

    if (hasValue(shop.address)) {
      addressEl.textContent = shop.address;
      addressEl.classList.remove("hidden");
    }

    const walkIns = localeBundle(shop.walkIns, activeLocale);
    if (walkInsEl && hasValue(walkIns.text)) {
      walkInsEl.innerHTML = "";
      const lab = document.createElement("span");
      lab.className = "owner-label";
      lab.textContent = t("walkIns") + ": ";
      walkInsEl.appendChild(lab);
      walkInsEl.appendChild(document.createTextNode(walkIns.text));
      walkInsEl.classList.remove("hidden");
    }

    const hours = localeBundle(shop.hours, activeLocale);
    if (hasValue(hours.text)) {
      hoursEl.innerHTML = "";
      const lab = document.createElement("span");
      lab.className = "owner-label";
      lab.textContent = t("hours") + ": ";
      hoursEl.appendChild(lab);
      hoursEl.appendChild(document.createTextNode(hours.text));
      hoursEl.classList.remove("hidden");
    }

    if (demo && hasValue(shop.demoNote) && demoNoteEl) {
      demoNoteEl.textContent = String(shop.demoNote).trim();
      demoNoteEl.classList.remove("hidden");
    }

    actionsEl.innerHTML = "";
    actionsEl.classList.remove("hidden");
    socialsEl.innerHTML = "";
    socialsEl.classList.add("hidden");

    function appendAction(href, label, extraClass, opts) {
      if (!isUsableHref(href)) return;
      const a = actionLink(href, label, extraClass);
      const o = opts || {};
      if (o.external) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      if (typeof o.onClick === "function") {
        a.addEventListener("click", o.onClick);
      }
      actionsEl.appendChild(a);
    }

    if (hasValue(shop.phone)) {
      const tel = normalizePhone(shop.phone);
      if (tel) {
        const callHref = "tel:" + tel;
        const textHref = "sms:" + tel;
        if (shop.textFirst === true) {
          appendAction(textHref, t("text"), "btn-primary");
          appendAction(callHref, t("call"), "btn-secondary");
        } else {
          appendAction(callHref, t("call"), "btn-primary");
          appendAction(textHref, t("text"), "btn-secondary");
        }
      }
    }
    appendAction(mapHref(shop), t("directions"), "btn-secondary", { external: true });
    appendAction(googleReviewsHref(shop), t("reviewsOnGoogle"), "btn-primary btn-reviews", {
      external: true,
    });

    const shareUrl = canonicalShopUrl(shop);
    appendAction(shareUrl, t("share"), "btn-secondary", {
      onClick: function (event) {
        shareShop(event, shareUrl, name);
      },
    });

    const websiteHref = httpHref(shop.website);
    const bookingHref = httpHref(shop.bookingUrl) || (toggleOn(toggles, "showBooking") ? websiteHref : "");
    if (toggleOn(toggles, "showBooking")) {
      appendAction(bookingHref, t("book"), "btn-primary", { external: true });
    }
    if (
      toggleOn(toggles, "showWebsite") &&
      websiteHref &&
      !(toggleOn(toggles, "showBooking") && websiteHref === bookingHref)
    ) {
      appendAction(websiteHref, t("website"), "btn-secondary", { external: true });
    }
    if (socialToggleOn(toggles, ["showInstagram", "showIg"])) {
      appendAction(socialHref(shop.instagram, "instagram"), t("instagram"), "btn-secondary", {
        external: true,
      });
    }
    if (toggleOn(toggles, "showFacebook")) {
      appendAction(httpHref(shop.facebook), "Facebook", "btn-secondary", { external: true });
    }
    if (socialToggleOn(toggles, ["showTiktok", "showTikTok"])) {
      appendAction(socialHref(shop.tiktok, "tiktok"), "TikTok", "btn-secondary", { external: true });
    }
    if (toggleOn(toggles, "showEmail")) {
      appendAction(mailtoHref(shop.email), "Email", "btn-secondary");
    }
    const yelpHref = httpHref(shop.yelpUrl);
    if (extraLinkOn(toggles, "showYelp", yelpHref)) {
      appendAction(yelpHref, "Yelp", "btn-secondary", { external: true });
    }
    appendAction(httpHref(shop.appleMapsUrl), "Apple Maps", "btn-secondary", { external: true });

    if (lookOn) {
      arrangeLookActions(shop, toggles);
    } else if (!actionsEl.children.length) {
      actionsEl.classList.add("hidden");
    }

    const story = localeBundle(enrichment.story, activeLocale);
    if (story.text && toggleOn(toggles, "showStory")) {
      storyText.textContent = story.text;
      storySection.classList.remove("hidden");
    }

    const usedFallback = oneLiner.fallback || offer.fallback || walkIns.fallback || hours.fallback || story.fallback;
    if (localeNoteEl && usedFallback) {
      localeNoteEl.textContent = localeNote(activeLocale);
      localeNoteEl.classList.remove("hidden");
    }

    const services = Array.isArray(enrichment.services)
      ? enrichment.services.map(serviceLabel).filter(Boolean)
      : [];
    if (services.length && toggleOn(toggles, "showServices")) {
      serviceChips.innerHTML = "";
      services.forEach((label) => {
        const chip = document.createElement("span");
        chip.className = "service-chip";
        chip.textContent = label;
        serviceChips.appendChild(chip);
      });
      servicesSection.classList.remove("hidden");
    }

    const photos = Array.isArray(enrichment.photos)
      ? enrichment.photos.filter((p) => hasValue(photoSrc(p)))
      : [];
    if (photos.length && toggleOn(toggles, "showPhotos")) {
      photoFeed.innerHTML = "";
      photos.forEach((photo) => {
        const src = photoSrc(photo);
        if (isImageUrl(src)) {
          const fig = document.createElement("figure");
          fig.className = "photo-item";
          const img = document.createElement("img");
          img.src = src;
          img.alt = photoAlt(photo, name);
          img.loading = "lazy";
          fig.appendChild(img);
          if (photo && typeof photo === "object" && hasValue(photo.caption)) {
            const cap = document.createElement("figcaption");
            cap.textContent = String(photo.caption).trim();
            fig.appendChild(cap);
          }
          photoFeed.appendChild(fig);
        } else {
          const a = document.createElement("a");
          a.className = "gallery-link";
          a.href = src;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = "Gallery";
          photoFeed.appendChild(a);
        }
      });
      photosSection.classList.remove("hidden");
    }

    const reviews = Array.isArray(enrichment.reviews)
      ? enrichment.reviews.filter(reviewHasContent)
      : [];
    const showReviews = toggleOn(toggles, "showReviews");
    const showReel = toggleOn(toggles, "showReel");

    if (showReel && reviews.length >= 3) {
      renderReel(reviews, enrichment.reelStoryboard, name);
      reelSection.classList.remove("hidden");
    }

    if (showReviews && reviews.length >= 1) {
      if (hasValue(enrichment.aggregateNote)) {
        aggregateNoteEl.textContent = String(enrichment.aggregateNote).trim();
        aggregateNoteEl.classList.remove("hidden");
      }
      reviewList.innerHTML = "";
      reviews.forEach((review) => reviewList.appendChild(renderReviewCard(review)));
      reviewsSection.classList.remove("hidden");
    }

    if (lookOn) paintLookExtras(shop, toggles, enrichment, name);

    statusEl.classList.add("hidden");
    shopEl.classList.remove("hidden");
  }

  function arrangeLookActions(shop, toggles) {
    const nodes = Array.from(actionsEl.children);
    const primary = [];
    const more = [];
    const textFirst = shop.textFirst === true;
    const websiteHref = httpHref(shop.website);
    const bookingHref = httpHref(shop.bookingUrl) || (toggleOn(toggles, "showBooking") ? websiteHref : "");
    nodes.forEach((node) => {
      const href = node.getAttribute("href") || "";
      const isText = href.indexOf("sms:") === 0;
      const isCall = href.indexOf("tel:") === 0;
      const isBook = !!(bookingHref && node.textContent === t("book"));
      if ((textFirst && isText) || (!textFirst && isCall) || isBook) primary.push(node);
      else if (node.textContent === t("website")) return;
      else more.push(node);
    });
    if (primary.length < 2) {
      const idx = more.findIndex((node) => /^(tel:|sms:)/.test(node.getAttribute("href") || ""));
      if (idx !== -1) primary.push(more.splice(idx, 1)[0]);
    }
    while (primary.length > 2) more.unshift(primary.pop());
    actionsEl.innerHTML = "";
    actionsEl.classList.add("look-primary");
    primary.forEach((node) => {
      node.className = "btn btn-primary";
      actionsEl.appendChild(node);
    });
    socialsEl.innerHTML = "";
    socialsEl.classList.add("look-more");
    if (!more.length) {
      socialsEl.classList.add("hidden");
    } else {
      socialsEl.classList.remove("hidden");
      const links = document.createElement("div");
      links.className = "look-more-links";
      more.forEach((node) => {
        node.className = "btn btn-quiet";
        links.appendChild(node);
      });
      socialsEl.appendChild(links);
    }
    if (!primary.length) actionsEl.classList.add("hidden");
    else actionsEl.classList.remove("hidden");
  }

  function clearLookExtras() {
    const back = document.getElementById("shop-back-link");
    const brand = document.querySelector(".shop-header .brand");
    if (back && brand && back.parentElement !== brand) {
      back.classList.remove("shop-back-fab");
      if (back.dataset.label) {
        back.textContent = back.dataset.label;
        back.removeAttribute("aria-label");
      }
      brand.insertBefore(back, brand.firstChild);
    }
    const lang = document.getElementById("shop-lang");
    const wrap = document.querySelector(".shop-wrap");
    const status = document.getElementById("shop-status");
    if (lang && wrap && lang.parentElement !== wrap) {
      if (status && status.parentElement === wrap) wrap.insertBefore(lang, status);
      else wrap.insertBefore(lang, wrap.firstChild);
    }
    const sheet = document.getElementById("look-sheet");
    const shop = document.getElementById("shop");
    if (sheet && shop) {
      while (sheet.firstChild) shop.insertBefore(sheet.firstChild, sheet);
      sheet.remove();
    }
    ["look-gallery", "look-hours", "look-contact", "look-map", "look-float", "look-dock"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    document.body.classList.remove("has-shop-dock");
  }

  function mountDraftShop(gallery, shop, toggles) {
    const back = document.getElementById("shop-back-link");
    if (back) {
      if (!back.dataset.label) back.dataset.label = (back.textContent || "").trim();
      back.classList.add("shop-back-fab");
      const label = back.dataset.label.replace(/^←\s*/, "") || "Back to directory";
      back.setAttribute("aria-label", label);
      back.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 6.5 9 12l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      gallery.appendChild(back);
    }

    let sheet = document.getElementById("look-sheet");
    if (!sheet) {
      sheet = document.createElement("div");
      sheet.id = "look-sheet";
      sheet.className = "look-sheet";
      shopEl.appendChild(sheet);
    }
    Array.from(shopEl.children).forEach((child) => {
      if (child === gallery || child === sheet) return;
      sheet.appendChild(child);
    });
    const lang = document.getElementById("shop-lang");
    if (lang) sheet.insertBefore(lang, sheet.firstChild);

    const heroImg = gallery.querySelector("img");
    if (heroImg) {
      heroImg.loading = "eager";
      heroImg.decoding = "async";
      heroImg.setAttribute("fetchpriority", "high");
    }

    const dock = document.createElement("nav");
    dock.id = "look-dock";
    dock.className = "shop-dock";
    dock.setAttribute("aria-label", "Contact and booking");
    function addDock(href, label, fill, external) {
      const a = document.createElement("a");
      a.className = "dock-btn" + (fill ? " dock-btn-fill" : "");
      a.href = href;
      a.textContent = label;
      if (external) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      dock.appendChild(a);
    }
    const tel = hasValue(shop.phone) ? normalizePhone(shop.phone) : "";
    if (tel) {
      addDock("sms:" + tel, t("text"), false, false);
      addDock("tel:" + tel, t("call"), false, false);
    }
    const websiteHref = httpHref(shop.website);
    const bookingHref = httpHref(shop.bookingUrl) || (toggleOn(toggles, "showBooking") ? websiteHref : "");
    if (toggleOn(toggles, "showBooking") && isUsableHref(bookingHref)) {
      addDock(bookingHref, t("book"), true, true);
    } else {
      const callBtn = dock.querySelector('a[href^="tel:"]');
      if (callBtn) callBtn.classList.add("dock-btn-fill");
    }
    if (!dock.childElementCount) return;
    document.body.appendChild(dock);
    document.body.classList.add("has-shop-dock");
  }

  function paintLookExtras(shop, toggles, enrichment, name) {
    if (!window.BogLooks) return;
    clearLookExtras();
    const look = document.documentElement.getAttribute("data-look");
    const styleOn = !!(window.BogLooks.currentStyle && window.BogLooks.currentStyle());
    const meta = window.BogLooks.categoryMeta(shop.category);
    document.body.style.setProperty("--cat", meta.color);
    document.body.style.setProperty("--cat-soft", meta.soft);
    document.body.style.setProperty("--cat-ink", meta.ink);
    document.body.setAttribute("data-cat", meta.key);

    const gallery = document.createElement("div");
    gallery.id = "look-gallery";
    gallery.className = "look-gallery look-gallery-" + look;
    gallery.setAttribute("data-carousel", "ready");
    const photoUrls = [];
    if (hasValue(shop.photoUrl)) photoUrls.push(String(shop.photoUrl).trim());
    if (toggleOn(toggles, "showPhotos") && Array.isArray(enrichment.photos)) {
      enrichment.photos.forEach((photo) => {
        const src = photoSrc(photo);
        if (isImageUrl(src)) photoUrls.push(src);
      });
    }
    if (photoUrls.length) {
      photoUrls.forEach((src) => {
        const slide = document.createElement("div");
        slide.className = "look-slide";
        const img = document.createElement("img");
        img.src = src;
        img.alt = name ? name + " — shop photo" : "Shop photo";
        slide.appendChild(img);
        gallery.appendChild(slide);
      });
    } else {
      const slide = document.createElement("div");
      slide.className = "look-slide";
      const mode = "hero";
      window.BogLooks.mountSlot(slide, shop, mode);
      gallery.appendChild(slide);
    }
    gallery.setAttribute("data-count", String(gallery.children.length));
    shopEl.insertBefore(gallery, shopEl.firstChild);

    const hours = localeBundle(shop.hours, activeLocale);
    if (hours.text) {
      const sec = document.createElement("section");
      sec.id = "look-hours";
      sec.className = "shop-section look-hours";
      const rows = window.BogLooks.hoursRows(hours.text);
      if (rows) {
        const table = document.createElement("table");
        table.className = "hours-table";
        const cap = document.createElement("caption");
        cap.textContent = t("hours");
        table.appendChild(cap);
        rows.forEach((row) => {
          const tr = document.createElement("tr");
          const th = document.createElement("th");
          th.scope = "row";
          th.textContent = row.label;
          const td = document.createElement("td");
          td.textContent = row.value || row.label;
          tr.appendChild(th);
          tr.appendChild(td);
          table.appendChild(tr);
        });
        sec.appendChild(table);
      } else {
        const heading = document.createElement("h3");
        heading.textContent = t("hours");
        sec.appendChild(heading);
        const line = document.createElement("p");
        line.className = "hours-plain";
        line.textContent = hours.text;
        sec.appendChild(line);
      }
      if (styleOn) sec.classList.add("sheet-row");
      shopEl.appendChild(sec);
      if (hoursEl) hoursEl.classList.add("hidden");
    }

    const contact = document.createElement("section");
    contact.id = "look-contact";
    contact.className = "shop-section look-contact";
    let contactUsed = false;
      if (hasValue(shop.phone)) {
      const p = document.createElement("p");
      p.className = "contact-phone";
      const a = document.createElement("a");
      a.href = "tel:" + normalizePhone(shop.phone);
      a.textContent = formatPhone(shop.phone);
      p.appendChild(a);
      contact.appendChild(p);
      contactUsed = true;
    }
    const site = httpHref(shop.website);
    if (toggleOn(toggles, "showWebsite") && site) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = site;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = t("website");
      p.appendChild(a);
      contact.appendChild(p);
      contactUsed = true;
    }
    if (contactUsed) {
      if (styleOn) contact.classList.add("sheet-row");
      shopEl.appendChild(contact);
    }

    if (hasValue(shop.address)) {
      const sec = document.createElement("section");
      sec.id = "look-map";
      sec.className = "shop-section look-map";
      const cap = document.createElement("p");
      cap.className = "map-address";
      cap.textContent = shop.address;
      sec.appendChild(cap);
      const frame = document.createElement("iframe");
      frame.title = shop.address;
      frame.loading = "lazy";
      frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      frame.src =
        "https://maps.google.com/maps?q=" + encodeURIComponent(shop.address) + "&z=15&output=embed";
      sec.appendChild(frame);
      if (styleOn) sec.classList.add("sheet-row");
      shopEl.appendChild(sec);
      if (addressEl) addressEl.classList.add("hidden");
    }

    if (styleOn) {
      mountDraftShop(gallery, shop, toggles);
    } else if (look === "1" && hasValue(shop.phone)) {
      const tel = normalizePhone(shop.phone);
      const textFirst = shop.textFirst === true;
      const floater = document.createElement("a");
      floater.id = "look-float";
      floater.className = "float-contact";
      floater.href = (textFirst ? "sms:" : "tel:") + tel;
      floater.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.8h3l1.2 2.8-1.8 1.1a11 11 0 0 0 5 5l1.1-1.8 2.8 1.2v3A1.8 1.8 0 0 1 16.6 20 14.2 14.2 0 0 1 4 7.4 1.8 1.8 0 0 1 5.8 5.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
      floater.appendChild(document.createTextNode(textFirst ? t("text") : t("call")));
      document.body.appendChild(floater);
    }
  }

  const query = params();
  if (query.id === 12 || query.slug === "11-fingers-and-toe") {
    window.location.replace(directoryHref());
    return;
  }
  const lookOnLoad = !!document.documentElement.getAttribute("data-look");
  applyBeautyTheme(false);
  if (lookOnLoad && window.BogLooks) {
    if (backLinkEl) backLinkEl.href = window.BogLooks.withLook("index.html");
    if (footerBackEl) footerBackEl.href = window.BogLooks.withLook("index.html");
  }
  activeLocale = query.lang || readStoredLocale() || "en";
  persistLocale(activeLocale);
  applyChrome();
  if (query.id == null && !query.slug) {
    fail("Add ?id= or ?slug= to open a shop page.");
    return;
  }

  fetch("listings.json")
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load listings.json");
      return r.json();
    })
    .then((data) => {
      const listings = Array.isArray(data) ? data : [];
      const listing = findListing(listings, query);
      if (!listing || isHiddenFromPublic(listing)) {
        window.location.replace(directoryHref());
        return null;
      }
      return loadEnrichment(listing.id).then((enrichment) => {
        render(listing, enrichment || emptyEnrichment());
      });
    })
    .catch((err) => {
      console.error(err);
      fail("Could not load this shop page.");
    });
})();
