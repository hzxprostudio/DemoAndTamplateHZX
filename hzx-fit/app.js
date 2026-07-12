/* ==========================================================================
   HZX Fit - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const GYM_WHATSAPP = '628123456789';

    // Daily Class Schedule Array Database
    const CLASSES_SCHEDULE = [
        { day: "Senin", name: "Strength Training", time: "08:00 - 09:30", coach: "Coach Randy" },
        { day: "Senin", name: "Muay Thai Class", time: "16:00 - 17:30", coach: "Coach Diaz" },
        { day: "Selasa", name: "Yoga Flow", time: "09:00 - 10:30", coach: "Coach Sarah" },
        { day: "Selasa", name: "Zumba Dance", time: "19:00 - 20:30", coach: "Coach Cindy" },
        { day: "Rabu", name: "CrossFit Cardio", time: "08:00 - 09:30", coach: "Coach Randy" },
        { day: "Rabu", name: "Muay Thai Class", time: "16:00 - 17:30", coach: "Coach Diaz" },
        { day: "Kamis", name: "Yoga Flow", time: "09:00 - 10:30", coach: "Coach Sarah" },
        { day: "Kamis", name: "Body Combat", time: "19:00 - 20:30", coach: "Coach Cindy" },
        { day: "Jumat", name: "Strength Training", time: "08:00 - 09:30", coach: "Coach Randy" },
        { day: "Jumat", name: "HIIT Cardio", time: "16:00 - 17:30", coach: "Coach Diaz" },
        { day: "Sabtu", name: "Weekend Bootcamp", time: "09:00 - 11:00", coach: "Coach Randy & Diaz" }
    ];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const dayTabs = document.querySelectorAll('.day-tab');
    const classesGrid = document.getElementById('classesGrid');
    
    const gymSignupForm = document.getElementById('gymSignupForm');
    const memberName = document.getElementById('memberName');
    const memberPhone = document.getElementById('memberPhone');
    const memberPlan = document.getElementById('memberPlan');
    const memberHealth = document.getElementById('memberHealth');
    
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
    // Class Schedule render and tab filtering
    // ==========================================================================
    const renderClasses = (selectedDay) => {
        classesGrid.innerHTML = '';
        const filtered = CLASSES_SCHEDULE.filter(c => c.day === selectedDay);
        
        if (filtered.length === 0) {
            classesGrid.innerHTML = `<p style="text-align:center; color:var(--text-secondary); grid-column:span 2;">Tidak ada kelas untuk hari ${selectedDay}.</p>`;
            return;
        }

        filtered.forEach(c => {
            const card = document.createElement('div');
            card.className = 'class-card';
            card.innerHTML = `
                <div class="class-info">
                    <span class="class-time"><i data-lucide="clock"></i> ${c.time}</span>
                    <h3>${c.name}</h3>
                    <span class="class-coach">${c.coach}</span>
                </div>
                <div class="class-icon-btn">
                    <i data-lucide="dumbbell"></i>
                </div>
            `;
            classesGrid.appendChild(card);
        });
        lucide.createIcons();
    };

    // Bind Day tab click events
    dayTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            dayTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const selectedDay = tab.getAttribute('data-day');
            renderClasses(selectedDay);
        });
    });

    // Initial render (Senin)
    renderClasses("Senin");

    // ==========================================================================
    // Pricing plan button click events
    // ==========================================================================
    document.querySelectorAll('.btn-signup-pax').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            
            // Auto fill select dropdown in signup form
            memberPlan.value = plan;
            
            showToast(`Paket "${plan}" terpilih!`, 'success');
            
            // Smooth scroll to form
            document.getElementById('daftar').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // Registration Form Submission & WA redirect
    // ==========================================================================
    gymSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = memberName.value.trim();
        const phone = memberPhone.value.trim();
        const plan = memberPlan.value;
        const health = memberHealth.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap wajib diisi.', 'danger');
            memberName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            memberPhone.focus();
            return;
        }
        if (!plan) {
            showToast('Pilih salah satu paket membership.', 'danger');
            memberPlan.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX FIT - PENDAFTARAN ANGGOTA BARU*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Rincian Pendaftar:*\n`;
        waMsg += `- Nama Lengkap: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Rincian Keanggotaan:*\n`;
        waMsg += `- Paket Terpilih: ${plan}\n\n`;
        
        if (health) {
            waMsg += `*Riwayat Medis / Cedera:*\n`;
            waMsg += `"${health}"\n\n`;
        }
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dijadwalkan sesi kunjungan perdana kami ke HZX Fit Center untuk fitting, orientasi alat, dan pengambilan kartu member. Terima kasih._`;
        
        const waUrl = `https://wa.me/${GYM_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pendaftaran dikompilasi! Menghubungkan ke Membership Representative...', 'success');
        gymSignupForm.reset();
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

    console.log("HZX Fit Gym Web App Loaded - Created by HZXPro Studio");
});
