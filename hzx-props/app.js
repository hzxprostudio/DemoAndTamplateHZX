/* ==========================================================================
   HZX Props - Real Estate Listings & Calculator Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // Mock Property Database Array
    // ==========================================================================
    const PROPERTIES = [
        {
            id: 1,
            title: "Modern Minimalist Villa Kemang",
            type: "Rumah",
            location: "Jakarta Selatan",
            price: 4500000000, // Rp 4.5 M
            beds: 4,
            baths: 3,
            area: 280,
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600&auto=format&fit=crop",
            desc: "Villa modern minimalis dua lantai berlokasi di kawasan asri Kemang. Dilengkapi dengan fasilitas smart-home, kolam renang pribadi, sirkulasi udara alami yang optimal, serta area taman belakang yang asri."
        },
        {
            id: 2,
            title: "Executive Apartment Senopati",
            type: "Apartemen",
            location: "Jakarta Selatan",
            price: 3200000000, // Rp 3.2 M
            beds: 2,
            baths: 2,
            area: 95,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop",
            desc: "Apartemen mewah siap huni di jantung kawasan elit Senopati. Pemandangan lepas kota (city view) Jakarta, kolam renang infinity, pusat kebugaran, keamanan berlapis 24 jam, dan akses langsung ke SCBD."
        },
        {
            id: 3,
            title: "Premium Land BSD City Hub",
            type: "Ruko",
            location: "Tangerang Selatan",
            price: 6800000000, // Rp 6.8 M
            beds: 0,
            baths: 4,
            area: 350,
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
            desc: "Ruko komersial 4 lantai strategis di pusat keramaian BSD City. Sangat cocok untuk kantor cabang perbankan, klinik kecantikan, restoran kuliner premium, atau showroom waralaba dengan area parkir luas."
        },
        {
            id: 4,
            title: "Tropical Estate Sentul Golf View",
            type: "Rumah",
            location: "Bogor",
            price: 2800000000, // Rp 2.8 M
            beds: 3,
            baths: 3,
            area: 210,
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
            desc: "Rumah berdesain tropical modern di perbukitan Sentul yang sejuk. Menghadap langsung ke lapangan golf dengan halaman rumput luas, area balkon santai yang lebar, dan udara pegunungan yang sangat bersih."
        },
        {
            id: 5,
            title: "Sudirman Suites Penthouse",
            type: "Apartemen",
            location: "Jakarta Selatan",
            price: 9500000000, // Rp 9.5 M
            beds: 3,
            baths: 4,
            area: 190,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop",
            desc: "Unit penthouse eksklusif lantai teratas dengan elevator pribadi di Sudirman. Dilengkapi ruang keluarga ekstra besar, jacuzzi pribadi, dapur basah & kering mewah (dry & wet kitchen), serta panorama gedung pencakar langit."
        },
        {
            id: 6,
            title: "Modern Shophouse Gading Serpong",
            type: "Ruko",
            location: "Tangerang Selatan",
            price: 4900000000, // Rp 4.9 M
            beds: 0,
            baths: 3,
            area: 240,
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop",
            desc: "Ruko modern 3 lantai siap pakai di jalur utama Gading Serpong. Area parkir luas terintegrasi, lokasi ramai dilalui kendaraan, ideal untuk kafe kekinian, minimarket premium, atau kantor representatif."
        }
    ];

    const AGENT_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const searchKeyword = document.getElementById('searchKeyword');
    const searchType = document.getElementById('searchType');
    const searchLocation = document.getElementById('searchLocation');
    const btnHeroSearch = document.getElementById('btnHeroSearch');
    
    const priceMax = document.getElementById('priceMax');
    const priceMaxVal = document.getElementById('priceMaxVal');
    const propertyCount = document.getElementById('propertyCount');
    const listingsGrid = document.getElementById('listingsGrid');
    
    const kprPrice = document.getElementById('kprPrice');
    const kprDp = document.getElementById('kprDp');
    const kprInterest = document.getElementById('kprInterest');
    const kprTenure = document.getElementById('kprTenure');
    const kprInstallment = document.getElementById('kprInstallment');
    
    const detailModal = document.getElementById('detailModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    const surveyForm = document.getElementById('surveyForm');
    const surveyName = document.getElementById('surveyName');
    const surveyPhone = document.getElementById('surveyPhone');
    const surveyProperty = document.getElementById('surveyProperty');
    const surveyDate = document.getElementById('surveyDate');
    const surveyTime = document.getElementById('surveyTime');
    const surveyNotes = document.getElementById('surveyNotes');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Mobile Navigation overlay controls
    // ==========================================================================
    const toggleMobileNav = () => mobileNav.classList.toggle('active');
    
    mobileMenuTrigger.addEventListener('click', toggleMobileNav);
    mobileNavClose.addEventListener('click', toggleMobileNav);
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // ==========================================================================
    // Property Catalog Filter & Rendering Logic
    // ==========================================================================
    const formatRupiahMiliar = (number) => {
        if (number >= 1000000000) {
            return `Rp ${(number / 1000000000).toFixed(1)} Miliar`;
        }
        return `Rp ${number.toLocaleString('id-ID')}`;
    };

    const renderProperties = (items) => {
        listingsGrid.innerHTML = '';
        propertyCount.innerText = items.length;
        
        if (items.length === 0) {
            listingsGrid.innerHTML = `
                <div class="no-data-state">
                    <i data-lucide="info"></i>
                    <h3>Tidak Menemukan Unit Properti</h3>
                    <p>Silakan coba atur kembali kata kunci pencarian atau geser jangkauan harga maksimum ke batas yang lebih tinggi.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        items.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            
            // Generate specifications tags based on property type (hide beds for Shophouses/Ruko)
            let specsHtml = '';
            if (prop.type !== 'Tanah' && prop.type !== 'Ruko') {
                specsHtml += `<div class="spec-item"><i data-lucide="bed-double"></i> <span>${prop.beds} Kamar</span></div>`;
            }
            specsHtml += `
                <div class="spec-item"><i data-lucide="bath"></i> <span>${prop.baths} Mandi</span></div>
                <div class="spec-item"><i data-lucide="maximize-2"></i> <span>${prop.area} m²</span></div>
            `;

            card.innerHTML = `
                <div class="property-img-wrapper">
                    <span class="status-badge">Dijual</span>
                    <img src="${prop.image}" alt="${prop.title}" class="property-img">
                </div>
                <div class="property-body">
                    <h4 class="property-price">${formatRupiahMiliar(prop.price)}</h4>
                    <h3 class="property-title">${prop.title}</h3>
                    <div class="property-location">
                        <i data-lucide="map-pin"></i>
                        <span>${prop.location}</span>
                    </div>
                    <div class="property-specs">
                        ${specsHtml}
                    </div>
                    <button class="btn btn-details" data-id="${prop.id}">Lihat Detail Unit</button>
                </div>
            `;
            listingsGrid.appendChild(card);
        });

        // Initialize Lucide icons on newly created elements
        lucide.createIcons();
        bindDetailsButtons();
    };

    const applyFilters = () => {
        const keyword = searchKeyword.value.toLowerCase().trim();
        const type = searchType.value;
        const location = searchLocation.value;
        const maxPriceVal = parseInt(priceMax.value);

        // Update slider value text
        priceMaxVal.innerText = formatRupiahMiliar(maxPriceVal);

        const filtered = PROPERTIES.filter(prop => {
            const matchesKeyword = prop.title.toLowerCase().includes(keyword) || prop.location.toLowerCase().includes(keyword);
            const matchesType = type === 'all' || prop.type === type;
            const matchesLocation = location === 'all' || prop.location === location;
            const matchesPrice = prop.price <= maxPriceVal;

            return matchesKeyword && matchesType && matchesLocation && matchesPrice;
        });

        renderProperties(filtered);
    };

    // Bind event listeners to catalog filters
    priceMax.addEventListener('input', applyFilters);
    btnHeroSearch.addEventListener('click', () => {
        applyFilters();
        document.getElementById('listings').scrollIntoView({ behavior: 'smooth' });
    });

    // Allow instant filter updates when dropdowns are changed
    searchType.addEventListener('change', applyFilters);
    searchLocation.addEventListener('change', applyFilters);

    // ==========================================================================
    // Property Detail Modal
    // ==========================================================================
    const openModal = (propId) => {
        const prop = PROPERTIES.find(p => p.id === propId);
        if (!prop) return;

        let specsHtml = '';
        if (prop.type !== 'Tanah' && prop.type !== 'Ruko') {
            specsHtml += `<div class="spec-item"><i data-lucide="bed-double"></i> <span>${prop.beds} Kamar Tidur</span></div>`;
        }
        specsHtml += `
            <div class="spec-item"><i data-lucide="bath"></i> <span>${prop.baths} Kamar Mandi</span></div>
            <div class="spec-item"><i data-lucide="maximize-2"></i> <span>Luas Bangunan ${prop.area} m²</span></div>
        `;

        modalContent.innerHTML = `
            <div class="modal-gallery">
                <img src="${prop.image}" alt="${prop.title}">
            </div>
            <h3 class="modal-title">${prop.title}</h3>
            <div class="modal-location">
                <i data-lucide="map-pin"></i>
                <span>${prop.location}</span>
            </div>
            
            <div class="modal-specs-row">
                ${specsHtml}
            </div>

            <h4 class="modal-desc-heading">Deskripsi Properti</h4>
            <p class="modal-desc-text">${prop.desc}</p>
            
            <div class="modal-action-row">
                <div>
                    <span style="font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">Harga Unit</span>
                    <h4 class="property-price">${formatRupiahMiliar(prop.price)}</h4>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary btn-kpr-simulate" data-price="${prop.price}">Simulasi KPR</button>
                    <button class="btn btn-primary btn-modal-booking" data-title="${prop.title}">Jadwal Survey</button>
                </div>
            </div>
        `;

        detailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();

        // Bind buttons inside newly rendered modal
        const btnKpr = modalContent.querySelector('.btn-kpr-simulate');
        const btnBooking = modalContent.querySelector('.btn-modal-booking');

        btnKpr.addEventListener('click', () => {
            const price = btnKpr.getAttribute('data-price');
            kprPrice.value = price;
            // Set DP to 20% by default
            kprDp.value = Math.round(price * 0.2);
            calculateKprInstallment();
            
            closeModal();
            document.getElementById('kpr').scrollIntoView({ behavior: 'smooth' });
            showToast('Simulasi KPR diperbarui berdasarkan harga unit ini.', 'info');
        });

        btnBooking.addEventListener('click', () => {
            const title = btnBooking.getAttribute('data-title');
            surveyProperty.value = title;
            
            closeModal();
            document.getElementById('kontak').scrollIntoView({ behavior: 'smooth' });
            surveyName.focus();
            showToast(`Form survey disiapkan untuk unit "${title}".`, 'info');
        });
    };

    const closeModal = () => {
        detailModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    const bindDetailsButtons = () => {
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                openModal(id);
            });
        });
    };

    // Close Modal triggers
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // ==========================================================================
    // KPR Mortgage Calculator Amortization Math
    // ==========================================================================
    const calculateKprInstallment = () => {
        const price = parseFloat(kprPrice.value) || 0;
        const dp = parseFloat(kprDp.value) || 0;
        const interestRate = parseFloat(kprInterest.value) || 0;
        const tenureYears = parseInt(kprTenure.value) || 15;

        // Validations
        if (price <= 0 || dp >= price) {
            kprInstallment.innerText = "Rp 0 / bln";
            return;
        }

        const principal = price - dp;
        const monthlyInterest = (interestRate / 100) / 12;
        const months = tenureYears * 12;

        let installment = 0;
        if (monthlyInterest === 0) {
            installment = principal / months;
        } else {
            installment = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / (Math.pow(1 + monthlyInterest, months) - 1);
        }

        kprInstallment.innerText = `Rp ${Math.round(installment).toLocaleString('id-ID')} / bln`;
    };

    // Bind calculator input changes
    [kprPrice, kprDp, kprInterest, kprTenure].forEach(input => {
        input.addEventListener('input', calculateKprInstallment);
        input.addEventListener('change', calculateKprInstallment);
    });

    // ==========================================================================
    // Survey Booking Form Submit & WA Redirect
    // ==========================================================================
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    surveyDate.setAttribute('min', formattedToday);

    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = surveyName.value.trim();
        const phone = surveyPhone.value.trim();
        const property = surveyProperty.value.trim();
        const date = surveyDate.value;
        const time = surveyTime.value;
        const notes = surveyNotes.value.trim();

        // Validations
        if (!name) {
            showToast('Nama lengkap wajib diisi.', 'danger');
            surveyName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang valid.', 'danger');
            surveyPhone.focus();
            return;
        }
        if (!property) {
            showToast('Tuliskan unit properti yang ingin dituju.', 'danger');
            surveyProperty.focus();
            return;
        }
        if (!date) {
            showToast('Pilih rencana tanggal survey lokasi.', 'danger');
            surveyDate.focus();
            return;
        }
        if (!time) {
            showToast('Pilih jam kedatangan survey.', 'danger');
            surveyTime.focus();
            return;
        }

        // Format Date to elegant Indonesian string
        const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        const dateObj = new Date(date);
        const dayText = DAY_NAMES[dateObj.getDay()];
        const dayNum = dateObj.getDate();
        const monthText = MONTH_NAMES[dateObj.getMonth()];
        const yearNum = dateObj.getFullYear();
        const formattedDate = `${dayText}, ${dayNum} ${monthText} ${yearNum}`;

        // Build WhatsApp text details
        let waMsg = `*HZX PROPS - BOOKING SURVEY LOKASI*\n`;
        waMsg += `====================================\n\n`;
        waMsg += `*Data Pemohon Survey:*\n`;
        waMsg += `- Nama Lengkap: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Rencana Kunjungan Unit:*\n`;
        waMsg += `- Target Unit: ${property}\n`;
        waMsg += `- Hari/Tanggal: ${formattedDate}\n`;
        waMsg += `- Estimasi Jam: ${time} WIB\n\n`;
        
        if (notes) {
            waMsg += `*Catatan Tambahan:*\n`;
            waMsg += `"${notes}"\n\n`;
        }
        
        waMsg += `====================================\n`;
        waMsg += `_Mohon informasi kesediaan jadwal konsultan HZX Props untuk mendampingi survey unit tersebut. Terima kasih!_`;

        const waUrl = `https://wa.me/${AGENT_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Jadwal survey diajukan! Mengarahkan Anda ke WhatsApp Agen...', 'success');
        surveyForm.reset();
    });

    // ==========================================================================
    // Toast Notification System
    // ==========================================================================
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconName = type === 'success' ? 'check-circle' : (type === 'danger' ? 'alert-triangle' : 'info');
        
        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close"><i data-lucide="x"></i></button>
        `;
        
        toastContainer.appendChild(toast);
        lucide.createIcons();
        
        // Close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => dismissToast(toast));
        
        // Auto close after 3.5 seconds
        setTimeout(() => dismissToast(toast), 3500);
    };

    const dismissToast = (toast) => {
        toast.style.animation = 'toast-out 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    };

    // ==========================================================================
    // Startup Initializations
    // ==========================================================================
    // Initial Render of Properties List
    renderProperties(PROPERTIES);
    // Calculate initial KPR mortgage payment
    calculateKprInstallment();

    console.log("HZX Props Agent Web App Loaded - Created by HZXPro Studio");
});
