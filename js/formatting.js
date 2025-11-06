// ========== FORMATTING MODULE ==========
// Single Responsibility: Handle all text formatting operations

const Formatter = {
    // ========== DATE FORMATTING ==========
    
    formatDateInEnglish(dateString) {
        const date = new Date(dateString);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        return {
            full: `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
            short: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
            display: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        };
    },

    getTodayString() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    },

    // ========== RICH TEXT FORMATTING ==========
    
    applyFormat(format, element) {
        if (!element) return;
        
        element.focus();
        
        switch(format) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'p':
                document.execCommand('formatBlock', false, `<${format}>`);
                break;
            case 'bold':
                document.execCommand('bold', false, null);
                break;
            case 'italic':
                document.execCommand('italic', false, null);
                break;
            case 'quote':
                document.execCommand('formatBlock', false, '<blockquote>');
                break;
        }
    },

    // ========== WORD COUNTING ==========
    
    countWords(text) {
        if (!text || !text.trim()) return 0;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    },

    updateWordCount(element, countElement) {
        if (!element || !countElement) return;
        
        const text = element.textContent || element.innerText || '';
        const words = this.countWords(text);
        countElement.textContent = `${words} word${words !== 1 ? 's' : ''}`;
        return words;
    },

    // ========== CURSOR MANAGEMENT ==========
    
    saveCursorPosition(element) {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;
        
        const range = selection.getRangeAt(0);
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null
        );
        
        let currentPos = 0;
        let cursorNode = range.startContainer;
        let cursorOffset = range.startOffset;
        
        while (walker.nextNode()) {
            if (walker.currentNode === cursorNode) {
                return currentPos + cursorOffset;
            }
            currentPos += walker.currentNode.textContent.length;
        }
        
        return currentPos;
    },

    restoreCursorPosition(element, position) {
        if (position === null || position === undefined) return;
        
        const selection = window.getSelection();
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null
        );
        
        let currentPos = 0;
        
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const nodeLength = node.textContent.length;
            
            if (currentPos + nodeLength >= position) {
                const offset = position - currentPos;
                const range = document.createRange();
                range.setStart(node, Math.min(offset, nodeLength));
                range.collapse(true);
                
                selection.removeAllRanges();
                selection.addRange(range);
                break;
            }
            
            currentPos += nodeLength;
        }
    },

    // ========== TEXT SANITIZATION ==========
    
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    },

    sanitizeHtml(html) {
        // Remove potentially dangerous tags/attributes
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        
        // Remove script tags
        const scripts = tmp.getElementsByTagName('script');
        while (scripts.length > 0) {
            scripts[0].parentNode.removeChild(scripts[0]);
        }
        
        return tmp.innerHTML;
    }
};

// Make Formatter available globally
window.Formatter = Formatter;
