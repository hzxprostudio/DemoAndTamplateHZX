/* ==========================================================================
   HZX Study - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const SHOP_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const programsGrid = document.getElementById('programsGrid');
    
    const enrollmentForm = document.getElementById('enrollmentForm');
    const studentName = document.getElementById('studentName');
    const studentLevel = document.getElementById('studentLevel');
    const studentGrade = document.getElementById('studentGrade');
    const selectedProgram = document.getElementById('selectedProgram');
    const parentName = document.getElementById('parentName');
    const parentPhone = document.getElementById('parentPhone');
    const enrollmentNotes = document.getElementById('enrollmentNotes');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Mobile Navigation Drawer Toggle
    // ==========================================================================
    const toggleMobileNav = () => mobileNav.classList.toggle('active');
    
    mobileMenuTrigger.addEventListener('click', toggleMobileNav);
    mobileNavClose.addEventListener('click', toggleMobileNav);
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // ==========================================================================
    // Program Level Filtering Logic
    // ==========================================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active states on button group
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            const programCards = programsGrid.querySelectorAll('.program-card');
            
            programCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Add soft scale out visual transition
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

    // ==========================================================================
    // Card program selection linkage
    // ==========================================================================
    document.querySelectorAll('.btn-select-program').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const progName = btn.getAttribute('data-prog-name');
            selectedProgram.value = progName;
            
            // Highlight dropdown borders momentarily
            selectedProgram.style.borderColor = 'var(--primary)';
            
            // Scroll down to the registration form smoothly
            document.getElementById('daftar').scrollIntoView({ behavior: 'smooth' });
            showToast(`Program "${progName}" dipilih! Silakan lengkapi data pendaftaran.`, 'info');
            
            setTimeout(() => {
                selectedProgram.style.borderColor = 'var(--border-color)';
            }, 1500);
        });
    });

    // ==========================================================================
    // Registration Submission & WhatsApp Formatting
    // ==========================================================================
    enrollmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sName = studentName.value.trim();
        const sLevel = studentLevel.value;
        const sGrade = studentGrade.value.trim();
        const prog = selectedProgram.value;
        const pName = parentName.value.trim();
        const pPhone = parentPhone.value.trim();
        const notes = enrollmentNotes.value.trim();
        
        // Simple Form Validations
        if (!sName) {
            showToast('Nama lengkap siswa wajib diisi.', 'danger');
            studentName.focus();
            return;
        }
        if (!sLevel) {
            showToast('Pilih jenjang sekolah siswa.', 'danger');
            studentLevel.focus();
            return;
        }
        if (!sGrade) {
            showToast('Kelas saat ini wajib diisi.', 'danger');
            studentGrade.focus();
            return;
        }
        if (!prog) {
            showToast('Pilih program bimbel yang akan diikuti.', 'danger');
            selectedProgram.focus();
            return;
        }
        if (!pName) {
            showToast('Nama orang tua / wali wajib diisi.', 'danger');
            parentName.focus();
            return;
        }
        if (!pPhone || pPhone.length < 9) {
            showToast('Masukkan nomor WhatsApp wali murid yang aktif.', 'danger');
            parentPhone.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX STUDY - PENDAFTARAN SISWA BARU*\n`;
        waMsg += `======================================\n\n`;
        waMsg += `*Data Calon Siswa:*\n`;
        waMsg += `- Nama Lengkap: ${sName}\n`;
        waMsg += `- Jenjang Sekolah: ${sLevel} (${sGrade})\n`;
        waMsg += `- Program Pilihan: ${prog}\n\n`;
        
        waMsg += `*Data Wali Murid (Orang Tua):*\n`;
        waMsg += `- Nama Orang Tua: ${pName}\n`;
        waMsg += `- Nomor WhatsApp: ${pPhone}\n\n`;
        
        if (notes) {
            waMsg += `*Catatan Keluhan / Permintaan khusus:*\n`;
            waMsg += `"${notes}"\n\n`;
        }
        
        waMsg += `======================================\n`;
        waMsg += `_Mohon diinformasikan biaya pendaftaran awal beserta administrasi penempatan jadwal murid. Terima kasih._`;
        
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pendaftaran diajukan! Mengarahkan Anda ke WhatsApp Akademik...', 'success');
        enrollmentForm.reset();
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

    console.log("HZX Study Academic Web App Loaded - Created by HZXPro Studio");
});
