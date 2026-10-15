# Inmobiliaria de Ejemplo · Demo Web Premium

Demo web funcional de inmobiliaria premium ficticia desarrollada para **Blux**, inspirada en la calidad visual y minimalista de Apple.

La aplicación está construida con **HTML5, CSS3 y JavaScript moderno puro (Vanilla)**, sin frameworks pesados ni dependencias de terceros, y funciona perfectamente en local sin requerir backend ni claves de API.

---

## 🚀 Cómo ejecutar la demo localmente

Tenés dos formas sencillas de ejecutarla:

### Opción 1: Directo en el navegador (Zero Setup)
Simplemente hacé doble clic sobre el archivo [index.html](file:///c:/Users/Admin/Desktop/Proyectos%20Blux/blux.digital/inmobiliarias/index.html) o arrastralo dentro de cualquier navegador (Chrome, Edge, Safari, Firefox).
Gracias a que se utilizaron scripts clásicos y un router basado en hash (`#/`), todas las vistas y funciones operan aún bajo el protocolo `file://`.

### Opción 2: Con un servidor local ligero
Si disponés de Node.js o Python:
- **Python**: `python -m http.server 3000`
- **Node**: `npx serve .`
- **VS Code**: Con la extensión *Live Server*.

Abrí luego tu navegador en `http://localhost:3000`.

---

## 🏛 Estructura del Proyecto

```text
inmobiliarias/
├── index.html                 # Shell HTML semántico y accesible
├── css/
│   └── styles.css             # Sistema de diseño Apple-like, variables, responsive y animaciones
└── js/
    ├── config.js              # Configuración centralizada (WhatsApp, datos de contacto, claves)
    ├── utils.js               # Helpers, iconos SVG vectoriales, formateadores de moneda y URLs
    ├── repository.js          # Capa de abstracción de datos orientada a Promesas
    ├── store.js               # Persistencia de favoritos en localStorage y sincronización
    ├── components.js          # Componentes reutilizables (tarjeta, galería, toast, modal)
    ├── forms.js               # Manejo de formularios, validación accesible y preparación de WhatsApp
    ├── app.js                 # Router SPA hash (#/), ciclo de vida y navegación
    ├── data/
    │   └── properties.js      # Catálogo de 15 propiedades ficticias en Bahía Blanca
    └── views/
        ├── home.js            # Portada: Hero, buscador integrado, destacadas, confianza
        ├── catalog.js         # Catálogo completo con filtros combinables y drawer móvil
        ├── detail.js          # Ficha técnica: galería interactiva, amenidades y formulario
        ├── favorites.js       # Listado de propiedades guardadas con consulta masiva
        └── contact.js         # Formulario general de contacto e información institucional
```

---

## ✨ Características y Funcionalidades Implementadas

1. **Identidad Visual Premium**:
   - Paleta sobria basada en blancos puros, gris tenue `#f8f9fa` y un acento azul profundo arquitectónico (`#0f2c59`).
   - Tipografía sans-serif legible con jerarquía visual refinada.
   - Microinteracciones suaves y animaciones de aparición progresiva tipo reveal (`prefers-reduced-motion` compatible).
2. **Página de Inicio**:
   - Hero impactante con fotografía arquitectónica verificada.
   - Buscador rápido integrado visualmente con pestañas de Venta / Alquiler.
   - Grilla de propiedades destacadas con badges de estado y cotización clara.
   - Bloque de confianza y propuesta de valor realista.
3. **Catálogo & Filtros Combinables**:
   - 15 propiedades ficticias ubicadas en barrios reales de Bahía Blanca (Palihue, Centro, Bella Vista, etc.).
   - Filtros funcionales por Operación (Venta en USD / Alquiler en ARS), Tipo, Barrio, Rango de Precio, Ambientes, Dormitorios, Baños, Superficie y Extras (cochera, balcón, patio, jardín).
   - Ordenamiento por más recientes y precio ascendente/descendente.
   - Drawer / modal de filtros optimizado para dispositivos móviles.
   - Sincronización bidireccional en tiempo real con la URL mediante query strings.
4. **Ficha Individual de Propiedad**:
   - Galería fotográfica interactiva con miniaturas, botones de avance, teclado y gestos táctiles.
   - Ficha técnica completa de superficies (cubierta y total), servicios y comodidades específicas.
   - Botón nativo de compartir (`navigator.share` con fallback automático al portapapeles).
   - Formulario de contacto directo y enlace a WhatsApp con mensaje personalizado pre-cargado con el código de referencia.
   - Recomendación de propiedades similares.
5. **Sistema de Favoritos**:
   - Guardado inmediato con microinteracción de corazón animado y notificación Toast.
   - Persistencia automática en `localStorage` (se mantiene al recargar o cerrar pestaña).
   - Vista exclusiva de favoritos con opción de vaciado y botón para consultar por todas las propiedades guardadas en un solo mensaje de WhatsApp.
6. **Formularios & Integración WhatsApp**:
   - Validación accesible campo a campo.
   - Claridad total al usuario: sin servidor backend, el formulario prepara el mensaje estructurado para despachar por WhatsApp en lugar de fingir un envío por email.
   - Número de WhatsApp y datos centralizados en [js/config.js](file:///c:/Users/Admin/Desktop/Proyectos%20Blux/blux.digital/inmobiliarias/js/config.js).

---

## 🔌 Pasos para convertir en Solución de Producción (Backend)

La arquitectura modular implementada deja la web 100% preparada para escalar a un producto comercial completo:

1. **Reemplazo de la capa Repository**:
   - En [js/repository.js](file:///c:/Users/Admin/Desktop/Proyectos%20Blux/blux.digital/inmobiliarias/js/repository.js), las funciones ya devuelven `Promise`. Basta con sustituir las lecturas del array local por llamadas `fetch('/api/v1/propiedades')`.
2. **Base de Datos & API**:
   - Crear una base de datos relacional (PostgreSQL/MySQL) o CMS Headless (ej. Strapi, Supabase, Payload) con el mismo esquema tipado definido en [js/data/properties.js](file:///c:/Users/Admin/Desktop/Proyectos%20Blux/blux.digital/inmobiliarias/js/data/properties.js).
3. **Panel Administrativo (Backoffice)**:
   - Panel para que los agentes inmobiliarios carguen, pausen o marquen propiedades como "reservadas", y suban fotografías a un CDN (Cloudinary, AWS S3).
4. **Gestión de Leads**:
   - Conectar los formularios validados a un endpoint que dispare correos automáticos al equipo comercial (vía Resend o SendGrid) e ingrese los datos a un CRM (HubSpot, WhatsApp Business Cloud API).
