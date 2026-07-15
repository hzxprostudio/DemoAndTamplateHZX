/**
 * Arsip & Perpustakaan HZX - Javascript Logic
 * Powered by HZXPro Studio
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavbar();
  setupScrollspy();
  setupCatalogFilter();
  setupBookingForm();
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

// 3. KATALOG SEARCH & FILTER (VANILLA JS)
function setupCatalogFilter() {
  const catalogGrid = document.getElementById('katalog-grid-el');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!catalogGrid) return;

  // Dummy catalog data
  const catalogItems = [
    { 
      id: 1, 
      title: 'Babad Tanah Sunda (Manuskrip Kuno)', 
      cat: 'Naskah Kuno', 
      desc: 'Salinan naskah kuno sejarah kerajaan Sunda Galuh abad ke-16 yang ditulis di atas daun lontar asli.', 
      img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300' 
    },
    { 
      id: 2, 
      title: 'Atlas Kartografi Nusantara (1724)', 
      cat: 'Buku Langka', 
      desc: 'Peta pelayaran kuno kepulauan Indonesia buatan VOC yang dicetak secara terbatas di Amsterdam.', 
      img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=300' 
    },
    { 
      id: 3, 
      title: 'Dokumen Perjanjian Linggarjati Asli', 
      cat: 'Dokumen Sejarah', 
      desc: 'Lembaran diplomatik otentik hasil perundingan kemerdekaan RI dan Belanda pada tahun 1946.', 
      img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=300' 
    },
    { 
      id: 4, 
      title: 'Serat Centhini Jilid 1-4 (Salinan Kuno)', 
      cat: 'Naskah Kuno', 
      desc: 'Kitab pengetahuan spiritual dan kebudayaan jawa kuno yang disalin oleh pujangga keraton Surakarta.', 
      img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300' 
    },
    { 
      id: 5, 
      title: 'Ensiklopedi Botani Priangan (1882)', 
      cat: 'Buku Langka', 
      desc: 'Buku dokumentasi ilmiah klasifikasi keanekaragaman hayati wilayah perkebunan teh Priangan Jawa Barat.', 
      img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=300' 
    },
    { 
      id: 6, 
      title: 'Foto Udara Kota Bandung Pertama (1921)', 
      cat: 'Dokumen Sejarah', 
      desc: 'Dokumentasi arsip visual udara perencanaan tata kota Bandung buatan jawatan sipil kolonial Hindia Belanda.', 
      img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=300' 
    }
  ];

  let activeCategory = 'all';
  let searchQuery = '';

  // Render function
  function renderCatalog() {
    catalogGrid.innerHTML = '';
    
    // Filter items
    const filteredItems = catalogItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.cat === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filteredItems.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; border: 2px solid #0f172a; background: #fff;">
          <h4 style="margin: 0; color: #64748b;">Koleksi tidak ditemukan. Coba kata kunci lainnya.</h4>
        </div>
      `;
      return;
    }

    filteredItems.forEach(item => {
      const card = document.createElement('article');
      card.className = 'katalog-card';
      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${item.img}" alt="${item.title}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="card-category">${item.cat}</span>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.desc}</p>
        </div>
      `;
      catalogGrid.appendChild(card);
    });
  }

  // Event listener search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderCatalog();
    });
  }

  // Event listener category buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderCatalog();
    });
  });

  // Initial render
  renderCatalog();
}

// 4. BOOKING FORM VALIDATION & WHATSAPP REDIRECT
function setupBookingForm() {
  const form = document.getElementById('booking-form-el');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.style.borderColor = '');

    const nameEl = document.getElementById('visitor-name');
    const phoneEl = document.getElementById('visitor-phone');
    const countEl = document.getElementById('visitor-count');
    const dateEl = document.getElementById('visit-date');
    const timeEl = document.getElementById('visit-time');
    const purposeEl = document.getElementById('visit-purpose');

    let isValid = true;

    const showError = (el, msg) => {
      el.style.borderColor = '#ef4444';
      const err = document.createElement('small');
      err.className = 'form-error-msg';
      err.style.color = '#ef4444';
      err.style.marginTop = '4px';
      err.style.fontWeight = '700';
      err.style.fontSize = '0.78rem';
      err.textContent = msg;
      el.parentNode.appendChild(err);
      isValid = false;
    };

    // Validations
    if (!nameEl.value.trim()) {
      showError(nameEl, 'Nama penanggung jawab wajib diisi.');
    }

    const phoneVal = phoneEl.value.trim().replace(/[^0-9]/g, '');
    if (!phoneEl.value.trim()) {
      showError(phoneEl, 'Nomor WhatsApp wajib diisi.');
    } else if (phoneVal.length < 9 || phoneVal.length > 14) {
      showError(phoneEl, 'Nomor WhatsApp tidak valid (9-14 digit).');
    }

    const countVal = parseInt(countEl.value);
    if (!countEl.value) {
      showError(countEl, 'Jumlah pengunjung wajib diisi.');
    } else if (isNaN(countVal) || countVal < 1 || countVal > 50) {
      showError(countEl, 'Jumlah pengunjung valid antara 1-50 orang.');
    }

    if (!dateEl.value) {
      showError(dateEl, 'Silakan tentukan tanggal kunjungan.');
    }

    if (!timeEl.value) {
      showError(timeEl, 'Silakan pilih sesi jam kunjungan.');
    }

    if (!purposeEl.value.trim()) {
      showError(purposeEl, 'Silakan jelaskan tujuan riset/kunjungan Anda.');
    }

    if (isValid) {
      // Build WhatsApp message
      const waNumber = '6282128297825'; // HZXPro Admin WA
      let msg = `*PEMESANAN TIKET KUNJUNGAN - ARSIP & PERPUSTAKAAN HZX*\n`;
      msg += `=====================================================\n\n`;
      msg += `Halo Petugas Humas Layanan Kunjungan,\n`;
      msg += `Saya ingin mengajukan jadwal kunjungan penelitian dengan rincian berikut:\n\n`;
      msg += `👤 *Nama Penanggung Jawab:* ${nameEl.value.trim()}\n`;
      msg += `📞 *No. WhatsApp:* ${phoneEl.value.trim()}\n`;
      msg += `👥 *Jumlah Pengunjung:* ${countEl.value} Orang\n`;
      msg += `📅 *Tanggal Kunjungan:* ${dateEl.value}\n`;
      msg += `⏱️ *Sesi Waktu:* ${timeEl.value}\n`;
      msg += `📝 *Tujuan Kunjungan:* ${purposeEl.value.trim()}\n\n`;
      msg += `Mohon konfirmasi ketersediaan slot tiket masuk jemaah untuk jadwal tersebut. Terima kasih!`;

      // Visual feedback on button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memproses...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        alert('Booking Tiket Berhasil!\nAnda akan diarahkan ke WhatsApp Humas Arsip untuk penyerahan berkas verifikasi identitas.');
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
