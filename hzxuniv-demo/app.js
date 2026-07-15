/**
 * HZX Univ - Rebrandable University / Higher Education Template
 * Powered by HZXPro Studio
 */

const UNIV_CONFIG = {
  name: 'Universitas HZX Cendekia',
  fullName: 'Universitas HZX Cendekia Indonesia',
  tagline: 'Membentuk Pemimpin Masa Depan Berkarakter Unggul & Berdaya Saing Global',
  whatsappAdmin: '6281234567890',
  email: 'pmb@hzxcendekia.ac.id',
  phone: '(022) 5555-8888',
  address: 'Kampus Pusat Ika HZX, Jl. Cendekia Raya No. 45, Dago, Bandung 40135',

  faculties: [
    { 
      id: 'ftik', 
      name: 'Fakultas Teknik & Ilmu Komputer', 
      departments: [
        { name: 'Teknik Informatika (S1)', accreditation: 'Unggul', ukt: 7500000 },
        { name: 'Sistem Informasi (S1)', accreditation: 'A', ukt: 6800000 },
        { name: 'Teknik Industri (S1)', accreditation: 'B', ukt: 6500000 }
      ]
    },
    { 
      id: 'feb', 
      name: 'Fakultas Ekonomi & Bisnis', 
      departments: [
        { name: 'Manajemen Bisnis (S1)', accreditation: 'Unggul', ukt: 6200000 },
        { name: 'Akuntansi Perpajakan (S1)', accreditation: 'A', ukt: 6000000 },
        { name: 'Ekonomi Pembangunan (S1)', accreditation: 'B', ukt: 5500000 }
      ]
    },
    { 
      id: 'fikom', 
      name: 'Fakultas Ilmu Komunikasi', 
      departments: [
        { name: 'Ilmu Komunikasi (S1)', accreditation: 'Unggul', ukt: 5800000 },
        { name: 'Hubungan Masyarakat (S1)', accreditation: 'A', ukt: 5500000 }
      ]
    }
  ],

  publications: [
    { title: 'Penerapan Deep Learning pada Prediksi Curah Hujan Wilayah Dago', author: 'Dr. Ahmad Fauzi (Fakultas Teknik)', journal: 'Jurnal Teknologi Komputer IEEE Indonesia - 2025' },
    { title: 'Analisis Dampak ESG Terhadap Kinerja Saham UMKM di Bandung', author: 'Prof. Rina Lestari (Fakultas Ekonomi)', journal: 'Asean Economic Review - 2024' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-univ]').forEach(el => {
    const key = el.getAttribute('data-univ');
    if (UNIV_CONFIG[key]) el.textContent = UNIV_CONFIG[key];
  });

  // Render Faculty Buttons & Initial Department List
  renderFaculties();
  renderDepartments('all');

  // Render Tuition Fee Table (UKT)
  renderUktTable();

  // Render Research Publications
  renderPublications();

  // Setup PMB Registration Form
  setupPmbForm();
});

function renderFaculties() {
  const container = document.getElementById('faculty-filters');
  if (!container) return;

  container.innerHTML = '<button class="btn-filter active" onclick="filterFaculty(\'all\', this)">Semua Fakultas</button>';
  UNIV_CONFIG.faculties.forEach(fac => {
    const btn = document.createElement('button');
    btn.className = 'btn-filter';
    btn.textContent = fac.name;
    btn.onclick = () => filterFaculty(fac.id, btn);
    container.appendChild(btn);
  });
}

window.filterFaculty = function(facId, btnElement) {
  // Toggle active class
  document.querySelectorAll('#faculty-filters .btn-filter').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  renderDepartments(facId);
};

function renderDepartments(facId) {
  const container = document.getElementById('prodi-grid');
  if (!container) return;

  container.innerHTML = '';

  let list = [];
  if (facId === 'all') {
    UNIV_CONFIG.faculties.forEach(fac => {
      fac.departments.forEach(dept => {
        list.push({ ...dept, facultyName: fac.name });
      });
    });
  } else {
    const faculty = UNIV_CONFIG.faculties.find(fac => fac.id === facId);
    if (faculty) {
      faculty.departments.forEach(dept => {
        list.push({ ...dept, facultyName: faculty.name });
      });
    }
  }

  list.forEach(dept => {
    const card = document.createElement('div');
    card.className = 'prodi-card scroll-reveal revealed';
    card.innerHTML = `
      <span class="prodi-fac">${dept.facultyName}</span>
      <h4>${dept.name}</h4>
      <div class="prodi-details">
        <span>Akreditasi: <strong>${dept.accreditation}</strong></span>
        <span>Uang Kuliah (UKT): <strong>Rp ${dept.ukt.toLocaleString('id-ID')} / Smt</strong></span>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderUktTable() {
  const tbody = document.getElementById('ukt-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  UNIV_CONFIG.faculties.forEach(fac => {
    fac.departments.forEach(dept => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${dept.name}</strong></td>
        <td>${fac.name}</td>
        <td><span class="badge badge-acred">${dept.accreditation}</span></td>
        <td>Rp ${dept.ukt.toLocaleString('id-ID')} / Semester</td>
      `;
      tbody.appendChild(row);
    });
  });
}

function renderPublications() {
  const container = document.getElementById('publications-list');
  if (!container) return;

  container.innerHTML = '';
  UNIV_CONFIG.publications.forEach(pub => {
    const div = document.createElement('div');
    div.className = 'publication-row';
    div.innerHTML = `
      <div class="pub-details">
        <h4>${pub.title}</h4>
        <span class="pub-author">Penulis: ${pub.author}</span>
        <p class="pub-journal">📖 ${pub.journal}</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function setupPmbForm() {
  const form = document.getElementById('pmb-form');
  const prodiSelect = document.getElementById('pmb-prodi');
  
  if (!form || !prodiSelect) return;

  // Render options for PMB Program Studi option
  prodiSelect.innerHTML = '<option value="" disabled selected>Pilih program studi tujuan...</option>';
  UNIV_CONFIG.faculties.forEach(fac => {
    const optGroup = document.createElement('optgroup');
    optGroup.label = fac.name;
    fac.departments.forEach(dept => {
      const opt = document.createElement('option');
      opt.value = dept.name;
      opt.textContent = dept.name;
      optGroup.appendChild(opt);
    });
    prodiSelect.appendChild(optGroup);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('pmb-name');
    const path = document.getElementById('pmb-path');
    const phone = document.getElementById('pmb-phone');

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

    if (!name.value.trim()) showError(name, 'Nama lengkap pendaftar wajib diisi.');
    if (!path.value) showError(path, 'Pilih jalur seleksi penerimaan.');
    if (!prodiSelect.value) showError(prodiSelect, 'Pilih program studi yang diminati.');
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');

    if (isValid) {
      const waMsg = `*PENDAFTARAN MAHASISWA BARU (PMB) - ${UNIV_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Panitia PMB Kampus,\nSaya ingin mengajukan registrasi pendaftaran mahasiswa baru:\n\n` +
        `👤 *Nama Lengkap:* ${name.value.trim()}\n` +
        `🎓 *Jalur Masuk:* ${path.options[path.selectedIndex].text}\n` +
        `📂 *Prodi Pilihan:* ${prodiSelect.value}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n\n` +
        `Mohon informasi lebih lanjut mengenai pengiriman berkas dan tes seleksi masuk online. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${UNIV_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Memproses Pendaftaran...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Pendaftaran PMB Berhasil! Silakan lengkapi berkas di WhatsApp Panitia Seleksi PMB.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}
