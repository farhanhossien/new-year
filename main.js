(function () {
  'use strict';
  var intro = document.getElementById('intro');
  var site = document.getElementById('site');
  var enterBtn = document.getElementById('enter');
  var menu = document.getElementById('menu');
  var links = document.getElementById('links');

  // ---- Intro -> main site (shown on every fresh load, nothing stored) ----
  var entered = false;
  function enterSite() {
    if (entered) return;
    entered = true;
    site.hidden = false;
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    intro.classList.add('leaving');
    setTimeout(function () { intro.hidden = true; }, 950);
    initReveal();
    var h = document.getElementById('home');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  enterBtn.addEventListener('click', enterSite);

  // ---- Mobile menu ----
  menu.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Scroll reveal ----
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('show'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { obs.observe(el); });
  }

  // ---- Missing photo -> clear placeholder (never a misleading stand-in) ----
  function markMissing(img) {
    var fig = img.closest('.ph');
    if (fig) fig.classList.add('missing');
  }
  document.querySelectorAll('.ph img').forEach(function (img) {
    img.addEventListener('error', function () { markMissing(img); });
    if (img.complete && img.naturalWidth === 0) markMissing(img);
  });

  // ---- Gallery lightbox ----
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('img');
  var boxCap = box.querySelector('p');
  function closeBox() { box.hidden = true; boxImg.removeAttribute('src'); }
  document.querySelectorAll('.gallery .ph').forEach(function (fig) {
    fig.addEventListener('click', function () {
      if (fig.classList.contains('missing')) return;
      var img = fig.querySelector('img');
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      boxCap.textContent = img.alt;
      box.hidden = false;
    });
  });
  box.addEventListener('click', function (e) { if (e.target !== boxImg) closeBox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeBox(); });
})();
