/* ==========================================================================
   HZX SHOP - Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State Management (In-Memory only - resets on page refresh)
    // ==========================================================================
    let cart = [];
    const COUPON_CODE = 'HZXPRODEMO';
    const DISCOUNT_PERCENT = 10;
    const SHOP_WHATSAPP = '628123456789';

    // ==========================================================================
    // Dom Elements
    // ==========================================================================
    const cartTrigger = document.getElementById('cartTrigger');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const productsGrid = document.getElementById('productsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    const cartBody = document.getElementById('cartBody');
    const cartEmptyState = document.getElementById('cartEmptyState');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartBadge = document.getElementById('cartBadge');
    
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartDiscountEl = document.getElementById('cartDiscount');
    const cartDiscountRow = document.getElementById('cartDiscountRow');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');
    
    const btnCheckout = document.getElementById('btnCheckout');
    const btnShopNow = document.getElementById('btnShopNow');
    const btnCopyCoupon = document.getElementById('btnCopyCoupon');
    const quickContactForm = document.getElementById('quickContactForm');
    
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Drawer & Navigation Handlers
    // ==========================================================================
    const toggleCart = () => {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    };

    const toggleMobileNav = () => {
        mobileNav.classList.toggle('active');
    };

    cartTrigger.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    btnShopNow.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
        document.getElementById('katalog').scrollIntoView({ behavior: 'smooth' });
    });

    mobileMenuTrigger.addEventListener('click', toggleMobileNav);
    mobileNavClose.addEventListener('click', toggleMobileNav);

    // Close mobile nav when clicking a link
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });

    // ==========================================================================
    // Category Product Filtering
    // ==========================================================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            const productCards = productsGrid.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // CSS transition trigger
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
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
                }, 200);
            });
        });
    });

    // ==========================================================================
    // In-Memory Cart Logic
    // ==========================================================================
    
    // Add product to cart
    const addToCart = (id, name, price, img) => {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price: parseFloat(price),
                img,
                quantity: 1
            });
        }
        
        renderCart();
        showToast(`"${name}" berhasil ditambahkan ke keranjang!`, 'success');
    };

    // Remove item from cart
    const removeFromCart = (id) => {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            const itemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            renderCart();
            showToast(`"${itemName}" dihapus dari keranjang.`, 'info');
        }
    };

    // Update quantity
    const updateQty = (id, change) => {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                renderCart();
            }
        }
    };

    // Format numbers as Indonesian Rupiah (IDR)
    const formatIDR = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    // Render cart items & compute pricing details
    const renderCart = () => {
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItemsCount;
        
        if (cart.length === 0) {
            cartEmptyState.style.display = 'flex';
            cartItemsList.style.display = 'none';
            cartFooter.style.display = 'none';
            return;
        }
        
        cartEmptyState.style.display = 'none';
        cartItemsList.style.display = 'flex';
        cartFooter.style.display = 'flex';
        
        // Render List items
        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img-wrapper">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                </div>
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${formatIDR(item.price)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="btn-qty btn-minus" data-id="${item.id}"><i data-lucide="minus"></i></button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="btn-qty btn-plus" data-id="${item.id}"><i data-lucide="plus"></i></button>
                        </div>
                        <button class="btn-remove-item" data-id="${item.id}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Re-trigger Lucide Icons inside the new HTML
        lucide.createIcons();
        
        // Bind listeners to buttons in list
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', () => updateQty(btn.getAttribute('data-id'), -1));
        });
        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', () => updateQty(btn.getAttribute('data-id'), 1));
        });
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
        });
        
        // Compute Totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Automatic Coupon applied (HZXPRODEMO - 10% discount)
        const discountAmount = subtotal * (DISCOUNT_PERCENT / 100);
        const grandTotal = subtotal - discountAmount;
        
        cartSubtotalEl.innerText = formatIDR(subtotal);
        cartDiscountEl.innerText = `-${formatIDR(discountAmount)}`;
        cartTotalEl.innerText = formatIDR(grandTotal);
    };

    // Attach listener to all catalogue "Tambah ke Keranjang" buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const img = button.getAttribute('data-img');
            addToCart(id, name, price, img);
        });
    });

    // ==========================================================================
    // Checkout via WhatsApp Message Constructor
    // ==========================================================================
    btnCheckout.addEventListener('click', () => {
        if (cart.length === 0) return;
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = subtotal * (DISCOUNT_PERCENT / 100);
        const grandTotal = subtotal - discountAmount;
        
        // Create text representation
        let waMessage = `*HZX SHOP - REKAP PESANAN*\n`;
        waMessage += `==========================\n\n`;
        
        cart.forEach((item, index) => {
            waMessage += `${index + 1}. *${item.name}*\n`;
            waMessage += `   _Jumlah:_ ${item.quantity}x\n`;
            waMessage += `   _Harga:_ ${formatIDR(item.price)} (Total: ${formatIDR(item.price * item.quantity)})\n\n`;
        });
        
        waMessage += `==========================\n`;
        waMessage += `*Subtotal:* ${formatIDR(subtotal)}\n`;
        waMessage += `*Kupon:* ${COUPON_CODE} (Diskon ${DISCOUNT_PERCENT}%)\n`;
        waMessage += `*Total Pembayaran:* ${formatIDR(grandTotal)}\n\n`;
        waMessage += `--------------------------\n`;
        waMessage += `Mohon segera diproses pesanan saya ini, terima kasih! 🙏`;
        
        // WhatsApp link creation
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
        
        // Open WhatsApp in a new tab
        window.open(waUrl, '_blank');
        showToast('Membuka WhatsApp untuk menyelesaikan pesanan Anda!', 'info');
    });

    // ==========================================================================
    // Coupon Clipboard Copy Trigger
    // ==========================================================================
    btnCopyCoupon.addEventListener('click', () => {
        const copyTextEl = document.getElementById('copyText');
        const copyIconEl = document.getElementById('copyIcon');
        
        navigator.clipboard.writeText(COUPON_CODE).then(() => {
            showToast('Kode kupon berhasil disalin ke clipboard!', 'success');
            
            // Visual feedback on button
            copyTextEl.innerText = 'Tersalin!';
            btnCopyCoupon.style.backgroundColor = 'var(--secondary)';
            copyIconEl.setAttribute('data-lucide', 'check');
            lucide.createIcons();
            
            setTimeout(() => {
                copyTextEl.innerText = 'Salin Kode';
                btnCopyCoupon.style.backgroundColor = 'var(--primary)';
                copyIconEl.setAttribute('data-lucide', 'copy');
                lucide.createIcons();
            }, 2500);
        }).catch(err => {
            showToast('Gagal menyalin kode kupon secara otomatis.', 'danger');
        });
    });

    // ==========================================================================
    // Quick Contact Form Submission to WhatsApp
    // ==========================================================================
    quickContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('formName').value;
        const msg = document.getElementById('formMessage').value;
        
        let waMessage = `*HZX SHOP - HUBUNGI KAMI*\n`;
        waMessage += `-------------------------\n`;
        waMessage += `*Nama:* ${name}\n`;
        waMessage += `*Pesan:* ${msg}\n\n`;
        waMessage += `-------------------------\n`;
        waMessage += `_Dikirim dari Website Portfolio HZX SHOP_`;
        
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMessage)}`;
        
        window.open(waUrl, '_blank');
        quickContactForm.reset();
        showToast('Pesan dikirim! Mengarahkan ke WhatsApp...', 'success');
    });

    // ==========================================================================
    // Dynamic Opening Hours Status Badge
    // ==========================================================================
    const checkStoreStatus = () => {
        // HZX SHOP Open hours: Everyday 10:00 to 21:00 (10 AM to 9 PM)
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        const openHour = 10;
        const closeHour = 21;
        
        // Calculate status
        let isOpen = false;
        if (currentHour > openHour && currentHour < closeHour) {
            isOpen = true;
        } else if (currentHour === openHour) {
            isOpen = currentMinute >= 0;
        } else if (currentHour === closeHour) {
            isOpen = currentMinute === 0;
        }
        
        if (isOpen) {
            statusBadge.className = 'status-badge open';
            statusText.innerText = 'BUKA SEKARANG';
        } else {
            statusBadge.className = 'status-badge closed';
            statusText.innerText = 'TUTUP SEKARANG';
        }
    };
    
    // Initial run
    checkStoreStatus();
    // Refresh status check every 30 seconds
    setInterval(checkStoreStatus, 30000);

    // ==========================================================================
    // Toast Notification System helper
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
        closeBtn.addEventListener('click', () => {
            dismissToast(toast);
        });
        
        // Auto dismiss after 3.5 seconds
        setTimeout(() => {
            dismissToast(toast);
        }, 3500);
    };
    
    const dismissToast = (toast) => {
        toast.style.animation = 'toast-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    };

    // Initial log to console to verify setup
    console.log("HZX SHOP Portfolio Web Application Loaded - Created by HZXPro Studio");
});
