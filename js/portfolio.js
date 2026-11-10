// Portfolio page viewer: arrows, thumbnails and keyboard.
(function () {
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb'));
  var img = document.getElementById('pf-img');
  var count = document.getElementById('pf-count');
  if (!thumbs.length || !img) return;
  var srcs = thumbs.map(function (t) { return t.querySelector('img').getAttribute('src'); });
  var n = srcs.length, i = 0;
  function show(k) {
    i = ((k % n) + n) % n;
    img.src = srcs[i];
    img.alt = 'Portfolio page ' + (i + 1) + ' of ' + n;
    count.textContent = (i + 1) + ' / ' + n;
    thumbs.forEach(function (t, j) { t.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    // Warm the next page so arrowing feels instant.
    var pre = new Image(); pre.src = srcs[(i + 1) % n];
  }
  thumbs.forEach(function (t, j) { t.addEventListener('click', function () { show(j); }); });
  document.getElementById('pf-prev').addEventListener('click', function () { show(i - 1); });
  document.getElementById('pf-next').addEventListener('click', function () { show(i + 1); });
  document.addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();
