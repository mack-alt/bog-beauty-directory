/**
 * BoG shop chrome phrase pack (EN | VI | ES | ZH | KO | TH).
 * Keep in sync with i18n/phrases.json.
 * Missing locale for a key falls back to EN for that key only. Never invent copy.
 */
(function (root) {
  var LOCALES = ["en", "vi", "es", "zh", "ko", "th"];

  var PHRASES = {
    call: { en: "Call", vi: "Gọi", es: "Llamar", zh: "电话", ko: "전화", th: "โทร" },
    text: { en: "Text", vi: "Nhắn tin", es: "Mensaje", zh: "短信", ko: "문자", th: "ข้อความ" },
    directions: { en: "Directions", vi: "Chỉ đường", es: "Cómo llegar", zh: "路线", ko: "길찾기", th: "เส้นทาง" },
    reviewsOnGoogle: { en: "Reviews on Google", vi: "Đánh giá trên Google", es: "Reseñas en Google", zh: "Google 评价", ko: "Google 리뷰", th: "รีวิวบน Google" },
    share: { en: "Share", vi: "Chia sẻ", es: "Compartir", zh: "分享", ko: "공유", th: "แชร์" },
    book: { en: "Book", vi: "Đặt lịch", es: "Reservar", zh: "预约", ko: "예약", th: "จอง" },
    instagram: { en: "Instagram", vi: "Instagram", es: "Instagram", zh: "Instagram", ko: "Instagram", th: "Instagram" },
    website: { en: "Website", vi: "Website", es: "Sitio web", zh: "网站", ko: "웹사이트", th: "เว็บไซต์" },
    offer: { en: "Offer", vi: "Ưu đãi", es: "Oferta", zh: "优惠", ko: "혜택", th: "ข้อเสนอ" },
    loyalty: { en: "Loyalty", vi: "Thành viên thân thiết", es: "Lealtad", zh: "会员优惠", ko: "멤버십", th: "สมาชิก" },
    verifiedByBog: { en: "Verified by BoG", vi: "Đã xác nhận bởi BoG", es: "Verificado por BoG", zh: "BoG 已认证", ko: "BoG 인증", th: "ยืนยันโดย BoG" },
    hours: { en: "Hours", vi: "Giờ mở cửa", es: "Horario", zh: "营业时间", ko: "영업시간", th: "เวลาเปิด" },
    walkIns: { en: "Walk-ins", vi: "Walk-in / Không hẹn", es: "Sin cita", zh: "可现场排队", ko: "예약 없이 방문", th: "Walk-in" },
    language: { en: "Language", vi: "Ngôn ngữ", es: "Idioma", zh: "语言", ko: "언어", th: "ภาษา" },
    backToDirectory: { en: "Back to directory", vi: "Về danh bạ", es: "Volver al directorio", zh: "返回目录", ko: "목록으로", th: "กลับไปที่ไดเรกทอรี" },
    demoTemplate: { en: "DEMO / TEMPLATE", vi: "DEMO / MẪU", es: "DEMO / PLANTILLA", zh: "演示 / 模板", ko: "데모 / 템플릿", th: "DEMO / แม่แบบ" },
    story: { en: "Story", vi: "Câu chuyện", es: "Historia", zh: "简介", ko: "소개", th: "เรื่องราว" },
    services: { en: "Services", vi: "Dịch vụ", es: "Servicios", zh: "服务", ko: "서비스", th: "บริการ" },
    isThisRight: { en: "Is this right?", vi: "Đúng chưa?", es: "¿Está bien?", zh: "对吗？", ko: "맞나요?", th: "ถูกต้องไหม?" },
    thankYou: { en: "Thank you", vi: "Cảm ơn", es: "Gracias", zh: "谢谢", ko: "감사합니다", th: "ขอบคุณ" },
    freeLocalListing: { en: "Free local listing", vi: "Danh sách địa phương miễn phí", es: "Listado local gratis", zh: "免费本地店铺页", ko: "무료 지역 등록", th: "หน้าร้านท้องถิ่นฟรี" },
    takesAMinute: { en: "Takes a minute", vi: "Chỉ mất một phút", es: "Solo toma un minuto", zh: "只要一分钟", ko: "1분이면 됩니다", th: "ใช้เวลาแค่ครู่" },
    youCanSayNo: { en: "You can say no", vi: "Bạn có thể từ chối", es: "Puede decir que no", zh: "可以拒绝", ko: "거절하셔도 됩니다", th: "ปฏิเสธได้" },
    headline: {
      en: "South Seattle beauty directory",
      vi: "Danh bạ làm đẹp South Seattle",
      es: "Directorio de belleza de South Seattle",
      zh: "南西雅图美容名录",
      ko: "사우스 시애틀 뷰티 디렉터리",
      th: "ไดเรกทอรีความงามเซาท์ซีแอตเทิล",
    },
    tagline: {
      en: "Local salons, barbers, spas & more — find a spot and book.",
      vi: "Salon, tiệm cắt tóc, spa và hơn thế — tìm chỗ và đặt lịch.",
      es: "Salones, barberías, spas y más — encuentra un lugar y reserva.",
      zh: "本地美发、理发、水疗等 — 找一家，马上预约。",
      ko: "동네 살롱, 바버, 스파 등 — 찾고 예약하세요.",
      th: "ร้านเสริมสวย ร้านตัดผม สปา และอื่นๆ — ค้นหาแล้วจองได้เลย",
    },
    searchPlaceholder: {
      en: "Search by name…",
      vi: "Tìm theo tên…",
      es: "Buscar por nombre…",
      zh: "按名称搜索…",
      ko: "이름으로 검색…",
      th: "ค้นหาตามชื่อ…",
    },
    searchLabel: {
      en: "Search by name",
      vi: "Tìm theo tên",
      es: "Buscar por nombre",
      zh: "按名称搜索",
      ko: "이름으로 검색",
      th: "ค้นหาตามชื่อ",
    },
    hair: { en: "Hair", vi: "Tóc", es: "Cabello", zh: "美发", ko: "헤어", th: "ผม" },
    barber: { en: "Barber", vi: "Cắt tóc", es: "Barbería", zh: "理发", ko: "바버", th: "บาร์เบอร์" },
    nails: { en: "Nails", vi: "Nail", es: "Uñas", zh: "美甲", ko: "네일", th: "เล็บ" },
    spa: { en: "Spa", vi: "Spa", es: "Spa", zh: "水疗", ko: "스파", th: "สปา" },
    browsLashes: { en: "Brows/Lashes", vi: "Mày & mi", es: "Cejas/Pestañas", zh: "眉睫", ko: "눈썹/속눈썹", th: "คิ้ว/ขนตา" },
    beauty: { en: "Beauty", vi: "Làm đẹp", es: "Belleza", zh: "美容", ko: "뷰티", th: "ความงาม" },
    categoryFilters: {
      en: "Category filters",
      vi: "Lọc theo danh mục",
      es: "Filtros de categoría",
      zh: "分类筛选",
      ko: "카테고리 필터",
      th: "ตัวกรองหมวดหมู่",
    },
    listingCountOne: {
      en: "{n} listing",
      vi: "{n} cửa hàng",
      es: "{n} local",
      zh: "{n} 家店",
      ko: "업체 {n}곳",
      th: "{n} ร้าน",
    },
    listingCount: {
      en: "{n} listings",
      vi: "{n} cửa hàng",
      es: "{n} locales",
      zh: "{n} 家店",
      ko: "업체 {n}곳",
      th: "{n} ร้าน",
    },
    listingCountFiltered: {
      en: "{n} of {total} listings",
      vi: "{n} / {total} cửa hàng",
      es: "{n} de {total} locales",
      zh: "{total} 家中的 {n} 家",
      ko: "{total}곳 중 {n}곳",
      th: "{n} จาก {total} ร้าน",
    },
    samplePhoto: {
      en: "Sample photo",
      vi: "Ảnh minh họa",
      es: "Foto de muestra",
      zh: "示例照片",
      ko: "샘플 사진",
      th: "ภาพตัวอย่าง",
    },
    callName: {
      en: "Call {name}",
      vi: "Gọi {name}",
      es: "Llamar a {name}",
      zh: "致电{name}",
      ko: "{name}에 전화",
      th: "โทรหา {name}",
    },
    textName: {
      en: "Text {name}",
      vi: "Nhắn tin cho {name}",
      es: "Enviar mensaje a {name}",
      zh: "给{name}发短信",
      ko: "{name}에 문자",
      th: "ส่งข้อความถึง {name}",
    },
    directionsTo: {
      en: "Directions to {name}",
      vi: "Chỉ đường đến {name}",
      es: "Cómo llegar a {name}",
      zh: "前往{name}的路线",
      ko: "{name} 길찾기",
      th: "เส้นทางไป {name}",
    },
    emptyResults: {
      en: "No listings match. Try another category or clear search.",
      vi: "Không có cửa hàng nào khớp. Thử danh mục khác hoặc xóa tìm kiếm.",
      es: "Ningún local coincide. Prueba otra categoría o borra la búsqueda.",
      zh: "没有匹配的店铺。试试其他分类，或清除搜索。",
      ko: "맞는 업체가 없습니다. 다른 분류를 보거나 검색을 지우세요.",
      th: "ไม่พบร้านที่ตรงกัน ลองหมวดอื่นหรือล้างการค้นหา",
    },
    footerLine: {
      en: "Blades of Grass · South Seattle",
      vi: "Blades of Grass · Nam Seattle",
      es: "Blades of Grass · Sur de Seattle",
      zh: "Blades of Grass · 南西雅图",
      ko: "Blades of Grass · 사우스 시애틀",
      th: "Blades of Grass · เซาท์ซีแอตเทิล",
    },
  };

  var POINT_CARDS = [
    { en: "language", vi: "Ngôn ngữ", es: "Idioma" },
    { en: "Name / what we do", vi: "Tên / chúng tôi làm gì", es: "Nombre / qué hacemos" },
    { en: "Where / phone", vi: "Địa chỉ / điện thoại", es: "Dirección / teléfono" },
    { en: "Hours", vi: "Giờ mở cửa", es: "Horario" },
    { en: "Walk-ins / text us", vi: "Walk-in / nhắn tin", es: "Sin cita / escríbenos" },
    { en: "Website · Instagram · booking", vi: "Website · Instagram · đặt lịch", es: "Sitio · Instagram · reservar" },
    { en: "Who should find us", vi: "Ai nên tìm chúng tôi", es: "Quiénes deberían encontrarnos" },
    { en: "Google reviews button", vi: "Nút đánh giá Google", es: "Botón de reseñas de Google" },
  ];

  function t(key, locale) {
    var entry = PHRASES[key];
    if (!entry) return "";
    var loc = locale && LOCALES.indexOf(locale) !== -1 ? locale : "en";
    if (entry[loc]) return entry[loc];
    return entry.en || "";
  }

  var api = {
    LOCALES: LOCALES,
    PHRASES: PHRASES,
    POINT_CARDS: POINT_CARDS,
    t: t,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.BogPhrases = api;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
