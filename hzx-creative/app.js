/* ==========================================================================
   HZX Creative - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const CREATIVE_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Calculator Inputs
    const serviceUi = document.getElementById('serviceUi');
    const serviceWeb = document.getElementById('serviceWeb');
    const serviceBrand = document.getElementById('serviceBrand');
    const calcPages = document.getElementById('calcPages');
    const pagesLabel = document.getElementById('pagesLabel');
    const urgentService = document.getElementById('urgentService');
    const calcResultDisplay = document.getElementById('calcResultDisplay');
    
    // Booking Form
    const creativeBookingForm = document.getElementById('creativeBookingForm');
    const bookingName = document.getElementById('bookingName');
    const bookingPhone = document.getElementById('bookingPhone');
    const bookingEmail = document.getElementById('bookingEmail');
    const bookingDescription = document.getElementById('bookingDescription');
    
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
    // Portfolio Card Category Filter Tabs
    // ==========================================================================
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            filterProjects(category);
        });
    });

    const filterProjects = (category) => {
        let visibleCount = 0;
        projectCards.forEach(card => {
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
    // Interactive Project Cost Estimator Math
    // ==========================================================================
    const updateProjectEstimate = () => {
        let baseCost = 0;
        let selectedServices = [];

        if (serviceUi.checked) {
            baseCost += parseFloat(serviceUi.value);
            selectedServices.push("UI/UX Design");
        }
        if (serviceWeb.checked) {
            baseCost += parseFloat(serviceWeb.value);
            selectedServices.push("Web Development");
        }
        if (serviceBrand.checked) {
            baseCost += parseFloat(serviceBrand.value);
            selectedServices.push("Brand Identity");
        }

        const pages = parseInt(calcPages.value);
        pagesLabel.innerText = `${pages} Halaman / Modul`;
        
        // Multiplier cost per page
        const pagesCost = pages * 500000;
        
        let total = baseCost + pagesCost;

        // Apply 30% urgency surge fee if checked
        if (urgentService.checked) {
            total = total * 1.30;
        }

        calcResultDisplay.innerText = `Rp ${Math.round(total).toLocaleString('id-ID')}`;
        return {
            total: total,
            services: selectedServices,
            pages: pages,
            urgent: urgentService.checked
        };
    };

    // Bind event listeners to calculator inputs
    [serviceUi, serviceWeb, serviceBrand, urgentService].forEach(input => {
        input.addEventListener('change', updateProjectEstimate);
    });
    calcPages.addEventListener('input', updateProjectEstimate);

    // Run initial computation
    updateProjectEstimate();

    // ==========================================================================
    // Booking Form Submission & WhatsApp redirection
    // ==========================================================================
    creativeBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = bookingName.value.trim();
        const phone = bookingPhone.value.trim();
        const email = bookingEmail.value.trim();
        const brief = bookingDescription.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap atau instansi wajib diisi.', 'danger');
            bookingName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            bookingPhone.focus();
            return;
        }
        if (!email || !validateEmail(email)) {
            showToast('Masukkan alamat email yang valid.', 'danger');
            bookingEmail.focus();
            return;
        }
        if (!brief || brief.length < 15) {
            showToast('Tuliskan brief deskripsi sasaran proyek minimal 15 karakter.', 'danger');
            bookingDescription.focus();
            return;
        }

        // Get current calculator specifications
        const calcData = updateProjectEstimate();
        if (calcData.services.length === 0) {
            showToast('Pilih minimal satu layanan jasa pada kalkulator di sebelah kiri.', 'danger');
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX CREATIVE - PENAWARAN PROYEK BARU*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Informasi Klien:*\n`;
        waMsg += `- Nama Klien: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n`;
        waMsg += `- Alamat Email: ${email}\n\n`;
        
        waMsg += `*Estimasi Pilihan Layanan:*\n`;
        waMsg += `- Layanan Dipesan: ${calcData.services.join(", ")}\n`;
        waMsg += `- Volume Halaman: ${calcData.pages} Halaman\n`;
        waMsg += `- Layanan Kilat (Urgent): ${calcData.urgent ? "Ya (+30% fee)" : "Tidak"}\n`;
        waMsg += `- Estimasi Awal Anggaran: Rp ${Math.round(calcData.total).toLocaleString('id-ID')}\n\n`;
        
        waMsg += `*Deskripsi Brief Proyek Klien:*\n`;
        waMsg += `"${brief}"\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon dijadwalkan sesi meeting / Zoom call pertama agar tim UI/UX Engineer HZX Creative dapat memaparkan proposal spesifikasi teknis dan rincian quotation resmi. Terima kasih._`;
        
        const waUrl = `https://wa.me/${CREATIVE_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Brief dikompilasi! Menghubungkan ke Studio Representative...', 'success');
        creativeBookingForm.reset();
        
        // Reset checkbox to defaults
        serviceUi.checked = true;
        serviceWeb.checked = false;
        serviceBrand.checked = false;
        calcPages.value = 5;
        urgentService.checked = false;
        updateProjectEstimate();
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

    console.log("HZX Creative Studio Web App Loaded - Created by HZXPro Studio");
});
