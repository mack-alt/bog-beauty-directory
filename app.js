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
  const look = window.BogLooks ? window.BogLooks.currentLook() : "";

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

  function renderLookCard2(item) {
    const row = document.createElement("article");
    row.className = "app-row";
    const href = shopHref(item);
    const main = document.createElement("a");
    main.className = "app-row-main";
    main.href = href;
    const icon = document.createElement("span");
    icon.className = "app-icon";
    const meta = window.BogLooks ? window.BogLooks.categoryMeta(item.category) : null;
    if (meta) {
      icon.style.background = meta.color;
      icon.style.color = "#fff";
    }
    if (window.BogLooks) window.BogLooks.mountSlot(icon, item, "icon");
    main.appendChild(icon);

    const copy = document.createElement("span");
    copy.className = "app-copy";
    const name = document.createElement("span");
    name.className = "app-name";
    name.textContent = item.name || "Shop";
    copy.appendChild(name);

    const sub = document.createElement("span");
    sub.className = "app-sub";
    const bits = [];
    if (item.category) bits.push(item.category);
    const trust = window.BogLooks ? window.BogLooks.trustBadge(item) : "";
    sub.textContent = bits.join("");
    if (trust) {
      if (bits.length) sub.appendChild(document.createTextNode(" · "));
      const mark = document.createElement("span");
      mark.className = "app-trust";
      mark.textContent = trust;
      sub.appendChild(mark);
    }
    if (isDemoListing(item)) {
      sub.appendChild(document.createTextNode(bits.length || trust ? " · " : ""));
      const flag = document.createElement("span");
      flag.className = "template-flag";
      flag.textContent = "Template";
      sub.appendChild(flag);
    }
    copy.appendChild(sub);

    if (item.address) {
      const addr = document.createElement("span");
      addr.className = "app-addr";
      addr.textContent = item.address;
      copy.appendChild(addr);
    }
    main.appendChild(copy);
    row.appendChild(main);

    if (item.phone) {
      const tel = normalizePhone(item.phone);
      const textFirst = item.textFirst === true;
      const call = document.createElement("a");
      call.className = "app-call";
      call.href = (textFirst ? "sms:" : "tel:") + tel;
      call.textContent = textFirst ? "Text" : "Call";
      call.setAttribute("aria-label", (textFirst ? "Text " : "Call ") + (item.name || "shop"));
      row.appendChild(call);
    }
    return row;
  }

  function renderLookCard3(item) {
    const href = shopHref(item);
    const meta = window.BogLooks ? window.BogLooks.categoryMeta(item.category) : null;
    const card = document.createElement("a");
    card.className = "mag-card";
    card.href = href;
    if (meta) card.style.setProperty("--cat", meta.color);
    const h2 = document.createElement("h2");
    h2.textContent = item.name || "Shop";
    card.appendChild(h2);
    const place = document.createElement("p");
    place.className = "mag-meta";
    const where = window.BogLooks ? window.BogLooks.placeLabel(item.address) : item.address || "";
    const trust = window.BogLooks ? window.BogLooks.trustBadge(item) : "";
    place.textContent = [where, trust, isDemoListing(item) ? "Template" : ""].filter(Boolean).join(" · ");
    if (place.textContent) card.appendChild(place);
    if (item.category) {
      const cat = document.createElement("span");
      cat.className = "mag-cat";
      cat.textContent = item.category;
      card.appendChild(cat);
    }
    return card;
  }

  function renderCover(item) {
    const section = document.createElement("section");
    section.className = "mag-cover";
    section.id = "look-cover";
    const kicker = document.createElement("p");
    kicker.className = "mag-kicker";
    kicker.textContent = "In the directory";
    section.appendChild(kicker);
    const meta = window.BogLooks ? window.BogLooks.categoryMeta(item.category) : null;
    const link = document.createElement("a");
    link.className = "mag-cover-link";
    link.href = shopHref(item);
    if (meta) link.style.background = meta.color;
    if (item.category) {
      const cat = document.createElement("span");
      cat.className = "mag-cover-cat";
      cat.textContent = item.category;
      link.appendChild(cat);
    }
    const h2 = document.createElement("h2");
    h2.textContent = item.name || "Shop";
    link.appendChild(h2);
    const place = document.createElement("p");
    const where = window.BogLooks ? window.BogLooks.placeLabel(item.address) : item.address || "";
    place.textContent = where;
    if (where) link.appendChild(place);
    const line = String(item.oneLiner || item.blurb || "").trim();
    if (line) {
      const lede = document.createElement("p");
      lede.className = "mag-cover-line";
      lede.textContent = line;
      link.appendChild(lede);
    }
    const trust = trustNode(item);
    if (trust) link.appendChild(trust);
    if (isDemoListing(item)) {
      const flag = document.createElement("span");
      flag.className = "template-flag";
      flag.textContent = "Template";
      link.appendChild(flag);
    }
    section.appendChild(link);
    return section;
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
    if (look === "1") return renderLookCard1(item);
    if (look === "2") return renderLookCard2(item);
    if (look === "3") return renderLookCard3(item);
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
    const oldCover = document.getElementById("look-cover");
    if (oldCover) oldCover.remove();
    const oldHeading = document.getElementById("look-list-heading");
    if (oldHeading) oldHeading.remove();
    let listItems = items;
    if (look === "3" && items.length) {
      const coverItem =
        items.find((item) => !isDemoListing(item) && (item.verifiedByBog === true || item.confirmed === true)) ||
        items.find((item) => !isDemoListing(item)) ||
        items[0];
      const cover = renderCover(coverItem);
      listingsEl.parentNode.insertBefore(cover, listingsEl);
      listItems = items.filter((item) => item !== coverItem);
      if (listItems.length) {
        const heading = document.createElement("h2");
        heading.id = "look-list-heading";
        heading.className = "mag-list-heading";
        heading.textContent = "The list";
        listingsEl.parentNode.insertBefore(heading, listingsEl);
      }
    }
    if (look) listingsEl.classList.add("listings-" + look);
    listItems.forEach((item) => listingsEl.appendChild(renderCard(item)));
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
