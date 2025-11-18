// ==================== ECHTZEIT DATUM & UHRZEIT (identisch wie index.html) ====================
function aktualisiereDatumZeit() {
    const jetzt = new Date();
    
    const datumOptionen = { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    };
    const datumStr = jetzt.toLocaleDateString('de-DE', datumOptionen);
    
    const stunden = String(jetzt.getHours()).padStart(2, '0');
    const minuten = String(jetzt.getMinutes()).padStart(2, '0');
    const sekunden = String(jetzt.getSeconds()).padStart(2, '0');
    const uhrzeitStr = `${stunden}:${minuten}:${sekunden}`;
    
    const datumElement = document.getElementById('datum');
    const uhrzeitElement = document.getElementById('uhrzeit');
    
    if (datumElement) datumElement.textContent = datumStr;
    if (uhrzeitElement) uhrzeitElement.textContent = uhrzeitStr;
}

aktualisiereDatumZeit();
setInterval(aktualisiereDatumZeit, 1000);


// ==================== DARK MODE TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const gespeichertesTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', gespeichertesTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const aktuellesTheme = htmlElement.getAttribute('data-theme');
        const neuesTheme = aktuellesTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', neuesTheme);
        localStorage.setItem('theme', neuesTheme);
    });
}


// ==================== SCHRIFTGRÖSSE ====================
const fontSizeBtns = document.querySelectorAll('.font-size-btn');

// Schriftgröße aus localStorage laden
const gespeicherteFontSize = localStorage.getItem('fontSize') || 'medium';
htmlElement.setAttribute('data-font-size', gespeicherteFontSize);
aktualisiereFontSizeButtons();

fontSizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        
        // Entferne 'active' von allen Buttons
        fontSizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Schriftgröße anwenden
        htmlElement.setAttribute('data-font-size', size);
        localStorage.setItem('fontSize', size);
    });
});

function aktualisiereFontSizeButtons() {
    const aktuelleFontSize = localStorage.getItem('fontSize') || 'medium';
    fontSizeBtns.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.font-size-btn[data-size="${aktuelleFontSize}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}


// ==================== BENACHRICHTIGUNGS-SYMBOL TOGGLE ====================
const showNotificationIcon = document.getElementById('showNotificationIcon');

// Einstellung laden
if (showNotificationIcon) {
    const showIcon = localStorage.getItem('showNotificationIcon') !== 'false'; // Default: true
    showNotificationIcon.checked = showIcon;
}
// Direkt nach dem Laden hinzufügen:
if (showNotificationIcon) {
    showNotificationIcon.addEventListener('change', () => {
        localStorage.setItem('showNotificationIcon', showNotificationIcon.checked);
    });
}


// ==================== SPRACHE ====================
const languageSelect = document.getElementById('languageSelect');

// Sprache laden
if (languageSelect) {
    const savedLanguage = localStorage.getItem('language') || 'de';
    languageSelect.value = savedLanguage;
}


// ==================== PASSWORT ÄNDERN MODAL ====================
const passwordModal = document.getElementById('passwordModal');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const closePasswordModal = document.getElementById('closePasswordModal');
const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
const savePasswordBtn = document.getElementById('savePasswordBtn');

// Modal öffnen
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        passwordModal.classList.add('active');
    });
}

// Modal schließen
function closeModal() {
    passwordModal.classList.remove('active');
    // Felder leeren
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

if (closePasswordModal) {
    closePasswordModal.addEventListener('click', closeModal);
}

if (cancelPasswordBtn) {
    cancelPasswordBtn.addEventListener('click', closeModal);
}

// Modal schließen bei Klick außerhalb
passwordModal?.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
        closeModal();
    }
});

// Passwort speichern
if (savePasswordBtn) {
    savePasswordBtn.addEventListener('click', () => {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validierung
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Bitte füllen Sie alle Felder aus.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('Die neuen Passwörter stimmen nicht überein.');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Das neue Passwort muss mindestens 8 Zeichen lang sein.');
            return;
        }
        
        // Hier würde normalerweise ein Backend-Call erfolgen
        alert('Passwort erfolgreich geändert!');
        closeModal();
    });
}


// ==================== ZURÜCKSETZEN ====================
const resetBtn = document.getElementById('resetBtn');

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        const bestaetigung = confirm('Möchten Sie wirklich alle Einstellungen auf die Standardwerte zurücksetzen?');
        
        if (bestaetigung) {
            // Alle Einstellungen zurücksetzen
            localStorage.setItem('theme', 'light');
            localStorage.setItem('fontSize', 'medium');
            localStorage.setItem('showNotificationIcon', 'true');
            localStorage.setItem('language', 'de');
            
            // Seite neu laden
            location.reload();
        }
    });
}


// ==================== SPEICHERN ====================
const saveBtn = document.getElementById('saveBtn');

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        // Alle Einstellungen speichern
        
        // Benachrichtigungs-Symbol
        if (showNotificationIcon) {
            localStorage.setItem('showNotificationIcon', showNotificationIcon.checked);
        }
        
        // Sprache
        if (languageSelect) {
            localStorage.setItem('language', languageSelect.value);
        }
        
        // Theme und Schriftgröße sind bereits live gespeichert
        
        alert('Einstellungen erfolgreich gespeichert!');
    });
}
