/**
 * Utilidades compartidas: formato, escape de HTML, íconos, URLs y WhatsApp.
 */
(function () {
  const cfg = IEJ.config;

  const numberFmt = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
  const dateFmt = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

  const LABELS = {
    operation: { venta: 'Venta', alquiler: 'Alquiler' },
    type: { casa: 'Casa', departamento: 'Departamento', duplex: 'Dúplex', ph: 'PH', oficina: 'Oficina' },
    condition: {
      'a-estrenar': 'A estrenar',
      excelente: 'Excelente',
      'muy-bueno': 'Muy bueno',
      'a-refaccionar': 'A refaccionar'
    },
    status: { publicada: 'Publicada', reservada: 'Reservada', borrador: 'Borrador' }
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatNumber(n) { return numberFmt.format(n); }

  function formatPrice(p) {
    if (p.currency === 'USD') return 'USD ' + formatNumber(p.price);
    return '$ ' + formatNumber(p.price);
  }

  function priceSuffix(p) { return p.operation === 'alquiler' ? '/mes' : ''; }

  function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return dateFmt.format(new Date(y, m - 1, d));
  }

  /** Construye una URL de imagen con el ancho deseado. */
  function img(src, width) {
    if (!src) return PLACEHOLDER;
    if (src.indexOf('images.unsplash.com') !== -1) {
      return src + (src.indexOf('?') === -1 ? '?' : '&') + cfg.imageParams + '&w=' + width;
    }
    return src;
  }

  function srcset(src, widths) {
    if (!src || src.indexOf('images.unsplash.com') === -1) return '';
    return widths.map(w => img(src, w) + ' ' + w + 'w').join(', ');
  }

  // Imagen de respaldo (SVG embebido, sin dependencias).
  const PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">' +
    '<rect width="800" height="600" fill="#eef0f3"/>' +
    '<g fill="none" stroke="#a9b0bb" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">' +
    '<path d="M310 360v-80l90-70 90 70v80"/><path d="M375 360v-50h50v50"/></g>' +
    '<text x="400" y="420" text-anchor="middle" font-family="-apple-system,Segoe UI,Roboto,sans-serif" font-size="22" fill="#8a919c">Imagen no disponible</text>' +
    '</svg>'
  );

  /** Enlace de WhatsApp con texto codificado correctamente. */
  function whatsappUrl(message) {
    const base = 'https://wa.me/' + cfg.whatsapp.number;
    return message ? base + '?text=' + encodeURIComponent(message) : base;
  }

  function propertyUrl(p) { return '#/propiedad/' + encodeURIComponent(p.id); }

  function absoluteUrl(hash) {
    return location.href.split('#')[0] + hash;
  }

  function propertyWhatsappMessage(p) {
    return 'Hola, me interesa recibir información sobre la propiedad ' + p.id + ' – ' + p.title +
      ' (' + LABELS.operation[p.operation] + ', ' + formatPrice(p) + priceSuffix(p) + '). ' +
      'Link: ' + absoluteUrl(propertyUrl(p)) + '. ¡Gracias!';
  }

  function generalWhatsappMessage() {
    return 'Hola, me comunico desde el sitio web de ' + cfg.brand + '. Quisiera recibir información sobre propiedades disponibles.';
  }

  /** Parseo / serialización de query strings dentro del hash. */
  function parseQuery(qs) {
    const out = {};
    new URLSearchParams(qs || '').forEach((v, k) => { out[k] = v; });
    return out;
  }

  function buildQuery(obj) {
    const params = new URLSearchParams();
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      if (v !== '' && v != null && v !== false) params.set(k, v);
    });
    const s = params.toString();
    return s ? '?' + s : '';
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function plural(n, one, many) { return n === 1 ? one : many; }

  /* ---------- Íconos (SVG lineales, tamaño consistente) ---------- */
  const s = (d, extra) => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"' + (extra || '') + '>' + d + '</svg>';
  const stroke = ' fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';

  const icons = {
    heart: s('<path d="M12 20.5s-7.5-4.6-9.3-9.3C1.6 8.2 3.6 4.5 7.2 4.5c2 0 3.4 1.1 4.8 2.9 1.4-1.8 2.8-2.9 4.8-2.9 3.6 0 5.6 3.7 4.5 6.7-1.8 4.7-9.3 9.3-9.3 9.3z"/>', stroke),
    share: s('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>', stroke),
    pin: s('<path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 12 3.5 6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>', stroke),
    rooms: s('<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 12h9M12.5 3.5v6M12.5 14.5v6"/>', stroke),
    bed: s('<path d="M3 18v-7.5A1.5 1.5 0 0 1 4.5 9H19.5A1.5 1.5 0 0 1 21 10.5V18M3 14.5h18M3 18v1.5M21 18v1.5"/><path d="M6.5 9V6.5h4.5V9"/>', stroke),
    bath: s('<path d="M4 12h16v2.5a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 14.5V12z"/><path d="M6 12V5.5A2 2 0 0 1 8 3.5h.5a2 2 0 0 1 2 2M7 19l-1 2M17 19l1 2"/>', stroke),
    area: s('<path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6M15 4h5v5M9 20H4v-5"/>', stroke),
    car: s('<path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5"/><path d="M3.5 12h17v4.5h-17z"/><path d="M6 16.5V19M18 16.5V19"/><circle cx="7.5" cy="14.3" r=".6"/><circle cx="16.5" cy="14.3" r=".6"/>', stroke),
    calendar: s('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', stroke),
    check: s('<path d="M5 12.5l4.5 4.5L19 7.5"/>', stroke),
    close: s('<path d="M6 6l12 12M18 6 6 18"/>', stroke),
    chevronLeft: s('<path d="M15 5l-7 7 7 7"/>', stroke),
    chevronRight: s('<path d="M9 5l7 7-7 7"/>', stroke),
    arrowLeft: s('<path d="M19 12H5M11 6l-6 6 6 6"/>', stroke),
    arrowRight: s('<path d="M5 12h14M13 6l6 6-6 6"/>', stroke),
    filter: s('<path d="M4 6h16M7 12h10M10 18h4"/>', stroke),
    search: s('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>', stroke),
    mail: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/>', stroke),
    clock: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', stroke),
    shield: s('<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6L12 3z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.4"/>', stroke),
    eye: s('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>', stroke),
    chat: s('<path d="M20 12a7.5 7.5 0 0 1-11 6.6L4 20l1.4-4.5A7.5 7.5 0 1 1 20 12z"/>', stroke),
    key: s('<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/>', stroke),
    sparkle: s('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>', stroke),
    image: s('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8 8.5"/>', stroke),
    whatsapp: s('<path fill="currentColor" d="M12.04 2C6.6 2 2.17 6.42 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2.1 22l5.32-1.39a9.86 9.86 0 0 0 4.62 1.17h.01c5.44 0 9.87-4.43 9.87-9.88A9.87 9.87 0 0 0 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.16.83.84-3.08-.2-.32a8.19 8.19 0 0 1-1.25-4.33c0-4.53 3.69-8.22 8.23-8.22a8.22 8.22 0 0 1 8.22 8.23c0 4.53-3.69 8.22-8.2 8.22zm4.5-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.88 2.4 1.01 2.57c.12.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.29z"/>')
  };

  /** Reemplaza los <span data-icon="..."> estáticos del HTML. */
  function hydrateIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      if (icons[name]) { el.outerHTML = icons[name]; }
    });
  }

  IEJ.utils = {
    LABELS, escapeHtml, formatNumber, formatPrice, priceSuffix, formatDate, img, srcset, PLACEHOLDER,
    whatsappUrl, propertyUrl, absoluteUrl, propertyWhatsappMessage, generalWhatsappMessage,
    parseQuery, buildQuery, debounce, plural, icons, hydrateIcons
  };
})();
