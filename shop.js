(function () {
  const statusEl = document.getElementById("shop-status");
  const shopEl = document.getElementById("shop");
  const nameEl = document.getElementById("shop-name");
  const badgesEl = document.getElementById("shop-badges");
  const verifiedEl = document.getElementById("shop-verified");
  const oneLinerEl = document.getElementById("shop-oneliner");
  const ratingEl = document.getElementById("shop-rating");
  const addressEl = document.getElementById("shop-address");
  const hoursEl = document.getElementById("shop-hours");
  const actionsEl = document.getElementById("shop-actions");
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

  function params() {
    const q = new URLSearchParams(window.location.search);
    const idRaw = (q.get("id") || "").trim();
    const slug = (q.get("slug") || "").trim().toLowerCase();
    const id = idRaw === "" ? null : Number(idRaw);
    return {
      id: Number.isFinite(id) ? id : null,
      slug,
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

  function toggleOn(toggles, key) {
    if (!toggles || toggles[key] === undefined) return true;
    return toggles[key] !== false;
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

  function reviewHasContent(review) {
    if (!review || typeof review !== "object") return false;
    return (
      hasValue(reviewText(review)) ||
      hasValue(reviewAuthor(review)) ||
      typeof review.rating === "number" ||
      hasValue(review.photo || review.photoUrl)
    );
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

  function renderReviewCard(review) {
    const card = document.createElement("article");
    card.className = "review-card";

    const author = reviewAuthor(review);
    const text = reviewText(review);
    const rating = typeof review.rating === "number" ? review.rating : null;
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

    if (photo) {
      const img = document.createElement("img");
      img.src = photo;
      img.alt = photoAlt(review.photo, author ? "Photo from " + author : "Review photo");
      img.loading = "lazy";
      card.appendChild(img);
    }

    return card;
  }

  function renderReel(reviews) {
    reelEl.innerHTML = "";
    const viewport = document.createElement("div");
    viewport.className = "reel-viewport";

    const track = document.createElement("div");
    track.className = "reel-track";

    reviews.forEach((review) => {
      const slide = document.createElement("div");
      slide.className = "reel-slide";
      slide.appendChild(renderReviewCard(review));
      track.appendChild(slide);
    });
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
    function go(i) {
      index = (i + reviews.length) % reviews.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      Array.from(dots.children).forEach((dot, n) => {
        dot.setAttribute("aria-selected", n === index ? "true" : "false");
      });
    }

    reviews.forEach((_, n) => {
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

  function render(listing, enrichment) {
    const toggles = enrichment.toggles || {};
    const name = listing.name || "Shop";
    document.title = name + " — Blades of Grass";
    nameEl.textContent = name;

    badgesEl.innerHTML = "";
    if (listing.category) {
      appendBadge(listing.category, "cat-badge");
    }
    if (isLive(listing)) {
      appendBadge("Live", "status-badge status-live");
      verifiedEl.classList.remove("hidden");
    } else {
      appendBadge("Pending confirm", "status-badge status-pending");
      verifiedEl.classList.add("hidden");
    }

    const oneLiner = (listing.oneLiner || listing.blurb || "").trim();
    if (hasValue(oneLiner) && listing.showOneLiner !== false) {
      oneLinerEl.textContent = oneLiner;
      oneLinerEl.classList.remove("hidden");
    }

    const rating =
      typeof enrichment.googleRating === "number"
        ? enrichment.googleRating
        : typeof listing.googleRating === "number"
          ? listing.googleRating
          : null;
    const reviewCount =
      enrichment.reviewCount != null ? enrichment.reviewCount : listing.googleReviewCount;
    if (rating != null && toggleOn(toggles, "showRating")) {
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

    if (hasValue(listing.address)) {
      addressEl.textContent = listing.address;
      addressEl.classList.remove("hidden");
    }

    if (hasValue(listing.hours) && listing.showHours !== false) {
      hoursEl.innerHTML = "";
      const lab = document.createElement("span");
      lab.className = "owner-label";
      lab.textContent = "Hours: ";
      hoursEl.appendChild(lab);
      hoursEl.appendChild(document.createTextNode(String(listing.hours).trim()));
      hoursEl.classList.remove("hidden");
    }

    actionsEl.innerHTML = "";
    actionsEl.classList.remove("hidden");
    if (hasValue(listing.phone)) {
      const tel = normalizePhone(listing.phone);
      actionsEl.appendChild(actionLink("tel:" + tel, "Call " + formatPhone(listing.phone), "btn-primary"));
      actionsEl.appendChild(actionLink("sms:" + tel, "Text", "btn-secondary"));
    }
    if (hasValue(listing.address)) {
      const map = actionLink(
        "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(listing.address),
        "Map",
        "btn-secondary"
      );
      map.target = "_blank";
      map.rel = "noopener noreferrer";
      actionsEl.appendChild(map);
    }
    const booking = (listing.bookingUrl || listing.website || "").trim();
    if (booking && listing.showBooking !== false) {
      const book = actionLink(booking, "Book", "btn-primary");
      book.target = "_blank";
      book.rel = "noopener noreferrer";
      actionsEl.appendChild(book);
    }
    if (!actionsEl.children.length) {
      actionsEl.classList.add("hidden");
    }

    const story = hasValue(enrichment.story) ? String(enrichment.story).trim() : "";
    if (story && toggleOn(toggles, "showStory")) {
      storyText.textContent = story;
      storySection.classList.remove("hidden");
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
        const fig = document.createElement("figure");
        fig.className = "photo-item";
        const img = document.createElement("img");
        img.src = photoSrc(photo);
        img.alt = photoAlt(photo, name);
        img.loading = "lazy";
        fig.appendChild(img);
        if (photo && typeof photo === "object" && hasValue(photo.caption)) {
          const cap = document.createElement("figcaption");
          cap.textContent = String(photo.caption).trim();
          fig.appendChild(cap);
        }
        photoFeed.appendChild(fig);
      });
      photosSection.classList.remove("hidden");
    }

    const reviews = Array.isArray(enrichment.reviews)
      ? enrichment.reviews.filter(reviewHasContent)
      : [];
    const showReviews = toggleOn(toggles, "showReviews");
    const showReel = toggleOn(toggles, "showReel");

    if (showReel && reviews.length >= 3) {
      renderReel(reviews);
      reelSection.classList.remove("hidden");
    }

    if (showReviews && reviews.length >= 1) {
      reviewList.innerHTML = "";
      reviews.forEach((review) => reviewList.appendChild(renderReviewCard(review)));
      reviewsSection.classList.remove("hidden");
    }

    statusEl.classList.add("hidden");
    shopEl.classList.remove("hidden");
  }

  const query = params();
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
      if (!listing) {
        fail("No listing matches that id or slug.");
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
