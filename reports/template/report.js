(function () {
  var LOCALES = ["en", "vi", "es", "zh", "ko", "th"];
  var STORAGE = "bog-report-lang";
  var COPY = {
    sample: {
      en: "Sample checkup by Blades of Grass",
      vi: "Bản kiểm tra mẫu bởi Blades of Grass",
      es: "Revisión de muestra por Blades of Grass",
      zh: "Blades of Grass 示例检查",
      ko: "Blades of Grass 샘플 점검",
      th: "ตัวอย่างการตรวจโดย Blades of Grass"
    },
    language: { en: "Language", vi: "Ngôn ngữ", es: "Idioma", zh: "语言", ko: "언어", th: "ภาษา" },
    kicker: {
      en: "Front Door Checkup",
      vi: "Kiểm tra cửa trước",
      es: "Revisión de la puerta de entrada",
      zh: "店门检查",
      ko: "프론트 점검",
      th: "ตรวจหน้าร้าน"
    },
    checked: { en: "Checked", vi: "Đã xem", es: "Revisado", zh: "检查于", ko: "확인", th: "ตรวจเมื่อ" },
    score: {
      en: "{n} of {total} green",
      vi: "{n} / {total} mục xanh",
      es: "{n} de {total} en verde",
      zh: "{total} 项中 {n} 项为绿色",
      ko: "{total}개 중 {n}개 초록",
      th: "เขียว {n} จาก {total}"
    },
    found: { en: "What we found", vi: "Chúng tôi thấy", es: "Qué encontramos", zh: "我们发现", ko: "확인한 내용", th: "สิ่งที่พบ" },
    why: { en: "Why it matters", vi: "Vì sao quan trọng", es: "Por qué importa", zh: "为什么重要", ko: "왜 중요한가", th: "ทำไมเรื่องนี้ถึงสำคัญ" },
    fix: { en: "One simple fix", vi: "Một cách sửa đơn giản", es: "Un arreglo simple", zh: "一个简单改法", ko: "간단한 해결", th: "วิธีแก้ที่ง่าย" },
    notChecked: { en: "Not checked", vi: "Chưa kiểm tra", es: "No revisado", zh: "未检查", ko: "확인 안 함", th: "ยังไม่ได้ตรวจ" },
    visit: { en: "Test on visit", vi: "Kiểm tra khi đến", es: "Probar en la visita", zh: "到店时测试", ko: "방문 때 테스트", th: "ทดสอบตอนไปร้าน" },
    green: { en: "Green", vi: "Xanh", es: "Verde", zh: "绿色", ko: "초록", th: "เขียว" },
    yellow: { en: "Yellow", vi: "Vàng", es: "Amarillo", zh: "黄色", ko: "노랑", th: "เหลือง" },
    red: { en: "Red", vi: "Đỏ", es: "Rojo", zh: "红色", ko: "빨강", th: "แดง" },
    did: {
      en: "What we already did for you",
      vi: "Những gì đã làm sẵn cho tiệm",
      es: "Lo que ya hicimos por ti",
      zh: "我们已经为你做好的",
      ko: "이미 준비해 둔 것",
      th: "สิ่งที่ทำให้แล้ว"
    },
    sources: { en: "Sources", vi: "Nguồn", es: "Fuentes", zh: "来源", ko: "출처", th: "แหล่งที่มา" },
    save: { en: "Save as PDF", vi: "Lưu PDF", es: "Guardar como PDF", zh: "存为 PDF", ko: "PDF로 저장", th: "บันทึกเป็น PDF" },
    call: { en: "Call", vi: "Gọi", es: "Llamar", zh: "电话", ko: "전화", th: "โทร" },
    text: { en: "Text", vi: "Nhắn tin", es: "Mensaje", zh: "短信", ko: "문자", th: "ข้อความ" },
    book: { en: "See a demo booking", vi: "Xem lịch hẹn mẫu", es: "Ver una reserva de muestra", zh: "查看示例预约", ko: "샘플 예약 보기", th: "ดูตัวอย่างการจอง" }
  };

  var lang = "en";
  var report = null;

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

  function gradeLabel(grade) {
    if (grade === "green" || grade === "yellow" || grade === "red") return t(grade);
    if (grade === "visit") return t("visit");
    return t("notChecked");
  }

  function paint() {
    if (!report) return;
    var root = document.getElementById("app");
    document.title = t("kicker") + " — " + (report.shopName || "");
    if (report.accent) document.documentElement.style.setProperty("--accent", report.accent);
    var areas = Array.isArray(report.areas) ? report.areas : [];
    var greens = areas.filter(function (area) { return area.grade === "green"; }).length;
    var score = t("score").replace("{n}", String(greens)).replace("{total}", String(areas.length));

    var chips = LOCALES.map(function (code) {
      return '<button type="button" data-lang="' + code + '" aria-pressed="' + (code === lang ? "true" : "false") + '">' + code.toUpperCase() + "</button>";
    }).join("");

    var dots = areas.map(function (area) {
      var grade = area.grade === "green" || area.grade === "yellow" || area.grade === "red" || area.grade === "visit" ? area.grade : "visit";
      return '<i class="' + grade + '"></i>';
    }).join("");

    var cards = areas.map(function (area) {
      var grade = area.grade === "green" || area.grade === "yellow" || area.grade === "red" || area.grade === "visit" ? area.grade : "visit";
      var missed = Array.isArray(area.notChecked) ? area.notChecked.filter(Boolean) : [];
      var rows = Array.isArray(area.compare) ? area.compare : [];
      var compare = rows.map(function (row) {
        return '<li class="' + (row.you ? "you" : "") + '"><strong>' + esc(row.name) + "</strong><span>" + esc(row.detail) + "</span></li>";
      }).join("");
      return [
        '<article class="area ' + grade + '">',
        '<p class="badge"><b></b>' + esc(gradeLabel(grade)) + "</p>",
        "<h2>" + esc(area.title) + "</h2>",
        "<h3>" + esc(t("found")) + "</h3>",
        "<p>" + esc(area.found) + "</p>",
        compare ? '<ul class="compare">' + compare + "</ul>" : "",
        "<h3>" + esc(t("why")) + "</h3>",
        "<p>" + esc(area.why) + "</p>",
        "<h3>" + esc(t("fix")) + "</h3>",
        "<p>" + esc(area.fix) + "</p>",
        missed.length ? '<p class="unchecked">' + esc(t("notChecked")) + ": " + esc(missed.join(". ")) + "</p>" : "",
        area.checkLine ? '<p class="checkline"><span class="box" aria-hidden="true"></span><span>' + esc(area.checkLine) + "</span></p>" : "",
        "</article>"
      ].join("");
    }).join("");

    var did = Array.isArray(report.did) ? report.did : [];
    var didHtml = did.map(function (item) {
      if (!item || !item.label) return "";
      if (!item.href) return "<li>" + esc(item.label) + "</li>";
      return '<li><a href="' + esc(item.href) + '">' + esc(item.label) + "</a></li>";
    }).join("");

    var cta = report.cta || {};
    var tel = cta.phone || "";
    var sources = Array.isArray(report.sources) ? report.sources : [];
    var sourceHtml = sources.map(function (item) {
      if (!item || !item.label) return "";
      if (!item.href) return "<li>" + esc(item.label) + "</li>";
      return '<li><a href="' + esc(item.href) + '">' + esc(item.label) + "</a></li>";
    }).join("");

    root.innerHTML = [
      '<div class="langs" role="group" aria-label="' + esc(t("language")) + '">' + chips + "</div>",
      '<p class="pill">' + esc(t("sample")) + "</p>",
      '<p class="kicker">' + esc(t("kicker")) + "</p>",
      "<h1>" + esc(report.shopName) + "</h1>",
      '<p class="when">' + esc(t("checked")) + " " + esc(report.checkDate) + "</p>",
      '<section class="score"><div class="dots" aria-hidden="true">' + dots + "</div><strong>" + esc(score) + "</strong><p class=\"headline\">" + esc(report.headline) + "</p></section>",
      cards,
      '<section class="panel"><h2>' + esc(t("did")) + "</h2><ul>" + didHtml + "</ul></section>",
      '<section class="panel"><p>' + esc(cta.line) + '</p><div class="actions">',
      tel ? '<a href="tel:' + esc(tel) + '">' + esc(t("call")) + "</a>" : "",
      tel ? '<a href="sms:' + esc(tel) + '">' + esc(t("text")) + "</a>" : "",
      cta.bookUrl ? '<a class="book" href="' + esc(cta.bookUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(t("book")) + "</a>" : "",
      "</div></section>",
      '<button type="button" class="print-btn no-print">' + esc(t("save")) + "</button>",
      "<footer><p class=\"foot-note\">" + esc(t("sources")) + "</p><ul class=\"sources\">" + sourceHtml + "</ul></footer>"
    ].join("");

    Array.prototype.forEach.call(root.querySelectorAll("[data-lang]"), function (button) {
      button.addEventListener("click", function () {
        setLang(button.getAttribute("data-lang"));
      });
    });
    var printBtn = root.querySelector(".print-btn");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }

  lang = readLang();
  document.documentElement.lang = lang;
  fetch("report.json")
    .then(function (response) {
      if (!response.ok) throw new Error("report.json");
      return response.json();
    })
    .then(function (data) {
      report = data;
      paint();
    })
    .catch(function () {
      var root = document.getElementById("app");
      if (root) root.textContent = "This checkup could not load its report file.";
    });
})();
