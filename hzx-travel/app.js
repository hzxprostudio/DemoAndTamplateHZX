/* ==========================================================================
   HZX Travel - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const TRAVEL_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    const packageCards = document.querySelectorAll('.package-card');
    
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroMonthSelect = document.getElementById('heroMonthSelect');
    const heroCategorySelect = document.getElementById('heroCategorySelect');
    const btnHeroSearch = document.getElementById('btnHeroSearch');
    
    const travelBookingForm = document.getElementById('travelBookingForm');
    const bookingName = document.getElementById('bookingName');
    const bookingPhone = document.getElementById('bookingPhone');
    const bookingDate = document.getElementById('bookingDate');
    const bookingPackage = document.getElementById('bookingPackage');
    const bookingGuests = document.getElementById('bookingGuests');
    const bookingRequests = document.getElementById('bookingRequests');
    
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
    // Package Card Category Filter Tabs
    // ==========================================================================
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            filterPackages(category);
        });
    });

    const filterPackages = (category) => {
        let visibleCount = 0;
        packageCards.forEach(card => {
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
        const month = heroMonthSelect.value;
        const category = heroCategorySelect.value;
        
        let matchCount = 0;
        packageCards.forEach(card => {
            const cardName = card.getAttribute('data-name').toLowerCase();
            const cardMonth = card.getAttribute('data-month');
            const cardCategory = card.getAttribute('data-category');
            
            const matchesQuery = !query || cardName.includes(query);
            const matchesMonth = !month || cardMonth === month;
            const matchesCategory = category === 'all' || cardCategory === category;
            
            if (matchesQuery && matchesMonth && matchesCategory) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (matchCount > 0) {
            showToast(`Berhasil menemukan ${matchCount} paket wisata pilihan!`, 'success');
            // Smooth scroll to packages catalog
            document.getElementById('paket').scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast('Paket wisata tidak ditemukan. Menampilkan semua paket.', 'danger');
            filterPackages('all');
        }
    });

    // ==========================================================================
    // Package Card "Pesan" Button Trigger
    // ==========================================================================
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', () => {
            const packageName = btn.getAttribute('data-package');
            
            // Set value in booking dropdown select
            bookingPackage.value = packageName;
            
            showToast(`Paket "${packageName}" terpilih!`, 'success');
            
            // Smooth scroll to booking form
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // Booking Form Submission & WhatsApp redirection
    // ==========================================================================
    travelBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = bookingName.value.trim();
        const phone = bookingPhone.value.trim();
        const date = bookingDate.value;
        const selectedPack = bookingPackage.value;
        const guests = bookingGuests.value;
        const requests = bookingRequests.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap pemesan wajib diisi.', 'danger');
            bookingName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            bookingPhone.focus();
            return;
        }
        if (!date) {
            showToast('Silakan tentukan tanggal rencana keberangkatan.', 'danger');
            bookingDate.focus();
            return;
        }
        if (!selectedPack) {
            showToast('Pilih paket wisata tujuan Anda.', 'danger');
            bookingPackage.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX TRAVEL - RESERVASI TIKET WISATA*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Rincian Pemesanan:*\n`;
        waMsg += `- Nama Pemesan: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Detail Paket Tour:*\n`;
        waMsg += `- Pilihan Paket: ${selectedPack}\n`;
        waMsg += `- Tanggal Berangkat: ${formatDate(date)}\n`;
        waMsg += `- Jumlah Peserta: ${guests} Pax\n\n`;
        
        if (requests) {
            waMsg += `*Permintaan Khusus / Catatan:*\n`;
            waMsg += `"${requests}"\n\n`;
        }
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dikonfirmasi ketersediaan kuota slot keberangkatan dan total nominal invoice pembayarannya. Terima kasih._`;
        
        const waUrl = `https://wa.me/${TRAVEL_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pemesanan dikompilasi! Menghubungkan ke Travel Representative...', 'success');
        travelBookingForm.reset();
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

    console.log("HZX Travel Main Web App Loaded - Created by HZXPro Studio");
});
