/**
 * Formularios de consulta: render, validación y preparación del mensaje
 * para WhatsApp. No hay backend: nunca se simula un envío por correo.
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e } = U;

  const INQUIRY_TYPES = {
    general: [
      { value: 'comprar', label: 'Quiero comprar' },
      { value: 'alquilar', label: 'Quiero alquilar' },
      { value: 'visita', label: 'Coordinar una visita' },
      { value: 'tasacion', label: 'Vender o alquilar mi propiedad' },
      { value: 'otra', label: 'Otra consulta' }
    ],
    property: [
      { value: 'informacion', label: 'Solicitar más información' },
      { value: 'visita', label: 'Coordinar una visita' }
    ]
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^\+?[\d\s()-]{8,20}$/;

  function field(id, label, control, opts) {
    opts = opts || {};
    return '<div class="field' + (opts.full ? ' field-full' : '') + '">' +
      '<label for="' + id + '">' + e(label) + (opts.optional ? ' <span class="optional">(opcional)</span>' : '') + '</label>' +
      control +
      (opts.hint ? '<p class="field-hint" id="' + id + '-hint">' + e(opts.hint) + '</p>' : '') +
      '<p class="field-error" id="' + id + '-error" hidden></p>' +
    '</div>';
  }

  /**
   * opts: { id, variant: 'general' | 'property', property, properties, preset: { type, prop } }
   */
  function render(opts) {
    const id = opts.id;
    const types = INQUIRY_TYPES[opts.variant];
    const preset = opts.preset || {};
    const p = opts.property;

    const typeSelect = '<select id="' + id + '-type" name="type" required>' +
      types.map(t => '<option value="' + t.value + '"' + (preset.type === t.value ? ' selected' : '') + '>' + e(t.label) + '</option>').join('') +
      '</select>';

    let propertyField = '';
    if (opts.variant === 'general') {
      const options = ['<option value="">Ninguna en particular</option>']
        .concat((opts.properties || []).map(x =>
          '<option value="' + e(x.id) + '"' + (preset.prop === x.id ? ' selected' : '') + '>' + e(x.id + ' · ' + x.title) + '</option>'));
      propertyField = field(id + '-prop', 'Propiedad de interés', '<select id="' + id + '-prop" name="prop">' + options.join('') + '</select>', { optional: true, full: true });
    }

    const defaultMsg = p ? 'Hola, me interesa la propiedad ' + p.id + ' (' + p.title + '). Quisiera recibir más información.' : '';

    return (
      '<div class="inquiry" data-inquiry>' +
        '<form class="form" id="' + id + '" novalidate>' +
          '<div class="form-summary" role="alert" hidden></div>' +
          '<div class="form-grid">' +
            field(id + '-name', 'Nombre y apellido', '<input id="' + id + '-name" name="name" type="text" autocomplete="name" required>', { full: opts.variant === 'property' }) +
            field(id + '-email', 'Correo electrónico', '<input id="' + id + '-email" name="email" type="email" autocomplete="email" inputmode="email" required>', { full: opts.variant === 'property' }) +
            field(id + '-phone', 'Teléfono', '<input id="' + id + '-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Ej.: 291 400-0000">', { optional: true, full: opts.variant === 'property' }) +
            field(id + '-type', 'Tipo de consulta', typeSelect, { full: opts.variant === 'property' }) +
            propertyField +
            field(id + '-message', 'Mensaje', '<textarea id="' + id + '-message" name="message" rows="' + (opts.variant === 'property' ? 4 : 5) + '" required>' + e(defaultMsg) + '</textarea>', { full: true }) +
          '</div>' +
          '<button type="submit" class="btn btn-primary btn-block">Preparar consulta</button>' +
          '<p class="form-note">' + icons.shield + '<span>Demo sin servidor: al continuar, prepararemos tu consulta para que la envíes por WhatsApp. No se envía ningún correo.</span></p>' +
        '</form>' +
        '<div class="inquiry-result" hidden tabindex="-1"></div>' +
      '</div>'
    );
  }

  function validate(form) {
    const errors = [];
    const get = n => form.elements[n];
    const name = get('name').value.trim();
    const email = get('email').value.trim();
    const phone = get('phone').value.trim();
    const message = get('message').value.trim();

    if (!name) errors.push({ el: get('name'), msg: 'Ingresá tu nombre.' });
    else if (name.length < 2) errors.push({ el: get('name'), msg: 'El nombre debe tener al menos 2 caracteres.' });

    if (!email) errors.push({ el: get('email'), msg: 'Ingresá tu correo electrónico.' });
    else if (!EMAIL_RE.test(email)) errors.push({ el: get('email'), msg: 'Revisá el formato del correo (ej.: nombre@dominio.com).' });

    if (phone && (!PHONE_RE.test(phone) || phone.replace(/\D/g, '').length < 8)) {
      errors.push({ el: get('phone'), msg: 'Ingresá un teléfono válido (solo números, espacios o guiones; mínimo 8 dígitos).' });
    }

    if (!message) errors.push({ el: get('message'), msg: 'Escribí tu mensaje.' });
    else if (message.length < 10) errors.push({ el: get('message'), msg: 'El mensaje debe tener al menos 10 caracteres.' });

    return errors;
  }

  function showErrors(form, errors) {
    form.querySelectorAll('.field-error').forEach(p => { p.hidden = true; p.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(el => {
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
    errors.forEach(err => {
      const p = document.getElementById(err.el.id + '-error');
      p.textContent = err.msg;
      p.hidden = false;
      err.el.setAttribute('aria-invalid', 'true');
      err.el.setAttribute('aria-describedby', p.id);
    });
    const summary = form.querySelector('.form-summary');
    if (errors.length) {
      summary.textContent = errors.length === 1 ? 'Revisá el campo marcado para continuar.' : 'Revisá los ' + errors.length + ' campos marcados para continuar.';
      summary.hidden = false;
    } else {
      summary.hidden = true;
    }
  }

  function buildMessage(form, opts) {
    const v = n => (form.elements[n] ? form.elements[n].value.trim() : '');
    const typeEl = form.elements.type;
    const typeLabel = typeEl.options[typeEl.selectedIndex].text;
    let prop = opts.property || null;
    if (!prop && v('prop')) prop = (opts.properties || []).find(x => x.id === v('prop')) || null;

    const lines = [
      'Hola, soy ' + v('name') + '.',
      'Consulta: ' + typeLabel + '.'
    ];
    if (prop) lines.push('Propiedad: ' + prop.id + ' – ' + prop.title + ' (' + U.absoluteUrl(U.propertyUrl(prop)) + ')');
    lines.push('', v('message'), '');
    lines.push('Email: ' + v('email'));
    if (v('phone')) lines.push('Teléfono: ' + v('phone'));
    return lines.join('\n');
  }

  function bind(root, opts) {
    const wrap = root.querySelector('[data-inquiry]');
    if (!wrap) return;
    const form = wrap.querySelector('form');
    const result = wrap.querySelector('.inquiry-result');
    let submitted = false;

    form.addEventListener('submit', ev => {
      ev.preventDefault();
      submitted = true;
      const errors = validate(form);
      showErrors(form, errors);
      if (errors.length) { errors[0].el.focus(); return; }

      const message = buildMessage(form, opts);
      result.innerHTML =
        '<div class="result-icon">' + icons.check + '</div>' +
        '<h3>Tu consulta está lista</h3>' +
        '<p>Este sitio es una <strong>demostración sin servidor</strong>: la consulta todavía no fue enviada. Podés enviarla por WhatsApp con el siguiente mensaje ya preparado.</p>' +
        '<pre class="result-preview">' + e(message) + '</pre>' +
        '<div class="result-actions">' +
          '<a class="btn btn-whatsapp btn-block" href="' + e(U.whatsappUrl(message)) + '" target="_blank" rel="noopener">' + icons.whatsapp + '<span>Enviar por WhatsApp</span></a>' +
          '<button type="button" class="btn btn-ghost btn-block" data-edit>Editar consulta</button>' +
        '</div>' +
        '<p class="form-note">El número de WhatsApp configurado es de ejemplo (' + e(IEJ.config.whatsapp.display) + ').</p>';
      form.hidden = true;
      result.hidden = false;
      result.focus();
    });

    // Revalidación en vivo luego del primer intento.
    form.addEventListener('input', () => { if (submitted) showErrors(form, validate(form)); });

    result.addEventListener('click', ev => {
      if (!ev.target.closest('[data-edit]')) return;
      result.hidden = true;
      form.hidden = false;
      form.querySelector('input, select, textarea').focus();
    });
  }

  IEJ.forms = { render, bind, validate, INQUIRY_TYPES };
})();
