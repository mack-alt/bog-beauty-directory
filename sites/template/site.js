(function (factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") api.boot();
})(function () {
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
    gift: {
      en: "A free gift for {name} from Blades of Grass",
      vi: "Một món quà miễn phí cho {name} từ Blades of Grass",
      es: "Un regalo gratis para {name}, de Blades of Grass",
      zh: "Blades of Grass 送给 {name} 的一份免费礼物",
      ko: "Blades of Grass가 {name}에 드리는 무료 선물",
      th: "ของขวัญฟรีสำหรับ {name} จาก Blades of Grass"
    },
    giftListing: {
      en: "Your free listing",
      vi: "Trang danh bạ miễn phí",
      es: "Tu ficha gratis",
      zh: "你的免费名录",
      ko: "무료 목록",
      th: "หน้าร้านฟรีของคุณ"
    },
    giftHelp: {
      en: "Help make this better",
      vi: "Giúp làm trang này tốt hơn",
      es: "Ayuda a mejorarlo",
      zh: "帮忙改进",
      ko: "더 좋게 만들기",
      th: "ช่วยทำให้ดีขึ้น"
    },
    call: { en: "Call", vi: "Gọi", es: "Llamar", zh: "电话", ko: "전화", th: "โทร" },
    callNow: { en: "Call now", vi: "Gọi ngay", es: "Llamar ahora", zh: "立即致电", ko: "지금 전화", th: "โทรเลย" },
    text: { en: "Text", vi: "Nhắn tin", es: "Mensaje", zh: "短信", ko: "문자", th: "ข้อความ" },
    textUs: { en: "Text us", vi: "Nhắn ngay", es: "Escríbenos", zh: "发短信", ko: "문자하기", th: "ส่งข้อความ" },
    directions: { en: "Directions", vi: "Chỉ đường", es: "Cómo llegar", zh: "路线", ko: "길찾기", th: "เส้นทาง" },
    book: { en: "Book", vi: "Đặt lịch", es: "Reservar", zh: "预约", ko: "예약", th: "จอง" },
    note: {
      en: "Call, text, or book below.",
      vi: "Gọi, nhắn, hoặc đặt lịch bên dưới.",
      es: "Llama, escribe o reserva abajo.",
      zh: "请在下方致电、发短信或预约。",
      ko: "아래에서 전화, 문자 또는 예약하세요.",
      th: "โทร ส่งข้อความ หรือจองด้านล่าง"
    },
    confirm: {
      en: "Call to confirm",
      vi: "Gọi để xác nhận",
      es: "Llama para confirmar",
      zh: "请致电确认",
      ko: "전화로 확인해 주세요",
      th: "โทรเพื่อยืนยัน"
    },
    services: { en: "Services", vi: "Dịch vụ", es: "Servicios", zh: "服务", ko: "서비스", th: "บริการ" },
    seeAll: {
      en: "See all services ({n})",
      vi: "Xem tất cả dịch vụ ({n})",
      es: "Ver todos los servicios ({n})",
      zh: "查看全部服务（{n}）",
      ko: "전체 서비스 보기 ({n})",
      th: "ดูบริการทั้งหมด ({n})"
    },
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
    },
    request: {
      en: "Request a booking",
      vi: "Xin đặt lịch",
      es: "Pedir una cita",
      zh: "预约请求",
      ko: "예약 요청",
      th: "ขอจองคิว"
    },
    bookFallback: {
      en: "Call or text to request a time.",
      vi: "Gọi hoặc nhắn tin để xin giờ.",
      es: "Llama o envía un mensaje para pedir hora.",
      zh: "请致电或发短信预约时间。",
      ko: "전화나 문자로 시간을 요청하세요.",
      th: "โทรหรือส่งข้อความเพื่อขอเวลา"
    },
    skip: {
      en: "Skip to content",
      vi: "Bỏ qua, đến nội dung",
      es: "Saltar al contenido",
      zh: "跳到内容",
      ko: "본문으로 건너뛰기",
      th: "ข้ามไปเนื้อหา"
    },
    contact: {
      en: "Contact the shop",
      vi: "Liên hệ tiệm",
      es: "Contactar al local",
      zh: "联系店铺",
      ko: "매장 연락",
      th: "ติดต่อร้าน"
    }
  };

  var LANG_NAME = {
    en: "English",
    vi: "Tiếng Việt",
    es: "Español",
    zh: "中文",
    ko: "한국어",
    th: "ไทย"
  };

  var FORM_EMBED = "https://link.msgsndr.com/js/form_embed.js";
  var lang = "en";
  var shop = null;
  var motionObserver = null;

  function t(key) {
    var row = COPY[key] || {};
    return row[lang] || row.en || "";
  }

  function fill(key, time) {
    return t(key).replace("{time}", time);
  }

  function safeDirectory(url) {
    var value = String(url || "").trim();
    if (/^(\.\.\/)+shop\/[a-z0-9-]+\/?$/.test(value)) return value;
    if (/^https:\/\/mack-alt\.github\.io\/bog-beauty-directory\/shop\/[a-z0-9-]+\/?$/.test(value)) return value;
    return "";
  }

  function giftLine(name) {
    return t("gift").replace("{name}", name || "");
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function matchLocale(list) {
    var langs = list;
    if (!langs) {
      if (typeof navigator === "undefined") return "en";
      langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    }
    for (var i = 0; i < langs.length; i++) {
      var base = String(langs[i] || "").toLowerCase().split("-")[0];
      if (LOCALES.indexOf(base) !== -1) return base;
    }
    return "en";
  }

  function chooseLang(search, stored, navList) {
    var q = "";
    try {
      q = new URLSearchParams(search || "").get("lang") || "";
    } catch (err) {
      q = "";
    }
    q = q.toLowerCase();
    if (LOCALES.indexOf(q) !== -1) return q;
    stored = String(stored || "").toLowerCase();
    if (LOCALES.indexOf(stored) !== -1) return stored;
    return matchLocale(navList);
  }

  function readVariant(search) {
    var v = "";
    try {
      v = new URLSearchParams(search || "").get("variant") || "";
    } catch (err) {
      v = "";
    }
    v = v.toLowerCase();
    if (v === "soft" || v === "neutral") return "soft";
    return "bold";
  }

  function slugFromPath(pathname) {
    var path = String(pathname || "").replace(/\/index\.html$/i, "/");
    var bits = path.split("/").filter(Boolean);
    var at = -1;
    for (var i = 0; i < bits.length; i++) if (bits[i] === "sites") at = i;
    if (at !== -1 && bits[at + 1] && bits[at + 1] !== "template") return decodeURIComponent(bits[at + 1]);
    return "";
  }

  function formUrl(value) {
    var raw = String(value || "").trim();
    if (!raw || /placeholder|paste|example\.invalid|todo/i.test(raw)) return "";
    try {
      var url = new URL(raw);
      if (url.protocol !== "https:") return "";
      return url.toString();
    } catch (err) {
      return "";
    }
  }

  function bookingSrc(raw, slug) {
    var clean = formUrl(raw);
    if (!clean) return "";
    var url = new URL(clean);
    url.searchParams.set("shop_slug", slug || "");
    return url.toString();
  }

  function telDigits(phone) {
    var digits = String(phone || "").replace(/\D/g, "");
    if (digits.length === 10) return "+1" + digits;
    if (digits.length === 11 && digits.charAt(0) === "1") return "+" + digits;
    if (digits.length > 7) return "+" + digits;
    return "";
  }

  function mapsLink(item) {
    var given = String((item && item.mapsUrl) || "").trim();
    if (/^https:\/\//i.test(given)) return given;
    var q = [item && item.name, item && item.address].filter(Boolean).join(" ").trim();
    if (!q) return "";
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  }

  function serviceList(services) {
    if (!Array.isArray(services)) return [];
    return services.map(function (service) {
      if (typeof service === "string") return { name: service.trim(), price: "" };
      if (!service || !service.name) return null;
      return {
        name: String(service.name).trim(),
        price: service.price != null ? String(service.price).trim() : ""
      };
    }).filter(function (row) { return row && row.name; });
  }

  function menuHtml(services) {
    var rows = (services || []).map(function (service) {
      var price = service.price || t("ask");
      return '<li class="svc"><span class="svc-name">' + esc(service.name) + '</span><span class="svc-price">' + esc(price) + "</span></li>";
    });
    if (rows.length <= 6) return '<ul class="menu">' + rows.join("") + "</ul>";
    var label = t("seeAll").replace("{n}", String(rows.length));
    return '<ul class="menu">' + rows.slice(0, 6).join("") + '</ul><details class="more"><summary>' + esc(label) + "</summary><ul class=\"menu\">" + rows.slice(6).join("") + "</ul></details>";
  }

  function splitHours(hours) {
    var raw = hours;
    if (raw == null || raw === "") return [];
    if (typeof raw === "string") raw = raw.split(/\s*;\s*/);
    if (!Array.isArray(raw)) return [];
    return raw.map(function (row) {
      if (row && typeof row === "object") {
        return { days: String(row.days || "").trim(), time: String(row.time || "").trim() };
      }
      var text = String(row || "").trim();
      if (!text) return { days: "", time: "" };
      var match = text.match(/^(.+?)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*[–—-]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?)$/i);
      if (match) return { days: match[1].trim(), time: match[2].replace(/\s+/g, " ").trim() };
      return { days: text, time: "" };
    }).filter(function (row) { return row.days; });
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
    if (minute === 0) return h12 + " " + ap;
    return h12 + ":" + (minute < 10 ? "0" : "") + minute + " " + ap;
  }

  function statusFor(hours, now) {
    var rows = Array.isArray(hours) && hours.length && hours[0] && typeof hours[0] === "object" && ("days" in hours[0] || "time" in hours[0])
      ? hours
      : splitHours(hours);
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(now || new Date());
    var got = {};
    parts.forEach(function (part) {
      if (part.type !== "literal") got[part.type] = part.value;
    });
    var weekday = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[got.weekday];
    var minutes = parseInt(got.hour, 10) * 60 + parseInt(got.minute, 10);
    if (weekday == null || isNaN(minutes)) return null;
    var byDay = {};
    rows.forEach(function (row) {
      var range = parseRange(row.time);
      if (!range) return;
      parseDays(row.days).forEach(function (day) { byDay[day] = range; });
    });
    if (!Object.keys(byDay).length && !rows.some(function (row) { return confirmDays(row).length; })) return null;
    var today = byDay[weekday];
    if (today && minutes >= today.open && minutes < today.close) {
      return { open: true, line: t("openNow") + " · " + fill("closesAt", formatWhen(today.close)) };
    }
    var confirmToday = false;
    rows.forEach(function (row) {
      if (confirmDays(row).indexOf(weekday) !== -1) confirmToday = true;
    });
    if (confirmToday) return { open: null, line: t("confirm") };
    if (today && minutes < today.open) {
      return { open: false, line: t("closed") + " · " + fill("opensAt", formatWhen(today.open)) };
    }
    for (var step = 1; step <= 7; step++) {
      var next = byDay[(weekday + step) % 7];
      if (next) return { open: false, line: t("closed") + " · " + fill("opensAt", formatWhen(next.open)) };
    }
    return null;
  }

  function confirmDays(row) {
    var blob = String((row && row.days) || "") + " " + String((row && row.time) || "");
    if (!/call to confirm/i.test(blob)) return [];
    var label = String(row.days || "").split(":")[0].trim();
    return parseDays(label);
  }

  function primaryAction(status) {
    if (status && status.open) return { id: "call", labelKey: "callNow" };
    if (status && status.open === false) return { id: "text", labelKey: "textUs" };
    return { id: "call", labelKey: "call" };
  }

  function hexToRgb(hex) {
    var h = String(hex || "").trim().replace(/^#/, "");
    if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return null;
    if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex(c) {
    function z(v) {
      return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }
    return "#" + z(c.r) + z(c.g) + z(c.b);
  }

  function channelLum(v) {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }

  function lum(c) {
    return 0.2126 * channelLum(c.r) + 0.7152 * channelLum(c.g) + 0.0722 * channelLum(c.b);
  }

  function contrast(a, b) {
    var hi = Math.max(lum(a), lum(b));
    var lo = Math.min(lum(a), lum(b));
    return (hi + 0.05) / (lo + 0.05);
  }

  function mix(a, b, amount) {
    return {
      r: a.r + (b.r - a.r) * amount,
      g: a.g + (b.g - a.g) * amount,
      b: a.b + (b.b - a.b) * amount
    };
  }

  function readableFill(rgb) {
    var white = { r: 255, g: 255, b: 255 };
    var black = { r: 29, g: 22, b: 20 };
    if (contrast(rgb, white) >= 4.5) return { fill: rgb, on: white };
    var cur = rgb;
    for (var i = 1; i <= 20; i++) {
      cur = mix(rgb, black, i / 20);
      if (contrast(cur, white) >= 4.5) return { fill: cur, on: white };
    }
    return { fill: black, on: white };
  }

  function readableMark(rgb, paper) {
    if (contrast(rgb, paper) >= 3) return rgb;
    var toward = (paper.r + paper.g + paper.b) / 3 > 160
      ? { r: 29, g: 22, b: 20 }
      : { r: 246, g: 241, b: 234 };
    var cur = rgb;
    for (var i = 1; i <= 20; i++) {
      cur = mix(rgb, toward, i / 20);
      if (contrast(cur, paper) >= 3) return cur;
    }
    return toward;
  }

  function accentVars(hex, dark) {
    var rgb = hexToRgb(hex);
    if (!rgb) return null;
    var paper = dark ? { r: 19, g: 17, b: 16 } : { r: 246, g: 241, b: 234 };
    var fill = readableFill(rgb);
    var mark = readableMark(rgb, paper);
    return {
      accent: rgbToHex(mark),
      fill: rgbToHex(fill.fill),
      on: "#ffffff",
      blob: "rgba(" + [mark.r, mark.g, mark.b].map(function (n) { return Math.round(n); }).join(",") + "," + (dark ? "0.34" : "0.2") + ")",
      markContrast: contrast(mark, paper),
      fillContrast: contrast(fill.fill, fill.on)
    };
  }

  function applyAccent(hex) {
    var root = document.documentElement;
    ["--accent", "--accent-fill", "--on-accent", "--blob"].forEach(function (name) {
      root.style.removeProperty(name);
    });
    var dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var vars = accentVars(hex, !!dark);
    if (!vars) return;
    root.style.setProperty("--accent", vars.accent);
    root.style.setProperty("--accent-fill", vars.fill);
    root.style.setProperty("--on-accent", vars.on);
    root.style.setProperty("--blob", vars.blob);
  }

  function scribble() {
    return '<svg class="scribble" viewBox="0 0 200 18" aria-hidden="true" focusable="false"><path d="M3 12c18-8 34-8 48-2c16 6 28-8 46-6c18 2 30 10 52 2c16-6 32-4 48 2" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  }

  function arrow() {
    return '<svg class="arrow" viewBox="0 0 86 52" aria-hidden="true" focusable="false"><path d="M6 14c20 2 32 10 40 28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M34 34l14 10-16 2" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function photoFigure(photo, eager) {
    var sample = !photo || photo.sample !== false;
    var alt = (photo && photo.alt && String(photo.alt).trim()) || t("samplePhoto");
    return [
      '<figure class="shot">',
      '<span class="shot-media">',
      '<img src="' + esc(photo.src) + '" alt="' + esc(alt) + '" width="800" height="1000"',
      ' loading="eager"' + (eager ? ' fetchpriority="high"' : ""),
      ' decoding="async" />',
      "</span>",
      sample ? '<span class="tag">' + esc(t("samplePhoto")) + "</span>" : "",
      "</figure>"
    ].join("");
  }

  function paint(focusLang) {
    if (!shop) return;
    var root = document.getElementById("app");
    if (!root) return;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-variant", readVariant(location.search));
    document.title = shop.name || "Shop";
    var described = document.querySelector('meta[name="description"]');
    if (described && shop.name) described.setAttribute("content", "Sample shop website for " + shop.name + ".");
    var skip = document.querySelector(".skip");
    if (skip) skip.textContent = t("skip");
    applyAccent(shop.accent);

    var phone = telDigits(shop.phone);
    var displayPhone = String(shop.phone || "").trim();
    var maps = mapsLink(shop);
    var rows = splitHours(shop.hours);
    var status = statusFor(rows);
    var action = primaryAction(status);
    var photos = Array.isArray(shop.photos) ? shop.photos.filter(function (photo) { return photo && photo.src; }) : [];
    var services = serviceList(shop.services);
    var links = Array.isArray(shop.links) ? shop.links.filter(function (link) {
      return link && /^https:\/\//i.test(String(link.href || ""));
    }) : [];
    var offer = String(shop.offer || "").trim();
    var offerSample = offer && shop.offerConfirmed !== true;
    var slug = slugFromPath(location.pathname);
    var frame = bookingSrc(shop.bookingUrl, slug);
    var lead = photos[0];
    var rest = offer && lead ? photos.slice(1) : photos;

    var chips = LOCALES.map(function (code) {
      return '<button type="button" data-lang="' + code + '" aria-pressed="' + (code === lang ? "true" : "false") + '" aria-label="' + esc(code.toUpperCase() + ", " + LANG_NAME[code]) + '">' + code.toUpperCase() + "</button>";
    }).join("");

    var menu = menuHtml(services);

    var hourRows = rows.map(function (row) {
      if (!row.time) return '<li class="hours-plain"><span>' + esc(row.days) + "</span></li>";
      return "<li><span>" + esc(row.days) + "</span><time>" + esc(row.time) + "</time></li>";
    }).join("");

    var thumbs = rest.map(function (photo, index) {
      return photoFigure(photo, !offer && index === 0);
    }).join("");

    var offerHtml = "";
    if (offer) {
      offerHtml = [
        '<div class="break' + (lead ? " has-photo" : "") + '">',
        '<div class="blob" aria-hidden="true"></div>',
        arrow(),
        '<section class="offer' + (offerSample ? " is-sample" : "") + '">',
        offerSample ? '<p class="tag">' + esc(t("sampleOffer")) + "</p>" : "",
        "<h2>" + esc(offer) + "</h2>",
        "</section>",
        lead ? photoFigure(lead, true) : "",
        "</div>"
      ].join("");
    }

    var shotsHtml = thumbs
      ? '<section class="shots-wrap" aria-label="' + esc(t("samplePhoto")) + '"><div class="shots">' + thumbs + "</div></section>"
      : "";
    if (!offer && photos.length) {
      shotsHtml = [
        '<div class="break shots-only">',
        '<div class="blob" aria-hidden="true"></div>',
        '<div class="shots">' + photos.map(function (photo, index) { return photoFigure(photo, index === 0); }).join("") + "</div>",
        "</div>"
      ].join("");
    }

    var linkHtml = links.map(function (link) {
      return '<div><a href="' + esc(link.href) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label || link.href) + "</a></div>";
    }).join("");
    var bookAlt = links.filter(function (link) {
      return /^book\b/i.test(String(link.label || ""));
    }).map(function (link) {
      return '<a class="book-alt" href="' + esc(link.href) + '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + "</a>";
    }).join("");

    var callBtn = phone
      ? '<a class="' + (action.id === "call" ? "primary" : "") + '" href="tel:' + esc(phone) + '">' + esc(action.id === "call" ? t(action.labelKey) : t("call")) + "</a>"
      : "";
    var textBtn = phone
      ? '<a class="' + (action.id === "text" ? "primary" : "") + '" href="sms:' + esc(phone) + '">' + esc(action.id === "text" ? t(action.labelKey) : t("text")) + "</a>"
      : "";
    var dirBtn = maps
      ? '<a href="' + esc(maps) + '" target="_blank" rel="noopener noreferrer">' + esc(t("directions")) + "</a>"
      : "";
    var bookBtn = '<a href="#booking">' + esc(t("book")) + "</a>";

    var booking = [
      '<section id="booking" class="booking" tabindex="-1">',
      "<h2>" + esc(t("request")) + "</h2>",
      bookAlt,
      frame
        ? '<iframe class="booking-frame" title="' + esc(t("request")) + '" src="' + esc(frame) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>'
        : "<p>" + esc(t("bookFallback")) + "</p>" + (phone ? '<div class="actions"><a class="btn" href="tel:' + esc(phone) + '">' + esc(t("call")) + '</a><a class="btn" href="sms:' + esc(phone) + '">' + esc(t("text")) + "</a></div>" : ""),
      "</section>"
    ].join("");

    var state = !status ? "unknown" : status.open === true ? "open" : status.open === false ? "closed" : "confirm";
    var shopName = String(shop.name || "").trim();
    var listingUrl = safeDirectory(shop.directoryUrl);
    var helpUrl = "../help/?shop=" + encodeURIComponent(shopName);
    var gift = [
      '<aside class="gift">',
      "<p>" + giftLine(esc(shopName)) + "</p>",
      '<div class="gift-actions">',
      listingUrl ? '<a href="' + esc(listingUrl) + '">' + esc(t("giftListing")) + "</a>" : "",
      '<a href="' + esc(helpUrl) + '">' + esc(t("giftHelp")) + "</a>",
      "</div>",
      "</aside>"
    ].join("");
    root.innerHTML = [
      gift,
      '<header class="topbar">',
      '<div class="scroll-progress" aria-hidden="true"></div>',
      '<div class="langs" role="group" aria-label="' + esc(t("language")) + '">' + chips + "</div>",
      status ? '<p class="status' + (status.open ? " is-open" : "") + '" role="status"><span class="dot" aria-hidden="true"></span>' + esc(status.line) + "</p>" : "",
      "</header>",
      '<main id="main">',
      '<p class="banner">' + esc(t("sample")) + "</p>",
      "<h1><span>" + esc(shop.name || "Shop") + "</span>" + scribble() + "</h1>",
      shop.tagline ? '<p class="tagline">' + esc(shop.tagline) + "</p>" : "",
      shop.walkIns ? '<p class="walk">' + esc(shop.walkIns) + "</p>" : "",
      offerHtml,
      '<p class="note reveal">' + esc(t("note")) + "</p>",
      services.length ? '<section class="reveal"><h2>' + esc(t("services")) + "</h2>" + (String(shop.priceNote || "").trim() ? '<p class="price-note">' + esc(String(shop.priceNote).trim()) + "</p>" : "") + menu + "</section>" : "",
      shotsHtml,
      rows.length ? '<section class="reveal"><h2>' + esc(t("hours")) + '</h2><div class="card"><ul class="hours">' + hourRows + "</ul></div></section>" : "",
      shop.address ? '<section class="reveal"><h2>' + esc(t("find")) + '</h2><div class="card"><p class="address">' + esc(shop.address) + "</p>" + (String(shop.extra || "").trim() ? '<p class="aside">' + esc(String(shop.extra).trim()) + "</p>" : "") + (maps ? '<a class="btn" href="' + esc(maps) + '" target="_blank" rel="noopener noreferrer">' + esc(t("maps")) + "</a>" : "") + "</div></section>" : "",
      booking,
      "<footer class=\"reveal\"><strong>" + esc(shop.name || "Shop") + "</strong>" + (shop.address ? "<div>" + esc(shop.address) + "</div>" : "") + (displayPhone && phone ? '<div><a href="tel:' + esc(phone) + '">' + esc(displayPhone) + "</a></div>" : "") + linkHtml + '<p class="banner">' + esc(t("sample")) + "</p></footer>",
      "</main>",
      '<nav class="dock" data-state="' + state + '" aria-label="' + esc(t("contact")) + '">',
      callBtn,
      textBtn,
      dirBtn,
      bookBtn,
      "</nav>"
    ].join("");

    Array.prototype.forEach.call(root.querySelectorAll("[data-lang]"), function (button) {
      button.addEventListener("click", function () {
        var next = button.getAttribute("data-lang");
        try { localStorage.setItem(STORAGE, next); } catch (err) {}
        var url = new URL(location.href);
        url.searchParams.set("lang", next);
        history.replaceState(null, "", url.pathname + url.search + url.hash);
        lang = next;
        paint(next);
      });
    });

    if (focusLang) {
      var again = root.querySelector('[data-lang="' + focusLang + '"]');
      if (again) again.focus({ preventScroll: true });
    }
    ensureBookingEmbed(!!frame);
    motionFallback();
  }

  function motionFallback() {
    if (motionObserver) {
      motionObserver.disconnect();
      motionObserver = null;
    }
    var root = document.documentElement;
    root.classList.remove("motion-fallback");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var supported = window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
    if (reduce || supported || typeof IntersectionObserver !== "function") return;
    root.classList.add("motion-fallback");
    var nodes = root.querySelectorAll("#app .reveal, #app .shot");
    var viewHeight = window.innerHeight || 800;
    var pending = [];
    Array.prototype.forEach.call(nodes, function (node) {
      var rect = node.getBoundingClientRect();
      if (rect.top < viewHeight * 0.9 && rect.bottom > 32) node.classList.add("is-in");
      else pending.push(node);
    });
    if (!pending.length) return;
    motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        motionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    pending.forEach(function (node) { motionObserver.observe(node); });
  }

  function ensureBookingEmbed(active) {
    var existing = document.querySelector("script[data-bog-form-embed]");
    if (!active) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    var script = document.createElement("script");
    script.src = FORM_EMBED;
    script.async = true;
    script.setAttribute("data-bog-form-embed", "true");
    document.body.appendChild(script);
  }

  function boot() {
    var stored = "";
    try { stored = localStorage.getItem(STORAGE) || ""; } catch (err) { stored = ""; }
    lang = chooseLang(location.search, stored, null);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-variant", readVariant(location.search));
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    if (mq && mq.addEventListener) {
      mq.addEventListener("change", function () { if (shop) applyAccent(shop.accent); });
    }
    fetch("site.json")
      .then(function (response) {
        if (!response.ok) throw new Error("site.json");
        return response.json();
      })
      .then(function (data) {
        shop = data || {};
        paint();
      })
      .catch(function () {
        var root = document.getElementById("app");
        if (root) root.textContent = "This sample page could not load its shop file.";
      });
  }

  return {
    boot: boot,
    chooseLang: chooseLang,
    readVariant: readVariant,
    slugFromPath: slugFromPath,
    formUrl: formUrl,
    bookingSrc: bookingSrc,
    telDigits: telDigits,
    splitHours: splitHours,
    statusFor: statusFor,
    primaryAction: primaryAction,
    accentVars: accentVars,
    contrast: contrast,
    hexToRgb: hexToRgb,
    serviceList: serviceList,
    menuHtml: menuHtml,
    mapsLink: mapsLink,
    safeDirectory: safeDirectory,
    giftLine: giftLine,
    COPY: COPY,
    LOCALES: LOCALES,
    FORM_EMBED: FORM_EMBED
  };
});
