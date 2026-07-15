/**
 * Yayasan HZX Peduli - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupCampaignSelectors();
  setupAnonymousToggle();
  setupDonationForm();
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

// 3. CAMPAIGN SELECTORS FROM PROGRAM CARDS
function setupCampaignSelectors() {
  const selectBtns = document.querySelectorAll('.select-campaign-btn');
  const campaignSelect = document.getElementById('donor-campaign');

  selectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const campaignVal = btn.getAttribute('data-campaign');
      
      if (campaignSelect && campaignVal) {
        campaignSelect.value = campaignVal;
      }

      // Smooth scroll to donasi form
      const donasiSec = document.getElementById('donasi');
      if (donasiSec) {
        donasiSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// 4. ANONYMOUS DONOR TOGGLE
function setupAnonymousToggle() {
  const anonCheckbox = document.getElementById('donor-anonymous');
  const nameInput = document.getElementById('donor-name');

  if (anonCheckbox && nameInput) {
    anonCheckbox.addEventListener('change', () => {
      if (anonCheckbox.checked) {
        nameInput.value = 'Hamba Allah';
        nameInput.disabled = true;
        nameInput.style.backgroundColor = '#f1f5f9';
      } else {
        nameInput.value = '';
        nameInput.disabled = false;
        nameInput.style.backgroundColor = '';
        nameInput.placeholder = 'Masukkan nama lengkap Anda';
      }
    });
  }
}

// 5. DONATION FORM VALIDATION & WHATSAPP REDIRECT
function setupDonationForm() {
  const form = document.getElementById('donation-social-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const anonCheckbox = document.getElementById('donor-anonymous');
    const nameEl = document.getElementById('donor-name');
    const phoneEl = document.getElementById('donor-phone');
    const amountEl = document.getElementById('donor-amount');
    const campaignEl = document.getElementById('donor-campaign');
    const messageEl = document.getElementById('donor-message');

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
    if (!anonCheckbox.checked && !nameEl.value.trim()) {
      showError(nameEl, 'Nama donatur wajib diisi jika tidak berdonasi secara anonim.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    const amountVal = parseFloat(amountEl.value);
    if (!amountEl.value) {
      showError(amountEl, 'Nominal donasi wajib diisi.');
    } else if (isNaN(amountVal) || amountVal < 10000) {
      showError(amountEl, 'Nominal minimal donasi adalah Rp 10.000.');
    }

    if (!campaignEl.value) {
      showError(campaignEl, 'Silakan pilih program tujuan donasi.');
    }

    if (isValid) {
      // Format money for WhatsApp text
      const formattedAmount = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amountVal);

      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA
      let msg = `*KONFIRMASI DONASI ONLINE - YAYASAN HZX PEDULI*\n`;
      msg += `===============================================\n\n`;
      msg += `Halo Pengurus Yayasan HZX Peduli,\n`;
      msg += `Saya telah melakukan transfer donasi dengan rincian berikut:\n\n`;
      msg += `👤 *Nama Donatur:* ${anonCheckbox.checked ? 'Hamba Allah (Anonim)' : nameEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `💰 *Nominal Transfer:* ${formattedAmount}\n`;
      msg += `🏥 *Program Alokasi:* ${campaignEl.value}\n`;
      if (messageEl.value.trim()) {
        msg += `📝 *Titipan Doa/Pesan:* ${messageEl.value.trim()}\n`;
      }
      msg += `\nSaya akan melampirkan foto struk/bukti transfer setelah pesan ini terkirim. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        
        // Reset anonymous settings
        nameEl.disabled = false;
        nameEl.style.backgroundColor = '';
        nameEl.placeholder = 'Masukkan nama lengkap Anda';

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Konfirmasi Donasi Berhasil!\nAnda akan diarahkan ke WhatsApp Admin Yayasan untuk penyerahan bukti transfer.');
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
    }
  });
}

// 6. GALLERY LIGHTBOX MODAL
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
