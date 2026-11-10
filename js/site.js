// Contact drawer at the bottom of every page.
(function () {
  var hem = document.querySelector('.hem');
  if (!hem) return;
  var toggles = document.querySelectorAll('[data-contact-toggle]');
  var cue = hem.querySelector('.hemtab');
  function set(open) {
    hem.classList.toggle('open', open);
    toggles.forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    if (cue) cue.textContent = open ? 'Contact ↓' : 'Contact ↑';
    document.documentElement.classList.toggle('contact-open', open);
  }
  toggles.forEach(function (b) {
    b.addEventListener('click', function () { set(!hem.classList.contains('open')); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hem.classList.contains('open')) set(false);
  });
})();
