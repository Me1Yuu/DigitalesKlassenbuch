 let currentFilter = 'all';
        let sortOrders = {};
        
        function showSection(sectionName) {
            // Hide all sections
            const sections = document.querySelectorAll('.section-content');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Remove active class from all buttons
            const buttons = document.querySelectorAll('.nav-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected section
            document.getElementById(sectionName + '-section').classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
            
            // Reset filter to "Show All" when switching sections
            filterStatus('all');
        }
        
        function filterStatus(status) {
            currentFilter = status;
            
            // Update filter button states
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Get current active section
            const activeSection = document.querySelector('.section-content.active');
            const tbody = activeSection.querySelector('tbody');
            const rows = tbody.querySelectorAll('tr');
            
            rows.forEach(row => {
                if (status === 'all') {
                    row.style.display = '';
                } else {
                    const statusBadge = row.querySelector('.status-badge');
                    if (statusBadge) {
                        const rowStatus = statusBadge.textContent.toLowerCase();
                        row.style.display = rowStatus === status ? '' : 'none';
                    }
                }
            });
        }
        
        function sortTable(columnIndex, tableType) {
            const tbody = document.getElementById(tableType + '-tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const th = event.target.closest('th');
            const arrow = th.querySelector('.sort-arrow');
            const sortKey = tableType + '-' + columnIndex;
            
            // Toggle sort order
            sortOrders[sortKey] = sortOrders[sortKey] === 'asc' ? 'desc' : 'asc';
            const ascending = sortOrders[sortKey] === 'asc';
            
            // Reset all arrows in this table
            const allArrows = tbody.closest('table').querySelectorAll('.sort-arrow');
            allArrows.forEach(arr => {
                arr.classList.remove('desc');
            });
            
            // Set current arrow
            if (!ascending) {
                arrow.classList.add('desc');
            }
            
            rows.sort((a, b) => {
                let aText, bText;
                
                if (columnIndex === 1) { // Status column
                    aText = a.cells[columnIndex].querySelector('.status-badge').textContent.trim();
                    bText = b.cells[columnIndex].querySelector('.status-badge').textContent.trim();
                } else { // Name column
                    aText = a.cells[columnIndex].textContent.trim();
                    bText = b.cells[columnIndex].textContent.trim();
                }
                
                if (ascending) {
                    return aText.localeCompare(bText);
                } else {
                    return bText.localeCompare(aText);
                }
            });
            
            // Re-append sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }