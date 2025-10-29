// ========== MAIN APP ==========
// Orchestrates all modules and handles navigation

const App = {
    currentView: 'projects', // Start with projects view!

    // ========== INITIALIZATION ==========

    init() {
        console.log('🚀 Initializing Journal & Projects App...');
        
        // Migrate old data if needed
        Storage.migrateOldData();
        
        // Initialize modules
        this.setupNavigation();
        Journal.init();
        Projects.init();
        Calendar.render(document.getElementById('calendarGrid'));
        
        // Show default view (Projects first!)
        this.switchView(this.currentView);
        
        console.log('✅ App initialized successfully!');
    },

    // ========== NAVIGATION ==========

    setupNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const view = tab.dataset.view;
                this.switchView(view);
            });
        });
    },

    switchView(view) {
        console.log(`📍 Switching to ${view} view`);
        
        this.currentView = view;
        
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.view === view) {
                tab.classList.add('active');
            }
        });
        
        // Update view containers
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Refresh data when switching views
        if (view === 'projects') {
            Projects.updateStats();
            Projects.loadProjects();
        } else if (view === 'journal') {
            Journal.updateStats();
            Calendar.update();
        }
    },

    // ========== EXPORT/IMPORT ==========

    exportData() {
        const data = Storage.exportAllData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('✅ Data exported successfully!');
    },

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (confirm('Import this data? This will merge with your existing data.')) {
                        Storage.importData(data);
                        
                        // Refresh everything
                        Journal.updateStats();
                        Projects.updateStats();
                        Calendar.update();
                        Projects.loadProjects();
                        
                        alert('✅ Data imported successfully!');
                    }
                } catch (error) {
                    alert('❌ Error importing data. Please check the file format.');
                    console.error('Import error:', error);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },

    // ========== SHORTCUTS ==========

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + 1: Projects view
            if ((e.ctrlKey || e.metaKey) && e.key === '1') {
                e.preventDefault();
                this.switchView('projects');
            }
            
            // Ctrl/Cmd + 2: Journal view
            if ((e.ctrlKey || e.metaKey) && e.key === '2') {
                e.preventDefault();
                this.switchView('journal');
            }
            
            // Ctrl/Cmd + N: New project (when in projects view)
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && this.currentView === 'projects') {
                e.preventDefault();
                Projects.createNewProject();
            }
            
            // Ctrl/Cmd + S: Save journal entry (when in journal view)
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.currentView === 'journal') {
                e.preventDefault();
                Journal.saveEntry();
            }
        });
    }
};

// ========== START THE APP ==========

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.setupKeyboardShortcuts();
});

// Make App available globally
window.App = App;
