/* ==========================================================================
   HZX Serv - Status Tracking & Order Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // Mock Database (JSON-like structure for demo tracking)
    // ==========================================================================
    const MOCK_ORDER_DATABASE = {
        "HZX-1100": {
            code: "HZX-1100",
            device: "Asus ROG Ally (512GB)",
            service: "Gaming Console Repair",
            eta: "15 Juli 2026",
            step: 1, // 1: Diterima, 2: Diagnosa, 3: Pengerjaan, 4: QC, 5: Selesai
            logs: [
                {
                    date: "12 Juli 2026, 09:00 WIB",
                    status: "Diterima",
                    desc: "Perangkat diterima di Front Office oleh admin. Keluhan analog stick sebelah kiri mengalami drift parah."
                }
            ]
        },
        "HZX-9021": {
            code: "HZX-9021",
            device: "iPhone 13 Pro Max (256GB)",
            service: "Smartphone Repair",
            eta: "14 Juli 2026",
            step: 3, // Pengerjaan
            logs: [
                {
                    date: "12 Juli 2026, 15:45 WIB",
                    status: "Pengerjaan",
                    desc: "Proses penggantian modul baterai orisinil dan pengeleman ulang seal anti-air sedang berlangsung oleh teknisi utama."
                },
                {
                    date: "12 Juli 2026, 11:20 WIB",
                    status: "Diagnosa",
                    desc: "Uji arus sirkuit motherboard selesai. Sel baterai terindikasi drop parah (health 62%) memicu mati mendadak."
                },
                {
                    date: "12 Juli 2026, 09:30 WIB",
                    status: "Diterima",
                    desc: "Device diterima di laboratorium reparasi HZX. Keluhan mati mendadak dan cepat panas."
                }
            ]
        },
        "HZX-7788": {
            code: "HZX-7788",
            device: "Sony PlayStation 5 (CFI-1200)",
            service: "Gaming Console Repair",
            eta: "13 Juli 2026 (Hari Ini)",
            step: 4, // QC Uji Coba
            logs: [
                {
                    date: "12 Juli 2026, 17:00 WIB",
                    status: "Uji Coba QC",
                    desc: "Running test benchmark suhu internal dan pengetesan beban game berat selama 60 menit. Suhu stabil di 58°C."
                },
                {
                    date: "12 Juli 2026, 13:00 WIB",
                    status: "Pengerjaan",
                    desc: "Pembersihan kipas pendingin, penggantian pasta thermal liquid metal, dan perbaikan jalur catu daya selesai dilakukan."
                },
                {
                    date: "11 Juli 2026, 16:30 WIB",
                    status: "Diagnosa",
                    desc: "Diagnosa mendeteksi overheating parah akibat pasta liquid metal mengering dan tersumbatnya kisi-kisi pembuangan debu."
                },
                {
                    date: "11 Juli 2026, 10:00 WIB",
                    status: "Diterima",
                    desc: "Konsol game diterima. Keluhan konsol mati mendadak dengan indikasi lampu merah setelah dimainkan 15 menit."
                }
            ]
        },
        "HZX-4412": {
            code: "HZX-4412",
            device: "MacBook Pro 16-Inch M1 Max",
            service: "MacBook & Laptop Service",
            eta: "Selesai (Siap Diambil)",
            step: 5, // Siap Ambil / Selesai
            logs: [
                {
                    date: "12 Juli 2026, 10:15 WIB",
                    status: "Siap Diambil",
                    desc: "Perangkat lolos uji kelayakan QC menyeluruh. Sistem operasi terinstal ulang bersih, seluruh komponen dibersihkan, siap diserahkan."
                },
                {
                    date: "11 Juli 2026, 15:00 WIB",
                    status: "Uji Coba QC",
                    desc: "Pemasangan SSD baru berhasil. Uji kecepatan baca/tulis normal di 5.200 MB/s. Tidak ada bad-sector terdeteksi."
                },
                {
                    date: "11 Juli 2026, 11:00 WIB",
                    status: "Pengerjaan",
                    desc: "Proses transfer data dari HDD lama ke SSD NVMe 1TB selesai. Instalasi macOS Monterey bersih sedang disiapkan."
                },
                {
                    date: "10 Juli 2026, 14:00 WIB",
                    status: "Diterima",
                    desc: "Laptop MacBook diterima. Keluhan loading lambat, sering memunculkan folder bertanda tanya, performa macet."
                }
            ]
        }
    };

    const SHOP_WHATSAPP = '628123456789';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const trackingForm = document.getElementById('trackingForm');
    const trackingCodeInput = document.getElementById('trackingCode');
    const trackingResultPanel = document.getElementById('trackingResultPanel');
    
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const trackingLoading = document.getElementById('trackingLoading');
    const trackingError = document.getElementById('trackingError');
    const trackingSuccessContent = document.getElementById('trackingSuccessContent');
    
    const resCode = document.getElementById('resCode');
    const resDevice = document.getElementById('resDevice');
    const resService = document.getElementById('resService');
    const resEta = document.getElementById('resEta');
    const progressBarFill = document.getElementById('progressBarFill');
    const techLogsTimeline = document.getElementById('techLogsTimeline');
    
    const orderForm = document.getElementById('orderForm');
    const orderService = document.getElementById('orderService');
    const orderDevice = document.getElementById('orderDevice');
    const orderName = document.getElementById('orderName');
    const orderPhone = document.getElementById('orderPhone');
    const orderDamage = document.getElementById('orderDamage');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Mobile Nav Trigger
    // ==========================================================================
    const toggleMobileNav = () => mobileNav.classList.toggle('active');
    
    mobileMenuTrigger.addEventListener('click', toggleMobileNav);
    mobileNavClose.addEventListener('click', toggleMobileNav);
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // ==========================================================================
    // Service Pre-selection Linkage
    // ==========================================================================
    document.querySelectorAll('.btn-select').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.getAttribute('data-service');
            orderService.value = serviceName;
            
            // Highlight dropdown
            orderService.style.borderColor = 'var(--accent)';
            
            // Scroll to order form smoothly
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
            
            showToast(`Layanan "${serviceName}" dipilih. Silakan isi data perangkat Anda.`, 'info');
            
            setTimeout(() => {
                orderService.style.borderColor = 'var(--border-color)';
            }, 1500);
        });
    });

    // ==========================================================================
    // Dynamic Tracking Lookup System
    // ==========================================================================
    const performTrackingLookup = (code) => {
        const cleanedCode = code.trim().toUpperCase();
        
        // Hide all output panels initially
        resultPlaceholder.style.display = 'none';
        trackingError.style.display = 'none';
        trackingSuccessContent.style.display = 'none';
        
        // Show loading spinner
        trackingLoading.style.display = 'flex';
        
        // Simulate database lookup latency (looks premium & organic)
        setTimeout(() => {
            trackingLoading.style.display = 'none';
            
            const orderData = MOCK_ORDER_DATABASE[cleanedCode];
            
            if (orderData) {
                // Populate content details
                resCode.innerText = orderData.code;
                resDevice.innerText = orderData.device;
                resService.innerText = orderData.service;
                resEta.innerText = orderData.eta;
                
                // Adjust Step Progress Bar
                // Step values: 1 = Diterima, 2 = Diagnosa, 3 = Pengerjaan, 4 = QC, 5 = Selesai
                const stepPercent = (orderData.step - 1) * 25; // 0%, 25%, 50%, 75%, 100%
                progressBarFill.style.width = `${stepPercent}%`;
                
                // Update dots active/done classes
                for (let i = 1; i <= 5; i++) {
                    const stepEl = document.getElementById(`step-${i}`);
                    if (i < orderData.step) {
                        stepEl.className = 'timeline-step done';
                    } else if (i === orderData.step) {
                        stepEl.className = 'timeline-step active';
                    } else {
                        stepEl.className = 'timeline-step';
                    }
                }
                
                // Populate Logs List
                techLogsTimeline.innerHTML = orderData.logs.map((log, idx) => `
                    <div class="log-item ${idx === 0 ? 'active-log' : ''}">
                        <div class="log-meta">
                            <span class="log-date">${log.date}</span>
                            <span class="log-status">${log.status}</span>
                        </div>
                        <p class="log-desc">${log.desc}</p>
                    </div>
                `).join('');
                
                // Show success block
                trackingSuccessContent.style.display = 'flex';
                showToast(`Pesanan ${cleanedCode} berhasil dilacak!`, 'success');
            } else {
                // Show error state
                trackingError.style.display = 'flex';
                showToast(`Kode order "${cleanedCode}" tidak ditemukan.`, 'danger');
            }
        }, 850);
    };

    // Form tracking submission
    trackingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = trackingCodeInput.value;
        if (code) {
            performTrackingLookup(code);
        }
    });

    // Handle click on demo pills
    document.querySelectorAll('.demo-code').forEach(pill => {
        pill.addEventListener('click', () => {
            const code = pill.getAttribute('data-code');
            trackingCodeInput.value = code;
            performTrackingLookup(code);
            
            // Scroll tracking result panel into view on mobile
            if (window.innerWidth < 992) {
                trackingResultPanel.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ==========================================================================
    // Order Form WhatsApp Redirect Encoder
    // ==========================================================================
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = orderName.value.trim();
        const phone = orderPhone.value.trim();
        const service = orderService.value;
        const device = orderDevice.value.trim();
        const damage = orderDamage.value.trim();
        
        // Field Validations
        if (!name) {
            showToast('Nama Lengkap wajib diisi.', 'danger');
            orderName.focus();
            return;
        }
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang aktif.', 'danger');
            orderPhone.focus();
            return;
        }
        if (!service) {
            showToast('Pilih kategori layanan reparasi.', 'danger');
            orderService.focus();
            return;
        }
        if (!device) {
            showToast('Tipe dan merk perangkat wajib diisi.', 'danger');
            orderDevice.focus();
            return;
        }
        if (!damage) {
            showToast('Detail kerusakan wajib diisi agar mempermudah diagnosa.', 'danger');
            orderDamage.focus();
            return;
        }

        // Message body formatting
        let waMsg = `*HZX SERV - PENDAFTARAN SERVIS BARU*\n`;
        waMsg += `==================================\n\n`;
        waMsg += `*Layanan:* ${service}\n`;
        waMsg += `*Perangkat:* ${device}\n`;
        waMsg += `*Kerusakan:* ${damage}\n\n`;
        
        waMsg += `*Data Pelanggan:*\n`;
        waMsg += `- Nama: ${name}\n`;
        waMsg += `- Kontak WA: ${phone}\n\n`;
        
        waMsg += `==================================\n`;
        waMsg += `_Mohon diinfo estimasi biaya perbaikan awal beserta prosedur pengiriman perangkat, terima kasih!_`;
        
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp
        window.open(waUrl, '_blank');
        
        showToast('Pendaftaran dikirim! Membuka WhatsApp CS...', 'success');
        orderForm.reset();
    });

    // ==========================================================================
    // Toast Notification helper
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
        toast.style.animation = 'toast-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    };

    console.log("HZX Serv Tracker Web Application Loaded - Created by HZXPro Studio");
});
