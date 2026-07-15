/**
 * Koperasi HZX Sejahtera - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupLoanCalculator();
  setupFormConditionalFields();
  setupLoanForm();
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

// 3. LOAN SIMULATION CALCULATOR
function setupLoanCalculator() {
  const amountInput = document.getElementById('calc-amount');
  const tenorSelect = document.getElementById('calc-tenor');

  if (!amountInput || !tenorSelect) return;

  function calculateSimulasi() {
    const amount = parseFloat(amountInput.value) || 0;
    const tenor = parseInt(tenorSelect.value) || 12;

    // 1% flat interest rate per month
    const principal = amount / tenor;
    const interest = amount * 0.01;
    const total = principal + interest;

    const formatCurrency = (val) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val) + ' / bln';
    };

    document.getElementById('res-principal').textContent = formatCurrency(principal);
    document.getElementById('res-interest').textContent = formatCurrency(interest);
    document.getElementById('res-total').textContent = formatCurrency(total);
  }

  // Bind events
  amountInput.addEventListener('input', calculateSimulasi);
  tenorSelect.addEventListener('change', calculateSimulasi);

  // Initial calculation
  calculateSimulasi();

  // "Ajukan Pinjaman Ini" button action
  const useSimBtn = document.querySelector('.use-simulation-btn');
  const applyTypeSelect = document.getElementById('apply-type');
  const applyAmountInput = document.getElementById('apply-amount');
  const applyTenorSelect = document.getElementById('apply-tenor');
  const loanFieldsWrapper = document.getElementById('loan-fields-wrapper');

  if (useSimBtn) {
    useSimBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (applyTypeSelect) {
        applyTypeSelect.value = 'Pengajuan Pinjaman Multiguna Sahabat';
        if (loanFieldsWrapper) {
          loanFieldsWrapper.style.display = 'block';
        }
      }

      if (applyAmountInput) {
        applyAmountInput.value = amountInput.value;
      }

      if (applyTenorSelect) {
        applyTenorSelect.value = tenorSelect.value + ' Bulan';
      }

      // Smooth scroll to form section
      const formSec = document.getElementById('pengajuan');
      if (formSec) {
        formSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// 4. CONDITIONAL FIELDS DISPLAY (FORM)
function setupFormConditionalFields() {
  const typeSelect = document.getElementById('apply-type');
  const loanFieldsWrapper = document.getElementById('loan-fields-wrapper');

  if (typeSelect && loanFieldsWrapper) {
    typeSelect.addEventListener('change', () => {
      if (typeSelect.value === 'Pengajuan Pinjaman Multiguna Sahabat') {
        loanFieldsWrapper.style.display = 'block';
        document.getElementById('apply-amount').required = true;
      } else {
        loanFieldsWrapper.style.display = 'none';
        document.getElementById('apply-amount').required = false;
      }
    });
  }
}

// 5. LOAN FORM VALIDATION & WHATSAPP REDIRECT
function setupLoanForm() {
  const form = document.getElementById('loan-form-el');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const typeEl = document.getElementById('apply-type');
    const nameEl = document.getElementById('apply-name');
    const phoneEl = document.getElementById('apply-phone');
    const amountEl = document.getElementById('apply-amount');
    const tenorEl = document.getElementById('apply-tenor');
    const descEl = document.getElementById('apply-desc');

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
    if (!typeEl.value) {
      showError(typeEl, 'Silakan pilih jenis pengajuan Anda.');
    }

    if (!nameEl.value.trim()) {
      showError(nameEl, 'Nama lengkap pemohon wajib diisi.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp pemohon wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    // Specific loan validations if selected
    if (typeEl.value === 'Pengajuan Pinjaman Multiguna Sahabat') {
      const amountVal = parseFloat(amountEl.value);
      if (!amountEl.value) {
        showError(amountEl, 'Nominal pinjaman wajib diisi.');
      } else if (isNaN(amountVal) || amountVal < 1000000 || amountVal > 50000000) {
        showError(amountEl, 'Nominal pinjaman valid antara Rp 1 Juta s.d Rp 50 Juta.');
      }
    }

    if (!descEl.value.trim()) {
      showError(descEl, 'Silakan berikan keterangan detail tujuan pengajuan Anda.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA / Koperasi Admin
      let msg = `*PENGAJUAN ONLINE - KOPERASI HZX SEJAHTERA*\n`;
      msg += `==============================================\n\n`;
      msg += `Halo Pengurus Koperasi KSP HZX,\n`;
      msg += `Saya ingin mengajukan permohonan layanan koperasi sebagai berikut:\n\n`;
      msg += `📌 *Jenis Layanan:* ${typeEl.value}\n`;
      msg += `👤 *Nama Lengkap:* ${nameEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      
      if (typeEl.value === 'Pengajuan Pinjaman Multiguna Sahabat') {
        const formattedAmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amountEl.value);
        msg += `💰 *Jumlah Pinjaman:* ${formattedAmt}\n`;
        msg += `⏱️ *Tenor Cicilan:* ${tenorEl.value}\n`;
      }
      
      msg += `📝 *Keterangan/Usaha:* ${descEl.value.trim()}\n\n`;
      msg += `Mohon segera diproses untuk jadwal verifikasi berkas dan survei lapangan. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        
        // Reset conditional display
        if (loanFieldsWrapper) {
          loanFieldsWrapper.style.display = 'none';
        }

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Pengajuan Berhasil Terkirim!\nAnda akan diarahkan ke WhatsApp Account Officer Koperasi untuk verifikasi jaminan KTP/BPKB.');
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
    }
  });
}
