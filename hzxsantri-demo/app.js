/**
 * Pondok Pesantren HZX Darussalam - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupPsbForm();
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

// 3. PSB FORM VALIDATION & WHATSAPP REDIRECT
function setupPsbForm() {
  const form = document.getElementById('psb-form-el');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const sNameEl = document.getElementById('santri-name');
    const pNameEl = document.getElementById('parent-name');
    const pPhoneEl = document.getElementById('parent-phone');
    const choiceEl = document.getElementById('program-choice');
    const schoolEl = document.getElementById('prev-school');
    const addrEl = document.getElementById('santri-address');

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
    if (!sNameEl.value.trim()) {
      showError(sNameEl, 'Nama lengkap calon santri wajib diisi.');
    } else if (sNameEl.value.trim().length < 3) {
      showError(sNameEl, 'Nama lengkap santri minimal 3 karakter.');
    }

    if (!pNameEl.value.trim()) {
      showError(pNameEl, 'Nama lengkap wali / orang tua wajib diisi.');
    }

    const phoneVal = pPhoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!pPhoneEl.value.trim()) {
      showError(pPhoneEl, 'Nomor WhatsApp wali wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(pPhoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    if (!choiceEl.value) {
      showError(choiceEl, 'Silakan pilih jenjang & program pesantren.');
    }

    if (!schoolEl.value.trim()) {
      showError(schoolEl, 'Asal sekolah sebelumnya wajib diisi.');
    }

    if (!addrEl.value.trim()) {
      showError(addrEl, 'Alamat domisili lengkap wajib diisi.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA / Ponpes Admin
      let msg = `*PENDAFTARAN SANTRI BARU (PSB) ONLINE - PP HZX DARUSSALAM*\n`;
      msg += `==========================================================\n\n`;
      msg += `Assalamu'alaikum Wr. Wb. Panitia PSB Ponpes,\n`;
      msg += `Saya ingin mendaftarkan calon santri baru dengan rincian data sebagai berikut:\n\n`;
      msg += `👤 *Nama Calon Santri:* ${sNameEl.value.trim()}\n`;
      msg += `👤 *Nama Wali / Orang Tua:* ${pNameEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp Wali:* ${pPhoneEl.value.trim()}\n`;
      msg += `🏫 *Asal Sekolah:* ${schoolEl.value.trim()}\n`;
      msg += `🕌 *Pilihan Program:* ${choiceEl.value}\n`;
      msg += `📍 *Alamat Domisili:* ${addrEl.value.trim()}\n\n`;
      msg += `Mohon segera berikan informasi perihal berkas persyaratan pendaftaran serta jadwal tes seleksi lisan (membaca Al-Qur'an). Syukron.`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Pendaftaran PSB Berhasil Terkirim!\nAnda akan diarahkan ke WhatsApp Panitia Penerimaan Santri Baru untuk info jadwal ujian lisan.');
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
    }
  });
}

// 4. GALLERY LIGHTBOX MODAL
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
