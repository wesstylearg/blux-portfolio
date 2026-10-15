/**
 * Vista: Contacto (#/contacto?tipo=visita&prop=IEJ-1001).
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e } = U;
  const cfg = IEJ.config;

  let properties = [];

  async function render(ctx) {
    properties = await IEJ.repo.list();
    const preset = { type: ctx.query.tipo || '', prop: (ctx.query.prop || '').toUpperCase() };
    if (preset.prop && !preset.type) {
      const p = properties.find(x => x.id === preset.prop);
      if (p) preset.type = p.operation === 'venta' ? 'comprar' : 'alquilar';
    }

    return (
      '<section class="page-head">' +
        '<div class="container">' +
          '<p class="eyebrow">Contacto</p>' +
          '<h1 class="page-title" tabindex="-1" data-focus>Hablemos de tu próxima propiedad.</h1>' +
          '<p class="page-lead">Contanos qué estás buscando y te respondemos con opciones a tu medida.</p>' +
        '</div>' +
      '</section>' +
      '<section class="container section section-flush">' +
        '<div class="contact">' +
          '<div class="contact-info">' +
            '<ul class="contact-list">' +
              '<li><span class="contact-icon">' + icons.whatsapp + '</span><div><p class="contact-label">WhatsApp</p>' +
                '<a href="' + e(U.whatsappUrl(U.generalWhatsappMessage())) + '" target="_blank" rel="noopener">' + e(cfg.whatsapp.display) + '</a>' +
                '<p class="muted small">Número de ejemplo para la demo</p></div></li>' +
              '<li><span class="contact-icon">' + icons.mail + '</span><div><p class="contact-label">Correo</p>' +
                '<a href="mailto:' + e(cfg.contact.email) + '">' + e(cfg.contact.email) + '</a>' +
                '<p class="muted small">Dirección de ejemplo</p></div></li>' +
              '<li><span class="contact-icon">' + icons.pin + '</span><div><p class="contact-label">Oficina</p><p>' + e(cfg.contact.address) + '</p></div></li>' +
              '<li><span class="contact-icon">' + icons.clock + '</span><div><p class="contact-label">Horarios</p><p>' + e(cfg.contact.hours) + '</p></div></li>' +
            '</ul>' +
            '<div class="contact-note">' +
              '<h2>¿Preferís escribirnos directo?</h2>' +
              '<p>Si ya viste una propiedad, usá el botón de WhatsApp de su ficha: el mensaje incluye el código para que podamos ayudarte más rápido.</p>' +
              '<a class="btn btn-whatsapp" href="' + e(U.whatsappUrl(U.generalWhatsappMessage())) + '" target="_blank" rel="noopener">' + icons.whatsapp + '<span>Abrir WhatsApp</span></a>' +
            '</div>' +
          '</div>' +
          '<div class="contact-form-card">' +
            '<h2>Envianos tu consulta</h2>' +
            IEJ.forms.render({ id: 'contactForm', variant: 'general', properties, preset }) +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function mount(root) {
    IEJ.forms.bind(root, { properties });
  }

  IEJ.views = IEJ.views || {};
  IEJ.views.contact = { title: 'Contacto · Inmobiliaria de ejemplo', render, mount };
})();
