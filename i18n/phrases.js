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
