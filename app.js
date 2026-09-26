(function () {
  const ALL_CATEGORIES = [
    "Hair Salon",
    "Barber Shop",
    "Nail Salon",
    "Spa / Esthetics",
    "Massage",
    "Brows / Lashes",
    "Makeup",
    "Skincare",
    "Beauty Salon",
    "Wellness / Other",
  ];

  const chipsEl = document.getElementById("chips");
  const listingsEl = document.getElementById("listings");
  const countEl = document.getElementById("count");
  const emptyEl = document.getElementById("empty");
  const searchEl = document.getElementById("search");

  let listings = [];
  let activeCategory = "All";
  let query = "";
  const look = "1";

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

  function hasValue(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === "number") return !Number.isNaN(v);
    return String(v).trim() !== "";
  }

  /** Shelf/enrichment: show only when the value is present and the toggle is explicitly true. */
  function showField(item, valueKey, toggleKeys) {
    if (!hasValue(item[valueKey])) return false;
    const keys = Array.isArray(toggleKeys) ? toggleKeys : [toggleKeys];
    return keys.some((key) => item[key] === true);
  }

  function isLive(item) {
    if (item.status === "live") return true;
    if (item.status === "pending") return false;
    return !!item.confirmed;
  }

  function bookHref(item) {
    const booking = (item.bookingUrl || item.website || "").trim();
    if (booking && item.showBooking === true) {
      return { href: booking, label: "Book", external: true };
    }
    return null;
  }

  function shopHref(item) {
    let href = "shop.html";
    if (item.id != null && item.id !== "") {
      href = "shop.html?id=" + encodeURIComponent(item.id);
    } else if (item.slug) {
      href = "shop.html?slug=" + encodeURIComponent(item.slug);
    }
    if (look && window.BogLooks) return window.BogLooks.withLook(href);
    return href;
  }

  function mapHrefFor(item) {
    if (item.googleMapsUrl && /^https?:\/\//i.test(String(item.googleMapsUrl).trim())) {
      return String(item.googleMapsUrl).trim();
    }
    if (item.address) {
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.address);
    }
    return "";
  }

  function iconLink(href, label, markup, external) {
    const a = document.createElement("a");
    a.className = "icon-btn";
    a.href = href;
    a.setAttribute("aria-label", label);
    if (external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + markup + "</svg>";
    return a;
  }

  const ICON_PHONE =
    '<path d="M7 3.8h3l1.2 2.8-1.8 1.1a11 11 0 0 0 5 5l1.1-1.8 2.8 1.2v3A1.8 1.8 0 0 1 16.6 20 14.2 14.2 0 0 1 4 7.4 1.8 1.8 0 0 1 5.8 5.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>';
  const ICON_PIN =
    '<path d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="11" r="2.1" fill="currentColor"/>';
  const ICON_TEXT =
    '<path d="M5 6h14v8.2H9.2L5 18.2z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>';

  function mountPhotoHero() {
    if (look !== "1" || !window.BogLooks) return;
    const header = document.querySelector(".site-header");
    const searchLabel = document.querySelector(".search-label");
    if (!header || !searchLabel || header.querySelector(".hero-frame")) return;
    const hero = window.BogLooks.HERO;
    const frame = document.createElement("div");
    frame.className = "hero-frame";
    const img = document.createElement("img");
    img.src = hero.src;
    img.alt = hero.alt;
    frame.appendChild(img);
    const scrim = document.createElement("div");
    scrim.className = "hero-scrim";
    frame.appendChild(scrim);
    header.insertBefore(frame, header.firstChild);

    const slot = document.createElement("div");
    slot.className = "hero-search";
    slot.appendChild(searchLabel);
    header.appendChild(slot);

    const credit = document.createElement("p");
    credit.className = "hero-credit";
    const author = document.createElement("a");
    author.href = hero.fileUrl;
    author.textContent = hero.author;
    const license = document.createElement("a");
    license.href = hero.licenseUrl;
    license.textContent = hero.license;
    credit.appendChild(document.createTextNode("Photo: "));
    credit.appendChild(author);
    credit.appendChild(document.createTextNode(", Wikimedia Commons, "));
    credit.appendChild(license);
    header.appendChild(credit);
  }

  function trustNode(item) {
    const label = window.BogLooks && window.BogLooks.trustBadge(item);
    if (!label) return null;
    const badge = document.createElement("span");
    badge.className = "trust-badge";
    badge.textContent = label;
    return badge;
  }

  function renderLookCard1(item) {
    const card = document.createElement("article");
    card.className = "look-card";
    const href = shopHref(item);
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      window.location.href = href;
    });

    const mediaLink = document.createElement("a");
    mediaLink.className = "card-media-link";
    mediaLink.href = href;
    mediaLink.tabIndex = -1;
    mediaLink.setAttribute("aria-hidden", "true");
    const media = document.createElement("div");
    media.className = "card-media";
    if (window.BogLooks) window.BogLooks.mountSlot(media, item, "hero");
    const trust = trustNode(item);
    if (trust) {
      trust.classList.add("media-badge");
      media.appendChild(trust);
    }
    mediaLink.appendChild(media);
    card.appendChild(mediaLink);

    const body = document.createElement("div");
    body.className = "card-body";
    if (isDemoListing(item)) {
      const flag = document.createElement("p");
      flag.className = "template-flag";
      flag.textContent = "Template";
      body.appendChild(flag);
    }
    const h2 = document.createElement("h2");
    const nameLink = document.createElement("a");
    nameLink.href = href;
    nameLink.textContent = item.name || "Shop";
    h2.appendChild(nameLink);
    body.appendChild(h2);

    const place = document.createElement("p");
    place.className = "place-line";
    place.textContent = window.BogLooks ? window.BogLooks.placeLabel(item.address) : item.address || "";
    if (place.textContent) body.appendChild(place);

    const foot = document.createElement("div");
    foot.className = "card-foot";
    if (item.category) {
      const tag = document.createElement("span");
      tag.className = "cat-tag";
      tag.textContent = item.category;
      foot.appendChild(tag);
    } else {
      foot.appendChild(document.createElement("span"));
    }
    const icons = document.createElement("div");
    icons.className = "icon-actions";
    if (item.phone) {
      const tel = normalizePhone(item.phone);
      const textFirst = item.textFirst === true;
      icons.appendChild(
        iconLink(
          (textFirst ? "sms:" : "tel:") + tel,
          (textFirst ? "Text " : "Call ") + (item.name || "shop"),
          textFirst ? ICON_TEXT : ICON_PHONE,
          false
        )
      );
    }
    const mapHref = mapHrefFor(item);
    if (mapHref) {
      icons.appendChild(iconLink(mapHref, "Directions to " + (item.name || "shop"), ICON_PIN, true));
    }
    foot.appendChild(icons);
    body.appendChild(foot);
    card.appendChild(body);
    return card;
  }

  function starLabel(rating) {
    const n = Number(rating);
    if (Number.isNaN(n)) return "";
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function presentCategories(data) {
    const present = new Set(data.map((d) => d.category).filter(Boolean));
    return ["All"].concat(ALL_CATEGORIES.filter((c) => present.has(c)));
  }

  function renderChips(categories) {
    chipsEl.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = cat;
      btn.setAttribute("aria-pressed", cat === activeCategory ? "true" : "false");
      if (look && window.BogLooks && cat !== "All") {
        const meta = window.BogLooks.categoryMeta(cat);
        btn.setAttribute("data-cat", meta.key);
        btn.style.setProperty("--chip-cat", meta.color);
        btn.style.setProperty("--chip-soft", meta.soft);
        btn.style.setProperty("--chip-ink", meta.ink);
      }
      btn.addEventListener("click", () => {
        activeCategory = cat;
        Array.from(chipsEl.children).forEach((c) => {
          c.setAttribute("aria-pressed", c.textContent === activeCategory ? "true" : "false");
        });
        renderList();
      });
      chipsEl.appendChild(btn);
    });
  }

  function isDemoListing(item) {
    return !!(item && (item.isDemo === true || item.demo === true));
  }

  /** Template/demo rows stay in the data files but are not part of the public directory. */
  function isHiddenFromPublic(item) {
    return !!(item && (item.hidden === true || isDemoListing(item)));
  }

  function httpHref(value) {
    if (!hasValue(value)) return "";
    const v = String(value).trim();
    return /^https?:\/\//i.test(v) ? v : "";
  }

  /** Basics-safe link-out. Show when a reviews URL or Google place id is present. */
  function googleReviewsHref(item) {
    const explicit = httpHref(item && item.googleReviewsUrl);
    if (explicit) return explicit;
    if (item && hasValue(item.googlePlaceId)) {
      const q = encodeURIComponent(item.name || item.address || "place");
      return (
        "https://www.google.com/maps/search/?api=1&query=" +
        q +
        "&query_place_id=" +
        encodeURIComponent(String(item.googlePlaceId).trim())
      );
    }
    return "";
  }

  function filtered() {
    const q = query.trim().toLowerCase();
    return listings
      .filter((item) => {
        if (activeCategory !== "All" && item.category !== activeCategory) return false;
        if (q && !(item.name || "").toLowerCase().includes(q)) return false;
        return true;
      })
      .slice()
      .sort(function (a, b) {
        return Number(isDemoListing(b)) - Number(isDemoListing(a));
      });
  }

  function appendOwnerBlock(parent, label, text) {
    const row = document.createElement("p");
    row.className = "owner-block";
    const lab = document.createElement("span");
    lab.className = "owner-label";
    lab.textContent = label;
    row.appendChild(lab);
    row.appendChild(document.createTextNode(text));
    parent.appendChild(row);
  }

  function renderCard(item) {
    return renderLookCard1(item);
  }

  function renderList() {
    const items = filtered();
    listingsEl.innerHTML = "";
    const oldCover = document.getElementById("look-cover");
    if (oldCover) oldCover.remove();
    const oldHeading = document.getElementById("look-list-heading");
    if (oldHeading) oldHeading.remove();
    listingsEl.classList.add("listings-1");
    items.forEach((item) => listingsEl.appendChild(renderCard(item)));
    const demoPinned = items.some(isDemoListing);
    countEl.textContent =
      (items.length === listings.length
        ? `${items.length} listing${items.length === 1 ? "" : "s"}`
        : `${items.length} of ${listings.length} listings`) +
      (demoPinned ? " · DEMO template pinned at top" : "");
    emptyEl.classList.toggle("hidden", items.length > 0);
  }

  mountPhotoHero();

  fetch("listings.json")
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load listings.json");
      return r.json();
    })
    .then((data) => {
      listings = (Array.isArray(data) ? data : []).filter(function (item) {
        return !isHiddenFromPublic(item);
      });
      renderChips(presentCategories(listings));
      renderList();
    })
    .catch((err) => {
      countEl.textContent = "Could not load listings.";
      console.error(err);
    });

  let debounce;
  searchEl.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      query = searchEl.value;
      renderList();
    }, 120);
  });
})();
