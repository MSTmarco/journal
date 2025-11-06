// ========== CALENDAR MODULE ==========
// Single Responsibility: Handle calendar rendering and visualization

const Calendar = {
    // ========== RENDER CALENDAR ==========
    
    render(containerElement) {
        if (!containerElement) return;
        
        containerElement.innerHTML = '';
        
        const entries = Storage.getEntries();
        const today = new Date();
        
        for (let i = 59; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.dataset.date = dateStr;
            
            const formattedDate = Formatter.formatDateInEnglish(dateStr);
            day.setAttribute('data-date', formattedDate.short);
            
            if (entries[dateStr]) {
                day.classList.add('written');
                day.title = `${entries[dateStr].wordCount || 0} words`;
            }
            
            if (i === 0) {
                day.classList.add('today');
            }
            
            // Add click handler to load entry
            day.addEventListener('click', () => {
                this.onDayClick(dateStr);
            });
            
            containerElement.appendChild(day);
        }
    },

    // ========== EVENT HANDLERS ==========
    
    onDayClick(dateStr) {
        // Switch to journal view
        if (window.App) {
            window.App.switchView('journal');
        }
        
        // Set the date picker and load entry
        const datePicker = document.getElementById('entryDate');
        if (datePicker) {
            datePicker.value = dateStr;
            
            // Trigger change event
            const event = new Event('change');
            datePicker.dispatchEvent(event);
        }
        
        // Scroll to writing area
        const writingArea = document.querySelector('.writing-area');
        if (writingArea) {
            setTimeout(() => {
                writingArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    },

    // ========== UPDATE ==========
    
    update() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (calendarGrid) {
            this.render(calendarGrid);
        }
    }
};

// Make Calendar available globally
window.Calendar = Calendar;
