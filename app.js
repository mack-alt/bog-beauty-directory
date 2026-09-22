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
    if (item.id != null && item.id !== "") {
      return "shop.html?id=" + encodeURIComponent(item.id);
    }
    if (item.slug) {
      return "shop.html?slug=" + encodeURIComponent(item.slug);
    }
    return "shop.html";
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
    const card = document.createElement("article");
    const demo = isDemoListing(item);
    card.className = demo ? "card card-demo" : "card";
    const href = shopHref(item);
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      window.location.href = href;
    });

    if (hasValue(item.photoUrl)) {
      const media = document.createElement("div");
      media.className = "card-media";
      const img = document.createElement("img");
      img.src = item.photoUrl;
      img.alt = item.name || "Salon photo";
      img.loading = "lazy";
      media.appendChild(img);
      card.appendChild(media);
    }

    const body = document.createElement("div");
    body.className = "card-body";

    const top = document.createElement("div");
    top.className = "card-top";

    const h2 = document.createElement("h2");
    const nameLink = document.createElement("a");
    nameLink.className = "card-name-link";
    nameLink.href = href;
    nameLink.textContent = item.name;
    h2.appendChild(nameLink);
    top.appendChild(h2);

    const badges = document.createElement("div");
    badges.className = "badges";

    if (isDemoListing(item)) {
      const demo = document.createElement("span");
      demo.className = "demo-badge";
      demo.textContent = "DEMO / TEMPLATE";
      badges.appendChild(demo);
    }

    if (item.category) {
      const cat = document.createElement("span");
      cat.className = "cat-badge";
      cat.textContent = item.category;
      badges.appendChild(cat);
    }

    const status = document.createElement("span");
    if (isLive(item)) {
      status.className = "status-badge status-live";
      status.textContent = "Live";
    } else {
      status.className = "status-badge status-pending";
      status.textContent = "Pending confirm";
    }
    badges.appendChild(status);
    top.appendChild(badges);
    body.appendChild(top);

    if (item.verifiedByBog === true) {
      const verified = document.createElement("p");
      verified.className = "verified";
      verified.textContent = "Verified by BoG";
      body.appendChild(verified);
    }

    const offerText = (item.offer || item.offerHighlight || "").trim();
    if (offerText) {
      const offer = document.createElement("p");
      offer.className = "offer-highlight";
      const lab = document.createElement("span");
      lab.className = "offer-label";
      lab.textContent = "Offer";
      offer.appendChild(lab);
      offer.appendChild(document.createTextNode(offerText));
      body.appendChild(offer);
    }

    if (
      showField(item, "googleRating", ["showRating", "showGoogle"]) &&
      typeof item.googleRating === "number"
    ) {
      const rating = document.createElement("p");
      rating.className = "rating";
      const stars = document.createElement("span");
      stars.className = "stars";
      stars.setAttribute("aria-hidden", "true");
      stars.textContent = starLabel(item.googleRating);
      rating.appendChild(stars);
      const num = document.createElement("span");
      num.className = "rating-num";
      num.textContent = Number(item.googleRating).toFixed(1);
      rating.appendChild(num);
      if (hasValue(item.googleReviewCount)) {
        const count = document.createElement("span");
        count.className = "rating-count";
        count.textContent =
          "(" + item.googleReviewCount + " review" + (item.googleReviewCount === 1 ? "" : "s") + ")";
        rating.appendChild(count);
      }
      body.appendChild(rating);
      if (showField(item, "googleSnippet", ["showRating", "showGoogle"])) {
        const snip = document.createElement("p");
        snip.className = "snippet";
        snip.textContent = String(item.googleSnippet).trim();
        body.appendChild(snip);
      }
    }

    if (item.address) {
      const addr = document.createElement("p");
      addr.className = "meta";
      addr.textContent = item.address;
      body.appendChild(addr);
    }

    if (item.phone) {
      const phoneP = document.createElement("p");
      phoneP.className = "meta";
      const a = document.createElement("a");
      a.href = "tel:" + normalizePhone(item.phone);
      a.textContent = formatPhone(item.phone);
      phoneP.appendChild(a);
      body.appendChild(phoneP);
    }

    const lineText = (item.oneLiner || item.blurb || "").trim();
    if (lineText && lineText !== offerText) {
      const line = document.createElement("p");
      line.className = "blurb";
      line.textContent = lineText;
      body.appendChild(line);
    }

    if (hasValue(item.walkIns)) {
      const walk = document.createElement("p");
      walk.className = "meta walkins";
      walk.textContent = String(item.walkIns).trim();
      body.appendChild(walk);
    }

    if (showField(item, "knownFor", "showKnownFor")) {
      appendOwnerBlock(body, "Known for: ", String(item.knownFor).trim());
    }
    if (hasValue(item.hours)) {
      appendOwnerBlock(body, "Hours: ", String(item.hours).trim());
    }
    if (showField(item, "languages", "showLanguages")) {
      appendOwnerBlock(body, "Languages: ", String(item.languages).trim());
    }

    const links = document.createElement("div");
    links.className = "owner-links";
    let hasLinks = false;

    const booking = (item.bookingUrl || "").trim();
    if (booking && item.showBooking === true) {
      const a = document.createElement("a");
      a.href = booking;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Booking";
      links.appendChild(a);
      hasLinks = true;
    }
    if (showField(item, "website", "showWebsite") && item.website !== item.bookingUrl) {
      const a = document.createElement("a");
      a.href = String(item.website).trim();
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Website";
      links.appendChild(a);
      hasLinks = true;
    }
    if (showField(item, "instagram", ["showIg", "showInstagram"])) {
      let ig = String(item.instagram).trim();
      if (ig && !/^https?:\/\//i.test(ig) && ig.startsWith("@")) {
        ig = "https://instagram.com/" + ig.slice(1);
      } else if (ig && !/^https?:\/\//i.test(ig)) {
        ig = "https://instagram.com/" + ig.replace(/^@/, "");
      }
      const a = document.createElement("a");
      a.href = ig;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Instagram";
      links.appendChild(a);
      hasLinks = true;
    }
    if (hasLinks) body.appendChild(links);

    const actions = document.createElement("div");
    actions.className = "actions";
    const view = document.createElement("a");
    view.className = "btn btn-primary";
    view.href = href;
    view.textContent = "View shop";
    actions.appendChild(view);
    const book = bookHref(item);
    if (book) {
      const a = document.createElement("a");
      a.className = "btn btn-secondary";
      a.href = book.href;
      a.textContent = book.label;
      if (book.external) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      actions.appendChild(a);
    }
    if (item.phone) {
      const tel = normalizePhone(item.phone);
      if (item.textFirst === true) {
        const textBtn = document.createElement("a");
        textBtn.className = "btn btn-secondary";
        textBtn.href = "sms:" + tel;
        textBtn.textContent = "Text";
        actions.appendChild(textBtn);
      }
      const call = document.createElement("a");
      call.className = "btn btn-secondary";
      call.href = "tel:" + tel;
      call.textContent = "Call";
      actions.appendChild(call);
    }
    const mapQuery = item.googleMapsUrl || item.googleReviewsUrl ||
      (item.address
        ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.address)
        : "");
    if (mapQuery && /^https?:\/\//i.test(String(mapQuery).trim())) {
      const map = document.createElement("a");
      map.className = "btn btn-secondary";
      map.href = String(mapQuery).trim();
      map.target = "_blank";
      map.rel = "noopener noreferrer";
      map.textContent = "Directions";
      actions.appendChild(map);
    }
    const reviewsHref = googleReviewsHref(item);
    if (reviewsHref) {
      const reviews = document.createElement("a");
      reviews.className = "btn btn-primary btn-reviews";
      reviews.href = reviewsHref;
      reviews.target = "_blank";
      reviews.rel = "noopener noreferrer";
      reviews.textContent = "Reviews on Google";
      actions.appendChild(reviews);
    }
    body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  function renderList() {
    const items = filtered();
    listingsEl.innerHTML = "";
    items.forEach((item) => listingsEl.appendChild(renderCard(item)));
    const demoPinned = items.some(isDemoListing);
    countEl.textContent =
      (items.length === listings.length
        ? `${items.length} listing${items.length === 1 ? "" : "s"}`
        : `${items.length} of ${listings.length} listings`) +
      (demoPinned ? " · DEMO template pinned at top" : "");
    emptyEl.classList.toggle("hidden", items.length > 0);
  }

  fetch("listings.json")
    .then((r) => {
      if (!r.ok) throw new Error("Failed to load listings.json");
      return r.json();
    })
    .then((data) => {
      listings = Array.isArray(data) ? data : [];
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
