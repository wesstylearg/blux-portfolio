/**
 * Vista: Inicio.
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e, LABELS } = U;

  function uniqueSorted(list) { return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b, 'es')); }

  async function render() {
    const [all, featured] = await Promise.all([IEJ.repo.list(), IEJ.repo.featured(6)]);
    const hero = IEJ.data.heroImage;
    const about = IEJ.data.aboutImage;
    const types = uniqueSorted(all.map(p => p.type));
    const hoods = uniqueSorted(all.map(p => p.location.neighborhood));
    const countSale = all.filter(p => p.operation === 'venta').length;
    const countRent = all.length - countSale;

    return (
      /* ---------- Hero ---------- */
      '<section class="hero">' +
        '<div class="hero-media">' +
          '<img src="' + U.img(hero.src, 1800) + '" srcset="' + U.srcset(hero.src, [800, 1200, 1800, 2400]) + '" sizes="100vw" alt="' + e(hero.alt) + '" fetchpriority="high" decoding="async" width="1800" height="1200">' +
        '</div>' +
        '<div class="container hero-content">' +
          '<p class="eyebrow eyebrow-light">Propiedades en Bahía Blanca</p>' +
          '<h1 class="hero-title" tabindex="-1" data-focus>Encontrá el lugar donde empieza tu próxima historia.</h1>' +
          '<p class="hero-text">Casas, departamentos y dúplex seleccionados, con información clara y un equipo que te acompaña desde la primera consulta.</p>' +
          '<div class="hero-actions">' +
            '<a class="btn btn-light" href="#/propiedades?op=venta">Ver propiedades en venta</a>' +
            '<a class="btn btn-outline-light" href="#/propiedades?op=alquiler">Ver alquileres</a>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Buscador ---------- */
      '<section class="container search-wrap" aria-labelledby="searchTitle">' +
        '<form class="search-card" id="heroSearch" role="search">' +
          '<h2 class="sr-only" id="searchTitle">Buscar propiedades</h2>' +
          '<fieldset class="segmented" aria-label="Operación">' +
            '<legend class="sr-only">Operación</legend>' +
            '<label><input type="radio" name="op" value="" checked><span>Todas</span></label>' +
            '<label><input type="radio" name="op" value="venta"><span>Venta</span></label>' +
            '<label><input type="radio" name="op" value="alquiler"><span>Alquiler</span></label>' +
          '</fieldset>' +
          '<div class="search-fields">' +
            '<div class="search-field">' +
              '<label for="hsType">Tipo de propiedad</label>' +
              '<select id="hsType" name="type"><option value="">Todos los tipos</option>' +
                types.map(t => '<option value="' + t + '">' + e(LABELS.type[t]) + '</option>').join('') +
              '</select>' +
            '</div>' +
            '<div class="search-field">' +
              '<label for="hsHood">Barrio</label>' +
              '<select id="hsHood" name="barrio"><option value="">Todos los barrios</option>' +
                hoods.map(h => '<option value="' + e(h) + '">' + e(h) + '</option>').join('') +
              '</select>' +
            '</div>' +
            '<button class="btn btn-primary search-submit" type="submit">' + icons.search + '<span>Buscar</span></button>' +
          '</div>' +
        '</form>' +
      '</section>' +

      /* ---------- Destacadas ---------- */
      '<section class="section" aria-labelledby="featTitle">' +
        '<div class="container">' +
          '<div class="section-head">' +
            '<div>' +
              '<p class="eyebrow">Selección</p>' +
              '<h2 class="section-title" id="featTitle">Propiedades destacadas</h2>' +
            '</div>' +
            '<a class="link-arrow" href="#/propiedades">Ver las ' + all.length + ' propiedades ' + icons.arrowRight + '</a>' +
          '</div>' +
          '<div class="grid-cards">' + featured.map(p => IEJ.ui.propertyCard(p)).join('') + '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Presentación ---------- */
      '<section class="section section-alt" aria-labelledby="aboutTitle">' +
        '<div class="container about">' +
          '<div class="about-media reveal">' +
            '<img src="' + U.img(about.src, 1200) + '" srcset="' + U.srcset(about.src, [600, 900, 1200, 1600]) + '" sizes="(min-width: 960px) 50vw, 100vw" alt="' + e(about.alt) + '" loading="lazy" decoding="async" width="1200" height="900">' +
          '</div>' +
          '<div class="about-copy reveal">' +
            '<p class="eyebrow">Sobre nosotros</p>' +
            '<h2 class="section-title" id="aboutTitle">Una forma más simple y transparente de encontrar tu lugar.</h2>' +
            '<p>En Inmobiliaria de ejemplo creemos que elegir una propiedad es una decisión importante. Por eso publicamos cada inmueble con fotos reales del espacio, superficies, servicios y comodidades detalladas, para que puedas comparar con tranquilidad antes de visitar.</p>' +
            '<p>Trabajamos en Bahía Blanca con propiedades en venta y alquiler, y respondemos cada consulta de manera personalizada.</p>' +
            '<dl class="stats">' +
              '<div><dt>En venta</dt><dd>' + countSale + '</dd></div>' +
              '<div><dt>En alquiler</dt><dd>' + countRent + '</dd></div>' +
              '<div><dt>Barrios</dt><dd>' + hoods.length + '</dd></div>' +
            '</dl>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* ---------- Confianza ---------- */
      '<section class="section" aria-labelledby="trustTitle">' +
        '<div class="container">' +
          '<div class="section-head section-head-center">' +
            '<p class="eyebrow">Cómo trabajamos</p>' +
            '<h2 class="section-title" id="trustTitle">Todo lo que necesitás para decidir con confianza.</h2>' +
          '</div>' +
          '<ul class="benefits">' +
            benefit('eye', 'Fichas completas', 'Superficies, ambientes, servicios y comodidades de cada propiedad, reunidos en un solo lugar.') +
            benefit('chat', 'Respuesta directa', 'Consultá por WhatsApp con el código de la propiedad y hablá directamente con un asesor.') +
            benefit('calendar', 'Visitas coordinadas', 'Elegí el día y el horario que mejor te queden para conocer la propiedad.') +
            benefit('key', 'Acompañamiento', 'Te orientamos en cada etapa, desde la primera consulta hasta la firma.') +
          '</ul>' +
        '</div>' +
      '</section>' +

      /* ---------- CTA ---------- */
      '<section class="section section-tight">' +
        '<div class="container">' +
          '<div class="cta reveal">' +
            '<div>' +
              '<h2>¿Viste una propiedad que te interesa?</h2>' +
              '<p>Escribinos y te enviamos más información o coordinamos una visita.</p>' +
            '</div>' +
            '<div class="cta-actions">' +
              '<a class="btn btn-light" href="#/contacto">Hacer una consulta</a>' +
              '<a class="btn btn-whatsapp" href="' + e(U.whatsappUrl(U.generalWhatsappMessage())) + '" target="_blank" rel="noopener">' + icons.whatsapp + '<span>WhatsApp</span></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function benefit(icon, title, text) {
    return '<li class="benefit reveal"><span class="benefit-icon">' + icons[icon] + '</span><h3>' + e(title) + '</h3><p>' + e(text) + '</p></li>';
  }

  function mount(root) {
    const form = root.querySelector('#heroSearch');
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const data = new FormData(form);
      const q = U.buildQuery({ op: data.get('op'), type: data.get('type'), barrio: data.get('barrio') });
      location.hash = '#/propiedades' + q;
    });
  }

  IEJ.views = IEJ.views || {};
  IEJ.views.home = { title: 'Inmobiliaria de ejemplo · Propiedades en Bahía Blanca', render, mount };
})();
