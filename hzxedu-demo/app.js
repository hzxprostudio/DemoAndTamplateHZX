/**
 * HZX EDU - Rebrandable School/Campus Website Template
 * Powered by HZXPro Studio
 */

// 1. KONFIGURASI UTAMA (Ubah di sini untuk Rebranding)
const SCHOOL_CONFIG = {
  // Pilihan level: 'SD' | 'SMP' | 'SMA' | 'UNIV'
  level: 'SMA', 
  
  // Informasi Nama & Identitas
  name: 'HZX EDU',
  fullName: 'SMA HZX EDU Bandung',
  tagline: 'Membentuk Generasi Kreatif, Berkarakter, dan Berteknologi Tinggi',
  motto: 'Creative • Character • Technology',
  accreditation: 'A (Unggul)',
  since: '2015',
  
  // Kontak & Lokasi
  contact: {
    whatsapp: '6281234567890', // Format: Kode negara + nomor (tanpa + atau spasi)
    email: 'info@hzxedu.sch.id',
    phone: '(022) 1234-5678',
    address: 'Jl. Pendidikan No. 45, Dago, Kota Bandung, Jawa Barat 40135',
    gmapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.026477161726!2d107.61462067584981!3d-6.887413693111718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6580f4f9cc7%3A0x6b772c84285b9e!2sInstitut%20Teknologi%20Bandung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
  },

  // Skema Warna (Bisa diatur bebas atau menggunakan preset di bawah)
  // Preset 1 (Modern University / Blue Gold): primary: '#1e3a8a', secondary: '#f59e0b', accent: '#3b82f6', bgLight: '#f8fafc'
  // Preset 2 (Cheerful School / Emerald Gold): primary: '#065f46', secondary: '#f59e0b', accent: '#10b981', bgLight: '#f9fafb'
  // Preset 3 (Techno / Teal Cyan): primary: '#0f766e', secondary: '#06b6d4', accent: '#14b8a6', bgLight: '#f8fafc'
  colors: {
    primary: '#1e3a8a',
    secondary: '#f59e0b',
    accent: '#3b82f6',
    bgLight: '#f8fafc',
    textDark: '#0f172a',
    textLight: '#ffffff'
  },

  // Profil Detail
  about: {
    title: 'Mendidik dengan Hati, Mempersiapkan Masa Depan',
    description: 'SMA HZX EDU berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi yang mengintegrasikan kecerdasan akademis, pembentukan karakter mulia, dan keterampilan praktis berbasis teknologi modern. Kami percaya setiap siswa memiliki potensi emas yang siap diasah demi menghadapi tantangan global.',
    vision: 'Menjadi lembaga pendidikan terkemuka yang menghasilkan lulusan yang cerdas, inovatif, berintegritas tinggi, dan mampu bersaing di tingkat global berdasarkan nilai-nilai karakter mulia.',
    missions: [
      'Menyelenggarakan proses pembelajaran yang inovatif, interaktif, dan berbasis IT.',
      'Membina karakter peserta didik melalui pembiasaan nilai-nilai religius dan etika sosial.',
      'Mengembangkan minat, bakat, dan potensi kepemimpinan siswa melalui program ekstrakurikuler yang beragam.',
      'Membangun jejaring kolaborasi dengan perguruan tinggi dan industri kreatif nasional maupun internasional.'
    ]
  },

  // Fasilitas Unggulan
  facilities: [
    {
      name: 'Laboratorium Komputer & AI',
      description: 'Ruangan ber-AC dengan PC spesifikasi tinggi untuk pemrograman, desain grafis, dan robotika.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600',
      icon: 'desktop'
    },
    {
      name: 'Perpustakaan & Media Center',
      description: 'Koleksi ribuan buku fisik serta akses e-book dan jurnal digital yang nyaman dan modern.',
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600',
      icon: 'book'
    },
    {
      name: 'Multimedia Auditorium',
      description: 'Ruang serbaguna berkapasitas besar dengan sistem tata suara dan proyektor mutakhir.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600',
      icon: 'presentation'
    }
  ],

  // Program Studi / Jurusan (Menyesuaikan level sekolah)
  programs: [
    {
      id: 'mipa',
      name: 'Matematika dan Ilmu Pengetahuan Alam (MIPA)',
      shortName: 'MIPA',
      description: 'Fokus pada ilmu eksakta seperti Fisika, Kimia, Biologi, dan Matematika Lanjutan, dikombinasikan dengan praktikum sains terintegrasi.',
      icon: 'flask',
      color: '#3b82f6',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400'
    },
    {
      id: 'ips',
      name: 'Ilmu Pengetahuan Sosial (IPS)',
      shortName: 'IPS',
      description: 'Mempelajari Geografi, Sejarah, Sosiologi, Ekonomi, Kewirausahaan, dan Riset Sosial untuk melahirkan pemikir kritis di bidang sosial-ekonomi.',
      icon: 'globe',
      color: '#10b981',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400'
    },
    {
      id: 'bahasa',
      name: 'Bahasa dan Budaya',
      shortName: 'Bahasa',
      description: 'Penguasaan Bahasa Indonesia, Bahasa Inggris, sastra, serta bahasa asing pilihan (Jepang/Mandarin) guna mempersiapkan komunikasi global.',
      icon: 'translate',
      color: '#f59e0b',
      image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=400'
    }
  ],

  // Galeri Kegiatan
  gallery: [
    {
      title: 'Praktikum Kimia Organik',
      category: 'akademik',
      description: 'Siswa kelas XI melakukan analisis zat makanan di Lab Kimia.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600'
    },
    {
      title: 'Pameran Karya Seni Rupa',
      category: 'event',
      description: 'Showcase karya lukisan dan instalasi seni hasil kreativitas siswa.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600'
    },
    {
      title: 'Latihan Rutin Ekstrakurikuler Robotika',
      category: 'ekskul',
      description: 'Merakit dan memprogram robot obstacle-avoidance untuk perlombaan.',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600'
    },
    {
      title: 'Upacara Peringatan Hari Kemerdekaan',
      category: 'event',
      description: 'Petugas Paskibraka sekolah melaksanakan pengibaran bendera Merah Putih.',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600'
    },
    {
      title: 'Kunjungan Belajar ke Tech Incubator',
      category: 'akademik',
      description: 'Mengenal ekosistem startup teknologi dan pengembangan perangkat lunak.',
      image: 'https://images.unsplash.com/photo-1516534775068-ba3e84589d90?q=80&w=600'
    },
    {
      title: 'Lomba Paduan Suara Tingkat Provinsi',
      category: 'ekskul',
      description: 'Tim Paduan Suara Gita HZX meraih Juara 1 Kategori Campuran.',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600'
    }
  ],

  // Guru / Staff Pengajar
  teachers: [
    {
      name: 'Drs. H. Ahmad Wijaya, M.Pd.',
      role: 'Kepala Sekolah',
      subject: 'Manajemen Pendidikan',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300'
    },
    {
      name: 'Riana Safitri, M.Si.',
      role: 'Wakasek Kurikulum',
      subject: 'Fisika Lanjutan',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300'
    },
    {
      name: 'Budi Darmawan, S.Kom.',
      role: 'Kepala Lab Komputer',
      subject: 'Informatika & Robotika',
      image: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=300'
    }
  ],

  // Jadwal Akademik / Kalender Pendidikan
  schedule: [
    { date: '15 Juli 2026', event: 'Hari Pertama Masuk Sekolah & MPLS', category: 'Akademik' },
    { date: '17 Agt 2026', event: 'Upacara Kemerdekaan RI & Festival Ekskul', category: 'Event' },
    { date: '14 - 18 Sept 2026', event: 'Asesmen Tengah Semester (ATS) Ganjil', category: 'Ujian' },
    { date: '10 Nov 2026', event: 'Pameran Karya Projek Penguatan Profil Pelajar Pancasila', category: 'Event' },
    { date: '07 - 11 Des 2026', event: 'Asesmen Akhir Semester (AAS) Ganjil', category: 'Ujian' },
    { date: '18 Des 2026', event: 'Pembagian Rapor Semester Ganjil', category: 'Akademik' }
  ]
};

// 2. TEXT TRANSLATION & DICTIONARY BERDASARKAN LEVEL SEKOLAH
const LEVEL_DICTIONARY = {
  SD: {
    levelLabel: 'SD',
    ctaRegister: 'Daftar PPDB (Siswa Baru)',
    programLabel: 'Program Kelas',
    programDesc: 'Pilihan kelas pembelajaran unggulan untuk anak Anda.',
    studentLabel: 'Calon Siswa',
    parentLabel: 'Orang Tua / Wali',
    majorSelectLabel: 'Pilihan Program Kelas',
    academicLabel: 'Kalender Belajar',
    ppdbHeadline: 'PPDB Online SD HZX EDU'
  },
  SMP: {
    levelLabel: 'SMP',
    ctaRegister: 'Daftar PPDB Online',
    programLabel: 'Program Unggulan',
    programDesc: 'Kelas & peminatan akademik yang melatih kompetensi dasar secara mendalam.',
    studentLabel: 'Calon Siswa',
    parentLabel: 'Orang Tua / Wali',
    majorSelectLabel: 'Pilihan Kelas Peminatan',
    academicLabel: 'Kalender Akademik',
    ppdbHeadline: 'PPDB Online SMP HZX EDU'
  },
  SMA: {
    levelLabel: 'SMA',
    ctaRegister: 'Daftar PPDB Online',
    programLabel: 'Pilihan Jurusan',
    programDesc: 'Jurusan akademik terakreditasi untuk bekal sukses masa depan.',
    studentLabel: 'Calon Siswa',
    parentLabel: 'Orang Tua / Wali',
    majorSelectLabel: 'Pilihan Jurusan / Peminatan',
    academicLabel: 'Kalender Akademik',
    ppdbHeadline: 'PPDB Online SMA HZX EDU'
  },
  UNIV: {
    levelLabel: 'Universitas / Institut',
    ctaRegister: 'Daftar PMB (Mahasiswa Baru)',
    programLabel: 'Fakultas & Program Studi',
    programDesc: 'Program studi modern siap kerja dengan kurikulum berstandar industri.',
    studentLabel: 'Calon Mahasiswa',
    parentLabel: 'Penanggung Jawab Biaya',
    majorSelectLabel: 'Pilihan Program Studi',
    academicLabel: 'Kalender Akademik Kampus',
    ppdbHeadline: 'Pendaftaran Mahasiswa Baru (PMB)'
  }
};

// Ambil terjemahan bahasa berdasarkan konfigurasi level sekolah
const lang = LEVEL_DICTIONARY[SCHOOL_CONFIG.level.toUpperCase()] || LEVEL_DICTIONARY.SMA;

// 3. APPLIKASI DINAMIS - RENDER KONTEN DAN LOGIKA INTERAKSI
document.addEventListener('DOMContentLoaded', () => {
  applyColors();
  applyDynamicTexts();
  renderFacilities();
  renderPrograms();
  renderGallery();
  renderTeachers();
  renderSchedule();
  setupDynamicSelectors();
  setupPPDBForm();
  setupGalleryLightbox();
  setupScrollAnimations();
});

// A. Apply Colors to CSS Variables
function applyColors() {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', SCHOOL_CONFIG.colors.primary);
  root.style.setProperty('--color-secondary', SCHOOL_CONFIG.colors.secondary);
  root.style.setProperty('--color-accent', SCHOOL_CONFIG.colors.accent);
  root.style.setProperty('--color-bg-light', SCHOOL_CONFIG.colors.bgLight);
  root.style.setProperty('--color-text-dark', SCHOOL_CONFIG.colors.textDark);
  root.style.setProperty('--color-text-light', SCHOOL_CONFIG.colors.textLight);
}

// B. Apply Dynamic Text Content to DOM Elements
function applyDynamicTexts() {
  // Elements with data-config attribute
  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (SCHOOL_CONFIG[key]) {
      el.textContent = SCHOOL_CONFIG[key];
    }
  });

  // Dynamic texts from dictionary
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (lang[key]) {
      el.textContent = lang[key];
    }
  });

  // Specifically modify inputs or other properties
  const pageTitle = document.querySelector('title');
  if (pageTitle) {
    pageTitle.textContent = `${SCHOOL_CONFIG.name} | Demo Website Sekolah & Kampus`;
  }

  // Set Google Maps source
  const mapIframe = document.getElementById('gmaps-iframe');
  if (mapIframe) {
    mapIframe.src = SCHOOL_CONFIG.contact.gmapsEmbedUrl;
  }
  
  // Set contact links
  const emailLink = document.getElementById('contact-email-link');
  if (emailLink) {
    emailLink.href = `mailto:${SCHOOL_CONFIG.contact.email}`;
    emailLink.textContent = SCHOOL_CONFIG.contact.email;
  }
  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink) {
    phoneLink.href = `tel:${SCHOOL_CONFIG.contact.phone.replace(/[^0-9]/g, '')}`;
    phoneLink.textContent = SCHOOL_CONFIG.contact.phone;
  }
  const addressText = document.getElementById('contact-address-text');
  if (addressText) {
    addressText.textContent = SCHOOL_CONFIG.contact.address;
  }
  
  // Footer rebrand credits
  const copyrightText = document.getElementById('copyright-text');
  if (copyrightText) {
    copyrightText.innerHTML = `&copy; 2026 <strong>${SCHOOL_CONFIG.name}</strong>. Hak Cipta Dilindungi. <br><span style="font-size: 0.85rem; opacity: 0.7;">Demo Showcase Portofolio oleh HZXPro Studio</span>`;
  }
}

// C. Render Facilities
function renderFacilities() {
  const container = document.getElementById('facilities-grid');
  if (!container) return;

  container.innerHTML = '';
  SCHOOL_CONFIG.facilities.forEach(fac => {
    // Get SVG icon based on name/slug
    let iconSvg = '';
    if (fac.icon === 'desktop') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
    } else if (fac.icon === 'book') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
    } else { // presentation / generic
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>';
    }

    const card = document.createElement('div');
    card.className = 'facility-card shadow-sm scroll-reveal';
    card.innerHTML = `
      <div class="facility-image-wrapper">
        <img src="${fac.image}" alt="${fac.name}" loading="lazy">
        <div class="facility-icon-badge">${iconSvg}</div>
      </div>
      <div class="facility-info">
        <h3>${fac.name}</h3>
        <p>${fac.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// D. Render Programs
function renderPrograms() {
  const container = document.getElementById('programs-grid');
  if (!container) return;

  container.innerHTML = '';
  SCHOOL_CONFIG.programs.forEach(prog => {
    let iconSvg = '';
    if (prog.icon === 'flask') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12"></path><path d="M12 3v14"></path><path d="M9 21h6"></path><path d="M10 8.5h4"></path><path d="M18 21a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2C6 16 9 8 9 8h6s3 8 3 13z"></path></svg>';
    } else if (prog.icon === 'globe') {
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
    } else { // translate / speech
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14"></path><path d="M9 4v4"></path><path d="M14 4v4"></path><path d="M4 16h11a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2z"></path><path d="M22 10v6a2 2 0 0 1-2 2h-3l-4 4v-4H9"></path></svg>';
    }

    const card = document.createElement('div');
    card.className = 'program-card scroll-reveal';
    card.style.setProperty('--card-accent-color', prog.color);
    card.innerHTML = `
      <div class="program-img">
        <img src="${prog.image}" alt="${prog.name}" loading="lazy">
        <div class="program-icon-overlay">${iconSvg}</div>
      </div>
      <div class="program-content">
        <h3>${prog.name}</h3>
        <p>${prog.description}</p>
        <a href="#ppdb" class="program-btn" onclick="selectProgram('${prog.id}')">Pilih Program &rarr;</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// E. Render Gallery with Category Filtering
function renderGallery() {
  const container = document.getElementById('gallery-grid');
  const filterWrapper = document.getElementById('gallery-filters');
  if (!container || !filterWrapper) return;

  // Render filter buttons based on active categories
  const categories = ['semua', ...new Set(SCHOOL_CONFIG.gallery.map(item => item.category))];
  filterWrapper.innerHTML = '';
  
  categories.forEach((cat, idx) => {
    const btn = document.createElement('button');
    btn.className = `btn-filter ${idx === 0 ? 'active' : ''}`;
    btn.setAttribute('data-filter', cat);
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    
    btn.addEventListener('click', () => {
      // Toggle active state
      filterWrapper.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter gallery cards
      const filterVal = cat.toLowerCase();
      document.querySelectorAll('.gallery-card').forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'semua' || cardCat === filterVal) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
    
    filterWrapper.appendChild(btn);
  });

  // Render gallery cards
  container.innerHTML = '';
  SCHOOL_CONFIG.gallery.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'gallery-card scroll-reveal';
    card.setAttribute('data-category', item.category);
    card.setAttribute('data-index', index);
    card.innerHTML = `
      <div class="gallery-inner">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="gallery-overlay">
          <div class="gallery-info">
            <span class="gallery-category">${item.category.toUpperCase()}</span>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <span class="view-zoom-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </span>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// F. Render Teachers
function renderTeachers() {
  const container = document.getElementById('teachers-grid');
  if (!container) return;

  container.innerHTML = '';
  SCHOOL_CONFIG.teachers.forEach(teacher => {
    const card = document.createElement('div');
    card.className = 'teacher-card scroll-reveal';
    card.innerHTML = `
      <div class="teacher-img-wrapper">
        <img src="${teacher.image}" alt="${teacher.name}" loading="lazy">
      </div>
      <div class="teacher-details">
        <h4>${teacher.name}</h4>
        <span class="teacher-role">${teacher.role}</span>
        <div class="teacher-subject">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2" style="display:inline; vertical-align:middle; width:16px; margin-right:4px;"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
          <span>${teacher.subject}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// G. Render Academic Schedule
function renderSchedule() {
  const container = document.getElementById('schedule-list');
  if (!container) return;

  container.innerHTML = '';
  SCHOOL_CONFIG.schedule.forEach(item => {
    const scheduleRow = document.createElement('div');
    scheduleRow.className = 'schedule-row scroll-reveal';
    
    // Assign color badge based on category
    let badgeClass = 'badge-academic';
    if (item.category.toLowerCase() === 'ujian') badgeClass = 'badge-exam';
    if (item.category.toLowerCase() === 'event') badgeClass = 'badge-event';

    scheduleRow.innerHTML = `
      <div class="schedule-date">
        <div class="calendar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </div>
        <span>${item.date}</span>
      </div>
      <div class="schedule-details">
        <h4>${item.event}</h4>
      </div>
      <div class="schedule-category">
        <span class="badge ${badgeClass}">${item.category}</span>
      </div>
    `;
    container.appendChild(scheduleRow);
  });
}

// H. Setup dynamic dropdown select based on program config
function setupDynamicSelectors() {
  const select = document.getElementById('ppdb-program');
  if (!select) return;

  select.innerHTML = '<option value="" disabled selected>Pilih Program Peminatan...</option>';
  SCHOOL_CONFIG.programs.forEach(prog => {
    const opt = document.createElement('option');
    opt.value = prog.shortName;
    opt.textContent = prog.name;
    select.appendChild(opt);
  });
}

// Expose selection trigger globally for click action on Program card
window.selectProgram = function(programId) {
  const select = document.getElementById('ppdb-program');
  if (!select) return;
  
  const program = SCHOOL_CONFIG.programs.find(p => p.id === programId);
  if (program) {
    select.value = program.shortName;
  }
};

// I. Setup PPDB Form Validation & Submission Redirect
function setupPPDBForm() {
  const form = document.getElementById('ppdb-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset error messages
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

    // Form inputs
    const fullName = document.getElementById('ppdb-fullname');
    const parentPhone = document.getElementById('ppdb-phone');
    const email = document.getElementById('ppdb-email');
    const program = document.getElementById('ppdb-program');
    const documentFile = document.getElementById('ppdb-file');

    let isValid = true;

    // Helper validation error display
    const showError = (inputEl, message) => {
      inputEl.classList.add('is-invalid');
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.display = 'block';
      err.textContent = message;
      inputEl.parentNode.appendChild(err);
      isValid = false;
    };

    // Full name check
    if (!fullName.value.trim()) {
      showError(fullName, 'Nama lengkap wajib diisi.');
    } else if (fullName.value.trim().length < 3) {
      showError(fullName, 'Nama lengkap minimal 3 karakter.');
    }

    // Phone number check (must contain only numbers, length between 10-14)
    const phoneVal = parentPhone.value.trim().replace(/[^0-9]/g, '');
    if (!parentPhone.value.trim()) {
      showError(parentPhone, 'Nomor Handphone wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(parentPhone, 'Nomor Handphone tidak valid (minimal 9 digit, maksimal 14 digit).');
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError(email, 'Alamat Email wajib diisi.');
    } else if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Format email tidak valid.');
    }

    // Program check
    if (!program.value) {
      showError(program, 'Silakan pilih jurusan/program peminatan.');
    }

    // If validations pass, construct WhatsApp text & redirect
    if (isValid) {
      const waNumber = SCHOOL_CONFIG.contact.whatsapp;
      const schoolName = SCHOOL_CONFIG.fullName;

      // Clean phone number format for WhatsApp API
      let waMessage = `*PENDAFTARAN PPDB ONLINE - ${schoolName.toUpperCase()}*\n`;
      waMessage += `===================================\n\n`;
      waMessage += `Halo Admin PPDB ${SCHOOL_CONFIG.name},\n`;
      waMessage += `Saya ingin mengajukan pendaftaran peserta didik baru dengan data berikut:\n\n`;
      waMessage += `👤 *Nama Lengkap:* ${fullName.value.trim()}\n`;
      waMessage += `📞 *No. Handphone:* ${parentPhone.value.trim()}\n`;
      waMessage += `📧 *Email Aktif:* ${email.value.trim()}\n`;
      waMessage += `🎓 *Pilihan Program:* ${program.value}\n`;
      if (documentFile.files.length > 0) {
        waMessage += `📎 *Dokumen Terlampir:* ${documentFile.files[0].name} (diunggah pada form)\n`;
      }
      waMessage += `\nMohon informasi selanjutnya terkait prosedur verifikasi dokumen. Terima kasih!`;

      // Encode message
      const encodedText = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedText}`;

      // Show success modal/feedback state before redirect
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" style="display:inline-block; vertical-align:middle; width:20px; animation: spin 1s linear infinite; margin-right:8px;">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:0.25;"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity:0.75;"></path>
        </svg> Memproses...`;

      // Redirect style keyframes injection for loading spinner
      if (!document.getElementById('spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframes';
        style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }

      // Simulate network wait then redirect
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Show thank you banner or redirect immediately
        alert('Pendaftaran Berhasil Dibuat!\nAnda akan diarahkan ke WhatsApp Admin PPDB untuk menyerahkan data.');
        window.open(whatsappUrl, '_blank');
      }, 1200);
    }
  });
}

// J. Setup Gallery Lightbox Modal
function setupGalleryLightbox() {
  const cards = document.querySelectorAll('.gallery-card');
  if (cards.length === 0) return;

  // Create Lightbox DOM structure if it doesn't exist
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
  const galleryItems = SCHOOL_CONFIG.gallery;

  const showImage = (index) => {
    currentIdx = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIdx];
    lightboxImg.src = item.image;
    lightboxCap.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>`;
  };

  // Open lightbox
  document.getElementById('gallery-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.gallery-card');
    if (!card) return;
    
    const idx = parseInt(card.getAttribute('data-index'), 10);
    showImage(idx);
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  });

  // Close lightbox
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

  // Navigation
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIdx - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIdx + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(currentIdx - 1);
    if (e.key === 'ArrowRight') showImage(currentIdx + 1);
  });
}

// K. Setup Scroll Reveal Animations
function setupScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });

  elements.forEach(el => observer.observe(el));
}
