// ========== MAIN APP ==========
// Orchestrates all modules and handles navigation

const App = {
    currentView: 'projects', // Start with projects view!

    // ========== INITIALIZATION ==========

init() {
    console.log('🚀 Initializing Journal & Projects App...');
    
    // Initialize Firebase first
    FirebaseConfig.init().then(() => {
        Storage.migrateOldData();
        
        this.setupNavigation();
        this.setupScrollBehavior();
        this.setupAuthHandlers();
        Journal.init();
        Projects.init();
        Calendar.render(document.getElementById('calendarGrid'));
        
        // Initialize new modules
        if (typeof GrammarChecker !== 'undefined') {
            GrammarChecker.init();
            console.log('✅ Grammar Checker initialized');
        }
        
        if (typeof MotivationalImages !== 'undefined') {
            MotivationalImages.init();
            console.log('✅ Motivational Images initialized');
        }
        
        this.switchView(this.currentView);
        
        console.log('✅ App initialized successfully!');
    });
},

    // ========== AUTHENTICATION HANDLERS ==========
    
    setupAuthHandlers() {
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                tab.classList.add('active');
                const formId = tab.dataset.tab + 'Form';
                document.getElementById(formId).classList.add('active');
                
                // Clear error
                document.getElementById('authError').classList.remove('show');
            });
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = await FirebaseConfig.login(email, password);
            if (!result.success) {
                this.showAuthError(result.error);
            }
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
            
            if (password !== passwordConfirm) {
                this.showAuthError('Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                this.showAuthError('Password must be at least 6 characters');
                return;
            }
            
            const result = await FirebaseConfig.signup(email, password);
            if (!result.success) {
                this.showAuthError(result.error);
            }
        });

        // Google Login button
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', async () => {
                const result = await FirebaseConfig.loginWithGoogle();
                if (!result.success) {
                    this.showAuthError(result.error);
                }
            });
        }

        // Google Signup button
        const googleSignupBtn = document.getElementById('googleSignupBtn');
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', async () => {
                const result = await FirebaseConfig.loginWithGoogle();
                if (!result.success) {
                    this.showAuthError(result.error);
                }
            });
        }

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            if (confirm('Are you sure you want to logout?')) {
                await FirebaseConfig.logout();
            }
        });

        // Update user avatar
        if (FirebaseConfig.currentUser) {
            const email = FirebaseConfig.currentUser.email;
            const avatar = email.charAt(0).toUpperCase();
            document.getElementById('userAvatar').textContent = avatar;
            document.getElementById('userBar').classList.add('show');
        }
    },

    showAuthError(message) {
        const errorEl = document.getElementById('authError');
        errorEl.textContent = message;
        errorEl.classList.add('show');
        
        setTimeout(() => {
            errorEl.classList.remove('show');
        }, 5000);
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

    // ========== HIDE NAVBAR ON SCROLL ==========
    setupScrollBehavior() {
        let lastScrollTop = 0;
        const nav = document.querySelector('.main-nav');
        const scrollThreshold = 100; // Start hiding after 100px scroll

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > scrollThreshold) {
                if (scrollTop > lastScrollTop) {
                    // Scrolling down - hide navbar
                    nav.classList.add('hidden');
                } else {
                    // Scrolling up - show navbar
                    nav.classList.remove('hidden');
                }
            } else {
                // At top of page - always show navbar
                nav.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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
