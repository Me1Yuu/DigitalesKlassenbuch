// --------------- Echtzeit Datum und Uhrzeit aktualisieren ---------------
// Funktion zur Formatierung von Datum und Uhrzeit im deutschen Stil
function aktualisiereDatumZeit() {
    const jetzt = new Date();

    // Optionen für das Datum (Tag.Monat.Jahr)
    const datumOptionen = { day: '2-digit', month: '2-digit', year: 'numeric' };
    // Optionen für die Zeit (Stunden:Minuten)
    const zeitOptionen = { hour: '2-digit', minute: '2-digit' };

    // Formatiertes Datum und Zeit als Strings
    const datumStr = jetzt.toLocaleDateString('de-DE', datumOptionen);
    const zeitStr = jetzt.toLocaleTimeString('de-DE', zeitOptionen);

    // Datum-Elemente im Header (angenommen, sieht man z.B. an class="date-time")
    // Wir gehen davon aus, dass das erste Datum-Element Datum ist, zweites Zeit
    const dateTimeEls = document.querySelectorAll('.date-time');
    if (dateTimeEls.length >= 2) {
        dateTimeEls[0].textContent = datumStr;
        dateTimeEls[1].textContent = zeitStr;
    }
}

// Alle 1 Minute die Datum- und Uhrzeit-Funktion aufrufen, um aktuell zu bleiben
setInterval(aktualisiereDatumZeit, 60000);
// Einmal sofort aufrufen, damit es direkt angezeigt wird
aktualisiereDatumZeit();


// --------------- Darkmode Funktion ---------------
// Wir nehmen an, du hast im HTML das .sun-icon für den Dark/Light Mode Toggle
const sunIcon = document.querySelector('.sun-icon');

// Prüfe, ob das Element vorhanden ist
if (sunIcon) {
    sunIcon.style.cursor = 'pointer'; // Zeigt Hand-Cursor an, weil klickbar

    // Funktion zum Umschalten des Darkmodes
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        // Optional: Icon-Status ändern, z.B. Farbe oder Form (hier nur Farbe als Beispiel)
        if (document.body.classList.contains('dark-mode')) {
            sunIcon.style.backgroundColor = '#555'; // Dunkler Hintergrund im Darkmode
            sunIcon.style.setProperty('--icon-color', '#ffd93d'); // helle Farbe (falls benutzt)
        } else {
            sunIcon.style.backgroundColor = '#ffd93d'; // Original Gelb im Lightmode
            sunIcon.style.removeProperty('--icon-color');
        }
    }

    // Klick-Handler registrieren
    sunIcon.addEventListener('click', toggleDarkMode);
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
        modalContent.style.background = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.minWidth = '300px';
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

                // Schritt 2: Uhrzeit & Mail Einstellung abfragen
                zeigeModalInhalt(`
                    <h3>Erinnerungszeit & E-Mail</h3>
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
                    const timeInput = modalContent.querySelector('.reminder-time').value;
                    const emailChecked = modalContent.querySelector('.reminder-email').checked;

                    // Speichern (z.B. lokal)
                    localStorage.setItem('erinnerungAn', 'true');
                    localStorage.setItem('erinnerungsZeit', timeInput);
                    localStorage.setItem('erinnerungEmail', emailChecked ? 'true' : 'false');

                    // Status aktualisieren
                    erinnerungStatus.textContent = 'AN';
                    statusIndicator.style.backgroundColor = '#4caf50';

                    alert(`Erinnerung aktiviert um ${timeInput} Uhr${emailChecked ? ' mit E-Mail' : ''}.`);

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



//local storage hinzufügen, damiit es beim reload auch im darkmode erhalten bleibt//
