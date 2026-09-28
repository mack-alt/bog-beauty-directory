(function () {
  var LOCALES = ["en", "vi", "es", "zh", "ko", "th"];
  var COPY = {
    en: {
      demo: "Demo",
      shopName: "Shop name",
      call: "Call {shop}",
      calling: "Calling {shop}…",
      noAnswer: "No answer",
      m1: "Hi! Sorry we missed your call, we're with a client. Want to book? Reply with a day and time, or tap here to see openings.",
      m2: "Tomorrow around 2?",
      m3: "We have 2:00 or 2:30 tomorrow. Which works?",
      m4: "2:30",
      m5: "You're booked for 2:30 tomorrow. See you then!",
      end: "That call would have been a missed customer. Now it's a booking.",
      replay: "Replay",
      credit: "Blades of Grass front desk · Call or text Kenny 206-743-6296",
      language: "Language"
    },
    vi: {
      demo: "Demo",
      shopName: "Tên tiệm",
      call: "Gọi {shop}",
      calling: "Đang gọi {shop}…",
      noAnswer: "Không nghe máy",
      m1: "Chào bạn! Xin lỗi, tiệm không nghe máy kịp vì đang làm cho khách. Bạn muốn đặt lịch không? Nhắn ngày với giờ, hoặc bấm vào đây để xem giờ trống.",
      m2: "Mai tầm 2 giờ được không?",
      m3: "Mai còn 2:00 hoặc 2:30. Giờ nào tiện cho bạn?",
      m4: "2:30",
      m5: "Mình giữ lịch 2:30 ngày mai cho bạn. Hẹn gặp bạn!",
      end: "Cuộc gọi đó đáng lẽ là một khách bị lỡ. Giờ thành một lịch hẹn.",
      replay: "Xem lại",
      credit: "Blades of Grass lễ tân · Gọi hoặc nhắn Kenny 206-743-6296",
      language: "Ngôn ngữ"
    },
    es: {
      demo: "Demo",
      shopName: "Nombre",
      call: "Llamar a {shop}",
      calling: "Llamando a {shop}…",
      noAnswer: "No contesta",
      m1: "¡Hola! Perdón, se nos pasó tu llamada. Estamos con un cliente. ¿Quieres agendar? Contesta con día y hora, o toca aquí para ver horarios.",
      m2: "¿Mañana como a las 2?",
      m3: "Mañana tenemos 2:00 o 2:30. ¿Cuál te va?",
      m4: "2:30",
      m5: "Listo, quedaste a las 2:30 mañana. ¡Ahí te esperamos!",
      end: "Esa llamada habría sido un cliente perdido. Ahora es una cita.",
      replay: "Otra vez",
      credit: "Blades of Grass recepción · Llama o escribe a Kenny 206-743-6296",
      language: "Idioma"
    },
    zh: {
      demo: "演示",
      shopName: "店名",
      call: "致电{shop}",
      calling: "正在呼叫{shop}…",
      noAnswer: "无人接听",
      m1: "你好！刚才没接到电话，正在给客人服务。想预约吗？回复日期和时间，或点这里看空档。",
      m2: "明天两点左右可以吗？",
      m3: "明天 2:00 或 2:30 有空。你选哪个？",
      m4: "2:30",
      m5: "已帮你约了明天 2:30。到时见！",
      end: "这通电话本来会错过一位客人。现在变成了一个预约。",
      replay: "再看一遍",
      credit: "Blades of Grass 前台 · 打电话或发短信给 Kenny 206-743-6296",
      language: "语言"
    },
    ko: {
      demo: "데모",
      shopName: "가게 이름",
      call: "{shop}에 전화",
      calling: "{shop}에 전화 거는 중…",
      noAnswer: "전화를 안 받아요",
      m1: "안녕하세요! 전화를 못 받았어요. 지금 손님 받는 중이에요. 예약할까요? 날짜랑 시간을 보내 주시거나, 여기를 눌러 빈 시간을 보세요.",
      m2: "내일 2시쯤 괜찮을까요?",
      m3: "내일 2:00이랑 2:30이 비어요. 언제가 좋으세요?",
      m4: "2:30",
      m5: "내일 2:30으로 예약됐어요. 그때 뵐게요!",
      end: "그 전화는 놓친 손님이 될 뻔했어요. 지금은 예약이 됐어요.",
      replay: "다시 보기",
      credit: "Blades of Grass 프론트 · Kenny에게 전화하거나 문자하세요 206-743-6296",
      language: "언어"
    },
    th: {
      demo: "สาธิต",
      shopName: "ชื่อร้าน",
      call: "โทร {shop}",
      calling: "กำลังโทรหา {shop}…",
      noAnswer: "ไม่มีคนรับสาย",
      m1: "สวัสดีค่ะ ขอโทษที่รับสายไม่ทัน กำลังทำให้ลูกค้าอยู่ค่ะ อยากจองเวลาไหมคะ ตอบวันกับเวลามาได้เลย หรือแตะที่นี่เพื่อดูเวลาว่างค่ะ",
      m2: "พรุ่งนี้ประมาณบ่ายสองได้ไหม?",
      m3: "พรุ่งนี้ว่าง 2:00 กับ 2:30 ค่ะ เวลาไหนสะดวก?",
      m4: "2:30",
      m5: "จองพรุ่งนี้ 2:30 ให้แล้วค่ะ แล้วเจอกันนะคะ",
      end: "สายนี้น่าจะกลายเป็นลูกค้าที่พลาดไป ตอนนี้กลายเป็นการจองแล้ว",
      replay: "เล่นอีกครั้ง",
      credit: "Blades of Grass แผนกต้อนรับ · โทรหรือส่งข้อความถึง Kenny 206-743-6296",
      language: "ภาษา"
    }
  };

  var locale = "en";
  var shopName = "Your Shop";
  var shown = [];
  var timer = null;
  var cursor = -1;
  var running = false;

  var phone = document.getElementById("phone");
  var langsEl = document.getElementById("langs");
  var demoPill = document.getElementById("demo-pill");
  var shopEdit = document.getElementById("shop-edit");
  var shopKicker = document.getElementById("shop-kicker");
  var shopValue = document.getElementById("shop-value");
  var shopForm = document.getElementById("shop-form");
  var shopInput = document.getElementById("shop-input");
  var shopLabel = document.getElementById("shop-label");
  var idle = document.getElementById("screen-idle");
  var callScreen = document.getElementById("screen-call");
  var callShop = document.getElementById("call-shop");
  var callStatus = document.getElementById("call-status");
  var callLabel = document.getElementById("call-label");
  var callBtn = document.getElementById("call-btn");
  var chat = document.getElementById("screen-chat");
  var thread = document.getElementById("thread");
  var endScreen = document.getElementById("screen-end");
  var endLine = document.getElementById("end-line");
  var replay = document.getElementById("replay");
  var credit = document.getElementById("credit");

  function fill(text) {
    return String(text || "").split("{shop}").join(shopName);
  }

  function t(key) {
    var pack = COPY[locale] || COPY.en;
    var value = pack[key] || COPY.en[key] || "";
    return fill(value);
  }

  function knownLang(value) {
    var lang = String(value || "").trim().toLowerCase();
    return LOCALES.indexOf(lang) === -1 ? "" : lang;
  }

  function readInitial() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = (params.get("shop") || "").trim();
    var stored = "";
    try { stored = (localStorage.getItem("bog-textback-shop") || "").trim(); } catch (err) {}
    shopName = (fromUrl || stored || "Your Shop").slice(0, 60);
    locale = knownLang(params.get("lang")) || "en";
  }

  function rememberShop() {
    try { localStorage.setItem("bog-textback-shop", shopName); } catch (err) {}
    var url = new URL(window.location.href);
    url.searchParams.set("shop", shopName);
    url.searchParams.set("lang", locale);
    history.replaceState({}, "", url);
  }

  function setLang(next) {
    if (knownLang(next) === "") return;
    locale = next;
    document.documentElement.lang = locale;
    var url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    if (shopName && shopName !== "Your Shop") url.searchParams.set("shop", shopName);
    history.replaceState({}, "", url);
    paint();
  }

  function paint() {
    document.documentElement.lang = locale;
    langsEl.setAttribute("aria-label", t("language"));
    demoPill.textContent = t("demo");
    shopLabel.textContent = t("shopName");
    shopInput.setAttribute("aria-label", t("shopName"));
    shopInput.placeholder = t("shopName");
    shopKicker.textContent = t("shopName");
    shopValue.textContent = shopName;
    shopEdit.setAttribute("aria-label", t("shopName") + ": " + shopName);
    callLabel.textContent = t("call");
    callShop.textContent = shopName;
    if (!callScreen.hidden) {
      callStatus.textContent = callScreen.classList.contains("is-done") ? t("noAnswer") : t("calling");
    }
    endLine.textContent = t("end");
    replay.textContent = t("replay");
    credit.textContent = t("credit");
    renderLangs();
    renderThread();
  }

  function renderLangs() {
    langsEl.innerHTML = "";
    LOCALES.forEach(function (code) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = code.toUpperCase();
      btn.setAttribute("aria-pressed", code === locale ? "true" : "false");
      btn.addEventListener("click", function () { setLang(code); });
      langsEl.appendChild(btn);
    });
  }

  function renderThread() {
    thread.innerHTML = "";
    shown.forEach(function (item) {
      thread.appendChild(bubble(item.who, t(item.key), false));
    });
    thread.scrollTop = thread.scrollHeight;
  }

  function bubble(who, text, animateNote) {
    var el = document.createElement("p");
    el.className = "bubble " + who + (animateNote ? " note" : " in");
    el.textContent = text;
    return el;
  }

  function addMessage(who, key, notify) {
    shown.push({ who: who, key: key });
    var el = bubble(who, t(key), !!notify);
    thread.appendChild(el);
    thread.scrollTop = thread.scrollHeight;
    if (notify) {
      phone.classList.remove("buzz");
      void phone.offsetWidth;
      phone.classList.add("buzz");
    }
  }

  function showOnly(which) {
    idle.hidden = which !== "idle";
    callScreen.hidden = which !== "call";
    chat.hidden = which !== "chat";
    endScreen.hidden = which !== "end";
  }

  function stopTimer() {
    if (timer) clearTimeout(timer);
    timer = null;
    running = false;
  }

  var steps = [
    function calling() {
      showOnly("call");
      callScreen.classList.remove("is-done");
      callStatus.textContent = t("calling");
    },
    function noAnswer() {
      callScreen.classList.add("is-done");
      callStatus.textContent = t("noAnswer");
    },
    function openChat() {
      showOnly("chat");
    },
    function msg1() { addMessage("shop", "m1", true); },
    function msg2() { addMessage("me", "m2", false); },
    function msg3() { addMessage("shop", "m3", false); },
    function msg4() { addMessage("me", "m4", false); },
    function msg5() { addMessage("shop", "m5", false); },
    function ending() { showOnly("end"); }
  ];

  var waits = [0, 3000, 1800, 2200, 3400, 3000, 2800, 2600, 2400];

  function go(index) {
    cursor = index;
    steps[index]();
    if (index + 1 >= steps.length) {
      running = false;
      return;
    }
    running = true;
    timer = setTimeout(function () { go(index + 1); }, waits[index + 1]);
  }

  function skip() {
    if (!running || chat.hidden) return;
    stopTimer();
    go(cursor + 1);
  }

  function reset() {
    stopTimer();
    cursor = -1;
    shown = [];
    thread.innerHTML = "";
    callScreen.classList.remove("is-done");
    phone.classList.remove("buzz");
    showOnly("idle");
    paint();
  }

  function start() {
    if (running || cursor !== -1) return;
    go(0);
  }

  callBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    start();
  });

  chat.addEventListener("click", function () { skip(); });

  replay.addEventListener("click", function (event) {
    event.stopPropagation();
    reset();
  });

  shopEdit.addEventListener("click", function () {
    shopForm.hidden = false;
    shopEdit.hidden = true;
    shopInput.value = shopName;
    shopInput.focus();
    shopInput.select();
  });

  shopForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (shopForm.hidden) return;
    var next = shopInput.value.trim().slice(0, 60);
    if (next) shopName = next;
    shopForm.hidden = true;
    shopEdit.hidden = false;
    rememberShop();
    paint();
  });

  shopInput.addEventListener("blur", function () {
    shopForm.requestSubmit();
  });

  readInitial();
  reset();
})();
