/* ==========================================================================
   HZX Coffee Dashboard - Interactive POS & Admin Panel Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons initially
    lucide.createIcons();

    // ==========================================================================
    // IN-MEMORY DATA STATES
    // ==========================================================================
    
    // Cafe Products Mock Database
    let PRODUCTS = [
        { id: 1, name: "HZX Espresso Double", category: "Kopi", price: 18000, stock: 45, image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=300&auto=format&fit=crop" },
        { id: 2, name: "Matcha Latte Ice", category: "Non-Kopi", price: 24000, stock: 32, image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=300&auto=format&fit=crop" },
        { id: 3, name: "Caramel Macchiato", category: "Kopi", price: 28000, stock: 8, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=300&auto=format&fit=crop" },
        { id: 4, name: "Butter Croissant", category: "Makanan", price: 22000, stock: 18, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300&auto=format&fit=crop" },
        { id: 5, name: "Chamomile Hot Tea", category: "Non-Kopi", price: 20000, stock: 22, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=300&auto=format&fit=crop" },
        { id: 6, name: "Choco Fudge Waffle", category: "Makanan", price: 26000, stock: 0, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=300&auto=format&fit=crop" }
    ];

    // Cafe Completed Transactions History
    let TRANSACTIONS = [
        { 
            id: "TX-10001", 
            time: "12/07/2026 08:15", 
            total: 46200, // 42000 + 10% tax
            cash: 50000, 
            change: 3800, 
            items: [
                { id: 1, name: "HZX Espresso Double", qty: 1, price: 18000 }, 
                { id: 2, name: "Matcha Latte Ice", qty: 1, price: 24000 }
            ] 
        },
        { 
            id: "TX-10002", 
            time: "12/07/2026 09:02", 
            total: 85800, // 78000 + 10% tax
            cash: 100000, 
            change: 14200, 
            items: [
                { id: 3, name: "Caramel Macchiato", qty: 2, price: 28000 }, 
                { id: 4, name: "Butter Croissant", qty: 1, price: 22000 }
            ] 
        },
        { 
            id: "TX-10003", 
            time: "12/07/2026 09:40", 
            total: 22000, // 20000 + 10% tax
            cash: 50000, 
            change: 28000, 
            items: [
                { id: 5, name: "Chamomile Hot Tea", qty: 1, price: 20000 }
            ] 
        }
    ];

    // Current Cashier Cart
    let CART = [];

    // Dashboard Analytics Weekly Sales Chart.js Object
    let salesChartInstance = null;

    // ==========================================================================
    // DOM Elements - Login & Page wrapper
    // ==========================================================================
    const loginWrapper = document.getElementById('loginWrapper');
    const appWrapper = document.getElementById('appWrapper');
    const loginForm = document.getElementById('loginForm');
    const loginUser = document.getElementById('loginUser');
    const loginPass = document.getElementById('loginPass');
    const btnLogout = document.getElementById('btnLogout');
    const liveClock = document.getElementById('liveClock');
    const topbarTitle = document.getElementById('topbarTitle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.dashboard-section');
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // SESSION LOGIN & CLOCK LOGIC
    // ==========================================================================
    
    // Live Clock indicator in Header
    const startLiveClock = () => {
        setInterval(() => {
            const now = new Date();
            const dayNum = now.getDate();
            const yearNum = now.getFullYear();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            const monthText = MONTH_NAMES[now.getMonth()];
            
            liveClock.innerText = `${dayNum} ${monthText} ${yearNum}, ${hours}:${minutes}:${seconds} WIB`;
        }, 1000);
    };

    // Form login submission dummy validation
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = loginUser.value.trim();
        const pass = loginPass.value;
        
        if (user === 'admin' && pass === 'password') {
            loginWrapper.style.display = 'none';
            appWrapper.style.display = 'grid';
            
            startLiveClock();
            showToast('Selamat datang! Login Administrator berhasil.', 'success');
            
            // Render Initial Views
            initDashboardSummary();
            initPOSView();
            initProductCrudView();
            initReportsView();
        } else {
            showToast('Username atau password salah.', 'danger');
            loginPass.value = '';
            loginPass.focus();
        }
    });

    // Session Logout
    btnLogout.addEventListener('click', () => {
        appWrapper.style.display = 'none';
        loginWrapper.style.display = 'flex';
        loginUser.value = '';
        loginPass.value = '';
        CART = [];
        showToast('Anda telah keluar dari sistem HZX Coffee.', 'info');
    });

    // ==========================================================================
    // SIDEBAR ROUTER SYSTEM
    // ==========================================================================
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            const title = link.querySelector('span').innerText;

            // Toggle active menu indicators
            sidebarLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            // Switch content sections
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('id') === `section-${target}`) {
                    section.classList.add('active');
                }
            });

            // Update topbar header title
            topbarTitle.innerText = title;

            // Specific tab init callbacks
            if (target === 'ringkasan') {
                initDashboardSummary();
            } else if (target === 'pos') {
                initPOSView();
            } else if (target === 'produk') {
                initProductCrudView();
            } else if (target === 'laporan') {
                initReportsView();
            }
        });
    });

    // ==========================================================================
    // TAB 1: SUMMARY DASHBOARD RENDER
    // ==========================================================================
    const statRevenue = document.getElementById('statRevenue');
    const statTxCount = document.getElementById('statTxCount');
    const statItemsSold = document.getElementById('statItemsSold');
    const recentTxTable = document.getElementById('recentTxTable').querySelector('tbody');
    const bestSellersList = document.getElementById('bestSellersList');

    const initDashboardSummary = () => {
        // Calculate Statistics
        const totalRev = TRANSACTIONS.reduce((sum, tx) => sum + tx.total, 0);
        const totalTxs = TRANSACTIONS.length;
        const totalCups = TRANSACTIONS.reduce((sum, tx) => {
            return sum + tx.items.reduce((itemSum, item) => itemSum + item.qty, 0);
        }, 0);

        statRevenue.innerText = `Rp ${totalRev.toLocaleString('id-ID')}`;
        statTxCount.innerText = `${totalTxs} Transaksi`;
        statItemsSold.innerText = `${totalCups} Cangkir`;

        // Render Recent Transactions
        recentTxTable.innerHTML = '';
        if (TRANSACTIONS.length === 0) {
            recentTxTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">Belum ada transaksi hari ini.</td></tr>`;
        } else {
            // Show last 5 transactions
            const recent = [...TRANSACTIONS].reverse().slice(0, 5);
            recent.forEach(tx => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-weight:700; color:var(--primary);">${tx.id}</td>
                    <td>${tx.time.split(' ')[1]}</td>
                    <td style="font-weight:800;">Rp ${tx.total.toLocaleString('id-ID')}</td>
                    <td>Rp ${tx.cash.toLocaleString('id-ID')}</td>
                    <td>Rp ${tx.change.toLocaleString('id-ID')}</td>
                `;
                recentTxTable.appendChild(tr);
            });
        }

        // Render Best Sellers Progress bar summaries
        bestSellersList.innerHTML = '';
        
        // Aggregate product counts
        const productSales = {};
        TRANSACTIONS.forEach(tx => {
            tx.items.forEach(item => {
                productSales[item.name] = (productSales[item.name] || 0) + item.qty;
            });
        });

        // Convert to array and sort
        const sortedSales = Object.keys(productSales).map(key => ({
            name: key,
            qty: productSales[key]
        })).sort((a, b) => b.qty - a.qty);

        if (sortedSales.length === 0) {
            bestSellersList.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:13px;">Belum ada data penjualan.</p>`;
        } else {
            // Find max quantity for progress percentage base
            const maxQty = sortedSales[0].qty;
            sortedSales.slice(0, 4).forEach(item => {
                const percent = Math.round((item.qty / maxQty) * 100);
                const wrapper = document.createElement('div');
                wrapper.className = 'best-seller-item';
                wrapper.innerHTML = `
                    <div class="best-seller-meta">
                        <span>${item.name}</span>
                        <span>${item.qty} Pcs</span>
                    </div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar" style="width: ${percent}%;"></div>
                    </div>
                `;
                bestSellersList.appendChild(wrapper);
            });
        }
    };

    // ==========================================================================
    // TAB 2: POINT OF SALE (POS) KASIR ENGINE
    // ==========================================================================
    const posProductsGrid = document.getElementById('posProductsGrid');
    const posFilterBtns = document.querySelectorAll('.pos-filter-btn');
    const cartItemsWrapper = document.getElementById('cartItemsWrapper');
    const btnClearCart = document.getElementById('btnClearCart');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');
    const cashAmount = document.getElementById('cashAmount');
    const cashChange = document.getElementById('cashChange');
    const btnCheckout = document.getElementById('btnCheckout');
    
    let activePosFilter = 'all';

    const initPOSView = () => {
        renderPOSProducts();
        renderCart();
        calculateCartTotals();
    };

    // Filter catalog category tabs
    posFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            posFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePosFilter = btn.getAttribute('data-category');
            renderPOSProducts();
        });
    });

    const renderPOSProducts = () => {
        posProductsGrid.innerHTML = '';
        const filtered = PRODUCTS.filter(p => activePosFilter === 'all' || p.category === activePosFilter);
        
        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = `pos-product-card ${p.stock === 0 ? 'disabled' : ''}`;
            
            let stockStatus = `${p.stock} Pcs`;
            let stockClass = '';
            if (p.stock === 0) {
                stockStatus = 'Habis';
                stockClass = 'empty';
            } else if (p.stock <= 5) {
                stockStatus = `Stok Tipis (${p.stock})`;
                stockClass = 'low';
            }

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <h4>${p.name}</h4>
                <span>Rp ${p.price.toLocaleString('id-ID')}</span>
                <div class="product-card-footer">
                    <span class="product-stock-tag ${stockClass}">${stockStatus}</span>
                    ${p.stock > 0 ? `<button class="btn-add-item"><i data-lucide="plus"></i></button>` : ''}
                </div>
            `;
            
            // Add click event to card if product is in stock
            if (p.stock > 0) {
                card.addEventListener('click', (e) => {
                    // Prevent trigger twice if button is clicked
                    if (e.target.closest('.btn-add-item') || e.target.nodeName !== 'BUTTON') {
                        addToCart(p.id);
                    }
                });
            }
            
            posProductsGrid.appendChild(card);
        });
        lucide.createIcons();
    };

    // POS Cart Action callbacks
    const addToCart = (productId) => {
        const prod = PRODUCTS.find(p => p.id === productId);
        if (!prod || prod.stock <= 0) return;

        // Check if item is already in cart
        const cartItem = CART.find(item => item.id === productId);
        if (cartItem) {
            // Validate against current inventory stock limit
            if (cartItem.qty < prod.stock) {
                cartItem.qty++;
                showToast(`Jumlah "${prod.name}" ditambah di keranjang.`, 'info');
            } else {
                showToast(`Stok "${prod.name}" di kasir terbatas (${prod.stock} unit).`, 'danger');
            }
        } else {
            CART.push({
                id: prod.id,
                name: prod.name,
                price: prod.price,
                qty: 1
            });
            showToast(`"${prod.name}" ditambahkan ke keranjang.`, 'success');
        }
        
        renderCart();
        calculateCartTotals();
    };

    const renderCart = () => {
        cartItemsWrapper.innerHTML = '';
        if (CART.length === 0) {
            cartItemsWrapper.innerHTML = `
                <div class="empty-cart-state">
                    <i data-lucide="shopping-bag"></i>
                    <p>Keranjang belanja kosong.<br>Klik produk di sebelah kiri untuk menambahkan.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        CART.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item-row';
            row.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <span>Rp ${item.price.toLocaleString('id-ID')}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-cart-qty minus" data-id="${item.id}"><i data-lucide="minus"></i></button>
                    <span class="cart-item-qty">${item.qty}</span>
                    <button class="btn-cart-qty plus" data-id="${item.id}"><i data-lucide="plus"></i></button>
                    <span class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
                </div>
            `;
            
            // Qty plus/minus buttons actions
            row.querySelector('.minus').addEventListener('click', () => decrementCartItem(item.id));
            row.querySelector('.plus').addEventListener('click', () => addToCart(item.id));

            cartItemsWrapper.appendChild(row);
        });
        lucide.createIcons();
    };

    const decrementCartItem = (itemId) => {
        const item = CART.find(i => i.id === itemId);
        if (!item) return;

        item.qty--;
        if (item.qty <= 0) {
            CART = CART.filter(i => i.id !== itemId);
            showToast('Produk dihapus dari keranjang.', 'info');
        }
        
        renderCart();
        calculateCartTotals();
    };

    // Calculate subtotal, tax, grand total
    const calculateCartTotals = () => {
        const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + tax;

        cartSubtotal.innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
        cartTax.innerText = `Rp ${tax.toLocaleString('id-ID')}`;
        cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;

        // Set attributes on checkout button
        btnCheckout.disabled = (CART.length === 0);
        
        calculateChangeAmount();
    };

    // Cash Change calculations
    const calculateChangeAmount = () => {
        const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + tax;
        const cash = parseFloat(cashAmount.value) || 0;

        if (cash >= total && total > 0) {
            const change = cash - total;
            cashChange.innerText = `Rp ${change.toLocaleString('id-ID')}`;
            btnCheckout.disabled = false;
        } else {
            cashChange.innerText = 'Rp 0';
            btnCheckout.disabled = true; // Disable checkout if cash received is insufficient
        }
    };

    cashAmount.addEventListener('input', calculateChangeAmount);

    // Quick cash keys
    document.querySelectorAll('.btn-quick-cash').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.getAttribute('data-amount'));
            cashAmount.value = amount;
            calculateChangeAmount();
        });
    });

    btnClearCart.addEventListener('click', () => {
        if (CART.length > 0) {
            CART = [];
            cashAmount.value = '';
            showToast('Keranjang belanja berhasil dikosongkan.', 'info');
            renderCart();
            calculateCartTotals();
        }
    });

    // ==========================================================================
    // RECEIPT MODAL CHECKOUT
    // ==========================================================================
    const receiptModal = document.getElementById('receiptModal');
    const receiptModalClose = document.getElementById('receiptModalClose');
    const btnReceiptClose = document.getElementById('btnReceiptClose');
    const btnReceiptPrint = document.getElementById('btnReceiptPrint');
    const receiptItemsList = document.getElementById('receiptItemsList');
    
    const receiptId = document.getElementById('receiptId');
    const receiptTime = document.getElementById('receiptTime');
    const receiptSubtotal = document.getElementById('receiptSubtotal');
    const receiptTax = document.getElementById('receiptTax');
    const receiptTotal = document.getElementById('receiptTotal');
    const receiptCash = document.getElementById('receiptCash');
    const receiptChange = document.getElementById('receiptChange');

    btnCheckout.addEventListener('click', () => {
        const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.1);
        const total = subtotal + tax;
        const cash = parseFloat(cashAmount.value) || 0;
        
        if (cash < total) {
            showToast('Uang tunai pembayaran tidak mencukupi.', 'danger');
            return;
        }

        // Generate Transaction details
        const txSerial = 10001 + TRANSACTIONS.length;
        const newTxId = `TX-${txSerial}`;
        
        const now = new Date();
        const dateStr = String(now.getDate()).padStart(2, '0') + '/' + 
                        String(now.getMonth() + 1).padStart(2, '0') + '/' + 
                        now.getFullYear() + ' ' + 
                        String(now.getHours()).padStart(2, '0') + ':' + 
                        String(now.getMinutes()).padStart(2, '0');
        
        const completedItems = CART.map(item => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price
        }));

        // Deduct inventory product stocks permanently in-memory
        completedItems.forEach(item => {
            const p = PRODUCTS.find(prod => prod.id === item.id);
            if (p) p.stock = Math.max(0, p.stock - item.qty);
        });

        const newTx = {
            id: newTxId,
            time: dateStr,
            total: total,
            cash: cash,
            change: cash - total,
            items: completedItems
        };

        // Push to local memory history
        TRANSACTIONS.push(newTx);

        // Render receipt modal texts
        receiptId.innerText = newTxId;
        receiptTime.innerText = dateStr;
        receiptSubtotal.innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
        receiptTax.innerText = `Rp ${tax.toLocaleString('id-ID')}`;
        receiptTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
        receiptCash.innerText = `Rp ${cash.toLocaleString('id-ID')}`;
        receiptChange.innerText = `Rp ${(cash - total).toLocaleString('id-ID')}`;

        receiptItemsList.innerHTML = '';
        completedItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'receipt-item-row-print';
            row.innerHTML = `
                <span class="item-name">${item.name} (${item.qty}x)</span>
                <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
            `;
            receiptItemsList.appendChild(row);
        });

        // Open Modal
        receiptModal.classList.add('active');
        
        // Reset Cashier states
        CART = [];
        cashAmount.value = '';
        renderCart();
        calculateCartTotals();
    });

    const closeReceiptModal = () => {
        receiptModal.classList.remove('active');
        initPOSView(); // Refresh grids
    };

    [receiptModalClose, btnReceiptClose].forEach(btn => btn.addEventListener('click', closeReceiptModal));
    btnReceiptPrint.addEventListener('click', () => {
        window.print(); // Native print trigger using receipt media overrides
    });

    // ==========================================================================
    // TAB 3: PRODUCT MANAGEMENT (CRUD EDITOR)
    // ==========================================================================
    const productCrudBody = document.getElementById('productCrudBody');
    const productSearchInput = document.getElementById('productSearchInput');
    const btnOpenAddProductModal = document.getElementById('btnOpenAddProductModal');
    const productModal = document.getElementById('productModal');
    const productModalClose = document.getElementById('productModalClose');
    const productModalOverlay = document.getElementById('productModalOverlay');
    const productCrudForm = document.getElementById('productCrudForm');
    
    const crudProductId = document.getElementById('crudProductId');
    const crudProductName = document.getElementById('crudProductName');
    const crudProductCategory = document.getElementById('crudProductCategory');
    const crudProductStock = document.getElementById('crudProductStock');
    const crudProductPrice = document.getElementById('crudProductPrice');
    const crudProductImage = document.getElementById('crudProductImage');
    const productModalTitle = document.getElementById('productModalTitle');

    const initProductCrudView = () => {
        renderProductCrudTable(PRODUCTS);
    };

    const renderProductCrudTable = (itemsList) => {
        productCrudBody.innerHTML = '';
        if (itemsList.length === 0) {
            productCrudBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Produk tidak ditemukan.</td></tr>`;
            return;
        }

        itemsList.forEach(p => {
            const tr = document.createElement('tr');
            
            let stockBadgeClass = 'instock';
            let stockText = `${p.stock} Pcs`;
            if (p.stock === 0) {
                stockBadgeClass = 'outofstock';
                stockText = 'Habis';
            } else if (p.stock <= 5) {
                stockBadgeClass = 'lowstock';
                stockText = `Stok Tipis (${p.stock})`;
            }

            tr.innerHTML = `
                <td>#PRD-00${p.id}</td>
                <td style="font-weight:700;">${p.name}</td>
                <td>${p.category}</td>
                <td style="font-weight:800;">Rp ${p.price.toLocaleString('id-ID')}</td>
                <td><span class="badge-stock ${stockBadgeClass}">${stockText}</span></td>
                <td>
                    <div class="crud-actions-row">
                        <button class="btn-action edit" data-id="${p.id}"><i data-lucide="edit-3"></i></button>
                        <button class="btn-action delete" data-id="${p.id}"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            `;

            // Bind Actions
            tr.querySelector('.edit').addEventListener('click', () => openEditProductForm(p.id));
            tr.querySelector('.delete').addEventListener('click', () => deleteProduct(p.id));

            productCrudBody.appendChild(tr);
        });
        lucide.createIcons();
    };

    // Live search filters
    productSearchInput.addEventListener('input', () => {
        const query = productSearchInput.value.toLowerCase().trim();
        const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(query));
        renderProductCrudTable(filtered);
    });

    // Form Modals opening
    const openAddProductForm = () => {
        productModalTitle.innerText = "Tambah Produk Baru";
        productCrudForm.reset();
        crudProductId.value = '';
        productModal.classList.add('active');
    };

    const openEditProductForm = (productId) => {
        const p = PRODUCTS.find(prod => prod.id === productId);
        if (!p) return;

        productModalTitle.innerText = "Edit Data Produk";
        crudProductId.value = p.id;
        crudProductName.value = p.name;
        crudProductCategory.value = p.category;
        crudProductStock.value = p.stock;
        crudProductPrice.value = p.price;
        crudProductImage.value = p.image || '';

        productModal.classList.add('active');
    };

    const closeProductModal = () => {
        productModal.classList.remove('active');
    };

    btnOpenAddProductModal.addEventListener('click', openAddProductForm);
    [productModalClose, productModalOverlay].forEach(btn => btn.addEventListener('click', closeProductModal));

    // Submit add or edit form
    productCrudForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = crudProductId.value;
        const name = crudProductName.value.trim();
        const category = crudProductCategory.value;
        const stock = parseInt(crudProductStock.value) || 0;
        const price = parseInt(crudProductPrice.value) || 0;
        const img = crudProductImage.value.trim() || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=300&auto=format&fit=crop'; // Default caramel sugar photo

        if (id) {
            // Edit Mode
            const idx = PRODUCTS.findIndex(p => p.id === parseInt(id));
            if (idx !== -1) {
                PRODUCTS[idx] = {
                    ...PRODUCTS[idx],
                    name,
                    category,
                    stock,
                    price,
                    image: img
                };
                showToast(`Produk "${name}" berhasil diperbarui.`, 'success');
            }
        } else {
            // Add Mode
            const newId = PRODUCTS.reduce((max, p) => p.id > max ? p.id : max, 0) + 1;
            PRODUCTS.push({
                id: newId,
                name,
                category,
                stock,
                price,
                image: img
            });
            showToast(`Produk "${name}" berhasil ditambahkan.`, 'success');
        }

        closeProductModal();
        initProductCrudView();
    });

    const deleteProduct = (productId) => {
        const p = PRODUCTS.find(prod => prod.id === productId);
        if (!p) return;

        if (confirm(`Apakah Anda yakin ingin menghapus produk "${p.name}"?`)) {
            PRODUCTS = PRODUCTS.filter(prod => prod.id !== productId);
            showToast(`Produk "${p.name}" dihapus.`, 'info');
            initProductCrudView();
        }
    };

    // ==========================================================================
    // TAB 4: REPORTS WITH CHART.JS WEEKLY GRAPHS
    // ==========================================================================
    const reportTotalSales = document.getElementById('reportTotalSales');
    const reportDailyAverage = document.getElementById('reportDailyAverage');
    const salesChartCanvas = document.getElementById('salesChart');

    const initReportsView = () => {
        // Today's total sales in-memory addition
        const todaySales = TRANSACTIONS.reduce((sum, tx) => sum + tx.total, 0);
        
        // Dummy weekly sales report: Mon - Sat + Today (Sun)
        const weeklyValues = [1250000, 1480000, 980000, 1620000, 2100000, 2550000, todaySales];
        const daysLabel = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu (Hari Ini)"];

        const totalWeekly = weeklyValues.reduce((sum, val) => sum + val, 0);
        const dailyAvg = Math.round(totalWeekly / weeklyValues.length);

        reportTotalSales.innerText = `Rp ${totalWeekly.toLocaleString('id-ID')}`;
        reportDailyAverage.innerText = `Rp ${dailyAvg.toLocaleString('id-ID')}`;

        // Initialize or update Chart.js
        if (salesChartInstance) {
            salesChartInstance.data.datasets[0].data = weeklyValues;
            salesChartInstance.update();
        } else {
            salesChartInstance = new Chart(salesChartCanvas, {
                type: 'line',
                data: {
                    labels: daysLabel,
                    datasets: [{
                        label: 'Volume Penjualan (Rupiah)',
                        data: weeklyValues,
                        borderColor: '#10b981', // Emerald green line
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        borderWidth: 3,
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false // Hide legends panel
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#e2e8f0'
                            },
                            ticks: {
                                callback: function(value) {
                                    return 'Rp ' + (value / 1000).toLocaleString('id-ID') + 'k';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    };

    // ==========================================================================
    // TOAST FEEDBACK ALERTS SYSTEM HELPERS
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

    console.log("HZX Coffee POS & Admin Panel Loaded - Created by HZXPro Studio");
});
