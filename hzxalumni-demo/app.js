/**
 * HZX Alumni - Rebrandable Alumni Association Template
 * Powered by HZXPro Studio
 */

const ALUMNI_CONFIG = {
  name: 'IKA HZX Dago',
  fullName: 'Ikatan Keluarga Alumni HZX Dago Bandung',
  tagline: 'Menjalin Silaturahmi, Membangun Sinergi, dan Berkontribusi untuk Almamater',
  whatsappAdmin: '6281234567890',
  email: 'alumni@hzxdago.org',
  phone: '(022) 7777-6666',
  address: 'Sekretariat IKA HZX, Jl. Ir. H. Juanda No. 90, Dago, Bandung 40132',

  events: [
    { title: 'Reuni Akbar & Nostalgia Kampus 2026', date: '20 September 2026', time: '09:00 - 16:00 WIB', location: 'Gedung Serbaguna HZX' },
    { title: 'Baksos & Donor Darah Alumni Peduli', date: '08 Agustus 2026', time: '08:00 - 12:00 WIB', location: 'Halaman Sekretariat DKM' }
  ],

  // Direktori Alumni
  directory: [
    { name: 'Rian Anggara', classYear: '2016', profession: 'Software Engineer di GoTo', city: 'Jakarta', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150' },
    { name: 'Dr. Anita Lestari', classYear: '2015', profession: 'Dokter Spesialis Anak', city: 'Bandung', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150' },
    { name: 'Budi Rahardjo, M.B.A.', classYear: '2018', profession: 'Owner Coffee Shop & Eksportir', city: 'Surabaya', image: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?q=80&w=150' },
    { name: 'Siti Sarah', classYear: '2017', profession: 'UI/UX Designer Freelance', city: 'Yogyakarta', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150' },
    { name: 'Faisal Yusuf', classYear: '2016', profession: 'Civil Servant (PNS) Pemprov', city: 'Bandung', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150' }
  ],

  testimonials: [
    { quote: 'Bangga menjadi bagian dari IKA HZX. Melalui wadah ini saya mendapatkan relasi kerja yang luar biasa dan bisa berbagi pengalaman karir.', author: 'Rian Anggara, Angkatan 2016' },
    { quote: 'Silaturahmi tetap terjaga erat meskipun sudah bertahun-tahun lulus. Program beasiswa alumni sangat membantu adik-adik kelas.', author: 'Dr. Anita Lestari, Angkatan 2015' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-alumni]').forEach(el => {
    const key = el.getAttribute('data-alumni');
    if (ALUMNI_CONFIG[key]) el.textContent = ALUMNI_CONFIG[key];
  });

  // Render Events
  renderEvents();

  // Render Testimonials
  renderTestimonials();

  // Render Directory List (Initial)
  renderDirectory(ALUMNI_CONFIG.directory);

  // Setup Directory Filters
  setupDirectoryFilter();

  // Setup Registration Form
  setupRegistrationForm();
});

function renderEvents() {
  const container = document.getElementById('events-grid');
  if (!container) return;

  container.innerHTML = '';
  ALUMNI_CONFIG.events.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="event-info">
        <span class="event-date">📅 ${evt.date}</span>
        <h4>${evt.title}</h4>
        <p>🕒 ${evt.time} • 📍 ${evt.location}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-list');
  if (!container) return;

  container.innerHTML = '';
  ALUMNI_CONFIG.testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testi-card';
    card.innerHTML = `
      <p class="testi-quote">"${t.quote}"</p>
      <span class="testi-author">— ${t.author}</span>
    `;
    container.appendChild(card);
  });
}

function renderDirectory(list) {
  const grid = document.getElementById('directory-grid');
  if (!grid) return;

  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = '<div class="no-results text-center" style="grid-column: span 3; padding: 40px; color: var(--color-muted);">Alumni tidak ditemukan. Cobalah pencarian lain.</div>';
    return;
  }

  list.forEach(al => {
    const card = document.createElement('div');
    card.className = 'directory-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="dir-img">
        <img src="${al.image}" alt="${al.name}" loading="lazy">
      </div>
      <div class="dir-info">
        <h4>${al.name}</h4>
        <span class="dir-class">Angkatan ${al.classYear}</span>
        <p class="dir-job">💼 ${al.profession}</p>
        <p class="dir-city">📍 Domisili: ${al.city}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupDirectoryFilter() {
  const searchInput = document.getElementById('dir-search');
  const classSelect = document.getElementById('dir-filter-class');

  if (!searchInput || !classSelect) return;

  // Render angkatan options dynamically
  const classes = [...new Set(ALUMNI_CONFIG.directory.map(al => al.classYear))].sort();
  classSelect.innerHTML = '<option value="semua">Semua Angkatan</option>';
  classes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = `Angkatan ${c}`;
    classSelect.appendChild(opt);
  });

  let searchQuery = '';
  let activeClass = 'semua';

  const filterAndRender = () => {
    const filtered = ALUMNI_CONFIG.directory.filter(al => {
      const matchClass = activeClass === 'semua' || al.classYear === activeClass;
      const matchSearch = al.name.toLowerCase().includes(searchQuery) ||
                          al.profession.toLowerCase().includes(searchQuery) ||
                          al.city.toLowerCase().includes(searchQuery);
      return matchClass && matchSearch;
    });
    renderDirectory(filtered);
  };

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterAndRender();
  });

  classSelect.addEventListener('change', () => {
    activeClass = classSelect.value;
    filterAndRender();
  });
}

function setupRegistrationForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name');
    const classYear = document.getElementById('reg-class');
    const phone = document.getElementById('reg-phone');
    const job = document.getElementById('reg-job');
    const city = document.getElementById('reg-city');

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
    if (!classYear.value.trim() || isNaN(classYear.value.trim()) || classYear.value.trim().length !== 4) {
      showError(classYear, 'Tahun kelulusan tidak valid (4 digit angka, contoh: 2018).');
    }
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');
    if (!job.value.trim()) showError(job, 'Profesi/Pekerjaan saat ini wajib diisi.');
    if (!city.value.trim()) showError(city, 'Kota domisili tinggal wajib diisi.');

    if (isValid) {
      const waMsg = `*PENDAFTARAN ANGGOTA ALUMNI - ${ALUMNI_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Pengurus IKA,\nSaya alumni ingin mendaftarkan diri masuk ke database alumni resmi:\n\n` +
        `👤 *Nama Lengkap:* ${name.value.trim()}\n` +
        `🎓 *Angkatan/Lulus:* ${classYear.value.trim()}\n` +
        `💼 *Profesi Saat Ini:* ${job.value.trim()}\n` +
        `📍 *Kota Domisili:* ${city.value.trim()}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n\n` +
        `Mohon diundang masuk ke grup WhatsApp angkatan. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${ALUMNI_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Memproses Pendaftaran...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Pendaftaran Berhasil! Profil Anda akan diverifikasi oleh Admin IKA.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}
