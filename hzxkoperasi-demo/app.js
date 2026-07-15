/**
 * HZX Koperasi - Rebrandable Cooperative Savings & Loans Template
 * Powered by HZXPro Studio
 */

const KOPERASI_CONFIG = {
  name: 'KSP HZX Sejahtera',
  fullName: 'Koperasi Simpan Pinjam HZX Sejahtera',
  tagline: 'Membangun Ekonomi Bersama Berazaskan Kekeluargaan & Gotong Royong',
  whatsappAdmin: '6281234567890',
  email: 'info@ksphzxsejahtera.co.id',
  phone: '(021) 8888-7777',
  address: 'Jl. Kemakmuran No. 12, Kelapa Gading, Jakarta Utara 14240',

  products: [
    { title: 'Simpanan Pokok', rate: 'Sekali bayar saat daftar', detail: 'Rp 100.000 (dapat ditarik kembali saat keluar dari keanggotaan).' },
    { title: 'Simpanan Wajib', rate: 'Rp 50.000 / Bulan', detail: 'Iuran wajib bulanan sebagai bukti keaktifan keanggotaan koperasi.' },
    { title: 'Simpanan Sukarela', rate: 'Bunga 4% / Tahun', detail: 'Tabungan bebas setoran dan penarikan untuk tabungan masa depan.' },
    { title: 'Pinjaman Sejahtera', rate: 'Bunga Flat 1.2% / Bulan', detail: 'Pinjaman modal usaha cepat dengan tenor fleksibel hingga 36 bulan.' }
  ],

  shuReport: [
    { year: '2023', totalShu: 350000000, allocatedMember: 140000000, desc: 'Peningkatan SHU didorong oleh tingginya partisipasi unit simpan pinjam.' },
    { year: '2024', totalShu: 410000000, allocatedMember: 164000000, desc: 'Pembagian SHU dialokasikan sebesar 40% langsung ke rekening simpanan anggota.' },
    { year: '2025', totalShu: 480000000, allocatedMember: 192000000, desc: 'SHU tahun buku 2025 meningkat 17% seiring peluncuran program BUMDes terintegrasi.' }
  ],

  requirements: [
    'Warga Negara Indonesia (WNI) berusia minimal 17 tahun.',
    'Fotokopi KTP dan Kartu Keluarga yang berlaku.',
    'Mengisi formulir pendaftaran anggota resmi.',
    'Membayar Simpanan Pokok dan Simpanan Wajib awal.'
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-koperasi]').forEach(el => {
    const key = el.getAttribute('data-koperasi');
    if (KOPERASI_CONFIG[key]) el.textContent = KOPERASI_CONFIG[key];
  });

  // Render Products
  renderProducts();

  // Render Requirements
  renderRequirements();

  // Render SHU Report
  renderShuReport();

  // Setup Loan Simulator
  setupLoanSimulator();

  // Setup Request Form
  setupRequestForm();
});

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = '';
  KOPERASI_CONFIG.products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="prod-header">
        <h4>${prod.title}</h4>
        <span class="prod-rate">${prod.rate}</span>
      </div>
      <p class="prod-desc">${prod.detail}</p>
    `;
    container.appendChild(card);
  });
}

function renderRequirements() {
  const container = document.getElementById('req-list');
  if (!container) return;

  container.innerHTML = '';
  KOPERASI_CONFIG.requirements.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req;
    container.appendChild(li);
  });
}

function renderShuReport() {
  const tbody = document.getElementById('shu-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  KOPERASI_CONFIG.shuReport.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>Tahun Buku ${row.year}</strong></td>
      <td>Rp ${row.totalShu.toLocaleString('id-ID')}</td>
      <td>Rp ${row.allocatedMember.toLocaleString('id-ID')}</td>
      <td><span class="shu-desc">${row.desc}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function setupLoanSimulator() {
  const inputAmount = document.getElementById('sim-amount');
  const inputTenor = document.getElementById('sim-tenor');
  
  const resultPokok = document.getElementById('sim-result-pokok');
  const resultBunga = document.getElementById('sim-result-bunga');
  const resultTotal = document.getElementById('sim-result-total');

  if (!inputAmount || !inputTenor || !resultPokok || !resultBunga || !resultTotal) return;

  const calculate = () => {
    const amount = parseFloat(inputAmount.value) || 0;
    const tenor = parseInt(inputTenor.value) || 1;

    // Bunga flat 1.2% per bulan dari total pinjaman
    const bungaBulan = amount * 0.012;
    const pokokBulan = amount / tenor;
    const totalBulan = pokokBulan + bungaBulan;

    resultPokok.textContent = `Rp ${Math.round(pokokBulan).toLocaleString('id-ID')}`;
    resultBunga.textContent = `Rp ${Math.round(bungaBulan).toLocaleString('id-ID')}`;
    resultTotal.textContent = `Rp ${Math.round(totalBulan).toLocaleString('id-ID')}`;
  };

  inputAmount.addEventListener('input', calculate);
  inputTenor.addEventListener('input', calculate);

  // Initial calculation
  calculate();
}

function setupRequestForm() {
  const form = document.getElementById('request-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('req-name');
    const type = document.getElementById('req-type');
    const amount = document.getElementById('req-amount');
    const job = document.getElementById('req-job');
    const phone = document.getElementById('req-phone');

    // Reset validations
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

    if (!name.value.trim()) showError(name, 'Nama lengkap wajib diisi.');
    if (!type.value) showError(type, 'Pilih jenis pengajuan permohonan.');
    
    // Amount is only required if type is Loan
    const amountVal = parseFloat(amount.value) || 0;
    if (type.value === 'pinjaman' && (amountVal < 1000000 || isNaN(amountVal))) {
      showError(amount, 'Untuk pinjaman modal, nominal minimal Rp 1.000.000.');
    }

    if (!job.value.trim()) showError(job, 'Pekerjaan saat ini wajib diisi.');
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');

    if (isValid) {
      let reqDetails = `📂 *Jenis Pengajuan:* ${type.options[type.selectedIndex].text}\n`;
      if (type.value === 'pinjaman') {
        reqDetails += `💵 *Nominal Pengajuan:* Rp ${amountVal.toLocaleString('id-ID')}\n`;
      }

      const waMsg = `*PENGAJUAN KOPERASI ONLINE - ${KOPERASI_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Admin Koperasi,\nSaya ingin mengajukan permohonan keanggotaan/pinjaman modal:\n\n` +
        `👤 *Nama Lengkap:* ${name.value.trim()}\n` +
        `💼 *Pekerjaan:* ${job.value.trim()}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n` +
        reqDetails + 
        `\nMohon petunjuk pengisian formulir fisik di kantor Koperasi. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${KOPERASI_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Memproses Pengajuan...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Pengajuan terkirim! Anda akan diarahkan ke WhatsApp Admin Koperasi.');
        window.open(url, '_blank');
      }, 1000);
    }
  });

  // Enable/disable amount field based on type selected
  const typeSelect = document.getElementById('req-type');
  const amountField = document.getElementById('req-amount');
  
  typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'pinjaman') {
      amountField.disabled = false;
      amountField.style.opacity = '1';
      amountField.placeholder = 'Contoh: 5000000 (Min. Rp 1jt)';
    } else {
      amountField.disabled = true;
      amountField.style.opacity = '0.4';
      amountField.value = '';
      amountField.placeholder = 'Hanya untuk pengajuan pinjaman';
    }
  });
}
