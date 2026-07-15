/**
 * HZX Ibadah - Rebrandable House of Worship Website Template
 * Powered by HZXPro Studio
 */

const MOSQUE_CONFIG = {
  name: 'Masjid Al-Muhajirin',
  fullName: 'Masjid Raya Al-Muhajirin Bandung',
  tagline: 'Menebar Kedamaian, Membina Keimanan, dan Memakmurkan Umat',
  whatsappAdmin: '6281234567890',
  bankAccount: {
    name: 'BSI (Bank Syariah Indonesia)',
    number: '777-888-999-0',
    holder: 'PANITIA MASJID AL-MUHAJIRIN'
  },
  
  sholatSchedule: {
    Subuh: '04:45',
    Syuruq: '06:05',
    Dzuhur: '12:02',
    Ashar: '15:22',
    Maghrib: '17:58',
    Isya: '19:12'
  },

  activities: [
    { title: 'Kajian Tafsir Al-Qur\'an', day: 'Setiap Ahad Pagi', hour: '06:00 - 07:30 WIB', speaker: 'Ustadz H. Abdul Malik, Lc.' },
    { title: 'Kajian Fiqih Kontemporer', day: 'Setiap Selasa Malam', hour: 'Ba\'da Maghrib - Isya', speaker: 'Dr. KH. M. Yusuf, M.A.' },
    { title: 'Bimbingan Tahsin & Tajwid', day: 'Setiap Kamis Sore', hour: '16:00 - 17:30 WIB', speaker: 'Ustadz Muhammad Ridwan' },
    { title: 'Pembinaan Anak Yatim', day: 'Setiap Jumat Sore', hour: '15:30 - 17:00 WIB', speaker: 'Panitia Kesra Masjid' }
  ],

  takmir: [
    { name: 'H. Achmad Syarifuddin', role: 'Ketua DKM / Takmir', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300' },
    { name: 'Ustadz H. Abdul Malik, Lc.', role: 'Imam Utama & Pembina', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' }, // Standard mockups
    { name: 'H. Bambang Irawan', role: 'Bendahara Kas Masjid', image: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=300' }
  ],

  // Kas entries (pemasukan positif, pengeluaran negatif)
  cashFlow: [
    { date: '14 Juli 2026', desc: 'Infaq Kotak Jumat Rutin', amount: 4850000 },
    { date: '12 Juli 2026', desc: 'Donasi Pembangunan Kanopi Masjid', amount: 15000000 },
    { date: '10 Juli 2026', desc: 'Sedekah Subuh Jamaah', amount: 1250000 },
    { date: '08 Juli 2026', desc: 'Pembelian Karpet Saf Baru (3 Roll)', amount: -9000000 },
    { date: '06 Juli 2026', desc: 'Pembayaran Tagihan Listrik & Air', amount: -2450000 },
    { date: '03 Juli 2026', desc: 'Honorarium Khatib & Muadzin Jumat', amount: -1500000 }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config Info
  document.querySelectorAll('[data-mosque]').forEach(el => {
    const key = el.getAttribute('data-mosque');
    if (MOSQUE_CONFIG[key]) el.textContent = MOSQUE_CONFIG[key];
  });

  // Render Sholat Times
  renderSholatTimes();

  // Render Kegiatan
  renderActivities();

  // Render Takmir
  renderTakmir();

  // Render Cash Flow & Calculate Auto Totals
  calculateAndRenderCash();

  // setup Donation Form
  setupDonationForm();
});

function renderSholatTimes() {
  const container = document.getElementById('sholat-times-grid');
  if (!container) return;

  container.innerHTML = '';
  Object.entries(MOSQUE_CONFIG.sholatSchedule).forEach(([key, val]) => {
    const card = document.createElement('div');
    card.className = 'sholat-time-card';
    card.innerHTML = `
      <span class="sholat-name">${key}</span>
      <span class="sholat-hour">${val}</span>
    `;
    container.appendChild(card);
  });
}

function renderActivities() {
  const container = document.getElementById('activities-list');
  if (!container) return;

  container.innerHTML = '';
  MOSQUE_CONFIG.activities.forEach(act => {
    const row = document.createElement('div');
    row.className = 'activity-row';
    row.innerHTML = `
      <div class="act-details">
        <h4>${act.title}</h4>
        <span class="act-speaker">Oleh: ${act.speaker}</span>
      </div>
      <div class="act-time">
        <span>📅 ${act.day}</span>
        <span>🕒 ${act.hour}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

function renderTakmir() {
  const container = document.getElementById('takmir-grid');
  if (!container) return;

  container.innerHTML = '';
  MOSQUE_CONFIG.takmir.forEach(staff => {
    const card = document.createElement('div');
    card.className = 'takmir-card text-center';
    card.innerHTML = `
      <div class="takmir-img-wrapper">
        <img src="${staff.image}" alt="${staff.name}" loading="lazy">
      </div>
      <div class="takmir-info">
        <h4>${staff.name}</h4>
        <span class="takmir-role">${staff.role}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function calculateAndRenderCash() {
  const tbody = document.getElementById('cash-tbody');
  const totalIn = document.getElementById('total-in');
  const totalOut = document.getElementById('total-out');
  const netBalance = document.getElementById('net-balance');

  if (!tbody || !totalIn || !totalOut || !netBalance) return;

  tbody.innerHTML = '';
  let sumIn = 0;
  let sumOut = 0;

  MOSQUE_CONFIG.cashFlow.forEach(item => {
    const isPemasukan = item.amount > 0;
    if (isPemasukan) {
      sumIn += item.amount;
    } else {
      sumOut += Math.abs(item.amount);
    }

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.desc}</td>
      <td class="text-right text-success">${isPemasukan ? 'Rp ' + item.amount.toLocaleString('id-ID') : '-'}</td>
      <td class="text-right text-danger">${!isPemasukan ? 'Rp ' + Math.abs(item.amount).toLocaleString('id-ID') : '-'}</td>
    `;
    tbody.appendChild(row);
  });

  const balance = sumIn - sumOut;

  totalIn.textContent = `Rp ${sumIn.toLocaleString('id-ID')}`;
  totalOut.textContent = `Rp ${sumOut.toLocaleString('id-ID')}`;
  netBalance.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
}

function setupDonationForm() {
  const form = document.getElementById('donation-form');
  if (!form) return;

  // Insert Bank info dynamically
  const bankInfo = document.getElementById('bank-info-container');
  if (bankInfo) {
    bankInfo.innerHTML = `
      <div class="bank-card">
        <strong>${MOSQUE_CONFIG.bankAccount.name}</strong>
        <p class="bank-num" id="bank-number-text">${MOSQUE_CONFIG.bankAccount.number}</p>
        <small>A.N. ${MOSQUE_CONFIG.bankAccount.holder}</small>
        <button type="button" class="btn-copy" onclick="copyBankAccount()">Salin Rekening</button>
      </div>
    `;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('donator-name');
    const amount = document.getElementById('donation-amount');
    const category = document.getElementById('donation-type');
    const phone = document.getElementById('donator-phone');

    // Reset styles
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

    if (!name.value.trim()) showError(name, 'Nama donatur wajib diisi.');
    if (!amount.value || isNaN(amount.value) || parseInt(amount.value) < 1000) {
      showError(amount, 'Nominal donasi tidak valid (minimal Rp 1.000).');
    }
    if (!category.value) showError(category, 'Pilih kategori alokasi donasi.');
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');

    if (isValid) {
      const waMsg = `*KONFIRMASI DONASI/INFAQ - ${MOSQUE_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Pengurus DKM,\nSaya ingin melakukan konfirmasi donasi dengan data berikut:\n\n` +
        `👤 *Nama Donatur:* ${name.value.trim()}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n` +
        `📂 *Jenis Donasi:* ${category.options[category.selectedIndex].text}\n` +
        `💵 *Nominal:* Rp ${parseInt(amount.value).toLocaleString('id-ID')}\n` +
        `🏦 *Tujuan Bank:* ${MOSQUE_CONFIG.bankAccount.name}\n\n` +
        `_(Bukti resi transfer terlampir setelah pesan ini dikirim)_`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${MOSQUE_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Menyusun Pesan...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Data tersimpan! Anda akan diarahkan ke WhatsApp Admin untuk mengirim bukti transfer.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}

window.copyBankAccount = function() {
  const numberText = MOSQUE_CONFIG.bankAccount.number;
  navigator.clipboard.writeText(numberText).then(() => {
    alert('Nomor rekening berhasil disalin!');
  }).catch(() => {
    alert('Gagal menyalin otomatis, silakan salin manual: ' + numberText);
  });
};
