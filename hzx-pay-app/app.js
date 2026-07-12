/* ==========================================================================
   HZX Pay - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    let userBalance = 1450000;

    // Mock history base for full screen
    const MOCK_HISTORY_ITEMS = [
        { type: 'expense', title: 'Kopi Latte Espresso', subtitle: 'HZX Coffee Store', amt: 35000, icon: 'shopping-bag' },
        { type: 'income', title: 'Transfer Masuk', subtitle: 'Dari Fatah R.', amt: 500000, icon: 'arrow-down-left' },
        { type: 'expense', title: 'Pembayaran Tagihan Listrik', subtitle: 'PLN Pascabayar', amt: 12000, icon: 'smartphone' },
        { type: 'expense', title: 'Belanja Sepatu Basket', subtitle: 'HZX Sport Store', amt: 650000, icon: 'shopping-bag' },
        { type: 'income', title: 'Refund Pembelian', subtitle: 'Tokopedia Escrow', amt: 150000, icon: 'arrow-down-left' }
    ];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const tabItems = document.querySelectorAll('.tab-item');
    const screens = document.querySelectorAll('.screen');
    
    const qrCameraOverlay = document.getElementById('qr-camera-overlay');
    const btnCloseQrOverlay = document.getElementById('btn-close-qr-overlay');
    
    const homeBalance = document.getElementById('home-balance');
    const recentTransactionsList = document.getElementById('recent-transactions-list');
    const historyScrollList = document.getElementById('history-scroll-list');
    
    const paySendForm = document.getElementById('paySendForm');
    const sendRecipient = document.getElementById('sendRecipient');
    const sendAmount = document.getElementById('sendAmount');
    const sendNote = document.getElementById('sendNote');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Tab Navigation Screen Switcher
    // ==========================================================================
    const switchScreen = (screenId) => {
        // Hide all screens
        screens.forEach(s => s.classList.remove('active'));
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // Active tab highlights
        tabItems.forEach(t => {
            if (t.getAttribute('data-screen') === screenId) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });
    };

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const screenId = tab.getAttribute('data-screen');
            switchScreen(screenId);
        });
    });

    // Bind back home buttons
    document.querySelectorAll('.btn-back-home').forEach(btn => {
        btn.addEventListener('click', () => switchScreen('screen-home'));
    });

    // Quick links
    document.getElementById('action-send').addEventListener('click', () => switchScreen('screen-send'));
    document.getElementById('action-history').addEventListener('click', () => switchScreen('screen-history'));
    document.getElementById('link-see-all-history').addEventListener('click', (e) => {
        e.preventDefault();
        switchScreen('screen-history');
    });

    // ==========================================================================
    // Scan QR Camera Simulation
    // ==========================================================================
    document.getElementById('action-qr').addEventListener('click', () => {
        qrCameraOverlay.classList.add('active');
        
        // Simulate camera scanning a merchant code after 2.5 seconds
        setTimeout(() => {
            if (qrCameraOverlay.classList.contains('active')) {
                qrCameraOverlay.classList.remove('active');
                
                // Deduct mock payment of Rp 35.000
                const txAmt = 35000;
                if (userBalance >= txAmt) {
                    userBalance -= txAmt;
                    updateBalanceText();
                    
                    // Add transaction item
                    addTransactionRecord('expense', 'Qris Merchant: HZX Coffee Store', 'Pembayaran QR', txAmt, 'shopping-bag');
                    showToast('QR Scan Berhasil! Pembayaran Rp 35.000 didebet.', 'success');
                } else {
                    showToast('QR Scan Gagal: Saldo tidak mencukupi.', 'danger');
                }
            }
        }, 2500);
    });

    btnCloseQrOverlay.addEventListener('click', () => {
        qrCameraOverlay.classList.remove('active');
        showToast('Kamera QR ditutup.', 'danger');
    });

    // ==========================================================================
    // Send Money Transaction Logic
    // ==========================================================================
    paySendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const recipient = sendRecipient.value.trim();
        const amt = parseFloat(sendAmount.value) || 0;
        const note = sendNote.value.trim();
        
        if (!recipient) {
            showToast('Masukkan nomor HP/rekening tujuan.', 'danger');
            sendRecipient.focus();
            return;
        }
        if (amt < 10000) {
            showToast('Nominal transfer minimal Rp 10.000.', 'danger');
            sendAmount.focus();
            return;
        }
        if (amt > userBalance) {
            showToast('Saldo Anda tidak mencukupi untuk transfer.', 'danger');
            sendAmount.focus();
            return;
        }

        // Process deduction
        userBalance -= amt;
        updateBalanceText();
        
        // Add to records
        addTransactionRecord('expense', `Kirim ke ${recipient}`, note || 'Transfer Saldo', amt, 'send');
        
        showToast(`Transfer ke ${recipient} sebesar Rp ${amt.toLocaleString('id-ID')} Berhasil!`, 'success');
        
        paySendForm.reset();
        
        // Back to home after 800ms
        setTimeout(() => switchScreen('screen-home'), 800);
    });

    // Reset demo balance helper
    document.getElementById('btn-demo-reset').addEventListener('click', (e) => {
        e.preventDefault();
        userBalance = 1450000;
        updateBalanceText();
        showToast('Saldo demo direset kembali ke Rp 1.450.000.', 'success');
        switchScreen('screen-home');
    });

    const updateBalanceText = () => {
        homeBalance.innerText = `Rp ${userBalance.toLocaleString('id-ID')}`;
    };

    const addTransactionRecord = (type, title, subtitle, amt, iconName) => {
        const itemHtml = `
            <div class="transaction-item ${type}">
                <div class="tx-icon"><i data-lucide="${iconName}"></i></div>
                <div class="tx-details">
                    <h4>${title}</h4>
                    <span>${subtitle}</span>
                </div>
                <span class="tx-amount">${type === 'expense' ? '-' : '+'}Rp ${amt.toLocaleString('id-ID')}</span>
            </div>
        `;
        
        // Prepend to dashboard list
        recentTransactionsList.insertAdjacentHTML('afterbegin', itemHtml);
        
        // Prepend to history scroll list
        historyScrollList.insertAdjacentHTML('afterbegin', itemHtml);
        
        lucide.createIcons();
    };

    // ==========================================================================
    // Pre-populate History Screen list
    // ==========================================================================
    const initHistoryList = () => {
        historyScrollList.innerHTML = '';
        MOCK_HISTORY_ITEMS.forEach(item => {
            const itemHtml = `
                <div class="transaction-item ${item.type}">
                    <div class="tx-icon"><i data-lucide="${item.icon}"></i></div>
                    <div class="tx-details">
                        <h4>${item.title}</h4>
                        <span>${item.subtitle}</span>
                    </div>
                    <span class="tx-amount">${item.type === 'expense' ? '-' : '+'}Rp ${item.amt.toLocaleString('id-ID')}</span>
                </div>
            `;
            historyScrollList.insertAdjacentHTML('beforeend', itemHtml);
        });
        lucide.createIcons();
    };

    initHistoryList();

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
        
        // Auto close after 3.2 seconds
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

    console.log("HZX Pay Mobile App Loaded - Created by HZXPro Studio");
});
