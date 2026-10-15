/**
 * Persistencia local: favoritos y última búsqueda (localStorage).
 * Tolera navegadores con almacenamiento bloqueado (modo privado, file://).
 */
(function () {
  const keys = IEJ.config.storageKeys;
  const listeners = new Set();
  let memoryFallback = {};

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return key in memoryFallback ? memoryFallback[key] : fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { memoryFallback[key] = value; }
  }

  function getFavorites() {
    const list = read(keys.favorites, []);
    return Array.isArray(list) ? list.filter(x => typeof x === 'string') : [];
  }

  function notify() {
    const favs = getFavorites();
    listeners.forEach(fn => fn(favs));
  }

  IEJ.store = {
    getFavorites,
    isFavorite(id) { return getFavorites().indexOf(id) !== -1; },

    /** Alterna el favorito y devuelve el nuevo estado (true = guardado). */
    toggleFavorite(id) {
      const favs = getFavorites();
      const i = favs.indexOf(id);
      if (i === -1) favs.unshift(id); else favs.splice(i, 1);
      write(keys.favorites, favs);
      notify();
      return i === -1;
    },

    clearFavorites() { write(keys.favorites, []); notify(); },

    onFavoritesChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    getLastSearch() { return read(keys.lastSearch, ''); },
    setLastSearch(query) { write(keys.lastSearch, query || ''); }
  };

  // Sincroniza favoritos entre pestañas abiertas.
  window.addEventListener('storage', e => { if (e.key === keys.favorites) notify(); });
})();
