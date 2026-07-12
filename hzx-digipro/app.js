/* ==========================================================================
   HZX Digipro - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const DIGITAL_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const faqHeaders = document.querySelectorAll('.faq-header');
    
    const digitalCheckoutForm = document.getElementById('digitalCheckoutForm');
    const buyerName = document.getElementById('buyerName');
    const buyerPhone = document.getElementById('buyerPhone');
    const buyerBundle = document.getElementById('buyerBundle');
    
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
    // Pricing plan button click events
    // ==========================================================================
    document.querySelectorAll('.btn-buy-bundle').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            
            // Auto fill select dropdown in checkout form
            buyerBundle.value = plan;
            
            showToast(`Paket "${plan}" terpilih!`, 'success');
            
            // Smooth scroll to form
            document.getElementById('beli').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // FAQ Accordion Panel toggles
    // ==========================================================================
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = header.nextElementSibling;
            
            // Toggle active class on item
            const isActive = item.classList.contains('active');
            
            // Collapse all FAQs first for clean single accordion behavior
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-body').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    // ==========================================================================
    // Registration Form Submission & WA redirect
    // ==========================================================================
    digitalCheckoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = buyerName.value.trim();
        const phone = buyerPhone.value.trim();
        const bundle = buyerBundle.value;
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap wajib diisi.', 'danger');
            buyerName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            buyerPhone.focus();
            return;
        }
        if (!bundle) {
            showToast('Pilih paket belajar yang ingin Anda beli.', 'danger');
            buyerBundle.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX DIGIPRO - RESERVASI PRODUK DIGITAL*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Informasi Pembeli:*\n`;
        waMsg += `- Nama Lengkap: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Detail Pembelian:*\n`;
        waMsg += `- Paket Belajar: ${bundle}\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dikirimkan instruksi nomor rekening pembayaran bank transfer dan petunjuk verifikasi kode akses agar lisensi berkas e-book & portal video course dapat diaktifkan. Terima kasih._`;
        
        const waUrl = `https://wa.me/${DIGITAL_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pemesanan dikompilasi! Menghubungkan ke Sales Representative...', 'success');
        digitalCheckoutForm.reset();
    });

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

    console.log("HZX Digipro Landing Page Loaded - Created by HZXPro Studio");
});
