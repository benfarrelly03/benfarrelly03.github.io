// Home montage: one large image with the two previous and two next pieces at the sides.
(function () {
  var items = window.MONTAGE || [];
  var n = items.length;
  if (!n) return;
  var i = 0, paused = false;
  var root = document.getElementById('montage');
  var main = document.getElementById('eg-main');
  var label = document.getElementById('eg-label');
  var count = document.getElementById('eg-count');
  var dots = document.getElementById('eg-dots');
  var sides = root.querySelectorAll('.egs');

  // Stack every slide in the main frame so changes cross-fade.
  var layers = items.map(function (it, k) {
    var img = document.createElement('img');
    img.className = 'layer';
    img.src = it.src;
    img.alt = it.alt;
    img.loading = k < 2 ? 'eager' : 'lazy';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:' + (it.fit || 'cover') + ';opacity:' + (k === 0 ? 1 : 0);
    main.appendChild(img);
    return img;
  });

  var dotBtns = items.map(function (it, k) {
    var b = document.createElement('button');
    b.className = 'st';
    b.type = 'button';
    b.setAttribute('aria-label', 'Image ' + (k + 1));
    b.innerHTML = '<svg viewBox="0 0 10 8" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M1 1.5l4 5 4-5"/></svg>';
    b.addEventListener('click', function () { show(k); });
    dots.appendChild(b);
    return b;
  });

  function at(k) { return items[((i + k) % n + n) % n]; }

  function show(k) {
    i = ((k % n) + n) % n;
    layers.forEach(function (img, j) { img.style.opacity = j === i ? 1 : 0; });
    var offs = [-2, -1, 1, 2];
    sides.forEach(function (b, j) {
      var it = at(offs[j]);
      var img = b.querySelector('img');
      img.src = it.src;
      b.setAttribute('aria-label', 'Show ' + it.label);
    });
    label.textContent = items[i].label;
    count.textContent = (i + 1) + ' / ' + n;
    dotBtns.forEach(function (b, j) {
      var on = j === i;
      b.setAttribute('aria-current', on ? 'true' : 'false');
      var svg = b.firstChild;
      svg.setAttribute('width', on ? 14 : 9);
      svg.setAttribute('height', on ? 11 : 7);
    });
  }

  root.querySelectorAll('[data-go]').forEach(function (b) {
    b.addEventListener('click', function () { show(i + parseInt(b.getAttribute('data-go'), 10)); });
  });
  root.addEventListener('mouseenter', function () { paused = true; });
  root.addEventListener('mouseleave', function () { paused = false; });

  // Swipe on phones.
  var sx = null;
  root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    sx = null;
  });

  show(0);
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (!reduce) {
    setInterval(function () {
      if (!paused && !document.documentElement.classList.contains('contact-open') && !document.hidden) show(i + 1);
    }, (window.MONTAGE_INTERVAL || 11) * 1000);
  }
})();
