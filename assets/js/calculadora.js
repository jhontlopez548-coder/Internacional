/* ============================================================================
   MOTOR DE CALCULO — Costo desembarcado de importacion a Colombia
   ----------------------------------------------------------------------------
   Estructura tributaria colombiana:
     Valor en Aduana (CIF) = FOB + Flete internacional + Seguro
     Arancel               = CIF x %arancel
     Base IVA              = CIF + Arancel
     IVA                   = Base IVA x %IVA
   Los gastos locales (puerto, agenciamiento, transporte interno) NO hacen
   parte de la base gravable, pero SI del costo real de la operacion.
   ========================================================================== */

const CALC = (function () {

  const P = DATA.parametros;

  /* --- utilidades --- */
  const mid = (r) => (r[0] + r[1]) / 2;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const num = (v, def = 0) => {
    const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
    return isNaN(n) ? def : n;
  };

  function getOrigen(id) { return DATA.origenes.find(o => o.id === id); }
  function getPuerto(id) { return DATA.puertos.find(p => p.id === id); }
  function getCategoria(id) { return DATA.categorias.find(c => c.id === id); }

  /* ------------------------------------------------------------------
     Peso tasable aereo: se cobra el mayor entre peso real y peso
     volumetrico (m3 x 167 kg, equivalente al divisor 6000 en cm).
  ------------------------------------------------------------------ */
  function pesoTasable(pesoKg, volumenCbm) {
    return Math.max(pesoKg, volumenCbm * 167);
  }

  /* ------------------------------------------------------------------
     Capacidad util real de cada tipo de contenedor
  ------------------------------------------------------------------ */
  const CAPACIDAD = {
    fcl20:   { cbm: 28,  ton: 28 },
    fcl40:   { cbm: 58,  ton: 26 },
    fcl40hc: { cbm: 68,  ton: 26 }
  };

  /* ------------------------------------------------------------------
     Estimacion de flete internacional para una modalidad dada.
     escenario: 'bajo' | 'medio' | 'alto'
     Devuelve { flete, detalle, viable, unidades }
  ------------------------------------------------------------------ */
  function estimarFlete(modalidad, origen, pesoKg, volumenCbm, escenario) {
    const pick = (rango) => {
      if (escenario === 'bajo') return rango[0];
      if (escenario === 'alto') return rango[1];
      return mid(rango);
    };

    switch (modalidad) {

      case 'courier': {
        const tarifa = pick(origen.courierKg);
        const tasable = pesoTasable(pesoKg, volumenCbm);
        return {
          flete: tasable * tarifa,
          unidades: `${tasable.toFixed(1)} kg tasables x USD ${tarifa.toFixed(2)}/kg`,
          viable: pesoKg <= 50,
          motivo: pesoKg > 50 ? 'La modalidad courier no es practica por encima de 50 kg.' : ''
        };
      }

      case 'aereo': {
        const tarifa = pick(origen.aereoKg);
        const tasable = pesoTasable(pesoKg, volumenCbm);
        // Cargos fijos de aerolinea: AWB, combustible, seguridad, handling
        const fijos = escenario === 'bajo' ? 90 : escenario === 'alto' ? 260 : 165;
        return {
          flete: tasable * tarifa + fijos,
          unidades: `${tasable.toFixed(1)} kg tasables x USD ${tarifa.toFixed(2)}/kg + USD ${fijos} fijos`,
          viable: true,
          motivo: ''
        };
      }

      case 'lcl': {
        const tarifa = pick(origen.lclCbm);
        // El consolidador cobra por el mayor entre m3 y toneladas (peso/volumen)
        const unidadesW_M = Math.max(volumenCbm, pesoKg / 1000);
        const facturables = Math.max(unidadesW_M, origen.lclMinCbm);
        // Cargos fijos de consolidacion en origen y destino
        const fijos = escenario === 'bajo' ? 110 : escenario === 'alto' ? 300 : 190;
        return {
          flete: facturables * tarifa + fijos,
          unidades: `${facturables.toFixed(2)} W/M x USD ${tarifa.toFixed(0)}/CBM + USD ${fijos} de consolidacion`,
          viable: volumenCbm <= 15,
          motivo: volumenCbm > 15 ? 'Por encima de 15 CBM el contenedor completo suele ser mas barato.' : ''
        };
      }

      case 'fcl20':
      case 'fcl40':
      case 'fcl40hc': {
        const tarifa = pick(origen[modalidad]);
        const cap = CAPACIDAD[modalidad];
        const nCbm = Math.ceil(volumenCbm / cap.cbm) || 1;
        const nTon = Math.ceil((pesoKg / 1000) / cap.ton) || 1;
        const contenedores = Math.max(1, nCbm, nTon);
        return {
          flete: tarifa * contenedores,
          unidades: `${contenedores} contenedor(es) x USD ${Math.round(tarifa).toLocaleString('es-CO')}`,
          contenedores,
          viable: true,
          ocupacion: clamp((volumenCbm / (cap.cbm * contenedores)) * 100, 0, 100),
          motivo: ''
        };
      }

      default:
        return { flete: 0, unidades: '', viable: false, motivo: 'Modalidad no reconocida.' };
    }
  }

  /* ------------------------------------------------------------------
     CALCULO PRINCIPAL
     input = {
       fob, cantidad, modalidad, origenId, puertoId, ciudadId,
       pesoKg, volumenCbm, arancelPct, ivaPct, escenario,
       fleteManual (opcional), seguroPct, aplicaTLC (bool),
       responsableIva (bool), diasAlmacenaje, trm
     }
  ------------------------------------------------------------------ */
  function calcular(input) {
    const origen  = getOrigen(input.origenId);
    const puerto  = getPuerto(input.puertoId);
    const esc     = input.escenario || 'medio';
    const pick    = (r) => esc === 'bajo' ? r[0] : esc === 'alto' ? r[1] : mid(r);

    const fob      = num(input.fob);
    const cantidad = Math.max(1, num(input.cantidad, 1));
    const pesoKg   = num(input.pesoKg);
    const volCbm   = num(input.volumenCbm);
    const trm      = num(input.trm, 4000);

    /* ---- 1. Flete internacional ---- */
    const est = estimarFlete(input.modalidad, origen, pesoKg, volCbm, esc);
    const flete = input.fleteManual != null && input.fleteManual !== ''
      ? num(input.fleteManual)
      : est.flete;

    /* ---- 2. Seguro ---- */
    const seguroPct = input.seguroPct != null ? num(input.seguroPct) : P.seguroPresuntoPct;
    const seguro = (fob + flete) * (seguroPct / 100);

    /* ---- 3. Valor en aduana (CIF) ---- */
    const cif = fob + flete + seguro;

    /* ---- 4. Arancel ---- */
    // La modalidad courier tiene arancel unico y umbral de exencion propio
    let arancelPct = num(input.arancelPct);
    let arancelNota = '';

    if (input.modalidad === 'courier') {
      if (fob <= P.courierUmbralFob) {
        arancelPct = 0;
        arancelNota = `Envio de USD ${fob.toFixed(0)} FOB: por debajo del umbral de USD ${P.courierUmbralFob} no paga arancel ni IVA en la modalidad de trafico postal y envios urgentes.`;
      } else {
        arancelPct = P.courierArancelUnico;
        arancelNota = `Arancel unico del ${P.courierArancelUnico}% propio de la modalidad courier (reemplaza el arancel de la partida).`;
      }
      if (fob > P.courierTopeFob) {
        arancelNota += ` ATENCION: supera el tope de USD ${P.courierTopeFob} por envio de la modalidad; debe ir por importacion ordinaria.`;
      }
    } else if (input.aplicaTLC && origen.arancelPref === 0) {
      arancelPct = 0;
      arancelNota = `Arancel 0% por ${origen.tlc}. Requiere certificado de origen valido; sin ese documento la DIAN liquida el arancel pleno.`;
    }

    const arancel = cif * (arancelPct / 100);

    /* ---- 5. IVA ---- */
    let ivaPct = num(input.ivaPct, P.ivaGeneral);
    if (input.modalidad === 'courier' && fob <= P.courierUmbralFob) ivaPct = 0;
    const baseIva = cif + arancel;
    const iva = baseIva * (ivaPct / 100);

    /* ---- 6. Gastos locales ---- */
    const esFcl = input.modalidad.startsWith('fcl');
    const esAereo = input.modalidad === 'aereo' || input.modalidad === 'courier';
    const nCont = est.contenedores || 1;

    let gastosPuerto = 0;
    let almacenaje = 0;

    if (esAereo) {
      gastosPuerto = puerto.gastosAereoFijo ? pick(puerto.gastosAereoFijo) : 200;
      const dias = Math.max(0, num(input.diasAlmacenaje, 3) - (puerto.diasLibres || 2));
      // El almacenaje aereo se tarifa por kilo/dia, no por contenedor/dia.
      const tarifaKgDia = puerto.almacenajeUnidad ? puerto.almacenajeDia : [0.35, 0.9];
      almacenaje = dias * pesoKg * pick(tarifaKgDia);
    } else if (esFcl) {
      gastosPuerto = pick(puerto.gastosFcl) * nCont;
      const dias = Math.max(0, num(input.diasAlmacenaje, 5) - puerto.diasLibres);
      almacenaje = dias * pick(puerto.almacenajeDia) * nCont;
    } else {
      gastosPuerto = pick(puerto.gastosLcl) * Math.max(1, volCbm);
      const dias = Math.max(0, num(input.diasAlmacenaje, 5) - puerto.diasLibres);
      almacenaje = dias * pick(puerto.almacenajeDia) * 0.4;
    }

    // Agenciamiento aduanero
    let agenciamiento = cif * (P.agenciamientoPct / 100);
    agenciamiento = clamp(agenciamiento, P.agenciamientoMinUsd, P.agenciamientoMaxUsd);
    if (input.modalidad === 'courier') agenciamiento = 0; // incluido en la tarifa courier

    // Transporte interno hasta la ciudad de destino
    const rutas = puerto.fleteInterno || {};
    const rutaCiudad = rutas[input.ciudadId];
    let transporteInterno = rutaCiudad ? pick(rutaCiudad) : 0;
    if (esFcl) transporteInterno *= nCont;
    else if (input.modalidad === 'lcl') transporteInterno *= clamp(volCbm / 25, 0.25, 1);
    else if (input.modalidad === 'courier') transporteInterno = 0; // puerta a puerta

    // Gastos financieros del giro al exterior
    const gastosBancarios = fob * (P.gastosBancariosPct / 100);
    const gmf = (fob + arancel + iva) * (P.gmfPct / 1000);

    const gastosLocales = gastosPuerto + almacenaje + agenciamiento + transporteInterno
                        + gastosBancarios + gmf;

    /* ---- 7. Totales ---- */
    const tributos = arancel + iva;
    const desembolsoTotal = cif + tributos + gastosLocales;

    // Si es responsable de IVA, el IVA es descontable: no es costo real
    const ivaRecuperable = input.responsableIva ? iva : 0;
    const costoReal = desembolsoTotal - ivaRecuperable;

    const costoUnitario = costoReal / cantidad;
    const costoUnitarioCop = costoUnitario * trm;
    const sobrecostoPct = fob > 0 ? ((costoReal - fob) / fob) * 100 : 0;

    /* ---- 8. Transito estimado ---- */
    const via = esAereo ? 'aereo' : 'maritimo';
    const t = origen.transito[via];
    const nacionalizacion = input.modalidad === 'courier' ? [1, 3] : [3, 8];
    const totalDias = [t[0] + nacionalizacion[0], t[1] + nacionalizacion[1]];

    return {
      input, origen, puerto, estimacionFlete: est,
      fob, flete, seguro, seguroPct, cif,
      arancelPct, arancel, arancelNota,
      ivaPct, baseIva, iva,
      gastosPuerto, almacenaje, agenciamiento, transporteInterno,
      gastosBancarios, gmf, gastosLocales,
      tributos, desembolsoTotal, ivaRecuperable, costoReal,
      cantidad, costoUnitario, costoUnitarioCop, sobrecostoPct,
      trm, transito: t, totalDias, via
    };
  }

  /* ------------------------------------------------------------------
     COMPARADOR: corre el mismo embarque por todas las modalidades
     viables y las ordena de la mas barata a la mas cara.
  ------------------------------------------------------------------ */
  function comparar(input) {
    const modalidades = ['courier', 'aereo', 'lcl', 'fcl20', 'fcl40', 'fcl40hc'];
    const origen = getOrigen(input.origenId);

    const resultados = modalidades.map(m => {
      // El puerto cambia segun la via
      const puertoId = (m === 'aereo' || m === 'courier') ? 'bogota_aereo' : input.puertoId;
      const est = estimarFlete(m, origen, num(input.pesoKg), num(input.volumenCbm), input.escenario || 'medio');
      const r = calcular(Object.assign({}, input, {
        modalidad: m,
        puertoId,
        fleteManual: null
      }));
      r.modalidadId = m;
      r.modalidadNombre = DATA.modalidades.find(x => x.id === m).nombre;
      r.viable = est.viable;
      r.motivo = est.motivo;
      return r;
    });

    const viables = resultados.filter(r => r.viable).sort((a, b) => a.costoReal - b.costoReal);
    const noViables = resultados.filter(r => !r.viable).sort((a, b) => a.costoReal - b.costoReal);

    return { viables, noViables, todos: viables.concat(noViables) };
  }

  /* ------------------------------------------------------------------
     COMPARADOR DE ORIGENES: mismo producto, distintos paises.
     Responde "de donde me sale mas barato traerlo".
  ------------------------------------------------------------------ */
  function compararOrigenes(input) {
    return DATA.origenes.map(o => {
      const puertoId = o.destinoNatural;
      const aplicaTLC = o.arancelPref === 0;
      const r = calcular(Object.assign({}, input, {
        origenId: o.id,
        puertoId: (input.modalidad === 'aereo' || input.modalidad === 'courier') ? 'bogota_aereo' : puertoId,
        aplicaTLC,
        fleteManual: null
      }));
      r.origenNombre = o.nombre;
      r.tieneTLC = aplicaTLC;
      return r;
    }).sort((a, b) => a.costoReal - b.costoReal);
  }

  /* ------------------------------------------------------------------
     PUNTO DE EQUILIBRIO LCL vs FCL para el origen dado.
     El corte NO se decide solo por el flete: el consolidado paga gastos
     portuarios por metro cubico, mientras el contenedor completo los paga
     por unidad. Por eso se compara el costo desembarcado total.
  ------------------------------------------------------------------ */
  function equilibrioLclFcl(origenId, escenario, puertoId, ciudadId) {
    const base = {
      fob: 20000, cantidad: 1, trm: 4000,
      origenId: origenId,
      puertoId: puertoId && puertoId !== 'bogota_aereo' ? puertoId : getOrigen(origenId).destinoNatural,
      ciudadId: ciudadId || 'bogota',
      arancelPct: 10, ivaPct: 19, aplicaTLC: false, responsableIva: true,
      escenario: escenario || 'medio', seguroPct: 0.5, diasAlmacenaje: 5
    };
    for (let cbm = 2; cbm <= 28; cbm += 0.5) {
      const carga = { pesoKg: cbm * 200, volumenCbm: cbm };
      const lcl = calcular(Object.assign({}, base, carga, { modalidad: 'lcl' })).costoReal;
      const fcl = calcular(Object.assign({}, base, carga, { modalidad: 'fcl20' })).costoReal;
      if (fcl <= lcl) return cbm;
    }
    return null;
  }

  /* ------------------------------------------------------------------
     COSTEO DE EXPORTACION: precio FOB minimo desde un costo EXW
  ------------------------------------------------------------------ */
  function costearExportacion(inp) {
    const costoProducto  = num(inp.costoProducto);
    const cantidad       = Math.max(1, num(inp.cantidad, 1));
    const margenPct      = num(inp.margenPct, 25);
    const empaque        = num(inp.empaque);
    const transporteInt  = num(inp.transporteInterno);
    const gastosPuerto   = num(inp.gastosPuerto, 350);
    const agenciamiento  = num(inp.agenciamiento, 250);
    const certificados   = num(inp.certificados, 120);
    const fleteInt       = num(inp.fleteInternacional);
    const seguroPct      = num(inp.seguroPct, 0.4);
    const finPct         = num(inp.financieroPct, 1.5);

    const base = costoProducto + empaque;
    const conMargen = base * (1 + margenPct / 100);
    const exw = conMargen;

    const costosPreEmbarque = transporteInt + gastosPuerto + agenciamiento + certificados;
    const fca = exw + costosPreEmbarque;
    const financiero = fca * (finPct / 100);
    const fob = fca + financiero;

    const seguro = (fob + fleteInt) * (seguroPct / 100);
    const cfr = fob + fleteInt;
    const cif = cfr + seguro;

    return {
      cantidad, costoProducto, empaque, base, margenPct,
      utilidad: conMargen - base,
      exw, transporteInt, gastosPuerto, agenciamiento, certificados,
      costosPreEmbarque, fca, financiero, fob, fleteInt, seguro, cfr, cif,
      fobUnitario: fob / cantidad,
      cifUnitario: cif / cantidad,
      requiereAgencia: fob > P.dexUmbralAgencia
    };
  }

  return {
    calcular, comparar, compararOrigenes, estimarFlete,
    equilibrioLclFcl, costearExportacion,
    getOrigen, getPuerto, getCategoria, pesoTasable, num
  };
})();
