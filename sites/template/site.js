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
    language: { en: "Language", vi: "Ngôn ngữ", es: "Idioma", zh: "语言", ko: "언어", th: "ภาษา" }
  };

  var lang = "en";
  var shop = null;

  function t(key) {
    var row = COPY[key] || {};
    return row[lang] || row.en || "";
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

  function paint() {
    if (!shop) return;
    var root = document.getElementById("app");
    document.title = shop.name || "Shop";
    var tel = shop.phone || "";
    var photos = Array.isArray(shop.photos) ? shop.photos : [];
    var hero = photos[0];
    var rest = photos.slice(1);
    var services = Array.isArray(shop.services) ? shop.services : [];
    var hours = Array.isArray(shop.hours) ? shop.hours : [];

    var chips = LOCALES.map(function (code) {
      return '<button type="button" data-lang="' + code + '" aria-pressed="' + (code === lang ? "true" : "false") + '">' + code.toUpperCase() + "</button>";
    }).join("");

    var menu = services.map(function (service) {
      return "<li><span>" + esc(service.name) + "</span><span class=\"price\">" + esc(priceText(service)) + "</span></li>";
    }).join("");

    var hourRows = hours.map(function (row) {
      return "<li><span>" + esc(row.days) + "</span><time>" + esc(row.time) + "</time></li>";
    }).join("");

    var thumbs = rest.map(function (photo) {
      return '<figure><img src="' + esc(photo.src) + '" alt="' + esc(photo.alt || t("samplePhoto")) + '" /><span class="sample-tag">' + esc(t("samplePhoto")) + "</span></figure>";
    }).join("");

    var offer = shop.offer ? '<p class="offer">' + esc(shop.offer) + "</p>" : "";

    root.innerHTML = [
      '<header class="top">',
      '<div class="langs" role="group" aria-label="' + esc(t("language")) + '">' + chips + "</div>",
      '<p class="pill">' + esc(t("sample")) + "</p>",
      "</header>",
      hero
        ? '<div class="hero-photo"><img src="' + esc(hero.src) + '" alt="' + esc(hero.alt || t("samplePhoto")) + '" /><span class="sample-tag">' + esc(t("samplePhoto")) + "</span></div>"
        : "",
      '<div class="hero-copy">',
      "<h1>" + esc(shop.name) + "</h1>",
      shop.tagline ? '<p class="tagline">' + esc(shop.tagline) + "</p>" : "",
      "</div>",
      '<div class="actions">',
      '<a class="btn btn-call" href="tel:' + esc(tel) + '">' + esc(t("call")) + "</a>",
      '<a class="btn btn-text" href="sms:' + esc(tel) + '">' + esc(t("text")) + "</a>",
      "</div>",
      '<p class="note">' + esc(t("note")) + "</p>",
      offer,
      '<section><h2>' + esc(t("services")) + '</h2><ul class="menu">' + menu + "</ul></section>",
      thumbs ? '<section aria-label="' + esc(t("samplePhoto")) + '"><div class="thumbs">' + thumbs + "</div></section>" : "",
      '<section><h2>' + esc(t("hours")) + '</h2><ul class="hours">' + hourRows + "</ul></section>",
      '<section><h2>' + esc(t("find")) + '</h2><p class="address">' + esc(shop.address) + '</p><a class="map-link" href="' + esc(shop.mapsUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t("maps")) + "</a></section>",
      "<footer><strong>" + esc(shop.name) + "</strong><div>" + esc(shop.address) + "</div><div><a href=\"tel:" + esc(tel) + "\">" + esc(shop.phoneDisplay || tel) + '</a></div><p class="foot-pill">' + esc(t("sample")) + "</p></footer>"
    ].join("");

    Array.prototype.forEach.call(root.querySelectorAll("[data-lang]"), function (button) {
      button.addEventListener("click", function () {
        setLang(button.getAttribute("data-lang"));
      });
    });
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
