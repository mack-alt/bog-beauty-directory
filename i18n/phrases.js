/**
 * BoG shop chrome phrase pack (EN | VI | ES).
 * Keep in sync with i18n/phrases.json.
 * Missing VI/ES for a key falls back to EN for that key only. Never invent copy.
 */
(function (root) {
  var LOCALES = ["en", "vi", "es"];

  var PHRASES = {
    call: { en: "Call", vi: "Gọi", es: "Llamar" },
    text: { en: "Text", vi: "Nhắn tin", es: "Mensaje" },
    directions: { en: "Directions", vi: "Chỉ đường", es: "Cómo llegar" },
    reviewsOnGoogle: { en: "Reviews on Google", vi: "Đánh giá trên Google", es: "Reseñas en Google" },
    share: { en: "Share", vi: "Chia sẻ", es: "Compartir" },
    book: { en: "Book", vi: "Đặt lịch", es: "Reservar" },
    instagram: { en: "Instagram", vi: "Instagram", es: "Instagram" },
    website: { en: "Website", vi: "Website", es: "Sitio web" },
    offer: { en: "Offer", vi: "Ưu đãi", es: "Oferta" },
    loyalty: { en: "Loyalty", vi: "Thành viên thân thiết", es: "Lealtad" },
    verifiedByBog: { en: "Verified by BoG", vi: "Đã xác nhận bởi BoG", es: "Verificado por BoG" },
    hours: { en: "Hours", vi: "Giờ mở cửa", es: "Horario" },
    walkIns: { en: "Walk-ins", vi: "Walk-in / Không hẹn", es: "Sin cita" },
    language: { en: "Language", vi: "Ngôn ngữ", es: "Idioma" },
    backToDirectory: { en: "Back to directory", vi: "Về danh bạ", es: "Volver al directorio" },
    demoTemplate: { en: "DEMO / TEMPLATE", vi: "DEMO / MẪU", es: "DEMO / PLANTILLA" },
    story: { en: "Story", vi: "Câu chuyện", es: "Historia" },
    services: { en: "Services", vi: "Dịch vụ", es: "Servicios" },
    isThisRight: { en: "Is this right?", vi: "Đúng chưa?", es: "¿Está bien?" },
    thankYou: { en: "Thank you", vi: "Cảm ơn", es: "Gracias" },
    freeLocalListing: { en: "Free local listing", vi: "Danh sách địa phương miễn phí", es: "Listado local gratis" },
    takesAMinute: { en: "Takes a minute", vi: "Chỉ mất một phút", es: "Solo toma un minuto" },
    youCanSayNo: { en: "You can say no", vi: "Bạn có thể từ chối", es: "Puede decir que no" },
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
