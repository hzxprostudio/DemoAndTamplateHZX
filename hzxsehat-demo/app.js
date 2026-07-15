/**
 * UPT Puskesmas Sehat Sejahtera - Pendaftaran Online
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupPatientForm();
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

// 3. PATIENT FORM VALIDATION & WHATSAPP REDIRECT
function setupPatientForm() {
  const form = document.getElementById('patient-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('patient-name');
    const nikEl = document.getElementById('patient-nik');
    const phoneEl = document.getElementById('patient-phone');
    const poliEl = document.getElementById('patient-poli');
    const descEl = document.getElementById('patient-desc');

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
      showError(nameEl, 'Nama lengkap pasien wajib diisi.');
    } else if (nameEl.value.trim().length < 3) {
      showError(nameEl, 'Nama lengkap minimal 3 karakter.');
    }

    const nikVal = nikEl.value.trim().replace(/[^0-9]/g, '');
    if (!nikEl.value.trim()) {
      showError(nikEl, 'Nomor NIK KTP wajib diisi.');
    } else if (nikVal.length !== 16) {
      showError(nikEl, 'NIK harus tepat berisi 16 digit angka.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    if (!poliEl.value) {
      showError(poliEl, 'Silakan pilih poliklinik tujuan berobat.');
    }

    if (!descEl.value.trim()) {
      showError(descEl, 'Silakan jelaskan gejala/keluhan medis Anda.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA / Puskesmas Admin
      let msg = `*PENDAFTARAN BEROBAT ONLINE - PUSKESMAS SEHAT*\n`;
      msg += `=================================================\n\n`;
      msg += `Halo Petugas Loket Pendaftaran Puskesmas,\n`;
      msg += `Saya ingin mendaftarkan pasien untuk berobat dengan rincian berikut:\n\n`;
      msg += `👤 *Nama Pasien:* ${nameEl.value.trim()}\n`;
      msg += `💳 *NIK Pasien:* ${nikVal}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `🏥 *Poliklinik Tujuan:* ${poliEl.value}\n`;
      msg += `📝 *Keluhan Medis:* ${descEl.value.trim()}\n\n`;
      msg += `Mohon konfirmasi nomor antrean berobat untuk tanggal kedatangan besok. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Pendaftaran Berhasil!\nAnda akan diarahkan ke WhatsApp Loket Puskesmas untuk verifikasi rekam medis dan penomoran antrean.');
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
    }
  });
}
