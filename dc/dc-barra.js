/* Barra superior común DC: el menú de la cuenta que abre el avatar.
 * Idéntico en el Hub, DC-Documental y Mapa de Propiedades; si lo cambias, cópialo igual en las tres.
 * Cada app rellena quién ha entrado con window.dcCuenta({ iniciales, nombre, detalle }). */
(function () {
  function cerrar(c, foco) {
    var b = c.querySelector('.dc-avatar'), m = c.querySelector('.dc-menu');
    if (!m || m.hidden) return;
    m.hidden = true;
    b.setAttribute('aria-expanded', 'false');
    if (foco) b.focus();
  }
  function todas() { return Array.prototype.slice.call(document.querySelectorAll('.dc-cuenta')); }

  document.addEventListener('click', function (e) {
    var boton = e.target.closest && e.target.closest('.dc-cuenta > .dc-avatar');
    todas().forEach(function (c) { if (!boton || !c.contains(boton)) cerrar(c); });
    if (boton) {
      var m = boton.parentElement.querySelector('.dc-menu'), abrir = m.hidden;
      m.hidden = !abrir;
      boton.setAttribute('aria-expanded', String(abrir));
      if (abrir) { var p = m.querySelector('.dc-menu-item:not([hidden])'); if (p) p.focus(); }
      return;
    }
    // Al elegir una opción el menú se cierra (la opción hace lo suyo con su propio manejador).
    if (e.target.closest && e.target.closest('.dc-menu .dc-menu-item')) todas().forEach(function (c) { cerrar(c); });
  });

  document.addEventListener('keydown', function (e) {
    var abierta = todas().filter(function (c) { var m = c.querySelector('.dc-menu'); return m && !m.hidden; })[0];
    if (!abierta) return;
    if (e.key === 'Escape') { cerrar(abierta, true); return; }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var items = Array.prototype.slice.call(abierta.querySelectorAll('.dc-menu-item:not([hidden])'));
    var i = items.indexOf(document.activeElement);
    var sig = items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length];
    if (sig) { e.preventDefault(); sig.focus(); }
  });

  window.dcCuenta = function (d) {
    d = d || {};
    todas().forEach(function (c) {
      var a = c.querySelector('.dc-avatar'), q = c.querySelector('.dc-menu-quien');
      a.textContent = d.iniciales || '';
      a.setAttribute('aria-label', d.nombre ? 'Menú de la cuenta de ' + d.nombre : 'Menú');
      if (q) {
        q.hidden = !d.nombre;
        q.querySelector('b').textContent = d.nombre || '';
        q.querySelector('small').textContent = d.detalle || '';
      }
    });
  };
})();

/* Dentro del Hub DC de Vercel (la app va en su marco): el logo vuelve al Hub en vez de abrirlo dentro
 * de la app, que no se deja enmarcar. Se lo pide al Hub, que cierra el marco. Solo si quien la enmarca
 * es ese Hub; en cualquier otro sitio (Hub AP, claude.ai) el enlace funciona normal con target="_top". */
var HUB_DC = 'https://dc-hub-lilac.vercel.app';
var padre = (location.ancestorOrigins && location.ancestorOrigins[0]) || document.referrer || '';
if (window.top !== window && padre.indexOf(HUB_DC) === 0) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="https://dc-hub-lilac.vercel.app"]');
    if (!a) return;
    e.preventDefault();
    window.parent.postMessage({ dc: 'volver-al-hub' }, HUB_DC);
  });
}
