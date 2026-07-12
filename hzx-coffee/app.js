/* ==========================================================================
   HZX Coffee - Interactive Application Logic (Vanilla JS)
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
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuGrid = document.getElementById('menuGrid');
    
    const reservationForm = document.getElementById('reservationForm');
    const resName = document.getElementById('resName');
    const resGuests = document.getElementById('resGuests');
    const resDate = document.getElementById('resDate');
    const resTime = document.getElementById('resTime');
    const resNotes = document.getElementById('resNotes');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Mobile Navigation Drawer
    // ==========================================================================
    const toggleMobileNav = () => mobileNav.classList.toggle('active');
    
    mobileMenuTrigger.addEventListener('click', toggleMobileNav);
    mobileNavClose.addEventListener('click', toggleMobileNav);
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // ==========================================================================
    // Digital Menu Filter Logic
    // ==========================================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            const menuCards = menuGrid.querySelectorAll('.menu-card');
            
            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add soft scale out animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.96)';
                
                setTimeout(() => {
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 180);
            });
        });
    });

    // Set minimum date picker values to Today to prevent past bookings
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    resDate.setAttribute('min', formattedToday);

    // ==========================================================================
    // Reservation Submission & WhatsApp Formatting
    // ==========================================================================
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = resName.value.trim();
        const guests = resGuests.value;
        const rawDate = resDate.value;
        const time = resTime.value;
        const notes = resNotes.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap wajib diisi.', 'danger');
            resName.focus();
            return;
        }
        if (!guests) {
            showToast('Silakan pilih jumlah tamu.', 'danger');
            resGuests.focus();
            return;
        }
        if (!rawDate) {
            showToast('Silakan tentukan tanggal kunjungan.', 'danger');
            resDate.focus();
            return;
        }
        if (!time) {
            showToast('Silakan tentukan jam kedatangan.', 'danger');
            resTime.focus();
            return;
        }
        
        // Parse date for elegant Indonesian readable string
        const dateObj = new Date(rawDate);
        const dayName = DAY_NAMES[dateObj.getDay()];
        const dayNum = dateObj.getDate();
        const monthName = MONTH_NAMES[dateObj.getMonth()];
        const yearNum = dateObj.getFullYear();
        const formattedDateText = `${dayName}, ${dayNum} ${monthName} ${yearNum}`;

        // Format WhatsApp Message details
        let waMsg = `*HZX COFFEE - RESERVASI MEJA BARU*\n`;
        waMsg += `==================================\n\n`;
        waMsg += `*Nama Klien:* ${name}\n`;
        waMsg += `*Jumlah Tamu:* ${guests}\n`;
        waMsg += `*Tanggal:* ${formattedDateText}\n`;
        waMsg += `*Jam Kedatangan:* ${time} WIB\n\n`;
        
        if (notes) {
            waMsg += `*Catatan Khusus:*\n`;
            waMsg += `"${notes}"\n\n`;
        }
        
        waMsg += `==================================\n`;
        waMsg += `_Mohon segera konfirmasikan ketersediaan meja untuk jadwal di atas. Terima kasih! ☕_`;
        
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Redirect to WhatsApp
        window.open(waUrl, '_blank');
        
        showToast('Pendaftaran reservasi berhasil! Menghubungkan ke WhatsApp...', 'success');
        reservationForm.reset();
    });

    // ==========================================================================
    // Toast Notification helper
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

    console.log("HZX Coffee Cafe Web Application Loaded - Created by HZXPro Studio");
});
