/**
 * HZX Arsip - Rebrandable Library & Museum Template
 * Powered by HZXPro Studio
 */

const ARSIP_CONFIG = {
  name: 'HZX Arsip & Museum',
  fullName: 'Perpustakaan & Museum HZX Arsip Nasional',
  tagline: 'Melestarikan Sejarah, Membuka Jendela Ilmu Pengetahuan Dunia',
  whatsappAdmin: '6281234567890',
  email: 'info@hzxarsip.org',
  phone: '(022) 2000-8888',
  address: 'Jl. Merdeka No. 100, Sumur Bandung, Kota Bandung, Jawa Barat 40111',
  
  openHours: {
    weekday: 'Selasa - Jumat: 08:30 - 16:00 WIB',
    weekend: 'Sabtu - Minggu: 09:00 - 15:00 WIB',
    closed: 'Senin & Hari Libur Nasional: Tutup'
  },

  events: [
    { title: 'Pameran Manuskrip Kuno Nusantara', date: '10 - 20 Juli 2026', time: '10:00 - 15:00 WIB', location: 'Ruang Aula Utama' },
    { title: 'Bedah Buku Sejarah Kolonialisme', date: '25 Juli 2026', time: '09:30 - 12:00 WIB', location: 'Auditorium Literasi' },
    { title: 'Tur Sejarah Malam Hari (Night at Museum)', date: '01 Agustus 2026', time: '19:00 - 21:30 WIB', location: 'Area Galeri Fosil' }
  ],

  // Katalog Koleksi (Buku & Artefak)
  collections: [
    { id: 1, title: 'Manuskrip Babad Tanah Jawi', category: 'artefak', author: 'Kerajaan Mataram', year: 'Abad ke-17', desc: 'Buku manuskrip kuno asli berisi silsilah raja-raja Jawa dan babad sejarah tanah Jawa.', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300' },
    { id: 2, title: 'Fosil Gading Gajah Purba', category: 'artefak', author: 'Situs Sangiran', year: 'Pleistosen', desc: 'Fosil gading gajah purba jenis Elephas namadicus asli yang ditemukan di daerah Sangiran.', image: 'https://images.unsplash.com/photo-1516534775068-ba3e84589d90?q=80&w=300' },
    { id: 3, title: 'Sejarah Perang Asia Pasifik', category: 'buku', author: 'Prof. Dr. Irwan S.', year: '2019', desc: 'Analisis mendalam mengenai taktik militer dan dampak sosial Perang Dunia II di kawasan Asia Tenggara.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=300' },
    { id: 4, title: 'Kitab Kuno Negarakertagama', category: 'artefak', author: 'Empu Prapanca', year: '1365 M', desc: 'Replika serat Negarakertagama yang menceritakan masa keemasan kemaharajaan Majapahit.', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300' },
    { id: 5, title: 'Ensiklopedia Flora Jawa Barat', category: 'buku', author: 'Dr. Ahmad Hidayat', year: '2021', desc: 'Buku referensi lengkap mengenai jenis tumbuhan edelweis dan tanaman endemik pegunungan Priangan.', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300' },
    { id: 6, title: 'Keris Pusaka Luk 11 Singo Barong', category: 'artefak', author: 'Empu Supo', year: 'Abad ke-15', desc: 'Keris warisan era Majapahit dengan pamor ngulit semangka melambangkan perlindungan.', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=300' }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  // Apply Config texts
  document.querySelectorAll('[data-arsip]').forEach(el => {
    const key = el.getAttribute('data-arsip');
    if (ARSIP_CONFIG[key]) el.textContent = ARSIP_CONFIG[key];
  });

  // Render open hours
  const hoursList = document.getElementById('hours-list');
  if (hoursList) {
    hoursList.innerHTML = `
      <li><span>📅 ${ARSIP_CONFIG.openHours.weekday}</span></li>
      <li><span>📅 ${ARSIP_CONFIG.openHours.weekend}</span></li>
      <li><span style="color:#ef4444; font-weight:600;">🔒 ${ARSIP_CONFIG.openHours.closed}</span></li>
    `;
  }

  // Render Events
  renderEvents();

  // Render Collections Catalog (Initial)
  renderCatalog(ARSIP_CONFIG.collections);

  // Setup Search & Filter
  setupCatalogFilter();

  // Setup Booking Form
  setupBookingForm();
});

function renderEvents() {
  const container = document.getElementById('events-grid');
  if (!container) return;

  container.innerHTML = '';
  ARSIP_CONFIG.events.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card';
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

function renderCatalog(items) {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  grid.innerHTML = '';
  
  if (items.length === 0) {
    grid.innerHTML = '<div class="no-results text-center" style="grid-column: span 3; padding: 40px; color: var(--color-muted);">Koleksi tidak ditemukan. Cobalah kata kunci lain.</div>';
    return;
  }

  items.forEach(col => {
    const card = document.createElement('div');
    card.className = 'catalog-card scroll-reveal revealed';
    card.innerHTML = `
      <div class="catalog-img">
        <img src="${col.image}" alt="${col.title}" loading="lazy">
        <span class="catalog-badge badge-${col.category}">${col.category.toUpperCase()}</span>
      </div>
      <div class="catalog-info">
        <h4>${col.title}</h4>
        <span class="catalog-author">${col.author} (${col.year})</span>
        <p>${col.desc}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupCatalogFilter() {
  const searchInput = document.getElementById('catalog-search');
  const filterBtns = document.querySelectorAll('.btn-filter');

  if (!searchInput) return;

  let activeCategory = 'semua';
  let searchQuery = '';

  const filterAndRender = () => {
    const filtered = ARSIP_CONFIG.collections.filter(col => {
      const matchCategory = activeCategory === 'semua' || col.category === activeCategory;
      const matchSearch = col.title.toLowerCase().includes(searchQuery) || 
                          col.desc.toLowerCase().includes(searchQuery) ||
                          col.author.toLowerCase().includes(searchQuery);
      return matchCategory && matchSearch;
    });
    renderCatalog(filtered);
  };

  // Search input event
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterAndRender();
  });

  // Filter buttons events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterAndRender();
    });
  });
}

function setupBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('book-name');
    const visitors = document.getElementById('book-visitors');
    const date = document.getElementById('book-date');
    const time = document.getElementById('book-time');
    const phone = document.getElementById('book-phone');

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

    if (!name.value.trim()) showError(name, 'Nama pemesan wajib diisi.');
    if (!visitors.value || isNaN(visitors.value) || parseInt(visitors.value) < 1) {
      showError(visitors, 'Jumlah pengunjung minimal 1 orang.');
    }
    if (!date.value) showError(date, 'Pilih tanggal kunjungan.');
    if (!time.value) showError(time, 'Pilih jam tur kunjungan.');
    if (!phone.value.trim()) showError(phone, 'Nomor Handphone wajib diisi.');

    if (isValid) {
      const waMsg = `*BOOKING KUNJUNGAN/TUR - ${ARSIP_CONFIG.name.toUpperCase()}*\n` +
        `===================================\n\n` +
        `Halo Admin Museum,\nSaya ingin melakukan booking tur/kunjungan museum kelompok/pribadi:\n\n` +
        `👤 *Nama Pemesan:* ${name.value.trim()}\n` +
        `👥 *Jumlah Pengunjung:* ${visitors.value.trim()} Orang\n` +
        `📅 *Tanggal Kunjungan:* ${date.value.trim()}\n` +
        `🕒 *Jam Tur Kunjungan:* ${time.value.trim()}\n` +
        `📞 *No. Handphone:* ${phone.value.trim()}\n\n` +
        `Mohon info persetujuan dan e-tiket kunjungan dikirimkan ke nomor ini. Terima kasih!`;

      const encoded = encodeURIComponent(waMsg);
      const url = `https://wa.me/${ARSIP_CONFIG.whatsappAdmin}?text=${encoded}`;

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Membuat Reservasi...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert('Booking Berhasil Diajukan! Anda akan diarahkan ke WhatsApp Admin Museum.');
        window.open(url, '_blank');
      }, 1000);
    }
  });
}
