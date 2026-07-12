/* ==========================================================================
   HZX Marketplace - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const MARKET_WHATSAPP = '628123456789';
    let cartState = [];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    // Cart Drawer Controls
    const navCartBtn = document.getElementById('navCartBtn');
    const cartDrawerClose = document.getElementById('cartDrawerClose');
    const cartDrawerBackdrop = document.getElementById('cartDrawerBackdrop');
    const cartDrawer = document.getElementById('cartDrawer');
    
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartEmptyState = document.getElementById('cartEmptyState');
    const cartDrawerList = document.getElementById('cartDrawerList');
    const cartDrawerTotal = document.getElementById('cartDrawerTotal');
    const cartDrawerFooter = document.getElementById('cartDrawerFooter');
    
    // Filters & Search
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    const navbarSearchInput = document.getElementById('navbarSearchInput');
    
    // Checkout Form
    const cartCheckoutForm = document.getElementById('cartCheckoutForm');
    const checkoutName = document.getElementById('checkoutName');
    const checkoutPhone = document.getElementById('checkoutPhone');
    const checkoutAddress = document.getElementById('checkoutAddress');
    
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
    // Cart Drawer Open/Close controls
    // ==========================================================================
    const openCartDrawer = () => {
        cartDrawer.classList.add('active');
        cartDrawerBackdrop.classList.add('active');
    };
    
    const closeCartDrawer = () => {
        cartDrawer.classList.remove('active');
        cartDrawerBackdrop.classList.remove('active');
    };

    navCartBtn.addEventListener('click', openCartDrawer);
    cartDrawerClose.addEventListener('click', closeCartDrawer);
    cartDrawerBackdrop.addEventListener('click', closeCartDrawer);

    // ==========================================================================
    // Product List Filtering & Broad Search Engine
    // ==========================================================================
    
    // Category Tabs Filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterProducts(category, navbarSearchInput.value.toLowerCase().trim());
        });
    });

    // Search input listener
    navbarSearchInput.addEventListener('input', () => {
        // Active selected category
        const activeBtn = document.querySelector('.category-btn.active');
        const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
        const query = navbarSearchInput.value.toLowerCase().trim();
        
        filterProducts(category, query);
    });

    const filterProducts = (category, query) => {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardName = card.getAttribute('data-name').toLowerCase();
            const cardVendor = card.getAttribute('data-vendor').toLowerCase();
            
            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesQuery = !query || cardName.includes(query) || cardVendor.includes(query);
            
            if (matchesCategory && matchesQuery) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Vendor card "Lihat Produk" Search Binder
    document.querySelectorAll('.btn-visit-store').forEach(btn => {
        btn.addEventListener('click', () => {
            const storeName = btn.getAttribute('data-search');
            
            navbarSearchInput.value = storeName;
            
            // Set category tab active to all
            categoryBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('.category-btn[data-category="all"]').classList.add('active');
            
            filterProducts('all', storeName.toLowerCase());
            
            showToast(`Menampilkan produk dari "${storeName}"`, 'success');
            
            // Smooth scroll to product catalog section
            document.getElementById('produk').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // In-Memory Shopping Cart State Engine
    // ==========================================================================
    
    // Add item to cart state
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const vendor = btn.getAttribute('data-vendor');
            
            const existing = cartState.find(item => item.id === id);
            
            if (existing) {
                existing.qty++;
            } else {
                cartState.push({
                    id: id,
                    name: name,
                    price: price,
                    vendor: vendor,
                    qty: 1
                });
            }
            
            showToast(`"${name}" ditambahkan ke keranjang!`, 'success');
            renderCart();
        });
    });

    // Remove item from cart state
    const removeItem = (id) => {
        const index = cartState.findIndex(item => item.id === id);
        if (index > -1) {
            cartState[index].qty--;
            if (cartState[index].qty <= 0) {
                cartState.splice(index, 1);
            }
        }
        renderCart();
    };

    // Render cart elements in slide drawer
    const renderCart = () => {
        // Calculate total quantity
        const totalQty = cartState.reduce((sum, item) => sum + item.qty, 0);
        cartCountBadge.innerText = totalQty;

        if (cartState.length === 0) {
            cartEmptyState.style.display = 'flex';
            cartDrawerFooter.style.display = 'none';
            cartDrawerList.innerHTML = '';
            return;
        }

        cartEmptyState.style.display = 'none';
        cartDrawerFooter.style.display = 'block';

        // Group items by vendor store name
        const grouped = {};
        cartState.forEach(item => {
            if (!grouped[item.vendor]) {
                grouped[item.vendor] = [];
            }
            grouped[item.vendor].push(item);
        });

        // Generate HTML grid
        cartDrawerList.innerHTML = '';
        let subtotal = 0;

        for (const vendorName in grouped) {
            const groupCard = document.createElement('div');
            groupCard.className = 'cart-vendor-group';
            
            let groupHtml = `<div class="cart-vendor-title"><i data-lucide="store"></i> Toko: ${vendorName}</div>`;
            
            grouped[vendorName].forEach(item => {
                const itemCost = item.price * item.qty;
                subtotal += itemCost;
                
                groupHtml += `
                    <div class="cart-item-row" data-id="${item.id}">
                        <div class="cart-item-info">
                            <h5>${item.name}</h5>
                            <span>Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</span>
                        </div>
                        <div class="cart-item-actions">
                            <span class="cart-item-price">Rp ${itemCost.toLocaleString('id-ID')}</span>
                            <button class="btn-remove-item" data-id="${item.id}"><i data-lucide="minus"></i></button>
                        </div>
                    </div>
                `;
            });
            
            groupCard.innerHTML = groupHtml;
            cartDrawerList.appendChild(groupCard);
        }

        cartDrawerTotal.innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
        lucide.createIcons();

        // Re-bind remove minus button clicks
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                removeItem(id);
            });
        });
    };

    // ==========================================================================
    // Checkout Submission & WhatsApp Redirection compiler
    // ==========================================================================
    cartCheckoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = checkoutName.value.trim();
        const phone = checkoutPhone.value.trim();
        const address = checkoutAddress.value.trim();
        
        // Simple Form Validations
        if (!name) {
            showToast('Nama Lengkap penerima wajib diisi.', 'danger');
            checkoutName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            checkoutPhone.focus();
            return;
        }
        if (!address || address.length < 15) {
            showToast('Tuliskan alamat pengiriman secara lengkap minimal 15 karakter.', 'danger');
            checkoutAddress.focus();
            return;
        }
        if (cartState.length === 0) {
            showToast('Keranjang belanja Anda masih kosong.', 'danger');
            return;
        }

        // Group items by vendor store name for WhatsApp invoice compile
        const grouped = {};
        cartState.forEach(item => {
            if (!grouped[item.vendor]) {
                grouped[item.vendor] = [];
            }
            grouped[item.vendor].push(item);
        });

        // Build WhatsApp message content
        let waMsg = `*HZX HUB - CHECKOUT MULTI-VENDOR*\n`;
        waMsg += `==============================================\n\n`;
        waMsg += `*Rincian Pembeli & Pengiriman:*\n`;
        waMsg += `- Nama Penerima: ${name}\n`;
        waMsg += `- Nomor WhatsApp: ${phone}\n`;
        waMsg += `- Alamat Kirim: ${address}\n\n`;
        
        waMsg += `*Rincian Barang Belanjaan:*\n`;
        waMsg += `----------------------------------------------\n`;
        
        let grandTotal = 0;
        for (const vendorName in grouped) {
            waMsg += `[TOKO MITRA: ${vendorName}]\n`;
            grouped[vendorName].forEach(item => {
                const cost = item.price * item.qty;
                grandTotal += cost;
                waMsg += `- ${item.qty}x ${item.name} (Rp ${cost.toLocaleString('id-ID')})\n`;
            });
            waMsg += `\n`;
        }
        waMsg += `----------------------------------------------\n`;
        waMsg += `*TOTAL TAGIHAN:* Rp ${grandTotal.toLocaleString('id-ID')}\n\n`;
        
        waMsg += `==============================================\n`;
        waMsg += `_Mohon bantu dibuatkan invoice transaksi reksa bersama (escrow) dan dikoordinasikan pengiriman barangnya ke masing-masing pihak vendor mitra. Terima kasih._`;
        
        const waUrl = `https://wa.me/${MARKET_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Checkout dikompilasi! Menghubungkan ke Admin Escrow...', 'success');
        
        // Reset states
        cartState = [];
        renderCart();
        cartCheckoutForm.reset();
        closeCartDrawer();
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

    console.log("HZX Hub Marketplace Web App Loaded - Created by HZXPro Studio");
});
