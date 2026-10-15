/**
 * Vista: Favoritos guardados (localStorage).
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e } = U;

  let unsubscribe = null;
  let root = null;

  async function getFavoriteProperties() {
    const ids = IEJ.store.getFavorites();
    const all = await IEJ.repo.list();
    // Mantiene el orden de guardado (más reciente primero) y descarta IDs inexistentes.
    return ids.map(id => all.find(p => p.id === id)).filter(Boolean);
  }

  function waMessage(list) {
    return 'Hola, guardé estas propiedades en el sitio de ' + IEJ.config.brand + ' y me gustaría recibir información:\n' +
      list.map(p => '• ' + p.id + ' – ' + p.title + ' (' + U.formatPrice(p) + U.priceSuffix(p) + ')').join('\n');
  }

  function body(list) {
    if (!list.length) {
      return IEJ.ui.emptyState({
        icon: 'heart',
        title: 'Todavía no guardaste propiedades',
        text: 'Tocá el corazón en cualquier propiedad para guardarla acá. Tus favoritos quedan guardados en este navegador.',
        actions: '<div class="empty-actions"><a class="btn btn-primary" href="#/propiedades">Explorar propiedades</a></div>'
      });
    }
    return (
      '<div class="fav-toolbar">' +
        '<p class="results-count" aria-live="polite"><strong>' + list.length + '</strong> ' + U.plural(list.length, 'propiedad guardada', 'propiedades guardadas') + '</p>' +
        '<div class="fav-toolbar-actions">' +
          '<a class="btn btn-whatsapp btn-sm" href="' + e(U.whatsappUrl(waMessage(list))) + '" target="_blank" rel="noopener">' + icons.whatsapp + '<span>Consultar por todas</span></a>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-clear-favs>Vaciar lista</button>' +
        '</div>' +
      '</div>' +
      '<div class="grid-cards">' + list.map(p => IEJ.ui.propertyCard(p, { reveal: false })).join('') + '</div>'
    );
  }

  async function render() {
    const list = await getFavoriteProperties();
    return (
      '<section class="page-head">' +
        '<div class="container">' +
          '<p class="eyebrow">Tu selección</p>' +
          '<h1 class="page-title" tabindex="-1" data-focus>Favoritos</h1>' +
          '<p class="page-lead">Las propiedades que guardaste para comparar y consultar más tarde.</p>' +
        '</div>' +
      '</section>' +
      '<section class="container section section-flush"><div id="favBody">' + body(list) + '</div></section>'
    );
  }

  async function refresh() {
    if (!root) return;
    const list = await getFavoriteProperties();
    const el = root.querySelector('#favBody');
    if (el) el.innerHTML = body(list);
  }

  function mount(r) {
    root = r;
    unsubscribe = IEJ.store.onFavoritesChange(refresh);
    root.addEventListener('click', ev => {
      if (ev.target.closest('[data-clear-favs]') && window.confirm('¿Querés quitar todas las propiedades de tus favoritos?')) {
        IEJ.store.clearFavorites();
        IEJ.ui.toast('Lista de favoritos vaciada');
        const h = root.querySelector('[data-focus]');
        if (h) h.focus();
      }
    });
  }

  function unmount() { if (unsubscribe) unsubscribe(); unsubscribe = null; root = null; }

  IEJ.views = IEJ.views || {};
  IEJ.views.favorites = { title: 'Favoritos · Inmobiliaria de ejemplo', render, mount, unmount };
})();
