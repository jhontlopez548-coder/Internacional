/* ============================================================================
   ImportaCol — capa de interfaz
   ========================================================================== */

(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const usd = (n) => 'USD ' + Math.round(n).toLocaleString('es-CO');
  const usd2 = (n) => 'USD ' + n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const cop = (n) => '$' + Math.round(n).toLocaleString('es-CO');
  const pct = (n) => n.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ======================= TEMA ======================= */
  const themeBtn = $('#themeToggle');
  const stored = localStorage.getItem('importacol-theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const isDark = cur === 'dark' || (!cur && matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('importacol-theme', next);
  });

  /* ======================= NAVEGACION ======================= */
  $$('#tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('#tabs .tab').forEach(t => t.classList.remove('active'));
      $$('.view').forEach(v => v.classList.remove('active'));
      tab.classList.add('active');
      $('#view-' + tab.dataset.view).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (tab.dataset.view === 'comparador') renderComparador();
      if (tab.dataset.view === 'origenes') renderOrigenes();
    });
  });

  /* ======================= POBLAR SELECTS ======================= */
  const fill = (sel, items, val, label) => {
    $(sel).innerHTML = items.map(i => `<option value="${i[val]}">${esc(i[label])}</option>`).join('');
  };
  fill('#origenId', DATA.origenes, 'id', 'nombre');
  fill('#modalidad', DATA.modalidades, 'id', 'nombre');
  fill('#puertoId', DATA.puertos, 'id', 'nombre');
  fill('#ciudadId', DATA.ciudades, 'id', 'nombre');
  fill('#categoriaId', DATA.categorias, 'id', 'nombre');

  $('#modalidad').value = 'fcl20';
  $('#categoriaId').value = 'herramientas';

  /* ======================= LEER FORMULARIO ======================= */
  function leerInput() {
    return {
      fob: $('#fob').value,
      cantidad: $('#cantidad').value,
      trm: $('#trm').value,
      pesoKg: $('#pesoKg').value,
      volumenCbm: $('#volumenCbm').value,
      origenId: $('#origenId').value,
      modalidad: $('#modalidad').value,
      puertoId: $('#puertoId').value,
      ciudadId: $('#ciudadId').value,
      arancelPct: $('#arancelPct').value,
      ivaPct: $('#ivaPct').value,
      aplicaTLC: $('#aplicaTLC').checked,
      responsableIva: $('#responsableIva').checked,
      escenario: $('#escenario').value,
      fleteManual: $('#fleteManual').value,
      seguroPct: $('#seguroPct').value,
      diasAlmacenaje: $('#diasAlmacenaje').value
    };
  }

  /* ======================= SINCRONIZACIONES ======================= */
  function syncOrigen() {
    const o = CALC.getOrigen($('#origenId').value);
    $('#origenNota').textContent = o.nota;
    const tieneTLC = o.arancelPref === 0;
    $('#tlcWrap').style.display = tieneTLC ? 'flex' : 'none';
    $('#tlcLabel').textContent = tieneTLC ? '— ' + o.tlc : '';
    if (!tieneTLC) $('#aplicaTLC').checked = false;
    // Sugerir puerto natural si el usuario no ha tocado el selector
    if (!$('#puertoId').dataset.touched) {
      const m = $('#modalidad').value;
      $('#puertoId').value = (m === 'aereo' || m === 'courier') ? 'bogota_aereo' : o.destinoNatural;
    }
  }

  function syncCategoria() {
    const c = CALC.getCategoria($('#categoriaId').value);
    $('#arancelPct').value = c.arancel;
    $('#ivaPct').value = c.iva;
    $('#catNota').textContent = `Capítulos ${c.capitulos}. ${c.nota}`;
  }

  function syncModalidad() {
    const m = $('#modalidad').value;
    const o = CALC.getOrigen($('#origenId').value);
    if (m === 'aereo' || m === 'courier') $('#puertoId').value = 'bogota_aereo';
    else if ($('#puertoId').value === 'bogota_aereo') $('#puertoId').value = o.destinoNatural;
  }

  $('#puertoId').addEventListener('change', function () { this.dataset.touched = '1'; });
  $('#origenId').addEventListener('change', () => { syncOrigen(); render(); });
  $('#categoriaId').addEventListener('change', () => { syncCategoria(); render(); });
  $('#modalidad').addEventListener('change', () => { syncModalidad(); render(); });
  $('#formSim').addEventListener('input', render);
  $('#formSim').addEventListener('change', render);

  /* ======================= RENDER SIMULADOR ======================= */
  function render() {
    const r = CALC.calcular(leerInput());
    const t = r.desembolsoTotal;
    const w = (v) => (v / t * 100).toFixed(2) + '%';

    const avisos = [];

    if (r.arancelNota) {
      avisos.push({ tipo: r.arancelPct === 0 ? 'good' : 'info', titulo: 'Arancel aplicado', texto: r.arancelNota });
    }
    if (!r.input.aplicaTLC && r.origen.arancelPref === 0 && r.input.modalidad !== 'courier') {
      const ahorro = r.cif * (r.arancelPct / 100);
      const ahorroIva = ahorro * (r.ivaPct / 100);
      avisos.push({
        tipo: 'warn',
        titulo: 'Está dejando dinero sobre la mesa',
        texto: `${r.origen.nombre} tiene ${r.origen.tlc}. Con certificado de origen el arancel baja a 0% y usted ahorra ${usd(ahorro)} de arancel más ${usd(ahorroIva)} de IVA sobre ese arancel: <strong>${usd(ahorro + ahorroIva)}</strong> en este solo embarque. Póngalo como condición de pago en la orden de compra.`
      });
    }
    if (!r.input.responsableIva) {
      avisos.push({
        tipo: 'bad',
        titulo: 'No está recuperando el IVA',
        texto: `Al no ser responsable de IVA, los ${usd(r.iva)} de IVA quedan como costo hundido: son el ${pct(r.iva / r.costoReal * 100)} de su costo total. Si va a revender la mercancía, registrarse como responsable de IVA es la decisión más rentable que puede tomar.`
      });
    }
    if (r.estimacionFlete.motivo) {
      avisos.push({ tipo: 'warn', titulo: 'Sobre la modalidad elegida', texto: r.estimacionFlete.motivo });
    }
    if (r.almacenaje > 0) {
      avisos.push({
        tipo: 'warn',
        titulo: 'Almacenaje en curso',
        texto: `Está pagando ${usd(r.almacenaje)} por exceder los ${r.puerto.diasLibres} días libres. Con declaración anticipada este rubro normalmente se elimina.`
      });
    }
    if (CALC.num(r.input.fob) > DATA.parametros.davUmbralFob && r.input.modalidad !== 'courier') {
      avisos.push({
        tipo: 'info',
        titulo: 'Declaración Andina del Valor',
        texto: `Con FOB superior a USD ${DATA.parametros.davUmbralFob.toLocaleString('es-CO')} debe presentar la Declaración Andina del Valor (DAV) junto con la declaración de importación.`
      });
    }
    if (r.estimacionFlete.ocupacion != null && r.estimacionFlete.ocupacion < 65) {
      avisos.push({
        tipo: 'warn',
        titulo: 'Contenedor subutilizado',
        texto: `Está usando apenas el ${pct(r.estimacionFlete.ocupacion)} de la capacidad. Consolide con otro proveedor o evalúe consolidado marítimo: el flete se paga por contenedor, no por lo que quepa dentro.`
      });
    }

    $('#resultados').innerHTML = `
      <div class="headline">
        <div class="headline-grid">
          <div>
            <div class="kpi-label">Costo real de la operación</div>
            <div class="kpi-value big accent">${usd(r.costoReal)}</div>
            <div class="kpi-sub">${r.input.responsableIva ? 'Neto de IVA descontable' : 'IVA incluido como costo'}</div>
          </div>
          <div>
            <div class="kpi-label">Desembolso de caja</div>
            <div class="kpi-value">${usd(r.desembolsoTotal)}</div>
            <div class="kpi-sub">Es lo que debe tener disponible</div>
          </div>
          <div>
            <div class="kpi-label">Costo por unidad</div>
            <div class="kpi-value">${usd2(r.costoUnitario)}</div>
            <div class="kpi-sub">${cop(r.costoUnitarioCop)} a TRM ${Math.round(r.trm).toLocaleString('es-CO')}</div>
          </div>
          <div>
            <div class="kpi-label">Sobrecosto sobre el FOB</div>
            <div class="kpi-value ${r.sobrecostoPct > 50 ? '' : 'green'}">+${pct(r.sobrecostoPct)}</div>
            <div class="kpi-sub">Lo que suma la operación al precio de fábrica</div>
          </div>
        </div>
        <div style="margin-top:1.2rem">
          <div class="bar">
            <span class="b-cif"  style="width:${w(r.cif)}"></span>
            <span class="b-trib" style="width:${w(r.tributos)}"></span>
            <span class="b-loc"  style="width:${w(r.gastosLocales)}"></span>
          </div>
          <div class="legend">
            <span><i style="background:var(--accent)"></i>Valor en aduana ${usd(r.cif)}</span>
            <span><i style="background:var(--gold)"></i>Tributos ${usd(r.tributos)}</span>
            <span><i style="background:var(--green)"></i>Gastos locales ${usd(r.gastosLocales)}</span>
          </div>
        </div>
      </div>

      ${avisos.map(a => `<div class="callout ${a.tipo}"><strong>${a.titulo}</strong>${a.texto}</div>`).join('')}

      <div class="tablecard">
        <h3>Desglose completo</h3>
        <div class="tablewrap"><table>
          <thead><tr><th>Concepto</th><th class="num">USD</th><th class="num">COP</th><th class="num">% del total</th></tr></thead>
          <tbody>
            <tr class="group"><td colspan="4">Valor en aduana (base gravable)</td></tr>
            <tr><td>Valor FOB de la mercancía</td><td class="num">${usd(r.fob)}</td><td class="num">${cop(r.fob * r.trm)}</td><td class="num">${w(r.fob)}</td></tr>
            <tr><td>Flete internacional<span class="tdesc">${esc(r.estimacionFlete.unidades || 'cotización manual')}</span></td><td class="num">${usd(r.flete)}</td><td class="num">${cop(r.flete * r.trm)}</td><td class="num">${w(r.flete)}</td></tr>
            <tr><td>Seguro de transporte (${pct(r.seguroPct)})</td><td class="num">${usd(r.seguro)}</td><td class="num">${cop(r.seguro * r.trm)}</td><td class="num">${w(r.seguro)}</td></tr>
            <tr class="total"><td>Valor en aduana (CIF)</td><td class="num">${usd(r.cif)}</td><td class="num">${cop(r.cif * r.trm)}</td><td class="num">${w(r.cif)}</td></tr>

            <tr class="group"><td colspan="4">Tributos aduaneros</td></tr>
            <tr><td>Arancel (${pct(r.arancelPct)} sobre CIF)</td><td class="num">${usd(r.arancel)}</td><td class="num">${cop(r.arancel * r.trm)}</td><td class="num">${w(r.arancel)}</td></tr>
            <tr><td>IVA (${pct(r.ivaPct)} sobre CIF + arancel)<span class="tdesc">Base gravable ${usd(r.baseIva)}</span></td><td class="num">${usd(r.iva)}</td><td class="num">${cop(r.iva * r.trm)}</td><td class="num">${w(r.iva)}</td></tr>
            <tr class="total"><td>Total tributos</td><td class="num">${usd(r.tributos)}</td><td class="num">${cop(r.tributos * r.trm)}</td><td class="num">${w(r.tributos)}</td></tr>

            <tr class="group"><td colspan="4">Gastos locales en Colombia</td></tr>
            <tr><td>Gastos portuarios y de terminal<span class="tdesc">${esc(r.puerto.nombre)}</span></td><td class="num">${usd(r.gastosPuerto)}</td><td class="num">${cop(r.gastosPuerto * r.trm)}</td><td class="num">${w(r.gastosPuerto)}</td></tr>
            <tr><td>Almacenaje</td><td class="num">${usd(r.almacenaje)}</td><td class="num">${cop(r.almacenaje * r.trm)}</td><td class="num">${w(r.almacenaje)}</td></tr>
            <tr><td>Agenciamiento aduanero</td><td class="num">${usd(r.agenciamiento)}</td><td class="num">${cop(r.agenciamiento * r.trm)}</td><td class="num">${w(r.agenciamiento)}</td></tr>
            <tr><td>Transporte interno a ${esc(DATA.ciudades.find(c => c.id === r.input.ciudadId).nombre)}</td><td class="num">${usd(r.transporteInterno)}</td><td class="num">${cop(r.transporteInterno * r.trm)}</td><td class="num">${w(r.transporteInterno)}</td></tr>
            <tr><td>Gastos bancarios del giro al exterior</td><td class="num">${usd(r.gastosBancarios)}</td><td class="num">${cop(r.gastosBancarios * r.trm)}</td><td class="num">${w(r.gastosBancarios)}</td></tr>
            <tr><td>GMF (4 x 1.000)</td><td class="num">${usd(r.gmf)}</td><td class="num">${cop(r.gmf * r.trm)}</td><td class="num">${w(r.gmf)}</td></tr>
            <tr class="total"><td>Total gastos locales</td><td class="num">${usd(r.gastosLocales)}</td><td class="num">${cop(r.gastosLocales * r.trm)}</td><td class="num">${w(r.gastosLocales)}</td></tr>

            <tr class="group"><td colspan="4">Resultado</td></tr>
            <tr class="total"><td>Desembolso total</td><td class="num">${usd(r.desembolsoTotal)}</td><td class="num">${cop(r.desembolsoTotal * r.trm)}</td><td class="num">100%</td></tr>
            ${r.ivaRecuperable > 0 ? `<tr class="sub"><td>Menos IVA descontable</td><td class="num">−${usd(r.ivaRecuperable)}</td><td class="num">−${cop(r.ivaRecuperable * r.trm)}</td><td class="num">−${w(r.ivaRecuperable)}</td></tr>` : ''}
            <tr class="total"><td>Costo real de la mercancía</td><td class="num">${usd(r.costoReal)}</td><td class="num">${cop(r.costoReal * r.trm)}</td><td class="num">${w(r.costoReal)}</td></tr>
          </tbody>
        </table></div>
      </div>

      <div class="tablecard">
        <h3>Tiempos estimados</h3>
        <div class="tablewrap"><table>
          <tbody>
            <tr><td>Tránsito internacional (${r.via})</td><td class="num">${r.transito[0]} a ${r.transito[1]} días</td></tr>
            <tr><td>Nacionalización y levante</td><td class="num">${r.input.modalidad === 'courier' ? '1 a 3' : '3 a 8'} días</td></tr>
            <tr class="total"><td>Desde el embarque hasta su bodega</td><td class="num">${r.totalDias[0]} a ${r.totalDias[1]} días</td></tr>
          </tbody>
        </table></div>
      </div>
    `;

    renderPrecioVenta(r);
  }

  function renderPrecioVenta(r) {
    const card = document.createElement('div');
    card.className = 'callout info';
    card.innerHTML = `<strong>Referencia de precio de venta</strong>
      Con su costo unitario real de ${usd2(r.costoUnitario)} (${cop(r.costoUnitarioCop)}), para obtener un margen bruto del
      30% debe vender a <strong>${cop(r.costoUnitarioCop / 0.7)}</strong> por unidad;
      con 40%, a <strong>${cop(r.costoUnitarioCop / 0.6)}</strong>;
      con 50%, a <strong>${cop(r.costoUnitarioCop / 0.5)}</strong>. Estos precios son antes de IVA al consumidor.`;
    $('#resultados').appendChild(card);
  }

  /* ======================= COMPARADOR DE MODALIDADES ======================= */
  function renderComparador() {
    const inp = leerInput();
    const c = CALC.comparar(inp);
    const best = c.viables[0];
    const equilibrio = CALC.equilibrioLclFcl(inp.origenId, inp.escenario, inp.puertoId, inp.ciudadId);

    const filas = c.todos.map(r => {
      const isBest = best && r.modalidadId === best.modalidadId;
      const dif = best ? r.costoReal - best.costoReal : 0;
      return `<tr class="${isBest ? 'best' : ''}">
        <td>${esc(r.modalidadNombre)} ${isBest ? '<span class="badge best">Más barato</span>' : ''}
          ${!r.viable ? `<span class="tdesc">No recomendada: ${esc(r.motivo)}</span>` : ''}</td>
        <td class="num">${usd(r.flete)}</td>
        <td class="num">${usd(r.tributos)}</td>
        <td class="num">${usd(r.gastosLocales)}</td>
        <td class="num"><strong>${usd(r.costoReal)}</strong></td>
        <td class="num">${isBest ? '—' : '+' + usd(dif)}</td>
        <td class="num">${r.totalDias[0]}–${r.totalDias[1]} d</td>
      </tr>`;
    }).join('');

    const peor = c.viables[c.viables.length - 1];

    $('#comparadorOut').innerHTML = `
      ${best ? `<div class="callout good" style="margin-bottom:1rem">
        <strong>Para este embarque, lo más barato es ${esc(best.modalidadNombre)}</strong>
        Costo real ${usd(best.costoReal)}, es decir ${usd2(best.costoUnitario)} por unidad, con llegada estimada
        entre ${best.totalDias[0]} y ${best.totalDias[1]} días desde el embarque.
        ${peor && peor !== best ? `Frente a la alternativa viable más cara (${esc(peor.modalidadNombre)}) ahorra <strong>${usd(peor.costoReal - best.costoReal)}</strong>.` : ''}
      </div>` : ''}

      <div class="tablecard">
        <h3>Comparación de modalidades · ${esc(CALC.getOrigen(inp.origenId).nombre)} → ${esc(CALC.getPuerto(inp.puertoId).nombre)}</h3>
        <div class="tablewrap"><table>
          <thead><tr>
            <th>Modalidad</th><th class="num">Flete</th><th class="num">Tributos</th>
            <th class="num">Gastos locales</th><th class="num">Costo real</th><th class="num">Diferencia</th><th class="num">Tiempo</th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table></div>
      </div>

      <div class="callout info" style="margin-top:1rem">
        <strong>Punto de equilibrio consolidado vs. contenedor completo</strong>
        Para carga desde ${esc(CALC.getOrigen(inp.origenId).nombre)}, el flete de un contenedor de 20 pies empieza a ser
        más barato que el consolidado a partir de aproximadamente <strong>${equilibrio ? equilibrio + ' m³' : '13 m³'}</strong>.
        Por debajo de ese volumen use LCL; por encima, contenedor completo. Y si su carga es voluminosa pero liviana,
        el 40 High Cube casi siempre gana en costo por metro cúbico.
      </div>

      <h3 class="sec-title">Cuándo usar cada modalidad</h3>
      <div class="cards">
        ${DATA.modalidades.map(m => `<div class="card">
          <h4>${esc(m.nombre)}</h4>
          <p><strong>${esc(m.rango)}</strong><br>${esc(m.mejorPara)}</p>
        </div>`).join('')}
      </div>
    `;
  }

  /* ======================= COMPARADOR DE ORIGENES ======================= */
  function renderOrigenes() {
    const inp = leerInput();
    const lista = CALC.compararOrigenes(inp);
    const best = lista[0];

    const filas = lista.map((r, i) => `<tr class="${i === 0 ? 'best' : ''}">
      <td>${esc(r.origenNombre)}
        ${r.tieneTLC ? '<span class="badge tlc">TLC</span>' : '<span class="badge notlc">Sin acuerdo</span>'}
        <span class="tdesc">Entrada por ${esc(r.puerto.nombre)}</span></td>
      <td class="num">${usd(r.flete)}</td>
      <td class="num">${pct(r.arancelPct)}</td>
      <td class="num">${usd(r.tributos)}</td>
      <td class="num"><strong>${usd(r.costoReal)}</strong></td>
      <td class="num">${i === 0 ? '—' : '+' + usd(r.costoReal - best.costoReal)}</td>
      <td class="num">${r.totalDias[0]}–${r.totalDias[1]} d</td>
    </tr>`).join('');

    // ¿Cuánto más caro puede ser el FOB en el origen con TLC y aun así convenir?
    const china = lista.find(r => r.input.origenId === 'china') || lista.find(r => !r.tieneTLC);
    const mejorTLC = lista.find(r => r.tieneTLC);
    let insight = '';
    if (china && mejorTLC && china !== mejorTLC && china.costoReal > mejorTLC.costoReal) {
      const holgura = china.costoReal - mejorTLC.costoReal;
      const holguraPct = (holgura / CALC.num(inp.fob)) * 100;
      insight = `<div class="callout warn" style="margin-top:1rem">
        <strong>El número que debe llevar a la mesa de negociación</strong>
        Traer este mismo pedido desde ${esc(mejorTLC.origenNombre)} sale ${usd(holgura)} más barato que desde ${esc(china.origenNombre)}.
        Eso significa que un proveedor en ${esc(mejorTLC.origenNombre)} puede cotizarle hasta un
        <strong>${pct(holguraPct)} más caro de precio de fábrica</strong> y usted seguiría llegando igual o mejor a su bodega.
        Cuando compare cotizaciones internacionales, nunca compare precios FOB: compare costo desembarcado.
      </div>`;
    }

    $('#origenesOut').innerHTML = `
      <div class="callout good">
        <strong>El origen más económico para este embarque es ${esc(best.origenNombre)}</strong>
        Costo real ${usd(best.costoReal)} contra ${usd(lista[lista.length - 1].costoReal)} del más caro
        (${esc(lista[lista.length - 1].origenNombre)}): una diferencia de
        ${usd(lista[lista.length - 1].costoReal - best.costoReal)} por el mismo producto.
      </div>

      <div class="tablecard" style="margin-top:1rem">
        <h3>Mismo pedido, distintos orígenes · ${esc(DATA.modalidades.find(m => m.id === inp.modalidad).nombre)}</h3>
        <div class="tablewrap"><table>
          <thead><tr>
            <th>Origen</th><th class="num">Flete</th><th class="num">Arancel</th>
            <th class="num">Tributos</th><th class="num">Costo real</th><th class="num">Diferencia</th><th class="num">Tiempo</th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table></div>
      </div>

      ${insight}

      <h3 class="sec-title">Acuerdos comerciales vigentes de Colombia</h3>
      <div class="cards">
        ${DATA.origenes.map(o => `<div class="card">
          <h4>${esc(o.nombre)} ${o.arancelPref === 0 ? '<span class="badge tlc">Arancel 0%</span>' : '<span class="badge notlc">NMF pleno</span>'}</h4>
          <p>${o.tlc ? '<strong>' + esc(o.tlc) + '</strong><br>' : ''}${esc(o.nota)}
          <br><br><span style="color:var(--text-faint)">Puertos de salida: ${esc(o.puertosOrigen)}.
          Tránsito marítimo ${o.transito.maritimo[0]}–${o.transito.maritimo[1]} días, aéreo ${o.transito.aereo[0]}–${o.transito.aereo[1]} días.</span></p>
        </div>`).join('')}
      </div>
    `;
  }

  /* ======================= PASOS ======================= */
  function renderPasos(pasos, contenedor) {
    $(contenedor).innerHTML = `<div class="steps">${pasos.map((p, i) => `
      <details class="step" ${i === 0 ? 'open' : ''}>
        <summary class="step-head">
          <span class="step-n">${p.n}</span>
          <span class="step-title">
            <h4>${esc(p.titulo)}</h4>
            <span class="step-meta">${esc(p.cuando)}${p.dias && p.dias !== '—' ? ' · duración típica ' + esc(p.dias) : ''}</span>
          </span>
          <span class="chev">▸</span>
        </summary>
        <div class="step-body">
          <ul>${p.acciones.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
          <div class="callout info"><strong>Consejo de negociador</strong>${esc(p.tip)}</div>
        </div>
      </details>`).join('')}</div>`;
  }

  /* ======================= CUANDO ======================= */
  function renderCuando() {
    $('#cuandoOut').innerHTML = `
      <div class="calgrid">
        ${DATA.calendario.map(c => `<div class="calcard ${c.tipo}">
          <div class="calmes">${esc(c.mes)}</div>
          <h4>${esc(c.titulo)}</h4>
          <p>${esc(c.detalle)}</p>
        </div>`).join('')}
      </div>

      <h3 class="sec-title">Plazos que debe tener en la cabeza</h3>
      <div class="tablecard">
        <div class="tablewrap"><table>
          <thead><tr><th>Concepto</th><th>Plazo</th><th>Detalle</th></tr></thead>
          <tbody>${DATA.reglaTiempo.map(t => `<tr>
            <td><strong>${esc(t.concepto)}</strong></td>
            <td><strong style="color:var(--accent)">${esc(t.valor)}</strong></td>
            <td style="color:var(--text-dim)">${esc(t.detalle)}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>

      <div class="callout bad" style="margin-top:1rem">
        <strong>La regla que no puede olvidar</strong>
        Si la mercancía permanece en depósito más allá del término legal sin que se presente la declaración de importación,
        cae en <strong>abandono a favor de la Nación</strong>: usted pierde la mercancía y además ya pagó el flete.
        Es el error más caro y más evitable del comercio exterior colombiano. Presente declaración anticipada y no dependa de que
        alguien se acuerde.
      </div>
    `;
  }

  /* ======================= AGENTES ======================= */
  function renderAgentes() {
    const ranked = DATA.agencias.filter(a => a.rank).sort((a, b) => a.rank - b.rank);
    const otras = DATA.agencias.filter(a => !a.rank);

    const fila = (a) => `<tr>
      <td>${a.rank ? `<span class="badge rank">#${a.rank}</span> ` : ''}<strong>${esc(a.nombre)}</strong>
        ${a.nivel === 1 ? '<span class="badge n1">Nivel 1</span>' : ''}
        <span class="tdesc">${esc(a.tipo)}</span></td>
      <td>${esc(a.fuerte)}</td>
      <td style="color:var(--text-dim)">${esc(a.perfil)}</td>
    </tr>`;

    $('#agentesOut').innerHTML = `
      <div class="callout info">
        <strong>Cómo leer este listado</strong>
        El orden corresponde al ranking sectorial 2026 de agencias de aduanas en Colombia, que se construye principalmente sobre
        volumen de operación e ingresos. Un puesto alto indica músculo y experiencia, no necesariamente que sea la mejor opción
        <em>para usted</em>: una agencia mediana especializada en su producto puede darle mejor servicio que la número uno del país.
        Cotice siempre con tres y verifique la habilitación vigente en el registro aduanero de la DIAN antes de firmar mandato.
      </div>

      <div class="tablecard" style="margin-top:1rem">
        <h3>Ranking sectorial de agencias de aduanas · Colombia 2026</h3>
        <div class="tablewrap"><table>
          <thead><tr><th style="width:26%">Agencia</th><th style="width:42%">Fortaleza</th><th>Perfil de cliente que le calza</th></tr></thead>
          <tbody>${ranked.map(fila).join('')}</tbody>
        </table></div>
      </div>

      <div class="tablecard" style="margin-top:1rem">
        <h3>Otros operadores relevantes del mercado</h3>
        <div class="tablewrap"><table>
          <thead><tr><th style="width:26%">Operador</th><th style="width:42%">Fortaleza</th><th>Perfil de cliente que le calza</th></tr></thead>
          <tbody>${otras.map(fila).join('')}</tbody>
        </table></div>
      </div>

      <h3 class="sec-title">Los ocho criterios para elegir</h3>
      <div class="cards">
        ${DATA.criteriosAgencia.map((c, i) => `<div class="card">
          <h4>${i + 1}. ${esc(c.titulo)}</h4>
          <p>${esc(c.detalle)}</p>
        </div>`).join('')}
      </div>

      <h3 class="sec-title">Señales de alerta: aléjese si ve esto</h3>
      <div class="callout bad">
        <strong>Motivos para no firmar</strong>
        <ul style="margin:.5rem 0 0; padding-left:1.1rem">
          ${DATA.senalesAlerta.map(s => `<li style="margin-bottom:.3rem">${esc(s)}</li>`).join('')}
        </ul>
      </div>

      <h3 class="sec-title">Qué pedir en la cotización</h3>
      <div class="tablecard">
        <div class="tablewrap"><table>
          <thead><tr><th>Rubro</th><th>Qué debe exigir</th><th class="num">Rango de mercado</th></tr></thead>
          <tbody>
            <tr><td>Honorarios de agenciamiento</td><td>Porcentaje sobre el valor CIF, con mínimo y máximo pactados por escrito</td><td class="num">0,4% a 1,0% · mín. USD 150–250</td></tr>
            <tr><td>Gastos operativos</td><td>Tarifa fija por declaración, no variable</td><td class="num">USD 60 a 150</td></tr>
            <tr><td>Manejo documental</td><td>Incluido o con tope</td><td class="num">USD 30 a 80</td></tr>
            <tr><td>Acompañamiento en inspección</td><td>Se cobra solo si ocurre</td><td class="num">USD 80 a 200</td></tr>
            <tr><td>Reembolsables (puerto, naviera)</td><td>A costo, con factura del tercero. Sin margen oculto</td><td class="num">Según terminal</td></tr>
            <tr><td>Transporte interno</td><td>Cotizado aparte para poder comparar con transportadores directos</td><td class="num">Según ruta</td></tr>
          </tbody>
        </table></div>
      </div>
    `;
  }

  /* ======================= AHORRO ======================= */
  function renderAhorro() {
    $('#ahorroOut').innerHTML = `
      <div class="tablecard">
        <div class="tablewrap"><table>
          <thead><tr><th style="width:20%">Estrategia</th><th style="width:15%">Ahorro típico</th><th>Cómo se hace</th><th class="num">Dificultad</th></tr></thead>
          <tbody>${DATA.estrategias.map(e => `<tr>
            <td><strong>${esc(e.titulo)}</strong></td>
            <td><strong style="color:var(--green)">${esc(e.ahorro)}</strong></td>
            <td style="color:var(--text-dim)">${esc(e.detalle)}</td>
            <td class="num">${esc(e.dificultad)}</td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>

      <div class="callout good" style="margin-top:1rem">
        <strong>Si solo va a hacer tres cosas, que sean estas</strong>
        Primero, compre FOB y contrate usted el flete. Segundo, exija el certificado de origen cuando el país tenga acuerdo
        comercial con Colombia. Tercero, verifique la clasificación arancelaria antes de cerrar la compra, no cuando la carga
        ya esté en el puerto. Esas tres decisiones, juntas, suelen valer entre el 15% y el 30% del costo de la operación,
        y ninguna requiere capital adicional.
      </div>
    `;
  }

  /* ======================= EXPORTACION ======================= */
  function renderExp() {
    const r = CALC.costearExportacion({
      costoProducto: $('#e_costo').value,
      cantidad: $('#e_cant').value,
      margenPct: $('#e_margen').value,
      empaque: $('#e_empaque').value,
      transporteInterno: $('#e_transp').value,
      gastosPuerto: $('#e_puerto').value,
      agenciamiento: $('#e_agencia').value,
      certificados: $('#e_cert').value,
      fleteInternacional: $('#e_flete').value,
      seguroPct: $('#e_seguro').value,
      financieroPct: $('#e_fin').value
    });

    $('#expResultados').innerHTML = `
      <div class="headline">
        <div class="headline-grid">
          <div><div class="kpi-label">Precio FOB total</div><div class="kpi-value big accent">${usd(r.fob)}</div><div class="kpi-sub">${usd2(r.fobUnitario)} por unidad</div></div>
          <div><div class="kpi-label">Precio CIF total</div><div class="kpi-value">${usd(r.cif)}</div><div class="kpi-sub">${usd2(r.cifUnitario)} por unidad</div></div>
          <div><div class="kpi-label">Utilidad incluida</div><div class="kpi-value green">${usd(r.utilidad)}</div><div class="kpi-sub">Margen del ${pct(r.margenPct)}</div></div>
        </div>
      </div>

      <div class="tablecard">
        <h3>Construcción del precio de exportación</h3>
        <div class="tablewrap"><table>
          <thead><tr><th>Concepto</th><th class="num">USD</th></tr></thead>
          <tbody>
            <tr><td>Costo del producto</td><td class="num">${usd(r.costoProducto)}</td></tr>
            <tr><td>Empaque y embalaje de exportación</td><td class="num">${usd(r.empaque)}</td></tr>
            <tr><td>Utilidad (${pct(r.margenPct)})</td><td class="num">${usd(r.utilidad)}</td></tr>
            <tr class="total"><td>Precio EXW — en su planta</td><td class="num">${usd(r.exw)}</td></tr>
            <tr><td>Transporte interno hasta el puerto</td><td class="num">${usd(r.transporteInt)}</td></tr>
            <tr><td>Gastos portuarios de origen</td><td class="num">${usd(r.gastosPuerto)}</td></tr>
            <tr><td>Agenciamiento aduanero de exportación</td><td class="num">${usd(r.agenciamiento)}</td></tr>
            <tr><td>Certificados y vistos buenos</td><td class="num">${usd(r.certificados)}</td></tr>
            <tr class="total"><td>Precio FCA — entregado al transportador</td><td class="num">${usd(r.fca)}</td></tr>
            <tr><td>Costo financiero y bancario</td><td class="num">${usd(r.financiero)}</td></tr>
            <tr class="total"><td>Precio FOB — a bordo del buque</td><td class="num">${usd(r.fob)}</td></tr>
            <tr><td>Flete internacional</td><td class="num">${usd(r.fleteInt)}</td></tr>
            <tr class="total"><td>Precio CFR</td><td class="num">${usd(r.cfr)}</td></tr>
            <tr><td>Seguro internacional</td><td class="num">${usd(r.seguro)}</td></tr>
            <tr class="total"><td>Precio CIF — puerto de destino</td><td class="num">${usd(r.cif)}</td></tr>
          </tbody>
        </table></div>
      </div>

      <div class="callout ${r.requiereAgencia ? 'warn' : 'info'}">
        <strong>${r.requiereAgencia ? 'Requiere agencia de aduanas' : 'Puede tramitarlo usted mismo'}</strong>
        ${r.requiereAgencia
          ? `Con un FOB de ${usd(r.fob)}, por encima del umbral de USD ${DATA.parametros.dexUmbralAgencia.toLocaleString('es-CO')} debe actuar a través de una agencia de aduanas habilitada.`
          : `Con un FOB de ${usd(r.fob)}, por debajo del umbral de USD ${DATA.parametros.dexUmbralAgencia.toLocaleString('es-CO')} usted puede presentar la Solicitud de Autorización de Embarque directamente en MUISCA sin agencia de aduanas.`}
      </div>

      <div class="callout good">
        <strong>Recuerde su beneficio tributario</strong>
        Las exportaciones están exentas de IVA con derecho a devolución. Todo el IVA que usted pagó en los insumos de estas
        ${r.cantidad.toLocaleString('es-CO')} unidades es recuperable ante la DIAN. Ese es el margen que muchos exportadores
        primerizos dejan perder por no llevar el expediente completo del DEX.
      </div>
    `;
  }

  /* ======================= FUENTES ======================= */
  function renderFuentes() {
    $('#fuentesOut').innerHTML = `<h3>Fuentes oficiales y de consulta</h3><ul>
      ${DATA.fuentes.map(f => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.nombre)}</a></li>`).join('')}
    </ul>`;
  }

  /* ======================= ARRANQUE ======================= */
  $('#formExp').addEventListener('input', renderExp);

  syncOrigen();
  syncCategoria();
  render();
  renderPasos(DATA.pasosImportacion, '#importarOut');
  renderPasos(DATA.pasosExportacion, '#exportarOut');
  renderCuando();
  renderAgentes();
  renderAhorro();
  renderExp();
  renderFuentes();
})();
