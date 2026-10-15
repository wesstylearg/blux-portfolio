/**
 * Vista: Ficha individual de propiedad (#/propiedad/IEJ-1001).
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e, LABELS } = U;

  let current = null;

  function backLink() {
    const last = IEJ.store.getLastSearch();
    return {
      href: '#/propiedades' + (last || ''),
      label: last ? 'Volver a los resultados' : 'Volver al catálogo'
    };
  }

  function fact(icon, value, label) {
    return '<li><span class="fact-icon">' + icons[icon] + '</span><span class="fact-value">' + e(value) + '</span><span class="fact-label">' + e(label) + '</span></li>';
  }

  function row(label, value) {
    return '<div><dt>' + e(label) + '</dt><dd>' + e(value) + '</dd></div>';
  }

  function list(items) {
    return '<ul class="check-list">' + items.map(i => '<li>' + icons.check + '<span>' + e(i) + '</span></li>').join('') + '</ul>';
  }

  function notFound(id) {
    return '<section class="container section">' +
      IEJ.ui.emptyState({
        icon: 'search',
        title: 'No encontramos esta propiedad',
        text: 'La propiedad ' + (id || '') + ' no existe o ya no está publicada.',
        actions: '<div class="empty-actions"><a class="btn btn-primary" href="#/propiedades">Ver propiedades disponibles</a></div>'
      }) +
    '</section>';
  }

  async function render(ctx) {
    const p = await IEJ.repo.getById(ctx.params.id);
    current = p;
    if (!p) {
      IEJ.views.detail.title = 'Propiedad no encontrada · Inmobiliaria de ejemplo';
      return notFound(ctx.params.id);
    }
    IEJ.views.detail.title = p.title + ' · ' + p.id + ' · Inmobiliaria de ejemplo';

    const similar = await IEJ.repo.similar(p, 3);
    const back = backLink();
    const waMsg = U.propertyWhatsappMessage(p);
    const f = p.features;
    const outdoor = [f.balcony && 'Balcón', f.patio && 'Patio', f.garden && 'Jardín', f.pool && 'Pileta'].filter(Boolean);

    const characteristics =
      row('Tipo de propiedad', LABELS.type[p.type]) +
      row('Operación', LABELS.operation[p.operation]) +
      row('Superficie cubierta', U.formatNumber(p.coveredArea) + ' m²') +
      (p.totalArea && p.totalArea !== p.coveredArea ? row('Superficie total', U.formatNumber(p.totalArea) + ' m²') : '') +
      row('Ambientes', p.rooms) +
      (p.bedrooms ? row('Dormitorios', p.bedrooms) : '') +
      row('Baños', p.bathrooms) +
      row('Cochera', p.garage ? p.garage + ' ' + U.plural(p.garage, 'vehículo', 'vehículos') : 'No') +
      row('Espacios exteriores', outdoor.length ? outdoor.join(', ') : 'No posee') +
      row('Estado', LABELS.condition[p.condition]) +
      row('Antigüedad', p.age === 0 ? 'A estrenar' : p.age + ' ' + U.plural(p.age, 'año', 'años')) +
      (p.orientation ? row('Orientación', p.orientation) : '');

    return (
      '<article class="detail">' +
        '<div class="container">' +
          '<nav class="detail-nav" aria-label="Ruta de navegación">' +
            '<a class="link-back" href="' + e(back.href) + '">' + icons.arrowLeft + '<span>' + e(back.label) + '</span></a>' +
            '<ol class="breadcrumb">' +
              '<li><a href="#/">Inicio</a></li>' +
              '<li><a href="#/propiedades">Propiedades</a></li>' +
              '<li aria-current="page">' + e(p.id) + '</li>' +
            '</ol>' +
          '</nav>' +

          '<header class="detail-head">' +
            '<div>' +
              '<div class="detail-tags">' +
                '<span class="tag tag-' + e(p.operation) + '">' + e(LABELS.operation[p.operation]) + '</span>' +
                '<span class="tag tag-neutral">' + e(LABELS.type[p.type]) + '</span>' +
                (p.status === 'reservada' ? '<span class="tag tag-reserved">Reservada</span>' : '') +
              '</div>' +
              '<h1 class="detail-title" tabindex="-1" data-focus>' + e(p.title) + '</h1>' +
              '<p class="detail-location">' + icons.pin + '<span>' + e(p.location.neighborhood) + ', ' + e(p.location.city) + ', ' + e(p.location.province) + '</span></p>' +
            '</div>' +
            '<div class="detail-actions">' +
              '<button type="button" class="btn btn-ghost btn-sm fav-btn-inline' + (IEJ.store.isFavorite(p.id) ? ' is-active' : '') + '" data-fav="' + e(p.id) + '" aria-pressed="' + IEJ.store.isFavorite(p.id) + '" aria-label="' + (IEJ.store.isFavorite(p.id) ? 'Quitar de favoritos: ' : 'Guardar en favoritos: ') + e(p.title) + '">' + icons.heart + '<span class="fav-text">' + (IEJ.store.isFavorite(p.id) ? 'Guardada' : 'Guardar') + '</span></button>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-share>' + icons.share + '<span>Compartir</span></button>' +
            '</div>' +
          '</header>' +

          IEJ.ui.gallery(p) +

          '<div class="detail-layout">' +
            '<div class="detail-main">' +
              '<ul class="facts">' +
                fact('rooms', p.rooms, U.plural(p.rooms, 'Ambiente', 'Ambientes')) +
                (p.bedrooms ? fact('bed', p.bedrooms, U.plural(p.bedrooms, 'Dormitorio', 'Dormitorios')) : '') +
                fact('bath', p.bathrooms, U.plural(p.bathrooms, 'Baño', 'Baños')) +
                fact('area', U.formatNumber(p.coveredArea) + ' m²', 'Cubiertos') +
                (p.totalArea !== p.coveredArea ? fact('area', U.formatNumber(p.totalArea) + ' m²', 'Totales') : '') +
                (p.garage ? fact('car', p.garage, 'Cochera') : '') +
              '</ul>' +

              '<section class="detail-section" aria-labelledby="descTitle">' +
                '<h2 id="descTitle">Descripción</h2>' +
                p.description.map(par => '<p>' + e(par) + '</p>').join('') +
              '</section>' +

              '<section class="detail-section" aria-labelledby="charTitle">' +
                '<h2 id="charTitle">Características</h2>' +
                '<dl class="spec-table">' + characteristics + '</dl>' +
              '</section>' +

              '<div class="detail-cols">' +
                '<section class="detail-section" aria-labelledby="amenTitle">' +
                  '<h2 id="amenTitle">Comodidades</h2>' + list(p.amenities) +
                '</section>' +
                '<section class="detail-section" aria-labelledby="servTitle">' +
                  '<h2 id="servTitle">Servicios</h2>' + list(p.services) +
                '</section>' +
              '</div>' +

              '<section class="detail-section" aria-labelledby="locTitle">' +
                '<h2 id="locTitle">Ubicación</h2>' +
                '<div class="location-card">' +
                  '<span class="location-icon">' + icons.pin + '</span>' +
                  '<div><p class="location-name">' + e(p.location.neighborhood) + ', ' + e(p.location.city) + '</p>' +
                  '<p class="muted">' + e(p.location.reference) + '. La dirección exacta se informa al coordinar la visita.</p></div>' +
                '</div>' +
              '</section>' +
            '</div>' +

            '<aside class="detail-aside">' +
              '<div class="price-card">' +
                '<p class="price-op">' + e(LABELS.operation[p.operation]) + '</p>' +
                '<p class="price-value">' + e(U.formatPrice(p)) + (p.operation === 'alquiler' ? '<span>/mes</span>' : '') + '</p>' +
                (p.expenses ? '<p class="price-extra">+ $ ' + U.formatNumber(p.expenses) + ' de expensas</p>' : '') +
                '<dl class="price-meta">' +
                  '<div><dt>Código</dt><dd>' + e(p.id) + '</dd></div>' +
                  '<div><dt>Publicada</dt><dd>' + e(U.formatDate(p.publishedAt)) + '</dd></div>' +
                '</dl>' +
                '<a class="btn btn-whatsapp btn-block" href="' + e(U.whatsappUrl(waMsg)) + '" target="_blank" rel="noopener">' + icons.whatsapp + '<span>Consultar por WhatsApp</span></a>' +
                '<button type="button" class="btn btn-ghost btn-block" data-scroll="inquiryTitle">' + icons.calendar + '<span>Coordinar una visita</span></button>' +
              '</div>' +
              '<section class="inquiry-card" aria-labelledby="inquiryTitle">' +
                '<h2 id="inquiryTitle" tabindex="-1">Solicitar información</h2>' +
                '<p class="muted">Completá tus datos y preparamos el mensaje con el código ' + e(p.id) + '.</p>' +
                IEJ.forms.render({ id: 'propertyForm', variant: 'property', property: p }) +
              '</section>' +
            '</aside>' +
          '</div>' +
        '</div>' +

        (similar.length ?
          '<section class="section section-alt" aria-labelledby="simTitle">' +
            '<div class="container">' +
              '<div class="section-head"><h2 class="section-title" id="simTitle">Propiedades similares</h2>' +
              '<a class="link-arrow" href="#/propiedades?op=' + e(p.operation) + '">Ver más en ' + e(LABELS.operation[p.operation].toLowerCase()) + ' ' + icons.arrowRight + '</a></div>' +
              '<div class="grid-cards">' + similar.map(s => IEJ.ui.propertyCard(s)).join('') + '</div>' +
            '</div>' +
          '</section>' : '') +
      '</article>'
    );
  }

  function mount(root) {
    if (!current) return;
    const p = current;
    IEJ.ui.initGallery(root);
    IEJ.forms.bind(root, { property: p });

    root.addEventListener('click', ev => {
      if (ev.target.closest('[data-share]')) {
        IEJ.ui.share({
          title: p.title + ' · ' + IEJ.config.brand,
          text: p.title + ' (' + p.id + ') – ' + U.formatPrice(p) + U.priceSuffix(p),
          url: U.absoluteUrl(U.propertyUrl(p))
        });
      }
      const sc = ev.target.closest('[data-scroll]');
      if (sc) {
        ev.preventDefault();
        const target = document.getElementById(sc.dataset.scroll);
        const typeSel = root.querySelector('#propertyForm-type');
        if (typeSel) typeSel.value = 'visita';
        target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  }

  IEJ.views = IEJ.views || {};
  IEJ.views.detail = { title: 'Propiedad · Inmobiliaria de ejemplo', render, mount };
})();
