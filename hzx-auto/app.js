/* ==========================================================================
   HZX Auto - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const AUTO_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    const carCards = document.querySelectorAll('.car-card');
    
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroServiceSelect = document.getElementById('heroServiceSelect');
    const heroCategorySelect = document.getElementById('heroCategorySelect');
    const btnHeroSearch = document.getElementById('btnHeroSearch');
    
    const carRentalBookingForm = document.getElementById('carRentalBookingForm');
    const bookingName = document.getElementById('bookingName');
    const bookingPhone = document.getElementById('bookingPhone');
    const bookingCar = document.getElementById('bookingCar');
    const bookingService = document.getElementById('bookingService');
    const bookingDate = document.getElementById('bookingDate');
    const bookingDuration = document.getElementById('bookingDuration');
    
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
    // Fleet Card Category Filter Tabs
    // ==========================================================================
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            filterCars(category);
        });
    });

    const filterCars = (category) => {
        let visibleCount = 0;
        carCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        return visibleCount;
    };

    // ==========================================================================
    // Hero Search / Filters Engine
    // ==========================================================================
    btnHeroSearch.addEventListener('click', () => {
        const query = heroSearchInput.value.toLowerCase().trim();
        const service = heroServiceSelect.value;
        const category = heroCategorySelect.value;
        
        let matchCount = 0;
        carCards.forEach(card => {
            const cardName = card.getAttribute('data-name').toLowerCase();
            const cardCategory = card.getAttribute('data-category');
            
            const matchesQuery = !query || cardName.includes(query);
            const matchesCategory = category === 'all' || cardCategory === category;
            
            if (matchesQuery && matchesCategory) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (matchCount > 0) {
            showToast(`Menampilkan ${matchCount} armada mobil pilihan!`, 'success');
            
            // Set service in form based on search
            bookingService.value = service;
            
            // Smooth scroll to fleet catalog
            document.getElementById('armada').scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast('Armada mobil tidak ditemukan. Menampilkan semua armada.', 'danger');
            filterCars('all');
        }
    });

    // ==========================================================================
    // Fleet Card "Sewa" Button Trigger
    // ==========================================================================
    document.querySelectorAll('.btn-rent-car').forEach(btn => {
        btn.addEventListener('click', () => {
            const carName = btn.getAttribute('data-car');
            
            // Set value in booking dropdown select
            bookingCar.value = carName;
            
            showToast(`Armada "${carName}" terpilih!`, 'success');
            
            // Smooth scroll to booking form
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // Booking Form Submission & WhatsApp redirection
    // ==========================================================================
    carRentalBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = bookingName.value.trim();
        const phone = bookingPhone.value.trim();
        const car = bookingCar.value;
        const service = bookingService.value;
        const date = bookingDate.value;
        const duration = bookingDuration.value;
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap penyewa wajib diisi.', 'danger');
            bookingName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            bookingPhone.focus();
            return;
        }
        if (!car) {
            showToast('Pilih unit armada mobil yang ingin disewa.', 'danger');
            bookingCar.focus();
            return;
        }
        if (!date) {
            showToast('Pilih tanggal rencana mulai sewa.', 'danger');
            bookingDate.focus();
            return;
        }
        if (!duration || duration < 1) {
            showToast('Durasi penyewaan minimal 1 hari.', 'danger');
            bookingDuration.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX AUTO - PEMESANAN RENTAL MOBIL*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Rincian Penyewa:*\n`;
        waMsg += `- Nama Penyewa: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Rincian Layanan Sewa:*\n`;
        waMsg += `- Unit Armada: ${car}\n`;
        waMsg += `- Jenis Layanan: ${service}\n`;
        waMsg += `- Tanggal Mulai: ${formatDate(date)}\n`;
        waMsg += `- Durasi Sewa: ${duration} Hari\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dikonfirmasi ketersediaan unit armada mobil pilihan tersebut dan dihitung total nominal invoice pembayarannya. Terima kasih._`;
        
        const waUrl = `https://wa.me/${AUTO_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pemesanan dikompilasi! Menghubungkan ke Rental Representative...', 'success');
        carRentalBookingForm.reset();
    });

    // Helper date formatter
    const formatDate = (dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        
        const day = parts[2];
        const monthNum = parseInt(parts[1]) - 1;
        const year = parts[0];
        
        const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return `${day} ${MONTH_NAMES[monthNum]} ${year}`;
    };

    // ==========================================================================
    // Toast Notification system helper
    // ==========================================================================
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconName = type === 'success' ? 'check-circle' : 'alert-triangle';
        
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

    console.log("HZX Auto Main Web App Loaded - Created by HZXPro Studio");
});
