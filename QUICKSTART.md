# ⚡ Quick Start Guide

## 🚀 Get Running in 30 Seconds

1. **Download** all files maintaining the folder structure:
   ```
   journal/
   ├── index.html
   ├── css/ (4 files)
   └── js/ (6 files)
   ```

2. **Open** `index.html` in any modern browser

3. **Start using!** 
   - You'll see **Projects** view by default (your thinking space)
   - Click **"+ New Project"** to create your first project
   - Switch to **Daily Journal** tab for writing

## 💡 Your First Project (30 seconds)

1. Click **"+ New Project"**
2. Give it a name (click the title to edit)
3. Fill in:
   - 🎯 **Goal**: What are you trying to achieve?
   - 🤔 **Situation**: What's the current challenge?
   - 💡 **Ideas**: Click "+ Add idea" for each option you think of
   - ✅ **Actions**: What will you do next?

Done! You're thinking more clearly already.

## ✍️ Your First Journal Entry (30 seconds)

1. Switch to **Daily Journal** tab
2. Read the prompt (or click ↻ for a new one)
3. Just start typing in the big text box
4. Click **"Save Entry"**

Done! Your first entry is saved.

## 🎯 What Makes This Special?

### Projects is Not Just a Task Manager
It's a **thinking tool**. Use it for:
- Problems you're stuck on
- Big decisions
- Creative projects
- Life challenges
- Career moves
- Learning goals

### It's Actually Organized
- **6 JS modules** instead of one 2000-line mess
- **4 CSS files** instead of endless scrolling
- **SOLID principles** so adding features is easy
- **Clean code** your future self will thank you for

## 🔑 Pro Tips

### Keyboard Shortcuts:
- `Ctrl+1` → Projects view
- `Ctrl+2` → Journal view  
- `Ctrl+N` → New project (in Projects view)
- `Ctrl+S` → Save entry (in Journal view)

### Auto-Save:
- Journal drafts save every 30 seconds
- Project changes save when you click away

### Data Export:
```javascript
// In browser console:
App.exportData()  // Downloads JSON file
App.importData()  // Upload JSON file
```

## 📁 GitHub Repository Setup

### Option 1: Simple (One Repo)
```
your-journal/
├── index.html
├── css/
│   ├── main.css
│   ├── projects.css
│   ├── journal.css
│   └── modal.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── formatting.js
│   ├── calendar.js
│   ├── journal.js
│   └── projects.js
├── README.md
└── QUICKSTART.md
```

### Option 2: GitHub Pages (Live Demo)
1. Create repo: `your-username/journal`
2. Upload all files maintaining structure
3. Go to Settings → Pages
4. Enable GitHub Pages from `main` branch
5. Visit: `your-username.github.io/journal`

## 🎨 Customization Quick Wins

### Change Colors:
Edit `css/main.css` line 50-60:
```css
.nav-tab.active {
    background: #1a1a1a;  /* Change this! */
    color: white;
}
```

### Change Default View:
Edit `js/app.js` line 4:
```javascript
currentView: 'projects',  // or 'journal'
```

### Add Custom Project Section:
Edit `js/projects.js` → `loadProjectCanvas()` function, add:
```javascript
html += this.createSection('reflection', '🎭 Reflection', 
    'How do you feel about this?', 
    project.reflection || '', projectId);
```

## ❓ FAQ

**Q: Where is my data stored?**  
A: In your browser's localStorage. Use Export to backup.

**Q: Can I use this on multiple devices?**  
A: Export from one device, import on another. Or add cloud sync (future feature).

**Q: Is it safe?**  
A: 100% local. No data leaves your device.

**Q: Can I style it differently?**  
A: Yes! Edit the CSS files. Everything is organized.

**Q: How do I add features?**  
A: Each module has a single job. Find the right module, add your function. See README.md.

## 🐛 Something Wrong?

1. Check browser console (F12) for errors
2. Make sure all files are in correct folders
3. Try hard refresh (Ctrl+Shift+R)
4. Check localStorage isn't disabled

## 🎉 You're Ready!

The best thinking tool is the one you actually use.

Start with one project. Write one journal entry.

Build the habit. Think better. Write more.

---

**Questions?** Check the full README.md for details.
