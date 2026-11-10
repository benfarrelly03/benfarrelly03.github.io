// Knit samples board: category tabs, a packed grid and a lightbox.
// Layout, crops, widths and categories come from the layout saved on 10 Nov 2026 (js/samples-data.js).
// Crops are non-destructive: each original image is positioned, scaled and rotated inside its frame.
(function () {
  var S = window.SAMPLES || [];
  var CATS = [{ id: 'st', name: 'Stripes' }, { id: 'rb', name: 'Ribbing' }, { id: 'ex', name: 'Experiments' }, { id: 'wk', name: 'Working samples' }];
  var tabsEl = document.getElementById('tabs');
  var grid = document.getElementById('kgrid');
  var title = document.getElementById('s-h');
  var lbx = document.getElementById('lbx');
  var lbFrame = document.getElementById('lb-frame');
  var tab = 'st', lb = -1, seq = [];

  function catName(id) { for (var k = 0; k < CATS.length; k++) if (CATS[k].id === id) return CATS[k].name; return ''; }
  function seqOf(cat) { return S.filter(function (t) { return t.cat === cat; }); }
  function pad(i) { return (i < 9 ? '0' : '') + (i + 1); }
  function dims(t) { return (t.rot % 180) ? { w: t.H, h: t.W } : { w: t.W, h: t.H }; }
  function aspect(t) { var D = dims(t); return (t.c[2] * D.w) / (t.c[3] * D.h); }
  function f(v) { return +v.toFixed(3); }

  function frameInner(t, alt) {
    var c = t.c, rot = t.rot || 0, a = +(t.a || 0).toFixed(2);
    var g = { rl: f(-c[0] / c[2] * 100), rt: f(-c[1] / c[3] * 100), rw: f(100 / c[2]), rh: f(100 / c[3]),
      il: 0, it: 0, iw: 100, ih: 100, ox: f((c[0] + c[2] / 2) * 100), oy: f((c[1] + c[3] / 2) * 100) };
    if (rot % 180) { var wp = t.W / t.H * 100, hp = t.H / t.W * 100; g.iw = f(wp); g.ih = f(hp); g.il = f((100 - wp) / 2); g.it = f((100 - hp) / 2); }
    return '<span class="rimg" style="left:' + g.rl + '%;top:' + g.rt + '%;width:' + g.rw + '%;height:' + g.rh + '%;transform-origin:' + g.ox + '% ' + g.oy + '%;transform:rotate(' + a + 'deg)">' +
      '<img src="' + t.src + '" alt="' + alt + '" loading="lazy" draggable="false" style="left:' + g.il + '%;top:' + g.it + '%;width:' + g.iw + '%;height:' + g.ih + '%;transform:rotate(' + rot + 'deg)"></span>';
  }

  function cols() { var V = window.innerWidth || 1280; return V < 760 ? 4 : V < 1100 ? 6 : 12; }
  function span(t, T) {
    var cw = t.cw || 3, min = T === 6 ? 1 : 2;
    if (T === 12) return Math.max(min, Math.min(12, cw));
    return Math.max(min, Math.min(T, Math.round(cw * T / 12)));
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    CATS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-pressed', tab === c.id ? 'true' : 'false');
      b.setAttribute('aria-selected', tab === c.id ? 'true' : 'false');
      b.innerHTML = c.name + '<span class="cnt">' + seqOf(c.id).length + '</span>';
      b.addEventListener('click', function () {
        tab = c.id;
        try { history.replaceState(null, '', '#' + c.id); } catch (e) {}
        render();
        window.scrollTo(0, 0);
      });
      tabsEl.appendChild(b);
    });
  }

  function layout() {
    var T = cols(), gap = 20, W = grid.clientWidth || 1184, colW = (W - (T - 1) * gap) / T;
    grid.style.gridTemplateColumns = 'repeat(' + T + ', minmax(0, 1fr))';
    grid.style.columnGap = gap + 'px';
    Array.prototype.forEach.call(grid.children, function (card, k) {
      var t = seq[k], sp = span(t, T), w = colW * sp + (sp - 1) * gap, capOn = !!t.cap;
      card.style.gridColumn = 'span ' + sp;
      card.style.gridRowEnd = 'span ' + Math.ceil((w / aspect(t) + (capOn ? 30 : 0) + gap * 1.4) / 4);
    });
  }

  function render() {
    seq = seqOf(tab);
    title.textContent = catName(tab);
    renderTabs();
    grid.innerHTML = seq.map(function (t, k) {
      var no = pad(k), alt = catName(t.cat) + ' sample ' + no;
      return '<article class="kcard"><button type="button" class="kframe knit" data-i="' + k + '" style="aspect-ratio:' + aspect(t).toFixed(4) + '" aria-label="Sample ' + no + ': view larger">' + frameInner(t, alt) + '</button>' +
        (t.cap ? '<p class="kcap"><span class="num">' + no + '</span><span>' + t.cap.replace(/</g, '&lt;') + '</span></p>' : '') + '</article>';
    }).join('');
    layout();
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.kframe');
    if (b) open(parseInt(b.getAttribute('data-i'), 10));
  });

  var lastFocus = null;
  function open(k) {
    if (!seq.length) return;
    lb = ((k % seq.length) + seq.length) % seq.length;
    var t = seq[lb], A = aspect(t), no = pad(lb);
    lbFrame.style.aspectRatio = A.toFixed(4);
    lbFrame.style.width = 'min(92vw, calc((100vh - 170px) * ' + A.toFixed(4) + '))';
    lbFrame.innerHTML = frameInner(t, catName(tab) + ' sample ' + no).replace(' loading="lazy"', '');
    document.getElementById('lb-no').textContent = no;
    document.getElementById('lb-of').textContent = 'of ' + seq.length + ' · ' + catName(tab);
    document.getElementById('lb-cap').textContent = t.cap || '';
    if (lbx.hidden) { lastFocus = document.activeElement; lbx.hidden = false; document.getElementById('lb-close').focus(); }
  }
  function close() { lbx.hidden = true; lb = -1; if (lastFocus) lastFocus.focus(); }
  document.getElementById('lb-prev').addEventListener('click', function () { open(lb - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { open(lb + 1); });
  document.getElementById('lb-close').addEventListener('click', close);
  lbx.addEventListener('click', function (e) { if (e.target === lbx) close(); });
  document.addEventListener('keydown', function (e) {
    if (lbx.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(lb - 1);
    if (e.key === 'ArrowRight') open(lb + 1);
  });

  var rt = null;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 80); });

  var h = (location.hash || '').slice(1);
  if (CATS.some(function (c) { return c.id === h; })) tab = h;
  render();
})();
