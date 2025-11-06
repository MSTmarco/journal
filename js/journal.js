// ========== JOURNAL MODULE ==========
// Single Responsibility: Handle daily journal operations

const Journal = {
    prompts: [
        "What made you smile today?",
        "Describe a challenge you faced and how you handled it.",
        "What are you grateful for right now?",
        "If today was a movie, what genre would it be and why?",
        "What's one thing you learned about yourself today?",
        "Write about a conversation that stuck with you.",
        "What would you tell your younger self about today?",
        "Describe your perfect day. How close was today to that?",
        "What's something you're looking forward to?",
        "If you could relive one moment from today, which would it be?",
        "What emotions did you experience today and why?",
        "Write a letter to your future self about today.",
        "What would you change about today if you could?",
        "Describe the most interesting thing you saw or heard today.",
        "What's one small victory you had today?",
        "How did you take care of yourself today?",
        "What's on your mind right now?",
        "Describe your day using only five words, then explain.",
        "What did you create, make, or accomplish today?",
        "Who made a difference in your day and how?",
        "What's something you want to remember about this moment in your life?",
        "If today had a soundtrack, what would be playing?",
        "What's a problem you're working through right now?",
        "Describe a moment of peace you experienced today.",
        "What would you like tomorrow to bring?"
    ],

    currentGoal: 'words',
    startTime: null,
    timerInterval: null,
    currentPhoto: null,
    currentEntryDate: null,

    // ========== INITIALIZATION ==========

    init() {
        this.currentEntryDate = Formatter.getTodayString();
        this.setupElements();
        this.setupEventListeners();
        this.setRandomPrompt();
        this.loadEntryForDate(this.currentEntryDate);
        this.updateStats();
    },

    setupElements() {
        this.editor = document.getElementById('journalEntry');
        this.datePicker = document.getElementById('entryDate');
        this.photoInput = document.getElementById('photoInput');
        this.photoPreview = document.getElementById('photoPreview');
        this.wordCountElement = document.getElementById('wordCount');
        this.timerElement = document.getElementById('timer');
        this.promptText = document.getElementById('promptText');
        this.successMessage = document.getElementById('successMessage');
        
        // Set today's date
        if (this.datePicker) {
            this.datePicker.value = this.currentEntryDate;
        }
    },

    // ========== EVENT LISTENERS ==========

    setupEventListeners() {
        // Goal buttons
        document.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentGoal = btn.dataset.goal;
                this.resetTimer();
            });
        });

        // Refresh prompt
        const refreshBtn = document.getElementById('refreshPrompt');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setRandomPrompt();
            });
        }

        // Prompt card click
        const promptCard = document.getElementById('promptCard');
        if (promptCard) {
            promptCard.addEventListener('click', () => {
                if (this.editor) this.editor.focus();
            });
        }

        // Editor input
        if (this.editor) {
            this.editor.addEventListener('input', () => {
                this.updateWordCount();
                if (!this.startTime && this.editor.textContent.trim().length > 0) {
                    this.startTimer();
                }
            });
        }

        // Formatting toolbar
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const format = btn.dataset.format;
                Formatter.applyFormat(format, this.editor);
            });
        });

        // Photo upload
        const photoBtn = document.getElementById('photoBtn');
        if (photoBtn) {
            photoBtn.addEventListener('click', () => {
                this.photoInput.click();
            });
        }

        if (this.photoInput) {
            this.photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        // Date picker
        if (this.datePicker) {
            this.datePicker.addEventListener('change', (e) => {
                this.currentEntryDate = e.target.value;
                this.loadEntryForDate(this.currentEntryDate);
            });
        }

        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEntry());
        }

        // View history button
        const viewHistoryBtn = document.getElementById('viewHistoryBtn');
        if (viewHistoryBtn) {
            viewHistoryBtn.addEventListener('click', () => this.openHistoryModal());
        }

        // Close history modal
        const closeHistoryBtn = document.getElementById('closeHistoryModal');
        if (closeHistoryBtn) {
            closeHistoryBtn.addEventListener('click', () => this.closeHistoryModal());
        }

        // Search entries
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEntries());
        }

        // Auto-save every 30 seconds
        setInterval(() => this.autoSave(), 30000);
    },

    // ========== PROMPTS ==========

    setRandomPrompt() {
        if (!this.promptText) return;
        const randomPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        this.promptText.textContent = randomPrompt;
    },

    // ========== WORD COUNT & TIMER ==========

    updateWordCount() {
        Formatter.updateWordCount(this.editor, this.wordCountElement);
    },

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            if (this.timerElement) {
                this.timerElement.textContent = 
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    },

    resetTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startTime = null;
        if (this.timerElement) {
            this.timerElement.textContent = '';
        }
    },

    // ========== PHOTO HANDLING ==========

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.currentPhoto = event.target.result;
                this.displayPhoto(this.currentPhoto);
            };
            reader.readAsDataURL(file);
        }
    },

    displayPhoto(photoData) {
        if (!this.photoPreview) return;
        
        this.photoPreview.innerHTML = `
            <img src="${photoData}" alt="Journal photo">
            <button class="remove-photo" onclick="Journal.removePhoto()">×</button>
        `;
        this.photoPreview.classList.add('has-photo');
    },

    removePhoto() {
        this.currentPhoto = null;
        if (this.photoPreview) {
            this.photoPreview.innerHTML = '';
            this.photoPreview.classList.remove('has-photo');
        }
        if (this.photoInput) {
            this.photoInput.value = '';
        }
    },

    // ========== SAVE & LOAD ==========

    saveEntry() {
        if (!this.editor) return;
        
        const html = this.editor.innerHTML.trim();
        const text = this.editor.textContent.trim();
        
        if (!text) {
            alert('Please write something before saving!');
            return;
        }

        const entryDate = this.currentEntryDate || Formatter.getTodayString();
        const wordCount = Formatter.countWords(text);
        
        const entry = {
            html: html,
            text: text,
            wordCount: wordCount,
            photo: this.currentPhoto,
            timestamp: new Date().toISOString()
        };

        Storage.saveEntry(entryDate, entry);
        Storage.deleteDraft(entryDate);
        
        this.showSuccessMessage();
        this.updateStats();
        Calendar.update();
        
        // Clear for next entry only if it's today
        const today = Formatter.getTodayString();
        if (entryDate === today) {
            setTimeout(() => {
                this.editor.innerHTML = '';
                this.removePhoto();
                this.updateWordCount();
                this.resetTimer();
            }, 1500);
        }
    },

    autoSave() {
        if (!this.editor) return;
        
        const html = this.editor.innerHTML.trim();
        const text = this.editor.textContent.trim();
        
        if (text) {
            const entryDate = this.currentEntryDate || Formatter.getTodayString();
            const draft = { 
                html, 
                text,
                photo: this.currentPhoto,
                timestamp: new Date().toISOString() 
            };
            Storage.saveDraft(entryDate, draft);
        }
    },

    loadEntryForDate(date) {
        if (!this.editor) return;
        
        // Check for saved entry first
        const entry = Storage.getEntry(date);
        if (entry) {
            this.editor.innerHTML = entry.html || entry.text;
            if (entry.photo) {
                this.currentPhoto = entry.photo;
                this.displayPhoto(entry.photo);
            } else {
                this.removePhoto();
            }
            this.updateWordCount();
            return;
        }
        
        // Check for draft
        const draft = Storage.getDraft(date);
        if (draft) {
            this.editor.innerHTML = draft.html;
            if (draft.photo) {
                this.currentPhoto = draft.photo;
                this.displayPhoto(draft.photo);
            } else {
                this.removePhoto();
            }
            this.updateWordCount();
        } else {
            // Clear editor
            this.editor.innerHTML = '';
            this.removePhoto();
            this.updateWordCount();
        }
    },

    // ========== STATS ==========

    updateStats() {
        const entries = Storage.getEntries();
        const dates = Object.keys(entries);
        
        const streakElement = document.getElementById('streakCount');
        const totalEntriesElement = document.getElementById('totalEntries');
        const totalWordsElement = document.getElementById('totalWords');
        
        if (streakElement) {
            streakElement.textContent = Storage.calculateStreak();
        }
        
        if (totalEntriesElement) {
            totalEntriesElement.textContent = dates.length;
        }
        
        if (totalWordsElement) {
            totalWordsElement.textContent = Storage.getTotalWords().toLocaleString();
        }
    },

    showSuccessMessage() {
        if (!this.successMessage) return;
        
        const streak = Storage.calculateStreak();
        let text = 'Entry saved!';
        if (streak === 1) text = 'Entry saved! Start of your journey.';
        else if (streak === 7) text = 'Entry saved! One week streak! 🎉';
        else if (streak === 30) text = 'Entry saved! 30 days strong! 🔥';
        else if (streak % 10 === 0) text = `Entry saved! ${streak} day streak! 💪`;
        
        document.getElementById('successText').textContent = text;
        this.successMessage.style.display = 'block';
        
        setTimeout(() => {
            this.successMessage.style.display = 'none';
        }, 3000);
    },

    // ========== HISTORY MODAL ==========

    openHistoryModal() {
        const modal = document.getElementById('historyModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.loadEntries();
        }
    },

    closeHistoryModal() {
        const modal = document.getElementById('historyModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    },

    loadEntries(searchTerm = '') {
        const entries = Storage.getEntries();
        const entriesList = document.getElementById('entriesList');
        if (!entriesList) return;
        
        const dates = Object.keys(entries).sort().reverse();
        
        if (dates.length === 0) {
            entriesList.innerHTML = `
                <div class="no-entries">
                    <div class="no-entries-icon">📝</div>
                    <h3>No entries yet</h3>
                    <p>Start writing to see your journal history here!</p>
                </div>
            `;
            return;
        }

        const filteredDates = searchTerm 
            ? dates.filter(date => entries[date].text.toLowerCase().includes(searchTerm.toLowerCase()))
            : dates;

        if (filteredDates.length === 0) {
            entriesList.innerHTML = `
                <div class="no-entries">
                    <div class="no-entries-icon">🔍</div>
                    <h3>No matches found</h3>
                    <p>Try a different search term</p>
                </div>
            `;
            return;
        }

        entriesList.innerHTML = filteredDates.map(date => {
            const entry = entries[date];
            const formattedDate = Formatter.formatDateInEnglish(date).full;
            
            const photoHTML = entry.photo ? `<img src="${entry.photo}" alt="Journal photo">` : '';
            const contentHTML = entry.html || entry.text;
            
            return `
                <div class="entry-card" data-date="${date}">
                    <div class="entry-header">
                        <div class="entry-date">${formattedDate}</div>
                        <div class="entry-meta">${entry.wordCount || 0} words</div>
                    </div>
                    <div class="entry-preview">${photoHTML}${contentHTML}</div>
                    <div class="entry-actions">
                        <button class="entry-btn edit-btn" onclick="Journal.editEntry('${date}')">Edit</button>
                        <button class="entry-btn delete-btn" onclick="Journal.deleteEntry('${date}')">Delete</button>
                        <button class="entry-btn collapse-btn" onclick="Journal.collapseEntry('${date}')">Collapse</button>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers to expand entries
        document.querySelectorAll('.entry-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('entry-btn')) {
                    card.classList.toggle('expanded');
                }
            });
        });
    },

    filterEntries() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput ? searchInput.value : '';
        this.loadEntries(searchTerm);
    },

    editEntry(date) {
        const entry = Storage.getEntry(date);
        if (!entry) return;
        
        if (confirm('Load this entry for editing? (Your current draft will be replaced)')) {
            this.editor.innerHTML = entry.html || entry.text;
            
            if (entry.photo) {
                this.currentPhoto = entry.photo;
                this.displayPhoto(entry.photo);
            }
            
            this.datePicker.value = date;
            this.currentEntryDate = date;
            
            this.updateWordCount();
            this.closeHistoryModal();
            
            // Switch to journal view
            if (window.App) {
                window.App.switchView('journal');
            }
            
            // Scroll to writing area
            setTimeout(() => {
                this.editor.scrollIntoView({ behavior: 'smooth' });
                this.editor.focus();
            }, 100);
        }
    },

    deleteEntry(date) {
        const formattedDate = Formatter.formatDateInEnglish(date).short;
        
        if (confirm(`Are you sure you want to delete your entry from ${formattedDate}? This cannot be undone.`)) {
            Storage.deleteEntry(date);
            this.loadEntries(document.getElementById('searchInput')?.value || '');
            this.updateStats();
            Calendar.update();
        }
    },

    collapseEntry(date) {
        const card = document.querySelector(`[data-date="${date}"]`);
        if (card) {
            card.classList.remove('expanded');
        }
    }
};

// Make Journal available globally
window.Journal = Journal;
