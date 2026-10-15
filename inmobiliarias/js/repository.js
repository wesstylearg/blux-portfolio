/**
 * Capa de acceso a datos.
 *
 * Hoy lee el archivo local js/data/properties.js. Las funciones devuelven
 * Promesas para que, en producción, puedan reemplazarse por llamadas a una
 * API (fetch('/api/properties')) sin modificar las vistas.
 */
(function () {
  const VISIBLE_STATUSES = ['publicada', 'reservada'];

  function source() {
    return (IEJ.data && IEJ.data.properties) || [];
  }

  function visible() {
    return source().filter(p => VISIBLE_STATUSES.indexOf(p.status) !== -1);
  }

  IEJ.repo = {
    /** Todas las propiedades visibles al público. */
    list() { return Promise.resolve(visible()); },

    /** Propiedad por ID (ej.: "IEJ-1001"). Devuelve null si no existe. */
    getById(id) {
      const key = String(id || '').toUpperCase();
      return Promise.resolve(visible().find(p => p.id === key) || null);
    },

    featured(limit) {
      return Promise.resolve(visible().filter(p => p.featured).slice(0, limit || 6));
    },

    /** Propiedades similares: misma operación, priorizando mismo tipo o barrio. */
    similar(property, limit) {
      const score = p => (p.type === property.type ? 2 : 0) + (p.location.neighborhood === property.location.neighborhood ? 1 : 0);
      const list = visible()
        .filter(p => p.id !== property.id && p.operation === property.operation)
        .sort((a, b) => score(b) - score(a) || b.publishedAt.localeCompare(a.publishedAt));
      return Promise.resolve(list.slice(0, limit || 3));
    }
  };
})();
