/* =====================================================
   hero-text.js  |  memecah teks hero jadi huruf-huruf untuk animasi
   WAJIB dimuat SETELAH main.js
   ===================================================== */
(function () {
  const targets = [
    document.querySelector('.hello'),                 // "Welcome To Portofolio"
    ...document.querySelectorAll('#heroName span')    // "Ahmad" dan "Irfan"
  ];
  let n = 0;

  targets.forEach(function (el) {
    if (!el) return;
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';

    [...text].forEach(function (ch) {
      const s = document.createElement('span');
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch === ' ' ? '\u00A0' : ch;
      s.style.setProperty('--d', (0.2 + n * 0.055) + 's');   // jeda antar huruf
      n++;
      el.appendChild(s);
    });
  });
})();
