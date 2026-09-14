/**
 * TU NEGOCIO · Catálogo Mayorista Online Demo
 * Vanilla JavaScript ES6+
 * - Manejo de Catálogo y Datos de Productos con FOTOS REALES / FOTO DEL PRODUCTO
 * - Búsqueda en tiempo real, categorías y filtros combinados
 * - Carrito de compras con persistencia LocalStorage
 * - Modales de Detalle de Producto y Checkout para WhatsApp
 * - Generador de pedidos estructurados con formato Markdown para WhatsApp
 */

// ==========================================
// 1. BASE DE DATOS DE PRODUCTOS (16 ÍTEMS REALES MAYORISTAS)
// ==========================================
const PRODUCTS = [
  {
    id: "beb-01",
    name: "Coca-Cola Sabor Original 2.25L",
    brand: "Coca-Cola",
    category: "Bebidas",
    sku: "CC-225-X8",
    price: 18500, // Precio por bulto/pack
    unitPrice: 2312.5,
    packageInfo: "Pack cerrado por 8 botellas descartables",
    stock: 45,
    highlight: true,
    description: "Gaseosa Coca-Cola sabor original clásica en presentación familiar de 2.25 litros. Ideal para rotación rápida en comercios, almacenes y gastronómicos.",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#DC2626"
  },
  {
    id: "beb-02",
    name: "Cerveza Quilmes Clásica 473ml",
    brand: "Quilmes",
    category: "Bebidas",
    sku: "QU-473-X24",
    price: 24800,
    unitPrice: 1033.3,
    packageInfo: "Bandeja de 24 latas termoselladas",
    stock: 28,
    highlight: true,
    description: "Cerveza rubia argentina tradicional en lata de 473ml. Embalaje reforzado para transporte seguro y conservación de frío.",
    imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#0284C7"
  },
  {
    id: "beb-03",
    name: "Agua Mineral Villavicencio con Gas 1.5L",
    brand: "Villavicencio",
    category: "Bebidas",
    sku: "VV-15G-X6",
    price: 6300,
    unitPrice: 1050,
    packageInfo: "Fardo termoformado por 6 unidades",
    stock: 60,
    highlight: false,
    description: "Agua de manantial de montaña con gas natural. Presentación de 1.5L de alto consumo para kioscos y autoservicios.",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#06B6D4"
  },
  {
    id: "alm-01",
    name: "Yerba Mate Playadito 1kg",
    brand: "Playadito",
    category: "Almacén",
    sku: "PL-100-X10",
    price: 36500,
    unitPrice: 3650,
    packageInfo: "Fardo de 10 paquetes de 1kg c/u",
    stock: 35,
    highlight: true,
    description: "Yerba mate tradicional elaborada con palo. Estacionamiento natural y sabor suave característico. Producto número 1 en rotación nacional.",
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#CA8A04"
  },
  {
    id: "alm-02",
    name: "Fideos Matarazzo Tallarines 500g",
    brand: "Matarazzo",
    category: "Almacén",
    sku: "MT-TAL-X20",
    price: 23200,
    unitPrice: 1160,
    packageInfo: "Caja cerrada por 20 unidades",
    stock: 50,
    highlight: false,
    description: "Fideos secos elaborados con 100% sémola de trigo candeal seleccionada. No se pegan ni se pasan de cocción.",
    imageUrl: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#16A34A"
  },
  {
    id: "alm-03",
    name: "Aceite de Girasol Cocinero 1.5L",
    brand: "Cocinero",
    category: "Almacén",
    sku: "CC-ACE-X12",
    price: 26400,
    unitPrice: 2200,
    packageInfo: "Caja reforzada por 12 botellas",
    stock: 18,
    highlight: true,
    description: "Aceite puro de girasol con vitamina E añadida. Ideal para todo tipo de cocciones, repostería y frituras.",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#F59E0B"
  },
  {
    id: "alm-04",
    name: "Arroz Gallo Oro Parboil 1kg",
    brand: "Gallo",
    category: "Almacén",
    sku: "GL-ORO-X10",
    price: 21500,
    unitPrice: 2150,
    packageInfo: "Fardo de 10 paquetes de 1kg",
    stock: 40,
    highlight: false,
    description: "Arroz parboilizado de grano largo fino que nunca se pasa ni se pega. Calidad insuperable para el canal minorista.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#EA580C"
  },
  {
    id: "snk-01",
    name: "Papas Fritas Lays Clásicas 85g",
    brand: "Lays",
    category: "Snacks",
    sku: "LY-CLA-X18",
    price: 25200,
    unitPrice: 1400,
    packageInfo: "Caja exhibidora con 18 paquetes",
    stock: 22,
    highlight: true,
    description: "Papas seleccionadas fritas con un toque exacto de sal. El snack de mayor demanda en kioscos y minimercados.",
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#EAB308"
  },
  {
    id: "snk-02",
    name: "Maní Tostado con Sal Pehuamar 120g",
    brand: "Pehuamar",
    category: "Snacks",
    sku: "PH-MAN-X20",
    price: 19800,
    unitPrice: 990,
    packageInfo: "Caja por 20 unidades individuales",
    stock: 15,
    highlight: false,
    description: "Maní tostado y salado con la receta tradicional Pehuamar. Sellado al vacío para máxima frescura y crocancia.",
    imageUrl: "https://images.unsplash.com/photo-1569466896818-335b1bedfcce?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#D97706"
  },
  {
    id: "snk-03",
    name: "Nachos Doritos Queso Mega Queso 95g",
    brand: "Doritos",
    category: "Snacks",
    sku: "DR-QSO-X14",
    price: 21700,
    unitPrice: 1550,
    packageInfo: "Caja por 14 bolsas medianas",
    stock: 3, // LOW STOCK DEMO
    highlight: false,
    description: "Totopos de maíz crujientes con intenso sabor a queso cheddar. Presentación clave para góndolas de snacks premium.",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#EA580C"
  },
  {
    id: "gol-01",
    name: "Alfajor Guaymallén Triple Chocolate",
    brand: "Guaymallén",
    category: "Golosinas",
    sku: "GY-TRIP-X24",
    price: 11500,
    unitPrice: 479.1,
    packageInfo: "Caja exhibidora por 24 alfajores",
    stock: 55,
    highlight: true,
    description: "El alfajor triple de dulce de leche con baño de repostería fantasía más vendido de la Argentina. Relación precio/rotación inigualable.",
    imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#475569"
  },
  {
    id: "gol-02",
    name: "Chocolinas Galletitas de Chocolate 250g",
    brand: "Chocolinas",
    category: "Golosinas",
    sku: "CH-GAL-X30",
    price: 34500,
    unitPrice: 1150,
    packageInfo: "Caja cerrada por 30 paquetes",
    stock: 30,
    highlight: false,
    description: "Galletitas dulces sabor chocolate intenso. Insumo fundamental para preparación de chocotortas y meriendas familiares.",
    imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#78350F"
  },
  {
    id: "gol-03",
    name: "Gomitas Mogul Ositos Surtidos 30g",
    brand: "Mogul",
    category: "Golosinas",
    sku: "MG-OSI-X12",
    price: 6800,
    unitPrice: 566.6,
    packageInfo: "Tira colgante / display de 12 bolsitas",
    stock: 0, // OUT OF STOCK DEMO
    highlight: false,
    description: "Caramelos de goma con jugo concentrado de frutas en divertidas formas de ositos. Sin TACC / Libres de gluten.",
    imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#EC4899"
  },
  {
    id: "lim-01",
    name: "Lavandina Ayudín Clásica 1 Litro",
    brand: "Ayudín",
    category: "Limpieza",
    sku: "AY-LAV-X15",
    price: 17250,
    unitPrice: 1150,
    packageInfo: "Caja por 15 botellas de 1000ml",
    stock: 45,
    highlight: true,
    description: "Lavandina concentrada con poder desinfectante que elimina el 99.9% de bacterias, hongos y virus en superficies del hogar y comercio.",
    imageUrl: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#2563EB"
  },
  {
    id: "lim-02",
    name: "Limpiador Cremoso Cif Bioactive 750ml",
    brand: "Cif",
    category: "Limpieza",
    sku: "CF-CREM-X12",
    price: 21600,
    unitPrice: 1800,
    packageInfo: "Caja termoencogible con 12 botellas",
    stock: 25,
    highlight: false,
    description: "Limpiador multiuso con micropartículas minerales para remover grasa profunda en cocinas y baños sin rayar las superficies.",
    imageUrl: "https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#10B981"
  },
  {
    id: "lim-03",
    name: "Detergente Ala Limón Ultra Concentrado 500ml",
    brand: "Ala",
    category: "Limpieza",
    sku: "AL-DET-X18",
    price: 18900,
    unitPrice: 1050,
    packageInfo: "Caja por 18 unidades de 500ml",
    stock: 32,
    highlight: false,
    description: "Detergente lavavajillas líquido fórmula ultra desengrasante con aroma fresco a limón natural. Rinde el doble por lavado.",
    imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80",
    badgeColor: "#84CC16"
  }
];

// ==========================================
// 2. ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================
const AppState = {
  currentCategory: 'todos',
  searchQuery: '',
  selectedBrand: 'todas',
  stockOnly: false,
  sortBy: 'destacados',
  cart: [] // items: { id, quantity }
};

const STORAGE_KEY = 'tunegocio_wholesale_cart_v1';
const WHATSAPP_PHONE = '5492983448645'; // WhatsApp Oficial de Blux

// ==========================================
// 3. UTILIDADES DE FORMATO Y RENDERIZADO VISUAL
// ==========================================
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 2400);
}

/**
 * Genera el elemento visual de foto del producto con fallback elegante a placeholder editorial
 */
function renderProductMedia(product, context = 'grid') {
  const isThumb = context === 'thumb';
  const isModal = context === 'modal';

  if (product.imageUrl) {
    return `
      <img src="${product.imageUrl}" alt="${product.name}" class="product-photo-img" loading="lazy" onerror="this.outerHTML=renderPlaceholderMedia('${product.brand}', '${product.category}', '${isThumb ? 'thumb' : 'full'}')" />
    `;
  }
  return renderPlaceholderMedia(product.brand, product.category, isThumb ? 'thumb' : 'full');
}

function renderPlaceholderMedia(brand, category, size = 'full') {
  if (size === 'thumb') {
    return `
      <div class="photo-placeholder-thumb">
        <span>FOTO</span>
      </div>
    `;
  }
  return `
    <div class="photo-placeholder-box">
      <div class="photo-placeholder-inner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        <span class="placeholder-tag">FOTO DEL PRODUCTO</span>
        <span class="placeholder-sub">${brand} · ${category}</span>
      </div>
    </div>
  `;
}

// ==========================================
// 4. PERSISTENCIA DEL CARRITO
// ==========================================
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      AppState.cart = JSON.parse(saved);
    }
  } catch (e) {
    AppState.cart = [];
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState.cart));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
}

// ==========================================
// 5. GESTIÓN DEL CARRITO
// ==========================================
function addToCart(productId, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast('Este producto no tiene stock disponible', 'info');
    return;
  }

  const existingItem = AppState.cart.find(item => item.id === productId);
  const currentQty = existingItem ? existingItem.quantity : 0;
  const newQty = currentQty + quantity;

  if (newQty > product.stock) {
    showToast(`Stock máximo disponible: ${product.stock} bultos`, 'info');
    if (existingItem) existingItem.quantity = product.stock;
    else AppState.cart.push({ id: productId, quantity: product.stock });
  } else {
    if (existingItem) {
      existingItem.quantity = newQty;
    } else {
      AppState.cart.push({ id: productId, quantity: quantity });
    }
    showToast(`${product.name} agregado al pedido`, 'success');
  }

  saveCartToStorage();
  updateCartUI();
}

function updateCartItemQuantity(productId, newQty) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const itemIndex = AppState.cart.findIndex(i => i.id === productId);
  if (itemIndex === -1) return;

  if (newQty <= 0) {
    AppState.cart.splice(itemIndex, 1);
    showToast('Producto eliminado del pedido', 'info');
  } else if (newQty > product.stock) {
    AppState.cart[itemIndex].quantity = product.stock;
    showToast(`Stock máximo disponible: ${product.stock}`, 'info');
  } else {
    AppState.cart[itemIndex].quantity = newQty;
  }

  saveCartToStorage();
  updateCartUI();
}

function clearCart() {
  AppState.cart = [];
  saveCartToStorage();
  updateCartUI();
  showToast('El pedido ha sido vaciado', 'info');
}

function getCartCalculations() {
  let totalItems = 0;
  let totalAmount = 0;

  AppState.cart.forEach(item => {
    const p = PRODUCTS.find(prod => prod.id === item.id);
    if (p) {
      totalItems += item.quantity;
      totalAmount += p.price * item.quantity;
    }
  });

  return { totalItems, totalAmount };
}

// ==========================================
// 6. RENDERIZADO Y ACTUALIZACIÓN DEL CARRITO
// ==========================================
function updateCartUI() {
  const { totalItems, totalAmount } = getCartCalculations();
  const formattedTotal = formatCurrency(totalAmount);

  // Badge del header
  const badgeHeader = document.getElementById('cart-counter-badge');
  const navTotal = document.getElementById('cart-nav-total');
  if (badgeHeader) badgeHeader.textContent = totalItems;
  if (navTotal) navTotal.textContent = formattedTotal;

  // Floating pill móvil
  const floatCounter = document.getElementById('float-cart-counter');
  const floatTotal = document.getElementById('float-cart-total');
  if (floatCounter) floatCounter.textContent = totalItems;
  if (floatTotal) floatTotal.textContent = formattedTotal;

  // Drawer Title Tag
  const drawerTag = document.getElementById('cart-items-count-tag');
  if (drawerTag) drawerTag.textContent = `${totalItems} ${totalItems === 1 ? 'ítem' : 'ítems'}`;

  // Drawer Subtotal
  const subtotalText = document.getElementById('cart-subtotal-amount');
  if (subtotalText) subtotalText.textContent = formattedTotal;

  // Checkout modal total
  const checkoutTotalDisplay = document.getElementById('checkout-total-display');
  if (checkoutTotalDisplay) checkoutTotalDisplay.textContent = formattedTotal;

  // Render items list inside drawer
  const listContainer = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-message');
  const cartFooter = document.getElementById('cart-footer');
  const notesContainer = document.getElementById('cart-notes-container');

  if (!listContainer) return;

  if (AppState.cart.length === 0) {
    listContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    if (cartFooter) cartFooter.style.display = 'none';
    if (notesContainer) notesContainer.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'flex';
    if (notesContainer) notesContainer.style.display = 'block';

    listContainer.innerHTML = AppState.cart.map(item => {
      const p = PRODUCTS.find(prod => prod.id === item.id);
      if (!p) return '';
      const itemSubtotal = formatCurrency(p.price * item.quantity);

      return `
        <li class="cart-item-row" data-id="${p.id}">
          <div class="cart-item-thumb">
            ${renderProductMedia(p, 'thumb')}
          </div>
          <div class="cart-item-info">
            <span class="cart-item-brand">${p.brand}</span>
            <h4 class="cart-item-title">${p.name}</h4>
            <div class="cart-item-prices">
              <span class="cart-item-total">${itemSubtotal}</span>
              <span class="cart-item-unit-price">(${formatCurrency(p.price)} c/u)</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-qty-control">
                <button class="cart-qty-btn btn-decrease" data-id="${p.id}" aria-label="Restar">-</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button class="cart-qty-btn btn-increase" data-id="${p.id}" ${item.quantity >= p.stock ? 'disabled' : ''} aria-label="Sumar">+</button>
              </div>
              <button class="btn-remove-item" data-id="${p.id}">Eliminar</button>
            </div>
          </div>
        </li>
      `;
    }).join('');
  }
}

// ==========================================
// 7. FILTRADO Y ORDENAMIENTO DE PRODUCTOS
// ==========================================
function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    if (AppState.currentCategory !== 'todos' && p.category !== AppState.currentCategory) {
      return false;
    }

    if (AppState.selectedBrand !== 'todas' && p.brand !== AppState.selectedBrand) {
      return false;
    }

    if (AppState.stockOnly && p.stock <= 0) {
      return false;
    }

    if (AppState.searchQuery.trim() !== '') {
      const query = AppState.searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchSku = p.sku.toLowerCase().includes(query);
      const matchCategory = p.category.toLowerCase().includes(query);
      if (!matchName && !matchBrand && !matchSku && !matchCategory) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (AppState.sortBy === 'precio-asc') return a.price - b.price;
    if (AppState.sortBy === 'precio-desc') return b.price - a.price;
    if (AppState.sortBy === 'nombre-asc') return a.name.localeCompare(b.name);
    if (a.highlight && !b.highlight) return -1;
    if (!a.highlight && b.highlight) return 1;
    return 0;
  });
}

function renderProductsGrid() {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('no-results-state');
  const visibleCount = document.getElementById('visible-products-count');
  if (!grid) return;

  const filtered = getFilteredProducts();

  if (visibleCount) {
    visibleCount.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  grid.innerHTML = filtered.map(p => {
    const isOutOfStock = p.stock <= 0;
    const isLowStock = p.stock > 0 && p.stock <= 5;

    let stockTag = `<span class="stock-tag in-stock">Stock: ${p.stock} bultos</span>`;
    if (isOutOfStock) {
      stockTag = '<span class="stock-tag out-of-stock">Sin stock</span>';
    } else if (isLowStock) {
      stockTag = `<span class="stock-tag low-stock">¡Últimos ${p.stock}!</span>`;
    }

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-card-media btn-open-detail" data-id="${p.id}">
          <div class="card-badges-row">
            <span class="category-tag">${p.category}</span>
            ${stockTag}
          </div>
          ${renderProductMedia(p, 'grid')}
        </div>

        <div class="product-card-body">
          <div class="product-meta-row">
            <span class="product-brand">${p.brand}</span>
            <span class="product-sku">${p.sku}</span>
          </div>

          <h3 class="product-card-title btn-open-detail" data-id="${p.id}">${p.name}</h3>
          <p class="product-package-info">${p.packageInfo}</p>

          <div class="product-price-row">
            <div class="price-unit-block">
              <span class="price-label">Precio x bulto</span>
              <span class="price-amount">${formatCurrency(p.price)}</span>
            </div>
            <span class="price-per-unit">(${formatCurrency(p.unitPrice)} un.)</span>
          </div>

          <div class="product-card-actions">
            <div class="qty-control">
              <button class="qty-btn btn-grid-minus" data-id="${p.id}" ${isOutOfStock ? 'disabled' : ''}>-</button>
              <input type="text" class="qty-input" id="qty-input-${p.id}" value="1" readonly ${isOutOfStock ? 'disabled' : ''} />
              <button class="qty-btn btn-grid-plus" data-id="${p.id}" ${isOutOfStock ? 'disabled' : ''}>+</button>
            </div>
            <button class="btn-add-to-cart btn-grid-add" data-id="${p.id}" ${isOutOfStock ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5v14"/></svg>
              ${isOutOfStock ? 'Agotado' : 'Agregar'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function updateCategoryChipsCounts() {
  const counts = {
    todos: PRODUCTS.length,
    bebidas: PRODUCTS.filter(p => p.category === 'Bebidas').length,
    almacen: PRODUCTS.filter(p => p.category === 'Almacén').length,
    snacks: PRODUCTS.filter(p => p.category === 'Snacks').length,
    golosinas: PRODUCTS.filter(p => p.category === 'Golosinas').length,
    limpieza: PRODUCTS.filter(p => p.category === 'Limpieza').length,
  };

  Object.keys(counts).forEach(key => {
    const el = document.getElementById(`chip-count-${key}`);
    if (el) el.textContent = counts[key];
  });
}

function populateBrandFilter() {
  const brandSelect = document.getElementById('filter-brand');
  if (!brandSelect) return;

  const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
  brandSelect.innerHTML = '<option value="todas">Todas las marcas</option>';
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    brandSelect.appendChild(opt);
  });
}

// ==========================================
// 8. MODALES (DETALLE DE PRODUCTO Y CHECKOUT)
// ==========================================
function openProductDetail(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (!p) return;

  const modal = document.getElementById('product-modal');
  const backdrop = document.getElementById('product-modal-backdrop');
  const content = document.getElementById('product-modal-content');
  if (!modal || !content) return;

  const isOutOfStock = p.stock <= 0;
  const isLowStock = p.stock > 0 && p.stock <= 5;
  let stockBadge = `<span class="stock-tag in-stock">Stock disponible: ${p.stock} bultos</span>`;
  if (isOutOfStock) stockBadge = '<span class="stock-tag out-of-stock">Sin stock momentáneo</span>';
  else if (isLowStock) stockBadge = `<span class="stock-tag low-stock">¡Últimos ${p.stock} bultos!</span>`;

  content.innerHTML = `
    <div class="modal-product-media">
      ${renderProductMedia(p, 'modal')}
    </div>
    <div class="modal-badge-row">
      <span class="category-tag">${p.category}</span>
      <span class="category-tag" style="background:var(--bg-tertiary);">${p.brand}</span>
      ${stockBadge}
    </div>
    <h2 class="modal-product-title">${p.name}</h2>
    <p class="modal-product-desc">${p.description}</p>

    <div class="modal-details-table">
      <div class="detail-item">
        <strong>Presentación</strong>
        <span>${p.packageInfo}</span>
      </div>
      <div class="detail-item">
        <strong>Código SKU</strong>
        <span>${p.sku}</span>
      </div>
      <div class="detail-item">
        <strong>Precio Mayorista</strong>
        <span style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${formatCurrency(p.price)}</span>
      </div>
      <div class="detail-item">
        <strong>Estimado por unidad</strong>
        <span>${formatCurrency(p.unitPrice)}</span>
      </div>
    </div>

    <div class="modal-actions-bar">
      <div class="qty-control">
        <button class="qty-btn" id="modal-qty-minus" ${isOutOfStock ? 'disabled' : ''}>-</button>
        <input type="text" class="qty-input" id="modal-qty-input" value="1" readonly ${isOutOfStock ? 'disabled' : ''} />
        <button class="qty-btn" id="modal-qty-plus" ${isOutOfStock ? 'disabled' : ''}>+</button>
      </div>
      <button class="btn-add-to-cart" id="modal-add-to-cart" ${isOutOfStock ? 'disabled' : ''} style="height:44px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5v14"/></svg>
        ${isOutOfStock ? 'Producto Agotado' : 'Agregar al Pedido'}
      </button>
    </div>
  `;

  let modalQty = 1;
  const inputEl = document.getElementById('modal-qty-input');
  document.getElementById('modal-qty-minus')?.addEventListener('click', () => {
    if (modalQty > 1) {
      modalQty--;
      inputEl.value = modalQty;
    }
  });
  document.getElementById('modal-qty-plus')?.addEventListener('click', () => {
    if (modalQty < p.stock) {
      modalQty++;
      inputEl.value = modalQty;
    }
  });
  document.getElementById('modal-add-to-cart')?.addEventListener('click', () => {
    addToCart(p.id, modalQty);
    closeAllModals();
  });

  modal.classList.add('open');
  backdrop.classList.add('open');
}

function openDrawer() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-drawer-backdrop')?.classList.add('open');
}

function closeDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-drawer-backdrop')?.classList.remove('open');
}

function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast('El pedido está vacío', 'info');
    return;
  }
  closeDrawer();
  document.getElementById('checkout-modal')?.classList.add('open');
  document.getElementById('checkout-modal-backdrop')?.classList.add('open');
}

function closeAllModals() {
  document.getElementById('product-modal')?.classList.remove('open');
  document.getElementById('product-modal-backdrop')?.classList.remove('open');
  document.getElementById('checkout-modal')?.classList.remove('open');
  document.getElementById('checkout-modal-backdrop')?.classList.remove('open');
  closeDrawer();
}

// ==========================================
// 9. CONSTRUCTOR DE MENSAJE PARA WHATSAPP
// ==========================================
function sendWhatsAppOrder(customerData) {
  const { totalItems, totalAmount } = getCartCalculations();
  const notes = document.getElementById('order-notes')?.value.trim() || 'Sin observaciones';

  let message = `*NUEVO PEDIDO MAYORISTA - TU NEGOCIO*\n`;
  message += `------------------------------------\n`;
  message += `*DATOS DEL CLIENTE:*\n`;
  message += `• *Nombre / Razón Social:* ${customerData.name}\n`;
  if (customerData.cuit) message += `• *CUIT / DNI:* ${customerData.cuit}\n`;
  message += `• *Teléfono:* ${customerData.phone}\n`;
  message += `• *Localidad / Provincia:* ${customerData.city}\n`;
  if (customerData.address) message += `• *Dirección / Transporte:* ${customerData.address}\n`;
  message += `• *Forma de pago:* ${customerData.payment}\n`;
  message += `------------------------------------\n`;
  message += `*DETALLE DEL PEDIDO (${totalItems} bultos):*\n\n`;

  AppState.cart.forEach((item, index) => {
    const p = PRODUCTS.find(prod => prod.id === item.id);
    if (p) {
      const sub = p.price * item.quantity;
      message += `${index + 1}. *${item.quantity}x* ${p.name}\n`;
      message += `   SKU: ${p.sku} | Subtotal: ${formatCurrency(sub)}\n`;
    }
  });

  message += `\n------------------------------------\n`;
  message += `*TOTAL ESTIMADO:* ${formatCurrency(totalAmount)}\n`;
  if (notes && notes !== 'Sin observaciones') {
    message += `*Aclaraciones:* ${notes}\n`;
  }
  message += `------------------------------------\n`;
  message += `_Pedido generado automáticamente a través de la demo de catálogo digital desarrollada por Blux (blux.digital)_\n`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
  closeAllModals();
  showToast('¡Redirigiendo a WhatsApp para enviar el pedido!', 'success');
}

// ==========================================
// 10. INICIALIZACIÓN Y EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  updateCategoryChipsCounts();
  populateBrandFilter();
  renderProductsGrid();
  updateCartUI();

  // Búsqueda en tiempo real
  const searchInput = document.getElementById('catalog-search');
  const clearSearchBtn = document.getElementById('clear-search');

  searchInput?.addEventListener('input', (e) => {
    AppState.searchQuery = e.target.value;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
    }
    renderProductsGrid();
  });

  clearSearchBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      AppState.searchQuery = '';
      clearSearchBtn.style.display = 'none';
      renderProductsGrid();
      searchInput.focus();
    }
  });

  // Selector de Categorías (Tabs Horizontales)
  const categoryChips = document.querySelectorAll('.category-chip');
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      AppState.currentCategory = chip.dataset.category;
      renderProductsGrid();
    });
  });

  // Filtro de Marca
  document.getElementById('filter-brand')?.addEventListener('change', (e) => {
    AppState.selectedBrand = e.target.value;
    renderProductsGrid();
  });

  // Filtro Solo en Stock
  document.getElementById('filter-stock-only')?.addEventListener('change', (e) => {
    AppState.stockOnly = e.target.checked;
    renderProductsGrid();
  });

  // Ordenamiento
  document.getElementById('sort-by')?.addEventListener('change', (e) => {
    AppState.sortBy = e.target.value;
    renderProductsGrid();
  });

  // Botón reset filtros
  document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
    AppState.searchQuery = '';
    AppState.currentCategory = 'todos';
    AppState.selectedBrand = 'todas';
    AppState.stockOnly = false;
    AppState.sortBy = 'destacados';

    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    const brandSelect = document.getElementById('filter-brand');
    if (brandSelect) brandSelect.value = 'todas';
    const stockCheck = document.getElementById('filter-stock-only');
    if (stockCheck) stockCheck.checked = false;
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) sortSelect.value = 'destacados';

    categoryChips.forEach(c => {
      if (c.dataset.category === 'todos') c.classList.add('active');
      else c.classList.remove('active');
    });

    renderProductsGrid();
  });

  // Delegación de eventos en Grid de Productos
  document.getElementById('products-grid')?.addEventListener('click', (e) => {
    const detailBtn = e.target.closest('.btn-open-detail');
    if (detailBtn) {
      openProductDetail(detailBtn.dataset.id);
      return;
    }

    const plusBtn = e.target.closest('.btn-grid-plus');
    if (plusBtn) {
      const pId = plusBtn.dataset.id;
      const product = PRODUCTS.find(p => p.id === pId);
      const input = document.getElementById(`qty-input-${pId}`);
      if (input && product) {
        let val = parseInt(input.value) || 1;
        if (val < product.stock) {
          input.value = val + 1;
        }
      }
      return;
    }

    const minusBtn = e.target.closest('.btn-grid-minus');
    if (minusBtn) {
      const pId = minusBtn.dataset.id;
      const input = document.getElementById(`qty-input-${pId}`);
      if (input) {
        let val = parseInt(input.value) || 1;
        if (val > 1) {
          input.value = val - 1;
        }
      }
      return;
    }

    const addBtn = e.target.closest('.btn-grid-add');
    if (addBtn) {
      const pId = addBtn.dataset.id;
      const input = document.getElementById(`qty-input-${pId}`);
      const qty = input ? parseInt(input.value) || 1 : 1;
      addToCart(pId, qty);
    }
  });

  // Delegación de eventos dentro del Carrito Drawer
  document.getElementById('cart-items-list')?.addEventListener('click', (e) => {
    const incBtn = e.target.closest('.btn-increase');
    if (incBtn) {
      const pId = incBtn.dataset.id;
      const item = AppState.cart.find(i => i.id === pId);
      if (item) updateCartItemQuantity(pId, item.quantity + 1);
      return;
    }

    const decBtn = e.target.closest('.btn-decrease');
    if (decBtn) {
      const pId = decBtn.dataset.id;
      const item = AppState.cart.find(i => i.id === pId);
      if (item) updateCartItemQuantity(pId, item.quantity - 1);
      return;
    }

    const removeBtn = e.target.closest('.btn-remove-item');
    if (removeBtn) {
      const pId = removeBtn.dataset.id;
      updateCartItemQuantity(pId, 0);
    }
  });

  // Abrir y Cerrar Carrito
  document.getElementById('btn-open-cart')?.addEventListener('click', openDrawer);
  document.getElementById('btn-floating-cart')?.addEventListener('click', openDrawer);
  document.getElementById('btn-close-cart')?.addEventListener('click', closeDrawer);
  document.getElementById('cart-drawer-backdrop')?.addEventListener('click', closeDrawer);
  document.getElementById('btn-cart-start-shopping')?.addEventListener('click', closeDrawer);
  document.getElementById('btn-clear-cart')?.addEventListener('click', clearCart);

  // Abrir Modal de Checkout
  document.getElementById('btn-proceed-checkout')?.addEventListener('click', openCheckoutModal);
  document.getElementById('btn-close-checkout-modal')?.addEventListener('click', closeAllModals);
  document.getElementById('checkout-modal-backdrop')?.addEventListener('click', closeAllModals);

  // Cerrar Modal Detalle
  document.getElementById('btn-close-product-modal')?.addEventListener('click', closeAllModals);
  document.getElementById('product-modal-backdrop')?.addEventListener('click', closeAllModals);

  // Envío de Formulario Checkout a WhatsApp
  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cust-name')?.value.trim();
    const phone = document.getElementById('cust-phone')?.value.trim();
    const city = document.getElementById('cust-city')?.value.trim();

    if (!name || !phone || !city) {
      showToast('Por favor completá los campos obligatorios (*)', 'info');
      return;
    }

    const customerData = {
      name,
      cuit: document.getElementById('cust-cuit')?.value.trim(),
      phone,
      city,
      address: document.getElementById('cust-address')?.value.trim(),
      payment: document.getElementById('cust-payment')?.value
    };

    sendWhatsAppOrder(customerData);
  });

  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
});
