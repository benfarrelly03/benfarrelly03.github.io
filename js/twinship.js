// Highlight the section you are reading in the Twinship sub-navigation.
(function () {
  var links = document.querySelectorAll('[data-sec]');
  if (!links.length) return;
  var ids = Array.prototype.map.call(links, function (a) { return a.getAttribute('data-sec'); });
  var current = null;
  function update() {
    var active = ids[0];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < 180) active = id;
    });
    if (active === current) return;
    current = active;
    links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('data-sec') === active ? 'true' : 'false'); });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
