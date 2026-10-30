(function () {
  /* jendela detail dibuat oleh script ini sendiri, jadi tidak perlu HTML tambahan di index.html */
  const oldModal = document.getElementById('modal');
  if (oldModal) oldModal.remove();
  document.body.insertAdjacentHTML('beforeend', `
<div class="modal" id="modal" aria-hidden="true">
  <div class="modal-bg" data-close></div>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="mTitle">
    <button class="modal-x" data-close aria-label="Tutup">✕</button>
    <div class="mslider" id="mSlider">
      <div class="mtrack" id="mTrack"></div>
      <span class="mcount" id="mCount"></span>
      <button class="mnav prev" id="mPrev" type="button" aria-label="Foto sebelumnya">‹</button>
      <button class="mnav next" id="mNext" type="button" aria-label="Foto berikutnya">›</button>
    </div>
    <div class="mthumbs" id="mThumbs"></div>
    <div class="mbody">
      <span class="mtag" id="mTag"></span>
      <h3 id="mTitle"></h3>
      <p id="mText"></p>
      <a class="btn" id="mLink" href="#" target="_blank" rel="noopener" hidden>Lihat Proyek ↗</a>
    </div>
  </div>
</div>`);

  const modal  = document.getElementById('modal');
  const slider = document.getElementById('mSlider');
  const track  = document.getElementById('mTrack');
  const thumbs = document.getElementById('mThumbs');
  const count  = document.getElementById('mCount');
  const btnPrev = document.getElementById('mPrev');
  const btnNext = document.getElementById('mNext');
  const tag   = document.getElementById('mTag');
  const title = document.getElementById('mTitle');
  const text  = document.getElementById('mText');
  const link  = document.getElementById('mLink');

  let lastFocus = null, token = 0;
  let slides = [], thumbBtns = [], idx = 0, gap = 14, slideW = 0;

  /* ---------- posisi slider ---------- */
  function layout(animate) {
    if (!slides.length) return;
    const W = slider.clientWidth;
    const single = slides.length === 1;
    slideW = single ? W - 32 : W * 0.78;
    gap = single ? 0 : 14;
    track.style.gap = gap + 'px';
    slides.forEach(function (s) { s.style.width = slideW + 'px'; });
    const x = (W - slideW) / 2 - idx * (slideW + gap);
    track.style.transition = animate === false ? 'none' : '';
    track.style.transform = 'translateX(' + x + 'px)';

    slides.forEach(function (s, i) { s.classList.toggle('on', i === idx); });
    thumbBtns.forEach(function (b, i) { b.classList.toggle('on', i === idx); });
    count.textContent = (idx + 1) + ' / ' + slides.length;
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === slides.length - 1;

    const active = thumbBtns[idx];
    if (active) thumbs.scrollTo({ left: active.offsetLeft - thumbs.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' });
  }

  function go(i) {
    idx = Math.max(0, Math.min(slides.length - 1, i));
    layout(true);
  }

  /* ---------- geser dengan jari / mouse ---------- */
  let dragging = false, startX = 0, dx = 0, baseX = 0, moved = false;

  slider.addEventListener('pointerdown', function (e) {
    if (slides.length < 2 || e.target.closest('.mnav')) return;
    dragging = true; moved = false; startX = e.clientX; dx = 0;
    baseX = (slider.clientWidth - slideW) / 2 - idx * (slideW + gap);
    track.style.transition = 'none';
    slider.setPointerCapture(e.pointerId);
    slider.classList.add('drag');
  });
  slider.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    dx = e.clientX - startX;
    if (Math.abs(dx) > 6) moved = true;
    let d = dx;
    if ((idx === 0 && dx > 0) || (idx === slides.length - 1 && dx < 0)) d = dx * 0.3;   // mentok di ujung
    track.style.transform = 'translateX(' + (baseX + d) + 'px)';
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    slider.classList.remove('drag');
    const limit = slideW * 0.16;
    if (dx < -limit) go(idx + 1);
    else if (dx > limit) go(idx - 1);
    else layout(true);
  }
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);

  btnPrev.addEventListener('click', function () { go(idx - 1); });
  btnNext.addEventListener('click', function () { go(idx + 1); });

  /* klik foto di samping = pindah ke foto itu */
  track.addEventListener('click', function (e) {
    if (moved) { moved = false; return; }
    const s = e.target.closest('.mslide');
    if (s) go(slides.indexOf(s));
  });

  /* ---------- membangun isi slider ---------- */
  function abs(src) { try { return new URL(src, location.href).href; } catch (e) { return src; } }

  function build(list, fallbackClass) {
    track.innerHTML = ''; thumbs.innerHTML = '';
    slides = []; thumbBtns = []; idx = 0;

    if (!list.length) {
      const s = document.createElement('div');
      s.className = 'mslide on ' + (fallbackClass || 's1');
      track.appendChild(s); slides.push(s);
    } else {
      list.forEach(function (src, i) {
        const s = document.createElement('div');
        s.className = 'mslide';
        const im = document.createElement('img');
        im.src = src; im.alt = 'Foto ' + (i + 1); im.draggable = false;
        s.appendChild(im);
        track.appendChild(s); slides.push(s);

        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', 'Lihat foto ' + (i + 1));
        const ti = document.createElement('img'); ti.src = src; ti.alt = ''; ti.draggable = false;
        b.appendChild(ti);
        b.addEventListener('click', function () { go(i); });
        thumbs.appendChild(b); thumbBtns.push(b);
      });
    }

    const multi = slides.length > 1;
    slider.classList.toggle('single', !multi);
    thumbs.hidden = !multi;
    count.hidden = !multi;
    layout(false);
  }

  function open(card) {
    const s = card.querySelector('.shot');
    const mainImg = s && s.querySelector('img');
    const extra = (card.dataset.photos || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);

    // foto utama dulu, lalu foto tambahan (tanpa duplikat)
    const wanted = [];
    if (mainImg) wanted.push(abs(mainImg.currentSrc || mainImg.src));
    extra.forEach(function (x) { const a = abs(x); if (wanted.indexOf(a) < 0) wanted.push(a); });

    const my = ++token;
    let fallback = 's1';
    if (s) s.classList.forEach(function (c) { if (/^s\d$/.test(c)) fallback = c; });

    // teks
    const t = card.querySelector('.shot i, .date');
    tag.textContent = t ? t.textContent : '';
    tag.hidden = !tag.textContent;
    title.textContent = card.querySelector('h3').textContent;
    text.textContent = card.dataset.detail || card.querySelector('.meta p, .pmeta p').textContent;
    if (card.dataset.link) { link.href = card.dataset.link; link.hidden = false; } else { link.hidden = true; }

    // tampilkan dulu, foto yang gagal dimuat dibuang
    build(wanted.slice(0, 1), fallback);
    Promise.all(wanted.map(function (src) {
      return new Promise(function (res) {
        const im = new Image();
        im.onload = function () { res(src); };
        im.onerror = function () { res(null); };
        im.src = src;
      });
    })).then(function (ok) {
      if (my !== token) return;
      build(ok.filter(Boolean), fallback);
    });

    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    layout(false);
    modal.querySelector('.modal-x').focus();
  }

  function close() {
    token++;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }

  // kartu yang bisa diklik (mau Prestasi juga? ganti '.work' jadi '.work, .pcard')
  document.querySelectorAll('.work').forEach(function (card) {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.addEventListener('click', function () { open(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
    });
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') go(idx + 1);
    if (e.key === 'ArrowLeft') go(idx - 1);
  });
  addEventListener('resize', function () { if (modal.classList.contains('open')) layout(false); });
})();