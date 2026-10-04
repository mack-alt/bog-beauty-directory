(function () {
  var LOCALES = ["en", "vi", "es", "zh", "ko", "th"];
  var STORAGE = "bog-sample-site-lang";
  var COPY = {
    sample: {
      en: "Sample site preview by Blades of Grass",
      vi: "Trang mẫu xem thử bởi Blades of Grass",
      es: "Vista previa de muestra por Blades of Grass",
      zh: "Blades of Grass 示例网站预览",
      ko: "Blades of Grass 샘플 사이트 미리보기",
      th: "ตัวอย่างเว็บไซต์โดย Blades of Grass"
    },
    call: { en: "Call", vi: "Gọi", es: "Llamar", zh: "电话", ko: "전화", th: "โทร" },
    text: { en: "Text", vi: "Nhắn tin", es: "Mensaje", zh: "短信", ko: "문자", th: "ข้อความ" },
    directions: { en: "Directions", vi: "Chỉ đường", es: "Cómo llegar", zh: "路线", ko: "길찾기", th: "เส้นทาง" },
    note: {
      en: "Text us anytime, we text back.",
      vi: "Nhắn bất cứ lúc nào, tiệm nhắn lại.",
      es: "Escríbenos cuando quieras. Te respondemos por mensaje.",
      zh: "随时发短信，我们会回。",
      ko: "언제든 문자 주세요. 답장드릴게요.",
      th: "ส่งข้อความได้ทุกเมื่อ เราตอบกลับ"
    },
    services: { en: "Services", vi: "Dịch vụ", es: "Servicios", zh: "服务", ko: "서비스", th: "บริการ" },
    hours: { en: "Hours", vi: "Giờ mở cửa", es: "Horario", zh: "营业时间", ko: "영업시간", th: "เวลาเปิด" },
    find: { en: "Find us", vi: "Địa chỉ", es: "Dónde estamos", zh: "地址", ko: "오시는 길", th: "ที่อยู่" },
    maps: {
      en: "Open in Google Maps",
      vi: "Mở Google Maps",
      es: "Abrir en Google Maps",
      zh: "在 Google 地图中打开",
      ko: "Google 지도에서 열기",
      th: "เปิดใน Google Maps"
    },
    ask: {
      en: "ask for price",
      vi: "hỏi giá",
      es: "consultar precio",
      zh: "问价格",
      ko: "가격 문의",
      th: "สอบถามราคา"
    },
    samplePhoto: {
      en: "Sample photo",
      vi: "Ảnh minh họa",
      es: "Foto de muestra",
      zh: "示例照片",
      ko: "샘플 사진",
      th: "ภาพตัวอย่าง"
    },
    sampleOffer: {
      en: "Sample offer",
      vi: "Ưu đãi mẫu",
      es: "Oferta de muestra",
      zh: "示例优惠",
      ko: "샘플 혜택",
      th: "ข้อเสนอตัวอย่าง"
    },
    language: { en: "Language", vi: "Ngôn ngữ", es: "Idioma", zh: "语言", ko: "언어", th: "ภาษา" },
    openNow: { en: "Open now", vi: "Đang mở", es: "Abierto ahora", zh: "营业中", ko: "영업 중", th: "เปิดอยู่" },
    closed: { en: "Closed", vi: "Đang đóng", es: "Cerrado", zh: "已打烊", ko: "영업 종료", th: "ปิดแล้ว" },
    closesAt: {
      en: "Closes at {time}",
      vi: "Đóng lúc {time}",
      es: "Cierra a las {time}",
      zh: "{time} 打烊",
      ko: "{time}에 마감",
      th: "ปิด {time}"
    },
    opensAt: {
      en: "Opens at {time}",
      vi: "Mở lúc {time}",
      es: "Abre a las {time}",
      zh: "{time} 开门",
      ko: "{time}에 오픈",
      th: "เปิด {time}"
    }
  };

  var lang = "en";
  var shop = null;

  function t(key) {
    var row = COPY[key] || {};
    return row[lang] || row.en || "";
  }

  function fill(key, time) {
    return t(key).replace("{time}", time);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function readLang() {
    var fromUrl = "";
    try {
      fromUrl = new URLSearchParams(location.search).get("lang") || "";
    } catch (err) {
      fromUrl = "";
    }
    fromUrl = fromUrl.toLowerCase();
    if (LOCALES.indexOf(fromUrl) !== -1) return fromUrl;
    var stored = "";
    try {
      stored = localStorage.getItem(STORAGE) || "";
    } catch (err) {
      stored = "";
    }
    stored = stored.toLowerCase();
    if (LOCALES.indexOf(stored) !== -1) return stored;
    return "en";
  }

  function setLang(next) {
    lang = LOCALES.indexOf(next) === -1 ? "en" : next;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE, lang);
    } catch (err) {}
    var url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    paint();
  }

  function priceText(service) {
    var price = service && service.price != null ? String(service.price).trim() : "";
    return price || t("ask");
  }

  function dayIndex(token) {
    var key = String(token || "").toLowerCase().replace(/[^a-z]/g, "").slice(0, 3);
    return { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }[key];
  }

  function parseDays(label) {
    var parts = String(label || "").split(/\s*[–—-]\s*/);
    var start = dayIndex(parts[0]);
    if (start == null) return [];
    if (parts.length < 2) return [start];
    var end = dayIndex(parts[1]);
    if (end == null) return [start];
    var days = [];
    for (var i = 0; i < 7; i++) {
      var day = (start + i) % 7;
      days.push(day);
      if (day === end) break;
    }
    return days;
  }

  function parseClock(token) {
    var match = String(token || "").trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!match) return null;
    var hour = parseInt(match[1], 10);
    var minute = match[2] ? parseInt(match[2], 10) : 0;
    var ap = (match[3] || "").toLowerCase();
    if (ap === "pm" && hour < 12) hour += 12;
    if (ap === "am" && hour === 12) hour = 0;
    if (hour > 23 || minute > 59) return null;
    return hour * 60 + minute;
  }

  function parseRange(text) {
    var bits = String(text || "").split(/\s*[–—-]\s*/);
    if (bits.length < 2) return null;
    var open = parseClock(bits[0]);
    var close = parseClock(bits[1]);
    if (open == null || close == null || close <= open) return null;
    return { open: open, close: close };
  }

  function formatWhen(mins) {
    var hour = Math.floor(mins / 60);
    var minute = mins % 60;
    var h12 = hour % 12 || 12;
    var ap = hour >= 12 ? "PM" : "AM";
    if (minute === 0 && hour >= 12) return String(h12);
    if (minute === 0) return h12 + " " + ap;
    return h12 + ":" + (minute < 10 ? "0" : "") + minute + " " + ap;
  }

  function statusFor(hours) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var got = {};
    parts.forEach(function (part) {
      if (part.type !== "literal") got[part.type] = part.value;
    });
    var weekday = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[got.weekday];
    var minutes = parseInt(got.hour, 10) * 60 + parseInt(got.minute, 10);
    if (weekday == null || isNaN(minutes)) return null;
    var byDay = {};
    (hours || []).forEach(function (row) {
      var range = parseRange(row.time);
      if (!range) return;
      parseDays(row.days).forEach(function (day) { byDay[day] = range; });
    });
    var today = byDay[weekday];
    if (today && minutes >= today.open && minutes < today.close) {
      return { open: true, line: t("openNow") + " · " + fill("closesAt", formatWhen(today.close)) };
    }
    if (today && minutes < today.open) {
      return { open: false, line: t("closed") + " · " + fill("opensAt", formatWhen(today.open)) };
    }
    for (var step = 1; step <= 7; step++) {
      var next = byDay[(weekday + step) % 7];
      if (next) return { open: false, line: t("closed") + " · " + fill("opensAt", formatWhen(next.open)) };
    }
    return null;
  }

  function paint() {
    if (!shop) return;
    var root = document.getElementById("app");
    document.title = shop.name || "Shop";
    if (shop.accent) document.documentElement.style.setProperty("--accent", shop.accent);
    var tel = shop.phone || "";
    var photos = Array.isArray(shop.photos) ? shop.photos : [];
    var hero = photos[0];
    var rest = photos.slice(1);
    var services = Array.isArray(shop.services) ? shop.services : [];
    var hours = Array.isArray(shop.hours) ? shop.hours : [];
    var status = statusFor(hours);

    var chips = LOCALES.map(function (code) {
      return '<button type="button" data-lang="' + code + '" aria-pressed="' + (code === lang ? "true" : "false") + '">' + code.toUpperCase() + "</button>";
    }).join("");

    var menu = services.map(function (service) {
      return '<li class="svc"><span class="svc-name">' + esc(service.name) + '</span><span class="svc-price">' + esc(priceText(service)) + "</span></li>";
    }).join("");

    var hourRows = hours.map(function (row) {
      return "<li><span>" + esc(row.days) + "</span><time>" + esc(row.time) + "</time></li>";
    }).join("");

    var thumbs = rest.map(function (photo) {
      return '<figure><img src="' + esc(photo.src) + '" alt="' + esc(photo.alt || t("samplePhoto")) + '" /><span class="sample-tag">' + esc(t("samplePhoto")) + "</span></figure>";
    }).join("");

    var featured = shop.featuredOffer && shop.featuredOffer.title ? shop.featuredOffer : null;
    var featuredHtml = "";
    if (featured) {
      var sampleOffer = featured.isSample === true;
      featuredHtml = [
        '<section class="deal reveal' + (sampleOffer ? " is-sample" : "") + '">',
        sampleOffer ? '<span class="deal-tag">' + esc(t("sampleOffer")) + "</span>" : "",
        "<h2>" + esc(featured.title) + "</h2>",
        featured.detail ? '<p class="deal-detail">' + esc(featured.detail) + "</p>" : "",
        featured.finePrint ? '<p class="deal-fine">' + esc(featured.finePrint) + "</p>" : "",
        "</section>"
      ].join("");
    }
    var showPlainOffer = shop.offer && !(featured && featured.isSample === false);

    var links = Array.isArray(shop.links) ? shop.links : [];
    var linkHtml = links.map(function (link) {
      if (!link || !link.href) return "";
      return '<div><a href="' + esc(link.href) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label || link.href) + "</a></div>";
    }).join("");

    root.className = "app";
    root.innerHTML = [
      '<header class="hero">',
      hero ? '<img src="' + esc(hero.src) + '" alt="' + esc(hero.alt || t("samplePhoto")) + '" />' : "",
      '<div class="hero-shade"></div>',
      hero ? '<span class="sample-tag">' + esc(t("samplePhoto")) + "</span>" : "",
      '<div class="hero-top">',
      '<div class="langs" role="group" aria-label="' + esc(t("language")) + '">' + chips + "</div>",
      '<p class="pill">' + esc(t("sample")) + "</p>",
      "</div>",
      '<div class="hero-copy">',
      status ? '<p class="status' + (status.open ? " is-open" : "") + '"><span class="dot"></span>' + esc(status.line) + "</p>" : "",
      "<h1>" + esc(shop.name) + "</h1>",
      shop.tagline ? '<p class="tagline">' + esc(shop.tagline) + "</p>" : "",
      shop.walkIns ? '<p class="walk">' + esc(shop.walkIns) + "</p>" : "",
      "</div>",
      "</header>",
      '<div class="sheet">',
      featuredHtml,
      '<p class="note reveal">' + esc(t("note")) + "</p>",
      showPlainOffer ? '<p class="offer reveal">' + esc(shop.offer) + "</p>" : "",
      '<section class="reveal"><h2>' + esc(t("services")) + '</h2><ul class="menu">' + menu + "</ul></section>",
      thumbs ? '<section class="reveal" aria-label="' + esc(t("samplePhoto")) + '"><div class="thumbs">' + thumbs + "</div></section>" : "",
      '<section class="reveal"><h2>' + esc(t("hours")) + '</h2><div class="card"><ul class="hours">' + hourRows + "</ul></div></section>",
      '<section class="reveal"><h2>' + esc(t("find")) + '</h2><div class="card"><p class="address">' + esc(shop.address) + '</p><a class="map-link" href="' + esc(shop.mapsUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t("maps")) + "</a></div></section>",
      "<footer class=\"reveal\"><strong>" + esc(shop.name) + "</strong><div>" + esc(shop.address) + "</div><div><a href=\"tel:" + esc(tel) + "\">" + esc(shop.phoneDisplay || tel) + "</a></div>" + linkHtml + '<p class="foot-pill">' + esc(t("sample")) + "</p></footer>",
      "</div>",
      '<nav class="dock" aria-label="' + esc(t("call")) + '">',
      '<a class="dock-call" href="tel:' + esc(tel) + '">' + esc(t("call")) + "</a>",
      '<a href="sms:' + esc(tel) + '">' + esc(t("text")) + "</a>",
      '<a href="' + esc(shop.mapsUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t("directions")) + "</a>",
      "</nav>"
    ].join("");

    Array.prototype.forEach.call(root.querySelectorAll("[data-lang]"), function (button) {
      button.addEventListener("click", function () {
        setLang(button.getAttribute("data-lang"));
      });
    });

    var nodes = root.querySelectorAll(".reveal");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, function (node) { node.classList.add("is-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    Array.prototype.forEach.call(nodes, function (node) { observer.observe(node); });
  }

  lang = readLang();
  document.documentElement.lang = lang;
  fetch("site.json")
    .then(function (response) {
      if (!response.ok) throw new Error("site.json");
      return response.json();
    })
    .then(function (data) {
      shop = data;
      paint();
    })
    .catch(function () {
      var root = document.getElementById("app");
      if (root) root.textContent = "This sample page could not load its shop file.";
    });
})();
