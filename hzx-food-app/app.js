/* ==========================================================================
   HZX Food - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    const FOOD_WHATSAPP = '628123456789';
    let cart = [];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const tabItems = document.querySelectorAll('.tab-item');
    const screens = document.querySelectorAll('.screen');
    
    const foodGridList = document.getElementById('food-grid-list');
    const foodSearchInput = document.getElementById('foodSearchInput');
    const categoryBtns = document.querySelectorAll('.category-circle-btn');
    
    // Cart Elements
    const badgeHomeCart = document.getElementById('badge-home-cart');
    const badgeTabCart = document.getElementById('badge-tab-cart');
    const foodCartEmpty = document.getElementById('food-cart-empty');
    const foodCartList = document.getElementById('food-cart-list');
    const foodCartFooter = document.getElementById('food-cart-footer');
    const foodCartTotal = document.getElementById('food-cart-total');
    
    const foodCheckoutForm = document.getElementById('foodCheckoutForm');
    const foodOrderName = document.getElementById('foodOrderName');
    const foodOrderAddress = document.getElementById('foodOrderAddress');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Tab Navigation Screen Switcher
    // ==========================================================================
    const switchScreen = (screenId) => {
        screens.forEach(s => s.classList.remove('active'));
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        tabItems.forEach(t => {
            if (t.getAttribute('data-screen') === screenId) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });

        // If switching to cart, render items
        if (screenId === 'screen-cart') {
            renderCartList();
        }
    };

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const screenId = tab.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });

    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => switchScreen('screen-home'));
    });

    document.getElementById('btn-home-cart').addEventListener('click', () => switchScreen('screen-cart'));

    // ==========================================================================
    // Category Filter & Text Search
    // ==========================================================================
    const filterFoodItems = () => {
        const query = foodSearchInput.value.toLowerCase().trim();
        const activeCategoryBtn = document.querySelector('.category-circle-btn.active');
        const category = activeCategoryBtn.getAttribute('data-category');
        
        const cards = foodGridList.querySelectorAll('.food-card');
        
        cards.forEach(card => {
            const name = card.getAttribute('data-name').toLowerCase();
            const cardCat = card.getAttribute('data-category');
            
            const matchQuery = name.includes(query);
            const matchCategory = (category === 'all' || cardCat === category);
            
            if (matchQuery && matchCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Category button clicks
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterFoodItems();
        });
    });

    // Search input change
    foodSearchInput.addEventListener('input', filterFoodItems);

    // ==========================================================================
    // Cart operations
    // ==========================================================================
    document.querySelectorAll('.btn-add-food').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price')) || 0;
            
            // Check if exists
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }
            
            updateCartBadges();
            showToast(`"${name}" masuk keranjang!`, 'success');
        });
    });

    const updateCartBadges = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        badgeHomeCart.innerText = totalItems;
        badgeTabCart.innerText = totalItems;
        
        // Hide badge if 0
        if (totalItems === 0) {
            badgeHomeCart.style.display = 'none';
            badgeTabCart.style.display = 'none';
        } else {
            badgeHomeCart.style.display = 'flex';
            badgeTabCart.style.display = 'flex';
        }
    };

    const renderCartList = () => {
        foodCartList.innerHTML = '';
        
        if (cart.length === 0) {
            foodCartEmpty.style.display = 'flex';
            foodCartFooter.style.display = 'none';
            return;
        }
        
        foodCartEmpty.style.display = 'none';
        foodCartFooter.style.display = 'block';
        
        let totalCost = 0;
        
        cart.forEach(item => {
            const itemCost = item.price * item.qty;
            totalCost += itemCost;
            
            const cardHtml = `
                <div class="cart-item-card" data-id="${item.id}">
                    <div class="cart-item-details">
                        <h5>${item.name}</h5>
                        <span>Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</span>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-cost">Rp ${itemCost.toLocaleString('id-ID')}</span>
                        <button class="btn-remove-food" data-id="${item.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `;
            foodCartList.insertAdjacentHTML('beforeend', cardHtml);
        });
        
        foodCartTotal.innerText = `Rp ${totalCost.toLocaleString('id-ID')}`;
        lucide.createIcons();
        
        // Bind remove events
        foodCartList.querySelectorAll('.btn-remove-food').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = cart.find(item => item.id === id)?.name || '';
                
                // Remove from array
                cart = cart.filter(item => item.id !== id);
                
                updateCartBadges();
                renderCartList();
                showToast(`"${name}" dihapus.`, 'danger');
            });
        });
    };

    // ==========================================================================
    // Food Checkout Submission & WA redirect
    // ==========================================================================
    foodCheckoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = foodOrderName.value.trim();
        const address = foodOrderAddress.value.trim();
        
        if (cart.length === 0) {
            showToast('Keranjang belanja Anda kosong.', 'danger');
            return;
        }
        if (!name) {
            showToast('Nama penerima wajib diisi.', 'danger');
            foodOrderName.focus();
            return;
        }
        if (!address) {
            showToast('Alamat pengiriman wajib diisi.', 'danger');
            foodOrderAddress.focus();
            return;
        }

        // Build items invoice
        let itemsInvoice = "";
        let totalCost = 0;
        
        cart.forEach(item => {
            const cost = item.price * item.qty;
            totalCost += cost;
            itemsInvoice += `- ${item.qty}x ${item.name} (Rp ${cost.toLocaleString('id-ID')})\n`;
        });

        // Compile WhatsApp text template
        let waMsg = `*HZX FOOD - PESANAN DELIVERI BARU*\n`;
        waMsg += `=========================================\n\n`;
        waMsg += `*Rincian Pengiriman:*\n`;
        waMsg += `- Nama Penerima: ${name}\n`;
        waMsg += `- Alamat Tujuan: ${address}\n\n`;
        
        waMsg += `*Menu Makanan Dipesan:*\n`;
        waMsg += itemsInvoice;
        waMsg += `\n*Total Pembayaran:* Rp ${totalCost.toLocaleString('id-ID')}\n\n`;
        
        waMsg += `=========================================\n`;
        waMsg += `_Mohon segera diproses pesanan makanan tersebut dan dikirimkan kurir pengantar. Terima kasih._`;

        const waUrl = `https://wa.me/${FOOD_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        window.open(waUrl, '_blank');
        
        showToast('Pesanan terkompilasi! Menghubungkan ke Dapur HZX Food...', 'success');
        
        // Reset states
        cart = [];
        updateCartBadges();
        foodCheckoutForm.reset();
        
        // Back to home screen
        setTimeout(() => switchScreen('screen-home'), 800);
    });

    updateCartBadges();

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
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => dismissToast(toast));
        
        setTimeout(() => dismissToast(toast), 3200);
    };

    const dismissToast = (toast) => {
        toast.style.animation = 'toast-out 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    };

    console.log("HZX Food Mobile App Loaded - Created by HZXPro Studio");
});
