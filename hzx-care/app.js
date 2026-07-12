/* ==========================================================================
   HZX Care - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const CARE_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    // Donation Form Elements
    const presetBtns = document.querySelectorAll('.preset-btn');
    const donasiCustomAmount = document.getElementById('donasiCustomAmount');
    const donasiImpactText = document.getElementById('donasiImpactText');
    
    const donationCheckoutForm = document.getElementById('donationCheckoutForm');
    const donorName = document.getElementById('donorName');
    const donorPhone = document.getElementById('donorPhone');
    const donationCampaign = document.getElementById('donationCampaign');
    
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
    // Active campaign "Donasi" button clicks
    // ==========================================================================
    document.querySelectorAll('.btn-donate-now').forEach(btn => {
        btn.addEventListener('click', () => {
            const campaign = btn.getAttribute('data-campaign');
            
            // Auto fill select dropdown in donation form
            donationCampaign.value = campaign;
            
            showToast(`Kampanye "${campaign}" terpilih!`, 'success');
            
            // Smooth scroll to form
            document.getElementById('donasi').scrollIntoView({ behavior: 'smooth' });
            
            // Recalculate impact based on new selection
            updateDonationImpact();
        });
    });

    // ==========================================================================
    // Interactive Donation Impact Calculator
    // ==========================================================================
    const updateDonationImpact = () => {
        const amount = parseFloat(donasiCustomAmount.value) || 0;
        const campaign = donationCampaign.value;
        
        let impactStr = "";

        if (amount < 10000) {
            donasiImpactText.innerText = "Donasi minimal adalah Rp 10.000 untuk menyalurkan kebaikan.";
            return;
        }

        if (campaign === "Renovasi Sekolah Pelosok") {
            const units = Math.round(amount / 50000);
            if (units <= 1) {
                impactStr = `Donasi Rp ${amount.toLocaleString('id-ID')} membantu membelikan 1 sak semen atau perkakas dasar bangunan sekolah pelosok.`;
            } else {
                impactStr = `Donasi Rp ${amount.toLocaleString('id-ID')} membantu membelikan sekitar ${units} sak semen & bahan bangunan sekolah pelosok.`;
            }
        } else if (campaign === "Peduli Gizi Balita") {
            const units = Math.round(amount / 50000);
            if (units <= 1) {
                impactStr = `Donasi Rp ${amount.toLocaleString('id-ID')} membantu membelikan 1 paket susu formula & makanan bergizi stunting.`;
            } else {
                impactStr = `Donasi Rp ${amount.toLocaleString('id-ID')} membantu menyediakan sekitar ${units} paket susu & makanan bergizi balita stunting.`;
            }
        } else if (campaign === "Bantuan Tanggap Bencana") {
            const units = Math.round(amount / 100000);
            if (units <= 1) {
                impactStr = `Donasi Rp ${amount.toLocaleString('id-ID')} membantu menyediakan 1 selimut tebal & air bersih darurat bencana.`;
            } else {
                impactStr = `Donasi Rp ${amount.toLocaleString('id-ID')} membantu menyediakan sekitar ${units} paket hygiene kit & tenda darurat pengungsi.`;
            }
        }

        donasiImpactText.innerText = impactStr;
    };

    // Preset Amount Buttons Trigger
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const amt = btn.getAttribute('data-amount');
            donasiCustomAmount.value = amt;
            
            updateDonationImpact();
        });
    });

    // Custom Amount Input Listener
    donasiCustomAmount.addEventListener('input', () => {
        const val = donasiCustomAmount.value;
        
        // Remove active class from preset buttons
        presetBtns.forEach(btn => {
            if (btn.getAttribute('data-amount') === val) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        updateDonationImpact();
    });

    // Dropdown change listener to update impact string
    donationCampaign.addEventListener('change', updateDonationImpact);

    // Initial calculation
    updateDonationImpact();

    // ==========================================================================
    // Donation Form Submission & WA redirect
    // ==========================================================================
    donationCheckoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = donorName.value.trim();
        const phone = donorPhone.value.trim();
        const campaign = donationCampaign.value;
        const amount = parseFloat(donasiCustomAmount.value) || 0;
        const impact = donasiImpactText.innerText;
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap donatur wajib diisi.', 'danger');
            donorName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            donorPhone.focus();
            return;
        }
        if (amount < 10000) {
            showToast('Nominal donasi minimal Rp 10.000.', 'danger');
            donasiCustomAmount.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX CARE - KONFIRMASI DONASI*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Rincian Donatur:*\n`;
        waMsg += `- Nama Donatur: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Rincian Program Donasi:*\n`;
        waMsg += `- Program Dipilih: ${campaign}\n`;
        waMsg += `- Nominal Donasi: Rp ${amount.toLocaleString('id-ID')}\n`;
        waMsg += `- Rencana Dampak: ${impact}\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dikirimkan instruksi transfer bank resmi rekening yayasan HZX Care agar dana donasi tersebut dapat segera kami salurkan ke lapangan. Terima kasih._`;
        
        const waUrl = `https://wa.me/${CARE_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Donasi dikompilasi! Menghubungkan ke Tim Finance Yayasan...', 'success');
        donationCheckoutForm.reset();
        
        // Reset to defaults
        presetBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.preset-btn[data-amount="50000"]').classList.add('active');
        donasiCustomAmount.value = 50000;
        updateDonationImpact();
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

    console.log("HZX Care Web Portal Loaded - Created by HZXPro Studio");
});
