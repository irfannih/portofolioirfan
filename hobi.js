(function () {
  const sec = document.getElementById('hobi');
  if (!sec) return;

  /* ============ PENGATURAN: ubah di sini ============
     n = judul | e = emoji | d = keterangan | s = warna cadangan (s1 s2 s3 s4)
     Foto diambil dari ASSETS.hobi di config.js (urutannya sama) */
  const HOBI = [
    { n: 'Futsal',    e: '',  d: 'Hobii yang paling aku sukaa bermain bola sejak smp',        s: 's1' },
    { n: 'Nongkrong', e: '',  d: 'bukan hobi si lebih ke aktivitas sosial.',          s: 's2' },
    { n: 'Traveling', e: '', d: 'Mendaki ke alam Ranu Regulo.',              s: 's3' },
    { n: 'Gamers',    e: '',  d: 'game pertama yang bikin aku banyak kenangan yg gabisa dilupakan semenjak di tahun 2020 , Free fire cinta saya',                      s: 's4' },
    { n: 'Developer', e: '',  d: 'Membuat suatu project website dan design.', s: 's1' },
    { n: 'Badminton', e: '',  d: 'Badminton bareng sama teman kampus',        s: 's2' }
  ];
  const RASIO = '4 / 5';   // bentuk kartu: '4 / 5' (agak tegak) | '3 / 4' | '1 / 1' (kotak) | '4 / 3' (melebar)
  const FIT   = 'cover';   // 'cover' = foto memenuhi kartu | 'contain' = foto tampil utuh
  const AUTO  = true;      // pindah otomatis
  const DETIK = 5;         // jeda pindah otomatis

  const photos = (typeof ASSETS !== 'undefined' && ASSETS.hobi) || [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = HOBI.length;

  /* ---------- CSS ---------- */
  const css = document.createElement('style');
  css.id = 'hobi-style';
  css.textContent = `
#hobi .hobi-stage, #hobi .hnav{ display:none !important; }

.dkw{
  display:grid;
  grid-template-columns:minmax(0,420px) 1fr;
  column-gap:clamp(30px,11vw,150px);   /* ruang untuk tumpukan kartu di belakang */
  row-gap:34px;
  align-items:center;
  margin-top:10px;
}

/* ----- tumpukan kartu ----- */
.dk{
  position:relative;
  width:100%;
  max-width:420px;
  aspect-ratio:${RASIO};
  perspective:1400px;
  touch-action:pan-y;
  user-select:none;
  -webkit-user-select:none;
}
.dc{
  position:absolute; inset:0;
  border-radius:30px;
  overflow:hidden;
  background:#0a1240;
  border:1px solid rgba(255,255,255,.22);
  box-shadow:0 30px 60px rgba(0,0,0,.5);
  transform-origin:50% 100%;
  transition:transform .85s cubic-bezier(.2,.9,.2,1), opacity .6s, box-shadow .6s;
  will-change:transform;
}
.dc.front{ cursor:grab; box-shadow:0 40px 90px rgba(61,107,255,.5), 0 0 0 1px rgba(255,255,255,.1); }
.dc.front.grab{ cursor:grabbing; }
.dc:not(.front){ cursor:pointer; }
.dc-bg{ position:absolute; inset:0; }
.dc-bg img{ width:100%; height:100%; object-fit:${FIT}; display:block; pointer-events:none; }
.dc-bg.s1,.dc-bg.s2,.dc-bg.s3,.dc-bg.s4{ display:grid; place-items:center; font-size:96px; }
.dc-bg.s1::after,.dc-bg.s2::after,.dc-bg.s3::after,.dc-bg.s4::after{
  content:""; position:absolute; inset:0;
  background:repeating-linear-gradient(45deg,rgba(255,255,255,.07) 0 12px,transparent 12px 24px);
}
.dc-shade{
  position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(180deg,rgba(5,13,51,.0) 55%,rgba(5,13,51,.8) 100%);
}
.dc-glare{
  position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .3s;
  background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.35),transparent 55%);
}
.dc.front:hover .dc-glare{ opacity:1; }
.dc-tag{
  position:absolute; left:18px; bottom:18px;
  padding:7px 16px; border-radius:99px;
  font-family:var(--head); font-weight:700; font-size:18px; color:#fff;
  background:rgba(6,17,63,.6); border:1px solid rgba(255,255,255,.3);
  backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  opacity:0; transition:opacity .4s .2s;
}
.dc.front .dc-tag{ opacity:1; }

/* ----- info di sebelah ----- */
.di{ min-width:0; }
.di-top{ display:flex; align-items:baseline; gap:10px; font-family:var(--head); font-weight:700; }
.di-no{
  font-size:clamp(70px,10vw,130px); line-height:.9;
  color:transparent; -webkit-text-stroke:1.5px rgba(255,255,255,.55);
}
.di-of{ font-size:22px; color:var(--muted); }
.di-e{
  display:inline-grid; place-items:center;
  width:60px; height:60px; border-radius:18px; font-size:30px;
  background:var(--panel); border:1px solid var(--line);
  margin-left:auto;
  animation:diBob 4s ease-in-out infinite;
}
@keyframes diBob{ 0%,100%{ translate:0 0; } 50%{ translate:0 -8px; } }
.di-t{
  margin:14px 0 10px;
  font-family:var(--head); font-weight:700;
  font-size:clamp(40px,6vw,76px); line-height:1;
  background:linear-gradient(90deg,#fff,#9fc0ff 70%,#f6dcc8);
  -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; color:transparent;
}
.di-d{ margin:0 0 26px; max-width:46ch; font-size:17px; line-height:1.7; color:var(--muted); }

.di.swap .di-no, .di.swap .di-t, .di.swap .di-d{ animation:diIn .7s cubic-bezier(.2,.9,.2,1) both; }
.di.swap .di-t{ animation-delay:.06s; }
.di.swap .di-d{ animation-delay:.12s; }
@keyframes diIn{ from{ opacity:0; transform:translateY(28px); filter:blur(6px); } }

/* pilihan cepat */
.di-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:26px; }
.di-chips button{
  font:inherit; font-size:14px; padding:7px 16px; border-radius:99px; cursor:pointer;
  color:var(--text); background:var(--panel); border:1px solid var(--line);
  transition:background .25s, transform .25s, border-color .25s;
}
.di-chips button:hover{ transform:translateY(-3px); background:rgba(255,255,255,.12); }
.di-chips button.on{ background:var(--accent); border-color:var(--accent); color:#fff; }

/* tombol panah */
.di-ctl{ display:flex; align-items:center; gap:12px; }
.di-ctl button{
  width:52px; height:52px; border-radius:50%; font-size:22px; cursor:pointer;
  color:var(--text); background:var(--panel); border:1px solid var(--line);
  transition:transform .25s, background .25s;
}
.di-ctl button:hover{ background:var(--accent); color:#fff; transform:scale(1.1); }
.di-hint{ font-size:13px; color:var(--muted); margin-left:6px; }

@media(max-width:860px){
  .dkw{ grid-template-columns:1fr; }
  .dk{ width:min(62vw,320px); margin:0 auto 0 8vw; }
  .di{ text-align:left; }
}
@media(prefers-reduced-motion:reduce){ .di-e{ animation:none; } }
`;
  document.head.appendChild(css);

  /* ---------- bersihkan tampilan hobi lama ---------- */
  sec.querySelectorAll('.hobi-stage, .hnav, .hx').forEach(function (el) { el.remove(); });
  const lead = sec.querySelector('.lead');
  if (lead) lead.textContent = 'Hal-hal yang bikin aku semangat. Geser kartunya atau klik panah untuk melihat hobi lainnya.';

  /* ---------- memuat foto (coba beberapa ekstensi) ---------- */
  function loadPhoto(base, ok) {
    if (!base) return;
    const exts = ['png', 'webp', 'jpg', 'jpeg']; let i = 0;
    (function next() {
      if (i >= exts.length) return;
      const im = new Image(), src = base + '.' + exts[i++];
      im.onload = function () { ok(src); }; im.onerror = next; im.src = src;
    })();
  }

  /* ---------- kerangka ---------- */
  const root = document.createElement('div');
  root.className = 'dkw';
  root.innerHTML =
    '<div class="dk" id="dk"></div>' +
    '<div class="di swap" id="di">' +
      '<div class="di-top"><span class="di-no" id="diNo">01</span><span class="di-of">/ ' + String(N).padStart(2, '0') + '</span><span class="di-e" id="diE"></span></div>' +
      '<h3 class="di-t" id="diT"></h3>' +
      '<p class="di-d" id="diD"></p>' +
      '<div class="di-chips" id="diChips"></div>' +
      '<div class="di-ctl"><button type="button" id="diPrev" aria-label="Hobi sebelumnya">←</button>' +
      '<button type="button" id="diNext" aria-label="Hobi berikutnya">→</button>' +
      '</div>' +
    '</div>';
  sec.appendChild(root);

  const dk = root.querySelector('#dk'), di = root.querySelector('#di');
  const diNo = root.querySelector('#diNo'), diE = root.querySelector('#diE');
  const diT = root.querySelector('#diT'), diD = root.querySelector('#diD');
  const chipsBox = root.querySelector('#diChips');

  const cards = [], chips = [];
  HOBI.forEach(function (h, i) {
    const c = document.createElement('div');
    c.className = 'dc';
    c.setAttribute('aria-label', h.n);
    c.innerHTML =
      '<div class="dc-bg ' + h.s + '">' + h.e + '</div>' +
      '<div class="dc-shade"></div><div class="dc-glare"></div>' +
      '<span class="dc-tag">' + h.e + ' ' + h.n + '</span>';
    const bg = c.querySelector('.dc-bg');
    loadPhoto(photos[i], function (src) {
      const im = new Image(); im.src = src; im.alt = 'Foto hobi ' + h.n; im.draggable = false;
      bg.className = 'dc-bg'; bg.textContent = ''; bg.appendChild(im);
    });
    dk.appendChild(c); cards.push(c);

    const b = document.createElement('button');
    b.type = 'button'; b.textContent = h.n;
    b.addEventListener('click', function () { go(i); });
    chipsBox.appendChild(b); chips.push(b);
  });

  /* ---------- posisi tiap kartu ---------- */
  let cur = 0, tiltX = 0, tiltY = 0, dragX = 0, dragging = false;

  function pose(off, sp) {
    if (off === 0) return { x: 0, y: 0, z: 0, r: 0, s: 1, o: 1 };
    if (N > 2 && off === N - 1) return { x: -sp * 3.2, y: 24, z: -40, r: -16, s: .95, o: 0 };   // baru lewat: terbang ke kiri
    if (off <= 3) return { x: off * sp, y: -off * 12, z: -off * 90, r: off * 4.5, s: 1 - off * .055, o: 1 - off * .2 };
    return { x: 3 * sp + 20, y: -48, z: -300, r: 15, s: .8, o: 0 };                              // sembunyi di belakang
  }

  function apply() {
    const sp = dk.clientWidth * 0.105;
    cards.forEach(function (c, i) {
      const off = (i - cur + N) % N;
      const p = pose(off, sp);
      let t = 'translate3d(' + p.x + 'px,' + p.y + 'px,' + p.z + 'px) rotate(' + p.r + 'deg) scale(' + p.s + ')';
      if (off === 0) {
        t = 'translate3d(' + dragX + 'px,0,0) rotate(' + (dragX * 0.05) + 'deg) rotateY(' + tiltY + 'deg) rotateX(' + tiltX + 'deg)';
      }
      c.style.transform = t;
      c.style.opacity = p.o;
      c.style.zIndex = 100 - off;
      c.style.pointerEvents = (off <= 3 && off !== N - 1) ? 'auto' : 'none';
      c.classList.toggle('front', off === 0);
    });
  }

  function showInfo() {
    const h = HOBI[cur];
    diNo.textContent = String(cur + 1).padStart(2, '0');
    diE.textContent = h.e; diT.textContent = h.n; diD.textContent = h.d;
    chips.forEach(function (b, i) { b.classList.toggle('on', i === cur); });
    di.classList.remove('swap'); void di.offsetWidth; di.classList.add('swap');   // ulangi animasi teks
  }

  function go(i) {
    cur = ((i % N) + N) % N;
    dragX = 0; tiltX = 0; tiltY = 0;
    apply(); showInfo(); restart();
  }

  /* ---------- geser kartu depan ---------- */
  let startX = 0, moved = false;
  dk.addEventListener('pointerdown', function (e) {
    const front = cards[cur];
    if (!front.contains(e.target)) return;
    dragging = true; moved = false; startX = e.clientX; dragX = 0;
    front.style.transition = 'none'; front.classList.add('grab');
    dk.setPointerCapture(e.pointerId);
  });
  dk.addEventListener('pointermove', function (e) {
    const front = cards[cur];
    if (dragging) {
      dragX = e.clientX - startX;
      if (Math.abs(dragX) > 6) moved = true;
      apply();
      return;
    }
    if (e.pointerType !== 'mouse' || reduce) return;
    const r = front.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    tiltY = (x - .5) * 14; tiltX = (.5 - y) * 12;
    front.style.setProperty('--gx', x * 100 + '%'); front.style.setProperty('--gy', y * 100 + '%');
    front.style.transition = 'transform .15s ease-out, opacity .6s, box-shadow .6s';
    apply();
  });
  function endDrag() {
    const front = cards[cur];
    if (dragging) {
      dragging = false; front.classList.remove('grab'); front.style.transition = '';
      if (dragX < -70) go(cur + 1);
      else if (dragX > 70) go(cur - 1);
      else { dragX = 0; apply(); }
    }
  }
  dk.addEventListener('pointerup', endDrag);
  dk.addEventListener('pointercancel', endDrag);
  dk.addEventListener('pointerleave', function () {
    if (dragging) return;
    tiltX = 0; tiltY = 0; cards[cur].style.transition = ''; apply();
  });

  /* klik kartu di belakang = bawa ke depan */
  cards.forEach(function (c, i) {
    c.addEventListener('click', function () { if (!moved && i !== cur) go(i); moved = false; });
  });

  root.querySelector('#diPrev').addEventListener('click', function () { go(cur - 1); });
  root.querySelector('#diNext').addEventListener('click', function () { go(cur + 1); });
  sec.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });

  /* ---------- pindah otomatis ---------- */
  let timer = null, hover = false;
  function restart() {
    clearInterval(timer);
    if (!AUTO || reduce) return;
    timer = setInterval(function () { if (!hover && !dragging) go(cur + 1); }, DETIK * 1000);
  }
  root.addEventListener('pointerenter', function () { hover = true; });
  root.addEventListener('pointerleave', function () { hover = false; });

  addEventListener('resize', apply);
  apply(); showInfo(); restart();
})();