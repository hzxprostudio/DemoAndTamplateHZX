/**
 * SMA HZX EDU - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupPPDBForm();
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

// 3. PPDB FORM VALIDATION & WHATSAPP REDIRECT
function setupPPDBForm() {
  const form = document.getElementById('ppdb-form-el');
  if (!form) return;

  // Listen to program selection button click in programs grid
  const selectBtns = document.querySelectorAll('.select-prog-btn');
  const programSelect = document.getElementById('student-program');
  
  selectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const progName = btn.getAttribute('data-program');
      if (programSelect && progName) {
        programSelect.value = progName;
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset previous errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('student-name');
    const phoneEl = document.getElementById('parent-phone');
    const emailEl = document.getElementById('student-email');
    const programEl = document.getElementById('student-program');
    const notesEl = document.getElementById('ppdb-notes');

    let isValid = true;

    const showError = (el, msg) => {
      el.style.borderColor = '#ef4444';
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.fontWeight = '500';
      err.style.fontSize = '0.8rem';
      err.textContent = msg;
      el.parentNode.appendChild(err);
      isValid = false;
    };

    // Validations
    if (!nameEl.value.trim()) {
      showError(nameEl, 'Nama lengkap calon siswa wajib diisi.');
    } else if (nameEl.value.trim().length < 3) {
      showError(nameEl, 'Nama lengkap minimal 3 karakter.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit angka).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailEl.value.trim()) {
      showError(emailEl, 'Alamat email wajib diisi.');
    } else if (!emailRegex.test(emailEl.value.trim())) {
      showError(emailEl, 'Format email tidak valid.');
    }

    if (!programEl.value) {
      showError(programEl, 'Silakan pilih jurusan pendaftaran.');
    }

    if (isValid) {
      // Build WA message
      const waNumber = '6282128297825'; // HZXPro Admin WA
      let msg = `*PENDAFTARAN PPDB ONLINE - SMA HZX EDU*\n`;
      msg += `===================================\n\n`;
      msg += `Halo Admin PPDB HZX EDU,\n`;
      msg += `Saya ingin mendaftarkan calon siswa baru dengan data berikut:\n\n`;
      msg += `👤 *Nama Lengkap:* ${nameEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `✉️ *Email:* ${emailEl.value.trim()}\n`;
      msg += `🎓 *Pilihan Jurusan:* ${programEl.value}\n`;
      
      if (notesEl.value.trim()) {
        msg += `📝 *Catatan Tambahan:* ${notesEl.value.trim()}\n`;
      }
      
      msg += `\nMohon instruksi selanjutnya terkait proses verifikasi berkas. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Pendaftaran Berhasil!\nAnda akan diarahkan ke WhatsApp Admin PPDB untuk langkah selanjutnya.');
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
      document.body.style.overflow = 'hidden'; // Lock background scrolling
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
