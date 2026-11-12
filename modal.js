(function () {
  /* Hapus modal lama jika ada agar tidak bentrok */
  const oldModal = document.getElementById('modal');
  if (oldModal) oldModal.remove();

  /* Inject Struktur Modal Split Modern ke HTML */
  document.body.insertAdjacentHTML('beforeend', `
<div class="modal" id="modal" aria-hidden="true">
  <div class="modal-bg" data-close></div>
  <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="mTitle">
    <button class="modal-x" data-close aria-label="Tutup">✕</button>
    <div class="modal-grid">
      
      <!-- Sisi Kiri: Panggung Foto Adaptif -->
      <div class="modal-stage" id="mStage">
        <div class="modal-img-wrap">
          <img id="mMainImg" src="" alt="Detail Foto" draggable="false">
        </div>
        
        <!-- Navigasi Multi-Foto -->
        <div class="modal-nav" id="mNav" hidden>
          <button class="mnav-btn" id="mPrev" type="button" aria-label="Foto sebelumnya">‹</button>
          <span class="mcount" id="mCount">1 / 1</span>
          <button class="mnav-btn" id="mNext" type="button" aria-label="Foto berikutnya">›</button>
        </div>
      </div>

      <!-- Sisi Kanan: Deskripsi & Informasi -->
      <div class="modal-details">
        <div class="details-top">
          <span class="mtag" id="mTag"></span>
          <h3 id="mTitle"></h3>
          <p id="mText"></p>
        </div>
        <div class="details-bottom">
          <a class="btn mlink" id="mLink" href="#" target="_blank" rel="noopener" hidden>Lihat Proyek ↗</a>
        </div>
      </div>

    </div>
  </div>
</div>`);

  // Elemen DOM
  const modal = document.getElementById('modal');
  const stage = document.getElementById('mStage');
  const mainImg = document.getElementById('mMainImg');
  const tag = document.getElementById('mTag');
  const title = document.getElementById('mTitle');
  const text = document.getElementById('mText');
  const link = document.getElementById('mLink');
  const navBox = document.getElementById('mNav');
  const count = document.getElementById('mCount');
  const btnPrev = document.getElementById('mPrev');
  const btnNext = document.getElementById('mNext');

  let photoList = [];
  let currentIndex = 0;
  let lastFocus = null;
  let token = 0;

  // Helper URL Absolut
  function abs(src) {
    try { return new URL(src, location.href).href; } catch (e) { return src; }
  }

  // Update Tampilan Foto
  function updatePhoto(animate) {
    if (!photoList.length) return;

    if (animate) {
      mainImg.style.opacity = '0';
      mainImg.style.transform = 'scale(0.96)';
      setTimeout(function () {
        mainImg.src = photoList[currentIndex];
        mainImg.onload = function () {
          mainImg.style.opacity = '1';
          mainImg.style.transform = 'scale(1)';
        };
      }, 120);
    } else {
      mainImg.src = photoList[currentIndex];
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }

    count.textContent = (currentIndex + 1) + ' / ' + photoList.length;
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === photoList.length - 1;

    // Update link gambar jika tidak ada data-link proyek
    if (!link.dataset.hasCustomLink && photoList.length) {
      link.href = photoList[currentIndex];
      link.textContent = 'Buka Gambar Penuh ↗';
      link.hidden = false;
    }
  }

  function goNext() {
    if (currentIndex < photoList.length - 1) {
      currentIndex++;
      stage.classList.remove('zoomed');
      updatePhoto(true);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      stage.classList.remove('zoomed');
      updatePhoto(true);
    }
  }

  // Fitur Click to Zoom pada Sertifikat / Gambar
  mainImg.addEventListener('click', function () {
    stage.classList.toggle('zoomed');
  });

  // Fungsi Membuka Modal
  function openModal(card) {
    const currentToken = ++token;
    stage.classList.remove('zoomed');

    // 1. Ambil Foto
    const s = card.querySelector('.shot, .pimg');
    const primaryImg = s ? s.querySelector('img') : null;
    const extraPhotos = (card.dataset.photos || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);

    photoList = [];
    if (primaryImg && (primaryImg.currentSrc || primaryImg.src)) {
      photoList.push(abs(primaryImg.currentSrc || primaryImg.src));
    }
    extraPhotos.forEach(function (x) {
      const absoluteUrl = abs(x);
      if (photoList.indexOf(absoluteUrl) < 0) photoList.push(absoluteUrl);
    });

    // 2. Preload Gambar
    Promise.all(photoList.map(function (src) {
      return new Promise(function (resolve) {
        const img = new Image();
        img.onload = function () { resolve(src); };
        img.onerror = function () { resolve(null); };
        img.src = src;
      });
    })).then(function (validPhotos) {
      if (currentToken !== token) return;
      const filtered = validPhotos.filter(Boolean);
      if (filtered.length) {
        photoList = filtered;
        navBox.hidden = photoList.length <= 1;
        updatePhoto(false);
      }
    });

    currentIndex = 0;
    navBox.hidden = photoList.length <= 1;

    // 3. Ambil Tag / Tanggal
    const t = card.querySelector('.shot i, .date, .t-tag');
    tag.textContent = t ? t.textContent.trim() : '';
    tag.hidden = !tag.textContent;

    // 4. Ambil Judul & Deskripsi
    const h3 = card.querySelector('h3');
    title.textContent = h3 ? h3.textContent.trim() : '';
    const desc = card.dataset.detail || (card.querySelector('.meta p, .pmeta p') ? card.querySelector('.meta p, .pmeta p').textContent.trim() : '');
    text.textContent = desc;

    // 5. Pengaturan Tombol Link / Buka Gambar Penuh
    if (card.dataset.link) {
      link.href = card.dataset.link;
      link.textContent = 'Lihat Proyek ↗';
      link.dataset.hasCustomLink = 'true';
      link.hidden = false;
    } else if (photoList.length) {
      link.href = photoList[0];
      link.textContent = 'Buka Gambar Penuh ↗';
      delete link.dataset.hasCustomLink;
      link.hidden = false;
    } else {
      link.hidden = true;
    }

    updatePhoto(false);

    // 6. Tampilkan Modal
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');

    const closeBtn = modal.querySelector('.modal-x');
    if (closeBtn) closeBtn.focus();
  }

  // Fungsi Menutup Modal
  function closeModal() {
    token++;
    stage.classList.remove('zoomed');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }

  // Navigasi & Drag Gesture
  btnPrev.addEventListener('click', goPrev);
  btnNext.addEventListener('click', goNext);

  let startX = 0;
  let isDragging = false;

  stage.addEventListener('pointerdown', function (e) {
    if (photoList.length <= 1 || e.target.closest('.modal-nav')) return;
    isDragging = true;
    startX = e.clientX;
  });

  stage.addEventListener('pointerup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - startX;
    if (diffX < -40) goNext();
    else if (diffX > 40) goPrev();
  });

  stage.addEventListener('pointercancel', function () { isDragging = false; });

  // Event Listener Klik Kartu Portofolio & Sertifikat
  document.querySelectorAll('.work, .pcard').forEach(function (card) {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.addEventListener('click', function () { openModal(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // Tombol Silang & Keyboard Shortcut
  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  window.addEventListener('resize', function () {
    if (modal.classList.contains('open')) updatePhoto(false);
  });
})();