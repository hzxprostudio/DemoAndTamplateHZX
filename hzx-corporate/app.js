/* ==========================================================================
   HZX Corporate - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const CORPORATE_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const corporateContactForm = document.getElementById('corporateContactForm');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');
    
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
    // Contact Form Submission & WA redirect
    // ==========================================================================
    corporateContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const phone = contactPhone.value.trim();
        const subject = contactSubject.value;
        const msg = contactMessage.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap atau Perusahaan wajib diisi.', 'danger');
            contactName.focus();
            return;
        }
        if (!email || !validateEmail(email)) {
            showToast('Alamat email tidak valid.', 'danger');
            contactEmail.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            contactPhone.focus();
            return;
        }
        if (!subject) {
            showToast('Silakan tentukan topik/subjek konsultasi.', 'danger');
            contactSubject.focus();
            return;
        }
        if (!msg || msg.length < 10) {
            showToast('Tuliskan keluhan atau kendala bisnis Anda minimal 10 karakter.', 'danger');
            contactMessage.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX CORPORATE - KONSULTASI LAYANAN BARU*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Informasi Pengirim:*\n`;
        waMsg += `- Nama Pengirim: ${name}\n`;
        waMsg += `- Alamat Email: ${email}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Topik Pembahasan:*\n`;
        waMsg += `- Subjek Konsultasi: ${subject}\n\n`;
        
        waMsg += `*Detail Pesan / Kendala Bisnis:*\n`;
        waMsg += `"${msg}"\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dijadwalkan agar tim Relationship Manager HZX Corporate dapat menghubungi kembali. Terima kasih._`;
        
        const waUrl = `https://wa.me/${CORPORATE_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pesan dikompilasi! Menghubungkan ke WhatsApp Representative...', 'success');
        corporateContactForm.reset();
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

    console.log("HZX Corporate Main Web App Loaded - Created by HZXPro Studio");
});
