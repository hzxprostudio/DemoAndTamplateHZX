/**
 * Desa Makmur Jaya - Portal Resmi & Pelayanan Publik Mandiri
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupLetterForm();
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

// 3. LETTER FORM VALIDATION & WHATSAPP REDIRECT
function setupLetterForm() {
  const form = document.getElementById('letter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset previous errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('citizen-name');
    const nikEl = document.getElementById('citizen-nik');
    const phoneEl = document.getElementById('citizen-phone');
    const letterEl = document.getElementById('letter-select');
    const descEl = document.getElementById('letter-desc');

    let isValid = true;

    const showError = (el, msg) => {
      el.style.borderColor = '#ef4444';
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.fontWeight = '600';
      err.style.fontSize = '0.78rem';
      err.textContent = msg;
      el.parentNode.appendChild(err);
      isValid = false;
    };

    // Validations
    if (!nameEl.value.trim()) {
      showError(nameEl, 'Nama lengkap wajib diisi sesuai KTP.');
    } else if (nameEl.value.trim().length < 3) {
      showError(nameEl, 'Nama lengkap minimal 3 karakter.');
    }

    const nikVal = nikEl.value.trim().replace(/[^0-9]/g, '');
    if (!nikEl.value.trim()) {
      showError(nikEl, 'Nomor NIK wajib diisi.');
    } else if (nikVal.length !== 16) {
      showError(nikEl, 'NIK harus tepat berisi 16 digit angka.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp warga wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    if (!letterEl.value) {
      showError(letterEl, 'Pilih salah satu jenis pengajuan surat.');
    }

    if (!descEl.value.trim()) {
      showError(descEl, 'Silakan isi kolom keterangan keperluan pengajuan.');
    }

    if (isValid) {
      // Build WhatsApp Message
      const waNumber = '6282128297825'; // HZXPro Admin WA / Desa Admin
      let msg = `*PENGAJUAN SURAT MANDIRI ONLINE - DESA MAKMUR JAYA*\n`;
      msg += `=================================================\n\n`;
      msg += `Halo Petugas Pelayanan Kantor Desa,\n`;
      msg += `Saya ingin mengajukan permohonan surat administrasi dengan rincian berikut:\n\n`;
      msg += `👤 *Nama Lengkap:* ${nameEl.value.trim()}\n`;
      msg += `💳 *NIK Warga:* ${nikVal}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `📄 *Jenis Surat:* ${letterEl.value}\n`;
      msg += `📝 *Keperluan:* ${descEl.value.trim()}\n\n`;
      msg += `Mohon segera diproses berkas pengajuan ini. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Pengajuan Surat Terkirim!\nAnda akan diarahkan ke WhatsApp Admin Desa untuk penyerahan berkas verifikasi selanjutnya.');
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
