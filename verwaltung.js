// ========================================
// DIGITALES KLASSENBUCH - VERWALTUNGSSEITE
// JavaScript Funktionalitäten
// ========================================

// ===== DUMMY-DATEN =====
const dummyData = {
    trainer: [
        { name: 'Max Mustermann', bereich: 'AE / SI' },
        { name: 'Julia Schmidt', bereich: 'SI' },
        { name: 'Hans Hofmann', bereich: 'Coach' },
        { name: 'Lisa Müller', bereich: 'AE' },
        { name: 'Peter Wagner', bereich: 'SI / Coach' },
        { name: 'Anna Becker', bereich: 'AE' },
        { name: 'Tom Fischer', bereich: 'Coach' }
    ],
    kurse: [
        { name: 'FI 21-1', teilnehmer: 15, dauer: '16.11.2021 - 13.11.2023' },
        { name: 'FI 23-3', teilnehmer: 12, dauer: '01.09.2023 - 31.08.2025' },
        { name: 'FI 22-2', teilnehmer: 18, dauer: '15.03.2022 - 14.03.2024' },
        { name: 'FI 20-4', teilnehmer: 10, dauer: '10.10.2020 - 09.10.2022' },
        { name: 'FI 24-1', teilnehmer: 14, dauer: '01.09.2024 - 31.08.2026' },
        { name: 'FI 23-2', teilnehmer: 16, dauer: '15.02.2023 - 14.02.2025' }
    ],
    fachinhalte: [
        'Netzwerke Grundlagen',
        'Datenbanken',
        'HTML/CSS/JavaScript',
        'Linux Administration',
        'Java Programmierung',
        'Python',
        'Projektmanagement',
        'IT-Sicherheit',
        'Webentwicklung',
        'Cloud Computing',
        'DevOps',
        'Agile Methoden'
    ],
    umschueler: [
        { name: 'Anna Bauer', kurs: 'FI 21-1', fachrichtung: 'AE' },
        { name: 'Tom Fischer', kurs: 'FI 23-3', fachrichtung: 'SI' },
        { name: 'Sarah Klein', kurs: 'FI 22-2', fachrichtung: 'AE' },
        { name: 'Michael Groß', kurs: 'FI 21-1', fachrichtung: 'AE' },
        { name: 'Laura Weber', kurs: 'FI 24-1', fachrichtung: 'AE' },
        { name: 'David Schneider', kurs: 'FI 23-3', fachrichtung: 'SI' },
        { name: 'Emma Hoffmann', kurs: 'FI 22-2', fachrichtung: 'AE' }
    ]
};

// ===== GLOBALE VARIABLEN =====
let currentTab = 'trainer';
let allData = { ...dummyData };

// ===== TAB-WECHSEL FUNKTIONALITÄT =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Aktive Klasse entfernen
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Neue aktive Klasse setzen
        btn.classList.add('active');
        currentTab = btn.dataset.tab;
        document.getElementById(`${currentTab}-content`).classList.add('active');
        
        // Filter zurücksetzen und Daten neu laden
        document.getElementById('searchInput').value = '';
        updateFilterOptions();
        renderData();
    });
});

// ===== FILTER-OPTIONEN DYNAMISCH AKTUALISIEREN =====
function updateFilterOptions() {
    const filterSelect = document.getElementById('filterSelect');
    filterSelect.innerHTML = '<option value="alle">Alle anzeigen</option>';
    
    if (currentTab === 'trainer') {
        filterSelect.innerHTML += `
            <option value="az">Sortieren A-Z</option>
            <option value="za">Sortieren Z-A</option>
            <option value="AE">Nur AE</option>
            <option value="SI">Nur SI</option>
            <option value="Coach">Nur Coach</option>
        `;
    } else if (currentTab === 'kurse') {
        filterSelect.innerHTML += `
            <option value="az">Sortieren A-Z</option>
            <option value="za">Sortieren Z-A</option>
            <option value="teilnehmer">Nach Teilnehmerzahl</option>
        `;
    } else if (currentTab === 'fachinhalte') {
        filterSelect.innerHTML += `
            <option value="az">Sortieren A-Z</option>
            <option value="za">Sortieren Z-A</option>
        `;
    } else if (currentTab === 'umschueler') {
        filterSelect.innerHTML += `
            <option value="az">Sortieren A-Z</option>
            <option value="za">Sortieren Z-A</option>
            <option value="kurs">Nach Kurs</option>
            <option value="AE">Nur AE</option>
            <option value="SI">Nur SI</option>
        `;
    }
}

// ===== DATEN RENDERN =====
function renderData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterValue = document.getElementById('filterSelect').value;
    
    let dataToRender = currentTab === 'fachinhalte' 
        ? [...allData[currentTab]] 
        : JSON.parse(JSON.stringify(allData[currentTab]));
    
    // Filter anwenden
    if (filterValue !== 'alle') {
        if (filterValue === 'az') {
            // Sortieren A-Z
            if (currentTab === 'fachinhalte') {
                dataToRender.sort((a, b) => a.localeCompare(b));
            } else {
                dataToRender.sort((a, b) => a.name.localeCompare(b.name));
            }
        } else if (filterValue === 'za') {
            // Sortieren Z-A
            if (currentTab === 'fachinhalte') {
                dataToRender.sort((a, b) => b.localeCompare(a));
            } else {
                dataToRender.sort((a, b) => b.name.localeCompare(a.name));
            }
        } else if (filterValue === 'teilnehmer') {
            // Kurse nach Teilnehmerzahl sortieren
            dataToRender.sort((a, b) => b.teilnehmer - a.teilnehmer);
        } else if (filterValue === 'kurs') {
            // Umschüler nach Kurs sortieren
            dataToRender.sort((a, b) => a.kurs.localeCompare(b.kurs));
        } else if (currentTab === 'trainer') {
            // Umschüler nach Kurs sortieren
            dataToRender.sort((a, b) => a.kurs.localeCompare(b.kurs));
        } else if (currentTab === 'trainer') {
            // Trainer nach Bereich filtern
            dataToRender = dataToRender.filter(item => item.bereich.includes(filterValue));
        } else if (currentTab === 'umschueler') {
            // Umschüler nach Fachrichtung filtern
            dataToRender = dataToRender.filter(item => item.fachrichtung === filterValue);
        }
    }
    
    // Suche anwenden
    if (searchTerm) {
        if (currentTab === 'fachinhalte') {
            dataToRender = dataToRender.filter(item => 
                item.toLowerCase().includes(searchTerm)
            );
        } else {
            dataToRender = dataToRender.filter(item => {
                return Object.values(item).some(val => 
                    String(val).toLowerCase().includes(searchTerm)
                );
            });
        }
    }
    
    // Spezielle Render-Logik für Fachinhalte
    if (currentTab === 'fachinhalte') {
        renderFachinhalte(dataToRender);
        return;
    }
    
    // Tabelle befüllen
    const tbody = document.getElementById(`${currentTab}-tbody`);
    
    if (dataToRender.length === 0) {
        const colspan = currentTab === 'trainer' ? 2 : 3;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="empty-state">Keine Ergebnisse gefunden</td></tr>`;
        return;
    }
    
    tbody.innerHTML = '';
    
    dataToRender.forEach(item => {
        const tr = document.createElement('tr');
        
        if (currentTab === 'trainer') {
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.bereich}</td>
            `;
        } else if (currentTab === 'kurse') {
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.teilnehmer}</td>
                <td>${item.dauer}</td>
            `;
        } else if (currentTab === 'umschueler') {
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.kurs}</td>
                <td><span class="status-badge status-${item.fachrichtung.toLowerCase()}">${item.fachrichtung}</span></td>
            `;
        }
        
        tbody.appendChild(tr);
    });
}

// ===== FACHINHALTE ALS CHIPS RENDERN =====
function renderFachinhalte(data) {
    const grid = document.getElementById('fachinhalte-grid');
    
    if (data.length === 0) {
        grid.innerHTML = '<p class="empty-state">Keine Ergebnisse gefunden</p>';
        return;
    }
    
    grid.innerHTML = '';
    
    data.forEach(inhalt => {
        const chip = document.createElement('div');
        chip.className = 'fachinhalt-chip';
        chip.textContent = inhalt;
        grid.appendChild(chip);
    });
}

// ===== ECHTZEIT-SUCHE =====
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    renderData();
});

// ===== FILTER-ÄNDERUNG =====
const filterSelect = document.getElementById('filterSelect');
filterSelect.addEventListener('change', () => {
    renderData();
});

// ===== INITIALISIERUNG =====
window.addEventListener('DOMContentLoaded', () => {
    updateFilterOptions();
    renderData();
});

// ===== CONSOLE LOG FÜR ENTWICKLUNG =====
console.log('✅ Verwaltungsseite geladen');
console.log('📊 Dummy-Daten:', dummyData);
