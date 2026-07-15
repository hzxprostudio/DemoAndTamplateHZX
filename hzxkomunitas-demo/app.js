/**
 * HZX Komunitas - Rebrandable Youth Group / Community Organization Template
 * Powered by HZXPro Studio
 */

const KOMUNITAS_CONFIG = {
  name: 'Karang Taruna Tunas Bangsa',
  scope: 'Unit RW 05 Dago, Kota Bandung',
  tagline: 'Kreatif, Aktif, Solid, dan Berbakti demi Kemajuan Lingkungan Kita',
  whatsappAdmin: '6281234567890',
  email: 'tunasbangsa@dago05.org',
  phone: '0812-3456-7890',

  about: {
    vision: 'Mewujudkan kepemudaan RW 05 Dago yang kompak, kreatif, memiliki kepedulian sosial yang tinggi, serta mandiri secara ekonomi.',
    missions: [
      'Menyelenggarakan kegiatan olahraga, seni, dan keagamaan bagi generasi muda.',
      'Mengaktifkan unit usaha kreatif kepemudaan melalui koperasi karang taruna.',
      'Melaksanakan aksi tanggap sosial dan kepedulian bagi warga dhuafa & lansia.'
    ]
  },

  committee: [
    { name: 'Aditya Pratama', role: 'Ketua Karang Taruna', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300' },
    { name: 'Siti Rahmawati', role: 'Sekretaris Umum', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300' },
    { name: 'Fajar Nugraha', role: 'Bendahara Umum', image: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=300' }
  ],

  activities: [
    { title: 'Turnamen Futsal Pemuda Cup 2026', schedule: 'Mulai 10 Agustus 2026', desc: 'Kompetisi persahabatan antar RT sewilayah RW 05 untuk meningkatkan kebersamaan.' },
    { title: 'Aksi Bersih Lingkungan & Fogging Mandiri', schedule: 'Minggu Ke-2 Setiap Bulan', desc: 'Gerakan gotong royong membersihkan selokan dan fogging jentik nyamuk DBD.' },
    { title: 'Kelas Desain Grafis & Digital Marketing Gratis', schedule: 'Setiap Hari Sabtu Sore', desc: 'Pelatihan skill digital bagi pemuda RW 05 guna bekal mencari kerja atau berbisnis.' }
  ],

  announcements: [
    { title: 'Penerimaan Pendaftaran Panitia HUT RI ke-81', date: '14 Juli 2026', desc: 'Bagi rekan-rekan pemuda RW 05 yang ingin bergabung menjadi panitia 17-an silakan hubungi sekretariat.' },
    { title: 'Bantuan Sosial Paket Sembako Warga Lansia', date: '10 Juli 2026', desc: 'Penyaluran donasi sembako kepada 25 kepala keluarga lansia di wilayah RW 05 telah selesai dilaksanakan.' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-komunitas]').forEach(el => {
    const key = el.getAttribute('data-komunitas');
    if (KOMUNITAS_CONFIG[key]) el.textContent = KOMUNITAS_CONFIG[key];
  });

  // Render Committee
  renderCommittee();

  // Render Activities
  renderActivities();

  // Render Announcements
  renderAnnouncements();

  // Setup Complaint Form
  setupComplaintForm();
});

function renderCommittee() {
  const container = document.getElementById('committee-grid');
  if (!container) return;

  container.innerHTML = '';
  KOMUNITAS_CONFIG.committee.forEach(staff => {
    const card = document.createElement('div');
    card.className = 'committee-card text-center';
    card.innerHTML = `
      <div class="com-img-wrapper">
        <img src="${staff.image}" alt="${staff.name}" loading="lazy">
      </div>
      <div class="com-info">
        <h4>${staff.name}</h4>
        <span class="com-role">${staff.role}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderActivities() {
  const container = document.getElementById('activities-grid');
  if (!container) return;

  container.innerHTML = '';
  KOMUNITAS_CONFIG.activities.forEach(act => {
    const card = document.createElement('div');
    card.className = 'activity-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="act-header">
        <h4>${act.title}</h4>
        <span class="act-schedule">📅 ${act.schedule}</span>
      </div>
      <p class="act-desc">${act.desc}</p>
    `;
    container.appendChild(card);
  });
}

function renderAnnouncements() {
  const container = document.getElementById('announcements-list');
  if (!container) return;

  container.innerHTML = '';
  KOMUNITAS_CONFIG.announcements.forEach(ann => {
    const row = document.createElement('div');
    row.className = 'announcement-row';
    row.innerHTML = `
      <div class="ann-details">
        <span class="ann-date">📅 ${ann.date}</span>
        <h4>${ann.title}</h4>
        <p>${ann.desc}</p>
      </div>
    `;
    container.appendChild(row);
  });
}

function setupComplaintForm() {
  const form = document.getElementById('complaint-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('comp-name');
    const rtrw = document.getElementById('comp-rtrw');
    const type = document.getElementById('comp-type');
    const detail = document.getElementById('comp-detail');
    const phone = document.getElementById('comp-phone');

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

    if (!name.value.trim()) showError(name, 'Nama warga wajib diisi.');
    if (!rtrw.value.trim()) showError(rtrw, 'Nomor RT/RW tinggal wajib diisi.');
    if (!type.value) showError(type, 'Pilih kategori aduan/laporan.');
    if (!detail.value.trim()) showError(detail, 'Tuliskan detail laporan secara rinci.');
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');

    if (isValid) {
      const waMsg = `*PENGADUAN & ASPIRASI WARGA - RW 05 DAGO*\n` +
        `===================================\n\n` +
        `Halo Pengurus Karang Taruna / RT-RW,\nSaya warga ingin menyampaikan aspirasi/pengaduan berikut:\n\n` +
        `👤 *Nama Warga:* ${name.value.trim()}\n` +
        `📍 *Alamat RT/RW:* ${rtrw.value.trim()}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n` +
        `📂 *Kategori:* ${type.options[type.selectedIndex].text}\n` +
        `📝 *Detail Laporan:* ${detail.value.trim()}\n\n` +
        `Mohon ditindaklanjuti untuk kenyamanan warga bersama. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${KOMUNITAS_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Mengirim Laporan...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Laporan Warga Diterima! Pengaduan akan diteruskan ke WhatsApp Pengurus.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}
