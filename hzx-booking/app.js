/* ==========================================================================
   HZX Booking - Reservation & Calendar Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State Management
    // ==========================================================================
    let displayDate = new Date(); // Month and year shown in calendar
    let selectedDate = null;      // Date object of the selected reservation date
    let selectedTime = null;      // String value (e.g., "11:00") of selected time slot
    
    const SHOP_WHATSAPP = '628123456789';
    const TIME_SLOTS = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

    // Month Names in Indonesian
    const MONTH_NAMES = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    // Day Names in Indonesian
    const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    
    const calendarMonthYear = document.getElementById('calendarMonthYear');
    const calendarDates = document.getElementById('calendarDates');
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    
    const bookingForm = document.getElementById('bookingForm');
    const bookingService = document.getElementById('bookingService');
    const bookingDateDisplay = document.getElementById('bookingDateDisplay');
    const bookingDateRaw = document.getElementById('bookingDateRaw');
    const bookingTimeDisplay = document.getElementById('bookingTimeDisplay');
    const bookingName = document.getElementById('bookingName');
    const bookingPhone = document.getElementById('bookingPhone');
    const bookingNotes = document.getElementById('bookingNotes');
    
    const toastContainer = document.getElementById('toastContainer');

    // ==========================================================================
    // Mobile Navigation Triggers
    // ==========================================================================
    const toggleMobileNav = () => mobileNav.classList.toggle('active');
    
    mobileMenuTrigger.addEventListener('click', toggleMobileNav);
    mobileNavClose.addEventListener('click', toggleMobileNav);
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // ==========================================================================
    // Service Selection from Cards
    // ==========================================================================
    document.querySelectorAll('.btn-select-service').forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceName = btn.getAttribute('data-service-name');
            bookingService.value = serviceName;
            
            // Highlight the select input momentarily
            bookingService.style.borderColor = 'var(--accent)';
            
            // Scroll to form smoothly
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            
            showToast(`Layanan "${serviceName}" dipilih. Silakan pilih Tanggal dan Jam kunjungan.`, 'info');
            
            setTimeout(() => {
                bookingService.style.borderColor = 'var(--border-color)';
            }, 1500);
        });
    });

    // ==========================================================================
    // Mock Availability Database Generator
    // ==========================================================================
    // We simulate booked slots based on the date.
    const getBookedSlotsForDate = (dateObj) => {
        if (!dateObj) return [];
        
        const day = dateObj.getDate();
        const month = dateObj.getMonth();
        const weekday = dateObj.getDay();
        const today = new Date();
        
        // Past dates: all slots are closed/booked
        const dateClone = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59);
        if (dateClone < today) {
            return [...TIME_SLOTS];
        }

        // Today: disable slots in the past
        if (dateObj.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            return TIME_SLOTS.filter(slot => {
                const slotHour = parseInt(slot.split(':')[0]);
                return slotHour <= currentHour + 1; // Need to book at least 1 hour in advance
            });
        }

        // Weekend logic (Sat/Sun): busier
        if (weekday === 0 || weekday === 6) {
            return ["13:00", "15:00", "17:00"]; // Block peak hours on weekends
        }

        // Specific mock rules for demo dates (to showcase full slots)
        // Rule 1: Tomorrow has 15:00 booked
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        if (dateObj.toDateString() === tomorrow.toDateString()) {
            return ["15:00", "11:00"];
        }

        // Rule 2: Day after tomorrow is fully booked except morning & evening
        const dayAfter = new Date();
        dayAfter.setDate(today.getDate() + 2);
        if (dateObj.toDateString() === dayAfter.toDateString()) {
            return ["11:00", "13:00", "15:00", "17:00"];
        }

        // Rule 3: 15th of any month is fully booked
        if (day === 15) {
            return [...TIME_SLOTS]; // Fully booked day
        }

        // Normal weekday default: random slot blocked to look real
        // Simple deterministic fake booking based on date number
        const blockedIdx = day % TIME_SLOTS.length;
        return [TIME_SLOTS[blockedIdx]];
    };

    // ==========================================================================
    // Interactive Calendar Renderer
    // ==========================================================================
    const renderCalendar = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        
        // Set Month/Year label
        calendarMonthYear.innerText = `${MONTH_NAMES[month]} ${year}`;
        
        // Clear previous dates
        calendarDates.innerHTML = '';
        
        // Find starting weekday of month (0 = Sun, 1 = Mon...)
        const firstDayIdx = new Date(year, month, 1).getDay();
        
        // Find number of days in month
        const numDays = new Date(year, month + 1, 0).getDate();
        
        // Render Empty cells for starting offsets
        for (let i = 0; i < firstDayIdx; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarDates.appendChild(emptyCell);
        }
        
        const today = new Date();
        
        // Render days
        for (let day = 1; day <= numDays; day++) {
            const dateObj = new Date(year, month, day);
            const dayCell = document.createElement('button');
            dayCell.className = 'calendar-day';
            dayCell.innerText = day;
            
            // Check status
            const isToday = dateObj.toDateString() === today.toDateString();
            const dateClone = new Date(year, month, day, 23, 59, 59);
            const isPast = dateClone < today;
            const bookedSlots = getBookedSlotsForDate(dateObj);
            const isFull = bookedSlots.length === TIME_SLOTS.length;
            const isActive = selectedDate && dateObj.toDateString() === selectedDate.toDateString();
            
            if (isPast) {
                dayCell.classList.add('disabled-day');
            } else if (isFull) {
                dayCell.classList.add('full-day');
            } else {
                dayCell.classList.add('available');
                
                // Add click listener
                dayCell.addEventListener('click', (e) => {
                    e.preventDefault();
                    selectDate(dateObj);
                });
            }
            
            if (isToday) dayCell.classList.add('today');
            if (isActive) dayCell.classList.add('active-day');
            
            calendarDates.appendChild(dayCell);
        }
    };

    // Date selection click handler
    const selectDate = (dateObj) => {
        selectedDate = dateObj;
        selectedTime = null; // Reset slot
        
        // Format display values
        const dayName = DAY_NAMES[dateObj.getDay()];
        const dayNum = dateObj.getDate();
        const monthName = MONTH_NAMES[dateObj.getMonth()];
        const yearNum = dateObj.getFullYear();
        
        bookingDateDisplay.value = `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
        bookingDateRaw.value = `${yearNum}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        bookingTimeDisplay.value = ''; // Reset form time
        
        renderCalendar();      // Update active state in calendar
        renderTimeSlots();     // Render slots for selected date
        
        showToast(`Tanggal kunjungan diatur ke: ${dayNum} ${monthName}`, 'info');
    };

    // Render Time Slots Grid based on selected date
    const renderTimeSlots = () => {
        timeSlotsGrid.innerHTML = '';
        
        if (!selectedDate) {
            timeSlotsGrid.innerHTML = '<div style="grid-column: span 3; text-align: center; font-size: 13px; color: var(--text-muted); padding: 12px 0;">Silakan pilih tanggal terlebih dahulu</div>';
            return;
        }
        
        const bookedSlots = getBookedSlotsForDate(selectedDate);
        
        TIME_SLOTS.forEach(slot => {
            const btn = document.createElement('button');
            btn.className = 'time-slot';
            btn.innerText = `${slot} WIB`;
            
            const isBooked = bookedSlots.includes(slot);
            const isActive = selectedTime === slot;
            
            if (isBooked) {
                btn.classList.add('full-slot');
            } else {
                btn.classList.add('available');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    selectTimeSlot(slot);
                });
            }
            
            if (isActive) btn.classList.add('active-slot');
            
            timeSlotsGrid.appendChild(btn);
        });
    };

    const selectTimeSlot = (slot) => {
        selectedTime = slot;
        bookingTimeDisplay.value = `${slot} WIB`;
        renderTimeSlots();
    };

    // Month Navigation Listeners
    btnPrevMonth.addEventListener('click', (e) => {
        e.preventDefault();
        displayDate.setMonth(displayDate.getMonth() - 1);
        renderCalendar();
    });
    
    btnNextMonth.addEventListener('click', (e) => {
        e.preventDefault();
        displayDate.setMonth(displayDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial calendar rendering
    renderCalendar();
    renderTimeSlots();

    // ==========================================================================
    // Form Validation & WhatsApp Booking Submit
    // ==========================================================================
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = bookingName.value.trim();
        const phone = bookingPhone.value.trim();
        const service = bookingService.value;
        const dateStr = bookingDateDisplay.value;
        const timeStr = bookingTimeDisplay.value;
        const notes = bookingNotes.value.trim();
        
        // Validations
        if (!service) {
            showToast('Silakan pilih jenis layanan terlebih dahulu.', 'danger');
            bookingService.focus();
            return;
        }
        
        if (!selectedDate) {
            showToast('Silakan pilih tanggal reservasi pada kalender.', 'danger');
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
            return;
        }
        
        if (!selectedTime) {
            showToast('Silakan tentukan jam kunjungan yang tersedia.', 'danger');
            return;
        }
        
        if (!name) {
            showToast('Nama Lengkap wajib diisi.', 'danger');
            bookingName.focus();
            return;
        }
        
        if (!phone || phone.length < 9) {
            showToast('Masukkan nomor WhatsApp yang valid.', 'danger');
            bookingPhone.focus();
            return;
        }

        // Construct booking message
        let waMsg = `*HZX BOOKING - RESERVASI BARU*\n`;
        waMsg += `==============================\n\n`;
        waMsg += `*Layanan:* ${service}\n`;
        waMsg += `*Tanggal:* ${dateStr}\n`;
        waMsg += `*Waktu:* ${timeStr}\n\n`;
        
        waMsg += `*Detail Klien:*\n`;
        waMsg += `- Nama: ${name}\n`;
        waMsg += `- No. WA: ${phone}\n\n`;
        
        if (notes) {
            waMsg += `*Catatan Khusus:*\n`;
            waMsg += `"${notes}"\n\n`;
        }
        
        waMsg += `==============================\n`;
        waMsg += `_Mohon segera konfirmasi ketersediaan slot reservasi di atas, terima kasih!_`;
        
        const waUrl = `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(waMsg)}`;
        
        // Open WhatsApp web/app
        window.open(waUrl, '_blank');
        
        showToast('Pemesanan dikirim! Mengarahkan ke WhatsApp...', 'success');
        
        // Reset form details
        bookingForm.reset();
        selectedDate = null;
        selectedTime = null;
        renderCalendar();
        renderTimeSlots();
    });

    // ==========================================================================
    // Toast Notification System
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
        
        // Toast dismiss triggers
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => dismissToast(toast));
        
        setTimeout(() => dismissToast(toast), 4000);
    };

    const dismissToast = (toast) => {
        toast.style.animation = 'toast-out 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    };

    console.log("HZX Booking Web Application Initialized - Powered by HZXPro Studio");
});
