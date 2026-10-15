/**
 * Arranque de la aplicación: router por hash, encabezado y elementos globales.
 *
 * Rutas:
 *   #/                       Inicio
 *   #/propiedades?filtros    Catálogo
 *   #/propiedad/:id          Ficha
 *   #/favoritos              Favoritos
 *   #/contacto?tipo&prop     Contacto
 */
(function () {
  const U = IEJ.utils;
  const app = document.getElementById('app');
  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');

  const routes = [
    { pattern: /^\/?$/, view: 'home', nav: 'home' },
    { pattern: /^\/propiedades\/?$/, view: 'catalog', nav: 'catalog' },
    { pattern: /^\/propiedad\/([^/]+)\/?$/, view: 'detail', nav: 'catalog', keys: ['id'] },
    { pattern: /^\/favoritos\/?$/, view: 'favorites', nav: 'favorites' },
    { pattern: /^\/contacto\/?$/, view: 'contact', nav: 'contact' }
  ];

  let currentView = null;
  let currentRoute = null;
  let renderToken = 0;
  const scrollMemory = {}; // posición de scroll del catálogo para volver sin perder contexto

  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    return { path, query: U.parseQuery(qs) };
  }

  function match(path) {
    for (const r of routes) {
      const m = path.match(r.pattern);
      if (m) {
        const params = {};
        (r.keys || []).forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
        return { route: r, params };
      }
    }
    return null;
  }

  function notFoundView() {
    return {
      title: 'Página no encontrada · Inmobiliaria de ejemplo',
      render: () => Promise.resolve('<section class="container section">' + IEJ.ui.emptyState({
        icon: 'search', title: 'Página no encontrada', text: 'El enlace que seguiste no existe o fue modificado.',
        actions: '<div class="empty-actions"><a class="btn btn-primary" href="#/">Ir al inicio</a><a class="btn btn-ghost" href="#/propiedades">Ver propiedades</a></div>'
      }) + '</section>')
    };
  }

  async function router() {
    // Ignora anclas internas que no son rutas (ej.: "#app").
    if (location.hash && !location.hash.startsWith('#/')) return;

    const token = ++renderToken;
    const { path, query } = parseHash();
    const found = match(path);
    const view = found ? IEJ.views[found.route.view] : notFoundView();
    const prevRoute = currentRoute;

    if (prevRoute && prevRoute.view === 'catalog') scrollMemory.catalog = window.scrollY;

    if (currentView && currentView.unmount) currentView.unmount();
    closeMenu();

    let html;
    try {
      html = await view.render({ params: found ? found.params : {}, query });
    } catch (err) {
      console.error(err);
      html = '<section class="container section">' + IEJ.ui.emptyState({ icon: 'search', title: 'Algo salió mal', text: 'No pudimos cargar esta sección. Probá recargar la página.' }) + '</section>';
    }
    if (token !== renderToken) return; // llegó otra navegación mientras tanto

    app.innerHTML = html;
    currentView = view;
    currentRoute = found ? found.route : null;
    document.title = view.title;
    setActiveNav(found ? found.route.nav : '');

    if (view.mount) view.mount(app, { params: found ? found.params : {}, query });
    IEJ.ui.syncFavButtons(app);
    IEJ.ui.initReveal(app);

    // Scroll y foco: al volver de una ficha al catálogo se restaura la posición.
    const restoring = currentRoute && currentRoute.view === 'catalog' && prevRoute && prevRoute.view === 'detail' && scrollMemory.catalog != null;
    window.scrollTo(0, restoring ? scrollMemory.catalog : 0);
    if (prevRoute && !restoring) {
      const focusTarget = app.querySelector('[data-focus]') || app;
      focusTarget.focus({ preventScroll: true });
    }
  }

  /* ---------- Encabezado ---------- */
  function setActiveNav(key) {
    document.querySelectorAll('[data-nav]').forEach(a => {
      const active = a.dataset.nav === key;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function openMenu(open) {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('no-scroll-mobile', open);
  }
  function closeMenu() { openMenu(false); }

  menuToggle.addEventListener('click', () => openMenu(!nav.classList.contains('is-open')));
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); }
  });
  nav.addEventListener('click', ev => { if (ev.target.closest('a')) closeMenu(); });
  window.matchMedia('(min-width: 860px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Enlace "Saltar al contenido": no modifica el hash (lo usa el router).
  document.querySelector('.skip-link').addEventListener('click', ev => {
    ev.preventDefault();
    app.focus();
  });

  /* ---------- Contador de favoritos ---------- */
  const favCount = document.getElementById('favCount');
  function updateFavCount(favs) {
    const n = (favs || IEJ.store.getFavorites()).length;
    favCount.textContent = n;
    favCount.hidden = n === 0;
    favCount.parentElement.setAttribute('aria-label', n ? 'Ver favoritos (' + n + ' ' + U.plural(n, 'guardada', 'guardadas') + ')' : 'Ver favoritos');
  }
  IEJ.store.onFavoritesChange(updateFavCount);

  /* ---------- Elementos globales ---------- */
  function initGlobals() {
    U.hydrateIcons(document);
    const wa = U.whatsappUrl(U.generalWhatsappMessage());
    document.getElementById('headerWa').href = wa;
    document.getElementById('waFloat').href = wa;
    document.getElementById('year').textContent = new Date().getFullYear();

    const c = IEJ.config;
    document.getElementById('footerContact').innerHTML =
      '<li><a href="' + U.escapeHtml(wa) + '" target="_blank" rel="noopener">WhatsApp ' + U.escapeHtml(c.whatsapp.display) + '</a></li>' +
      '<li><a href="mailto:' + U.escapeHtml(c.contact.email) + '">' + U.escapeHtml(c.contact.email) + '</a></li>' +
      '<li>' + U.escapeHtml(c.contact.address) + '</li>' +
      '<li>' + U.escapeHtml(c.contact.hours) + '</li>';
    updateFavCount();
  }

  initGlobals();
  window.addEventListener('hashchange', router);
  router();
})();
