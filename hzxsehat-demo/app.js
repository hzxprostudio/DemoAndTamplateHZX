/**
 * HZX Sehat - Rebrandable Public Health Clinic Template
 * Powered by HZXPro Studio
 */

const PUSKESMAS_CONFIG = {
  name: 'Puskesmas Sehat Utama',
  fullName: 'Puskesmas Sehat Utama Bandung',
  tagline: 'Melayani dengan Kasih, Sigap, Profesional, dan Ramah Masyarakat',
  whatsappAdmin: '6281234567890',
  email: 'admin@puskesmassehatutama.go.id',
  phone: '(022) 5432-1098',
  emergencyPhone: '119 / (022) 5432-1111',
  address: 'Jl. Kesehatan Rakyat No. 88, Coblong, Kota Bandung, Jawa Barat 40132',
  
  services: [
    { title: 'Poli Umum', desc: 'Pemeriksaan kesehatan dasar, diagnosa awal penyakit, dan rujukan lanjut.', icon: 'pulse' },
    { title: 'Poli Gigi', desc: 'Pemeriksaan gigi, cabut gigi, tambal, pembersihan karang gigi.', icon: 'tooth' },
    { title: 'Poli KIA & KB', desc: 'Kesehatan Ibu dan Anak, imunisasi balita, program KB, kehamilan.', icon: 'mother' },
    { title: 'Laboratorium & Farmasi', desc: 'Tes darah dasar, urin, serta pengambilan resep obat BPJS/Umum.', icon: 'flask' }
  ],

  doctorsSchedule: [
    { day: 'Senin', poli: 'Poli Umum', doctor: 'dr. Hendra Wijaya', hours: '08:00 - 12:00 WIB' },
    { day: 'Senin', poli: 'Poli Gigi', doctor: 'drg. Fitriani Siregar', hours: '09:00 - 13:00 WIB' },
    { day: 'Selasa', poli: 'Poli KIA & KB', doctor: 'Bidan Neng Lilis, S.Keb.', hours: '08:00 - 12:00 WIB' },
    { day: 'Selasa', poli: 'Poli Umum', doctor: 'dr. Sarah Olivia', hours: '10:00 - 14:00 WIB' },
    { day: 'Rabu', poli: 'Poli Umum', doctor: 'dr. Hendra Wijaya', hours: '08:00 - 12:00 WIB' },
    { day: 'Rabu', poli: 'Poli Gigi', doctor: 'drg. Fitriani Siregar', hours: '09:00 - 13:00 WIB' },
    { day: 'Kamis', poli: 'Poli KIA & KB', doctor: 'Bidan Neng Lilis, S.Keb.', hours: '08:00 - 12:00 WIB' },
    { day: 'Kamis', poli: 'Poli Umum', doctor: 'dr. Sarah Olivia', hours: '10:00 - 14:00 WIB' },
    { day: 'Jumat', poli: 'Poli Umum', doctor: 'dr. Hendra Wijaya', hours: '08:00 - 11:30 WIB' }
  ],

  bpjsRequirements: [
    'Kartu BPJS Kesehatan asli / Mobile JKN yang aktif.',
    'KTP (Kartu Tanda Penduduk) asli atau Kartu Keluarga (KK).',
    'Buku KIA (Kesehatan Ibu & Anak) jika mendaftar ke Poli KIA.',
    'Rujukan FKTP jika rujukan eksternal (opsional).'
  ],

  programs: [
    { title: 'Posyandu Balita & Lansia Ceria', date: 'Setiap Rabu Minggu Pertama', desc: 'Pemeriksaan tumbuh kembang anak, penimbangan, pemberian makanan tambahan, dan cek tensi lansia gratis.' },
    { title: 'Vaksinasi PIN Polio & Imunisasi Dasar', date: 'Setiap Hari Jumat', desc: 'Pemberian imunisasi BCG, DPT, Polio, Campak bagi bayi di ruangan poli KIA.' },
    { title: 'Penyuluhan Gizi & Stunting Terpadu', date: 'Sabtu, 25 Juli 2026', desc: 'Workshop edukasi pencegahan stunting pada anak usia dini bagi ibu menyusui.' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-sehat]').forEach(el => {
    const key = el.getAttribute('data-sehat');
    if (PUSKESMAS_CONFIG[key]) el.textContent = PUSKESMAS_CONFIG[key];
  });

  // Render Services
  renderServices();

  // Render Doctors Schedule
  renderDoctorsSchedule();

  // Render BPJS Requirements
  renderBpjsRequirements();

  // Render Programs
  renderPrograms();

  // Form Registration Setup
  setupRegistrationForm();
});

function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.innerHTML = '';
  PUSKESMAS_CONFIG.services.forEach(srv => {
    let iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>'; // Pulse default

    const card = document.createElement('div');
    card.className = 'service-card text-center';
    card.innerHTML = `
      <div class="service-icon-badge">${iconSvg}</div>
      <h4>${srv.title}</h4>
      <p>${srv.desc}</p>
    `;
    container.appendChild(card);
  });
}

function renderDoctorsSchedule() {
  const tbody = document.getElementById('schedule-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  PUSKESMAS_CONFIG.doctorsSchedule.forEach(sch => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${sch.day}</strong></td>
      <td>${sch.poli}</td>
      <td>${sch.doctor}</td>
      <td><span class="badge badge-hours">${sch.hours}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function renderBpjsRequirements() {
  const container = document.getElementById('bpjs-list');
  if (!container) return;

  container.innerHTML = '';
  PUSKESMAS_CONFIG.bpjsRequirements.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req;
    container.appendChild(li);
  });
}

function renderPrograms() {
  const container = document.getElementById('programs-list-wrapper');
  if (!container) return;

  container.innerHTML = '';
  PUSKESMAS_CONFIG.programs.forEach(prog => {
    const row = document.createElement('div');
    row.className = 'program-row';
    row.innerHTML = `
      <div class="prog-details">
        <h4>${prog.title}</h4>
        <p>${prog.desc}</p>
      </div>
      <div class="prog-time">
        <span>📅 ${prog.date}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

function setupRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name');
    const nik = document.getElementById('reg-nik');
    const poli = document.getElementById('reg-poli');
    const type = document.getElementById('reg-type');
    const complaint = document.getElementById('reg-complaint');

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

    if (!name.value.trim()) showError(name, 'Nama pasien wajib diisi.');
    if (nik.value.trim().length !== 16 || isNaN(nik.value.trim())) {
      showError(nik, 'NIK harus 16 digit angka.');
    }
    if (!poli.value) showError(poli, 'Pilih poli tujuan berobat.');
    if (!type.value) showError(type, 'Pilih jenis pembiayaan.');

    if (isValid) {
      const waMsg = `*PENDAFTARAN PASIEN ONLINE - ${PUSKESMAS_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Admin Puskesmas,\nSaya ingin melakukan pendaftaran berobat rawat jalan online:\n\n` +
        `👤 *Nama Pasien:* ${name.value.trim()}\n` +
        `🪪 *NIK Pasien:* ${nik.value.trim()}\n` +
        `🏥 *Poli Tujuan:* ${poli.options[poli.selectedIndex].text}\n` +
        `💳 *Jenis Pembiayaan:* ${type.options[type.selectedIndex].text}\n` +
        `🩺 *Keluhan Singkat:* ${complaint.value.trim() || '-'}\n\n` +
        `Mohon info nomor antrean dan estimasi jam kedatangan. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${PUSKESMAS_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Memproses Tiket...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Pendaftaran Berhasil! Silakan konfirmasi berkas melalui WhatsApp Admin.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}
