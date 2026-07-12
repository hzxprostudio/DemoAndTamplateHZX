/* ==========================================================================
   HZX Club - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const CLUB_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    // Forum Simulation
    const forumPostForm = document.getElementById('forumPostForm');
    const threadTitle = document.getElementById('threadTitle');
    const threadCategory = document.getElementById('threadCategory');
    const threadAuthor = document.getElementById('threadAuthor');
    
    const forumFilterTabs = document.querySelectorAll('.forum-filter-tab');
    const forumFeedContainer = document.getElementById('forumFeedContainer');
    
    // Club Registration Form
    const clubSignupForm = document.getElementById('clubSignupForm');
    const memberName = document.getElementById('memberName');
    const memberPhone = document.getElementById('memberPhone');
    const memberTier = document.getElementById('memberTier');
    const memberMotivation = document.getElementById('memberMotivation');
    
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
    // Forum Feed Tab Filtering
    // ==========================================================================
    forumFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            forumFilterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            filterForumFeed(filter);
        });
    });

    const filterForumFeed = (filter) => {
        const feedCards = forumFeedContainer.querySelectorAll('.feed-card');
        feedCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filter === 'all' || cardCategory === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // ==========================================================================
    // In-Memory Thread Post Simulator
    // ==========================================================================
    forumPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = threadTitle.value.trim();
        const category = threadCategory.value;
        const author = threadAuthor.value.trim();
        
        if (!title || !author) {
            showToast('Judul dan nama wajib diisi.', 'danger');
            return;
        }

        // Create new feed card element
        const card = document.createElement('div');
        card.className = 'feed-card';
        card.setAttribute('data-category', category);
        
        card.innerHTML = `
            <div class="feed-header">
                <span class="feed-tag">${category}</span>
                <span class="feed-author">${author} (Baru)</span>
            </div>
            <h4 class="feed-title">${title}</h4>
            <div class="feed-footer">
                <span><i data-lucide="thumbs-up"></i> 1 Likes</span>
                <span><i data-lucide="message-square"></i> 0 Balasan</span>
            </div>
        `;
        
        // Prepend (add to top) to container
        forumFeedContainer.insertBefore(card, forumFeedContainer.firstChild);
        
        // Re-initialize Lucide Icons for thumbs/message-square in new card
        lucide.createIcons();
        
        // Reset form & show toast
        forumPostForm.reset();
        showToast('Thread simulasi berhasil diposting di forum!', 'success');
        
        // Make sure the active tab aligns with new post
        const activeTab = document.querySelector('.forum-filter-tab.active');
        const activeFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';
        filterForumFeed(activeFilter);
    });

    // ==========================================================================
    // Pricing packages click selector binding
    // ==========================================================================
    document.querySelectorAll('.btn-signup-club').forEach(btn => {
        btn.addEventListener('click', () => {
            const tier = btn.getAttribute('data-tier');
            
            // Auto fill select dropdown in signup form
            memberTier.value = tier;
            
            showToast(`Paket "${tier}" terpilih!`, 'success');
            
            // Smooth scroll to form
            document.getElementById('gabung').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // Club Registration WhatsApp Form Compiler
    // ==========================================================================
    clubSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = memberName.value.trim();
        const phone = memberPhone.value.trim();
        const tier = memberTier.value;
        const motivation = memberMotivation.value.trim();
        
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
        if (!tier) {
            showToast('Pilih tingkat keanggotaan club.', 'danger');
            memberTier.focus();
            return;
        }
        if (!motivation || motivation.length < 15) {
            showToast('Ceritakan alasan motivasi bergabung minimal 15 karakter.', 'danger');
            memberMotivation.focus();
            return;
        }

        // Build WhatsApp message content
        let waMsg = `*HZX CLUB - APLIKASI ANGGOTA BARU*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Rincian Pendaftar:*\n`;
        waMsg += `- Nama Pelamar: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n\n`;
        
        waMsg += `*Detail Keanggotaan:*\n`;
        waMsg += `- Paket Dipilih: ${tier}\n\n`;
        
        waMsg += `*Motivasi Gabung Club:*\n`;
        waMsg += `"${motivation}"\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon segera dijadwalkan wawancara singkat / review keselarasan profil oleh tim pengurus HZX Club. Terima kasih._`;
        
        const waUrl = `https://wa.me/${CLUB_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Aplikasi dikompilasi! Menghubungkan ke Club Representative...', 'success');
        clubSignupForm.reset();
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

    console.log("HZX Club Community Web App Loaded - Created by HZXPro Studio");
});
