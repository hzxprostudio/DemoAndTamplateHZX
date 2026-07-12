/* ==========================================================================
   HAZZ - Premium Dark Minimalist Portfolio Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const CLIENT_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const projectBookingForm = document.getElementById('projectBookingForm');
    const clientName = document.getElementById('clientName');
    const clientEmail = document.getElementById('clientEmail');
    const clientPhone = document.getElementById('clientPhone');
    const projectType = document.getElementById('projectType');
    const projectBudget = document.getElementById('projectBudget');
    const projectBrief = document.getElementById('projectBrief');
    
    const toastContainer = document.getElementById('toastContainer');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link:not(.nav-link-btn)');
    const sections = document.querySelectorAll('section');

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
    // Smooth Scroll Active Nav Link Highlight Indicator
    // ==========================================================================
    const handleScrollActiveNav = () => {
        let scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--primary)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', handleScrollActiveNav);

    // ==========================================================================
    // Project Booking Form Submission & WA redirect
    // ==========================================================================
    projectBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = clientName.value.trim();
        const email = clientEmail.value.trim();
        const phone = clientPhone.value.trim();
        const category = projectType.value;
        const budget = projectBudget.value;
        const brief = projectBrief.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap / Instansi wajib diisi.', 'danger');
            clientName.focus();
            return;
        }
        if (!email || !validateEmail(email)) {
            showToast('Alamat email tidak valid.', 'danger');
            clientEmail.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Nomor WhatsApp tidak valid.', 'danger');
            clientPhone.focus();
            return;
        }
        if (!category) {
            showToast('Silakan pilih kategori kebutuhan proyek.', 'danger');
            projectType.focus();
            return;
        }
        if (!budget) {
            showToast('Silakan tentukan perkiraan rentang budget.', 'danger');
            projectBudget.focus();
            return;
        }
        if (!brief || brief.length < 15) {
            showToast('Tuliskan deskripsi ringkas minimal 15 karakter.', 'danger');
            projectBrief.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HAZZ DIGITAL - BRIEF PROYEK KOLABORASI*\n`;
        waMsg += `==========================================\n\n`;
        waMsg += `*Informasi Kontak Klien:*\n`;
        waMsg += `- Nama Klien: ${name}\n`;
        waMsg += `- Alamat Email: ${email}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Rincian Rencana Proyek:*\n`;
        waMsg += `- Kategori Proyek: ${category}\n`;
        waMsg += `- Estimasi Budget: ${budget}\n\n`;
        
        waMsg += `*Deskripsi Ringkas Proyek:*\n`;
        waMsg += `"${brief}"\n\n`;
        
        waMsg += `==========================================\n`;
        waMsg += `_Mohon segera dijadwalkan untuk sesi meeting konsultasi/diskusi detail awal. Terima kasih!_`;
        
        const waUrl = `https://wa.me/${CLIENT_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pesan dikompilasi! Menghubungkan ke WhatsApp HAZZ...', 'success');
        projectBookingForm.reset();
    });

    // Helper email validator regex
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

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

    console.log("HAZZ Digital Personal Portfolio Loaded - Created by HZXPro Studio");
});
