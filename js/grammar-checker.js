// ========== GRAMMAR CHECKER MODULE ==========
// Handles grammar and spelling correction using LanguageTool API

const GrammarChecker = {
    apiUrl: 'https://api.languagetool.org/v2/check',
    isChecking: false,
    suggestions: [],

    // ========== INITIALIZATION ==========
    
    init() {
        this.setupElements();
        this.setupEventListeners();
    },

    setupElements() {
        this.editor = document.getElementById('journalEntry');
        this.checkButton = document.getElementById('checkGrammarBtn');
        this.suggestionsPanel = document.getElementById('grammarSuggestions');
    },

    // ========== EVENT LISTENERS ==========
    
    setupEventListeners() {
        if (this.checkButton) {
            this.checkButton.addEventListener('click', () => this.checkGrammar());
        }
        
        // Close panel when clicking outside
        if (this.suggestionsPanel) {
            document.addEventListener('click', (e) => {
                if (this.suggestionsPanel.classList.contains('active')) {
                    const isClickInside = this.suggestionsPanel.contains(e.target) || 
                                        e.target === this.checkButton ||
                                        this.checkButton.contains(e.target);
                    if (!isClickInside) {
                        this.closeSuggestions();
                    }
                }
            });
        }
    },

    // ========== GRAMMAR CHECKING ==========
    
    async checkGrammar() {
        if (!this.editor || this.isChecking) return;
        
        const text = this.editor.textContent.trim();
        
        if (text.length === 0) {
            this.showMessage('Please write something first!', 'info');
            return;
        }

        this.isChecking = true;
        this.updateButtonState(true);
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'text': text,
                    'language': 'en-US',
                    'enabledOnly': 'false'
                })
            });

            if (!response.ok) {
                throw new Error('Grammar check failed');
            }

            const data = await response.json();
            this.suggestions = data.matches;
            this.displaySuggestions();
            
        } catch (error) {
            console.error('Grammar check error:', error);
            this.showMessage('Grammar check unavailable. Please try again later.', 'error');
        } finally {
            this.isChecking = false;
            this.updateButtonState(false);
        }
    },

    // ========== DISPLAY SUGGESTIONS ==========
    
    displaySuggestions() {
        if (!this.suggestionsPanel) return;

        if (this.suggestions.length === 0) {
            this.suggestionsPanel.innerHTML = `
                <div class="grammar-header">
                    <h3>Grammar Check Complete</h3>
                    <button class="close-suggestions" onclick="GrammarChecker.closeSuggestions()">×</button>
                </div>
                <div class="grammar-result success">
                    <div class="result-icon">✓</div>
                    <div class="result-text">
                        <strong>Great work!</strong>
                        <p>No grammar issues found.</p>
                    </div>
                </div>
            `;
            this.suggestionsPanel.classList.add('active');
            return;
        }

        const suggestionHTML = this.suggestions
            .filter(match => match.replacements && match.replacements.length > 0)
            .slice(0, 10) // Show top 10 suggestions
            .map((match, index) => {
                const context = this.getContext(match);
                const replacement = match.replacements[0].value;
                const category = this.getCategoryIcon(match.rule.category.id);
                
                return `
                    <div class="grammar-suggestion" data-index="${index}">
                        <div class="suggestion-header">
                            <span class="suggestion-category">${category}</span>
                            <span class="suggestion-type">${match.rule.category.name}</span>
                        </div>
                        <div class="suggestion-context">
                            "${context.before}<mark class="error-highlight">${context.error}</mark>${context.after}"
                        </div>
                        <div class="suggestion-message">${match.message}</div>
                        <div class="suggestion-actions">
                            <button class="suggestion-btn apply-btn" 
                                    onclick="GrammarChecker.applySuggestion(${index}, '${this.escapeHtml(replacement)}')">
                                Replace with: <strong>"${replacement}"</strong>
                            </button>
                            <button class="suggestion-btn ignore-btn" 
                                    onclick="GrammarChecker.ignoreSuggestion(${index})">
                                Ignore
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

        this.suggestionsPanel.innerHTML = `
            <div class="grammar-header">
                <h3>Grammar Suggestions (${this.suggestions.length})</h3>
                <button class="close-suggestions" onclick="GrammarChecker.closeSuggestions()">×</button>
            </div>
            <div class="suggestions-list">
                ${suggestionHTML}
            </div>
        `;
        
        this.suggestionsPanel.classList.add('active');
    },

    // ========== APPLY SUGGESTIONS ==========
    
    applySuggestion(index, replacement) {
        const match = this.suggestions[index];
        if (!match) return;

        const text = this.editor.textContent;
        const before = text.substring(0, match.offset);
        const after = text.substring(match.offset + match.length);
        const newText = before + replacement + after;

        // Update the editor content
        this.editor.textContent = newText;
        
        // Update word count
        if (window.Journal) {
            window.Journal.updateWordCount();
        }

        // Remove this suggestion from the list
        this.suggestions.splice(index, 1);
        
        // Keep the panel open and refresh the display
        this.displaySuggestions();
        
        // Don't show message to avoid distraction
        // this.showMessage('Correction applied!', 'success');
    },

    ignoreSuggestion(index) {
        this.suggestions.splice(index, 1);
        this.displaySuggestions();
    },

    closeSuggestions() {
        if (this.suggestionsPanel) {
            this.suggestionsPanel.classList.remove('active');
        }
    },

    // ========== HELPER FUNCTIONS ==========
    
    getContext(match) {
        const text = this.editor.textContent;
        const contextLength = 40;
        
        const start = Math.max(0, match.offset - contextLength);
        const end = Math.min(text.length, match.offset + match.length + contextLength);
        
        const before = text.substring(start, match.offset);
        const error = text.substring(match.offset, match.offset + match.length);
        const after = text.substring(match.offset + match.length, end);
        
        return {
            before: start > 0 ? '...' + before : before,
            error,
            after: end < text.length ? after + '...' : after
        };
    },

    getCategoryIcon(categoryId) {
        const icons = {
            'TYPOS': '✏️',
            'GRAMMAR': '📝',
            'STYLE': '🎨',
            'PUNCTUATION': '❗',
            'CASING': '🔤',
            'CONFUSED_WORDS': '🤔',
            'REDUNDANCY': '♻️',
            'SEMANTICS': '💡'
        };
        return icons[categoryId] || '📌';
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/'/g, "\\'").replace(/"/g, '\\"');
    },

    updateButtonState(isChecking) {
        if (!this.checkButton) return;
        
        if (isChecking) {
            this.checkButton.disabled = true;
            this.checkButton.innerHTML = '<span class="btn-icon">⏳</span> Checking...';
        } else {
            this.checkButton.disabled = false;
            this.checkButton.innerHTML = '<span class="btn-icon">✓</span> Check Grammar';
        }
    },

    showMessage(text, type = 'info') {
        // Reuse the success message element from Journal
        const messageElement = document.getElementById('successMessage');
        const textElement = document.getElementById('successText');
        
        if (messageElement && textElement) {
            textElement.textContent = text;
            messageElement.className = `success-message ${type}`;
            messageElement.style.display = 'block';
            
            setTimeout(() => {
                messageElement.style.display = 'none';
                messageElement.className = 'success-message';
            }, 3000);
        }
    }
};

// Make GrammarChecker available globally
window.GrammarChecker = GrammarChecker;
