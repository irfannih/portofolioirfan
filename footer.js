/* =====================================================
   footer.js  |  tahun otomatis + link footer ikut link di bagian Kontak
   WAJIB dimuat SETELAH main.js
   ===================================================== */
document.getElementById('yr').textContent = new Date().getFullYear();

[['fWa', 'cWa'], ['fMail', 'cMail'], ['fIg', 'cIg'], ['fTt', 'cTt']].forEach(function (p) {
  const f = document.getElementById(p[0]);
  const c = document.getElementById(p[1]);
  if (f && c) {
    f.href = c.href;
    if (c.target) { f.target = '_blank'; f.rel = 'noopener'; }
  }
});
