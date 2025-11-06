# 📚 Journal & Projects - Your Thinking Tool

A clean, organized web app for daily journaling and project thinking. Built with SOLID principles and modular code.

## ✨ Features

### 💡 Projects (Main Feature)
Your primary thinking space for:
- **Goal Setting**: Define what you're trying to achieve
- **Situation Analysis**: Describe current challenges
- **Ideas & Options**: Brainstorm solutions
- **Actions & Next Steps**: Track what needs to be done
- **Progress Tracking**: Log updates and breakthroughs
- **Free-form Notes**: Write anything that comes to mind

### ✍️ Daily Journal
- Daily writing prompts for inspiration
- Rich text formatting (titles, bold, italic, quotes)
- Photo attachments
- Word count and writing timer
- 60-day calendar visualization
- Searchable entry history

## 🏗️ Project Structure

```
journal/
├── index.html              # Main entry point
├── css/
│   ├── main.css           # Base styles & navigation
│   ├── projects.css       # Projects/thinking tool styles
│   ├── journal.css        # Daily journal styles
│   └── modal.css          # Modal/popup styles
├── js/
│   ├── app.js             # Main orchestrator
│   ├── storage.js         # localStorage management
│   ├── formatting.js      # Text formatting utilities
│   ├── calendar.js        # Calendar visualization
│   ├── journal.js         # Daily journal logic
│   └── projects.js        # Projects/thinking tool logic
└── README.md
```

## 🎯 Design Principles

### SOLID Principles Applied:

1. **Single Responsibility**: Each module has one clear purpose
   - `storage.js`: Only handles data persistence
   - `formatting.js`: Only handles text formatting
   - `calendar.js`: Only handles calendar rendering
   - `journal.js`: Only handles journal operations
   - `projects.js`: Only handles project operations
   - `app.js`: Only orchestrates modules

2. **Open/Closed**: Easy to extend without modifying existing code
   - Add new project sections without changing core logic
   - Add new formatting options without breaking existing features

3. **Dependency Inversion**: Modules depend on abstractions (Storage interface)
   - All modules use `Storage` API instead of directly accessing localStorage
   - Easy to swap localStorage for a different storage solution

### Clean Code:
- **Clear naming**: Functions and variables describe what they do
- **Small functions**: Each function does one thing well
- **No duplication**: Shared logic extracted into utilities
- **Comments only when needed**: Code is self-documenting

## 🚀 Getting Started

### Basic Usage:

1. Open `index.html` in your browser
2. Start with **Projects** view (default)
3. Click "+ New Project" to create your first thinking space
4. Switch to **Journal** tab for daily writing

### Keyboard Shortcuts:

- `Ctrl/Cmd + 1`: Switch to Projects view
- `Ctrl/Cmd + 2`: Switch to Journal view
- `Ctrl/Cmd + N`: Create new project (in Projects view)
- `Ctrl/Cmd + S`: Save journal entry (in Journal view)

## 📊 Data Storage

All data is stored locally in your browser using localStorage:
- **Journal entries**: Organized by date
- **Projects**: With all sections and items
- **Drafts**: Auto-saved every 30 seconds

### Export/Import:

```javascript
// Export all data
App.exportData();

// Import data
App.importData();
```

## 🔧 Development

### Adding a New Feature:

1. Determine which module it belongs to
2. Add the function to that module
3. Update the module's public API if needed
4. Call it from `app.js` or event handlers

### Example - Adding a new project section:

```javascript
// In projects.js
createCustomSection(name, icon) {
    return this.createSection(
        name.toLowerCase(),
        `${icon} ${name}`,
        `Write about ${name.toLowerCase()}...`,
        '',
        this.currentProjectId
    );
}
```

### Module Communication:

Modules communicate through:
- **Storage**: Shared data layer
- **Events**: DOM events for user interactions
- **Public APIs**: Exported functions on window object

```javascript
// Storage API
Storage.getProjects()
Storage.saveProject(id, data)

// Formatter API
Formatter.countWords(text)
Formatter.applyFormat(format, element)

// Calendar API
Calendar.render(container)
Calendar.update()
```

## 🎨 Customization

### Styling:

- Modify `css/main.css` for overall look
- Modify `css/projects.css` for project-specific styles
- Modify `css/journal.css` for journal-specific styles

### Adding Prompts:

Edit the `prompts` array in `js/journal.js`:

```javascript
prompts: [
    "Your custom prompt here",
    "Another inspiring question",
    // ...
]
```

### Changing Default View:

In `js/app.js`, change:

```javascript
currentView: 'projects', // or 'journal'
```

## 📱 Mobile Support

The app is fully responsive:
- Touch-friendly buttons
- Optimized layouts for small screens
- Swipe gestures for navigation (optional, not yet implemented)

## 🔒 Privacy

- **100% local**: All data stays in your browser
- **No tracking**: No analytics or external requests
- **No server**: Works completely offline
- **Your data, your control**: Export anytime

## 🐛 Troubleshooting

### Data not saving?
Check browser localStorage is enabled.

### Calendar not showing entries?
Refresh the page or check console for errors.

### Can't switch views?
Make sure JavaScript is enabled.

### Lost data?
Check browser storage wasn't cleared. Use Export feature regularly!

## 🚧 Future Ideas

- [ ] Cloud sync (optional)
- [ ] PDF export
- [ ] Tagging system
- [ ] Advanced search
- [ ] Templates for projects
- [ ] Collaboration features
- [ ] Mobile app version
- [ ] Dark mode
- [ ] Custom themes

## 📄 License

Free to use, modify, and share. No attribution required.

## 🤝 Contributing

This is a personal tool, but feel free to fork and customize for your needs!

---

**Made with 💡 for better thinking and ✍️ for consistent writing.**
