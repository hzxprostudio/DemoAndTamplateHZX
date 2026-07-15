/**
 * Ikatan Alumni HZX - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupAlumniDirectory();
  setupAlumniForm();
  setupGalleryLightbox();
});

// 1. NAVBAR MOBILE TOGGLE
function setupNavbar() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  
  if (menuToggle && navbarMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    navbarMenu.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbarMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navbarMenu.classList.remove('active');
      }
    });
  }
}

// 2. SCROLLSPY (ACTIVE LINK HIGHLIGHT)
function setupScrollspy() {
  const navLinks = document.querySelectorAll('.navbar-menu .nav-link');
  const scrollspySections = Array.from(navLinks)
    .map(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href !== '#') {
        try {
          return document.querySelector(href);
        } catch (e) {
          return null;
        }
      }
      return null;
    })
    .filter(Boolean);

  function activeScrollspy() {
    const scrollPos = window.scrollY + window.innerHeight * 0.3; // 30% offset
    let activeId = null;

    scrollspySections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        activeId = sec.id;
      }
    });

    if (activeId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + activeId);
      });
    }
  }

  window.addEventListener('scroll', activeScrollspy, { passive: true });
  activeScrollspy();
}

// 3. ALUMNI DIRECTORY SEARCH & FILTER
function setupAlumniDirectory() {
  const gridEl = document.getElementById('direktori-grid-el');
  const searchInput = document.getElementById('search-input');
  const angkatanSelect = document.getElementById('filter-angkatan');

  if (!gridEl) return;

  // Dummy database
  const alumniData = [
    { id: 1, name: 'Dr. Aditya Pratama', year: '1998', prof: 'Dokter Spesialis Jantung', loc: 'Kota Bandung' },
    { id: 2, name: 'Budi Setiawan', year: '2005', prof: 'Wirausaha / CEO Logistik', loc: 'Jakarta Selatan' },
    { id: 3, name: 'Riana Safitri, M.Pd', year: '2012', prof: 'Dosen Pendidikan Matematika', loc: 'Kota Bogor' },
    { id: 4, name: 'Sarah Amalia, S.Ds', year: '2022', prof: 'Lead UI/UX Designer', loc: 'Kota Bandung' },
    { id: 5, name: 'Andri Wijaya, S.T', year: '2018', prof: 'Software Engineer', loc: 'Jakarta Barat' },
    { id: 6, name: 'Mega Lestari, S.H', year: '2005', prof: 'Corporate Legal Counsel', loc: 'Kota Depok' }
  ];

  let searchQuery = '';
  let activeAngkatan = 'all';

  function renderAlumni() {
    gridEl.innerHTML = '';

    const filtered = alumniData.filter(item => {
      const matchesAngkatan = activeAngkatan === 'all' || item.year === activeAngkatan;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.prof.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.loc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAngkatan && matchesSearch;
    });

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; border: 1px solid #e7e5e4; background: #fff; border-radius: 8px;">
          <h4 style="margin: 0; color: #78716c; font-family: inherit;">Alumni tidak ditemukan. Coba kata kunci lainnya.</h4>
        </div>
      `;
      return;
    }

    filtered.forEach(alumnus => {
      // Get initials
      const names = alumnus.name.split(' ');
      const initials = names[0].startsWith('Dr.') ? names[1].charAt(0) : names[0].charAt(0);

      const card = document.createElement('div');
      card.className = 'alumni-card';
      card.innerHTML = `
        <div class="card-header-profile">
          <div class="profile-avatar-initials">${initials}</div>
          <div class="profile-meta">
            <h4>${alumnus.name}</h4>
            <span class="year">Angkatan ${alumnus.year}</span>
          </div>
        </div>
        <div class="card-profile-details">
          <span>💼 Pekerjaan: <strong>${alumnus.prof}</strong></span>
          <span>📍 Lokasi: <strong>${alumnus.loc}</strong></span>
        </div>
      `;
      gridEl.appendChild(card);
    });
  }

  // Bind search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderAlumni();
    });
  }

  // Bind select input
  if (angkatanSelect) {
    angkatanSelect.addEventListener('change', (e) => {
      activeAngkatan = e.target.value;
      renderAlumni();
    });
  }

  // Initial render
  renderAlumni();
}

// 4. ALUMNI REGISTRATION FORM VALIDATION & WHATSAPP REDIRECT
function setupAlumniForm() {
  const form = document.getElementById('alumni-form-el');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('alumni-name');
    const yearEl = document.getElementById('alumni-year');
    const phoneEl = document.getElementById('alumni-phone');
    const profEl = document.getElementById('alumni-profession');
    const addrEl = document.getElementById('alumni-address');

    let isValid = true;

    const showError = (el, msg) => {
      el.style.borderColor = '#ef4444';
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.fontWeight = '700';
      err.style.fontSize = '0.78rem';
      err.textContent = msg;
      el.parentNode.appendChild(err);
      isValid = false;
    };

    // Validations
    if (!nameEl.value.trim()) {
      showError(nameEl, 'Nama lengkap alumni wajib diisi.');
    }

    if (!yearEl.value) {
      showError(yearEl, 'Silakan pilih angkatan kelulusan Anda.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    if (!profEl.value.trim()) {
      showError(profEl, 'Profesi/pekerjaan saat ini wajib diisi.');
    }

    if (!addrEl.value.trim()) {
      showError(addrEl, 'Kota domisili tinggal wajib diisi.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA / IKA Alumni Admin
      let msg = `*REGISTRASI DATABASE ALUMNI - IKA HZX BANDUNG*\n`;
      msg += `===============================================\n\n`;
      msg += `Halo Pengurus Sekretariat IKA HZX,\n`;
      msg += `Saya alumni sekolah ingin mendaftarkan data diri ke database ikatan alumni:\n\n`;
      msg += `👤 *Nama Lengkap:* ${nameEl.value.trim()}\n`;
      msg += `🎓 *Tahun Kelulusan:* Angkatan ${yearEl.value}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `💼 *Profesi Saat Ini:* ${profEl.value.trim()}\n`;
      msg += `📍 *Kota Domisili:* ${addrEl.value.trim()}\n\n`;
      msg += `Mohon bantu verifikasi dan masukkan nama saya ke database keanggotaan ikatan alumni. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Registrasi Pendaftaran Berhasil!\nAnda akan diarahkan ke WhatsApp Pengurus IKA HZX untuk verifikasi berkas kartu alumni digital.');
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
    }
  });
}

// 5. GALLERY LIGHTBOX MODAL
function setupGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCap = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  if (!lightbox || !lightboxImg || !lightboxCap || !closeBtn) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      
      lightboxImg.src = src;
      lightboxCap.textContent = caption;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) {
      closeLightbox();
    }
  });
}
