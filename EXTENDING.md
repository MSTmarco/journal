# 🔧 Extending the App - Developer Guide

## Adding New Features (Step-by-Step)

### Example 1: Add "Mood Tracker" to Journal

**Goal**: Track your mood with each journal entry

#### Step 1: Update Storage (storage.js)
```javascript
// Add to existing entry structure
saveEntry(date, entry) {
    const entries = this.getEntries();
    entries[date] = {
        ...entry,
        mood: entry.mood || null  // Add this line
    };
    this.saveEntries(entries);
}
```

#### Step 2: Update UI (journal.css)
```css
/* Add at the end of journal.css */
.mood-selector {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.mood-btn {
    font-size: 2em;
    padding: 10px 20px;
    border: 2px solid #e0e0e0;
    background: white;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;
}

.mood-btn.active {
    background: #1a1a1a;
    border-color: #1a1a1a;
    transform: scale(1.2);
}
```

#### Step 3: Add HTML (index.html)
```html
<!-- Add after .writing-controls div -->
<div class="mood-selector">
    <button class="mood-btn" data-mood="happy">😊</button>
    <button class="mood-btn" data-mood="neutral">😐</button>
    <button class="mood-btn" data-mood="sad">😢</button>
    <button class="mood-btn" data-mood="excited">🤩</button>
    <button class="mood-btn" data-mood="tired">😴</button>
</div>
```

#### Step 4: Add Logic (journal.js)
```javascript
// In Journal.init()
init() {
    // ... existing code ...
    this.currentMood = null;
    this.setupMoodSelector();
}

// Add new method
setupMoodSelector() {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => 
                b.classList.remove('active'));
            btn.classList.add('active');
            this.currentMood = btn.dataset.mood;
        });
    });
}

// Update saveEntry()
saveEntry() {
    // ... existing code ...
    const entry = {
        html: html,
        text: text,
        wordCount: wordCount,
        photo: this.currentPhoto,
        mood: this.currentMood,  // Add this line
        timestamp: new Date().toISOString()
    };
    // ... rest of the code ...
}
```

**Done!** Mood tracking is now integrated.

---

### Example 2: Add "Priority" to Projects

**Goal**: Mark projects as High/Medium/Low priority

#### Step 1: Update Storage (storage.js)
```javascript
// Projects already support arbitrary fields!
// No changes needed - just add it to project object
```

#### Step 2: Update UI (projects.css)
```css
/* Add at end of projects.css */
.priority-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75em;
    font-weight: 600;
    text-transform: uppercase;
}

.priority-high {
    background: #fee2e2;
    color: #991b1b;
}

.priority-medium {
    background: #fef3c7;
    color: #92400e;
}

.priority-low {
    background: #dbeafe;
    color: #1e40af;
}
```

#### Step 3: Add HTML Section (projects.js)
```javascript
// In createNewProject()
createNewProject() {
    // ... existing code ...
    const newProject = {
        title: 'Untitled Project',
        status: 'active',
        priority: 'medium',  // Add this
        // ... rest of the fields ...
    };
}

// In loadProjectCanvas(), add new section:
html += `
    <div class="canvas-section">
        <div class="canvas-section-header">
            <div class="canvas-section-title">⚡ Priority</div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button class="priority-btn ${project.priority === 'high' ? 'active' : ''}" 
                    onclick="Projects.setPriority('${projectId}', 'high')">
                🔴 High
            </button>
            <button class="priority-btn ${project.priority === 'medium' ? 'active' : ''}" 
                    onclick="Projects.setPriority('${projectId}', 'medium')">
                🟡 Medium
            </button>
            <button class="priority-btn ${project.priority === 'low' ? 'active' : ''}" 
                    onclick="Projects.setPriority('${projectId}', 'low')">
                🟢 Low
            </button>
        </div>
    </div>
`;

// Add new method
setPriority(projectId, priority) {
    const project = Storage.getProject(projectId);
    project.priority = priority;
    project.updatedAt = new Date().toISOString();
    Storage.saveProject(projectId, project);
    this.loadProjectCanvas(projectId);
}
```

**Done!** Priority system added.

---

## Feature Ideas (Ready to Implement)

### Easy (30 minutes each):
- [ ] Dark mode toggle
- [ ] Custom color themes
- [ ] Entry templates
- [ ] Quick notes (no date required)
- [ ] Favorite/star entries
- [ ] Project templates
- [ ] Entry word goals
- [ ] Writing streaks reward system

### Medium (1-2 hours each):
- [ ] Tags for entries and projects
- [ ] Advanced search with filters
- [ ] Statistics dashboard
- [ ] Export to PDF
- [ ] Markdown support
- [ ] Code syntax highlighting
- [ ] Drawing/sketching tool
- [ ] Voice notes

### Advanced (4+ hours each):
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] AI writing suggestions
- [ ] Habit tracking integration
- [ ] Calendar integrations
- [ ] Encryption for sensitive entries

---

## Modular Architecture Guide

### When to Create a New Module

Create a new JS module when:
1. Feature is complex (>200 lines)
2. Feature has its own data structure
3. Feature is reusable across views
4. Feature could be enabled/disabled

Example: `tags.js` for tagging system

```javascript
// js/tags.js
const Tags = {
    getAllTags() {
        // Get unique tags from entries and projects
    },
    
    addTag(itemId, tag) {
        // Add tag to item
    },
    
    filterByTag(tag) {
        // Filter entries/projects
    },
    
    renderTagCloud() {
        // Visualize popular tags
    }
};

window.Tags = Tags;
```

### When to Create a New CSS File

Create a new CSS file when:
1. Styling a new major section (>100 lines)
2. Theming system (dark mode, colors)
3. Print styles
4. Responsive overrides

Example: `tags.css` for tag system

```css
/* css/tags.css */
.tag-cloud { /* ... */ }
.tag-item { /* ... */ }
.tag-filter { /* ... */ }
```

---

## Testing Your Changes

### Manual Testing Checklist:
- [ ] Feature works in Chrome
- [ ] Feature works in Firefox
- [ ] Feature works in Safari
- [ ] Feature works on mobile
- [ ] Data saves correctly
- [ ] Data loads correctly
- [ ] Existing features still work
- [ ] No console errors
- [ ] Styles look good
- [ ] Responsive design intact

### Quick Test Script:
```javascript
// Run in browser console
console.log('Testing Storage...');
const testEntry = { text: 'Test', wordCount: 1 };
Storage.saveEntry('2024-test', testEntry);
console.log(Storage.getEntry('2024-test'));
Storage.deleteEntry('2024-test');
console.log('✅ Storage works!');
```

---

## Common Patterns

### Adding a New Project Canvas Section:
```javascript
// Pattern: Simple text field
html += this.createSection(
    'customField',              // ID
    '🎨 Custom Field',          // Title with emoji
    'Placeholder text...',      // Placeholder
    project.customField || '',  // Current value
    projectId                   // Project ID
);
```

### Adding a New List Type:
```javascript
// Pattern: Items with timestamps
html += this.createListSection(
    'customList',                    // Type
    '📋 Custom List',                // Title
    project.customList || [],        // Items
    projectId,                       // Project ID
    'Add custom item'                // Button text
);
```

### Adding Stats:
```javascript
// In storage.js
getCustomStats() {
    const entries = this.getEntries();
    // Calculate your stat
    return result;
}

// In journal.js or projects.js
updateStats() {
    const customStat = Storage.getCustomStats();
    const element = document.getElementById('customStatElement');
    if (element) element.textContent = customStat;
}
```

---

## Architecture Decisions

### Why This Structure?

**Separation of Concerns**: Each module has ONE job
- Storage = Data
- Formatting = Text utilities
- Calendar = Visualization
- Journal = Daily writing
- Projects = Thinking tool

**Benefits**:
1. Easy to find bugs (which module?)
2. Easy to add features (which module?)
3. Easy to test (one module at a time)
4. Easy to understand (clear boundaries)
5. Easy to maintain (change one, don't break others)

### Why Global Variables (window.*)?

**Reason**: Simple module communication without bundlers

**Alternative** (if using bundler):
```javascript
// Use ES6 modules instead
export const Storage = { /* ... */ };
import { Storage } from './storage.js';
```

### Why No Framework?

**Reason**: 
- Zero dependencies
- Works anywhere
- Easy to understand
- Fast loading
- Full control

**When to add framework**:
- App grows to 10,000+ lines
- Need complex state management
- Building team collaboration features
- Need server-side rendering

---

## Questions?

**Q: Can I use TypeScript?**  
A: Yes! Just compile to JS. Structure stays the same.

**Q: Can I use a CSS framework?**  
A: Yes! Tailwind, Bootstrap, etc. Replace CSS files.

**Q: Can I add a backend?**  
A: Yes! Keep Storage.js, add API calls in it.

**Q: Can I use React?**  
A: Yes! Same structure, just in components.

**Q: How do I deploy?**  
A: GitHub Pages, Netlify, Vercel - all work!

---

**Happy coding! 🚀**

The best tool is the one you keep improving.
