// ========================================
// DIGITALES KLASSENBUCH - STARTSEITE
// JavaScript Funktionalitäten
// ========================================

// ===== ECHTZEIT DATUM UND UHRZEIT =====
/**
 * Aktualisiert Datum und Uhrzeit in Echtzeit (jede Sekunde)
 * Formatierung im deutschen Stil: DD.MM.YYYY und HH:MM:SS
 */
function aktualisiereDatumZeit() {
    const jetzt = new Date();

    // Datum formatieren (TT.MM.JJJJ)
    const tag = String(jetzt.getDate()).padStart(2, '0');
    const monat = String(jetzt.getMonth() + 1).padStart(2, '0');
    const jahr = jetzt.getFullYear();
    const datumStr = `${tag}.${monat}.${jahr}`;

    // Uhrzeit formatieren (HH:MM:SS)
    const stunden = String(jetzt.getHours()).padStart(2, '0');
    const minuten = String(jetzt.getMinutes()).padStart(2, '0');
    const sekunden = String(jetzt.getSeconds()).padStart(2, '0');
    const zeitStr = `${stunden}:${minuten}:${sekunden}`;

    // DOM-Elemente aktualisieren
    const datumEl = document.getElementById('datum');
    const uhrzeitEl = document.getElementById('uhrzeit');
    
    if (datumEl) datumEl.textContent = datumStr;
    if (uhrzeitEl) uhrzeitEl.textContent = zeitStr;
}

// Initialer Aufruf und Update alle 1 Sekunde für Echtzeit
aktualisiereDatumZeit();
setInterval(aktualisiereDatumZeit, 1000);


// ===== DARK MODE TOGGLE =====
/**
 * Wechselt zwischen hellem und dunklem Design
 * Speichert Präferenz im localStorage
 */
const sunIcon = document.querySelector('.sun-icon');

if (sunIcon) {
    sunIcon.style.cursor = 'pointer';

    // Dark Mode Zustand laden
    function ladeDarkModeStatus() {
        const istDarkMode = localStorage.getItem('darkMode') === 'true';
        if (istDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    // Dark Mode umschalten
    function toggleDarkMode() {
        const body = document.body;
        body.classList.toggle('dark-mode');
        
        // Status speichern
        const istDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', istDarkMode);
    }

    // Event Listener
    sunIcon.addEventListener('click', toggleDarkMode);
    
    // Initial laden
    ladeDarkModeStatus();
}


// ------------ Erinnerung mit mehrstufigem Modal ------------

// Referenzen zum Status und Indikator
const erinnerungStatus = document.querySelector('.status span');
const statusIndicator = document.querySelector('.status-indicator');

if (erinnerungStatus && statusIndicator) {

    // Hilfsfunktion: Erstelle und zeige ein modales Dialogfenster
    function zeigeModalInhalt(htmlInhalt, onConfirm, onCancel) {
        // Modal Container erstellen
        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '10000';

        // Modal Content Box
        let modalContent = document.createElement('div');
        modalContent.style.background = document.body.classList.contains('dark-mode') ? '#2a2a2a' : '#fff';
        modalContent.style.color = document.body.classList.contains('dark-mode') ? '#f5f5f5' : '#333';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.minWidth = '350px';
        modalContent.style.maxWidth = '500px';
        modalContent.innerHTML = htmlInhalt;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Buttons finden
        const btnConfirm = modalContent.querySelector('.btn-confirm');
        const btnCancel = modalContent.querySelector('.btn-cancel');

        if (btnConfirm) {
            btnConfirm.addEventListener('click', () => {
                onConfirm(modalContent);
                document.body.removeChild(modal);
            });
        }
        if (btnCancel) {
            btnCancel.addEventListener('click', () => {
                if (onCancel) onCancel();
                document.body.removeChild(modal);
            });
        }
    }

    // Klick-Event auf den Status
    erinnerungStatus.addEventListener('click', () => {
        if (erinnerungStatus.textContent.trim() === 'AUS') {

            // Schritt 1: Popup um Einschalten zu bestätigen
            zeigeModalInhalt(`
                <h3>Erinnerungen aktivieren?</h3>
                <p>Möchten Sie tägliche Erinnerungen für Ihre Berichte erhalten?</p>
                <button class="btn-confirm">Ja</button>
                <button class="btn-cancel">Nein</button>
            `, () => {

                 // Heutiges Datum als Standard
                const heute = new Date();
                const heuteDatum = heute.toISOString().split('T')[0];

                // Schritt 2: Uhrzeit & Mail Einstellung abfragen
                zeigeModalInhalt(`
                    <h3>Erinnerungszeit & E-Mail</h3>
                       <label style="display: block; margin-bottom: 15px;">
                        <strong>Datum:</strong><br>
                        <input type="date" class="reminder-date" value="${heuteDatum}" required 
                               style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;" />
                    </label>
                    <label style="display: block; margin-bottom: 15px;">
                        <strong>Wofür möchten Sie erinnert werden? (optional)</strong><br>
                        <textarea class="reminder-text" placeholder="z.B. Tagesbericht ausfüllen" rows="3" 
                                  style="width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; resize: vertical; font-family: inherit;"></textarea>
                    </label>
                    <label>
                        Uhrzeit für Erinnerung:
                        <input type="time" class="reminder-time" value="18:00" required />
                    </label>
                    <br><br>
                    <label>
                        <input type="checkbox" class="reminder-email" />
                        Erinnerung auch per E-Mail erhalten
                    </label>
                    <br><br>
                    <button class="btn-confirm">Speichern</button>
                    <button class="btn-cancel">Abbrechen</button>
                `, (modalContent) => {
                    const dateInput = modalContent.querySelector('.reminder-date').value;
                    const timeInput = modalContent.querySelector('.reminder-time').value;
                    const textInput = modalContent.querySelector('.reminder-text').value.trim();  
                    const emailChecked = modalContent.querySelector('.reminder-email').checked;

                    // Speichern
                    localStorage.setItem('erinnerungAn', 'true');
                    localStorage.setItem('erinnerungDatum', dateInput);
                    localStorage.setItem('erinnerungsZeit', timeInput);
                    localStorage.setItem('erinnerungText', textInput);
                    localStorage.setItem('erinnerungEmail', emailChecked ? 'true' : 'false');

                    // Status aktualisieren
                    erinnerungStatus.textContent = 'AN';
                    statusIndicator.style.backgroundColor = '#4caf50';

                     const datumTeile = dateInput.split('-');
                    const formatiertesDatum = `${datumTeile[2]}.${datumTeile[1]}.${datumTeile[0]}`;

                     // Alert-Text zusammenbauen
                    let alertText = `Erinnerung aktiviert für ${formatiertesDatum} um ${timeInput} Uhr`;
                    if (textInput) {
                        alertText += `\n\nWofür: ${textInput}`;
                    }
                    if (emailChecked) {
                        alertText += '\n\n✉️ E-Mail-Benachrichtigung aktiviert';
                    }

                    alert(alertText);
                    // Hier kannst du weitere Logik starten (Notification-API, Backend-Call, ...)
                });
            });
        } else {
            // AUS-Schritt: Erinnerungen ausschalten
            const willAus = confirm("Möchten Sie die täglichen Erinnerungen ausschalten?");
            if (willAus) {
                erinnerungStatus.textContent = 'AUS';
                statusIndicator.style.backgroundColor = '#ff9800';
                localStorage.setItem('erinnerungAn', 'false');
                alert("Erinnerungen wurden deaktiviert.");
            }
        }
    });

    // Optional: Status aus localStorage laden beim Laden der Seite
    window.addEventListener('DOMContentLoaded', () => {
        const an = localStorage.getItem('erinnerungAn');
        if (an === 'true') {
            erinnerungStatus.textContent = 'AN';
            statusIndicator.style.backgroundColor = '#4caf50';
        } else {
            erinnerungStatus.textContent = 'AUS';
            statusIndicator.style.backgroundColor = '#ff9800';
        }
    });
}

//DAS LIEGT BEREITS IN DER VERGANGENHEIT - FUNKTION einbauen) 

// ===== LOGOUT BESTÄTIGUNG =====
/**
 * Zeigt Bestätigung beim Ausloggen
 */
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const bestaetigung = confirm('Möchten Sie sich wirklich ausloggen?');
        if (bestaetigung) {
            // Hier würde normalerweise die Logout-Logik folgen
            alert('Logout erfolgreich!');
            // window.location.href = 'login.html';
        }
    });
}


// ===== CONSOLE LOG FÜR ENTWICKLUNG =====
console.log('✅ Digitales Klassenbuch - Startseite geladen');
console.log('📅 Datum/Uhrzeit: Echtzeit aktiv');
console.log('🌓 Dark Mode: ' + (localStorage.getItem('darkMode') === 'true' ? 'AN' : 'AUS'));
console.log('🔔 Erinnerungen: ' + (localStorage.getItem('erinnerungAn') === 'true' ? 'AN' : 'AUS'));
