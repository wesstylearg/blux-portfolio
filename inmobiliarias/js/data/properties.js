/**
 * Propiedades ficticias de la demo.
 *
 * IMPORTANTE: todos los datos (precios, superficies, ubicaciones de referencia,
 * descripciones e imágenes) son ilustrativos y no representan propiedades reales.
 *
 * Esquema de cada registro (pensado para mapearse 1:1 a una tabla / API):
 *  id            string   Identificador único público (ej.: "IEJ-1001")
 *  title         string
 *  type          'casa' | 'departamento' | 'duplex' | 'ph' | 'oficina'
 *  operation     'venta' | 'alquiler'
 *  price         number   Venta en USD, alquiler en ARS mensuales
 *  currency      'USD' | 'ARS'
 *  expenses      number | null   Expensas mensuales en ARS
 *  location      { neighborhood, city, province, reference }
 *  coveredArea   number   m² cubiertos
 *  totalArea     number   m² totales
 *  rooms, bedrooms, bathrooms, garage   number
 *  features      { balcony, patio, garden, pool }   boolean
 *  condition     'a-estrenar' | 'excelente' | 'muy-bueno' | 'a-refaccionar'
 *  age           number   Antigüedad en años
 *  orientation   string
 *  amenities     string[] Comodidades propias de la propiedad
 *  services      string[] Servicios disponibles
 *  description   string[] Párrafos
 *  publishedAt   string   Fecha ISO (YYYY-MM-DD)
 *  images        { src, alt }[]
 *  status        'publicada' | 'reservada' | 'borrador'
 *  featured      boolean
 */
window.IEJ = window.IEJ || {};
IEJ.data = IEJ.data || {};

(function () {
  const U = id => 'https://images.unsplash.com/photo-' + id;

  IEJ.data.heroImage = { src: U('1613977257363-707ba9348227'), alt: 'Casa contemporánea blanca con pileta y grandes ventanales' };
  IEJ.data.aboutImage = { src: U('1600607688969-a5bfcd646154'), alt: 'Casa moderna de madera y negro rodeada de jardín y árboles' };

  IEJ.data.properties = [
    {
      id: 'IEJ-1001',
      title: 'Casa contemporánea con jardín en Palihue',
      type: 'casa',
      operation: 'venta',
      price: 385000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Palihue', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'A pocas cuadras del Parque Campaña del Desierto' },
      coveredArea: 240,
      totalArea: 620,
      rooms: 6,
      bedrooms: 4,
      bathrooms: 3,
      garage: 2,
      features: { balcony: false, patio: true, garden: true, pool: false },
      condition: 'excelente',
      age: 4,
      orientation: 'Norte',
      amenities: ['Jardín parquizado', 'Galería con parrilla', 'Calefacción por losa radiante', 'Aberturas de aluminio con DVH', 'Vestidor en suite principal', 'Lavadero independiente'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad', 'Fibra óptica disponible'],
      description: [
        'Casa de líneas contemporáneas desarrollada en dos plantas sobre un lote de 620 m², en una de las zonas residenciales más tranquilas de Palihue.',
        'La planta baja integra living, comedor y cocina en un único espacio con ventanales de piso a techo orientados al norte, que se abren a una galería con parrilla y al jardín. En planta alta se ubican la suite principal con vestidor y tres dormitorios secundarios que comparten baño completo.',
        'Construcción de 2022 con terminaciones de primera calidad, calefacción por losa radiante y carpinterías con doble vidriado hermético.'
      ],
      publishedAt: '2026-10-08',
      images: [
        { src: U('1600596542815-ffad4c1539a9'), alt: 'Fachada contemporánea de dos plantas con jardín al frente' },
        { src: U('1618221195710-dd6b41faaea6'), alt: 'Living amplio con ventanal horizontal y vista al verde' },
        { src: U('1600585152220-90363fe7e115'), alt: 'Cocina blanca con isla de madera y luminarias colgantes' },
        { src: U('1616594039964-ae9021a400a0'), alt: 'Dormitorio principal luminoso' },
        { src: U('1600607688066-890987f18a86'), alt: 'Baño en suite con doble bacha y ventanal' }
      ],
      status: 'publicada',
      featured: true
    },
    {
      id: 'IEJ-1002',
      title: 'Departamento luminoso de 3 ambientes en el Centro',
      type: 'departamento',
      operation: 'alquiler',
      price: 650000,
      currency: 'ARS',
      expenses: 95000,
      location: { neighborhood: 'Centro', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'A cuatro cuadras de Plaza Rivadavia' },
      coveredArea: 68,
      totalArea: 72,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      garage: 0,
      features: { balcony: true, patio: false, garden: false, pool: false },
      condition: 'muy-bueno',
      age: 12,
      orientation: 'Noreste',
      amenities: ['Balcón al frente', 'Cocina integrada', 'Placares empotrados', 'Calefacción por radiadores', 'Portero eléctrico'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad', 'Ascensor'],
      description: [
        'Departamento de tres ambientes al frente, en un edificio de categoría a pocas cuadras de Plaza Rivadavia, con todos los servicios y el comercio del centro a pie.',
        'Living comedor con salida a balcón, cocina integrada con barra, dos dormitorios con placares y baño completo. Excelente luminosidad natural durante todo el día.',
        'Ideal para quienes buscan practicidad y buena conexión con transporte público.'
      ],
      publishedAt: '2026-10-12',
      images: [
        { src: U('1545324418-cc1a3fa10c00'), alt: 'Edificio residencial con balcones' },
        { src: U('1502672260266-1c1ef2d93688'), alt: 'Living comedor luminoso del departamento' },
        { src: U('1484154218962-a197022b5858'), alt: 'Cocina integrada con barra' },
        { src: U('1505691938895-1758d7feb511'), alt: 'Dormitorio con ropa de cama clara' }
      ],
      status: 'publicada',
      featured: true
    },
    {
      id: 'IEJ-1003',
      title: 'Dúplex a estrenar en barrio Universitario',
      type: 'duplex',
      operation: 'venta',
      price: 168000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Universitario', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Cerca del complejo Palihue de la UNS' },
      coveredArea: 120,
      totalArea: 160,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      garage: 1,
      features: { balcony: true, patio: true, garden: false, pool: false },
      condition: 'a-estrenar',
      age: 0,
      orientation: 'Norte',
      amenities: ['Patio propio con parrilla', 'Cochera cubierta', 'Toilette en planta baja', 'Balcón en dormitorio principal', 'Preinstalación para aire acondicionado'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad'],
      description: [
        'Dúplex a estrenar de diseño moderno, en un desarrollo de solo dos unidades sobre calle arbolada del barrio Universitario.',
        'Planta baja con cocina abierta al living, toilette y salida a patio propio con parrilla. En planta alta, tres dormitorios —el principal con balcón— y baño completo.',
        'Terminaciones en porcelanato, aberturas de aluminio y cochera cubierta. Listo para escriturar.'
      ],
      publishedAt: '2026-10-10',
      images: [
        { src: U('1600563438938-a9a27216b4f5'), alt: 'Frente de dúplex moderno de dos plantas' },
        { src: U('1600210491369-e753d80a41f3'), alt: 'Living con sillón claro y cuadros' },
        { src: U('1600566752229-250ed79470f8'), alt: 'Cocina blanca con anafe y horno empotrado' },
        { src: U('1552321554-5fefe8c9ef14'), alt: 'Baño completo con revestimiento claro' }
      ],
      status: 'publicada',
      featured: true
    },
    {
      id: 'IEJ-1004',
      title: 'Casa familiar con parque en Bella Vista',
      type: 'casa',
      operation: 'venta',
      price: 215000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Bella Vista', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Zona residencial próxima a Av. Alem' },
      coveredArea: 180,
      totalArea: 400,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 2,
      garage: 1,
      features: { balcony: false, patio: true, garden: true, pool: false },
      condition: 'muy-bueno',
      age: 18,
      orientation: 'Este',
      amenities: ['Parque con árboles', 'Quincho con parrilla', 'Hogar a leña', 'Lavadero cubierto', 'Depósito al fondo'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad'],
      description: [
        'Casa en una planta pensada para la vida en familia, en una cuadra tranquila de Bella Vista.',
        'Living con hogar a leña, comedor diario, cocina independiente, tres dormitorios y dos baños. Al fondo, quincho con parrilla y un parque arbolado con espacio para pileta.',
        'Muy bien mantenida, con cochera para un vehículo y depósito independiente.'
      ],
      publishedAt: '2026-09-22',
      images: [
        { src: U('1568605114967-8130f3a36994'), alt: 'Frente de casa familiar con jardín delantero' },
        { src: U('1600121848594-d8644e57abab'), alt: 'Living con sillones grises y ventanales' },
        { src: U('1556909114-f6e7ad7d3136'), alt: 'Cocina amplia con mesada' },
        { src: U('1595526114035-0d45ed16cfbf'), alt: 'Dormitorio principal con ventana' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1005',
      title: 'Semipiso con amenities cerca del Parque de Mayo',
      type: 'departamento',
      operation: 'venta',
      price: 245000,
      currency: 'USD',
      expenses: 180000,
      location: { neighborhood: 'Napostá', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'A pocas cuadras del Parque de Mayo' },
      coveredArea: 115,
      totalArea: 128,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      garage: 1,
      features: { balcony: true, patio: false, garden: false, pool: true },
      condition: 'excelente',
      age: 6,
      orientation: 'Norte',
      amenities: ['Pileta en terraza', 'SUM', 'Gimnasio', 'Seguridad 24 h', 'Balcón aterrazado', 'Baulera'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad', 'Ascensor', 'Grupo electrógeno'],
      description: [
        'Semipiso de cuatro ambientes en edificio con amenities, a metros del Parque de Mayo y del arroyo Napostá.',
        'Recepción, living comedor con balcón aterrazado al norte, cocina con lavadero, tres dormitorios (uno en suite) y baño completo. Cochera fija y baulera.',
        'El edificio cuenta con pileta en terraza, gimnasio, SUM y seguridad las 24 horas.'
      ],
      publishedAt: '2026-10-05',
      images: [
        { src: U('1515263487990-61b07816b324'), alt: 'Edificio residencial moderno de fachada clara' },
        { src: U('1600607687939-ce8a6c25118c'), alt: 'Living comedor amplio y luminoso' },
        { src: U('1600489000022-c2086d79f9d4'), alt: 'Cocina moderna con mesada de piedra' },
        { src: U('1584622650111-993a426fbf0a'), alt: 'Baño con terminaciones modernas' }
      ],
      status: 'publicada',
      featured: true
    },
    {
      id: 'IEJ-1006',
      title: 'Monoambiente a estrenar en el Centro',
      type: 'departamento',
      operation: 'alquiler',
      price: 420000,
      currency: 'ARS',
      expenses: 60000,
      location: { neighborhood: 'Centro', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Cerca de la Universidad Nacional del Sur (sede Alem)' },
      coveredArea: 34,
      totalArea: 36,
      rooms: 1,
      bedrooms: 0,
      bathrooms: 1,
      garage: 0,
      features: { balcony: true, patio: false, garden: false, pool: false },
      condition: 'a-estrenar',
      age: 0,
      orientation: 'Oeste',
      amenities: ['Balcón', 'Kitchenette equipada', 'Aire acondicionado frío/calor', 'Laundry en el edificio'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad', 'Ascensor'],
      description: [
        'Monoambiente a estrenar con balcón, ideal para estudiantes o profesionales que buscan vivir cerca de todo.',
        'Ambiente principal con espacio de estar y dormir, kitchenette equipada y baño completo. Aire acondicionado frío/calor incluido.',
        'Edificio nuevo con laundry y acceso controlado.'
      ],
      publishedAt: '2026-10-14',
      images: [
        { src: U('1460317442991-0ec209397118'), alt: 'Edificio con balcones de vidrio' },
        { src: U('1522708323590-d24dbb6b0267'), alt: 'Monoambiente con estar y cocina integrados' },
        { src: U('1493809842364-78817add7ffb'), alt: 'Sector de estar con sillón y luz natural' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1007',
      title: 'Casa con pileta y quincho en Aldea Romana',
      type: 'casa',
      operation: 'venta',
      price: 320000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Aldea Romana', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Acceso por Camino La Carrindanga' },
      coveredArea: 210,
      totalArea: 900,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      garage: 2,
      features: { balcony: false, patio: true, garden: true, pool: true },
      condition: 'excelente',
      age: 7,
      orientation: 'Noroeste',
      amenities: ['Pileta', 'Quincho', 'Parque de 700 m² aprox.', 'Sistema de riego', 'Suite principal con vestidor', 'Alarma monitoreada'],
      services: ['Agua corriente', 'Gas natural', 'Electricidad', 'Cámara séptica'],
      description: [
        'Casa de estilo moderno sobre un lote de 900 m², con amplio parque, pileta y quincho, a minutos del centro.',
        'Living comedor con grandes aberturas hacia la galería, cocina abierta, tres dormitorios —el principal en suite con vestidor— y un total de tres baños.',
        'Sistema de riego automatizado, alarma monitoreada y cochera doble.'
      ],
      publishedAt: '2026-10-01',
      images: [
        { src: U('1512917774080-9991f1c4c750'), alt: 'Casa moderna con pileta y parque iluminado' },
        { src: U('1604014237800-1c9102c219da'), alt: 'Living integrado con galería y comedor exterior' },
        { src: U('1522771739844-6a9f6d5f14af'), alt: 'Dormitorio principal con ropa de cama blanca' },
        { src: U('1620626011761-996317b8d101'), alt: 'Baño principal moderno' }
      ],
      status: 'publicada',
      featured: true
    },
    {
      id: 'IEJ-1008',
      title: 'PH reciclado con galería en Villa Mitre',
      type: 'ph',
      operation: 'venta',
      price: 98000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Villa Mitre', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Próximo a calle Garibaldi' },
      coveredArea: 75,
      totalArea: 110,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 1,
      garage: 0,
      features: { balcony: false, patio: true, garden: false, pool: false },
      condition: 'muy-bueno',
      age: 45,
      orientation: 'Sur',
      amenities: ['Galería y patio propio', 'Cocina renovada', 'Pisos de madera restaurados', 'Sin expensas'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad'],
      description: [
        'PH al frente, reciclado en 2023, que conserva el encanto de la construcción original con instalaciones nuevas.',
        'Galería de acceso, living comedor con pisos de madera restaurados, cocina renovada, dos dormitorios y baño completo. Patio propio al fondo.',
        'Sin expensas. Una opción ideal como primera vivienda o inversión.'
      ],
      publishedAt: '2026-09-15',
      images: [
        { src: U('1560184897-ae75f418493e'), alt: 'Galería de acceso con puerta y sillón' },
        { src: U('1560185007-cde436f6a4d0'), alt: 'Living comedor con pisos de madera' },
        { src: U('1556911220-bff31c812dba'), alt: 'Cocina renovada' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1009',
      title: 'Oficina equipada en el microcentro',
      type: 'oficina',
      operation: 'alquiler',
      price: 780000,
      currency: 'ARS',
      expenses: 140000,
      location: { neighborhood: 'Centro', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Zona bancaria, cerca de calle O\u2019Higgins' },
      coveredArea: 85,
      totalArea: 85,
      rooms: 3,
      bedrooms: 0,
      bathrooms: 1,
      garage: 0,
      features: { balcony: false, patio: false, garden: false, pool: false },
      condition: 'excelente',
      age: 10,
      orientation: 'Este',
      amenities: ['Planta libre divisible', 'Kitchenette', 'Aire acondicionado central', 'Piso técnico', 'Control de acceso'],
      services: ['Agua corriente', 'Cloacas', 'Electricidad', 'Ascensor', 'Fibra óptica'],
      description: [
        'Oficina de 85 m² en edificio corporativo del microcentro, a metros de bancos y organismos públicos.',
        'Planta libre con posibilidad de división en tres ambientes, sala de reuniones, kitchenette y baño. Piso técnico y climatización central.',
        'Edificio con control de acceso y conexión de fibra óptica.'
      ],
      publishedAt: '2026-09-30',
      images: [
        { src: U('1486406146926-c627a92ad1ab'), alt: 'Edificios corporativos vidriados' },
        { src: U('1497366216548-37526070297c'), alt: 'Oficina de planta libre con puestos de trabajo' },
        { src: U('1497366811353-6870744d04b2'), alt: 'Sala de reuniones luminosa' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1010',
      title: 'Casa en alquiler con jardín en barrio Patagonia',
      type: 'casa',
      operation: 'alquiler',
      price: 1100000,
      currency: 'ARS',
      expenses: null,
      location: { neighborhood: 'Patagonia', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Cerca de colegios y Av. Cabrera' },
      coveredArea: 150,
      totalArea: 300,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
      garage: 1,
      features: { balcony: false, patio: false, garden: true, pool: false },
      condition: 'muy-bueno',
      age: 15,
      orientation: 'Norte',
      amenities: ['Jardín', 'Parrilla', 'Cochera cubierta', 'Calefacción por tiro balanceado'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad'],
      description: [
        'Casa en una planta en barrio Patagonia, con jardín al frente y al fondo, cerca de colegios y comercios.',
        'Living comedor, cocina con comedor diario, tres dormitorios y dos baños. Parrilla en el jardín y cochera cubierta.',
        'Disponible a partir de noviembre. Se solicitan garantías a convenir.'
      ],
      publishedAt: '2026-10-03',
      images: [
        { src: U('1570129477492-45c003edd2be'), alt: 'Frente de casa con jardín y césped' },
        { src: U('1586023492125-27b2c045efd7'), alt: 'Living con sillón y decoración cálida' },
        { src: U('1560185893-a55cbc8c57e8'), alt: 'Dormitorio principal amplio con ventanal' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1011',
      title: 'Dúplex a estrenar en Villa Floresta',
      type: 'duplex',
      operation: 'alquiler',
      price: 850000,
      currency: 'ARS',
      expenses: null,
      location: { neighborhood: 'Villa Floresta', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'A dos cuadras de Av. Colón' },
      coveredArea: 95,
      totalArea: 120,
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
      garage: 1,
      features: { balcony: false, patio: true, garden: false, pool: false },
      condition: 'a-estrenar',
      age: 0,
      orientation: 'Noreste',
      amenities: ['Patio con parrilla', 'Cochera', 'Toilette', 'Cocina con alacenas completas'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad'],
      description: [
        'Dúplex a estrenar de tres ambientes con patio propio y cochera, en Villa Floresta.',
        'Planta baja con living comedor, cocina y toilette; planta alta con dos dormitorios y baño completo.',
        'Excelente opción para parejas o familias pequeñas. Primer ocupante.'
      ],
      publishedAt: '2026-10-09',
      images: [
        { src: U('1494526585095-c41746248156'), alt: 'Frente moderno de dúplex al atardecer' },
        { src: U('1631679706909-1844bbd07221'), alt: 'Living en tonos claros con espejos' },
        { src: U('1617806118233-18e1de247200'), alt: 'Comedor con mesa y sillas verdes' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1012',
      title: 'Residencia de autor con pileta en Altos del Palihue',
      type: 'casa',
      operation: 'venta',
      price: 520000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Altos del Palihue', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Sector alto con vista abierta a la ciudad' },
      coveredArea: 340,
      totalArea: 1200,
      rooms: 7,
      bedrooms: 4,
      bathrooms: 4,
      garage: 3,
      features: { balcony: true, patio: true, garden: true, pool: true },
      condition: 'excelente',
      age: 5,
      orientation: 'Norte',
      amenities: ['Pileta climatizada', 'Quincho independiente', 'Suite con vestidor', 'Escritorio', 'Domótica en iluminación', 'Paneles solares para agua caliente'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad', 'Fibra óptica disponible'],
      description: [
        'Residencia de arquitectura contemporánea sobre un lote de 1.200 m² en Altos del Palihue, con vistas abiertas y máxima privacidad.',
        'Living de doble altura, comedor, cocina con isla, escritorio y cuatro dormitorios en suite. Las áreas sociales se abren a un deck con pileta climatizada y a un quincho independiente.',
        'Incorpora domótica en iluminación, paneles solares para agua caliente y cochera para tres vehículos.'
      ],
      publishedAt: '2026-10-11',
      images: [
        { src: U('1613490493576-7fde63acd811'), alt: 'Residencia contemporánea con pileta' },
        { src: U('1600566753086-00f18fb6b3ea'), alt: 'Living de doble altura con escalera y ventanales' },
        { src: U('1600210491892-03d54c0aaf87'), alt: 'Sala de estar con hogar y ventanales en arco' },
        { src: U('1600607687644-c7171b42498f'), alt: 'Ambiente social integrado' }
      ],
      status: 'publicada',
      featured: true
    },
    {
      id: 'IEJ-1013',
      title: 'Departamento de 2 ambientes próximo a la UNS',
      type: 'departamento',
      operation: 'venta',
      price: 72000,
      currency: 'USD',
      expenses: 45000,
      location: { neighborhood: 'Universitario', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'A metros de Av. Alem y de la UNS' },
      coveredArea: 45,
      totalArea: 50,
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
      garage: 0,
      features: { balcony: true, patio: false, garden: false, pool: false },
      condition: 'muy-bueno',
      age: 9,
      orientation: 'Este',
      amenities: ['Balcón', 'Cocina separada', 'Placard en dormitorio'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad', 'Ascensor'],
      description: [
        'Departamento de dos ambientes con balcón, en una de las zonas con mayor demanda de alquiler de la ciudad.',
        'Living comedor con salida al balcón, cocina separada, dormitorio con placard y baño completo.',
        'Muy buena opción como inversión para renta. Actualmente reservado.'
      ],
      publishedAt: '2026-09-18',
      images: [
        { src: U('1574362848149-11496d93a7c7'), alt: 'Edificio de ladrillo con balcones' },
        { src: U('1560448204-e02f11c3d0e2'), alt: 'Living comedor compacto y luminoso' },
        { src: U('1615874959474-d609969a20ed'), alt: 'Dormitorio con plantas y luz natural' }
      ],
      status: 'reservada',
      featured: false
    },
    {
      id: 'IEJ-1014',
      title: 'Casa para refaccionar en Villa Harding Green',
      type: 'casa',
      operation: 'venta',
      price: 135000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Villa Harding Green', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Barrio parque con calles arboladas' },
      coveredArea: 140,
      totalArea: 450,
      rooms: 4,
      bedrooms: 3,
      bathrooms: 1,
      garage: 1,
      features: { balcony: false, patio: true, garden: true, pool: false },
      condition: 'a-refaccionar',
      age: 40,
      orientation: 'Oeste',
      amenities: ['Jardín al frente y al fondo', 'Cochera semicubierta', 'Altillo'],
      services: ['Agua corriente', 'Gas natural', 'Electricidad', 'Cámara séptica'],
      description: [
        'Casa de estilo clásico sobre un amplio lote de 450 m² en Villa Harding Green, ideal para quienes buscan personalizar su vivienda.',
        'Living, cocina comedor, tres dormitorios, baño y altillo. Requiere actualización de instalaciones y terminaciones.',
        'Excelente lote, con jardín al frente y al fondo y cochera semicubierta.'
      ],
      publishedAt: '2026-09-10',
      images: [
        { src: U('1576941089067-2de3c901e126'), alt: 'Casa clásica blanca con techo a dos aguas' },
        { src: U('1600566753190-17f0baa2a6c3'), alt: 'Ambiente principal de la casa' },
        { src: U('1600494603989-9650cf6ddd3d'), alt: 'Dormitorio utilizado como escritorio' }
      ],
      status: 'publicada',
      featured: false
    },
    {
      id: 'IEJ-1015',
      title: 'Casa con cochera doble en Napostá',
      type: 'casa',
      operation: 'venta',
      price: 265000,
      currency: 'USD',
      expenses: null,
      location: { neighborhood: 'Napostá', city: 'Bahía Blanca', province: 'Buenos Aires', reference: 'Cerca del Parque de Mayo y Av. Alem' },
      coveredArea: 220,
      totalArea: 360,
      rooms: 5,
      bedrooms: 3,
      bathrooms: 3,
      garage: 2,
      features: { balcony: true, patio: true, garden: true, pool: false },
      condition: 'muy-bueno',
      age: 12,
      orientation: 'Sur',
      amenities: ['Cochera doble', 'Escritorio', 'Balcón en dormitorio principal', 'Parrilla', 'Calefacción central'],
      services: ['Agua corriente', 'Gas natural', 'Cloacas', 'Electricidad'],
      description: [
        'Casa de dos plantas con frente de ladrillo y cochera doble, en una zona consolidada de Napostá.',
        'Planta baja con living, comedor, cocina, escritorio y toilette. En planta alta, tres dormitorios —el principal en suite y con balcón— y un baño completo.',
        'Patio y jardín al fondo con parrilla. Calefacción central por radiadores.'
      ],
      publishedAt: '2026-09-26',
      images: [
        { src: U('1605276374104-dee2a0ed3cd6'), alt: 'Frente de casa de ladrillo con cochera doble' },
        { src: U('1600210492486-724fe5c67fb0'), alt: 'Living con sillones y luz natural' },
        { src: U('1540518614846-7eded433c457'), alt: 'Dormitorio principal' }
      ],
      status: 'publicada',
      featured: false
    }
  ];
})();
