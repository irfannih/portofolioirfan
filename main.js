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


  /* ---------- FOTO PRESTASI (atribut data-asset di HTML) ---------- */
  document.querySelectorAll('[data-asset]').forEach(el => {
    loadAsset(el.dataset.asset, src => {
      const im = document.createElement('img');
      im.alt = el.parentElement.querySelector('h3').textContent; im.src = src;
      el.appendChild(im); el.classList.add('has');
      const b = el.querySelector('b'); if (b) b.hidden = true;
    });
  });

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
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
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
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(geos[i % geos.length], mats[i % 3]);
      m.position.set((Math.random() - .5) * 28, (Math.random() - .5) * 34, (Math.random() - .5) * 14 - 2);
      m.scale.setScalar(.5 + Math.random() * .9);
      m.userData = { rx: (Math.random() - .5) * .01, ry: (Math.random() - .5) * .012, fy: Math.random() * 6, sp: .4 + Math.random() * .6, y0: m.position.y };
      scene.add(m); shapes.push(m);
    }
    // partikel
    const N = 150, pos = new Float32Array(N * 3);
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

/* ---------- FILTER PORTOFOLIO & SERTIFIKAT ---------- */
  const fBtns = document.querySelectorAll('.filter-btn');
  const fItems = document.querySelectorAll('.portfolio-grid .tilt');

  if (fBtns.length > 0) {
    fBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Pindahkan tombol aktif
        fBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        // Saring kartu
        fItems.forEach(item => {
          if (filter === 'semua' || item.classList.contains('f-' + filter)) {
            item.classList.remove('hilang');
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.classList.add('hilang');
            }, 300); // Waktu yang sama dengan animasi CSS
          }
        });
      });
    });
  }