/* ==========================================================================
   HZX VENDOR - Application & Lightbox Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const SHOP_WHATSAPP = '628123456789';
    
    // Day Names in Indonesian
    const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    
    // Month Names in Indonesian
    const MONTH_NAMES = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    
    const availabilityForm = document.getElementById('availabilityForm');
    const formName = document.getElementById('formName');
    const formPhone = document.getElementById('formPhone');
    const formDate = document.getElementById('formDate');
    const formType = document.getElementById('formType');
    const formGuests = document.getElementById('formGuests');
    const formPackage = document.getElementById('formPackage');
    
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
    // Custom Lightbox Modal Gallery Logic
    // ==========================================================================
    const openLightbox = (imgSrc, imgAlt, captionText) => {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        lightboxCaption.innerText = captionText;
        
        lightboxModal.style.display = 'flex';
        // Force layout repaint to trigger css opacity transition
        lightboxModal.offsetWidth;
        lightboxModal.classList.add('active');
        
        // Disable body scroll when lightbox is active
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        // Restore scroll after fade out ends
        setTimeout(() => {
            lightboxModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 350);
    };

    // Bind click events to portfolio image wraps
    document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', () => {
            const fullSrc = img.getAttribute('data-full-src');
            const caption = img.getAttribute('data-caption');
            const alt = img.alt;
            
            openLightbox(fullSrc, alt, caption);
        });
    });

    // Close triggers
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Escape key press close trigger
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ==========================================================================
    // Service Package Auto-selection link
    // ==========================================================================
    document.querySelectorAll('.btn-select-pkg').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pkgName = btn.getAttribute('data-pkg-name');
            formPackage.value = pkgName;
            
            // Focus visual highlight
            formPackage.style.borderColor = 'var(--accent)';
            
            // Scroll to form section
            document.getElementById('jadwal').scrollIntoView({ behavior: 'smooth' });
            showToast(`Paket "${pkgName}" dipilih! Silakan lengkapi tanggal rencana acara.`, 'info');
            
            setTimeout(() => {
                formPackage.style.borderColor = 'var(--border-color)';
            }, 1500);
        });
    });

    // Set min date of form date picker to today
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    formDate.setAttribute('min', formattedToday);

    // ==========================================================================
    // Date Availability Form Submission & WA redirect
    // ==========================================================================
    availabilityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = formName.value.trim();
        const phone = formPhone.value.trim();
        const rawDate = formDate.value;
        const type = formType.value;
        const guests = formGuests.value;
        const selectedPkg = formPackage.value.trim();
        
        // Validations
        if (!name) {
            showToast('Nama Lengkap wajib diisi.', 'danger');
            formName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Nomor WhatsApp tidak valid.', 'danger');
            formPhone.focus();
            return;
        }
        if (!rawDate) {
            showToast('Pilih rencana tanggal acara.', 'danger');
            formDate.focus();
            return;
        }
        if (!type) {
            showToast('Pilih kategori/jenis acara.', 'danger');
            formType.focus();
            return;
        }
        if (!guests) {
            showToast('Tentukan kapasitas estimasi tamu undangan.', 'danger');
            formGuests.focus();
            return;
        }

        // Format Date to elegant Indonesian text
        const dateObj = new Date(rawDate);
        const dayName = DAY_NAMES[dateObj.getDay()];
        const dayNum = dateObj.getDate();
        const monthName = MONTH_NAMES[dateObj.getMonth()];
        const yearNum = dateObj.getFullYear();
        const formattedDateText = `${dayName}, ${dayNum} ${monthName} ${yearNum}`;

        // Build WhatsApp text details
        let waMsg = `*HZX VENDOR - CEK KETERSEDIAAN TANGGAL*\n`;
        waMsg += `======================================\n\n`;
        waMsg += `*Nama Klien:* ${name}\n`;
        waMsg += `*Nomor WA:* ${phone}\n\n`;
        
        waMsg += `*Rincian Rencana Acara:*\n`;
        waMsg += `- Jenis Acara: ${type}\n`;
        waMsg += `- Tanggal Acara: ${formattedDateText}\n`;
        waMsg += `- Estimasi Tamu: ${guests}\n`;
        
        if (selectedPkg) {
            waMsg += `- Paket / Konsep Pilihan: ${selectedPkg}\n`;
        }
        
        waMsg += `\n======================================\n`;
        waMsg += `_Mohon kesediaan konfirmasi ketersediaan jadwal planner HZX VENDOR untuk detail di atas. Terima kasih!_`;
        
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Redirect to WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pencarian jadwal berhasil! Mengarahkan Anda ke WhatsApp CS...', 'success');
        availabilityForm.reset();
    });

    // ==========================================================================
    // Toast Notification system helper
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

    console.log("HZX VENDOR Wedding Planner Web App Loaded - Created by HZXPro Studio");
});
