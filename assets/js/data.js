/* ============================================================================
   DATOS DE REFERENCIA — Comercio Exterior Colombia
   ----------------------------------------------------------------------------
   Todas las cifras son RANGOS REFERENCIALES DE MERCADO (actualizados a 2026).
   No sustituyen una cotizacion en firme ni el Arancel de Aduanas de la DIAN.
   Verifique siempre: partida arancelaria, vistos buenos y tarifas vigentes.
   ========================================================================== */

const DATA = {};

/* ---------------------------------------------------------------------------
   1. ORIGENES: fletes, transitos y acuerdos comerciales
   Rangos USD. FCL = contenedor completo. LCL = carga suelta consolidada (por CBM).
   Aereo = USD por kilo tasable. Courier = USD por kilo.
--------------------------------------------------------------------------- */
DATA.origenes = [
  {
    id: 'china',
    nombre: 'China',
    puertosOrigen: 'Shanghai, Ningbo, Shenzhen, Qingdao, Guangzhou',
    destinoNatural: 'buenaventura',
    fcl20: [1800, 3500],
    fcl40: [2500, 5500],
    fcl40hc: [2700, 5800],
    lclCbm: [65, 120],
    lclMinCbm: 1,
    aereoKg: [4.5, 7.0],
    courierKg: [7.0, 12.0],
    transito: { maritimo: [30, 42], aereo: [6, 10] },
    tlc: null,
    arancelPref: null,
    nota: 'Sin TLC con Colombia: paga arancel NMF pleno. Vigilar derechos antidumping (calzado, textiles, acero, vidrio, tornillería).'
  },
  {
    id: 'usa',
    nombre: 'Estados Unidos',
    puertosOrigen: 'Miami, Houston, Savannah, Nueva York, Los Ángeles',
    destinoNatural: 'cartagena',
    fcl20: [1200, 2200],
    fcl40: [1600, 2900],
    fcl40hc: [1750, 3100],
    lclCbm: [45, 85],
    lclMinCbm: 1,
    aereoKg: [1.8, 3.5],
    courierKg: [4.5, 8.5],
    transito: { maritimo: [6, 12], aereo: [2, 4] },
    tlc: 'TLC Colombia - EE.UU. (vigente desde 2012)',
    arancelPref: 0,
    nota: 'La gran mayoría del universo arancelario está en 0% con Certificado de Origen. Es el origen más barato en tributos + flete corto.'
  },
  {
    id: 'europa',
    nombre: 'Unión Europea',
    puertosOrigen: 'Rotterdam, Amberes, Hamburgo, Valencia, Barcelona, Génova',
    destinoNatural: 'cartagena',
    fcl20: [1600, 3000],
    fcl40: [2200, 4200],
    fcl40hc: [2350, 4500],
    lclCbm: [60, 110],
    lclMinCbm: 1,
    aereoKg: [3.5, 6.0],
    courierKg: [6.5, 11.0],
    transito: { maritimo: [18, 30], aereo: [4, 7] },
    tlc: 'Acuerdo Comercial Colombia - UE (vigente desde 2013)',
    arancelPref: 0,
    nota: 'Desgravación casi total ya cumplida. Requiere declaración de origen en factura (exportador registrado REX).'
  },
  {
    id: 'mexico',
    nombre: 'México',
    puertosOrigen: 'Manzanillo, Veracruz, Altamira, Lázaro Cárdenas',
    destinoNatural: 'cartagena',
    fcl20: [1300, 2400],
    fcl40: [1800, 3200],
    fcl40hc: [1950, 3400],
    lclCbm: [55, 95],
    lclMinCbm: 1,
    aereoKg: [2.5, 4.5],
    courierKg: [5.5, 9.5],
    transito: { maritimo: [8, 16], aereo: [2, 5] },
    tlc: 'TLC Colombia - México + Alianza del Pacífico',
    arancelPref: 0,
    nota: 'Doble vía de preferencia: puede elegir el acuerdo que más le convenga según la regla de origen del producto.'
  },
  {
    id: 'brasil',
    nombre: 'Brasil / Mercosur',
    puertosOrigen: 'Santos, Paranaguá, Itajaí, Río Grande',
    destinoNatural: 'cartagena',
    fcl20: [1400, 2600],
    fcl40: [1900, 3400],
    fcl40hc: [2050, 3600],
    lclCbm: [55, 100],
    lclMinCbm: 1,
    aereoKg: [2.8, 5.0],
    courierKg: [6.0, 10.0],
    transito: { maritimo: [12, 22], aereo: [3, 6] },
    tlc: 'ACE 59 Colombia - Mercosur',
    arancelPref: 0,
    nota: 'Desgravación completada para la mayoría de líneas. Certificado de origen ACE 59 obligatorio.'
  },
  {
    id: 'can',
    nombre: 'Perú / Ecuador / Bolivia (CAN)',
    puertosOrigen: 'Callao, Guayaquil, Paita; o vía terrestre Ipiales / Rumichaca',
    destinoNatural: 'buenaventura',
    fcl20: [900, 1800],
    fcl40: [1200, 2400],
    fcl40hc: [1300, 2600],
    lclCbm: [40, 80],
    lclMinCbm: 1,
    aereoKg: [1.5, 3.0],
    courierKg: [4.0, 7.5],
    transito: { maritimo: [4, 10], aereo: [1, 3] },
    tlc: 'Comunidad Andina — Zona de Libre Comercio',
    arancelPref: 0,
    nota: 'Arancel 0% pleno entre países CAN. Ecuador y Perú admiten transporte terrestre internacional (CRT), suele ser lo más económico de la región.'
  },
  {
    id: 'chile',
    nombre: 'Chile',
    puertosOrigen: 'San Antonio, Valparaíso',
    destinoNatural: 'buenaventura',
    fcl20: [1000, 2000],
    fcl40: [1400, 2700],
    fcl40hc: [1500, 2900],
    lclCbm: [45, 85],
    lclMinCbm: 1,
    aereoKg: [1.8, 3.4],
    courierKg: [4.5, 8.0],
    transito: { maritimo: [7, 14], aereo: [2, 4] },
    tlc: 'TLC Colombia - Chile (ACE 24) + Alianza del Pacífico',
    arancelPref: 0,
    nota: 'Arancel 0% en prácticamente todo el universo arancelario.'
  },
  {
    id: 'panama',
    nombre: 'Panamá (Zona Libre de Colón)',
    puertosOrigen: 'Colón, Balboa, Manzanillo',
    destinoNatural: 'cartagena',
    fcl20: [700, 1400],
    fcl40: [900, 1900],
    fcl40hc: [1000, 2050],
    lclCbm: [35, 75],
    lclMinCbm: 1,
    aereoKg: [1.2, 2.6],
    courierKg: [3.5, 6.5],
    transito: { maritimo: [3, 7], aereo: [1, 2] },
    tlc: null,
    arancelPref: null,
    nota: 'Flete baratísimo y rápido, PERO la mercancía reexportada desde Zona Libre conserva el origen del fabricante (normalmente China): no genera preferencia y el arancel se paga completo. Útil para lotes pequeños y reposición rápida de inventario.'
  },
  {
    id: 'india',
    nombre: 'India',
    puertosOrigen: 'Nhava Sheva, Mundra, Chennai',
    destinoNatural: 'cartagena',
    fcl20: [1900, 3600],
    fcl40: [2600, 5200],
    fcl40hc: [2800, 5500],
    lclCbm: [70, 125],
    lclMinCbm: 1,
    aereoKg: [4.0, 7.0],
    courierKg: [7.5, 12.5],
    transito: { maritimo: [32, 45], aereo: [6, 10] },
    tlc: null,
    arancelPref: null,
    nota: 'Sin TLC. Competitivo en químicos, farma genérica, textiles y autopartes. Tránsito largo: planifique inventario de seguridad.'
  },
  {
    id: 'turquia',
    nombre: 'Turquía',
    puertosOrigen: 'Estambul (Ambarli), Mersin, Izmir',
    destinoNatural: 'cartagena',
    fcl20: [1800, 3200],
    fcl40: [2400, 4600],
    fcl40hc: [2550, 4850],
    lclCbm: [65, 115],
    lclMinCbm: 1,
    aereoKg: [3.8, 6.5],
    courierKg: [7.0, 11.5],
    transito: { maritimo: [25, 36], aereo: [5, 9] },
    tlc: null,
    arancelPref: null,
    nota: 'Sin TLC. Fuerte en textil, mármol, maquinaria y alimentos. Ojo con la salvaguardia del 35% al acero (Decreto 0264 de 2026).'
  },
  {
    id: 'corea',
    nombre: 'Corea del Sur',
    puertosOrigen: 'Busan, Incheon',
    destinoNatural: 'buenaventura',
    fcl20: [1900, 3600],
    fcl40: [2600, 5400],
    fcl40hc: [2800, 5700],
    lclCbm: [68, 122],
    lclMinCbm: 1,
    aereoKg: [4.2, 7.2],
    courierKg: [7.5, 12.0],
    transito: { maritimo: [30, 42], aereo: [6, 10] },
    tlc: 'TLC Colombia - Corea (vigente desde 2016)',
    arancelPref: 0,
    nota: 'Alternativa con arancel preferencial frente a China para electrónica, autopartes y químicos. Compare siempre el ahorro arancelario contra el mayor precio FOB.'
  },
  {
    id: 'asiaSur',
    nombre: 'Vietnam / Tailandia / Indonesia',
    puertosOrigen: 'Ho Chi Minh, Haiphong, Laem Chabang, Yakarta',
    destinoNatural: 'buenaventura',
    fcl20: [2000, 3800],
    fcl40: [2800, 5700],
    fcl40hc: [3000, 6000],
    lclCbm: [70, 128],
    lclMinCbm: 1,
    aereoKg: [4.5, 7.5],
    courierKg: [8.0, 13.0],
    transito: { maritimo: [33, 46], aereo: [7, 11] },
    tlc: null,
    arancelPref: null,
    nota: 'Sin TLC. Se ha vuelto la alternativa a China por costo de mano de obra, sobre todo en calzado, muebles y confección.'
  }
];

/* ---------------------------------------------------------------------------
   2. PUERTOS Y PASOS DE ENTRADA A COLOMBIA
--------------------------------------------------------------------------- */
DATA.puertos = [
  {
    id: 'buenaventura',
    nombre: 'Buenaventura (Pacífico)',
    operadores: 'Sociedad Portuaria de Buenaventura (SPRBUN), TCBUEN',
    gastosFcl: [420, 700],
    gastosLcl: [55, 120],
    diasLibres: 5,
    almacenajeDia: [22, 45],
    fleteInterno: { bogota: [900, 1600], medellin: [700, 1300], cali: [230, 430], barranquilla: [1500, 2400], bucaramanga: [1200, 1900] },
    fuerte: 'Puerta natural de Asia (China, Corea, Vietnam). Mueve cerca de la mitad de la carga contenerizada del país.',
    ojo: 'Congestión en temporada alta y riesgo de orden público en el corredor vial. Sume días de colchón.'
  },
  {
    id: 'cartagena',
    nombre: 'Cartagena (Caribe)',
    operadores: 'SPRC / CONTECAR (Puerto de Cartagena)',
    gastosFcl: [400, 680],
    gastosLcl: [50, 115],
    diasLibres: 5,
    almacenajeDia: [20, 42],
    fleteInterno: { bogota: [800, 1500], medellin: [750, 1350], cali: [1000, 1700], barranquilla: [180, 340], bucaramanga: [650, 1150] },
    fuerte: 'El puerto más eficiente del país y hub de trasbordo del Caribe. Mejor para EE.UU., Europa, México y Brasil.',
    ojo: 'Tarifas reguladas actualizadas en 2026. Es el que mejor cumple ventanas de atención.'
  },
  {
    id: 'barranquilla',
    nombre: 'Barranquilla (Caribe / fluvial)',
    operadores: 'Sociedad Portuaria Regional de Barranquilla',
    gastosFcl: [380, 660],
    gastosLcl: [50, 110],
    diasLibres: 5,
    almacenajeDia: [18, 40],
    fleteInterno: { bogota: [800, 1450], medellin: [700, 1250], cali: [1000, 1650], barranquilla: [60, 150], bucaramanga: [500, 950] },
    fuerte: 'Buena opción para granel, carga suelta y proyecto. Costos locales algo más bajos.',
    ojo: 'Calado limitado por sedimentación del río Magdalena: no todos los buques grandes recalan.'
  },
  {
    id: 'santamarta',
    nombre: 'Santa Marta (Caribe)',
    operadores: 'Sociedad Portuaria de Santa Marta',
    gastosFcl: [380, 650],
    gastosLcl: [48, 108],
    diasLibres: 5,
    almacenajeDia: [18, 38],
    fleteInterno: { bogota: [850, 1550], medellin: [780, 1400], cali: [1050, 1750], barranquilla: [150, 300], bucaramanga: [600, 1050] },
    fuerte: 'Puerto de aguas profundas, sin restricción de calado. Fuerte en refrigerados y granel.',
    ojo: 'Menor frecuencia de recaladas que Cartagena en algunos servicios.'
  },
  {
    id: 'bogota_aereo',
    nombre: 'Bogotá — Aeropuerto El Dorado (aéreo)',
    operadores: 'OPAIN / depósitos aduaneros aeroportuarios',
    gastosFcl: [0, 0],
    gastosLcl: [0, 0],
    gastosAereoFijo: [120, 320],
    diasLibres: 2,
    almacenajeDia: [0.35, 0.9],
    almacenajeUnidad: 'USD por kilo por día',
    fleteInterno: { bogota: [60, 160], medellin: [420, 780], cali: [450, 820], barranquilla: [800, 1400], bucaramanga: [380, 700] },
    fuerte: 'El principal aeropuerto de carga de América Latina. Levante en horas si la documentación está perfecta.',
    ojo: 'El almacenaje aéreo se cobra por kilo/día y escala muy rápido. Tenga la declaración lista antes de que aterrice.'
  }
];

/* ---------------------------------------------------------------------------
   3. ARANCELES TIPICOS POR CATEGORIA (referencial — confirmar partida en DIAN)
--------------------------------------------------------------------------- */
DATA.categorias = [
  { id: 'bienesCapital', nombre: 'Maquinaria y bienes de capital', arancel: 0, iva: 19, capitulos: '84, 85', nota: 'Gran parte de la maquinaria industrial no producida en el país está en 0%.' },
  { id: 'materiaPrima', nombre: 'Materias primas industriales no producidas', arancel: 0, iva: 19, capitulos: '28-39', nota: 'Verifique si su insumo tiene producción nacional: eso cambia el arancel.' },
  { id: 'electronica', nombre: 'Electrónica, computadores y celulares', arancel: 5, iva: 19, capitulos: '84.71, 85.17, 85.28', nota: 'Computadores y celulares suelen estar en 0-5%.' },
  { id: 'quimicos', nombre: 'Químicos e insumos', arancel: 5, iva: 19, capitulos: '28-38', nota: 'Algunos requieren visto bueno de Justicia/INDUMIL (precursores).' },
  { id: 'autopartes', nombre: 'Autopartes y repuestos', arancel: 10, iva: 19, capitulos: '87.08', nota: 'Rango 5%-15% según la pieza.' },
  { id: 'herramientas', nombre: 'Herramientas y ferretería', arancel: 10, iva: 19, capitulos: '82, 73', nota: 'Ojo con antidumping en tornillería de origen chino.' },
  { id: 'electrodomesticos', nombre: 'Electrodomésticos', arancel: 15, iva: 19, capitulos: '84.18, 85.16', nota: 'Requiere Reglamento Técnico de etiquetado energético (RETIQ) y RETIE cuando aplica.' },
  { id: 'plasticos', nombre: 'Manufacturas de plástico', arancel: 10, iva: 19, capitulos: '39', nota: '' },
  { id: 'textiles', nombre: 'Textiles y confecciones', arancel: 15, iva: 19, capitulos: '50-63', nota: 'Régimen de arancel MIXTO: porcentaje + USD por kilo. Uno de los sectores más fiscalizados y con mayor riesgo de duda de valor.' },
  { id: 'calzado', nombre: 'Calzado', arancel: 15, iva: 19, capitulos: '64', nota: 'Arancel mixto (porcentaje + USD por par) y antidumping vigente para varios orígenes asiáticos.' },
  { id: 'juguetes', nombre: 'Juguetes y artículos deportivos', arancel: 10, iva: 19, capitulos: '95', nota: 'Exige certificado de conformidad de seguridad para juguetes.' },
  { id: 'muebles', nombre: 'Muebles y decoración', arancel: 15, iva: 19, capitulos: '94', nota: 'La madera puede requerir permiso ambiental / CITES.' },
  { id: 'cosmeticos', nombre: 'Cosméticos y aseo', arancel: 10, iva: 19, capitulos: '33, 34', nota: 'Notificación Sanitaria Obligatoria del INVIMA ANTES de importar.' },
  { id: 'alimentos', nombre: 'Alimentos procesados', arancel: 15, iva: 19, capitulos: '16-22', nota: 'Registro sanitario INVIMA + visto bueno. Algunos IVA 5% o excluidos.' },
  { id: 'agricolas', nombre: 'Agrícolas sensibles (SAFP)', arancel: 20, iva: 5, capitulos: '02, 04, 10, 12, 15, 17', nota: 'Sistema Andino de Franjas de Precios: el arancel VARÍA cada quincena. Consulte la franja vigente antes de comprar.' },
  { id: 'medicamentos', nombre: 'Medicamentos y dispositivos médicos', arancel: 0, iva: 0, capitulos: '30, 90.18', nota: 'Muchos excluidos de IVA. Registro sanitario INVIMA obligatorio.' },
  { id: 'acero', nombre: 'Acero y productos siderúrgicos', arancel: 10, iva: 19, capitulos: '72, 73', nota: 'ATENCIÓN: Decreto 0264 de 2026 fijo arancel del 35% al acero originario de China, Rusia, India y Turquía.' },
  { id: 'llantas', nombre: 'Llantas y neumáticos', arancel: 15, iva: 19, capitulos: '40.11', nota: 'Reglamento técnico y etiquetado obligatorio.' },
  { id: 'vehiculos', nombre: 'Vehículos y motocicletas', arancel: 35, iva: 19, capitulos: '87', nota: 'Además del arancel: impuesto al consumo del 8% o 16% según cilindraje y valor.' },
  { id: 'otros', nombre: 'Otros / arancel a la medida', arancel: 10, iva: 19, capitulos: '—', nota: 'Escriba manualmente el arancel de su partida.' }
];

/* ---------------------------------------------------------------------------
   4. MODALIDADES DE TRANSPORTE
--------------------------------------------------------------------------- */
DATA.modalidades = [
  { id: 'courier', nombre: 'Courier / Tráfico postal', rango: 'Hasta 50 kg y USD 2.000 por envío', mejorPara: 'Muestras, repuestos urgentes, primeros pedidos de prueba, e-commerce.' },
  { id: 'aereo', nombre: 'Aéreo (carga general)', rango: 'Desde 45 kg tasables', mejorPara: 'Alto valor / bajo peso, moda de temporada, electrónica, urgencias.' },
  { id: 'lcl', nombre: 'Marítimo LCL (consolidado)', rango: '1 a 13 CBM aprox.', mejorPara: 'Volúmenes medianos sin llenar contenedor. El caballo de batalla del importador que arranca.' },
  { id: 'fcl20', nombre: 'Marítimo FCL 20 pies', rango: 'Hasta 28 CBM / 28 ton', mejorPara: 'Carga pesada y densa (ferretería, químicos, cerámica).' },
  { id: 'fcl40', nombre: 'Marítimo FCL 40 pies', rango: 'Hasta 58 CBM / 26 ton', mejorPara: 'Carga voluminosa y liviana (muebles, plásticos, empaques).' },
  { id: 'fcl40hc', nombre: 'Marítimo FCL 40 High Cube', rango: 'Hasta 68 CBM / 26 ton', mejorPara: 'Máximo volumen por dolar de flete. La mejor relación USD/CBM del mercado.' }
];

/* ---------------------------------------------------------------------------
   5. AGENCIAS DE ADUANAS Y OPERADORES LOGISTICOS
   Ranking referencial 2026 (La Nota Economica). Verifique SIEMPRE la
   habilitacion vigente en el RUT aduanero de la DIAN antes de contratar.
--------------------------------------------------------------------------- */
DATA.agencias = [
  { nombre: 'Agencia de Aduanas Siaco', nivel: 1, rank: 1, tipo: 'Agencia de aduanas', fuerte: 'Líder histórico del ranking nacional. Alto volumen de declaraciones y músculo operativo en todos los puertos.', perfil: 'Importador mediano y grande, operación recurrente.' },
  { nombre: 'Agencia de Aduanas ML', nivel: 1, rank: 2, tipo: 'Agencia de aduanas', fuerte: 'Segundo lugar sostenido. Muy fuerte en carga industrial y proyectos.', perfil: 'Manufactura, bienes de capital.' },
  { nombre: 'Agencia de Aduanas Hubemar', nivel: 1, rank: 3, tipo: 'Agencia de aduanas', fuerte: 'Mayor ascenso del ranking reciente. Servicio ágil y buena atención en Cartagena.', perfil: 'Importador que valora respuesta rápida.' },
  { nombre: 'Agencia de Aduanas DHL Express Colombia', nivel: 1, rank: 4, tipo: 'Courier + agencia', fuerte: 'Integración total courier-aduana. Imbatible en envíos pequeños y urgentes.', perfil: 'Muestras, e-commerce, repuestos.' },
  { nombre: 'Agencia de Aduanas DHL Global Forwarding', nivel: 1, rank: 4, tipo: 'Forwarder + agencia', fuerte: 'Red mundial propia: un solo interlocutor de fábrica a bodega.', perfil: 'Quien quiere puerta a puerta sin coordinar tres proveedores.' },
  { nombre: 'Agencia de Aduanas Agecoldex', nivel: 1, rank: 5, tipo: 'Agencia de aduanas', fuerte: 'Amplia cobertura nacional y experiencia en regímenes especiales.', perfil: 'Zonas francas, Plan Vallejo.' },
  { nombre: 'Agencia de Aduanas Aviatur', nivel: 1, rank: 6, tipo: 'Agencia de aduanas', fuerte: 'Respaldo de grupo empresarial grande. Solidez y cumplimiento.', perfil: 'Corporativo, carga aérea.' },
  { nombre: 'Agencia de Aduanas Profesional', nivel: 1, rank: 7, tipo: 'Agencia de aduanas', fuerte: 'Buen manejo de clasificación arancelaria compleja.', perfil: 'Productos de difícil clasificación.' },
  { nombre: 'Agencia de Aduanas Aduanimex', nivel: 1, rank: 8, tipo: 'Agencia de aduanas', fuerte: 'Trayectoria larga, tarifas competitivas.', perfil: 'PYME importadora.' },
  { nombre: 'Agencia de Aduanas Roldan', nivel: 1, rank: 9, tipo: 'Operador logístico integral', fuerte: 'Ofrece aduana + almacenamiento + distribución nacional en un solo contrato.', perfil: 'Quien necesita la cadena completa hasta el cliente final.' },
  { nombre: 'Agencia de Aduanas Siacomex', nivel: 1, rank: 10, tipo: 'Agencia de aduanas', fuerte: 'Presencia fuerte en Buenaventura.', perfil: 'Importación desde Asia.' },
  { nombre: 'Agencia de Aduanas TCC', nivel: 1, rank: 11, tipo: 'Operador logístico integral', fuerte: 'Se apalanca en la red de distribución nacional de TCC.', perfil: 'Distribución capilar a muchas ciudades.' },
  { nombre: 'Agencia de Aduanas ABC Repecev', nivel: 1, rank: 12, tipo: 'Agencia de aduanas', fuerte: 'Certificada OEA. Más de 450 colaboradores y 11 oficinas en puertos y fronteras.', perfil: 'Operaciones que necesitan beneficios OEA y cobertura fronteriza.' },
  { nombre: 'Aduanas Gama', nivel: 1, rank: null, tipo: 'Agencia de aduanas', fuerte: 'Más de 40 años en el mercado. Perfil de servicio cercano.', perfil: 'Importador que quiere trato personalizado.' },
  { nombre: 'Colombiana de Aduanas', nivel: 1, rank: null, tipo: 'Agencia de aduanas', fuerte: 'Más de 30 años de experiencia sectorial.', perfil: 'Operación tradicional establecida.' },
  { nombre: 'Kuehne + Nagel Colombia', nivel: 1, rank: null, tipo: 'Forwarder global', fuerte: 'Tarifas de flete muy competitivas por volumen global, sobre todo marítimo.', perfil: 'Volumen alto y recurrente.' },
  { nombre: 'DSV Colombia', nivel: 1, rank: null, tipo: 'Forwarder global', fuerte: 'Red global tras la integración con Panalpina y Schenker.', perfil: 'Corporativo multinacional.' },
  { nombre: 'Blu Logistics Colombia', nivel: null, rank: null, tipo: 'Forwarder regional', fuerte: 'Origen colombiano con red propia en Latinoamérica y Asia. Buena consolidación LCL.', perfil: 'PYME que importa LCL desde China.' },
  { nombre: 'Open Market / Aeronet', nivel: null, rank: null, tipo: 'Forwarder', fuerte: 'Consolidados frecuentes desde Miami y Asia.', perfil: 'Carga suelta recurrente.' },
  { nombre: 'Almaviva / Almagran', nivel: null, rank: null, tipo: 'Depósito y logística', fuerte: 'Depósitos aduaneros propios: útil para diferir nacionalización y pagar tributos por partes.', perfil: 'Quien necesita financiar el flujo de caja tributario.' }
];

DATA.criteriosAgencia = [
  { titulo: 'Nivel de la agencia', detalle: 'Nivel 1 es el más alto: mayor patrimonio exigido, puede actuar en todo el territorio y en todos los regímenes. Nivel 2 y 3 tienen limitaciones de cobertura y de valor. Para operación seria, exija Nivel 1.' },
  { titulo: 'Certificación OEA', detalle: 'Operador Económico Autorizado. Se traduce en menos inspecciones físicas, levantes más rápidos y prioridad en puerto. Ahorra días de almacenaje reales.' },
  { titulo: 'Póliza de cumplimiento vigente', detalle: 'Pida copia. Es lo que responde si la agencia comete un error que le genera una sanción.' },
  { titulo: 'Responsabilidad solidaria', detalle: 'La agencia responde solidariamente por los tributos aduaneros. Una agencia informal lo deja expuesto a usted.' },
  { titulo: 'Especialidad en su producto', detalle: 'Un buen agente en maquinaria puede ser pésimo en alimentos. Pregunte por referencias de SU capítulo arancelario.' },
  { titulo: 'Cobertura en su puerto', detalle: 'Que tenga oficina propia (no corresponsal) donde llega su carga. La diferencia se nota en el tiempo de levante.' },
  { titulo: 'Estructura de tarifa clara', detalle: 'Exija el desglose: honorarios de agenciamiento, gastos operativos, manejo documental y reembolsables. Muchas sorpresas viven en el rubro "otros gastos".' },
  { titulo: 'Verificación en la DIAN', detalle: 'Consulte el RUT aduanero en el portal de la DIAN y confirme que la habilitación está vigente y no suspendida.' }
];

DATA.senalesAlerta = [
  'Le ofrece "nacionalizar barato" o bajar el valor declarado en factura: es contrabando técnico y la responsabilidad penal es suya.',
  'No le entrega la Declaración de Importación original con su NIT como importador.',
  'Cobra una tarifa única "todo incluido" sin desglose y sin factura de los reembolsables.',
  'No firma mandato aduanero escrito.',
  'No aparece habilitada, o aparece suspendida, en el registro de la DIAN.',
  'Le pide pagar los tributos a una cuenta personal y no directamente al recaudo de la DIAN.',
  'Presiona para clasificar en una partida distinta a la técnica solo para pagar menos arancel.'
];

/* ---------------------------------------------------------------------------
   6. PROCESO DE IMPORTACION — paso a paso
--------------------------------------------------------------------------- */
DATA.pasosImportacion = [
  {
    n: 1, titulo: 'Habilítese como importador', cuando: 'Una sola vez, antes de todo', dias: '1 a 5 días',
    acciones: [
      'RUT ante la DIAN con la actividad de importador (responsabilidad 22 — Obligado a inscribirse como importador).',
      'Firma electrónica de la DIAN para el portal MUISCA.',
      'Registro mercantil vigente en la Cámara de Comercio.',
      'Cuenta bancaria en un Intermediario del Mercado Cambiario (IMC) para canalizar el giro al exterior.'
    ],
    tip: 'Como persona natural también puede importar, pero si va a vender la mercancía necesita estar registrado como responsable de IVA para poder descontar el IVA pagado en la nacionalización. Ese IVA es el rubro más grande del costo: no lo pierda.'
  },
  {
    n: 2, titulo: 'Clasifique la mercancía (partida arancelaria)', cuando: 'ANTES de cerrar la compra', dias: '1 a 3 días',
    acciones: [
      'Determine la subpartida a 10 digitos en el Arancel de Aduanas.',
      'Verifique arancel, IVA y si hay antidumping o salvaguardia vigente.',
      'Identifique vistos buenos obligatorios (INVIMA, ICA, ANLA, MinMinas, INDUMIL, SIC).',
      'Si hay duda, solicite Resolución Anticipada de Clasificación Arancelaria a la DIAN.'
    ],
    tip: 'Este es el paso que más dinero mueve. Una diferencia de partida entre 5% y 15% de arancel sobre un contenedor de USD 40.000 son casi USD 4.000. Nunca deje que el proveedor extranjero le diga la partida colombiana.'
  },
  {
    n: 3, titulo: 'Registro o licencia de importación en la VUCE', cuando: 'ANTES del embarque', dias: '1 a 15 días',
    acciones: [
      'Libre importación sin registro: la mayoría de bienes. No requiere trámite previo.',
      'Libre importación CON registro: cuando la subpartida exige visto bueno de una entidad.',
      'Licencia previa: bienes usados, remanufacturados, donaciones y regímenes especiales.'
    ],
    tip: 'Si su producto necesita visto bueno y la carga ya salio del origen, va a pagar almacenaje mientras tramita. Resuelva la VUCE antes de que el proveedor embarque.'
  },
  {
    n: 4, titulo: 'Negocie el Incoterm correcto', cuando: 'En la orden de compra', dias: '—',
    acciones: [
      'FOB: usted controla flete y seguro. Es la opción que más plata ahorra si tiene un buen forwarder.',
      'EXW: usted asume todo desde la fábrica. Solo si domina la logística del origen.',
      'CIF: comodo pero el proveedor le carga un margen sobre el flete y además ese flete entra a la base gravable.',
      'DDP: el proveedor nacionaliza. Comodo, opaco y casi siempre el más caro. Además usted pierde el soporte del IVA descontable.'
    ],
    tip: 'Regla práctica: compre FOB y contrate usted el flete. En un contenedor típico eso baja el costo total entre 5% y 12%.'
  },
  {
    n: 5, titulo: 'Contrate transporte y seguro', cuando: '2 a 4 semanas antes del embarque', dias: '1 a 5 días',
    acciones: [
      'Cotice mínimo con tres forwarders y compare TODO incluido, no solo el flete base.',
      'Negocie días libres de demurrage y detention (pida 14 o 21 días, no acepte 7).',
      'Contrate póliza de transporte internacional. Una póliza propia cuesta entre 0,15% y 0,45% del CIF; la del forwarder suele ser más cara.'
    ],
    tip: 'El seguro no es opcional en la práctica: la DIAN presume un valor de seguro para liquidar tributos aunque usted no lo contrate. Si igual lo van a cobrar en la base, contrátelo de verdad.'
  },
  {
    n: 6, titulo: 'Documentos de embarque', cuando: 'Al embarcar', dias: '—',
    acciones: [
      'Factura comercial (con Incoterm, valor unitario y condiciones de pago).',
      'Lista de empaque (packing list) con pesos y dimensiones reales.',
      'Documento de transporte: BL marítimo, AWB aéreo o CRT terrestre.',
      'Certificado de origen si hay acuerdo comercial. SIN ESTE DOCUMENTO NO HAY ARANCEL PREFERENCIAL.',
      'Certificados sanitarios o de conformidad según el producto.'
    ],
    tip: 'Revise el borrador del BL antes de que la naviera lo emita. Corregir un BL emitido cuesta entre USD 50 y 150 y puede retrasar el levante varios días.'
  },
  {
    n: 7, titulo: 'Declaración anticipada', cuando: 'Hasta 15 días antes de la llegada', dias: '1 día',
    acciones: [
      'Su agencia presenta la Declaración de Importación antes de que llegue la nave.',
      'Es obligatoria en varios casos y muy recomendable en todos.',
      'Pague los tributos en el banco autorizado.'
    ],
    tip: 'Declarar anticipadamente le puede ahorrar entre 3 y 7 días de almacenaje. Con almacenaje de USD 30 diarios son entre USD 90 y 210 por contenedor, y evita el riesgo de caer en abandono.'
  },
  {
    n: 8, titulo: 'Llegada, inspección y levante', cuando: 'A la llegada', dias: '1 a 8 días',
    acciones: [
      'Aviso de llegada y descargue al depósito habilitado.',
      'Selección automática del canal: levante automático, inspección documental o inspección física.',
      'La DIAN autoriza el levante.',
      'Retire la carga antes de que se agoten los días libres.'
    ],
    tip: 'Ser OEA o trabajar con agencia OEA reduce mucho la probabilidad de inspección física. Una inspección física agrega entre 2 y 5 días y entre USD 150 y 400 en costos de movilización.'
  },
  {
    n: 9, titulo: 'Transporte interno y cierre', cuando: 'Post levante', dias: '1 a 4 días',
    acciones: [
      'Traslado a su bodega. Devuelva el contenedor vacio dentro del plazo o pagara detention.',
      'Declaración de cambio por importación (Formulario 1) al girar al exterior.',
      'Archive el expediente completo: la DIAN puede revisar hasta 3 años después.',
      'Descuente el IVA pagado en su declaración bimestral o cuatrimestral.'
    ],
    tip: 'Guarde TODO: declaración, BL, factura, mandato, pagos. En una fiscalización, el expediente incompleto se traduce en desconocimiento del costo y del IVA descontable.'
  }
];

/* ---------------------------------------------------------------------------
   7. PROCESO DE EXPORTACION — paso a paso
--------------------------------------------------------------------------- */
DATA.pasosExportacion = [
  {
    n: 1, titulo: 'Habilítese como exportador', cuando: 'Una sola vez', dias: '1 a 5 días',
    acciones: [
      'RUT con la actividad de exportador inscrita ante la DIAN.',
      'Firma electrónica para MUISCA.',
      'Registro en la VUCE (Ventanilla Única de Comercio Exterior) del MinCIT.',
      'Cuenta en un IMC para el reintegro obligatorio de divisas.'
    ],
    tip: 'Regístrese también en ProColombia: la asesoría, los estudios de mercado y las agendas comerciales son gratuitos y están hechos para su perfil profesional.'
  },
  {
    n: 2, titulo: 'Estudie el mercado y la posición arancelaria de destino', cuando: 'Antes de cotizar', dias: '3 a 15 días',
    acciones: [
      'Determine la partida en el arancel del país destino, no en el colombiano.',
      'Verifique el arancel que pagara su comprador y si un TLC lo lleva a 0%.',
      'Revise requisitos NO arancelarios: FDA para alimentos en EE.UU., certificaciones sanitarias en la UE, etiquetado.',
      'Calcule el precio de exportación partiendo del precio meta en el mercado destino, no de su costo.'
    ],
    tip: 'El arancel preferencial es su ventaja competitiva vendible. Si su producto entra a EE.UU. al 0% por el TLC y el de un competidor asiático paga 15%, eso es margen que usted puede capturar o usar para ganar el negocio.'
  },
  {
    n: 3, titulo: 'Certificado de origen', cuando: 'Antes del embarque', dias: '1 a 5 días',
    acciones: [
      'Registre el productor y diligencie la Declaración Juramentada de Origen en la VUCE (vigencia de 2 años).',
      'Solicite el certificado de origen para cada embarque.',
      'Para la Unión Europea: sistema de exportador registrado (REX), la declaración va en la factura.'
    ],
    tip: 'La Declaración Juramentada de Origen se hace una vez por producto y sirve dos años. Hágala apenas tenga el producto definido, no cuando ya tenga el pedido encima.'
  },
  {
    n: 4, titulo: 'Vistos buenos sectoriales', cuando: 'Antes del embarque', dias: '2 a 20 días',
    acciones: [
      'ICA: productos agropecuarios, certificado fitosanitario o zoosanitario.',
      'INVIMA: alimentos procesados, cosméticos, medicamentos, dispositivos médicos.',
      'ANLA / MinAmbiente: fauna, flora, especies CITES.',
      'MinCultura: bienes de interes cultural.'
    ],
    tip: 'El certificado fitosanitario del ICA tiene vigencia corta y debe coincidir exactamente con el lote embarcado. Coordine la inspección con la fecha real de cargue.'
  },
  {
    n: 5, titulo: 'Solicitud de Autorización de Embarque (SAE)', cuando: 'Antes de ingresar a zona primaria', dias: '1 día',
    acciones: [
      'Se presenta en MUISCA-DIAN, directamente o a través de agencia de aduanas.',
      'La DIAN asigna canal: automático o con inspección.',
      'Autorizado el embarque, la mercancía ingresa a zona primaria y se carga.'
    ],
    tip: 'Para envíos de valor FOB inferior a USD 10.000 puede presentar la SAE usted mismo sin agencia de aduanas. Por encima de ese monto necesita agencia.'
  },
  {
    n: 6, titulo: 'Declaración de Exportación (DEX)', cuando: 'Después del embarque', dias: '1 a 2 días',
    acciones: [
      'La SAE se convierte en DEX (Formulario 600) una vez certificado el embarque por el transportador.',
      'Plazo: dentro del mes siguiente al embarque.',
      'La aprobación suele tardar entre 24 y 48 horas hábiles.'
    ],
    tip: 'El DEX es su soporte para tres cosas: que la venta está exenta de IVA, la devolución del IVA pagado en insumos, y el reintegro de divisas. Sin DEX no hay beneficio tributario.'
  },
  {
    n: 7, titulo: 'Cobro y reintegro de divisas', cuando: 'Según lo pactado', dias: '—',
    acciones: [
      'Canalice el pago obligatoriamente por un IMC.',
      'Diligencie la Declaración de Cambio por exportaciones (Formulario 2).',
      'Instrumentos de pago: carta de crédito (más seguro), cobranza documentaria, transferencia anticipada.',
      'Considere un seguro de crédito a la exportación si vende a plazo.'
    ],
    tip: 'Con un comprador nuevo, exija carta de crédito confirmada o al menos 30% de anticipo. El costo de la carta de crédito (entre 0,5% y 1,5%) es barato frente a perder el embarque completo.'
  },
  {
    n: 8, titulo: 'Aproveche los beneficios del exportador', cuando: 'Permanente', dias: '—',
    acciones: [
      'Exportaciones exentas de IVA: usted tiene derecho a la DEVOLUCIÓN del IVA de sus insumos.',
      'Plan Vallejo: importe materias primas e insumos sin arancel ni IVA si los transforma para exportar.',
      'Zonas Francas: tarifa de renta preferencial y arancel 0 en insumos.',
      'Bancóldex: líneas de crédito de capital de trabajo y modernización para exportadores.',
      'ProColombia: agendas comerciales, ferias y estudios de mercado sin costo.'
    ],
    tip: 'El Plan Vallejo es el beneficio más subutilizado del país. Si usted importa insumos para transformar y reexportar, deja de pagar arancel e IVA en la entrada. En operaciones de manufactura eso puede ser entre 20% y 30% del costo del insumo liberado.'
  }
];

/* ---------------------------------------------------------------------------
   8. CUANDO — calendario y ventanas de decision
--------------------------------------------------------------------------- */
DATA.calendario = [
  { mes: 'Enero', tipo: 'alerta', titulo: 'Pre Año Nuevo Chino', detalle: 'Las fábricas chinas corren a despachar antes del feriado y los fletes suben. Si no ordeno en noviembre, ya va tarde para el primer trimestre.' },
  { mes: 'Feb', tipo: 'alerta', titulo: 'Año Nuevo Chino', detalle: 'Fábricas cerradas entre 2 y 4 semanas y reactivación lenta. No programe llegadas criticas entre febrero y mediados de marzo desde Asia.' },
  { mes: 'Mar', tipo: 'bueno', titulo: 'Mejor ventana de fletes', detalle: 'Temporada baja marítima. Los mejores precios FCL del año suelen estar entre marzo y mayo. Es el momento para negociar contrato anual con la naviera.' },
  { mes: 'Abr', tipo: 'bueno', titulo: 'Temporada baja', detalle: 'Buena disponibilidad de espacio y equipos. Ideal para importar inventario de rotación lenta.' },
  { mes: 'May', tipo: 'bueno', titulo: 'Última ventana barata', detalle: 'Último mes de tarifas bajas antes de que empiece a apretar la temporada alta.' },
  { mes: 'Jun', tipo: 'neutro', titulo: 'Inicio de alza', detalle: 'Comienzan los anuncios de GRI (incremento general de tarifas). Cierre ahora lo que llegue en el segundo semestre.' },
  { mes: 'Jul', tipo: 'alerta', titulo: 'Arranca temporada alta', detalle: 'Sube la demanda global de espacio hacia Navidad. Reserve con 4 a 6 semanas de anticipación.' },
  { mes: 'Ago', tipo: 'alerta', titulo: 'Pico de temporada alta', detalle: 'Los fletes desde Asia pueden estar entre 30% y 80% por encima de la temporada baja. Último momento razonable para carga de Navidad por vía marítima.' },
  { mes: 'Sep', tipo: 'alerta', titulo: 'Congestión portuaria', detalle: 'Alta ocupación en Buenaventura y Cartagena. Sume días de colchón a su planeación.' },
  { mes: 'Oct', tipo: 'alerta', titulo: 'Golden Week China', detalle: 'Primera semana de octubre: China para. Además, lo que se embarque en octubre desde Asia ya no alcanza a llegar para Navidad.' },
  { mes: 'Nov', tipo: 'clave', titulo: 'Momento de ordenar el Q1', detalle: 'Ordene ahora lo que necesite en enero, febrero y marzo, antes del cierre por Año Nuevo Chino. Este es el mes de decisión más importante del año para quien importa de Asia.' },
  { mes: 'Dic', tipo: 'neutro', titulo: 'Cierre fiscal', detalle: 'Considere el efecto en su inventario a 31 de diciembre y en la declaración de renta. Los puertos operan con menos personal entre el 20 de diciembre y el 5 de enero.' }
];

DATA.reglaTiempo = [
  { concepto: 'Lead time total desde China (marítimo)', valor: '55 a 80 días', detalle: 'Producción (25-40) + tránsito (30-42) + nacionalización (3-8) + interno (1-3).' },
  { concepto: 'Lead time total desde EE.UU. (marítimo)', valor: '25 a 40 días', detalle: 'Producción o alistamiento (10-20) + tránsito (6-12) + nacionalización (3-8).' },
  { concepto: 'Lead time aéreo desde Asia', valor: '12 a 20 días', detalle: 'Alistamiento + tránsito (6-10) + nacionalización (2-4).' },
  { concepto: 'Courier puerta a puerta', valor: '5 a 12 días', detalle: 'La opción más rápida. La más cara por kilo.' },
  { concepto: 'Días libres de almacenaje en puerto', valor: '5 días hábiles típicos', detalle: 'Después corre almacenaje diario. Negocie más días libres en el contrato de flete.' },
  { concepto: 'Permanencia máxima en depósito', valor: '1 mes prorrogable', detalle: 'Vencido el término sin declarar, la mercancía cae en ABANDONO a favor de la Nación.' },
  { concepto: 'Plazo para presentar el DEX tras embarque', valor: 'Dentro del mes siguiente', detalle: 'Aplica a exportaciones.' },
  { concepto: 'Término de fiscalización de la DIAN', valor: '3 años', detalle: 'Conserve el expediente completo de cada operación durante ese periodo.' }
];

/* ---------------------------------------------------------------------------
   9. ESTRATEGIAS PARA BAJAR EL COSTO
--------------------------------------------------------------------------- */
DATA.estrategias = [
  { titulo: 'Compre en origen con TLC', ahorro: '5% a 20% del CIF', detalle: 'Antes de cerrar con China, cotice el mismo producto en México, Perú, Corea o EE.UU. Un arancel de 15% eliminado compensa un precio FOB hasta 15% más alto. Compare el DESEMBARCADO, no el precio de fábrica.', dificultad: 'Media' },
  { titulo: 'Exija el certificado de origen', ahorro: 'Hasta el 100% del arancel', detalle: 'El error más caro y más común: comprar en un país con TLC y no pedir el certificado de origen. Sin el papel, usted paga arancel pleno aunque el acuerdo exista. Póngalo como condición de pago en la orden de compra.', dificultad: 'Baja' },
  { titulo: 'Pase de LCL a FCL', ahorro: '30% a 50% del flete', detalle: 'El punto de equilibrio está alrededor de 13-15 CBM. Por encima de eso, un contenedor de 20 pies casi siempre sale más barato por metro cúbico que el consolidado. Y un 40 High Cube tiene el mejor costo por CBM del mercado.', dificultad: 'Baja' },
  { titulo: 'Consolide varios proveedores', ahorro: '20% a 40% del flete', detalle: 'Si compra a tres fábricas chinas de la misma región, su forwarder puede consolidarlas en un solo contenedor. Paga un cargo de consolidación en origen (entre USD 150 y 400) y ahorra dos fletes completos.', dificultad: 'Media' },
  { titulo: 'Negocie FOB, no CIF ni DDP', ahorro: '5% a 12% del total', detalle: 'Cuando el proveedor cotiza CIF, le está cargando un margen sobre el flete. Peor aún: ese flete inflado entra en la base gravable, así que usted paga arancel e IVA sobre el sobreprecio del proveedor.', dificultad: 'Baja' },
  { titulo: 'Declaración anticipada', ahorro: 'USD 100 a 400 por contenedor', detalle: 'Presentar la declaración antes de que llegue el buque elimina días de almacenaje y reduce el riesgo de abandono. Cuesta lo mismo y se hace con la documentación que ya tiene.', dificultad: 'Baja' },
  { titulo: 'Clasificación arancelaria correcta', ahorro: '5% a 15% del CIF', detalle: 'Muchos importadores pagan de más por clasificar en una partida genérica. Un estudio de clasificación cuesta entre USD 80 y 250 y se paga solo en el primer embarque. Si hay duda, pida Resolución Anticipada a la DIAN: le da certeza jurídica.', dificultad: 'Media' },
  { titulo: 'Plan Vallejo', ahorro: '20% a 30% del insumo', detalle: 'Si usted transforma insumos importados y luego exporta, el Plan Vallejo le permite importar esos insumos sin arancel y sin IVA. Es el beneficio más potente y más subutilizado para el manufacturero exportador.', dificultad: 'Alta' },
  { titulo: 'Zona Franca o depósito aduanero', ahorro: 'Flujo de caja', detalle: 'Ingrese la mercancía y nacionalice por partes a medida que vende. No baja el tributo total, pero libera capital de trabajo. Con un contenedor de USD 50.000, el IVA solo son cerca de USD 11.000 congelados.', dificultad: 'Media' },
  { titulo: 'Certifíquese como OEA o UAP', ahorro: 'Días y costos indirectos', detalle: 'Operador Económico Autorizado: menos inspecciones físicas, levante prioritario, posibilidad de pago consolidado. Para quien importa más de 10 contenedores al año, el retorno es claro.', dificultad: 'Alta' },
  { titulo: 'Negocie días libres de demurrage', ahorro: 'USD 500 a 3.000 por incidente', detalle: 'El demurrage corre entre USD 60 y 150 por día por contenedor después de los días libres. Pida 14 o 21 días libres al momento de contratar el flete, cuando todavia tiene poder de negociacion.', dificultad: 'Baja' },
  { titulo: 'Elija bien el puerto de entrada', ahorro: 'USD 200 a 800 por contenedor', detalle: 'No siempre gana el puerto con flete marítimo más barato. Sume el flete terrestre interno: para Bogotá y Medellín, Cartagena suele ganar; para Cali y el suroccidente, Buenaventura.', dificultad: 'Baja' },
  { titulo: 'Póliza de transporte propia', ahorro: '0,1% a 0,3% del CIF', detalle: 'Una póliza abierta anual con una aseguradora local es más barata que asegurar cada embarque con el forwarder, y le da mejor cobertura y respuesta local en un siniestro.', dificultad: 'Baja' },
  { titulo: 'Importe en temporada baja', ahorro: '20% a 40% del flete', detalle: 'Entre marzo y mayo los fletes desde Asia están en su punto más bajo. Si su producto no es perecedero ni de moda, adelantar la compra es rentabilidad pura.', dificultad: 'Baja' },
  { titulo: 'No pierda el IVA descontable', ahorro: '19% del CIF + arancel', detalle: 'Si usted es responsable de IVA, el IVA de la nacionalización es descontable: no es costo, es un anticipo. Importar a nombre de un tercero o comprar DDP le puede hacer perder ese derecho. Es el error más caro de todos.', dificultad: 'Baja' }
];

/* ---------------------------------------------------------------------------
   10. PARAMETROS TRIBUTARIOS Y OPERATIVOS POR DEFECTO
--------------------------------------------------------------------------- */
DATA.parametros = {
  ivaGeneral: 19,
  seguroPresuntoPct: 0.5,        // % sobre FOB si no se declara seguro real
  agenciamientoPct: 0.6,          // % sobre valor CIF
  agenciamientoMinUsd: 180,       // honorario minimo tipico
  agenciamientoMaxUsd: 900,       // tope tipico negociado
  gastosBancariosPct: 0.5,        // giro al exterior
  gmfPct: 0.4,                    // 4x1000
  inspeccionUsd: [150, 400],
  demurrageDia: [60, 150],
  courierArancelUnico: 10,        // % arancel unico modalidad courier
  courierUmbralFob: 200,          // USD - por debajo no paga arancel ni IVA
  courierTopeFob: 2000,           // USD - tope por envio en la modalidad
  dexUmbralAgencia: 10000,        // USD FOB - por encima requiere agencia de aduanas
  davUmbralFob: 5000              // USD FOB - por encima requiere Declaracion Andina del Valor
};

DATA.ciudades = [
  { id: 'bogota', nombre: 'Bogotá' },
  { id: 'medellin', nombre: 'Medellín' },
  { id: 'cali', nombre: 'Cali' },
  { id: 'barranquilla', nombre: 'Barranquilla' },
  { id: 'bucaramanga', nombre: 'Bucaramanga' }
];

DATA.fuentes = [
  { nombre: 'DIAN — Arancel de aduanas y consulta de subpartidas', url: 'https://www.dian.gov.co' },
  { nombre: 'VUCE — Ventanilla Única de Comercio Exterior', url: 'https://www.vuce.gov.co' },
  { nombre: 'MinCIT — Ministerio de Comercio, Industria y Turismo', url: 'https://www.mincit.gov.co' },
  { nombre: 'ProColombia — Apoyo al exportador', url: 'https://procolombia.co' },
  { nombre: 'DIAN — Tráfico postal y envíos urgentes', url: 'https://www.dian.gov.co/Viajeros-y-Servicios-aduaneros/Paginas/Modalidad-de-trafico-postal-y-envios-urgentes.aspx' },
  { nombre: 'Puerto de Cartagena — Tarifas reguladas', url: 'https://www.puertocartagena.com' },
  { nombre: 'APM Terminals Buenaventura — Tarifas', url: 'https://www.apmterminals.com/es/buenaventura/practical-information/tariffs' },
  { nombre: 'Bancóldex — Financiación para comercio exterior', url: 'https://www.bancoldex.com' },
  { nombre: 'La Nota Económica — Ranking de agencias de aduanas', url: 'https://lanota.com' }
];
