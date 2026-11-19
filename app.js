// Cinematic & Luxury Birthday Experience - Restructured Dashboard Logic

// Global State
let activeScreen = 'screen-lock';
let activeTab = 'tab-welcome';
let currentLanguage = 'darija';
let activeCandles = 3;
let musicPlaying = false;
let currentPlaylistTrack = '1'; // '1', '2', '3'
let lockInteractionActive = true;
let musicPausedForVideo = false;
let voicePlayerInitialized = false;
let musicPausedForVoiceNote = false;

// Passcode Lock State
let enteredCode = '';
const correctCode = '2011';

// Audio Context & Mic
let audioCtx = null;
let melodyTimeout = null;
let activeSynthNodes = [];
let micStream = null;
let micSource = null;
let micAnalyser = null;
let micInterval = null;
let lastBlowTime = 0;

// Typewriter state
let typewriterTimeout = null;

// Countdown State
let countdownInterval = null;

// Equalizer State
let eqAnimationActive = false;

// Instrument Control
let activeInstrument = 'piano';

// Canvas 1: Starry Sky Background
let skyCanvas, skyCtx;
let stars = [];
let shootingStars = [];
let stardustParticles = [];
let festiveParticles = [];
let cursor = { x: -9999, y: -9999 };

// Canvas 2: Fireworks
let fireworksCanvas, fireworksCtx;
let activeFireworks = [];
let fireworkParticles = [];
let fireworksLoopActive = false;
let skyFlashAlpha = 0;
let skyFlashColor = '';

// Canvas 3: Truth or Dare Wheel
let wheelCanvas, wheelCtx;
const sectors = [
    { label_darija: "سؤال صريح 💬", color: "#ff2a6d", key: "item_1" },
    { label_darija: "سوليني سؤال ❓", color: "#d81b60", key: "item_2" },
    { label_darija: "طلب نلبيه ليك 🎁", color: "#c2185b", key: "item_3" },
    { label_darija: "موقف مضحك 😂", color: "#ad1457", key: "item_4" },
    { label_darija: "سر الطفولة 🤫", color: "#880e4f", key: "item_5" },
    { label_darija: "نصيحة الأخت 💡", color: "#b71c1c", key: "item_6" },
    { label_darija: "سيلفي العيد 🤳", color: "#8d022b", key: "item_7" },
    { label_darija: "أوديو مضحك 🎙️", color: "#ff2a6d", key: "item_8" },
    { label_darija: "لقب الطفولة 👑", color: "#d81b60", key: "item_9" },
    { label_darija: "وعد بين الخاوة 🤝", color: "#c2185b", key: "item_10" },
    { label_darija: "أكلة مفضلة 🍕", color: "#ad1457", key: "item_11" },
    { label_darija: "أمنية لأختي 🌟", color: "#d4af37", key: "item_12" }
];
let wheelAngle = 0;
let wheelSpinning = false;
let spinVelocity = 0;
const friction = 0.985;

// Coupons database
const couponCodes = {
    hug: 'LOUBNA-HUG-8822',
    dinner: 'LOUBNA-DINNER-4731',
    massage: 'LOUBNA-MASS-1094',
    shopping: 'LOUBNA-SHOP-2011'
};

const translations = {
    darija: {
        lockTitle: "امممممم.. واش نتي بصح أختي لبنى؟ دخلي الكود السري باش تفتحي السيت 🔐✨",
        lockErrorMsg: "غلط! ماشي هو هاد الكود، عاودي جربي 😜",
        welcomeTitle: "أختي الكبيرة لالة لبنى 🌸💖",
        welcomeDesc: "عيد ميلاد سعيد يا أحلى وأطيب أخت فـ الدنيا! 🎂✨ ربي يخليك لينا ويحفظك ويطول فـ عمرك، وديما ضاحكة ومنورة علينا الدار. كنتمنى ليك فهاد العام الجديد كاع داكشي الزوين اللي كتمناي يارب ❤️",
        countdownTitle: "شحال داز من نهار نورتي فيه الدنيا 🌸✨",
        labelYears: "سنوات",
        labelDays: "أيام",
        labelHours: "ساعات",
        labelMinutes: "دقائق",
        labelSeconds: "ثواني",
        birthdayCelebrate: "عيد ميلاد سعيد يا أغلى أخت لبنى! 🎉💖",
        btnNext: "التالي",
        btnPrev: "السابق",

        // Memories (Welcome Video)
        titleMemories: "فيديو خاص بيك يا لالة لبنى 🎬✨",
        instructionMemories: "تفرجي فهاد الفيديو اللي مقاد ليك بمناسبة عيد ميلادك 🌸💖",
        
        // Photo Album Tab
        titlePhotos: "تصاور الزمان والضحكة الزوينة 📸✨",
        instructionPhotos: "كليكي على أي تصويرة باش تكبريها وتشوفيها واضحة 💖",
        captionPhoto1: "أحلى وأجمل أخت، ربي يحفظك لينا ويخلي ديك الابتسامة دايماً منورة 🌸✨",
        captionPhoto2: "ضحكتك كتفرح الدار كاملة، الله يخليك ديما ضاحكة وفرحانة وتاج فوق راسنا 👑✨",
        captionPhoto3: "أختي الكبيرة، نبع الحنان والقلب الكبير اللي ديما كانلقاه فـ وقت الشدة 💖🌟",

        // Cake
        cakeTitleDone: "سنة حلوة يا لبنى! لعقوبة لـ 100 عام بالصحة والراحة يا أختي 🎂✨",
        cakeInstructionDone: "تمناي أمنية ونفخي فالمايك (أو كليكي على الشمع) باش تطفيه 🕯️",
        micListening: "المايك خدام 🎤 - نفخي على الشاشة باش طفي الشمع!",
        micInactive: "كليكي على الشمع باش تطفيه 🕯️",
        fireworksInstruction: "✨ كليكي فـ الشاشة باش تطلقي المفرقعات ديالك! ✨",
        
        // Jar
        titleJar: "ميساجات من القلب 💌🌸",
        instructionJar: "كليكي على القرعة باش تجبدي كل مرة ميساج من عند خوك خالد 🌸",
        btnOpenJarNote: "جبدي ميساج 💌",
        textJarInstaCue: "خوك خالد ديما معاك ❤️✨",
        btnOpenJarAnotherNote: "جبدي ميساج آخر 💌",
        
        // Music
        titleMusic: "أغاني العيد 🎵🌸",
        instructionMusic: "طلقي المزيكا واحتفلي بعيدك يا لالة لبنى 🎂✨",
        tempoLabelPrefix: "السرعة: ",
        instrumentLabel: "الآلة:",
        eqTitleLabel: "محلل الصوت 🎶",
        
        // Final Voice Note
        finalVoiceTitle: "كلمة الختام لأختي لبنى 🎧✨",
        finalVoiceDesc: "طلقي الأوديو وتصنتي لأحلى ميساج من عند خوك خالد 🌸💖",
        btnReplayVoice: "عاودي الأوديو 🔄",
        lockSite: "قفل السيت 🔐",
        romanticNotes: [
            "أختي لبنى، ربي يخليك ليا، والله يكتر خيرك على كل وقفة وقفتيها معايا فاش كنت كنحتاجك. راك ماشي غير أخت، راك بحال الوالدة الثانية ديالي ❤️",
            "ضحكتك هي اللي منورة لينا الدار يا لالة لبنى. الله يعطيك شي عام زوين تفرحي فيه بكل ما تمنيتي فـ خاطرك يارب 🤲✨",
            "واخا بعض المرات كنتخاصمو ونضحكو، راك عزيزة وغالية وما عنديش بحالك فهاد الدنيا. عيد ميلاد سعيد يا أحلى أخت! 🎂🎉",
            "الخاوة هي السند، ونتي أخت كبيرة اللي الواحد يفتخر بيها ويحطها تاج فوق راسو. لهلا يخطيك عليا يا لبنى 👑🌸",
            "كنتمنى ليك فهاد العام الجديد راحة البال والتيسير فكل خطوة، وسنة عامرة فرحة وضحك. خوك خالد ديما معاك ❤️"
        ],
        
        // Menu navigation
        menuWelcome: "الترحيب",
        menuMemories: "فيديو ترحيبي",
        menuPhotos: "ألبوم الصور",
        menuCake: "حلوى الميلاد",
        menuJar: "رسائل سرية",
        menuMusic: "أغاني العيد",
        menuLetter: "صوت الختام"
    }
};

// Initial loading
window.addEventListener('DOMContentLoaded', () => {
    initSkyCanvas();
    initEventListeners();
    initStepNavigation();
    updateLanguage(); // Default Darija
    startCountdownTimer();
    
    // Set initial lock background
    document.body.className = 'bg-lock';
});

// Resize canvases on window resize
window.addEventListener('resize', () => {
    resizeCanvases();
});

// Event Listeners setup
function initEventListeners() {
    // Image error fallback
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (this.src && !this.src.endsWith('loubna.jpg') && !this.dataset.fallbackTried) {
                this.dataset.fallbackTried = 'true';
                this.src = 'loubna.jpg';
            }
        });
    });

    // Lock screen keypad bindings
    document.querySelectorAll('.key-btn[data-val]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!lockInteractionActive) return;
            initAudioContext();
            
            const errMsg = document.getElementById('lock-error-msg');
            if (errMsg) errMsg.classList.add('lock-error-hidden');

            const num = btn.getAttribute('data-val');
            if (enteredCode.length < 4) {
                enteredCode += num;
                playKeyboardClick();
                updatePasscodeDots();
                
                if (enteredCode.length === 4) {
                    validatePasscode();
                }
            }
        });
    });

    const clearBtn = document.getElementById('key-btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!lockInteractionActive) return;
            enteredCode = '';
            playKeyboardClick();
            updatePasscodeDots();
            const errMsg = document.getElementById('lock-error-msg');
            if (errMsg) errMsg.classList.add('lock-error-hidden');
        });
    }


    // Global Top Bar Music toggle
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            initAudioContext();
            toggleMusic(!musicPlaying);
        });
    }

    // Mobile Hamburger Menu drawer toggler
    const mobToggle = document.getElementById('mobile-nav-toggle');
    if (mobToggle) {
        mobToggle.addEventListener('click', () => {
            toggleMobileDrawer();
        });
    }

    const backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            toggleMobileDrawer(false);
        });
    }

    // Dashboard navigation buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            activateTab(tabId);
        });
    });

    // Replay Voice Note
    const btnReplayVoice = document.getElementById('btn-replay-voice');
    if (btnReplayVoice) {
        btnReplayVoice.addEventListener('click', () => {
            const audio = document.getElementById('final-voice-audio');
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log(e));
            }
        });
    }

    // Reset lock site
    const btnReset = document.getElementById('btn-dashboard-reset');
    if (btnReset) {
        btnReset.addEventListener('click', resetAll);
    }

    // Interactive message jar buttons
    const btnJar = document.getElementById('btn-open-jar-note');
    if (btnJar) {
        btnJar.addEventListener('click', openLoveNote);
    }
    const jarTrigger = document.getElementById('love-jar-trigger');
    if (jarTrigger) {
        jarTrigger.addEventListener('click', openLoveNote);
    }

    // Spin canvas wheel button
    const btnSpinWheel = document.getElementById('btn-spin-wheel-canvas');
    if (btnSpinWheel) {
        btnSpinWheel.addEventListener('click', spinWheelCanvas);
    }

    // Rebuild cake button
    const btnRebuildCake = document.getElementById('btn-rebuild-cake');
    if (btnRebuildCake) {
        btnRebuildCake.addEventListener('click', () => {
            triggerCakeBuilderSequence();
        });
    }

    // Cake candle clicks fallbacks
    document.querySelectorAll('.candle-container').forEach(c => {
        c.addEventListener('click', () => {
            if (!c.classList.contains('extinguished')) {
                extinguishSpecificCandle(c);
            }
        });
    });

    // Dashboard Music Controls
    const dbMusicToggle = document.getElementById('btn-dashboard-music-toggle');
    if (dbMusicToggle) {
        dbMusicToggle.addEventListener('click', () => {
            initAudioContext();
            toggleMusic(!musicPlaying);
        });
    }

    const tempoRange = document.getElementById('tempo-range');
    if (tempoRange) {
        tempoRange.addEventListener('input', (e) => {
            const bpm = parseInt(e.target.value);
            updateTempo(bpm);
        });
    }

    // Instrument selections
    const instPiano = document.getElementById('inst-piano');
    if (instPiano) {
        instPiano.addEventListener('click', () => selectInstrument('piano'));
    }
    const instHarp = document.getElementById('inst-harp');
    if (instHarp) {
        instHarp.addEventListener('click', () => selectInstrument('harp'));
    }
    const instBox = document.getElementById('inst-box');
    if (instBox) {
        instBox.addEventListener('click', () => selectInstrument('musicbox'));
    }

    // Welcome photo heart burst triggering
    const photoTrigger = document.getElementById('welcome-photo-trigger');
    if (photoTrigger) {
        photoTrigger.addEventListener('click', (e) => {
            spawnHeartBurst(e.clientX, e.clientY);
        });
    }

    // Mouse coordinates tracker for stardust
    window.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        spawnStardust(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            cursor.x = e.touches[0].clientX;
            cursor.y = e.touches[0].clientY;
            spawnStardust(cursor.x, cursor.y);
        }
    });

    // Screen clicking for custom cake fireworks
    const cakeCard = document.querySelector('.cake-card');
    if (cakeCard) {
        cakeCard.addEventListener('click', (e) => {
            if (activeCandles > 0) return;
            // Ignore if clicked buttons or canvas itself directly (which has pointer-events: none)
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            if (fireworksCanvas) {
                const rect = fireworksCanvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                launchCustomFirework(clickX, clickY);
            }
        });
    }

    // Lightbox modal listeners for screenshots click-to-zoom
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        document.querySelectorAll('.chat-bubble-image, .festive-img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            });
        });
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    // Graceful luxury fallback for missing photos of Loubna
    const fallbackSvg = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2a081a"/>
                    <stop offset="50%" stop-color="#4a0e2e"/>
                    <stop offset="100%" stop-color="#15020c"/>
                </linearGradient>
                <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#fdf5c4" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#bg)"/>
            <circle cx="200" cy="200" r="140" fill="url(#goldGlow)"/>
            <circle cx="200" cy="200" r="130" fill="none" stroke="#d4af37" stroke-width="3" stroke-dasharray="8 6"/>
            <text x="200" y="165" font-size="70" text-anchor="middle">👑</text>
            <text x="200" y="235" font-family="'Playfair Display', serif" font-weight="bold" font-size="30" text-anchor="middle" fill="#fdf5c4">Loubna</text>
            <text x="200" y="275" font-family="'Inter', sans-serif" font-size="18" text-anchor="middle" fill="#d4af37">أختي الكبيرة الغالية 🌸</text>
        </svg>
    `);

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = fallbackSvg;
        });
        if (img.complete && img.naturalWidth === 0) {
            img.src = fallbackSvg;
        }
    });
}

// Passcode dots
function updatePasscodeDots() {
    const dots = document.querySelectorAll('.passcode-dot');
    dots.forEach((dot, idx) => {
        dot.className = 'passcode-dot';
        if (idx < enteredCode.length) {
            dot.classList.add('filled');
        }
    });
}

// Passcode validation
function validatePasscode() {
    lockInteractionActive = false;
    const dots = document.querySelectorAll('.passcode-dot');
    
    if (enteredCode === correctCode) {
        dots.forEach(dot => {
            dot.className = 'passcode-dot success';
        });
        
        playSuccessChime();

        confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.65 },
            colors: ['#d4af37', '#fdf5c4', '#7943e8', '#ffffff']
        });

        setTimeout(() => {
            const topBar = document.getElementById('top-bar');
            if (topBar) topBar.classList.remove('top-bar-hidden');
            
            switchScreen('screen-dashboard');
            activateTab('tab-welcome');
            toggleMusic(true); // Auto-start background melody
            lockInteractionActive = true;
        }, 900);

    } else {
        dots.forEach(dot => {
            dot.className = 'passcode-dot error';
        });
        
        const grid = document.querySelector('.keypad-grid');
        if (grid) grid.classList.add('shake');
        playErrorBuzzer();

        const errMsg = document.getElementById('lock-error-msg');
        if (errMsg) errMsg.classList.remove('lock-error-hidden');

        setTimeout(() => {
            enteredCode = '';
            updatePasscodeDots();
            if (grid) grid.classList.remove('shake');
            lockInteractionActive = true;
        }, 750);
    }
}

// Language Switcher (Locked to Darija)
function setLanguage(lang) {
    currentLanguage = 'darija';
    
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
        appContainer.classList.add('rtl-layout');
    }

    updateLanguage();

    // Specific updates depending on active view
    if (activeScreen === 'screen-dashboard') {
        if (activeTab === 'tab-letter') {
            initFinalVoicePlayer();
        }
    }
}

function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Page 1: Lock screen
    const lockTitle = document.getElementById('lock-title');
    if (lockTitle) lockTitle.textContent = t.lockTitle;

    const lockErrorMsg = document.getElementById('lock-error-msg');
    if (lockErrorMsg) lockErrorMsg.textContent = t.lockErrorMsg;

    // Menu tabs
    const menus = ['welcome', 'memories', 'photos', 'cake', 'jar', 'music', 'letter'];
    menus.forEach(m => {
        const el = document.getElementById(`menu-${m}`);
        if (el) el.textContent = t[`menu${m.charAt(0).toUpperCase() + m.slice(1)}`];
    });

    // Welcome tab
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = t.welcomeTitle;

    const welcomeDesc = document.getElementById('welcome-desc');
    if (welcomeDesc) welcomeDesc.textContent = t.welcomeDesc;

    // Countdown title
    const countTitle = document.getElementById('countdown-title');
    if (countTitle && countdownInterval) {
        countTitle.textContent = t.countdownTitle;
    }
    const lblDays = document.getElementById('label-days');
    if (lblDays) lblDays.textContent = t.labelDays;
    const lblHours = document.getElementById('label-hours');
    if (lblHours) lblHours.textContent = t.labelHours;
    const lblMins = document.getElementById('label-minutes');
    if (lblMins) lblMins.textContent = t.labelMinutes;
    const lblSecs = document.getElementById('label-seconds');
    if (lblSecs) lblSecs.textContent = t.labelSeconds;

    // Memories tab
    const memTitle = document.getElementById('title-memories');
    if (memTitle) memTitle.textContent = t.titleMemories;
    const memInstr = document.getElementById('instruction-memories');
    if (memInstr) memInstr.textContent = t.instructionMemories;

    // Photo Album tab
    const phTitle = document.getElementById('title-photos');
    if (phTitle) phTitle.textContent = t.titlePhotos;
    const phInstr = document.getElementById('instruction-photos');
    if (phInstr) phInstr.textContent = t.instructionPhotos;

    // Cake tab
    const banner = document.getElementById('cake-title-banner');
    const instruction = document.getElementById('cake-instruction');
    if (activeCandles === 0) {
        if (banner) banner.textContent = currentLanguage === 'darija' ? "شوف السماء كتضوي !" : "Regarde le ciel s'illuminer !";
        if (instruction) instruction.textContent = currentLanguage === 'darija' ? "شوف السماء كتضوي !" : "Regarde le ciel s'illuminer !";
    } else {
        const bottomLayer = document.getElementById('cake-layer-1');
        if (bottomLayer && !bottomLayer.classList.contains('hidden')) {
            if (banner) banner.textContent = t.cakeTitleDone;
            if (instruction) instruction.textContent = t.cakeInstructionDone;
        } else {
            if (banner) banner.textContent = '';
            if (instruction) instruction.textContent = '';
        }
    }
    const micText = document.getElementById('mic-status-text');
    if (micText) {
        if (micStream) {
            micText.textContent = t.micListening;
        } else {
            micText.textContent = t.micInactive;
        }
    }
    const fireworksInstruction = document.getElementById('fireworks-instruction');
    if (fireworksInstruction) fireworksInstruction.textContent = t.fireworksInstruction;

    // Jar tab
    const titleJar = document.getElementById('title-jar');
    if (titleJar) titleJar.textContent = t.titleJar;
    const instrJar = document.getElementById('instruction-jar');
    if (instrJar) instrJar.textContent = t.instructionJar;
    const btnOpenJarNote = document.getElementById('btn-open-jar-note');
    if (btnOpenJarNote) {
        btnOpenJarNote.textContent = btnOpenJarNote.textContent.includes('أخرى') || btnOpenJarNote.textContent.includes('autre') ? 
            t.btnOpenJarAnotherNote : t.btnOpenJarNote;
    }
    const textJarInsta = document.getElementById('text-jar-insta-cue');
    if (textJarInsta) textJarInsta.textContent = t.textJarInstaCue;

    // Music tab
    const titleMusic = document.getElementById('title-music');
    if (titleMusic) titleMusic.textContent = t.titleMusic;
    const instrMusic = document.getElementById('instruction-music');
    if (instrMusic) instrMusic.textContent = t.instructionMusic;
    const eqLabel = document.getElementById('eq-title-label');
    if (eqLabel) eqLabel.textContent = t.eqTitleLabel;



    // Final Voice Note tab
    const fvTitle = document.getElementById('final-voice-title');
    if (fvTitle) fvTitle.textContent = t.finalVoiceTitle;
    const fvDesc = document.getElementById('final-voice-desc');
    if (fvDesc) fvDesc.textContent = t.finalVoiceDesc;
    const btnReplayVoice = document.getElementById('btn-replay-voice');
    if (btnReplayVoice) btnReplayVoice.textContent = t.btnReplayVoice;
    const btnResetSite = document.getElementById('btn-dashboard-reset');
    if (btnResetSite) btnResetSite.textContent = t.lockSite;

    // Step navigation buttons translation
    document.querySelectorAll('.step-next-label').forEach(el => el.textContent = t.btnNext);
    document.querySelectorAll('.step-prev-label').forEach(el => el.textContent = t.btnPrev);
}

// Screen Routing switcher
function switchScreen(screenId) {
    const current = document.querySelector('.screen.active');
    if (current) {
        current.classList.remove('active');
    }
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        activeScreen = screenId;
    }
    
    // Class overrides on body
    document.body.className = '';
    if (screenId === 'screen-lock') {
        document.body.classList.add('bg-lock');
    } else {
        document.body.classList.add('bg-final'); // dashboard background
    }
}

// Mobile Slide-out Drawer Controller
function toggleMobileDrawer(open) {
    const sidebar = document.getElementById('dashboard-sidebar');
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const backdrop = document.getElementById('drawer-backdrop');
    
    if (open === undefined) {
        open = !sidebar.classList.contains('drawer-open');
    }
    
    if (sidebar) sidebar.classList.toggle('drawer-open', open);
    if (toggleBtn) toggleBtn.classList.toggle('open', open);
    if (backdrop) {
        if (open) {
            backdrop.classList.remove('drawer-backdrop-hidden');
        } else {
            backdrop.classList.add('drawer-backdrop-hidden');
        }
    }
}

// Dashboard Tabs Router
function activateTab(tabId) {
    if (activeTab === tabId && document.getElementById(tabId).classList.contains('active-panel')) {
        toggleMobileDrawer(false); // Close drawer if clicking currently active tab
        return;
    }

    // Clean up leaving tab parameters
    if (activeTab === 'tab-cake') {
        stopMicrophone();
        stopFireworksLoop();
    }

    // Pause any playing videos when leaving tabs
    const v1 = document.getElementById('memories-video');
    if (v1 && !v1.paused) {
        v1.pause();
        const p1 = document.getElementById('video-play-btn');
        if (p1) p1.classList.remove('video-playing');
        const c1 = document.getElementById('btn-video-play');
        if (c1) c1.textContent = "▶ تشغيل الفيديو";
    }
    // Pause final voice note if leaving tab
    const vAudio = document.getElementById('final-voice-audio');
    if (vAudio && !vAudio.paused) {
        vAudio.pause();
        const cardEl = document.getElementById('voice-note-card-el');
        if (cardEl) cardEl.classList.remove('voice-playing');
        const playIcon = document.getElementById('voice-play-icon');
        const playLabel = document.getElementById('voice-play-label');
        if (playIcon) playIcon.textContent = '▶';
        if (playLabel) playLabel.textContent = 'خدمي الأوديو 🎙️';
        if (musicPausedForVoiceNote) {
            musicPausedForVoiceNote = false;
            toggleMusic(true);
        }
    }
    if (musicPausedForVideo) {
        musicPausedForVideo = false;
        toggleMusic(true);
    }

    // Set active tab buttons
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    // Toggle panel displays
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active-panel', panel.id === tabId);
    });

    activeTab = tabId;

    // Auto-close mobile drawer when switching panels
    toggleMobileDrawer(false);

    // Trigger tab entry events
    if (tabId === 'tab-welcome') {
        startCountdownTimer();
    } else if (tabId === 'tab-memories') {
        initWelcomeVideo();
    } else if (tabId === 'tab-cake') {
        triggerCakeBuilderSequence();
    } else if (tabId === 'tab-music') {
        initMusicTab();
    } else if (tabId === 'tab-letter') {
        initFinalVoicePlayer();
    }
}

// Step-by-Step Navigation Builder
function initStepNavigation() {
    const panels = [
        'tab-welcome',
        'tab-memories',
        'tab-photos',
        'tab-cake',
        'tab-jar',
        'tab-music',
        'tab-letter'
    ];
    
    panels.forEach((panelId, index) => {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        
        // Create nav container
        const navBar = document.createElement('div');
        navBar.className = 'step-navigation-bar';
        
        // Back Button
        if (index > 0) {
            const backBtn = document.createElement('button');
            backBtn.className = 'step-btn prev-step-btn';
            backBtn.innerHTML = `<span class="step-btn-icon">⬅️</span> <span class="step-prev-label" data-key="btnPrev">السابق</span>`;
            backBtn.addEventListener('click', () => {
                activateTab(panels[index - 1]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            navBar.appendChild(backBtn);
        }
        
        // Next Button
        if (index < panels.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'step-btn next-step-btn';
            nextBtn.innerHTML = `<span class="step-next-label" data-key="btnNext">التالي</span> <span class="step-btn-icon">➡️</span>`;
            nextBtn.addEventListener('click', () => {
                activateTab(panels[index + 1]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            navBar.appendChild(nextBtn);
        }
        
        // Append inside the glass-card of the panel
        const card = panel.querySelector('.glass-card');
        if (card) {
            card.appendChild(navBar);
        } else {
            panel.appendChild(navBar);
        }
    });
}

// ==========================================
// TAB 1: COUNTDOWN ENGINE
// ==========================================
function updateCountdown() {
    const birthDate = new Date("2001-11-20T00:00:00");
    const now = new Date();
    
    let years = now.getFullYear() - birthDate.getFullYear();
    let birthMonth = birthDate.getMonth();
    let birthDay = birthDate.getDate();
    
    // Create a target date for the birthday in the current year at midnight
    let birthdayThisYear = new Date(now.getFullYear(), birthMonth, birthDay, 0, 0, 0);
    
    let lastBirthday;
    if (now < birthdayThisYear) {
        years--;
        lastBirthday = new Date(now.getFullYear() - 1, birthMonth, birthDay, 0, 0, 0);
    } else {
        lastBirthday = birthdayThisYear;
    }
    
    const diffMs = now - lastBirthday;
    const diffSecs = Math.floor(diffMs / 1000);
    
    const days = Math.floor(diffSecs / (3600 * 24));
    const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
    const minutes = Math.floor((diffSecs % 3600) / 60);
    const seconds = diffSecs % 60;
    
    const yVal = document.getElementById('years');
    const dVal = document.getElementById('days');
    const hVal = document.getElementById('hours');
    const mVal = document.getElementById('minutes');
    const sVal = document.getElementById('seconds');
    const titleEl = document.getElementById('countdown-title');
    
    if (yVal) yVal.textContent = String(years).padStart(2, '0');
    if (dVal) dVal.textContent = String(days).padStart(2, '0');
    if (hVal) hVal.textContent = String(hours).padStart(2, '0');
    if (mVal) mVal.textContent = String(minutes).padStart(2, '0');
    if (sVal) sVal.textContent = String(seconds).padStart(2, '0');
    
    if (titleEl) {
        titleEl.textContent = translations[currentLanguage].countdownTitle;
    }
}

function startCountdownTimer() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Spawns bursting hearts on welcome image clicks
function spawnHeartBurst(x, y) {
    playPopSound();
    for (let i = 0; i < 8; i++) {
        const size = Math.random() * 15 + 10;
        stardustParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            size: size,
            color: 'rgba(216, 27, 96, ', // pink
            alpha: 1.0,
            fadeSpeed: 0.02 + Math.random() * 0.02
        });
    }
}


// ==========================================
// TAB 2: WELCOME MEMORIES VIDEO
// ==========================================
let welcomeVideoInitialized = false;
function initWelcomeVideo() {
    const video = document.getElementById('memories-video');
    const playOverlay = document.getElementById('video-play-btn');
    const playControl = document.getElementById('btn-video-play');
    const muteControl = document.getElementById('btn-video-mute');
    
    if (!video || welcomeVideoInitialized) return;
    welcomeVideoInitialized = true;
    
    const togglePlay = () => {
        if (video.paused) {
            video.play().catch(e => console.log("Video playback error:", e));
            if (playOverlay) playOverlay.classList.add('video-playing');
            if (playControl) playControl.textContent = "⏸ توقيف الفيديو";
            if (musicPlaying) {
                musicPausedForVideo = true;
                toggleMusic(false);
            }
        } else {
            video.pause();
            if (playOverlay) playOverlay.classList.remove('video-playing');
            if (playControl) playControl.textContent = "▶ تشغيل الفيديو";
            if (musicPausedForVideo) {
                musicPausedForVideo = false;
                toggleMusic(true);
            }
        }
    };
    
    video.onclick = togglePlay;
    if (playOverlay) playOverlay.onclick = togglePlay;
    if (playControl) playControl.onclick = togglePlay;
    
    if (muteControl) {
        muteControl.onclick = () => {
            video.muted = !video.muted;
            muteControl.textContent = video.muted ? "🔊 تشغيل الصوت" : "🔇 كتم الصوت";
        };
    }
    
    video.onended = () => {
        if (playOverlay) playOverlay.classList.remove('video-playing');
        if (playControl) playControl.textContent = "▶ تشغيل الفيديو";
        if (musicPausedForVideo) {
            musicPausedForVideo = false;
            toggleMusic(true);
        }
    };
}

// ==========================================
// TAB 8: DEDICATED LUXURY FINAL VOICE NOTE PLAYER
// ==========================================
function formatAudioTime(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function initFinalVoicePlayer() {
    const audio = document.getElementById('final-voice-audio');
    const playBtn = document.getElementById('btn-final-voice-play');
    const cardEl = document.getElementById('voice-note-card-el');
    const progressFill = document.getElementById('voice-progress-fill');
    const progressWrapper = document.getElementById('voice-progress-wrapper');
    const curTimeEl = document.getElementById('final-voice-cur-time');
    const durEl = document.getElementById('final-voice-duration');
    const playIcon = document.getElementById('voice-play-icon');
    const playLabel = document.getElementById('voice-play-label');
    const replayBtn = document.getElementById('btn-replay-voice');

    if (!audio) return;

    if (!voicePlayerInitialized) {
        voicePlayerInitialized = true;

        const updatePlayState = (isPlaying) => {
            if (isPlaying) {
                if (cardEl) cardEl.classList.add('voice-playing');
                if (playIcon) playIcon.textContent = '⏸';
                if (playLabel) playLabel.textContent = 'حبسي الأوديو ⏸';
            } else {
                if (cardEl) cardEl.classList.remove('voice-playing');
                if (playIcon) playIcon.textContent = '▶';
                if (playLabel) playLabel.textContent = 'خدمي الأوديو 🎙️';
            }
        };

        const toggleVoicePlay = () => {
            if (audio.paused) {
                // If background music is playing, pause it while listening to Khalid's voice note
                if (musicPlaying) {
                    musicPausedForVoiceNote = true;
                    toggleMusic(false);
                }
                audio.play().then(() => {
                    updatePlayState(true);
                }).catch(err => {
                    console.log('Voice note playback error:', err);
                });
            } else {
                audio.pause();
                updatePlayState(false);
                if (musicPausedForVoiceNote) {
                    musicPausedForVoiceNote = false;
                    toggleMusic(true);
                }
            }
        };

        if (playBtn) playBtn.onclick = toggleVoicePlay;

        audio.addEventListener('loadedmetadata', () => {
            if (durEl && audio.duration) {
                durEl.textContent = formatAudioTime(audio.duration);
            }
        });

        audio.addEventListener('timeupdate', () => {
            if (curTimeEl) {
                curTimeEl.textContent = formatAudioTime(audio.currentTime);
            }
            if (progressFill && audio.duration) {
                const pct = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = pct + '%';
            }
        });

        audio.addEventListener('ended', () => {
            updatePlayState(false);
            if (progressFill) progressFill.style.width = '0%';
            if (curTimeEl) curTimeEl.textContent = '0:00';
            if (musicPausedForVoiceNote) {
                musicPausedForVoiceNote = false;
                toggleMusic(true);
            }
        });

        if (progressWrapper) {
            progressWrapper.onclick = (e) => {
                if (!audio.duration) return;
                const rect = progressWrapper.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                audio.currentTime = clickPos * audio.duration;
            };
        }

        if (replayBtn) {
            replayBtn.onclick = () => {
                audio.currentTime = 0;
                if (musicPlaying) {
                    musicPausedForVoiceNote = true;
                    toggleMusic(false);
                }
                audio.play().then(() => {
                    updatePlayState(true);
                }).catch(err => {
                    console.log('Voice note playback error:', err);
                });
            };
        }
    }
}

// ==========================================
// TAB 5: SELF-BUILDING CAKE SEQUENCE
// ==========================================
function triggerCakeBuilderSequence() {
    activeCandles = 3;
    
    const micContainer = document.getElementById('mic-status-container');
    if (micContainer) micContainer.classList.add('text-hidden');
    
    const fireworksInstr = document.getElementById('fireworks-instruction');
    if (fireworksInstr) fireworksInstr.classList.add('text-hidden');
    
    stopFireworksLoop();

    const banner = document.getElementById('cake-title-banner');
    const instruction = document.getElementById('cake-instruction');

    if (banner) banner.textContent = '';
    if (instruction) instruction.textContent = '';

    // Reset part classes to hidden
    const parts = ['cake-plate', 'cake-layer-1', 'cake-layer-2', 'cake-layer-3', 'cake-icing', 'cake-drips', 'cake-candles'];
    parts.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.className = el.classList.contains('candles-wrapper') ? 'candles-wrapper cake-part hidden' :
                          el.classList.contains('plate') ? 'plate cake-part hidden' :
                          el.classList.contains('icing') ? 'icing cake-part hidden' :
                          el.classList.contains('drips') ? 'drips cake-part hidden' :
                          el.className.replace('hidden', '') + ' cake-part hidden';
            
            if (id === 'cake-candles') {
                document.querySelectorAll('.candle-container').forEach(c => c.classList.remove('extinguished'));
            }
        }
    });

    // Sequential timing drops
    setTimeout(() => {
        if (activeTab !== 'tab-cake') return;
        const el = document.getElementById('cake-plate');
        if (el) el.classList.remove('hidden');
        playArpeggioChordNote('C3', audioCtx ? audioCtx.currentTime : 0, 0.5);
    }, 400);

    setTimeout(() => {
        if (activeTab !== 'tab-cake') return;
        const el = document.getElementById('cake-layer-1');
        if (el) el.classList.remove('hidden');
        playArpeggioChordNote('E3', audioCtx ? audioCtx.currentTime : 0, 0.4);
    }, 1000);

    setTimeout(() => {
        if (activeTab !== 'tab-cake') return;
        const el = document.getElementById('cake-layer-2');
        if (el) el.classList.remove('hidden');
        playArpeggioChordNote('G3', audioCtx ? audioCtx.currentTime : 0, 0.4);
    }, 1600);

    setTimeout(() => {
        if (activeTab !== 'tab-cake') return;
        const el = document.getElementById('cake-layer-3');
        if (el) el.classList.remove('hidden');
        playArpeggioChordNote('C4', audioCtx ? audioCtx.currentTime : 0, 0.4);
    }, 2200);

    setTimeout(() => {
        if (activeTab !== 'tab-cake') return;
        const icing = document.getElementById('cake-icing');
        const drips = document.getElementById('cake-drips');
        if (icing) icing.classList.remove('hidden');
        if (drips) drips.classList.remove('hidden');
        playArpeggioChordNote('E4', audioCtx ? audioCtx.currentTime : 0, 0.3);
    }, 2800);

    setTimeout(() => {
        if (activeTab !== 'tab-cake') return;
        const el = document.getElementById('cake-candles');
        if (el) el.classList.remove('hidden');
        playMagicHarp();

        setTimeout(() => {
            if (activeTab !== 'tab-cake') return;
            const tDone = translations[currentLanguage];
            const b = document.getElementById('cake-title-banner');
            const ins = document.getElementById('cake-instruction');

            if (b) b.textContent = tDone.cakeTitleDone;
            if (ins) ins.textContent = tDone.cakeInstructionDone;
            
            const mc = document.getElementById('mic-status-container');
            if (mc) mc.classList.remove('text-hidden');
            setupMicrophoneBlowDetector();
        }, 500);
    }, 3400);
}

function extinguishNextCandle() {
    if (activeCandles <= 0) return;
    
    const unlitCandles = Array.from(document.querySelectorAll('.candle-container')).filter(c => !c.classList.contains('extinguished'));
    if (unlitCandles.length === 0) return;
    
    extinguishSpecificCandle(unlitCandles[0]);
}

function extinguishSpecificCandle(targetCandle) {
    if (activeCandles <= 0) return;
    if (targetCandle.classList.contains('extinguished')) return;
    
    targetCandle.classList.add('extinguished');
    activeCandles--;
    
    playNoiseBurst(); // smoke blow sound

    if (activeCandles === 0) {
        const b = document.getElementById('cake-title-banner');
        if (b) b.textContent = currentLanguage === 'darija' ? "شوف السماء كتضوي !" : "Regarde le ciel s'illuminer !";
        
        const ins = document.getElementById('cake-instruction');
        if (ins) ins.textContent = currentLanguage === 'darija' ? "شوف السماء كتضوي !" : "Regarde le ciel s'illuminer !";

        // Enable custom fireworks canvas
        triggerCakeConfetti();
        initFireworksCanvas();
        startFireworksLoop();

        const fi = document.getElementById('fireworks-instruction');
        if (fi) fi.classList.remove('text-hidden');

        triggerSpellingFireworksShow();
    }
}

function triggerSpellingFireworksShow() {
    const letters = ['L', 'O', 'U', 'B', 'N', 'A'];
    const letterColors = ['#ff2a6d', '#ff5c93', '#ff8da1', '#fdf5c4', '#d4af37', '#ff2a6d'];

    letters.forEach((char, idx) => {
        setTimeout(() => {
            if (activeTab !== 'tab-cake') return;
            const canvasW = fireworksCanvas.width;
            const canvasH = fireworksCanvas.height;
            
            const tx = canvasW * (0.12 + idx * 0.15);
            const ty = canvasH * 0.35;
            
            playPopSound();
            
            activeFireworks.push({
                x: canvasW / 2,
                y: canvasH,
                targetX: tx,
                targetY: ty,
                speed: 8.0,
                angle: Math.atan2(ty - canvasH, tx - (canvasW / 2)),
                radius: 2.5,
                color: letterColors[idx],
                path: [],
                isLetterShell: true,
                letterChar: char
            });
        }, idx * 750);
    });
}

function triggerCakeConfetti() {
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
    }, 150);
    setTimeout(() => {
        confetti({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
    }, 300);
}

// Microphone blown engine
function setupMicrophoneBlowDetector() {
    initAudioContext();
    const t = translations[currentLanguage];
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                micStream = stream;
                micSource = audioCtx.createMediaStreamSource(stream);
                micAnalyser = audioCtx.createAnalyser();
                micAnalyser.fftSize = 512;
                micSource.connect(micAnalyser);
                
                const indicator = document.getElementById('mic-status-container');
                if (indicator) indicator.classList.add('listening');
                
                const mtText = document.getElementById('mic-status-text');
                if (mtText) mtText.textContent = t.micListening;
                
                monitorMicrophoneBlow();
            })
            .catch(err => {
                console.log("Microphone access denied: ", err);
                const indicator = document.getElementById('mic-status-container');
                if (indicator) indicator.classList.remove('listening');
                const mtText = document.getElementById('mic-status-text');
                if (mtText) mtText.textContent = t.micInactive;
            });
    } else {
        const indicator = document.getElementById('mic-status-container');
        if (indicator) indicator.classList.remove('listening');
        const mtText = document.getElementById('mic-status-text');
        if (mtText) mtText.textContent = t.micInactive;
    }
}

function monitorMicrophoneBlow() {
    if (!micAnalyser) return;
    
    const bufferLength = micAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function analyzeAudioFrame() {
        if (!micStream || activeTab !== 'tab-cake' || activeCandles === 0) {
            stopMicrophone();
            return;
        }
        
        micAnalyser.getByteTimeDomainData(dataArray);
        
        let totalDeviation = 0;
        for (let i = 0; i < bufferLength; i++) {
            const val = dataArray[i] - 128;
            totalDeviation += val * val;
        }
        const rms = Math.sqrt(totalDeviation / bufferLength);
        
        const now = Date.now();
        if (rms > 14 && (now - lastBlowTime > 900)) {
            lastBlowTime = now;
            extinguishNextCandle();
        }
        
        micInterval = requestAnimationFrame(analyzeAudioFrame);
    }
    
    analyzeAudioFrame();
}

function stopMicrophone() {
    if (micInterval) {
        cancelAnimationFrame(micInterval);
        micInterval = null;
    }
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }
    micSource = null;
    micAnalyser = null;
    
    const indicator = document.getElementById('mic-status-container');
    if (indicator) {
        indicator.classList.remove('listening');
        const t = translations[currentLanguage];
        const mtText = document.getElementById('mic-status-text');
        if (mtText) mtText.textContent = t.micInactive;
    }
}

// Fireworks simulation inside Cake tab
function initFireworksCanvas() {
    fireworksCanvas = document.getElementById('fireworks-canvas');
    if (!fireworksCanvas) return;
    
    fireworksCtx = fireworksCanvas.getContext('2d');
    fireworksCanvas.style.display = 'block';
    
    resizeCanvases();
}

function startFireworksLoop() {
    if (fireworksLoopActive) return;
    fireworksLoopActive = true;
    activeFireworks = [];
    fireworkParticles = [];
    skyFlashAlpha = 0;
    animateFireworks();
}

function stopFireworksLoop() {
    fireworksLoopActive = false;
    if (fireworksCanvas) {
        fireworksCanvas.style.display = 'none';
    }
}

function launchCustomFirework(targetX, targetY) {
    if (!fireworksCtx) return;
    
    playPopSound();
    
    activeFireworks.push({
        x: fireworksCanvas.width / 2 + (Math.random() - 0.5) * 80,
        y: fireworksCanvas.height,
        targetX: targetX,
        targetY: targetY,
        speed: 6.5 + Math.random() * 3.5,
        angle: Math.atan2(targetY - fireworksCanvas.height, targetX - (fireworksCanvas.width / 2)),
        radius: 2.2,
        color: `hsl(${Math.random() * 360}, 100%, 68%)`,
        path: []
    });
}

function createFireworkExplosion(x, y, color) {
    const explosionStyles = ['peony', 'willow', 'crackle'];
    const style = explosionStyles[Math.floor(Math.random() * explosionStyles.length)];
    
    playExplosionSound();
    
    skyFlashAlpha = 0.32;
    skyFlashColor = color;

    const sparkCount = style === 'willow' ? 70 : 90;
    for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = style === 'willow' ? (1.5 + Math.random() * 3.5) : (1.0 + Math.random() * 6.0);
        
        fireworkParticles.push({
            x: x,
            y: y,
            prevX: x,
            prevY: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 1.5 + 0.6,
            color: color,
            alpha: 1.0,
            friction: style === 'willow' ? 0.96 : 0.94,
            gravity: style === 'willow' ? 0.08 : 0.05,
            fade: style === 'crackle' ? (0.015 + Math.random() * 0.02) : (0.008 + Math.random() * 0.012),
            style: style,
            cracked: false,
            trail: []
        });
    }
}

// Letter definitions with high-fidelity interpolation segments (spells LOUBNA)
function interpolateSegment(p1, p2, count) {
    const arr = [];
    for (let i = 0; i <= count; i++) {
        const t = i / count;
        arr.push({ x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t });
    }
    return arr;
}

function getLetterPoints(char) {
    const pts = [];
    
    if (char === 'L') {
        pts.push(...interpolateSegment({x: -0.22, y: -0.7}, {x: -0.22, y: 0.7}, 15));
        pts.push(...interpolateSegment({x: -0.22, y: 0.7}, {x: 0.25, y: 0.7}, 10));
    } else if (char === 'O') {
        for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / 24) {
            pts.push({ x: 0.3 * Math.cos(a), y: 0.7 * Math.sin(a) });
        }
    } else if (char === 'U') {
        pts.push(...interpolateSegment({x: -0.28, y: -0.7}, {x: -0.28, y: 0.35}, 11));
        pts.push(...interpolateSegment({x: -0.28, y: 0.35}, {x: -0.16, y: 0.7}, 5));
        pts.push(...interpolateSegment({x: -0.16, y: 0.7}, {x: 0.16, y: 0.7}, 6));
        pts.push(...interpolateSegment({x: 0.16, y: 0.7}, {x: 0.28, y: 0.35}, 5));
        pts.push(...interpolateSegment({x: 0.28, y: 0.35}, {x: 0.28, y: -0.7}, 11));
    } else if (char === 'B') {
        pts.push(...interpolateSegment({x: -0.28, y: -0.7}, {x: -0.28, y: 0.7}, 15));
        pts.push(...interpolateSegment({x: -0.28, y: -0.7}, {x: 0.15, y: -0.7}, 6));
        pts.push(...interpolateSegment({x: 0.15, y: -0.7}, {x: 0.26, y: -0.35}, 6));
        pts.push(...interpolateSegment({x: 0.26, y: -0.35}, {x: 0.15, y: 0.0}, 6));
        pts.push(...interpolateSegment({x: 0.15, y: 0.0}, {x: -0.28, y: 0.0}, 6));
        pts.push(...interpolateSegment({x: -0.28, y: 0.0}, {x: 0.18, y: 0.0}, 6));
        pts.push(...interpolateSegment({x: 0.18, y: 0.0}, {x: 0.28, y: 0.35}, 6));
        pts.push(...interpolateSegment({x: 0.28, y: 0.35}, {x: 0.18, y: 0.7}, 6));
        pts.push(...interpolateSegment({x: 0.18, y: 0.7}, {x: -0.28, y: 0.7}, 6));
    } else if (char === 'N') {
        pts.push(...interpolateSegment({x: -0.32, y: 0.7}, {x: -0.32, y: -0.7}, 14));
        pts.push(...interpolateSegment({x: -0.32, y: -0.7}, {x: 0.32, y: 0.7}, 14));
        pts.push(...interpolateSegment({x: 0.32, y: 0.7}, {x: 0.32, y: -0.7}, 14));
    } else if (char === 'A') {
        pts.push(...interpolateSegment({x: -0.32, y: 0.7}, {x: 0, y: -0.7}, 14));
        pts.push(...interpolateSegment({x: 0, y: -0.7}, {x: 0.32, y: 0.7}, 14));
        pts.push(...interpolateSegment({x: -0.16, y: 0.1}, {x: 0.16, y: 0.1}, 8));
    } else if (char === 'I') {
        pts.push(...interpolateSegment({x: 0, y: -0.7}, {x: 0, y: 0.7}, 15));
        pts.push(...interpolateSegment({x: -0.2, y: -0.7}, {x: 0.2, y: -0.7}, 6));
        pts.push(...interpolateSegment({x: -0.2, y: 0.7}, {x: 0.2, y: 0.7}, 6));
    } else if (char === 'M') {
        pts.push(...interpolateSegment({x: -0.35, y: 0.7}, {x: -0.35, y: -0.7}, 14));
        pts.push(...interpolateSegment({x: -0.35, y: -0.7}, {x: 0, y: 0}, 8));
        pts.push(...interpolateSegment({x: 0, y: 0}, {x: 0.35, y: -0.7}, 8));
        pts.push(...interpolateSegment({x: 0.35, y: -0.7}, {x: 0.35, y: 0.7}, 14));
    } else if (char === 'E') {
        pts.push(...interpolateSegment({x: -0.3, y: -0.7}, {x: -0.3, y: 0.7}, 15));
        pts.push(...interpolateSegment({x: -0.3, y: -0.7}, {x: 0.25, y: -0.7}, 8));
        pts.push(...interpolateSegment({x: -0.3, y: 0}, {x: 0.15, y: 0}, 6));
        pts.push(...interpolateSegment({x: -0.3, y: 0.7}, {x: 0.25, y: 0.7}, 8));
    }
    return pts;
}

function createLetterExplosion(x, y, char, color) {
    playExplosionSound();
    skyFlashAlpha = 0.35;
    skyFlashColor = color;

    const points = getLetterPoints(char);
    const scale = Math.min(fireworksCanvas.width, fireworksCanvas.height) * 0.17;

    points.forEach(pt => {
        const targetX = x + pt.x * scale;
        const targetY = y + pt.y * scale;

        fireworkParticles.push({
            x: x,
            y: y,
            prevX: x,
            prevY: y,
            vx: (targetX - x) / 25,
            vy: (targetY - y) / 25,
            radius: Math.random() * 2.0 + 3.0,
            color: color,
            alpha: 1.0,
            fade: 0.0035 + Math.random() * 0.002,
            isLetterPart: true,
            arrived: false,
            arriveFrame: 25,
            freezeTimer: 95,
            trail: []
        });
    });
}

function animateFireworks() {
    if (!fireworksLoopActive) return;

    fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    if (skyFlashAlpha > 0) {
        fireworksCtx.save();
        fireworksCtx.globalCompositeOperation = 'screen';
        const radialGlow = fireworksCtx.createRadialGradient(
            fireworksCanvas.width / 2, fireworksCanvas.height / 2, 10,
            fireworksCanvas.width / 2, fireworksCanvas.height / 2, fireworksCanvas.width
        );
        radialGlow.addColorStop(0, skyFlashColor.replace('hsl', 'hsla').replace(')', `, ${skyFlashAlpha * 0.8})`));
        radialGlow.addColorStop(1, 'transparent');
        
        fireworksCtx.fillStyle = radialGlow;
        fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        skyFlashAlpha -= 0.018;
        fireworksCtx.restore();
    }

    for (let i = activeFireworks.length - 1; i >= 0; i--) {
        const f = activeFireworks[i];
        
        const distance = Math.hypot(f.targetX - f.x, f.targetY - f.y);
        if (distance < 10) {
            if (f.isLetterShell) {
                createLetterExplosion(f.targetX, f.targetY, f.letterChar, f.color);
            } else {
                createFireworkExplosion(f.targetX, f.targetY, f.color);
            }
            activeFireworks.splice(i, 1);
            continue;
        }

        f.path.push({ x: f.x, y: f.y });
        if (f.path.length > 5) f.path.shift();

        fireworksCtx.strokeStyle = f.color;
        fireworksCtx.lineWidth = 2.0;
        fireworksCtx.beginPath();
        if (f.path.length > 0) {
            fireworksCtx.moveTo(f.path[0].x, f.path[0].y);
            for (let j = 1; j < f.path.length; j++) {
                fireworksCtx.lineTo(f.path[j].x, f.path[j].y);
            }
        }
        fireworksCtx.stroke();

        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;

        fireworksCtx.fillStyle = '#ffffff';
        fireworksCtx.beginPath();
        fireworksCtx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        fireworksCtx.fill();
    }

    for (let i = fireworkParticles.length - 1; i >= 0; i--) {
        const p = fireworkParticles[i];
        
        if (p.isLetterPart) {
            if (!p.arrived) {
                p.prevX = p.x;
                p.prevY = p.y;
                p.x += p.vx;
                p.y += p.vy;
                p.arriveFrame--;
                if (p.arriveFrame <= 0) {
                    p.arrived = true;
                    p.vx = 0;
                    p.vy = 0;
                }
            } else if (p.freezeTimer > 0) {
                p.prevX = p.x;
                p.prevY = p.y;
                p.vy = 0.50; // Drift downward smoothly
                p.x += (Math.random() - 0.5) * 0.18; // vibrate slightly
                p.y += p.vy; // gravitate downward
                p.freezeTimer--;
                p.alpha -= 0.0035; // slow fade during descent
            } else {
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.vy += 0.08; // fall faster after drift
                p.prevX = p.x;
                p.prevY = p.y;
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.fade * 1.5; // fade faster
            }
        } else {
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.prevX = p.x;
            p.prevY = p.y;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.fade;
        }

        if (!p.isLetterPart && p.style === 'crackle' && p.alpha < 0.28 && !p.cracked) {
            p.cracked = true;
            for (let k = 0; k < 3; k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.5 + Math.random() * 2.0;
                fireworkParticles.push({
                    x: p.x,
                    y: p.y,
                    prevX: p.x,
                    prevY: p.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: 0.5,
                    color: '#ffffff',
                    alpha: 0.9,
                    friction: 0.92,
                    gravity: 0.06,
                    fade: 0.05 + Math.random() * 0.05,
                    style: 'peony',
                    cracked: true,
                    trail: []
                });
            }
        }

        if (p.alpha <= 0) {
            fireworkParticles.splice(i, 1);
            continue;
        }

        p.trail.push({ x: p.x, y: p.y });
        const maxTrailLength = p.isLetterPart ? 9 : 4;
        if (p.trail.length > maxTrailLength) p.trail.shift();

        fireworksCtx.save();
        fireworksCtx.globalAlpha = p.alpha;
        fireworksCtx.strokeStyle = p.color;
        fireworksCtx.lineWidth = p.isLetterPart ? (p.radius * 4.0) : (p.radius * 2);
        fireworksCtx.lineCap = 'round';
        
        fireworksCtx.beginPath();
        if (p.trail.length > 0) {
            fireworksCtx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let j = 1; j < p.trail.length; j++) {
                fireworksCtx.lineTo(p.trail[j].x, p.trail[j].y);
            }
        } else {
            fireworksCtx.moveTo(p.prevX, p.prevY);
            fireworksCtx.lineTo(p.x, p.y);
        }
        fireworksCtx.stroke();
        fireworksCtx.restore();
    }

    if (Math.random() < 0.02 && activeFireworks.length < 3) {
        const tx = 40 + Math.random() * (fireworksCanvas.width - 80);
        const ty = 30 + Math.random() * (fireworksCanvas.height * 0.45);
        launchCustomFirework(tx, ty);
    }

    requestAnimationFrame(animateFireworks);
}

// ==========================================
// TAB 6: SECRET JAR
// ==========================================
let currentNoteIndex = 0;
function openLoveNote() {
    const t = translations[currentLanguage];
    const notes = t.romanticNotes;
    if (!notes || notes.length === 0) return;

    playSuccessChime();

    const msg = notes[currentNoteIndex % notes.length];
    currentNoteIndex++;

    const descEl = document.getElementById('jar-result-desc');
    const resBox = document.getElementById('jar-result-box');
    const btnOpenNote = document.getElementById('btn-open-jar-note');

    if (descEl) {
        descEl.textContent = msg;
    }

    if (resBox) {
        resBox.className = ''; 
    }

    const jar = document.getElementById('love-jar-trigger');
    if (jar) {
        jar.classList.add('jar-shake');
        setTimeout(() => {
            jar.classList.remove('jar-shake');
        }, 600);
    }

    if (btnOpenNote) {
        btnOpenNote.textContent = t.btnOpenJarAnotherNote;
    }
}

// ==========================================
// TAB 7: COUPLE SPIN WHEEL
// ==========================================
function initWheelTab() {
    wheelCanvas = document.getElementById('wheel-canvas');
    if (!wheelCanvas) return;
    wheelCtx = wheelCanvas.getContext('2d');
    
    const resBox = document.getElementById('wheel-result-box');
    if (resBox) resBox.className = 'result-box-hidden';
    
    wheelAngle = 0;
    wheelSpinning = false;
    spinVelocity = 0;
    
    drawWheel();
}

function drawWheel() {
    if (!wheelCanvas || !wheelCtx) return;
    
    const w = wheelCanvas.width;
    const h = wheelCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const r = cx - 12;
    
    wheelCtx.clearRect(0, 0, w, h);
    
    const numSectors = sectors.length;
    const arcSize = (2 * Math.PI) / numSectors;
    
    // Draw Slices
    sectors.forEach((sec, idx) => {
        const angle = wheelAngle + idx * arcSize;
        
        wheelCtx.beginPath();
        wheelCtx.moveTo(cx, cy);
        wheelCtx.arc(cx, cy, r, angle, angle + arcSize);
        wheelCtx.closePath();
        
        wheelCtx.fillStyle = sec.color;
        wheelCtx.fill();
        
        wheelCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        wheelCtx.lineWidth = 2;
        wheelCtx.stroke();
        
        // Draw Text rotation
        wheelCtx.save();
        wheelCtx.translate(cx, cy);
        wheelCtx.rotate(angle + arcSize / 2);
        
        wheelCtx.fillStyle = '#ffffff';
        wheelCtx.font = 'bold 10px Inter, sans-serif';
        wheelCtx.textAlign = 'right';
        wheelCtx.textBaseline = 'middle';
        
        const label = sec.label_darija;
        wheelCtx.fillText(label, r - 25, 0);
        wheelCtx.restore();
    });
    
    // Outer rim border
    wheelCtx.beginPath();
    wheelCtx.arc(cx, cy, r, 0, 2 * Math.PI);
    wheelCtx.strokeStyle = '#d4af37';
    wheelCtx.lineWidth = 4;
    wheelCtx.stroke();

    // Center circular dial cap
    wheelCtx.beginPath();
    wheelCtx.arc(cx, cy, 25, 0, 2 * Math.PI);
    wheelCtx.fillStyle = '#120109';
    wheelCtx.fill();
    wheelCtx.strokeStyle = '#d4af37';
    wheelCtx.lineWidth = 2;
    wheelCtx.stroke();
    
    // Center heart
    wheelCtx.fillStyle = '#ff2a6d';
    wheelCtx.font = '15px Inter, sans-serif';
    wheelCtx.textAlign = 'center';
    wheelCtx.textBaseline = 'middle';
    wheelCtx.fillText('❤️', cx, cy);
}

function spinWheelCanvas() {
    if (wheelSpinning) return;
    
    wheelSpinning = true;
    playKeyboardClick();
    
    const resBox = document.getElementById('wheel-result-box');
    if (resBox) resBox.className = 'result-box-hidden';
    
    spinVelocity = 0.28 + Math.random() * 0.18;
    
    function animateSpin() {
        if (spinVelocity > 0.001) {
            wheelAngle += spinVelocity;
            spinVelocity *= friction;
            drawWheel();
            requestAnimationFrame(animateSpin);
        } else {
            wheelSpinning = false;
            spinVelocity = 0;
            determineWheelWinner();
        }
    }
    
    animateSpin();
}

function determineWheelWinner() {
    if (!wheelCanvas) return;
    
    const numSectors = sectors.length;
    const arcSize = (2 * Math.PI) / numSectors;
    
    let normalizedAngle = (wheelAngle % (2 * Math.PI));
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
    
    let winnerIndex = Math.floor((1.5 * Math.PI - normalizedAngle) / arcSize) % numSectors;
    if (winnerIndex < 0) winnerIndex += numSectors;
    
    const sec = sectors[winnerIndex];
    playSuccessChime();
    
    const t = translations[currentLanguage];
    const msg = t.wheelPrompts[sec.key];
    
    const titleEl = document.getElementById('wheel-result-title');
    const descEl = document.getElementById('wheel-result-desc');
    const resBox = document.getElementById('wheel-result-box');
    
    if (titleEl) {
        titleEl.textContent = sec.label_darija;
    }
    if (descEl) {
        descEl.innerHTML = `
            <div class="wheel-prompt-text">${msg}</div>
            <div class="khalid-challenge-box" style="margin-top: 16px;">
                <div class="khalid-box-header">🤝😂 ملاحظة مهمة من عند خوك خالد:</div>
                <div class="khalid-box-content">هادشي وهاد التحدي راه غيديرو خالد هههههههههه!</div>
                <div class="khalid-box-cue">📸 خدي سكرين شوت دابا وصيفطيها لخالد باش يدير التحدي فالحين!</div>
            </div>`;
    }
    if (resBox) {
        resBox.className = '';
    }

    // Disable the spin button to prevent spinning again
    const btnSpin = document.getElementById('btn-spin-wheel-canvas');
    if (btnSpin) {
        btnSpin.disabled = true;
        btnSpin.style.opacity = '0.35';
        btnSpin.style.pointerEvents = 'none';
        btnSpin.textContent = "تم الاختيار 🔒";
    }
}

// ==========================================
// TAB 8: DEDICATED AUDIO SYNTH & EQ
// ==========================================
function initMusicTab() {
    const bars = document.querySelectorAll('.eq-bar');
    bars.forEach(bar => bar.style.height = '8px');
    
    // Bind playlist track clicks
    document.querySelectorAll('.playlist-track').forEach(track => {
        track.onclick = (e) => {
            e.stopPropagation();
            const trackType = track.getAttribute('data-track');
            selectPlaylistTrack(trackType);
        };
    });
    
    updateMusicTabUI();
    if (musicPlaying) {
        startEqualizerAnimation();
    }
}

function updateMusicTabUI() {
    const dbToggle = document.getElementById('btn-dashboard-music-toggle');
    const isPlaying = musicPlaying;
    
    if (dbToggle) {
        const icon = dbToggle.querySelector('.play-state-icon');
        if (icon) icon.textContent = isPlaying ? "⏸" : "▶";
        dbToggle.classList.toggle('playing', isPlaying);
    }
    
    // Update track status icons in the playlist UI
    document.querySelectorAll('.playlist-track').forEach(track => {
        const trackType = track.getAttribute('data-track');
        const icon = track.querySelector('.track-status-icon');
        if (icon) {
            if (trackType === currentPlaylistTrack) {
                icon.textContent = isPlaying ? "🔊" : "▶";
            } else {
                icon.textContent = "▶";
            }
        }
    });

    // Update luxury vinyl disc cover states
    const vinylDisc = document.getElementById('vinyl-disc-element');
    const playerNeedle = document.getElementById('player-needle-element');
    const activeTrackDisplay = document.getElementById('active-track-display');
    
    if (vinylDisc) vinylDisc.classList.toggle('playing', isPlaying);
    if (playerNeedle) playerNeedle.classList.toggle('playing', isPlaying);
    
    if (activeTrackDisplay) {
        if (currentPlaylistTrack === '1') {
            activeTrackDisplay.textContent = "Moroccan Happy Birthday 🇲🇦🎂";
        } else if (currentPlaylistTrack === '2') {
            activeTrackDisplay.textContent = "Happy Birthday LOUBNA 💖✨";
        } else if (currentPlaylistTrack === '3') {
            activeTrackDisplay.textContent = "Joyeux Anniversaire Loubna 🎉🎁";
        }
    }
}

function selectPlaylistTrack(trackId) {
    if (currentPlaylistTrack === trackId) {
        // Toggle play/pause if clicking the active track
        toggleMusic(!musicPlaying);
        return;
    }
    
    // Stop currently playing track
    toggleMusic(false);
    
    // Switch track ID
    currentPlaylistTrack = trackId;
    
    // Update active visual state
    document.querySelectorAll('.playlist-track').forEach(track => {
        const tId = track.getAttribute('data-track');
        track.classList.toggle('active', tId === trackId);
    });
    
    // Pre-load audio track source
    const audioPlayer = document.getElementById('playlist-audio-player');
    if (audioPlayer) {
        let srcFile = '';
        if (trackId === '1') srcFile = 'track_2.mp3';
        else if (trackId === '2') srcFile = 'track_orientale.mp3';
        else if (trackId === '3') srcFile = 'track_loubna.mp3';
        
        audioPlayer.src = srcFile;
        audioPlayer.load();
    }
    
    // Play automatically
    toggleMusic(true);
    playPopSound();
}

function playAudioTrack() {
    const audioPlayer = document.getElementById('playlist-audio-player');
    if (!audioPlayer) return;
    
    let srcFile = '';
    if (currentPlaylistTrack === '1') srcFile = 'track_2.mp3';
    else if (currentPlaylistTrack === '2') srcFile = 'track_orientale.mp3';
    else if (currentPlaylistTrack === '3') srcFile = 'track_loubna.mp3';
    
    if (srcFile && (!audioPlayer.src || !audioPlayer.src.includes(srcFile))) {
        audioPlayer.src = srcFile;
        audioPlayer.load();
    }
    
    audioPlayer.play().then(() => {
        musicPlaying = true;
        updateMusicTabUI();
        startEqualizerAnimation();
    }).catch(err => {
        console.log("Audio playback error:", err);
    });
}

function pauseAudioTrack() {
    const audioPlayer = document.getElementById('playlist-audio-player');
    if (audioPlayer) {
        audioPlayer.pause();
    }
    musicPlaying = false;
    updateMusicTabUI();
}

function startEqualizerAnimation() {
    if (eqAnimationActive) return;
    eqAnimationActive = true;
    
    const bars = document.querySelectorAll('.eq-bar');
    if (bars.length === 0) return;
    
    function animateBars() {
        const isPlaying = musicPlaying;
        if (!isPlaying || activeScreen !== 'screen-dashboard' || activeTab !== 'tab-music') {
            eqAnimationActive = false;
            bars.forEach(bar => bar.style.height = '8px');
            return;
        }
        
        bars.forEach((bar, idx) => {
            const time = Date.now() * 0.005;
            const wave = Math.sin(time + idx * 0.4) * 20 + 25;
            const rand = Math.random() * 8;
            let height = Math.max(8, wave + rand);
            
            height = Math.min(50, height);
            
            bar.style.height = height + 'px';
        });
        
        setTimeout(() => {
            requestAnimationFrame(animateBars);
        }, 80);
    }
    
    animateBars();
}



// ==========================================
// TAB 10: TYPEWRITER LOVE LETTER
// ==========================================
function startTypewriterLetter() {
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
        typewriterTimeout = null;
    }
}

// ==========================================
// CANVAS BACKGROUND & SYSTEM RESET
// ==========================================
function initSkyCanvas() {
    skyCanvas = document.getElementById('sky-canvas');
    if (!skyCanvas) return;
    skyCtx = skyCanvas.getContext('2d');
    resizeCanvases();

    stars = [];
    const starCount = 85;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * skyCanvas.width,
            y: Math.random() * skyCanvas.height * 0.95,
            radius: Math.random() * 1.4 + 0.4,
            alpha: Math.random(),
            twinkleSpeed: 0.005 + Math.random() * 0.015,
            phase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.4 ? 'rgba(254, 240, 138, ' : 'rgba(212, 175, 55, '
        });
    }

    // Warm, celebratory floating bokeh lights (خاوة، فرحة، بهجة)
    festiveParticles = [];
    const festiveCount = 28;
    const festivePalettes = [
        'rgba(212, 175, 55, ',   // Royal Gold
        'rgba(251, 191, 36, ',   // Warm Amber
        'rgba(244, 114, 182, ',  // Soft Rose
        'rgba(192, 132, 252, '   // Lilac Sparkle
    ];

    for (let i = 0; i < festiveCount; i++) {
        festiveParticles.push({
            x: Math.random() * skyCanvas.width,
            y: Math.random() * skyCanvas.height,
            radius: Math.random() * 2.8 + 1.2,
            colorPrefix: festivePalettes[Math.floor(Math.random() * festivePalettes.length)],
            vy: -(0.25 + Math.random() * 0.45), // slowly floats upwards
            vx: (Math.random() - 0.5) * 0.25,
            baseAlpha: 0.18 + Math.random() * 0.35,
            pulseSpeed: 0.01 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2
        });
    }

    animateSky();
}

function resizeCanvases() {
    if (skyCanvas) {
        skyCanvas.width = window.innerWidth;
        skyCanvas.height = window.innerHeight;
    }
    if (fireworksCanvas) {
        const card = document.querySelector('.cake-card');
        if (card) {
            fireworksCanvas.width = card.clientWidth;
            fireworksCanvas.height = card.clientHeight;
        }
    }
}

function spawnStardust(x, y) {
    for (let i = 0; i < 2; i++) {
        stardustParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.2,
            size: Math.random() * 2.0 + 0.6,
            color: `hsla(${(40 + Math.random() * 15)}, 95%, 70%, `,
            alpha: 1.0,
            fadeSpeed: 0.02 + Math.random() * 0.02
        });
    }
}

function animateSky() {
    if (!skyCtx) return;
    skyCtx.clearRect(0, 0, skyCanvas.width, skyCanvas.height);

    // 1. Draw twinkling golden stars
    stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        star.alpha = 0.25 + Math.abs(Math.sin(star.phase)) * 0.75;

        skyCtx.fillStyle = star.color + (star.alpha * 0.85) + ')';
        skyCtx.beginPath();
        skyCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        skyCtx.fill();
    });

    // 2. Draw warm floating celebratory orbs
    festiveParticles.forEach(fp => {
        fp.y += fp.vy;
        fp.x += fp.vx;
        fp.phase += fp.pulseSpeed;
        const currentAlpha = fp.baseAlpha + Math.sin(fp.phase) * 0.12;
        
        if (fp.y < -15) fp.y = skyCanvas.height + 15;
        if (fp.x < -15) fp.x = skyCanvas.width + 15;
        if (fp.x > skyCanvas.width + 15) fp.x = -15;

        skyCtx.fillStyle = fp.colorPrefix + Math.max(0.06, Math.min(0.65, currentAlpha)) + ')';
        skyCtx.beginPath();
        skyCtx.arc(fp.x, fp.y, fp.radius, 0, Math.PI * 2);
        skyCtx.fill();
    });

    if (Math.random() < 0.005 && shootingStars.length < 2) {
        shootingStars.push({
            x: Math.random() * skyCanvas.width * 0.7,
            y: Math.random() * skyCanvas.height * 0.4,
            length: 40 + Math.random() * 60,
            speed: 6 + Math.random() * 6,
            angle: Math.PI / 6 + Math.random() * (Math.PI / 12),
            alpha: 1.0,
            color: 'rgba(254, 244, 191, '
        });
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        skyCtx.strokeStyle = s.color + s.alpha + ')';
        skyCtx.lineWidth = 1.5;
        skyCtx.beginPath();
        skyCtx.moveTo(s.x, s.y);
        const dx = Math.cos(s.angle) * s.length;
        const dy = Math.sin(s.angle) * s.length;
        skyCtx.lineTo(s.x + dx, s.y + dy);
        skyCtx.stroke();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.03;

        if (s.alpha <= 0 || s.x > skyCanvas.width || s.y > skyCanvas.height) {
            shootingStars.splice(i, 1);
        }
    }

    for (let i = stardustParticles.length - 1; i >= 0; i--) {
        const p = stardustParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fadeSpeed;

        if (p.alpha <= 0) {
            stardustParticles.splice(i, 1);
            continue;
        }

        skyCtx.fillStyle = p.color + p.alpha + ')';
        skyCtx.shadowBlur = 4;
        skyCtx.shadowColor = 'var(--color-gold)';
        skyCtx.beginPath();
        skyCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        skyCtx.fill();
        skyCtx.shadowBlur = 0;
    }

    requestAnimationFrame(animateSky);
}

function resetAll() {
    stopMicrophone();
    stopFireworksLoop();
    if (countdownInterval) clearInterval(countdownInterval);
    toggleMobileDrawer(false); // Close mobile drawer

    // Reset lock keypad state
    enteredCode = '';
    updatePasscodeDots();
    lockInteractionActive = true;
    const errMsg = document.getElementById('lock-error-msg');
    if (errMsg) errMsg.classList.add('lock-error-hidden');

    activeCandles = 3;
    document.querySelectorAll('.candle-container').forEach(c => c.classList.remove('extinguished'));
    
    const banner = document.getElementById('cake-title-banner');
    if (banner) banner.textContent = '';
    const instruction = document.getElementById('cake-instruction');
    if (instruction) instruction.textContent = '';
    
    const mc = document.getElementById('mic-status-container');
    if (mc) mc.classList.add('text-hidden');
    const fi = document.getElementById('fireworks-instruction');
    if (fi) fi.classList.add('text-hidden');
    
    const resBox = document.getElementById('jar-result-box');
    if (resBox) resBox.className = 'result-box-hidden';
    const btnOpenNote = document.getElementById('btn-open-jar-note');
    if (btnOpenNote) btnOpenNote.textContent = translations[currentLanguage].btnOpenJarNote;

    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.add('top-bar-hidden');
    
    // Pause video
    const v1 = document.getElementById('memories-video');
    if (v1) v1.pause();

    // Pause and reset final voice player
    const va = document.getElementById('final-voice-audio');
    if (va) {
        va.pause();
        va.currentTime = 0;
    }
    const cardEl = document.getElementById('voice-note-card-el');
    if (cardEl) cardEl.classList.remove('voice-playing');
    const playIcon = document.getElementById('voice-play-icon');
    const playLabel = document.getElementById('voice-play-label');
    if (playIcon) playIcon.textContent = '▶';
    if (playLabel) playLabel.textContent = 'خدمي الأوديو 🎙️';
    const progressFill = document.getElementById('voice-progress-fill');
    if (progressFill) progressFill.style.width = '0%';
    const curTimeEl = document.getElementById('final-voice-cur-time');
    if (curTimeEl) curTimeEl.textContent = '0:00';
    musicPausedForVoiceNote = false;

    toggleMusic(false); 
    switchScreen('screen-lock');
}

// ==========================================
// WEB AUDIO API MELODY SYNTHESIZER
// ==========================================
function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

const noteFreqs = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'Bb4': 466.16,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
};

const songMelody = [
    ['C4', 0.75], ['C4', 0.25], ['D4', 1.0], ['C4', 1.0], ['F4', 1.0], ['E4', 2.0],
    ['C4', 0.75], ['C4', 0.25], ['D4', 1.0], ['C4', 1.0], ['G4', 1.0], ['F4', 2.0],
    ['C4', 0.75], ['C4', 0.25], ['C5', 1.0], ['A4', 1.0], ['F4', 1.0], ['E4', 1.0], ['D4', 2.0],
    ['Bb4', 0.75], ['Bb4', 0.25], ['A4', 1.0], ['F4', 1.0], ['G4', 1.0], ['F4', 2.0]
];

function playAcousticPianoNote(noteName, startTime, duration, volume = 1.0) {
    if (!audioCtx) return;

    let freq = noteFreqs[noteName];
    if (!freq) return;

    let harmonics = [];
    if (activeInstrument === 'piano') {
        harmonics = [
            { mult: 1, type: 'triangle', vol: 0.6, decayMult: 1.0 },
            { mult: 1, type: 'sine',     vol: 0.4, decayMult: 1.0 },
            { mult: 2, type: 'sine',     vol: 0.25, decayMult: 0.6 },
            { mult: 3, type: 'sine',     vol: 0.15, decayMult: 0.4 },
            { mult: 4, type: 'sine',     vol: 0.08, decayMult: 0.25 },
            { mult: 5, type: 'sine',     vol: 0.04, decayMult: 0.18 }
        ];
    } else if (activeInstrument === 'harp') {
        freq = freq * 2; // transpose one octave up
        harmonics = [
            { mult: 1, type: 'triangle', vol: 0.8, decayMult: 0.45 },
            { mult: 2, type: 'sine',     vol: 0.4, decayMult: 0.35 },
            { mult: 3, type: 'sine',     vol: 0.2, decayMult: 0.22 },
            { mult: 4, type: 'sine',     vol: 0.1, decayMult: 0.12 }
        ];
    } else if (activeInstrument === 'musicbox') {
        freq = freq * 4; // transpose two octaves up
        harmonics = [
            { mult: 1, type: 'sine', vol: 0.9, decayMult: 0.85 },
            { mult: 2, type: 'sine', vol: 0.35, decayMult: 0.55 },
            { mult: 3, type: 'sine', vol: 0.12, decayMult: 0.35 }
        ];
    }

    const cabinetOsc = audioCtx.createOscillator();
    const cabinetGain = audioCtx.createGain();
    cabinetOsc.type = 'sine';
    cabinetOsc.frequency.setValueAtTime(freq * 0.5, startTime);
    cabinetGain.gain.setValueAtTime(0, startTime);
    cabinetGain.gain.linearRampToValueAtTime(0.015 * volume, startTime + 0.1);
    cabinetGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    cabinetOsc.connect(cabinetGain);
    cabinetGain.connect(audioCtx.destination);
    cabinetOsc.start(startTime);
    cabinetOsc.stop(startTime + duration);
    activeSynthNodes.push(cabinetOsc, cabinetGain);

    harmonics.forEach(h => {
        const hFreq = freq * h.mult;
        if (hFreq > 20000) return;

        const osc = audioCtx.createOscillator();
        osc.type = h.type;
        osc.frequency.setValueAtTime(hFreq, startTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(activeInstrument === 'piano' ? 900 : 1500, startTime);
        filter.frequency.exponentialRampToValueAtTime(activeInstrument === 'piano' ? 300 : 600, startTime + duration * h.decayMult);

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(h.vol * 0.06 * volume, startTime + 0.008);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration * h.decayMult);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration * h.decayMult);
        activeSynthNodes.push(osc, gainNode, filter);
    });
}

function playArpeggioChordNote(noteName, startTime, duration) {
    if (!audioCtx) return;
    const freq = noteFreqs[noteName];
    if (!freq) return;
    playAcousticPianoNote(noteName, startTime, duration, 0.45);
}

function startHappyBirthdaySequencer(offsetTime = 0) {
    if (!musicPlaying || !audioCtx) return;

    const start = audioCtx.currentTime;
    let nextNoteTime = 0;
    const beatTime = 60 / SONG_BPM;

    songMelody.forEach((data, index) => {
        const note = data[0];
        const beats = data[1];
        let duration = beats * beatTime;

        let isPhraseEnd = (index === 5 || index === 11 || index === 18 || index === 24);
        if (isPhraseEnd) {
            duration *= 1.35;
        }

        const humanDelay = (Math.random() - 0.5) * 0.018;
        const humanTouch = 1.0 + (Math.random() - 0.5) * 0.22;

        const noteTime = start + nextNoteTime + offsetTime + humanDelay;
        playAcousticPianoNote(note, noteTime, duration, humanTouch);

        // Chord arpeggios accompaniment
        if (index === 0) {
            playArpeggioChordNote('F3', noteTime, beatTime * 2);
            playArpeggioChordNote('A3', noteTime + 0.06, beatTime * 1.8);
            playArpeggioChordNote('C4', noteTime + 0.12, beatTime * 1.6);
        } else if (index === 6) {
            playArpeggioChordNote('C3', noteTime, beatTime * 2);
            playArpeggioChordNote('G3', noteTime + 0.06, beatTime * 1.8);
            playArpeggioChordNote('C4', noteTime + 0.12, beatTime * 1.6);
        } else if (index === 12) {
            playArpeggioChordNote('F3', noteTime, beatTime * 2);
            playArpeggioChordNote('A3', noteTime + 0.06, beatTime * 1.8);
            playArpeggioChordNote('C4', noteTime + 0.12, beatTime * 1.6);
        } else if (index === 19) {
            playArpeggioChordNote('Bb3', noteTime, beatTime * 2);
            playArpeggioChordNote('D4', noteTime + 0.06, beatTime * 1.8);
            playArpeggioChordNote('F4', noteTime + 0.12, beatTime * 1.6);
        }

        nextNoteTime += duration;
        if (isPhraseEnd) {
            nextNoteTime += 0.20;
        }
    });

    melodyTimeout = setTimeout(() => {
        startHappyBirthdaySequencer();
    }, nextNoteTime * 1000);
}

function stopSequencer() {
    if (melodyTimeout) {
        clearTimeout(melodyTimeout);
        melodyTimeout = null;
    }
    activeSynthNodes.forEach(node => {
        try {
            if (node.stop) node.stop();
        } catch(e) {}
    });
    activeSynthNodes = [];
}

function toggleMusic(play) {
    const globalBtn = document.getElementById('music-toggle');
    
    if (play) {
        if (globalBtn) globalBtn.classList.add('playing');
        playAudioTrack();
    } else {
        if (globalBtn) globalBtn.classList.remove('playing');
        pauseAudioTrack();
    }
}

// FX Sound: Smoke blow noise
function playNoiseBurst() {
    if (!audioCtx) return;
    const len = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.25);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
}

// FX Sound: Pop click sound
function playPopSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// FX Sound: Keyboard Click
function playKeyboardClick() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
}

// FX Sound: Explosion noise
function playExplosionSound() {
    if (!audioCtx) return;
    
    const len = audioCtx.sampleRate * 0.8;
    const buffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.6);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
}

// FX Sound: Magic Harp glissando arpeggio
function playMagicHarp() {
    if (!audioCtx) return;
    const notesArr = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const now = audioCtx.currentTime;

    notesArr.forEach((freq, idx) => {
        const time = now + idx * 0.07;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.35);
    });
}

// FX Sound: Low warning buzzer
function playErrorBuzzer() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.25);
}

// FX Sound: Keypad success chime
function playSuccessChime() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const chord = ['C4', 'E4', 'G4', 'C5'];
    
    chord.forEach((noteName, idx) => {
        const timeOffset = idx * 0.08;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreqs[noteName], now + timeOffset);
        
        gain.gain.setValueAtTime(0, now + timeOffset);
        gain.gain.linearRampToValueAtTime(0.15, now + timeOffset + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.6);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.6);
    });
}
