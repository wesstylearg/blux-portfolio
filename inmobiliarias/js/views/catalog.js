/**
 * Vista: Catálogo con filtros combinables, orden y estado en la URL.
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e, LABELS } = U;

  // Claves de filtro admitidas en la URL (#/propiedades?op=venta&dorm=2...)
  const DEFAULTS = {
    op: '', type: '', barrio: '', pmin: '', pmax: '', amb: '', dorm: '', banos: '',
    smin: '', smax: '', cochera: '', balcon: '', patio: '', jardin: '', estado: '', orden: 'recientes'
  };

  const FILTER_LABELS = {
    op: v => LABELS.operation[v],
    type: v => LABELS.type[v],
    barrio: v => v,
    pmin: (v, s) => 'Desde ' + (s.op === 'venta' ? 'USD ' : '$ ') + U.formatNumber(v),
    pmax: (v, s) => 'Hasta ' + (s.op === 'venta' ? 'USD ' : '$ ') + U.formatNumber(v),
    amb: v => v + '+ ambientes',
    dorm: v => v + '+ dormitorios',
    banos: v => v + '+ baños',
    smin: v => 'Desde ' + v + ' m²',
    smax: v => 'Hasta ' + v + ' m²',
    cochera: () => 'Con cochera',
    balcon: () => 'Con balcón',
    patio: () => 'Con patio',
    jardin: () => 'Con jardín',
    estado: v => LABELS.condition[v]
  };

  let all = [];
  let state = Object.assign({}, DEFAULTS);
  let root = null;
  let cleanup = [];

  function readState(query) {
    const s = Object.assign({}, DEFAULTS);
    Object.keys(DEFAULTS).forEach(k => { if (query[k] != null) s[k] = query[k]; });
    if (!s.op) { s.pmin = ''; s.pmax = ''; }
    return s;
  }

  function num(v) { const n = Number(v); return v === '' || isNaN(n) ? null : n; }

  /* ---------- Filtrado y orden ---------- */
  function apply(list, s) {
    const pmin = num(s.pmin), pmax = num(s.pmax), smin = num(s.smin), smax = num(s.smax);
    const amb = num(s.amb), dorm = num(s.dorm), banos = num(s.banos);

    const out = list.filter(p =>
      (!s.op || p.operation === s.op) &&
      (!s.type || p.type === s.type) &&
      (!s.barrio || p.location.neighborhood === s.barrio) &&
      (pmin === null || p.price >= pmin) &&
      (pmax === null || p.price <= pmax) &&
      (amb === null || p.rooms >= amb) &&
      (dorm === null || p.bedrooms >= dorm) &&
      (banos === null || p.bathrooms >= banos) &&
      (smin === null || p.coveredArea >= smin) &&
      (smax === null || p.coveredArea <= smax) &&
      (!s.cochera || p.garage > 0) &&
      (!s.balcon || p.features.balcony) &&
      (!s.patio || p.features.patio) &&
      (!s.jardin || p.features.garden) &&
      (!s.estado || p.condition === s.estado)
    );

    // Venta (USD) y alquiler (ARS) no se comparan entre sí: se agrupan por operación.
    const opRank = p => (p.operation === 'venta' ? 0 : 1);
    if (s.orden === 'precio-asc') out.sort((a, b) => opRank(a) - opRank(b) || a.price - b.price);
    else if (s.orden === 'precio-desc') out.sort((a, b) => opRank(a) - opRank(b) || b.price - a.price);
    else out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return out;
  }

  function activeKeys(s) {
    return Object.keys(FILTER_LABELS).filter(k => s[k] !== '' && s[k] != null);
  }

  /* ---------- Render ---------- */
  function uniqueSorted(list) { return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b, 'es')); }

  function options(list, selected, labelFn) {
    return list.map(v => '<option value="' + e(v) + '"' + (String(selected) === String(v) ? ' selected' : '') + '>' + e(labelFn ? labelFn(v) : v) + '</option>').join('');
  }

  function segmented(name, label, values, selected) {
    return '<fieldset class="filter-group">' +
      '<legend>' + e(label) + '</legend>' +
      '<div class="segmented segmented-sm">' +
        values.map(v => '<label><input type="radio" name="' + name + '" value="' + v.value + '"' + (String(selected) === String(v.value) ? ' checked' : '') + '><span>' + e(v.label) + '</span></label>').join('') +
      '</div>' +
    '</fieldset>';
  }

  function check(name, label, checked) {
    return '<label class="check"><input type="checkbox" name="' + name + '" value="1"' + (checked ? ' checked' : '') + '><span class="check-box">' + icons.check + '</span><span>' + e(label) + '</span></label>';
  }

  function filtersForm(s) {
    const types = uniqueSorted(all.map(p => p.type));
    const hoods = uniqueSorted(all.map(p => p.location.neighborhood));
    const conditions = Object.keys(LABELS.condition).filter(c => all.some(p => p.condition === c));
    const currency = s.op === 'venta' ? 'USD' : s.op === 'alquiler' ? 'ARS / mes' : '';
    const priceDisabled = !s.op;
    const minMax = [{ value: '', label: 'Todos' }, { value: 1, label: '1+' }, { value: 2, label: '2+' }, { value: 3, label: '3+' }, { value: 4, label: '4+' }];

    return (
      '<form class="filters-form" id="filtersForm" novalidate>' +
        segmented('op', 'Operación', [{ value: '', label: 'Todas' }, { value: 'venta', label: 'Venta' }, { value: 'alquiler', label: 'Alquiler' }], s.op) +

        '<div class="filter-group">' +
          '<label class="filter-label" for="fType">Tipo de propiedad</label>' +
          '<select id="fType" name="type"><option value="">Todos los tipos</option>' + options(types, s.type, t => LABELS.type[t]) + '</select>' +
        '</div>' +

        '<div class="filter-group">' +
          '<label class="filter-label" for="fHood">Barrio</label>' +
          '<select id="fHood" name="barrio"><option value="">Todos los barrios</option>' + options(hoods, s.barrio) + '</select>' +
        '</div>' +

        '<fieldset class="filter-group">' +
          '<legend>Precio' + (currency ? ' <span class="muted">(' + currency + ')</span>' : '') + '</legend>' +
          '<div class="range">' +
            '<label class="sr-only" for="fPmin">Precio mínimo</label>' +
            '<input id="fPmin" name="pmin" type="number" inputmode="numeric" min="0" step="1000" placeholder="Mínimo" value="' + e(s.pmin) + '"' + (priceDisabled ? ' disabled aria-describedby="priceHint"' : '') + '>' +
            '<span aria-hidden="true">–</span>' +
            '<label class="sr-only" for="fPmax">Precio máximo</label>' +
            '<input id="fPmax" name="pmax" type="number" inputmode="numeric" min="0" step="1000" placeholder="Máximo" value="' + e(s.pmax) + '"' + (priceDisabled ? ' disabled aria-describedby="priceHint"' : '') + '>' +
          '</div>' +
          (priceDisabled ? '<p class="field-hint" id="priceHint">Elegí venta o alquiler para filtrar por precio (las monedas son distintas).</p>' : '') +
        '</fieldset>' +

        '<div class="filter-group">' +
          '<label class="filter-label" for="fAmb">Ambientes</label>' +
          '<select id="fAmb" name="amb"><option value="">Cualquier cantidad</option>' +
            [1, 2, 3, 4, 5].map(n => '<option value="' + n + '"' + (String(s.amb) === String(n) ? ' selected' : '') + '>' + n + ' o más</option>').join('') +
          '</select>' +
        '</div>' +

        segmented('dorm', 'Dormitorios', minMax, s.dorm) +
        segmented('banos', 'Baños', minMax.slice(0, 4), s.banos) +

        '<fieldset class="filter-group">' +
          '<legend>Superficie cubierta <span class="muted">(m²)</span></legend>' +
          '<div class="range">' +
            '<label class="sr-only" for="fSmin">Superficie mínima</label>' +
            '<input id="fSmin" name="smin" type="number" inputmode="numeric" min="0" step="10" placeholder="Mínimo" value="' + e(s.smin) + '">' +
            '<span aria-hidden="true">–</span>' +
            '<label class="sr-only" for="fSmax">Superficie máxima</label>' +
            '<input id="fSmax" name="smax" type="number" inputmode="numeric" min="0" step="10" placeholder="Máximo" value="' + e(s.smax) + '">' +
          '</div>' +
        '</fieldset>' +

        '<fieldset class="filter-group">' +
          '<legend>Características</legend>' +
          '<div class="checks">' +
            check('cochera', 'Cochera', s.cochera) +
            check('balcon', 'Balcón', s.balcon) +
            check('patio', 'Patio', s.patio) +
            check('jardin', 'Jardín', s.jardin) +
          '</div>' +
        '</fieldset>' +

        '<div class="filter-group">' +
          '<label class="filter-label" for="fCond">Estado</label>' +
          '<select id="fCond" name="estado"><option value="">Cualquier estado</option>' + options(conditions, s.estado, c => LABELS.condition[c]) + '</select>' +
        '</div>' +
      '</form>'
    );
  }

  async function render(ctx) {
    all = await IEJ.repo.list();
    state = readState(ctx.query);
    return (
      '<section class="page-head">' +
        '<div class="container">' +
          '<p class="eyebrow">Catálogo</p>' +
          '<h1 class="page-title" tabindex="-1" data-focus>Propiedades</h1>' +
          '<p class="page-lead">Explorá casas, departamentos, dúplex y más en Bahía Blanca. Combiná los filtros para encontrar exactamente lo que buscás.</p>' +
        '</div>' +
      '</section>' +
      '<div class="container catalog">' +
        '<aside class="filters" id="filtersPanel" aria-label="Filtros de búsqueda">' +
          '<div class="filters-head">' +
            '<h2>Filtros</h2>' +
            '<button type="button" class="link-btn" data-clear>Limpiar todo</button>' +
            '<button type="button" class="icon-btn filters-close" data-close-filters aria-label="Cerrar filtros">' + icons.close + '</button>' +
          '</div>' +
          '<div class="filters-body" id="filtersBody">' + filtersForm(state) + '</div>' +
          '<div class="filters-foot">' +
            '<button type="button" class="btn btn-primary btn-block" data-close-filters><span data-count-label>Ver resultados</span></button>' +
          '</div>' +
        '</aside>' +
        '<div class="filters-overlay" data-close-filters hidden></div>' +
        '<section class="results" aria-labelledby="resultsCount">' +
          '<div class="results-bar">' +
            '<p class="results-count" id="resultsCount" aria-live="polite"></p>' +
            '<div class="results-tools">' +
              '<button type="button" class="btn btn-ghost btn-sm filters-toggle" id="filtersToggle" aria-controls="filtersPanel" aria-expanded="false">' + icons.filter + '<span>Filtros</span><span class="pill-count" data-active-count hidden></span></button>' +
              '<label class="sort">' +
                '<span class="sr-only">Ordenar por</span>' +
                '<select id="sortSelect" name="orden" aria-label="Ordenar resultados">' +
                  '<option value="recientes"' + (state.orden === 'recientes' ? ' selected' : '') + '>Más recientes</option>' +
                  '<option value="precio-asc"' + (state.orden === 'precio-asc' ? ' selected' : '') + '>Precio: menor a mayor</option>' +
                  '<option value="precio-desc"' + (state.orden === 'precio-desc' ? ' selected' : '') + '>Precio: mayor a menor</option>' +
                '</select>' +
              '</label>' +
            '</div>' +
          '</div>' +
          '<div class="chips" id="activeChips"></div>' +
          '<div class="grid-cards grid-cards-catalog" id="resultsGrid"></div>' +
          '<p class="disclaimer">' + icons.shield + '<span>Los datos, precios e imágenes son ilustrativos y corresponden a una demo. Venta expresada en dólares estadounidenses; alquiler en pesos argentinos por mes.</span></p>' +
        '</section>' +
      '</div>'
    );
  }

  function renderResults() {
    const list = apply(all, state);
    const grid = root.querySelector('#resultsGrid');
    const count = root.querySelector('#resultsCount');
    const n = list.length;

    count.innerHTML = '<strong>' + n + '</strong> ' + U.plural(n, 'propiedad encontrada', 'propiedades encontradas');
    root.querySelectorAll('[data-count-label]').forEach(el => { el.textContent = n ? 'Ver ' + n + ' ' + U.plural(n, 'propiedad', 'propiedades') : 'Sin resultados'; });

    if (n) {
      grid.innerHTML = list.map(p => IEJ.ui.propertyCard(p, { reveal: false })).join('');
    } else {
      grid.innerHTML = IEJ.ui.emptyState({
        icon: 'search',
        title: 'No encontramos propiedades con esos filtros',
        text: 'Probá ampliar el rango de precio o superficie, o quitar alguna característica.',
        actions: '<div class="empty-actions"><button type="button" class="btn btn-primary" data-clear>Limpiar filtros</button><a class="btn btn-ghost" href="#/contacto">Contanos qué buscás</a></div>'
      });
    }

    // Chips de filtros activos
    const keys = activeKeys(state);
    const chips = root.querySelector('#activeChips');
    chips.innerHTML = keys.length ? keys.map(k =>
      '<button type="button" class="chip" data-remove="' + k + '" aria-label="Quitar filtro: ' + e(FILTER_LABELS[k](state[k], state)) + '">' +
        e(FILTER_LABELS[k](state[k], state)) + icons.close +
      '</button>').join('') + '<button type="button" class="link-btn" data-clear>Limpiar todo</button>' : '';
    chips.hidden = !keys.length;

    const badge = root.querySelector('[data-active-count]');
    badge.textContent = keys.length;
    badge.hidden = !keys.length;
  }

  function persist() {
    const q = U.buildQuery(Object.assign({}, state, { orden: state.orden === 'recientes' ? '' : state.orden }));
    const hash = '#/propiedades' + q;
    if (location.hash !== hash) history.replaceState(null, '', hash);
    IEJ.store.setLastSearch(q);
  }

  function readForm() {
    const form = root.querySelector('#filtersForm');
    const fd = new FormData(form);
    const next = Object.assign({}, DEFAULTS, { orden: state.orden });
    Object.keys(DEFAULTS).forEach(k => { if (fd.has(k)) next[k] = String(fd.get(k)).trim(); });
    ['pmin', 'pmax', 'smin', 'smax'].forEach(k => { if (next[k] !== '' && (isNaN(Number(next[k])) || Number(next[k]) < 0)) next[k] = ''; });
    return next;
  }

  function update(next, rerenderForm) {
    const opChanged = next.op !== state.op;
    if (opChanged) { next.pmin = ''; next.pmax = ''; }
    state = next;
    if (rerenderForm || opChanged) rebuildForm();
    persist();
    renderResults();
  }

  function rebuildForm() {
    const body = root.querySelector('#filtersBody');
    const active = document.activeElement;
    const activeName = active && active.form && active.name;
    const activeValue = active && active.value;
    body.innerHTML = filtersForm(state);
    if (activeName) {
      const el = body.querySelector('[name="' + activeName + '"][value="' + activeValue + '"]') || body.querySelector('[name="' + activeName + '"]');
      if (el) el.focus();
    }
  }

  /* ---------- Panel móvil ---------- */
  function openPanel(open) {
    const panel = root.querySelector('#filtersPanel');
    const overlay = root.querySelector('.filters-overlay');
    const toggle = root.querySelector('#filtersToggle');
    panel.classList.toggle('is-open', open);
    overlay.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) { const first = panel.querySelector('input, select, button'); if (first) first.focus(); }
    else toggle.focus();
  }

  function mount(r) {
    root = r;
    renderResults();
    IEJ.store.setLastSearch(location.hash.split('?')[1] ? '?' + location.hash.split('?')[1] : '');

    const debounced = U.debounce(() => update(readForm()), 250);

    root.addEventListener('change', ev => {
      if (ev.target.id === 'sortSelect') {
        update(Object.assign({}, state, { orden: ev.target.value }));
        return;
      }
      if (ev.target.closest('#filtersForm')) update(readForm());
    });
    root.addEventListener('input', ev => {
      if (ev.target.closest('#filtersForm') && ev.target.type === 'number') debounced();
    });

    root.addEventListener('click', ev => {
      if (ev.target.closest('[data-clear]')) {
        update(Object.assign({}, DEFAULTS, { orden: state.orden }), true);
        IEJ.ui.toast('Filtros restablecidos');
        return;
      }
      const rm = ev.target.closest('[data-remove]');
      if (rm) {
        const key = rm.dataset.remove;
        const next = Object.assign({}, state, { [key]: '' });
        update(next, true);
        const first = root.querySelector('[data-remove]') || root.querySelector('#resultsCount');
        if (first && first.focus) first.focus();
        return;
      }
      if (ev.target.closest('#filtersToggle')) { openPanel(true); return; }
      if (ev.target.closest('[data-close-filters]')) openPanel(false);
    });

    const onKey = ev => {
      if (ev.key === 'Escape' && root.querySelector('#filtersPanel.is-open')) openPanel(false);
    };
    document.addEventListener('keydown', onKey);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => { if (mq.matches && root.querySelector('#filtersPanel.is-open')) openPanel(false); };
    mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq);

    cleanup = [
      () => document.removeEventListener('keydown', onKey),
      () => (mq.removeEventListener ? mq.removeEventListener('change', onMq) : mq.removeListener(onMq)),
      () => document.body.classList.remove('no-scroll')
    ];
  }

  function unmount() { cleanup.forEach(fn => fn()); cleanup = []; root = null; }

  IEJ.views = IEJ.views || {};
  IEJ.views.catalog = { title: 'Propiedades · Inmobiliaria de ejemplo', render, mount, unmount, apply, readState };
})();
