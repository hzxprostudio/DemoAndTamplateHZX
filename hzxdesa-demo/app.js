/**
 * HZX Desa - Rebrandable Village Website Template
 * Powered by HZXPro Studio
 */

const DESA_CONFIG = {
  name: 'Desa Makmur Jaya',
  subdistrict: 'Kecamatan Cisarua',
  district: 'Kabupaten Bogor',
  province: 'Jawa Barat',
  tagline: 'Mewujudkan Desa Mandiri, Sejahtera, Transparan, dan Berteknologi',
  kadesName: 'H. Mulyadi, S.H.',
  kadesWelcome: 'Selamat datang di portal pelayanan publik online Desa Makmur Jaya. Website ini hadir sebagai wujud transparansi anggaran, kemudahan akses informasi berita pembangunan, serta inovasi pelayanan administrasi surat menyurat online bagi seluruh warga desa. Bersama kita bangun desa yang unggul dan sejahtera.',
  whatsappAdmin: '6281234567890',
  email: 'info@desamakmurjaya.go.id',
  phone: '(0251) 8765-4321',
  address: 'Jl. Raya Puncak No. 123, Cisarua, Kabupaten Bogor, Jawa Barat 16750',

  about: {
    history: 'Desa Makmur Jaya didirikan pada tahun 1978 sebagai pemekaran wilayah pertanian yang subur di lereng bukit Cisarua. Seiring waktu, desa ini berkembang menjadi pusat agrowisata dan perkebunan organik dengan warga yang harmonis, toleran, dan pekerja keras.',
    vision: 'Mewujudkan Desa Makmur Jaya yang mandiri, berkeadilan sosial, unggul dalam tata kelola pemerintahan yang bersih dan transparan berbasis teknologi informasi.',
    missions: [
      'Meningkatkan mutu pelayanan publik kantor desa secara cepat, ramah, dan bebas pungli.',
      'Mengembangkan infrastruktur jalan desa dan sarana irigasi pertanian penunjang ekonomi.',
      'Mengoptimalkan pemberdayaan ekonomi warga melalui Badan Usaha Milik Desa (BUMDes).',
      'Meningkatkan transparansi anggaran keuangan desa yang akuntabel dan dapat diakses warga.'
    ]
  },

  budget: [
    { alokasi: 'Pembangunan Infrastruktur & Jalan', nominal: 450000000 },
    { alokasi: 'Pelayanan Kesehatan & Posyandu', nominal: 180000000 },
    { alokasi: 'Pemberdayaan Ekonomi & BUMDes', nominal: 150000000 },
    { alokasi: 'Pendidikan Anak Usia Dini (PAUD)', nominal: 120000000 },
    { alokasi: 'Penanggulangan Bencana & Darurat', nominal: 100000000 }
  ],

  statistics: {
    dusun: [
      { name: 'Dusun 1 (Mekar Sari)', kk: 250, jiwa: 1020 },
      { name: 'Dusun 2 (Suka Damai)', kk: 180, jiwa: 780 },
      { name: 'Dusun 3 (Tanjung Jaya)', kk: 220, jiwa: 950 },
      { name: 'Dusun 4 (Pasir Indah)', kk: 310, jiwa: 1280 }
    ],
    totalJiwa: 4030,
    totalKk: 960
  },

  announcements: [
    { title: 'Penyaluran BLT Dana Desa Tahap 3', date: '12 Juli 2026', desc: 'Diberitahukan kepada keluarga penerima manfaat, pembagian BLT akan dilaksanakan pada hari Jumat di Balai Desa.' },
    { title: 'Kerja Bakti Bersama Bersihkan Selokan', date: '08 Juli 2026', desc: 'Persiapan musim penghujan, seluruh warga RW 01 - RW 04 diimbau ikut kerja bakti serentak mulai pukul 07:00 WIB.' },
    { title: 'Vaksinasi PIN Polio Gratis Posyandu', date: '05 Juli 2026', desc: 'Daftarkan balita usia 0-7 tahun untuk mendapatkan tetes polio imunisasi di Posyandu Melati terdekat.' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config
  document.querySelectorAll('[data-desa]').forEach(el => {
    const key = el.getAttribute('data-desa');
    if (key.includes('.')) {
      const parts = key.split('.');
      if (DESA_CONFIG[parts[0]] && DESA_CONFIG[parts[0]][parts[1]]) {
        el.textContent = DESA_CONFIG[parts[0]][parts[1]];
      }
    } else if (DESA_CONFIG[key]) {
      el.textContent = DESA_CONFIG[key];
    }
  });

  // Render Misi
  const missionList = document.getElementById('mission-list');
  if (missionList) {
    missionList.innerHTML = '';
    DESA_CONFIG.about.missions.forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      missionList.appendChild(li);
    });
  }

  // Render Transparansi Anggaran Table & Total
  renderBudgetTable();

  // Render Statistik SVG Chart
  renderStatsChart();

  // Render Berita
  renderAnnouncements();

  // Form Letter Submit Validation
  setupLetterForm();
});

function renderBudgetTable() {
  const tbody = document.getElementById('budget-tbody');
  const totalEl = document.getElementById('budget-total');
  if (!tbody || !totalEl) return;

  tbody.innerHTML = '';
  let total = 0;

  DESA_CONFIG.budget.forEach(item => {
    total += item.nominal;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.alokasi}</td>
      <td class="text-right">Rp ${item.nominal.toLocaleString('id-ID')}</td>
    `;
    tbody.appendChild(row);
  });

  totalEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function renderStatsChart() {
  const container = document.getElementById('stats-chart-container');
  if (!container) return;

  // Let's build a clean custom SVG Bar Chart
  const data = DESA_CONFIG.statistics.dusun;
  const maxJiwa = Math.max(...data.map(d => d.jiwa));
  
  let barsHtml = '';
  data.forEach((d, idx) => {
    const barWidthPercent = (d.jiwa / maxJiwa) * 80; // Scale bars to 80% max width
    barsHtml += `
      <div class="stats-bar-row">
        <span class="stats-label">${d.name}</span>
        <div class="stats-bar-track">
          <div class="stats-bar-fill" style="width: ${barWidthPercent}%;"></div>
        </div>
        <span class="stats-value">${d.jiwa} Jiwa</span>
      </div>
    `;
  });

  container.innerHTML = barsHtml;
}

function renderAnnouncements() {
  const container = document.getElementById('news-grid');
  if (!container) return;

  container.innerHTML = '';
  DESA_CONFIG.announcements.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card scroll-reveal';
    card.innerHTML = `
      <div class="news-content">
        <span class="news-date">${item.date}</span>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupLetterForm() {
  const form = document.getElementById('letter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous invalid markings
    document.querySelectorAll('.form-control').forEach(input => {
      input.classList.remove('is-invalid');
    });
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());

    const nameInput = document.getElementById('letter-name');
    const nikInput = document.getElementById('letter-nik');
    const phoneInput = document.getElementById('letter-phone');
    const letterType = document.getElementById('letter-type');
    const noteInput = document.getElementById('letter-notes');

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

    if (!nameInput.value.trim()) {
      showError(nameInput, 'Nama lengkap wajib diisi.');
    }
    if (nikInput.value.trim().length !== 16 || isNaN(nikInput.value.trim())) {
      showError(nikInput, 'NIK harus berjumlah 16 digit angka.');
    }
    if (!phoneInput.value.trim()) {
      showError(phoneInput, 'Nomor Handphone wajib diisi.');
    }
    if (!letterType.value) {
      showError(letterType, 'Pilih jenis surat pengajuan.');
    }

    if (isValid) {
      const waMessage = `*PENGAJUAN SURAT ONLINE - ${DESA_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Admin Desa,\nSaya warga Desa ${DESA_CONFIG.name} ingin mengajukan layanan surat berikut:\n\n` +
        `👤 *Nama Lengkap:* ${nameInput.value.trim()}\n` +
        `🪪 *NIK:* ${nikInput.value.trim()}\n` +
        `📞 *No. Handphone:* ${phoneInput.value.trim()}\n` +
        `📄 *Jenis Surat:* ${letterType.options[letterType.selectedIndex].text}\n` +
        `📝 *Keterangan Tambahan:* ${noteInput.value.trim() || '-'}\n\n` +
        `Mohon instruksi verifikasi berkas selanjutnya di kantor desa. Terima kasih!`;

      const encodedMessage = encodeURIComponent(waMessage);
      const url = `https://wa.me/${DESA_CONFIG.whatsappAdmin}?text=${encodedMessage}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Memproses Pengajuan...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Pengisian form berhasil! Anda akan diarahkan ke WhatsApp Admin Desa.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}
