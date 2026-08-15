# ImportaCol

Aplicación web para planear operaciones de comercio exterior en Colombia: calcula el costo
real de nacionalizar una importación, compara alternativas de transporte y de país de origen,
y documenta el proceso completo de importación y exportación con los plazos reales de cada etapa.

Está pensada para alguien que negocia de verdad: el objetivo no es explicar qué es un Incoterm,
sino darle el número que necesita para sentarse a negociar con un proveedor o con una agencia
de aduanas.

## Qué resuelve

**Simulador de costo desembarcado.** Toma el valor FOB, el peso, el volumen, el origen y la
partida arancelaria, y devuelve el desglose completo hasta la bodega: valor en aduana (CIF),
arancel, IVA, gastos portuarios, almacenaje, agenciamiento, transporte interno, gastos bancarios
y GMF. Separa el *desembolso de caja* del *costo real*, porque para un responsable de IVA la
nacionalización no es costo sino anticipo — distinción que cambia por completo el margen.

**Comparador de modalidades.** Corre el mismo embarque por courier, aéreo, consolidado marítimo
(LCL) y contenedor completo de 20, 40 y 40 High Cube, y los ordena de más barato a más caro.
Calcula el punto de equilibrio real entre LCL y FCL para la ruta consultada, comparando costo
desembarcado total y no solamente el flete.

**Comparador de orígenes.** El mismo producto traído desde doce orígenes distintos, aplicando
el arancel preferencial cuando existe acuerdo comercial. Deriva el dato que sirve en la mesa
de negociación: cuánto más caro puede cotizar un proveedor en un país con TLC y aun así
convenir frente a uno sin acuerdo.

**Guías de proceso.** Importación y exportación paso a paso, con lo que hay que hacer, cuándo,
cuánto tarda y dónde está la trampa en cada etapa.

**Calculadora de precio de exportación.** Construye EXW, FCA, FOB, CFR y CIF a partir del costo
de producción, para cotizar sin dejar rubros por fuera.

**Calendario.** Las ventanas de compra y embarque del año: Año Nuevo Chino, Golden Week,
temporada alta de fletes, cierre fiscal y los plazos legales que no se pueden pasar por alto
(especialmente el término de permanencia en depósito, vencido el cual la mercancía cae en
abandono a favor de la Nación).

**Directorio de agencias de aduana.** Ranking sectorial, criterios de selección, señales de
alerta y la estructura de rubros que debe exigirse en toda cotización de agenciamiento.

## Cómo usarla

No requiere instalación ni servidor. Abra `index.html` en cualquier navegador.

Para servirla localmente:

```bash
npx http-server . -p 8080
```

Para publicarla, cualquier hosting estático sirve (GitHub Pages, Netlify, Vercel): son archivos
estáticos sin dependencias ni proceso de build.

## Estructura

```
index.html              Estructura de las ocho vistas
assets/css/styles.css   Estilos, con tema claro y oscuro
assets/js/data.js       Datos de referencia: orígenes, fletes, puertos, aranceles,
                        agencias, calendario, estrategias de ahorro
assets/js/calculadora.js Motor de cálculo, sin dependencias del DOM
assets/js/app.js        Interfaz: formularios, tablas y render de resultados
```

`calculadora.js` no toca el DOM, así que puede ejecutarse en Node para pruebas o para
generar reportes por lote.

## Modelo de cálculo

La estructura tributaria aduanera colombiana que implementa el motor:

```
Valor en aduana (CIF) = FOB + flete internacional + seguro
Arancel               = CIF × %arancel
Base gravable de IVA  = CIF + arancel
IVA                   = base gravable × %IVA
```

Los gastos locales (terminal, almacenaje, agenciamiento, transporte interno, gastos bancarios,
GMF) **no** integran la base gravable, pero sí el costo de la operación, y por eso se presentan
en un bloque aparte.

Casos particulares que el motor contempla:

- **Modalidad courier.** Umbral de USD 200 FOB por debajo del cual no hay arancel ni IVA, y
  arancel único del 10% por encima, en reemplazo del arancel de la partida.
- **Preferencias arancelarias.** Cuando el origen tiene acuerdo comercial vigente, el arancel
  baja a 0% únicamente si se marca la casilla correspondiente, que representa contar con el
  certificado de origen. Si no se marca, la aplicación advierte cuánto dinero se está dejando
  sobre la mesa.
- **Peso tasable aéreo.** Se cobra el mayor entre peso real y peso volumétrico (m³ × 167 kg).
- **Consolidado marítimo.** Se factura por W/M, el mayor entre metros cúbicos y toneladas.
- **Contenedores.** Se calcula cuántas unidades se requieren por volumen y por peso, y se
  advierte cuando la ocupación queda por debajo del 65%.

## Ajustar los datos

Todas las tarifas viven en `assets/js/data.js` como rangos `[mínimo, máximo]` en dólares.
El selector de escenario de la interfaz elige el extremo bajo, el promedio o el extremo alto.

Cuando tenga cotizaciones en firme de su forwarder o de su agencia, reemplace los rangos por
los suyos: la herramienta pasa de estimar a presupuestar con sus propios números. También puede
introducir un flete cotizado directamente en el campo correspondiente de parámetros avanzados,
sin tocar el código.

## Advertencia

Las cifras son **rangos referenciales de mercado a 2026** y sirven para presupuestar y comparar
alternativas. No constituyen una cotización en firme ni asesoría legal o tributaria.

Antes de cerrar cualquier operación, confirme la subpartida arancelaria, los vistos buenos
exigibles y las tarifas vigentes con la DIAN, la VUCE y su agencia de aduanas. Los aranceles
del Sistema Andino de Franjas de Precios cambian cada quincena, y las medidas de defensa
comercial (antidumping y salvaguardias) se actualizan por decreto.

## Fuentes

- [DIAN](https://www.dian.gov.co) — Arancel de aduanas, consulta de subpartidas, MUISCA
- [VUCE](https://www.vuce.gov.co) — Ventanilla Única de Comercio Exterior
- [MinCIT](https://www.mincit.gov.co) — Ministerio de Comercio, Industria y Turismo
- [ProColombia](https://procolombia.co) — Apoyo al exportador
- [Puerto de Cartagena](https://www.puertocartagena.com) y [APM Terminals Buenaventura](https://www.apmterminals.com/es/buenaventura/practical-information/tariffs) — Tarifas portuarias
- [Bancóldex](https://www.bancoldex.com) — Financiación para comercio exterior
