// ==================== ECHTZEIT DATUM & UHRZEIT ====================
function aktualisiereDatumZeit() {
    const jetzt = new Date();
    
    // Datum formatieren
    const datumOptionen = { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    };
    const datumStr = jetzt.toLocaleDateString('de-DE', datumOptionen);
    
    // Uhrzeit formatieren
    const stunden = String(jetzt.getHours()).padStart(2, '0');
    const minuten = String(jetzt.getMinutes()).padStart(2, '0');
    const sekunden = String(jetzt.getSeconds()).padStart(2, '0');
    const uhrzeitStr = `${stunden}:${minuten}:${sekunden}`;
    
    // DOM aktualisieren
    const datumElement = document.getElementById('datum');
    const uhrzeitElement = document.getElementById('uhrzeit');
    
    if (datumElement) datumElement.textContent = datumStr;
    if (uhrzeitElement) uhrzeitElement.textContent = uhrzeitStr;
}

// Initiale Aktualisierung und dann jede Sekunde
aktualisiereDatumZeit();
setInterval(aktualisiereDatumZeit, 1000);


// ==================== DARK MODE TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Theme aus localStorage laden
const gespeichertesTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', gespeichertesTheme);

// Theme Toggle Event
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const aktuellesTheme = htmlElement.getAttribute('data-theme');
        const neuesTheme = aktuellesTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', neuesTheme);
        localStorage.setItem('theme', neuesTheme);
    });
}


// ==================== AVATAR UPLOAD ====================
const avatarDisplay = document.getElementById('avatarDisplay');
const avatarUpload = document.getElementById('avatarUpload');
const avatarChangeBtn = document.getElementById('avatarChangeBtn');
const avatarDeleteBtn = document.getElementById('avatarDeleteBtn'); // NEU


// ========== INITIALEN GENERIEREN ==========
function generiereInitialen() {
    const name = 'Max Mustermann'; // Oder aus Backend laden
    const teile = name.trim().split(' ');
    if (teile.length >= 2) {
        return (teile[0][0] + teile[teile.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


// ========== Profilbild ==========
function ladeAvatar() {
    const gespeichertesAvatar = localStorage.getItem('userAvatar');
    
    if (gespeichertesAvatar) {
        // Bild vorhanden → anzeigen
        avatarDisplay.style.backgroundImage = `url(${gespeichertesAvatar})`;
        avatarDisplay.textContent = '';
        avatarDeleteBtn.style.display = 'inline-block'; // Delete Button sichtbar
    } else {
        // Kein Bild → Initialen anzeigen
        avatarDisplay.style.backgroundImage = 'none';
        avatarDisplay.textContent = generiereInitialen();
        avatarDeleteBtn.style.display = 'none'; // Delete Button versteckt
    }
}

// Beim Laden ausführen
ladeAvatar();

//Profilbild ändern 
if (avatarChangeBtn) {
    avatarChangeBtn.addEventListener('click', () => {
        avatarUpload.click();
    });
}

//Profilbild hochladen 
if (avatarUpload) {
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const base64Image = e.target.result;
                
                // Avatar anzeigen
                avatarDisplay.style.backgroundImage = `url(${base64Image})`;
                avatarDisplay.textContent = '';
                
                // Im localStorage speichern
                localStorage.setItem('userAvatar', base64Image);
                
                // Delete Button sichtbar machen
                avatarDeleteBtn.style.display = 'inline-block';
                
                alert('Profilbild erfolgreich aktualisiert!');
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('Bitte wählen Sie eine gültige Bilddatei aus.');
        }
    });
}


//Pb löschen
if (avatarDeleteBtn) {
    avatarDeleteBtn.addEventListener('click', () => {
        const bestaetigung = confirm('Möchten Sie Ihr Profilbild wirklich löschen?');
        
        if (bestaetigung) {
            // localStorage löschen
            localStorage.removeItem('userAvatar');
            
            // Pb reset
            ladeAvatar();
            
            alert('Profilbild wurde erfolgreich gelöcsht.');
        }
    });
}


// ==================== MODAL SYSTEM ====================
const modals = {
    kurse: document.getElementById('modalKurse'),
    fachinhalte: document.getElementById('modalFachinhalte')
};

// Modal öffnen
document.querySelectorAll('.profile-card.editable').forEach(card => {
    card.addEventListener('click', () => {
        const modalType = card.getAttribute('data-modal');
        if (modals[modalType]) {
            modals[modalType].classList.add('active');
            ladeModalInhalt(modalType);
        }
    });
});

// Modal schließen
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalType = btn.getAttribute('data-modal');
        if (modals[modalType]) {
            modals[modalType].classList.remove('active');
        }
    });
});

// Modal schließen bei Klick außerhalb
Object.values(modals).forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});


// ========== DATEN ==========

const modalDaten = {
    kurse: [
        { id: 1, name: 'FI 21-1 - Anwendungsentwicklung' },
        { id: 2, name: 'FI 23-3 - Systemintegration' },
        { id: 3, name: 'FI 24-2 - IT-Grundlagen' },
    ],
    termine: [
        { id: 1, name: 'Prüfung Anwendungsentwicklung', date: '06.05.2025 14:00' },
        { id: 2, name: 'Klassentreffen FI 21-1', date: '10.05.2025 09:00' },
        { id: 3, name: 'Zwischenprüfung', date: '15.05.2025 08:00' },
        { id: 4, name: 'Abgabefrist Dokumentation', date: '20.05.2025 23:59' },
    ],
    berichte: [
        { id: 1, name: 'Projektbericht KW 18', status: 'Ausstehend' },
        { id: 2, name: 'Wochenbericht KW 19', status: 'Ausstehend' },
        { id: 3, name: 'Abschlussbericht Mai', status: 'Ausstehend' },
    ],
    fachinhalte: [
        { id: 1, name: 'Netzwerk-Grundlagen' },
        { id: 2, name: 'IT-Sicherheit' },
        { id: 3, name: 'Datenbanken' },
    ]
};

// ========== MODAL FUNKTIONEN ==========

const modal = document.getElementById('universal-modal');
const modalTitle = document.getElementById('modal-title');
const modalList = document.getElementById('modal-list');
const modalFooter = document.getElementById('modal-footer');
const modalClose = document.getElementById('modal-close');
const btnModalCancel = document.getElementById('btn-modal-cancel');
const btnModalSave = document.getElementById('btn-modal-save');

let aktuellesModal = null;

// Alle Karten mit Klick-Listener
document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', () => {
        const modalType = card.dataset.modal;
        oeffneModal(modalType);
    });
});

// Modal öffnen
function oeffneModal(type) {
    aktuellesModal = type;
    
    // Title
    const titles = {
        kurse: 'Meine Kurse',
        termine: 'Anstehende Termine',
        berichte: 'Offene Berichte',
        fachinhalte: 'Meine Fachinhalte'
    };
    
    modalTitle.textContent = titles[type];
    
    // Daten laden
    const daten = modalDaten[type];
    zeigeListeImModal(daten, type);
    
    // Footer nur wenn editierbar
    const editierbar = ['kurse', 'fachinhalte'].includes(type);
    modalFooter.style.display = editierbar ? 'flex' : 'none';
    
    // Modal anzeigen
    modal.classList.add('active');
}

// Liste im Modal anzeigen
function zeigeListeImModal(daten, type) {
    modalList.innerHTML = '';
    
    daten.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = 'modal-list-item';
        
        // Verschiedene Anzeigeformate je nach Type
        let inhalt = '';
        
        if (type === 'termine') {
            inhalt = `
                <div class="modal-list-item-text">${item.name}</div>
                <div class="modal-list-item-date">${item.date}</div>
            `;
        } else if (type === 'berichte') {
            inhalt = `
                <div class="modal-list-item-text">
                    ${item.name}
                    <br><small style="color: var(--text-light);">${item.status}</small>
                </div>
            `;
        } else {
            // Kurse und Fachinhalte (editierbar)
            inhalt = `
                <div class="modal-list-item-text">${item.name}</div>
                ${['kurse', 'fachinhalte'].includes(type) ? `
                    <button class="modal-list-item-delete" data-id="${item.id}">Löschen</button>
                ` : ''}
            `;
        }
        
        listItem.innerHTML = inhalt;
        modalList.appendChild(listItem);
        
        // Delete Button nur wenn editierbar
        if (['kurse', 'fachinhalte'].includes(type)) {
            const deleteBtn = listItem.querySelector('.modal-list-item-delete');
            deleteBtn?.addEventListener('click', () => {
                modalDaten[type] = modalDaten[type].filter(i => i.id !== parseInt(deleteBtn.dataset.id));
                zeigeListeImModal(modalDaten[type], type);
            });
        }
    });
    
    // ========== NEU: "Hinzufügen" Button ==========
    if (['kurse', 'fachinhalte'].includes(type)) {
        const addButton = document.createElement('button');
        addButton.className = 'btn-add-item';
        addButton.innerHTML = '<i class="fa-solid fa-plus"></i> Neuen Eintrag hinzufügen';
        addButton.addEventListener('click', () => {
            hinzufuegenNeuerEintrag(type);
        });
        modalList.appendChild(addButton);
    }
}

// ========== NEU: Neuen Eintrag hinzufügen ==========

function hinzufuegenNeuerEintrag(type) {
    const neuerName = prompt('Bitte geben Sie einen neuen Eintrag ein:');
    
    if (neuerName && neuerName.trim()) {
        const neueId = Math.max(...modalDaten[type].map(i => i.id), 0) + 1;
        modalDaten[type].push({ id: neueId, name: neuerName.trim() });
        zeigeListeImModal(modalDaten[type], type);
    }
}

// Modal schließen
function schliesseModal() {
    modal.classList.remove('active');
    aktuellesModal = null;
}

modalClose.addEventListener('click', schliesseModal);
btnModalCancel.addEventListener('click', schliesseModal);

// Außerhalb klicken → schließen
modal.addEventListener('click', (e) => {
    if (e.target === modal) schliesseModal();
});

// Speichern (nur für editierbar)
btnModalSave.addEventListener('click', () => {
    // Daten in localStorage speichern
    localStorage.setItem('modalDaten', JSON.stringify(modalDaten));
    
    alert(`${aktuellesModal} gespeichert!`);
    schliesseModal();
});

// ========== BEIM LADEN: Daten aus localStorage laden ==========

window.addEventListener('load', () => {
    const gespeichteDaten = localStorage.getItem('modalDaten');
    if (gespeichteDaten) {
        try {
            Object.assign(modalDaten, JSON.parse(gespeichteDaten));
        } catch (e) {
            console.error('Fehler beim Laden der Daten', e);
        }
    }
});


// ==================== STATISTIK AKTUALISIEREN ====================
function aktualisiereStatistik() {
    const kurse = JSON.parse(localStorage.getItem('kurse')) || getDefaultData('kurse');
    const statKurse = document.getElementById('statKurse');
    
    if (statKurse) {
        statKurse.textContent = kurse.length;
    }
    
    // Card-Preview aktualisieren
    const kurseCard = document.querySelector('[data-modal="kurse"] .card-preview');
    if (kurseCard && kurse.length > 0) {
        const preview = kurse.slice(0, 2).map(k => k.split('-')[0].trim()).join(', ');
        kurseCard.textContent = kurse.length > 2 ? `${preview}...` : preview;
    }
    
    const fachinhalte = JSON.parse(localStorage.getItem('fachinhalte')) || getDefaultData('fachinhalte');
    const fachinhalteCard = document.querySelector('[data-modal="fachinhalte"] .card-preview');
    if (fachinhalteCard && fachinhalte.length > 0) {
        const preview = fachinhalte.slice(0, 2).join(', ');
        fachinhalteCard.textContent = fachinhalte.length > 2 ? `${preview}...` : preview;
    }
}

// Initiale Statistik laden
aktualisiereStatistik();


// ==================== ENTER-TASTE SUPPORT ====================
document.getElementById('neuerKurs')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('addKursBtn').click();
    }
});

document.getElementById('neuerFachinhalt')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('addFachinhaltBtn').click();
    }
});
