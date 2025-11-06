// ========== STORAGE MODULE ==========
// Single Responsibility: Handle all localStorage operations

const Storage = {
    // ========== JOURNAL ENTRIES ==========
    
    getEntries() {
        return JSON.parse(localStorage.getItem('journalEntries') || '{}');
    },

    saveEntries(entries) {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        // Sync to cloud if Firebase is available
        if (window.FirebaseConfig && window.FirebaseConfig.currentUser) {
            window.FirebaseConfig.saveToCloud('journal/entries', entries);
        }
    },

    getEntry(date) {
        const entries = this.getEntries();
        return entries[date] || null;
    },

    saveEntry(date, entry) {
        const entries = this.getEntries();
        entries[date] = entry;
        this.saveEntries(entries);
    },

    deleteEntry(date) {
        const entries = this.getEntries();
        delete entries[date];
        this.saveEntries(entries);
    },

    // ========== DRAFTS ==========
    
    getDraft(date) {
        const draft = localStorage.getItem(`draft_${date}`);
        return draft ? JSON.parse(draft) : null;
    },

    saveDraft(date, draft) {
        localStorage.setItem(`draft_${date}`, JSON.stringify(draft));
    },

    deleteDraft(date) {
        localStorage.removeItem(`draft_${date}`);
    },

    // ========== PROJECTS ==========
    
    getProjects() {
        return JSON.parse(localStorage.getItem('journalProjects') || '{}');
    },

    saveProjects(projects) {
        localStorage.setItem('journalProjects', JSON.stringify(projects));
        
        // Sync to cloud if Firebase is available
        if (window.FirebaseConfig && window.FirebaseConfig.currentUser) {
            window.FirebaseConfig.saveToCloud('projects/projects', projects);
        }
    },

    getProject(projectId) {
        const projects = this.getProjects();
        return projects[projectId] || null;
    },

    saveProject(projectId, project) {
        const projects = this.getProjects();
        projects[projectId] = project;
        this.saveProjects(projects);
    },

    deleteProject(projectId) {
        const projects = this.getProjects();
        delete projects[projectId];
        this.saveProjects(projects);
    },

    // ========== STATS CALCULATION ==========
    
    calculateStreak() {
        const entries = this.getEntries();
        const dates = Object.keys(entries).sort().reverse();
        
        if (dates.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < dates.length; i++) {
            const entryDate = new Date(dates[i]);
            entryDate.setHours(0, 0, 0, 0);
            
            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);
            
            if (entryDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    },

    getTotalWords() {
        const entries = this.getEntries();
        const dates = Object.keys(entries);
        return dates.reduce((sum, date) => sum + (entries[date].wordCount || 0), 0);
    },

    // ========== PROJECT STATS ==========
    
    getProjectStats() {
        const projects = this.getProjects();
        const projectIds = Object.keys(projects);
        
        let activeCount = 0;
        let solvedCount = 0;
        let totalIdeas = 0;
        
        projectIds.forEach(id => {
            const project = projects[id];
            if (project.status === 'active') activeCount++;
            if (project.status === 'solved') solvedCount++;
            if (project.ideas) totalIdeas += project.ideas.length;
        });
        
        return { activeCount, solvedCount, totalIdeas };
    },

    // ========== MIGRATION & CLEANUP ==========
    
    migrateOldData() {
        // Migrate old single-entry format to date-based entries
        const oldEntry = localStorage.getItem('todayEntry');
        if (oldEntry) {
            const today = new Date().toISOString().split('T')[0];
            const entries = this.getEntries();
            if (!entries[today]) {
                entries[today] = {
                    text: oldEntry,
                    timestamp: new Date().toISOString()
                };
                this.saveEntries(entries);
            }
            localStorage.removeItem('todayEntry');
        }
    },

    // ========== EXPORT/IMPORT ==========
    
    exportAllData() {
        return {
            entries: this.getEntries(),
            projects: this.getProjects(),
            exportDate: new Date().toISOString()
        };
    },

    importData(data) {
        if (data.entries) {
            localStorage.setItem('journalEntries', JSON.stringify(data.entries));
        }
        if (data.projects) {
            localStorage.setItem('journalProjects', JSON.stringify(data.projects));
        }
    }
};

// Make Storage available globally
window.Storage = Storage;
