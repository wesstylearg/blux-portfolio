/**
 * Configuración central de la demo.
 * Reemplazá estos valores para adaptar el sitio a un cliente real.
 */
window.IEJ = window.IEJ || {};

IEJ.config = {
  brand: 'Inmobiliaria de ejemplo',
  city: 'Bahía Blanca',

  // Número de WhatsApp DE EJEMPLO (no corresponde a ninguna persona real).
  // Formato internacional sin "+", espacios ni guiones. Ej.: 549291XXXXXXX
  whatsapp: {
    number: '5490000000000',
    display: '+54 9 000 000-0000',
    isExample: true
  },

  contact: {
    email: 'contacto@example.com', // dominio reservado para ejemplos
    address: 'Dirección de ejemplo 123, Bahía Blanca',
    hours: 'Lunes a viernes de 9 a 18 h · Sábados de 10 a 13 h'
  },

  storageKeys: {
    favorites: 'iej.favorites.v1',
    lastSearch: 'iej.lastSearch.v1'
  },

  // Parámetros para imágenes servidas desde Unsplash.
  imageParams: 'auto=format&fit=crop&q=75'
};
