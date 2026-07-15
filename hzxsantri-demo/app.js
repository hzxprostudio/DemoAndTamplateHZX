/**
 * HZX Santri - Rebrandable Islamic Boarding School Template
 * Powered by HZXPro Studio
 */

const SANTRI_CONFIG = {
  name: 'Pesantren Al-Hikmah HZX',
  fullName: 'Pondok Pesantren Al-Hikmah HZX Bandung',
  tagline: 'Mencetak Huffazh Al-Qur\'an, Berilmu Luas, dan Berakhlak Karimah',
  whatsappAdmin: '6281234567890',
  email: 'info@alhikmahhzx.ponpes.id',
  phone: '(022) 1111-2222',
  address: 'Jl. Pesantren No. 9, Dago Atas, Kota Bandung, Jawa Barat 40135',

  about: {
    history: 'Didirikan pada tahun 2012 di bawah asuhan KH. Dr. M. Syarif Hidayat, Lc. Pesantren Al-Hikmah HZX memadukan kurikulum salafiyah (kitab kuning) dengan sistem pendidikan modern formal dan tahfidz Al-Qur\'an 30 Juz.',
    vision: 'Menjadi lembaga pendidikan Islam unggulan yang melahirkan ulama, cendekiawan Muslim, dan huffazh berkarakter global.',
    missions: [
      'Menyelenggarakan program Tahfidz Al-Qur\'an terintegrasi dengan target hafalan 30 Juz dalam 3 tahun.',
      'Mengajarkan khazanah keilmuan Islam klasik melalui sistem wetonan dan sorogan kitab kuning.',
      'Membekali santri dengan penguasaan Bahasa Arab, Bahasa Inggris, sains, dan teknologi informasi.'
    ]
  },

  programs: [
    { title: 'Program Tahfidz Al-Qur\'an', desc: 'Fokus menghafal Al-Qur\'an 30 Juz dengan bimbingan metode setoran talaqqi bersama muqri bersanad.' },
    { title: 'Kajian Kitab Kuning (Salafiyah)', desc: 'Penguasaan Nahwu, Shorof, Fiqih, Ushul Fiqih, Tafsir, dan Hadits menggunakan kitab-kitab muktabar.' },
    { title: 'SMP & SMA Sains Formal', desc: 'Pendidikan formal kurikulum nasional dengan integrasi sains, matematika, sains komputer, dan robotika.' }
  ],

  facilities: [
    { title: 'Masjid Al-Hikmah', desc: 'Pusat ibadah sholat berjamaah, halaqah Quran, kajian kitab kuning santri.', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=400' },
    { title: 'Gedung Asrama Santri', desc: 'Asrama ber-AC, lemari loker rapi, kamar mandi dalam, serta lingkungan bersih.', image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400' },
    { title: 'Laboratorium Sains & Komputer', desc: 'Komputer spesifikasi tinggi untuk latihan pemrograman dasar dan riset sains.', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400' }
  ],

  ustadz: [
    { name: 'KH. Dr. M. Syarif Hidayat, Lc.', role: 'Pimpinan & Pengasuh Pondok', subject: 'Kajian Tafsir & Hadits', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300' },
    { name: 'Ustadz H. Lukman Hakim, S.Ud.', role: 'Kepala Bidang Tahfidz', subject: 'Tashih Al-Qur\'an Bersanad', image: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=300' },
    { name: 'Bunda Nyai Hj. Sarah Fauziah', role: 'Pengasuh Asrama Putri', subject: 'Akhlaq Lil Banat & Fiqih Wanita', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-santri]').forEach(el => {
    const key = el.getAttribute('data-santri');
    if (SANTRI_CONFIG[key]) el.textContent = SANTRI_CONFIG[key];
  });

  // Render Misi
  const missionList = document.getElementById('mission-list');
  if (missionList) {
    missionList.innerHTML = '';
    SANTRI_CONFIG.about.missions.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      missionList.appendChild(li);
    });
  }

  // Render Programs
  renderPrograms();

  // Render Facilities
  renderFacilities();

  // Render Ustadz
  renderUstadz();

  // Setup Registration Form
  setupRegistrationForm();

  // Setup Lightbox Gallery
  setupGalleryLightbox();
});

function renderPrograms() {
  const container = document.getElementById('programs-grid');
  if (!container) return;

  container.innerHTML = '';
  SANTRI_CONFIG.programs.forEach(prog => {
    const card = document.createElement('div');
    card.className = 'program-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="prog-icon-badge">🕌</div>
      <h4>${prog.title}</h4>
      <p>${prog.desc}</p>
    `;
    container.appendChild(card);
  });
}

function renderFacilities() {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  container.innerHTML = '';
  SANTRI_CONFIG.facilities.forEach((fac, index) => {
    const card = document.createElement('div');
    card.className = 'facility-card scroll-reveal revealed';
    card.setAttribute('data-index', index);
    card.innerHTML = `
      <div class="fac-img">
        <img src="${fac.image}" alt="${fac.title}" loading="lazy">
        <div class="fac-overlay">
          <span>Perbesar Foto &rarr;</span>
        </div>
      </div>
      <div class="fac-info">
        <h4>${fac.title}</h4>
        <p>${fac.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderUstadz() {
  const container = document.getElementById('ustadz-grid');
  if (!container) return;

  container.innerHTML = '';
  SANTRI_CONFIG.ustadz.forEach(u => {
    const card = document.createElement('div');
    card.className = 'ustadz-card text-center';
    card.innerHTML = `
      <div class="ustadz-img-wrapper">
        <img src="${u.image}" alt="${u.name}" loading="lazy">
      </div>
      <div class="ustadz-info">
        <h4>${u.name}</h4>
        <span class="ustadz-role">${u.role}</span>
        <p class="ustadz-subject">📖 ${u.subject}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupRegistrationForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name');
    const parent = document.getElementById('reg-parent');
    const program = document.getElementById('reg-program');
    const phone = document.getElementById('reg-phone');

    // Reset validations
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());

    let isValid = true;

    const showError = (el, msg) => {
      el.classList.add('is-invalid');
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.display = 'block';
      err.textContent = msg;
      el.parentNode.appendChild(err);
      isValid = false;
    };

    if (!name.value.trim()) showError(name, 'Nama calon santri wajib diisi.');
    if (!parent.value.trim()) showError(parent, 'Nama orang tua/wali wajib diisi.');
    if (!program.value) showError(program, 'Pilih program pendidikan.');
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');

    if (isValid) {
      const waMsg = `*PENDAFTARAN SANTRI BARU - ${SANTRI_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Assalamu'alaikum Admin Pesantren,\nSaya orang tua ingin mendaftarkan putra/putri saya sebagai santri baru:\n\n` +
        `👤 *Nama Calon Santri:* ${name.value.trim()}\n` +
        `👤 *Nama Orang Tua/Wali:* ${parent.value.trim()}\n` +
        `🎓 *Pilihan Program:* ${program.options[program.selectedIndex].text}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n\n` +
        `Mohon arahan info ujian masuk (tashih quran) dan berkas persyaratan pendaftaran. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${SANTRI_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Memproses Pendaftaran...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Pendaftaran Berhasil! Pengajuan dikirimkan ke WhatsApp Panitia PSB.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}

function setupGalleryLightbox() {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  // Create lightbox DOM elements
  let lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox-modal';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <div class="lightbox-content-wrapper">
        <img class="lightbox-img" id="lightbox-image" src="" alt="Lightbox View">
        <div class="lightbox-caption" id="lightbox-caption"></div>
      </div>
      <a class="lightbox-prev">&#10094;</a>
      <a class="lightbox-next">&#10095;</a>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCap = document.getElementById('lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIdx = 0;
  const items = SANTRI_CONFIG.facilities;

  const showImage = (index) => {
    currentIdx = (index + items.length) % items.length;
    const item = items[currentIdx];
    lightboxImg.src = item.image;
    lightboxCap.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;
  };

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.facility-card');
    if (!card) return;
    
    const idx = parseInt(card.getAttribute('data-index'), 10);
    showImage(idx);
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIdx - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIdx + 1);
  });
}
