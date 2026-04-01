(function () {
  var psNote  = document.getElementById('psNote');
  var contact = document.getElementById('contact');
  if (!psNote || !contact) return;

  psNote.innerHTML =
    '<span class="ps-draw">P.S. Think you can</span>' +
    '<span class="ps-draw">beat my score?</span>' +
    '<span class="ps-draw">No pressure either way —</span>' +
    '<span class="ps-draw">the email works too.</span>';

  var observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      psNote.classList.add('is-drawing');
      observer.disconnect();
    }
  }, { threshold: 0.25 });

  observer.observe(contact);
}());
