/**
 * HZX Peduli - Rebrandable Foundation & Orphanage Template
 * Powered by HZXPro Studio
 */

const PEDULI_CONFIG = {
  name: 'Yayasan Peduli Kasih HZX',
  fullName: 'Yayasan Peduli Kasih HZX Indonesia',
  tagline: 'Menebar Harapan, Mengasuh Masa Depan Anak-Anak Bangsa',
  whatsappAdmin: '6281234567890',
  legality: 'Kemenkumham RI No. AHU-0012345.AH.01.04/2020',
  
  bankAccount: {
    name: 'Bank Mandiri Syariah (BSI)',
    number: '123-456-789-0',
    holder: 'YAYASAN PEDULI KASIH HZX'
  },

  campaigns: [
    { id: 'pendidikan', title: 'Beasiswa Pendidikan Anak Yatim', collected: 32000000, target: 50000000, desc: 'Bantuan biaya sekolah, buku, dan uang saku untuk 50 anak yatim binaan yayasan.' },
    { id: 'makanan', title: 'Sedekah Pangan Santri Penghafal Qur\'an', collected: 15400000, target: 20000000, desc: 'Pemenuhan kebutuhan gizi, beras, dan lauk pauk sehat setiap bulan.' },
    { id: 'renovasi', title: 'Renovasi Gedung Asrama Panti', collected: 78000000, target: 120000000, desc: 'Perbaikan atap bocor dan perluasan kamar tidur anak-anak panti asuhan.' }
  ],

  recentDonors: [
    { name: 'Hamba Allah', amount: 500000, date: '14 Juli 2026', campaign: 'Beasiswa Pendidikan' },
    { name: 'Ibu Ratih Lestari', amount: 1500000, date: '13 Juli 2026', campaign: 'Gedung Asrama' },
    { name: 'Bapak Budi Hartono', amount: 300000, date: '12 Juli 2026', campaign: 'Sedekah Pangan' },
    { name: 'Hamba Allah', amount: 1000000, date: '10 Juli 2026', campaign: 'Beasiswa Pendidikan' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-peduli]').forEach(el => {
    const key = el.getAttribute('data-peduli');
    if (PEDULI_CONFIG[key]) el.textContent = PEDULI_CONFIG[key];
  });

  // Render Campaigns with Progress Bars
  renderCampaigns();

  // Render Recent Donors Table
  renderRecentDonors();

  // Setup Donation Form
  setupDonationForm();
});

function renderCampaigns() {
  const container = document.getElementById('campaigns-grid');
  if (!container) return;

  container.innerHTML = '';
  PEDULI_CONFIG.campaigns.forEach(camp => {
    const percent = Math.min(Math.round((camp.collected / camp.target) * 100), 100);
    const card = document.createElement('div');
    card.className = 'campaign-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="campaign-info">
        <h4>${camp.title}</h4>
        <p>${camp.desc}</p>
        
        <div class="progress-bar-wrapper">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="progress-bar-labels">
            <span>Terkumpul: <strong>Rp ${camp.collected.toLocaleString('id-ID')}</strong></span>
            <span>Target: <strong>Rp ${camp.target.toLocaleString('id-ID')}</strong></span>
          </div>
          <span class="progress-percent-badge">${percent}%</span>
        </div>
        <a href="#donasi" class="btn btn-primary campaign-btn" onclick="selectCampaign('${camp.id}')">Donasi Sekarang</a>
      </div>
    `;
    container.appendChild(card);
  });
}

window.selectCampaign = function(campId) {
  const select = document.getElementById('donation-camp');
  if (!select) return;
  
  const camp = PEDULI_CONFIG.campaigns.find(c => c.id === campId);
  if (camp) {
    select.value = camp.id;
  }
};

function renderRecentDonors() {
  const tbody = document.getElementById('donors-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  PEDULI_CONFIG.recentDonors.forEach(donor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${donor.name}</strong></td>
      <td>Rp ${donor.amount.toLocaleString('id-ID')}</td>
      <td><span class="badge badge-campaign">${donor.campaign}</span></td>
      <td>${donor.date}</td>
    `;
    tbody.appendChild(row);
  });
}

function setupDonationForm() {
  const form = document.getElementById('donation-form');
  const select = document.getElementById('donation-camp');
  
  if (!form || !select) return;

  // Render Campaign Options
  select.innerHTML = '<option value="" disabled selected>Pilih program donasi...</option>';
  PEDULI_CONFIG.campaigns.forEach(camp => {
    const opt = document.createElement('option');
    opt.value = camp.id;
    opt.textContent = camp.title;
    select.appendChild(opt);
  });

  // Render Bank Details
  const bankContainer = document.getElementById('bank-container');
  if (bankContainer) {
    bankContainer.innerHTML = `
      <div class="bank-card">
        <strong>${PEDULI_CONFIG.bankAccount.name}</strong>
        <p class="bank-num">${PEDULI_CONFIG.bankAccount.number}</p>
        <small>A.N. ${PEDULI_CONFIG.bankAccount.holder}</small>
        <button type="button" class="btn-copy" onclick="copyBankNumber()">Salin Nomor Rekening</button>
      </div>
    `;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('donator-name');
    const anonInput = document.getElementById('donator-anon');
    const amountInput = document.getElementById('donator-amount');
    const campSelect = document.getElementById('donation-camp');
    const phoneInput = document.getElementById('donator-phone');

    // Reset validation errors
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());

    let isValid = true;

    const showError = (el, msg) => {
      el.classList.add('is-invalid');
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.display = 'block';
      err.textContent = msg;
      el.parentNode.appendChild(err);
      isValid = false;
    };

    let donatorName = nameInput.value.trim();
    if (anonInput.checked) {
      donatorName = 'Hamba Allah';
    } else if (!donatorName) {
      showError(nameInput, 'Nama donatur wajib diisi jika tidak dicentang Hamba Allah.');
    }

    if (!amountInput.value || isNaN(amountInput.value) || parseInt(amountInput.value) < 1000) {
      showError(amountInput, 'Nominal donasi minimal Rp 1.000.');
    }
    if (!campSelect.value) {
      showError(campSelect, 'Pilih program bantuan donasi.');
    }
    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Nomor Handphone wajib diisi.');
    }

    if (isValid) {
      const waMsg = `*KONFIRMASI DONASI YAYASAN - ${PEDULI_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Admin Yayasan,\nSaya ingin mengonfirmasi pengiriman donasi sosial:\n\n` +
        `👤 *Nama Donatur:* ${donatorName}\n` +
        `📞 *No. Handphone:* ${phoneInput.value.trim()}\n` +
        `📂 *Program Tujuan:* ${campSelect.options[campSelect.selectedIndex].text}\n` +
        `💵 *Nominal:* Rp ${parseInt(amountInput.value).toLocaleString('id-ID')}\n` +
        `🏦 *Bank Tujuan:* ${PEDULI_CONFIG.bankAccount.name}\n\n` +
        `_(Bukti resi transfer terlampir setelah pesan ini)_`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${PEDULI_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Menyusun Pesan...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Data Tersimpan! Silakan kirimkan bukti transfer Anda ke WhatsApp Admin Yayasan.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}

window.copyBankNumber = function() {
  const num = PEDULI_CONFIG.bankAccount.number;
  navigator.clipboard.writeText(num).then(() => {
    alert('Nomor rekening yayasan disalin!');
  }).catch(() => {
    alert('Gagal menyalin otomatis, silakan salin manual: ' + num);
  });
};
