/**
 * Masjid Jami Al-Muhajirin - Transparansi & Infaq Online
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupCashTransparency();
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

// 3. CASH TRANSPARENCY DYNAMIC TOTAL CALCULATION
function setupCashTransparency() {
  const tableBody = document.querySelector('#cash-table-el tbody');
  const incomeEl = document.getElementById('stat-income');
  const expenseEl = document.getElementById('stat-expense');
  const balanceEl = document.getElementById('stat-balance');

  if (!tableBody) return;

  // Dummy cash transactions
  const transactions = [
    { date: '02 Jul 2026', desc: 'Kotak Infaq Jum’at Pertama', type: 'masuk', amount: 4850000 },
    { date: '05 Jul 2026', desc: 'Pembayaran Listrik & Air Bersih Masjid', type: 'keluar', amount: 1250000 },
    { date: '09 Jul 2026', desc: 'Kotak Infaq Jum’at Kedua', type: 'masuk', amount: 5120000 },
    { date: '11 Jul 2026', desc: 'Santunan Yatim-Piatu Lingkungan RW 02 & 03', type: 'keluar', amount: 3000000 },
    { date: '12 Jul 2026', desc: 'Sumbangan Karpet Baru Hamba Allah via Transfer', type: 'masuk', amount: 8000000 },
    { date: '14 Jul 2026', desc: 'Operasional Pembelian Sabun & Alat Kebersihan', type: 'keluar', amount: 350000 }
  ];

  let totalIncome = 0;
  let totalExpense = 0;

  // Format currency
  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Render rows and calculate totals
  tableBody.innerHTML = '';
  transactions.forEach(t => {
    if (t.type === 'masuk') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td><span class="badge-type ${t.type}">${t.type}</span></td>
      <td class="text-right font-semibold ${t.type === 'masuk' ? 'text-emerald-700' : 'text-red-700'}">${formatRupiah(t.amount)}</td>
    `;
    tableBody.appendChild(row);
  });

  const netBalance = totalIncome - totalExpense;

  // Update DOM stats
  if (incomeEl) incomeEl.textContent = formatRupiah(totalIncome);
  if (expenseEl) expenseEl.textContent = formatRupiah(totalExpense);
  if (balanceEl) balanceEl.textContent = formatRupiah(netBalance);
}

// 4. DONATION FORM VALIDATION & WHATSAPP REDIRECT
function setupDonationForm() {
  const form = document.getElementById('donation-form-el');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('donor-name');
    const phoneEl = document.getElementById('donor-phone');
    const amountEl = document.getElementById('donor-amount');
    const bankEl = document.getElementById('donor-bank');
    const notesEl = document.getElementById('donor-notes');

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
      showError(nameEl, 'Nama donatur wajib diisi.');
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
      showError(amountEl, 'Minimal donasi adalah Rp 10.000.');
    }

    if (!bankEl.value) {
      showError(bankEl, 'Silakan pilih rekening tujuan transfer.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA
      let msg = `*KONFIRMASI INFAQ / DONASI ONLINE - MASJID JAMI AL-MUHAJIRIN*\n`;
      msg += `==========================================================\n\n`;
      msg += `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n`;
      msg += `Saya ingin mengonfirmasi transfer infaq dengan rincian berikut:\n\n`;
      msg += `👤 *Nama Donatur:* ${nameEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `💵 *Nominal:* Rp ${parseInt(amountEl.value).toLocaleString('id-ID')}\n`;
      msg += `🏦 *Tujuan Rekening:* ${bankEl.value}\n`;
      
      if (notesEl.value.trim()) {
        msg += `📝 *Pesan/Doa:* ${notesEl.value.trim()}\n`;
      }
      
      msg += `\nJazakumullah Khairan Katsiran atas amal jariyah yang disalurkan. Semoga berkah bagi jemaah.`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Konfirmasi Donasi Berhasil!\nAnda akan diarahkan ke WhatsApp Pengurus Masjid untuk pengiriman bukti transfer.');
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
