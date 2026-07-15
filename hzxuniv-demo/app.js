/**
 * Universitas HZX Bandung - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupFacultyAccordion();
  setupPmbForm();
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

// 3. FACULTY EXPANDABLE ACCORDION
function setupFacultyAccordion() {
  const accordions = document.querySelectorAll('.faculty-accordion-card');

  accordions.forEach(card => {
    const header = card.querySelector('.faculty-header');
    
    if (header) {
      header.addEventListener('click', () => {
        const isActive = card.classList.contains('active');

        // Collapse all others
        accordions.forEach(c => c.classList.remove('active'));

        // Toggle active
        if (!isActive) {
          card.classList.add('active');
        }
      });
    }
  });

  // Open the first faculty by default
  if (accordions.length > 0) {
    accordions[0].classList.add('active');
  }
}

// 4. PMB FORM VALIDATION & WHATSAPP REDIRECT
function setupPmbForm() {
  const form = document.getElementById('pmb-form-el');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('apply-name');
    const schoolEl = document.getElementById('apply-school');
    const phoneEl = document.getElementById('apply-phone');
    const pathEl = document.getElementById('apply-path');
    const prodiEl = document.getElementById('apply-prodi');
    const addrEl = document.getElementById('apply-address');

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
      showError(nameEl, 'Nama lengkap calon mahasiswa wajib diisi.');
    } else if (nameEl.value.trim().length < 3) {
      showError(nameEl, 'Nama lengkap minimal 3 karakter.');
    }

    if (!schoolEl.value.trim()) {
      showError(schoolEl, 'Asal sekolah (SMA/SMK) wajib diisi.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp aktif wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    if (!pathEl.value) {
      showError(pathEl, 'Silakan pilih jalur masuk pendaftaran.');
    }

    if (!prodiEl.value) {
      showError(prodiEl, 'Silakan pilih program studi tujuan.');
    }

    if (!addrEl.value.trim()) {
      showError(addrEl, 'Alamat lengkap tempat tinggal wajib diisi.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA / PMB Admin
      let msg = `*PENDAFTARAN MAHASISWA BARU (PMB) ONLINE - UNIVERSITAS HZX*\n`;
      msg += `===========================================================\n\n`;
      msg += `Halo Panitia PMB Universitas HZX Bandung,\n`;
      msg += `Saya ingin melakukan registrasi awal PMB dengan rincian data diri sebagai berikut:\n\n`;
      msg += `👤 *Nama Lengkap:* ${nameEl.value.trim()}\n`;
      msg += `🏫 *Asal Sekolah:* ${schoolEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `🎓 *Jalur Masuk:* ${pathEl.value}\n`;
      msg += `🏛️ *Pilihan Prodi:* ${prodiEl.value}\n`;
      msg += `📍 *Alamat Rumah:* ${addrEl.value.trim()}\n\n`;
      msg += `Mohon bantu kirimkan nomor tes ujian seleksi CAT atau panduan upload berkas rapor jalur beasiswa. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Registrasi PMB Berhasil Terkirim!\nAnda akan diarahkan ke WhatsApp Panitia PMB untuk penyerahan berkas nilai rapor dan ijazah.');
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
