/* =====================================================
   main.js  |  script utama (butuh config.js dan three.js dimuat dulu)
   ===================================================== */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);

  /* ---------- memuat foto dari assets (coba beberapa ekstensi) ---------- */
  function loadAsset(base, ok) {
    if (!base) return;
    const exts = ['png', 'webp', 'jpg', 'jpeg']; let i = 0;
    (function next() {
      if (i >= exts.length) return;
      const im = new Image(), src = base + '.' + exts[i++];
      im.onload = () => ok(src); im.onerror = next; im.src = src;
    })();
  }

  /* ---------- NAV ---------- */
  const nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  const links = [...nav.querySelectorAll('a')];
  const secs = links.map(a => document.querySelector(a.getAttribute('href')));
  addEventListener('scroll', () => {
    let cur = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((l, i) => l.classList.toggle('on', i === cur));
  }, { passive: true });

  /* ---------- FOTO UTAMA (ada di HTML: <img id="img">) ---------- */
  const img = $('#img'), empty = $('#empty'), photo = $('#photo');
  if (ASSETS.heroMode === 'soft') photo.classList.add('soft');
  photo.style.setProperty('--y', ASSETS.heroY);
  photo.style.setProperty('--s', ASSETS.heroScale);
  function noPhoto() { img.hidden = true; empty.hidden = false; }
  img.addEventListener('error', noPhoto);
  if (img.complete && img.naturalWidth === 0) noPhoto();   // kalau gagal dimuat sebelum script ini jalan

  /* ---------- HERO 3D TILT (mouse + sentuh) ---------- */
  const rig = $('#rig'), home = $('#home'), names = [...document.querySelectorAll('#heroName span')];
  function heroMove(x, y) {
    const r = home.getBoundingClientRect();
    const tx = ((x - r.left) / r.width - .5), ty = ((y - r.top) / r.height - .5);
    rig.style.transform = `rotateY(${tx * 34}deg) rotateX(${-ty * 24}deg)`;
    names.forEach(n => { const d = +n.dataset.d; n.style.transform = `translate3d(${tx * -d * .4}px,${ty * -d * .3}px,${d}px) rotateY(${tx * 6}deg)`; });
  }
  if (!reduce) {
    home.addEventListener('pointermove', e => heroMove(e.clientX, e.clientY));
    home.addEventListener('pointerleave', () => { rig.style.transform = ''; names.forEach(n => n.style.transform = ''); });
    // goyang pelan otomatis di layar sentuh (tanpa mouse)
    let t = 0; (function idle() {
      t += .012;
      if (!matchMedia('(hover:hover)').matches) { rig.style.transform = `rotateY(${Math.sin(t) * 14}deg) rotateX(${Math.cos(t * .8) * 6}deg)`; }
      requestAnimationFrame(idle);
    })();
  }

  /* ---------- KARTU MIRING 3D ---------- */
  function bindTilt(el) {
    el.addEventListener('pointermove', e => {
      if (reduce) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(x - .5) * 18}deg) rotateX(${(.5 - y) * 18}deg) translateZ(14px)`;
      el.style.setProperty('--gx', x * 100 + '%'); el.style.setProperty('--gy', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  }

  /* ---------- GALERI ---------- */
  const gal = $('#gal'), tones = ['s1', 's2', 's3', 's4'];
  const labels = ['Momen', 'Kampus', 'Konten', 'Event', 'Travel', 'Behind the scene', 'Beasiswa', 'Kolab'];
  labels.forEach((l, i) => {
    const d = document.createElement('div'); d.className = 'tilt'; d.setAttribute('data-tilt', '');
    d.innerHTML = `<div class="shot ${tones[i % 4]}" style="position:absolute;inset:0"></div><span>${l}</span>`;
    const s = d.querySelector('.shot');
    loadAsset(ASSETS.galeri[i], src => { s.classList.add('has'); s.style.background = `center/cover url("${src}")`; });
    gal.appendChild(d);
  });
  document.querySelectorAll('[data-tilt]').forEach(bindTilt);

  /* ---------- FOTO PRESTASI (atribut data-asset di HTML) ---------- */
  document.querySelectorAll('[data-asset]').forEach(el => {
    loadAsset(el.dataset.asset, src => {
      const im = document.createElement('img');
      im.alt = el.parentElement.querySelector('h3').textContent; im.src = src;
      el.appendChild(im); el.classList.add('has');
      const b = el.querySelector('b'); if (b) b.hidden = true;
    });
  });

  /* ---------- HOBI: karosel 3D ---------- */
  /* n = judul, e = emoji (tampil kalau foto belum ada), d = keterangan, s = warna cadangan */
  const HOBI = [
    { n: 'Futsal',    e: '⚽',  d: 'Menangkap momen kecil jadi cerita.',        s: 's1' },
    { n: 'Nongkrong', e: '☕',  d: 'Merangkai klip jadi konten seru.',          s: 's2' },
    { n: 'Traveling', e: '⛰️', d: 'Mendaki ke alam Ranu Regulo.',              s: 's3' },
    { n: 'Gamers',    e: '🎮',  d: 'Free fire cinta saya',                      s: 's4' },
    { n: 'Developer', e: '💻',  d: 'Membuat suatu project website dan design.', s: 's1' },
    { n: 'Badminton', e: '🏸',  d: 'Badminton bareng sama teman kampus',        s: 's2' }
  ];
  const HN = HOBI.length, STEP = 360 / HN, car = $('#carousel'), hName = $('#hName'), hStage = $('#hobiStage');
  HOBI.forEach((h, i) => {
    const c = document.createElement('div'); c.className = 'hcard';
    c.innerHTML = `<div class="shot hshot ${h.s}"><img alt="Foto hobi ${h.n}" hidden><div class="hph"><span>${h.e}</span><small>${ASSETS.hobi[i] || ''}</small></div></div><div class="hcap"><h3>${h.n}</h3><p>${h.d}</p></div>`;
    const im = c.querySelector('img'), ph = c.querySelector('.hph'), sh = c.querySelector('.hshot');
    loadAsset(ASSETS.hobi[i], src => { im.src = src; im.hidden = false; ph.hidden = true; sh.classList.add('has'); });
    car.appendChild(c);
  });
  let ang = 0, target = 0, hovering = false, pausedUntil = 0, R = 300;
  function layout() {
    R = Math.round(car.offsetWidth / (2 * Math.tan(Math.PI / HN)) * 1.3);
    [...car.children].forEach((c, i) => { c.style.transform = `rotateY(${i * STEP}deg) translateZ(${R}px)`; });
  }
  layout(); addEventListener('resize', layout);
  hStage.addEventListener('pointerenter', () => hovering = true);
  hStage.addEventListener('pointerleave', () => hovering = false);
  hStage.addEventListener('focusin', () => hovering = true);
  hStage.addEventListener('focusout', () => hovering = false);
  $('#hNext').addEventListener('click', () => { target -= STEP; pausedUntil = performance.now() + 3500; });
  $('#hPrev').addEventListener('click', () => { target += STEP; pausedUntil = performance.now() + 3500; });
  (function spin(now) {
    requestAnimationFrame(spin);
    if (!reduce && !hovering && now > pausedUntil) target -= .2;
    ang += (target - ang) * .07;
    const fy = reduce ? 0 : Math.sin(now / 900) * 8;
    car.style.transform = `translateY(${fy}px) translateZ(-${R}px) rotateX(-6deg) rotateY(${ang}deg)`;
    const idx = ((Math.round(-ang / STEP) % HN) + HN) % HN;
    if (hName.textContent !== HOBI[idx].n) hName.textContent = HOBI[idx].n;
  })(0);

  /* ---------- KONTAK ---------- */
  const waLink = t => `https://wa.me/${CONTACT.wa}` + (t ? `?text=${encodeURIComponent(t)}` : '');
  const igUrl = 'https://instagram.com/' + CONTACT.ig, ttUrl = 'https://www.tiktok.com/@' + CONTACT.tt, mailUrl = 'mailto:' + CONTACT.email;
  [['hsWa', waLink('')], ['hsIg', igUrl], ['hsTt', ttUrl], ['cWa', waLink('Halo Irfann!')], ['cMail', mailUrl], ['cIg', igUrl], ['cTt', ttUrl]].forEach(([id, u]) => {
    const a = document.getElementById(id); if (!a) return;
    a.href = u; if (!u.startsWith('mailto')) { a.target = '_blank'; a.rel = 'noopener'; }
  });
  $('#tWa').textContent = '+' + CONTACT.wa; $('#tMail').textContent = CONTACT.email;
  $('#tIg').textContent = '@' + CONTACT.ig; $('#tTt').textContent = '@' + CONTACT.tt;
  const fN = $('#fName'), fE = $('#fEmail'), fM = $('#fMsg'), sWa = $('#sendWa'), sMl = $('#sendMail'), st = $('#fStatus');
  function body() { return `Halo Irfan, aku ${fN.value.trim() || 'pengunjung portofolio'}${fE.value.trim() ? ` (${fE.value.trim()})` : ''}.\n\n${fM.value}`; }
  function upd() {
    sWa.href = waLink(body());
    sMl.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Pesan dari ' + (fN.value.trim() || 'pengunjung portofolio'))}&body=${encodeURIComponent(body())}`;
  }
  [fN, fE, fM].forEach(x => x.addEventListener('input', upd)); upd();
  [sWa, sMl].forEach(a => a.addEventListener('click', e => {
    if (!fM.value.trim()) { e.preventDefault(); st.textContent = 'Tulis pesanmu dulu ya.'; fM.focus(); }
    else { upd(); st.textContent = 'Membuka aplikasi pesan…'; }
  }));

  /* ---------- MUNCUL SAAT DI-SCROLL ---------- */
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; el.classList.add('in'); io.unobserve(el);
      setTimeout(() => { el.style.transitionDelay = '0ms'; el.classList.add('done'); }, 1400);
    });
  }, { threshold: .15 });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = ((i % 4) * 90) + 'ms'; io.observe(el); });

  /* ---------- LATAR 3D (three.js) ---------- */
  if (window.THREE) {
    const canvas = $('#bg3d');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, 1, .1, 100); cam.position.z = 14;

    scene.add(new THREE.AmbientLight(0x6688ff, .8));
    const dl = new THREE.DirectionalLight(0xffffff, 1); dl.position.set(5, 8, 10); scene.add(dl);
    const pl = new THREE.PointLight(0xff2e4d, 1.4, 40); pl.position.set(-8, -4, 6); scene.add(pl);   // lampu merah (kecilkan 1.4 kalau terlalu merah)

    const mats = [
      new THREE.MeshStandardMaterial({ color: 0x3d6bff, metalness: .5, roughness: .25, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0xff2e4d, metalness: .4, roughness: .3 }),
      new THREE.MeshStandardMaterial({ color: 0xf6dcc8, metalness: .3, roughness: .4, wireframe: true })
    ];
    const geos = [new THREE.IcosahedronGeometry(1.2, 0), new THREE.OctahedronGeometry(1, 0), new THREE.TorusGeometry(1, .32, 16, 40),
                  new THREE.TorusKnotGeometry(.8, .25, 80, 12), new THREE.BoxGeometry(1.4, 1.4, 1.4), new THREE.TetrahedronGeometry(1.2)];
    const shapes = [];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(geos[i % geos.length], mats[i % 3]);
      m.position.set((Math.random() - .5) * 28, (Math.random() - .5) * 34, (Math.random() - .5) * 14 - 2);
      m.scale.setScalar(.5 + Math.random() * .9);
      m.userData = { rx: (Math.random() - .5) * .01, ry: (Math.random() - .5) * .012, fy: Math.random() * 6, sp: .4 + Math.random() * .6, y0: m.position.y };
      scene.add(m); shapes.push(m);
    }
    // partikel
    const N = 450, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 50; pos[i * 3 + 1] = (Math.random() - .5) * 60; pos[i * 3 + 2] = (Math.random() - .5) * 30; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x9db4ff, size: .07, transparent: true, opacity: .8 }));
    scene.add(pts);

    function size() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    size(); addEventListener('resize', size);
    let mx = 0, my = 0; addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    let clock = 0;
    (function loop() {
      requestAnimationFrame(loop);
      if (reduce) { renderer.render(scene, cam); return; }
      clock += .01;
      const sc = scrollY / Math.max(1, document.body.scrollHeight - innerHeight);
      cam.position.x += ((mx * 3) - cam.position.x) * .04;
      cam.position.y += ((-my * 2 - sc * 26) - cam.position.y) * .05;
      cam.rotation.z = sc * .4;
      cam.lookAt(0, cam.position.y * .6, 0);
      shapes.forEach(m => {
        m.rotation.x += m.userData.rx + .003; m.rotation.y += m.userData.ry + .004;
        m.position.y = m.userData.y0 + Math.sin(clock * m.userData.sp + m.userData.fy) * .8;
      });
      pts.rotation.y = clock * .05;
      renderer.render(scene, cam);
    })();
  }
})();
