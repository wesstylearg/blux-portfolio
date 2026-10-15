/**
 * Componentes de interfaz reutilizables.
 */
(function () {
  const U = IEJ.utils;
  const { icons, escapeHtml: e, LABELS } = U;

  /* ---------- Tarjeta de propiedad ---------- */
  function specList(p) {
    const items = [
      { icon: 'rooms', label: p.rooms + ' amb.', sr: p.rooms + ' ' + U.plural(p.rooms, 'ambiente', 'ambientes') },
      p.bedrooms > 0 ? { icon: 'bed', label: p.bedrooms + ' dorm.', sr: p.bedrooms + ' ' + U.plural(p.bedrooms, 'dormitorio', 'dormitorios') } : null,
      { icon: 'bath', label: p.bathrooms + ' ' + U.plural(p.bathrooms, 'baño', 'baños'), sr: '' },
      { icon: 'area', label: U.formatNumber(p.coveredArea) + ' m²', sr: U.formatNumber(p.coveredArea) + ' metros cuadrados cubiertos' }
    ].filter(Boolean);
    return '<ul class="card-specs">' + items.map(i =>
      '<li>' + icons[i.icon] + (i.sr ? '<span aria-hidden="true">' + e(i.label) + '</span><span class="sr-only">' + e(i.sr) + '</span>' : '<span>' + e(i.label) + '</span>') + '</li>'
    ).join('') + '</ul>';
  }

  function favButton(p, extraClass) {
    const active = IEJ.store.isFavorite(p.id);
    return '<button type="button" class="fav-btn ' + (extraClass || '') + (active ? ' is-active' : '') + '" data-fav="' + e(p.id) + '" aria-pressed="' + active + '" aria-label="' + (active ? 'Quitar de favoritos: ' : 'Guardar en favoritos: ') + e(p.title) + '">' + icons.heart + '</button>';
  }

  function propertyCard(p, opts) {
    opts = opts || {};
    const cover = p.images[0] || {};
    const reserved = p.status === 'reservada';
    return (
      '<article class="card' + (opts.reveal === false ? '' : ' reveal') + '" data-id="' + e(p.id) + '">' +
        '<div class="card-media">' +
          '<img src="' + U.img(cover.src, 800) + '" srcset="' + U.srcset(cover.src, [480, 800, 1100]) + '" sizes="(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw" alt="' + e(cover.alt || p.title) + '" loading="lazy" decoding="async" width="800" height="600">' +
          '<div class="card-badges">' +
            '<span class="tag tag-' + e(p.operation) + '">' + e(LABELS.operation[p.operation]) + '</span>' +
            (reserved ? '<span class="tag tag-reserved">Reservada</span>' : '') +
          '</div>' +
          favButton(p) +
        '</div>' +
        '<div class="card-body">' +
          '<p class="card-price">' + e(U.formatPrice(p)) + (p.operation === 'alquiler' ? '<span>/mes</span>' : '') + '</p>' +
          '<h3 class="card-title"><a href="' + U.propertyUrl(p) + '" class="stretched">' + e(p.title) + '</a></h3>' +
          '<p class="card-location">' + icons.pin + '<span>' + e(p.location.neighborhood) + ', ' + e(p.location.city) + '</span></p>' +
          specList(p) +
        '</div>' +
      '</article>'
    );
  }

  /* ---------- Favoritos (delegación global) ---------- */
  function syncFavButtons(root) {
    const favs = IEJ.store.getFavorites();
    (root || document).querySelectorAll('[data-fav]').forEach(btn => {
      const id = btn.getAttribute('data-fav');
      const active = favs.indexOf(id) !== -1;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
      const label = btn.getAttribute('aria-label') || '';
      const name = label.split(': ').slice(1).join(': ');
      if (name) btn.setAttribute('aria-label', (active ? 'Quitar de favoritos: ' : 'Guardar en favoritos: ') + name);
      const text = btn.querySelector('.fav-text');
      if (text) text.textContent = active ? 'Guardada' : 'Guardar';
    });
  }

  document.addEventListener('click', ev => {
    const btn = ev.target.closest('[data-fav]');
    if (!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    const id = btn.getAttribute('data-fav');
    const added = IEJ.store.toggleFavorite(id);
    btn.classList.remove('pop');
    void btn.offsetWidth; // reinicia la animación
    btn.classList.add('pop');
    toast(added ? 'Guardada en favoritos' : 'Quitada de favoritos', added ? { action: { label: 'Ver favoritos', href: '#/favoritos' } } : null);
  });

  IEJ.store.onFavoritesChange(() => syncFavButtons());

  /* ---------- Toasts ---------- */
  function toast(message, opts) {
    opts = opts || {};
    const region = document.getElementById('toastRegion');
    if (!region) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span>' + e(message) + '</span>' +
      (opts.action ? '<a href="' + e(opts.action.href) + '">' + e(opts.action.label) + '</a>' : '');
    region.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-visible'));
    setTimeout(() => {
      el.classList.remove('is-visible');
      setTimeout(() => el.remove(), 300);
    }, opts.duration || 3200);
  }

  /* ---------- Compartir ---------- */
  async function share(data) {
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(data.url);
      toast('Enlace copiado al portapapeles');
    } catch (err) {
      window.prompt('Copiá el enlace de la propiedad:', data.url);
    }
  }

  /* ---------- Galería ---------- */
  function gallery(p) {
    const imgs = p.images;
    const slides = imgs.map((im, i) =>
      '<figure class="gallery-slide' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" aria-hidden="' + (i !== 0) + '">' +
        '<img src="' + U.img(im.src, 1600) + '" srcset="' + U.srcset(im.src, [800, 1200, 1600, 2000]) + '" sizes="(min-width: 1024px) 64vw, 100vw" alt="' + e(im.alt) + '" ' + (i === 0 ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async" width="1600" height="1067">' +
      '</figure>'
    ).join('');
    const thumbs = imgs.map((im, i) =>
      '<li><button type="button" class="gallery-thumb' + (i === 0 ? ' is-active' : '') + '" data-goto="' + i + '" aria-label="Ver imagen ' + (i + 1) + ' de ' + imgs.length + ': ' + e(im.alt) + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' +
        '<img src="' + U.img(im.src, 240) + '" alt="" loading="lazy" decoding="async" width="240" height="160">' +
      '</button></li>'
    ).join('');
    return (
      '<section class="gallery" aria-roledescription="carrusel" aria-label="Galería de fotos de ' + e(p.title) + '" tabindex="0">' +
        '<div class="gallery-stage">' + slides +
          (imgs.length > 1 ?
            '<button type="button" class="gallery-nav prev" data-step="-1" aria-label="Imagen anterior">' + icons.chevronLeft + '</button>' +
            '<button type="button" class="gallery-nav next" data-step="1" aria-label="Imagen siguiente">' + icons.chevronRight + '</button>' : '') +
          '<span class="gallery-counter" aria-live="polite"><span data-current>1</span> / ' + imgs.length + '</span>' +
        '</div>' +
        (imgs.length > 1 ? '<ul class="gallery-thumbs">' + thumbs + '</ul>' : '') +
      '</section>'
    );
  }

  function initGallery(root) {
    const el = root.querySelector('.gallery');
    if (!el) return;
    const slides = el.querySelectorAll('.gallery-slide');
    const thumbs = el.querySelectorAll('.gallery-thumb');
    const counter = el.querySelector('[data-current]');
    let index = 0;

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => { s.classList.toggle('is-active', n === index); s.setAttribute('aria-hidden', String(n !== index)); });
      thumbs.forEach((t, n) => {
        t.classList.toggle('is-active', n === index);
        if (n === index) { t.setAttribute('aria-current', 'true'); t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); }
        else t.removeAttribute('aria-current');
      });
      if (counter) counter.textContent = index + 1;
    }

    el.addEventListener('click', ev => {
      const step = ev.target.closest('[data-step]');
      const to = ev.target.closest('[data-goto]');
      if (step) go(index + Number(step.dataset.step));
      if (to) go(Number(to.dataset.goto));
    });
    el.addEventListener('keydown', ev => {
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(index - 1); }
      if (ev.key === 'ArrowRight') { ev.preventDefault(); go(index + 1); }
    });

    // Deslizamiento táctil
    const stage = el.querySelector('.gallery-stage');
    let startX = null, startY = null;
    stage.addEventListener('touchstart', ev => { startX = ev.touches[0].clientX; startY = ev.touches[0].clientY; }, { passive: true });
    stage.addEventListener('touchend', ev => {
      if (startX === null) return;
      const dx = ev.changedTouches[0].clientX - startX;
      const dy = ev.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  /* ---------- Animación de aparición ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer = null;
  function initReveal(root) {
    const items = (root || document).querySelectorAll('.reveal:not(.is-in)');
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach(i => i.classList.add('is-in'));
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add('is-in'); observer.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    }
    items.forEach(i => observer.observe(i));
  }

  /* ---------- Imágenes de respaldo ---------- */
  document.addEventListener('error', ev => {
    const t = ev.target;
    if (t && t.tagName === 'IMG' && !t.dataset.fallback) {
      t.dataset.fallback = '1';
      t.removeAttribute('srcset');
      t.src = U.PLACEHOLDER;
      t.classList.add('img-fallback');
    }
  }, true);

  function emptyState(opts) {
    return '<div class="empty-state">' +
      '<div class="empty-icon">' + icons[opts.icon || 'search'] + '</div>' +
      '<h2>' + e(opts.title) + '</h2>' +
      '<p>' + e(opts.text) + '</p>' +
      (opts.actions || '') +
    '</div>';
  }

  IEJ.ui = { propertyCard, favButton, syncFavButtons, toast, share, gallery, initGallery, initReveal, emptyState };
})();
