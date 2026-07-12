/* ==========================================================================
   HZX Fit App - Interactive Application Logic (Vanilla JS)
   Portfolio Showcase by HZXPro Studio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================================================
    // State & Constants
    // ==========================================================================
    let kcalBurned = 620;
    const dailyGoalKcal = 1000;
    const completedWorkoutsLog = [];

    // Timer States
    let timerInterval = null;
    let timerTotalSeconds = 45;
    let timerSecondsRemaining = 45;
    let isTimerRunning = false;

    const MOCK_PAST_LOGS = [
        { name: 'Warm-up Treadmill', kcal: 150, time: '07:15' },
        { name: 'Dumbbell Shoulder Press', kcal: 100, time: '07:42' }
    ];

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const tabItems = document.querySelectorAll('.tab-item');
    const screens = document.querySelectorAll('.screen');
    
    // Dashboard Elements
    const kcalBurnedVal = document.getElementById('kcal-burned-val');
    const circleFill = document.querySelector('.circle-fill');
    const exChecks = document.querySelectorAll('.ex-check');
    const activityLogsContainer = document.getElementById('activity-logs-container');
    
    // Timer Elements
    const timerDisplayString = document.getElementById('timer-display-string');
    const timerProgressFill = document.getElementById('timer-progress-fill');
    const presetTimeBtns = document.querySelectorAll('.preset-time-btn');
    const btnTimerToggle = document.getElementById('btn-timer-toggle');
    const btnTimerReset = document.getElementById('btn-timer-reset');
    
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

        // Refresh History screen logs
        if (screenId === 'screen-history') {
            renderActivityLogs();
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

    document.getElementById('card-go-timer').addEventListener('click', () => switchScreen('screen-timer'));

    // ==========================================================================
    // Checkbox Exercise Plan Controls
    // ==========================================================================
    exChecks.forEach(check => {
        check.addEventListener('change', () => {
            const kcal = parseFloat(check.getAttribute('data-kcal')) || 0;
            const name = check.getAttribute('data-name');
            const itemRow = check.closest('.exercise-item');
            
            if (check.checked) {
                // Add completed class
                itemRow.classList.add('completed');
                kcalBurned += kcal;
                
                // Add to completed logs
                completedWorkoutsLog.push({
                    name: name,
                    kcal: kcal,
                    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                });
                
                showToast(`Log: ${name} (+${kcal} Kcal) selesai!`, 'success');
            } else {
                // Remove completed class
                itemRow.classList.remove('completed');
                kcalBurned -= kcal;
                
                // Remove from completed logs
                const idx = completedWorkoutsLog.findIndex(item => item.name === name);
                if (idx > -1) {
                    completedWorkoutsLog.splice(idx, 1);
                }
                
                showToast(`Latihan "${name}" dibatalkan.`, 'danger');
            }
            
            updateKcalDisplay();
        });
    });

    const updateKcalDisplay = () => {
        // Upper values
        kcalBurnedVal.innerText = kcalBurned;
        
        // Circular stroke math
        const pct = Math.min(100, Math.round((kcalBurned / dailyGoalKcal) * 100));
        circleFill.setAttribute('stroke-dasharray', `${pct}, 100`);
    };

    updateKcalDisplay();

    // ==========================================================================
    // Set Recovery Rest Countdown stopwatch timer widget
    // ==========================================================================
    const updateTimerDisplay = () => {
        const mins = Math.floor(timerSecondsRemaining / 60);
        const secs = timerSecondsRemaining % 60;
        
        const displayStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        timerDisplayString.innerText = displayStr;
        
        // Progress circular ring
        const pct = (timerSecondsRemaining / timerTotalSeconds) * 100;
        timerProgressFill.setAttribute('stroke-dasharray', `${pct}, 100`);
    };

    const stopTimerInterval = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        isTimerRunning = false;
        btnTimerToggle.innerText = 'Mulai';
        btnTimerToggle.classList.remove('btn-secondary');
        btnTimerToggle.classList.add('btn-primary');
    };

    const startTimerInterval = () => {
        isTimerRunning = true;
        btnTimerToggle.innerText = 'Jeda';
        btnTimerToggle.classList.remove('btn-primary');
        btnTimerToggle.classList.add('btn-secondary');
        
        timerInterval = setInterval(() => {
            if (timerSecondsRemaining > 0) {
                timerSecondsRemaining -= 1;
                updateTimerDisplay();
            } else {
                // Done!
                stopTimerInterval();
                showToast('Waktu istirahat selesai! Masuk ke set berikutnya! 💪', 'success');
                
                // Play simple alert sound (fallback to visual alerts)
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = audioContext.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
                    osc.connect(audioContext.destination);
                    osc.start();
                    osc.stop(audioContext.currentTime + 0.3);
                } catch(e) {
                    console.log("Audio not supported or allowed yet");
                }
            }
        }, 1000);
    };

    // Preset pills listeners
    presetTimeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stopTimerInterval();
            
            presetTimeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const secs = parseFloat(btn.getAttribute('data-seconds')) || 45;
            timerTotalSeconds = secs;
            timerSecondsRemaining = secs;
            
            updateTimerDisplay();
        });
    });

    btnTimerToggle.addEventListener('click', () => {
        if (isTimerRunning) {
            stopTimerInterval();
        } else {
            if (timerSecondsRemaining === 0) {
                // If finished, reset before running
                timerSecondsRemaining = timerTotalSeconds;
                updateTimerDisplay();
            }
            startTimerInterval();
        }
    });

    btnTimerReset.addEventListener('click', () => {
        stopTimerInterval();
        timerSecondsRemaining = timerTotalSeconds;
        updateTimerDisplay();
        showToast('Timer istirahat direset.', 'danger');
    });

    updateTimerDisplay();

    // ==========================================================================
    // Render Workout Log History
    // ==========================================================================
    const renderActivityLogs = () => {
        activityLogsContainer.innerHTML = '';
        
        // Merge presets and active completed ones
        const allLogs = [...completedWorkoutsLog, ...MOCK_PAST_LOGS];
        
        if (allLogs.length === 0) {
            activityLogsContainer.innerHTML = '<p style="text-align:center; font-size:12px; color:var(--text-secondary); padding: 40px 0;">Belum ada log latihan untuk hari ini.</p>';
            return;
        }
        
        allLogs.forEach(log => {
            const cardHtml = `
                <div class="log-item-card">
                    <div class="log-details">
                        <h4>${log.name}</h4>
                        <span>Hari ini pukul ${log.time}</span>
                    </div>
                    <span class="log-value">+${log.kcal} Kcal</span>
                </div>
            `;
            activityLogsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
    };

    // Reset demo state
    document.getElementById('btn-demo-reset').addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset calories
        kcalBurned = 620;
        updateKcalDisplay();
        
        // Reset checks
        exChecks.forEach(check => {
            check.checked = false;
            check.closest('.exercise-item').classList.remove('completed');
        });
        
        // Clear active logs
        completedWorkoutsLog.length = 0;
        
        // Stop timers
        stopTimerInterval();
        timerSecondsRemaining = timerTotalSeconds;
        updateTimerDisplay();
        
        showToast('Demo data log kebugaran direset.', 'success');
        switchScreen('screen-home');
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

    console.log("HZX Fit App Mobile Loaded - Created by HZXPro Studio");
});
