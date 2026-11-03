(function () {
  const home = document.getElementById('home');
  if (!home) return;

  /* ============ PENGATURAN: ubah di sini ============ */
  const PERAN  = ['Content Creator', 'High-Achieving Student', 'Penerima Beasiswa'];   // teks yang diketik bergantian
  const BADGE  = 'Terbuka untuk kolaborasi';
  const CHIPS  = [                                                                      // kartu kaca yang melayang di sekitar foto
    { t: 'Content Creator',        e: '🎬' },
    { t: 'High-Achieving Student', e: '🎓' },
    { t: 'Beasiswa',               e: '🏅' }
  ];
  const CINCIN = 'CONTENT CREATOR ✦ HIGH-ACHIEVING STUDENT ✦ PENERIMA BEASISWA ✦ ';    // tulisan yang berputar mengelilingi foto
  const TOMBOL1 = ['Lihat Portofolio →', '#portofolio'];
  const TOMBOL2 = ['Hubungi Saya', '#kontak'];

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover:hover)').matches;

  /* ---------- ambil data dari hero lama ---------- */
  function txt(el) { return el ? (el.getAttribute('aria-label') || el.textContent).replace(/\u00A0/g, ' ').trim() : ''; }
  const nameSpans = [...document.querySelectorAll('#heroName > span')].map(txt).filter(Boolean);
  const NAMA  = nameSpans.length ? nameSpans : ['Ahmad', 'Irfan'];
  const HELLO = txt(document.querySelector('.hello')) || 'Welcome To Portofolio';
  const aboutP = document.querySelector('.aboutme p');
  const ABOUT = aboutP ? aboutP.textContent.trim() : 'Mahasiswa yang percaya bahwa setiap proses belajar dan pencapaian layak untuk dibagikan.';
  const oldImg = document.getElementById('img');
  const FOTO  = oldImg ? oldImg.getAttribute('src') : '';
  const socials = [...document.querySelectorAll('.aboutme .socials a')].map(function (a) { return a.cloneNode(true); });
  const heroMode  = (typeof ASSETS !== 'undefined' && ASSETS.heroMode) || 'soft';
  const heroY     = (typeof ASSETS !== 'undefined' && ASSETS.heroY) || '0%';
  const heroScale = (typeof ASSETS !== 'undefined' && ASSETS.heroScale) || 1;
  const next = home.nextElementSibling;
  const nextId = next && next.id ? '#' + next.id : '#hobi';

  /* ---------- CSS ---------- */
  const css = document.createElement('style');
  css.id = 'hero-style';
  css.textContent = `
#home.hero2{
  display:grid;
  grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);
  align-items:center;
  gap:clamp(20px,4vw,70px);
  min-height:100vh; min-height:100svh;
  max-width:1360px; margin:0 auto;
  padding:96px 6vw 50px;
  perspective:none;
  position:relative;
}

/* ===== teks kiri ===== */
.h2-copy{ position:relative; z-index:3; min-width:0; }
.h2-badge{
  display:inline-flex; align-items:center; gap:10px;
  padding:7px 16px; border-radius:99px; font-size:13.5px;
  background:var(--panel); border:1px solid var(--line);
  backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  animation:h2up .8s .1s cubic-bezier(.2,.9,.2,1) both;
}
.h2-badge i{
  width:8px; height:8px; border-radius:50%; background:#2ee59d;
  box-shadow:0 0 0 0 rgba(46,229,157,.7); animation:h2pulse 1.8s infinite;
}
@keyframes h2pulse{ 70%{ box-shadow:0 0 0 10px rgba(46,229,157,0); } 100%{ box-shadow:0 0 0 0 rgba(46,229,157,0); } }
.h2-hello{
  display:flex; align-items:center; gap:14px;
  margin:20px 0 4px; font-family:var(--head); font-weight:600; font-size:clamp(18px,2vw,24px); letter-spacing:.5px;
  animation:h2up .8s .25s cubic-bezier(.2,.9,.2,1) both;
}
.h2-hello::before{ content:""; width:46px; height:3px; border-radius:3px; background:var(--accent); box-shadow:0 0 14px var(--accent); }

.h2-name{
  margin:0 0 14px; font-family:var(--head); font-weight:700;
  font-size:clamp(54px,7.8vw,120px); line-height:.92; letter-spacing:-1px;
}
.h2-name .ln{ display:block; }
.h2-name .ln.b .hc{ color:transparent; -webkit-text-stroke:2px #b9ccff; }
.hc{
  display:inline-block;
  transform-origin:50% 100%;
  animation:
    hcIn .9s cubic-bezier(.2,.9,.2,1) both,
    hcWave 3.4s ease-in-out infinite;
  animation-delay: var(--d), calc(var(--d) + 1.5s);
  transition:color .25s, -webkit-text-stroke-color .25s;
  cursor:default;
}
.h2-name .ln.a .hc{ color:#eef2ff; text-shadow:0 0 40px rgba(61,107,255,.55); }
.hc:hover{ color:var(--accent) !important; -webkit-text-stroke-color:var(--accent) !important; }
@keyframes hcIn{
  from{ opacity:0; transform:perspective(600px) translateY(70%) rotateX(-90deg) scale(.6); filter:blur(10px); }
  60%{ opacity:1; filter:blur(0); }
}
@keyframes hcWave{ 0%,100%{ translate:0 0; } 50%{ translate:0 -8px; } }

.h2-role{
  display:flex; align-items:center; gap:6px; margin:0 0 18px; min-height:1.6em;
  font-family:var(--head); font-weight:600; font-size:clamp(20px,2.4vw,30px); color:#9fc0ff;
  animation:h2up .8s .9s cubic-bezier(.2,.9,.2,1) both;
}
.h2-role::before{ content:"> "; color:var(--accent); font-weight:700; }
.h2-role .caret{ display:inline-block; width:3px; height:1.1em; background:var(--cream); animation:h2blink 1s steps(1) infinite; }
@keyframes h2blink{ 50%{ opacity:0; } }
.h2-about{
  max-width:56ch; margin:0 0 24px; color:var(--muted); font-size:15.5px; line-height:1.7;
  animation:h2up .8s 1.05s cubic-bezier(.2,.9,.2,1) both;
}
.h2-cta{ display:flex; flex-wrap:wrap; gap:14px; margin-bottom:24px; animation:h2up .8s 1.2s cubic-bezier(.2,.9,.2,1) both; }
.h2-soc{ display:flex; align-items:center; gap:12px; animation:h2up .8s 1.35s cubic-bezier(.2,.9,.2,1) both; }
.h2-soc > span{ font-size:14px; color:var(--muted); margin-right:4px; }
@keyframes h2up{ from{ opacity:0; transform:translateY(30px); filter:blur(6px); } }

/* ===== panggung foto 3D kanan ===== */
.h2-stage{
  position:relative; z-index:2;
  height:min(80vh,720px); min-height:440px;
  display:grid; place-items:end center;
  perspective:1300px;
}
.h2-rig{
  position:relative; width:min(100%,500px); height:100%;
  transform-style:preserve-3d;
  transform:rotateY(calc(var(--mx,0) * 14deg)) rotateX(calc(var(--my,0) * -9deg));
  transition:transform .25s ease-out;
}
.h2-aurora{
  position:absolute; left:50%; top:48%; width:118%; aspect-ratio:1; translate:-50% -50%;
  transform:translateZ(-160px);
  background:
    radial-gradient(circle at 30% 30%, rgba(61,107,255,.95), transparent 58%),
    radial-gradient(circle at 72% 62%, rgba(255,46,77,.55), transparent 52%),
    radial-gradient(circle at 45% 80%, rgba(159,192,255,.45), transparent 55%);
  filter:blur(46px); opacity:.9;
  animation:h2morph 11s ease-in-out infinite;
}
@keyframes h2morph{
  0%,100%{ border-radius:50% 50% 50% 50%; rotate:0deg; scale:1; }
  33%{ border-radius:62% 38% 55% 45%; rotate:30deg; scale:1.06; }
  66%{ border-radius:42% 58% 40% 60%; rotate:-24deg; scale:.96; }
}
.h2-disc{
  position:absolute; left:50%; top:50%; width:92%; aspect-ratio:1; translate:-50% -50%;
  transform:translateZ(-80px); border-radius:50%;
  border:1px solid rgba(255,255,255,.22);
  background:radial-gradient(circle at 50% 38%, rgba(255,255,255,.12), rgba(255,255,255,.02) 65%);
  box-shadow:inset 0 0 60px rgba(61,107,255,.25);
}
.h2-orbit{
  position:absolute; left:50%; top:50%; width:108%; aspect-ratio:1; translate:-50% -50%;
  transform:translateZ(-110px); border-radius:50%;
  border:1.5px dashed rgba(159,192,255,.45);
  animation:h2spin 40s linear infinite;
}
.h2-orbit::after{
  content:""; position:absolute; top:-7px; left:50%; width:14px; height:14px; margin-left:-7px; border-radius:50%;
  background:var(--accent); box-shadow:0 0 18px 4px var(--accent);
}
@keyframes h2spin{ to{ rotate:360deg; } }
.h2-ringtext{
  position:absolute; left:50%; top:50%; width:118%; aspect-ratio:1; translate:-50% -50%;
  transform:translateZ(-60px); animation:h2spin 30s linear infinite reverse; overflow:visible;
}
.h2-ringtext text{ font-family:var(--head); font-weight:700; font-size:19px; letter-spacing:3px; fill:rgba(255,255,255,.5); }

.h2-photo{
  position:absolute; inset:0; display:grid; place-items:end center; pointer-events:none;
  transform:translateZ(80px);
  translate:calc(var(--mx,0) * -12px) calc(var(--my,0) * -8px);
}
.h2-photo img{
  height:100%; width:auto; max-width:100%; object-fit:contain; object-position:bottom; display:block;
  transform:translateY(var(--y,0%)) scale(var(--s,1)); transform-origin:50% 100%;
  filter:drop-shadow(0 30px 40px rgba(0,0,0,.55));
  animation:h2rise 1.2s .3s cubic-bezier(.2,.9,.2,1) both;
  -webkit-mask-image:linear-gradient(#000 84%,transparent 100%); mask-image:linear-gradient(#000 84%,transparent 100%);
}
.h2-photo.soft img{
  filter:none;
  -webkit-mask-image:radial-gradient(ellipse 50% 56% at 50% 44%,#000 52%,transparent 100%);
          mask-image:radial-gradient(ellipse 50% 56% at 50% 44%,#000 52%,transparent 100%);
}
@keyframes h2rise{ from{ opacity:0; transform:translateY(90px) scale(.94); filter:blur(14px); } }
.h2-empty{
  align-self:center; width:70%; padding:26px; text-align:center; font-size:14px; color:var(--muted);
  border:2px dashed rgba(255,255,255,.35); border-radius:30px; background:rgba(255,255,255,.04);
}
.h2-empty b{ display:block; font-family:var(--head); font-size:22px; color:var(--text); margin-bottom:4px; }

/* kartu kaca melayang */
.h2-chip{
  position:absolute; z-index:5; display:flex; align-items:center; gap:10px;
  padding:10px 16px 10px 10px; border-radius:18px; white-space:nowrap;
  font-family:var(--head); font-weight:700; font-size:17px; color:#fff;
  background:rgba(10,26,102,.55); border:1px solid rgba(255,255,255,.28);
  backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
  box-shadow:0 18px 40px rgba(0,0,0,.4);
  animation:h2pop .8s cubic-bezier(.2,1.4,.3,1) both, h2bob 5s ease-in-out infinite;
}
.h2-chip b{ display:grid; place-items:center; width:36px; height:36px; border-radius:12px; font-size:19px; background:rgba(255,255,255,.14); }
.h2-chip.c1{ left:-2%; top:20%;   transform:translateZ(170px); animation-delay:1.1s, 1.9s; }
.h2-chip.c2{ right:-3%; top:42%;  transform:translateZ(210px); animation-delay:1.3s, .6s; }
.h2-chip.c3{ left:2%; bottom:14%; transform:translateZ(150px); animation-delay:1.5s, 1.2s; }
@keyframes h2pop{ from{ opacity:0; scale:.5; } }
@keyframes h2bob{ 0%,100%{ translate:0 0; } 50%{ translate:0 -12px; } }
.h2-orb{
  position:absolute; right:8%; bottom:16%; width:46px; height:46px; border-radius:50%; z-index:5;
  background:radial-gradient(circle at 32% 30%,#ff9aa9,var(--accent) 55%,#8a0a22);
  box-shadow:0 14px 30px rgba(255,46,77,.5); transform:translateZ(240px);
  animation:h2bob 4s ease-in-out infinite;
}

/* petunjuk scroll */
.h2-scroll{
  position:absolute; left:50%; bottom:22px; translate:-50% 0; z-index:4;
  display:grid; justify-items:center; gap:8px; font-size:12px; letter-spacing:2px; color:var(--muted);
  animation:h2up .8s 1.8s both;
}
.h2-scroll i{ width:24px; height:38px; border-radius:14px; border:2px solid rgba(255,255,255,.4); position:relative; }
.h2-scroll i::after{
  content:""; position:absolute; left:50%; top:7px; width:4px; height:8px; margin-left:-2px; border-radius:3px;
  background:#fff; animation:h2wheel 1.6s ease-in-out infinite;
}
@keyframes h2wheel{ 0%{ opacity:0; transform:translateY(0); } 30%{ opacity:1; } 100%{ opacity:0; transform:translateY(14px); } }

/* goyang pelan di layar sentuh */
@media(hover:none){ .h2-rig{ animation:h2sway 7s ease-in-out infinite; } }
@keyframes h2sway{ 0%,100%{ transform:rotateY(-10deg) rotateX(2deg); } 50%{ transform:rotateY(10deg) rotateX(-2deg); } }

/* ===== HP dan tablet ===== */
@media(max-width:960px){
  #home.hero2{ grid-template-columns:1fr; padding-top:96px; gap:10px; }
  .h2-stage{ order:-1; height:min(56vh,470px); min-height:360px; }
  .h2-rig{ width:min(86%,400px); }
  .h2-chip{ font-size:13px; padding:7px 12px 7px 7px; gap:8px; white-space:normal; max-width:58%; line-height:1.15; }
  .h2-chip b{ width:28px; height:28px; font-size:15px; flex:none; }
  .h2-chip.c1{ left:0; } .h2-chip.c2{ right:0; } .h2-chip.c3{ left:2%; }
  .h2-name{ font-size:clamp(56px,17vw,110px); }
  .h2-scroll{ display:none; }
}
@media(prefers-reduced-motion:reduce){ .h2-rig{ animation:none !important; } }
`;
  document.head.appendChild(css);

  /* ---------- bangun hero baru ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function chars(word, start, cls) {
    return '<span class="ln ' + cls + '" aria-hidden="true">' + [...word].map(function (ch, i) {
      return '<span class="hc" style="--d:' + (start + i * 0.06).toFixed(2) + 's">' + (ch === ' ' ? '&nbsp;' : esc(ch)) + '</span>';
    }).join('') + '</span>';
  }
  const full = NAMA.join(' ');
  let t0 = 0.35, nameHTML = '';
  NAMA.forEach(function (w, idx) {
    nameHTML += chars(w, t0, idx % 2 === 0 ? 'a' : 'b');
    t0 += w.length * 0.06 + 0.15;
  });

  const ringId = 'h2ringpath';
  const r = 170, circ = Math.round(2 * Math.PI * r);

  home.classList.add('hero2');
  home.innerHTML =
    '<div class="h2-copy">' +
      '<span class="h2-badge"><i></i>' + esc(BADGE) + '</span>' +
      '<p class="h2-hello">' + esc(HELLO) + '</p>' +
      '<h1 class="h2-name" aria-label="' + esc(full) + '">' + nameHTML + '</h1>' +
      '<p class="h2-role"><span id="h2Typed"></span><i class="caret"></i></p>' +
      '<p class="h2-about">' + esc(ABOUT) + '</p>' +
      '<div class="h2-cta"><a class="btn" href="' + TOMBOL1[1] + '">' + esc(TOMBOL1[0]) + '</a>' +
      '<a class="btn ghost" href="' + TOMBOL2[1] + '">' + esc(TOMBOL2[0]) + '</a></div>' +
      '<div class="h2-soc" id="h2Soc"><span>Find me on</span></div>' +
    '</div>' +
    '<div class="h2-stage" id="h2Stage">' +
      '<div class="h2-rig" id="h2Rig">' +
        '<div class="h2-aurora"></div>' +
        '<div class="h2-disc"></div>' +
        '<div class="h2-orbit"></div>' +
        '<svg class="h2-ringtext" viewBox="0 0 400 400" aria-hidden="true"><defs>' +
          '<path id="' + ringId + '" d="M200,200 m-' + r + ',0 a' + r + ',' + r + ' 0 1,1 ' + (2 * r) + ',0 a' + r + ',' + r + ' 0 1,1 -' + (2 * r) + ',0"/></defs>' +
          '<text><textPath href="#' + ringId + '" textLength="' + (circ - 6) + '" lengthAdjust="spacing">' + esc(CINCIN) + '</textPath></text></svg>' +
        '<div class="h2-photo' + (heroMode === 'soft' ? ' soft' : '') + '" id="h2Photo"></div>' +
        CHIPS.slice(0, 3).map(function (c, i) {
          return '<div class="h2-chip c' + (i + 1) + '"><b>' + c.e + '</b>' + esc(c.t) + '</div>';
        }).join('') +
        '<div class="h2-orb"></div>' +
      '</div>' +
    '</div>' +
    '<a class="h2-scroll" href="' + nextId + '" aria-label="Turun ke bawah"><i></i>SCROLL</a>';

  /* ---------- foto ---------- */
  const photoBox = document.getElementById('h2Photo');
  photoBox.style.setProperty('--y', heroY);
  photoBox.style.setProperty('--s', heroScale);
  function noPhoto() {
    photoBox.innerHTML = '<div class="h2-empty"><b>Foto belum dipasang</b>Taruh fotomu di<br>' + esc(FOTO || 'assets/foto-utama') + '</div>';
  }
  if (FOTO) {
    const im = new Image();
    im.alt = 'Foto ' + full; im.draggable = false;
    im.onload = function () { photoBox.appendChild(im); };
    im.onerror = noPhoto;
    im.src = FOTO;
  } else noPhoto();

  /* ---------- ikon sosial dari hero lama ---------- */
  const soc = document.getElementById('h2Soc');
  socials.forEach(function (a) { soc.appendChild(a); });
  if (!socials.length) soc.hidden = true;

  /* ---------- teks diketik bergantian ---------- */
  const typed = document.getElementById('h2Typed');
  if (reduce) typed.textContent = PERAN[0];
  else {
    let w = 0, c = 0, del = false;
    (function tick() {
      const word = PERAN[w];
      c += del ? -1 : 1;
      typed.textContent = word.slice(0, c);
      let wait = del ? 35 : 75;
      if (!del && c === word.length) { wait = 1600; del = true; }
      else if (del && c === 0) { del = false; w = (w + 1) % PERAN.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  /* ---------- gerakan 3D mengikuti kursor ---------- */
  const rig = document.getElementById('h2Rig');
  if (canHover && !reduce) {
    home.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      const b = home.getBoundingClientRect();
      rig.style.setProperty('--mx', ((e.clientX - b.left) / b.width - .5).toFixed(3));
      rig.style.setProperty('--my', ((e.clientY - b.top) / b.height - .5).toFixed(3));
    });
    home.addEventListener('pointerleave', function () {
      rig.style.setProperty('--mx', 0); rig.style.setProperty('--my', 0);
    });
  }
})();