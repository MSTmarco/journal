// ========== PROJECTS MODULE ==========
// Single Responsibility: Handle projects/thinking tool operations

const Projects = {
    currentFilter: 'active',
    currentProjectId: null,

    // ========== INITIALIZATION ==========

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.loadProjects();
    },

    // ========== EVENT LISTENERS ==========

    setupEventListeners() {
        // New project button
        const newProjectBtn = document.getElementById('newProjectBtn');
        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => this.createNewProject());
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.loadProjects();
            });
        });

        // Project detail modal
        const closeDetailBtn = document.getElementById('closeProjectDetailModal');
        if (closeDetailBtn) {
            closeDetailBtn.addEventListener('click', () => this.closeProjectDetail());
        }

        const markSolvedBtn = document.getElementById('markSolvedBtn');
        if (markSolvedBtn) {
            markSolvedBtn.addEventListener('click', () => this.toggleProjectStatus());
        }

        const deleteProjectBtn = document.getElementById('deleteProjectBtn');
        if (deleteProjectBtn) {
            deleteProjectBtn.addEventListener('click', () => this.deleteProject());
        }

        // Title editing
        const projectTitle = document.getElementById('projectDetailTitle');
        if (projectTitle) {
            projectTitle.addEventListener('blur', () => {
                if (this.currentProjectId) {
                    this.updateProjectTitle(this.currentProjectId, projectTitle.textContent);
                }
            });
        }
    },

    // ========== PROJECT MANAGEMENT ==========

    createNewProject() {
        const projectId = 'project_' + Date.now();
        
        const newProject = {
            title: 'Untitled Project',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            goal: '',
            situation: '',
            ideas: [],
            actions: [],
            progress: [],
            notes: ''
        };

        Storage.saveProject(projectId, newProject);
        
        // Open the new project
        this.openProjectDetail(projectId);
        
        // Focus on title
        setTimeout(() => {
            const titleElement = document.getElementById('projectDetailTitle');
            if (titleElement) {
                titleElement.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(titleElement);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }, 100);

        this.updateStats();
    },

    loadProjects() {
        const projects = Storage.getProjects();
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;
        
        const projectIds = Object.keys(projects).sort((a, b) => {
            return new Date(projects[b].createdAt) - new Date(projects[a].createdAt);
        });

        // Filter projects
        const filteredIds = projectIds.filter(id => {
            const project = projects[id];
            if (this.currentFilter === 'all') return true;
            if (this.currentFilter === 'active') return project.status === 'active';
            if (this.currentFilter === 'solved') return project.status === 'solved';
            return true;
        });

        if (filteredIds.length === 0) {
            projectsList.innerHTML = `
                <div class="no-entries">
                    <div class="no-entries-icon">💡</div>
                    <h3>No projects yet</h3>
                    <p>Click "New Project" to start tracking your ideas and problems!</p>
                </div>
            `;
            return;
        }

        projectsList.innerHTML = filteredIds.map(id => {
            const project = projects[id];
            
            const ideasCount = project.ideas ? project.ideas.length : 0;
            const actionsCount = project.actions ? project.actions.length : 0;
            const progressCount = project.progress ? project.progress.length : 0;
            
            const lastUpdated = project.updatedAt 
                ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return `
                <div class="project-card ${project.status}" data-project-id="${id}">
                    <div class="project-header">
                        <div class="project-title">${project.title}</div>
                        <div class="project-status ${project.status}">${project.status}</div>
                    </div>
                    ${project.goal ? `<div class="project-goal">🎯 ${project.goal}</div>` : ''}
                    <div class="project-stats">
                        <span class="stat-badge">💡 ${ideasCount} ideas</span>
                        <span class="stat-badge">✅ ${actionsCount} actions</span>
                        <span class="stat-badge">📊 ${progressCount} updates</span>
                    </div>
                    <div class="project-meta">Last updated: ${lastUpdated}</div>
                </div>
            `;
        }).join('');

        // Add click handlers
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                this.openProjectDetail(card.dataset.projectId);
            });
        });
    },

    openProjectDetail(projectId) {
        this.currentProjectId = projectId;
        const project = Storage.getProject(projectId);
        if (!project) return;

        const titleElement = document.getElementById('projectDetailTitle');
        if (titleElement) {
            titleElement.textContent = project.title;
        }

        const modal = document.getElementById('projectDetailModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Update button text
        const solvedBtn = document.getElementById('markSolvedBtn');
        if (solvedBtn) {
            solvedBtn.textContent = project.status === 'solved' ? '↩ Reopen' : '✓ Mark as Solved';
        }

        this.loadProjectCanvas(projectId);
    },

    closeProjectDetail() {
        const modal = document.getElementById('projectDetailModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        this.currentProjectId = null;
        this.loadProjects();
        this.updateStats();
    },

    updateProjectTitle(projectId, newTitle) {
        const project = Storage.getProject(projectId);
        if (!project) return;
        
        const trimmedTitle = newTitle.trim();
        if (trimmedTitle && trimmedTitle !== project.title) {
            project.title = trimmedTitle;
            project.updatedAt = new Date().toISOString();
            Storage.saveProject(projectId, project);
        } else if (!trimmedTitle) {
            // Restore original
            document.getElementById('projectDetailTitle').textContent = project.title;
        }
    },

    toggleProjectStatus() {
        if (!this.currentProjectId) return;

        const project = Storage.getProject(this.currentProjectId);
        if (!project) return;

        project.status = project.status === 'active' ? 'solved' : 'active';
        project.updatedAt = new Date().toISOString();
        Storage.saveProject(this.currentProjectId, project);
        
        // Update button
        const solvedBtn = document.getElementById('markSolvedBtn');
        if (solvedBtn) {
            solvedBtn.textContent = project.status === 'solved' ? '↩ Reopen' : '✓ Mark as Solved';
        }
        
        this.loadProjectCanvas(this.currentProjectId);
    },

    deleteProject() {
        if (!this.currentProjectId) return;

        const project = Storage.getProject(this.currentProjectId);
        if (!project) return;

        if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

        Storage.deleteProject(this.currentProjectId);
        this.closeProjectDetail();
        this.loadProjects();
        this.updateStats();
    },

    // ========== PROJECT CANVAS ==========

    loadProjectCanvas(projectId) {
        const project = Storage.getProject(projectId);
        if (!project) return;
        
        const canvas = document.getElementById('projectCanvas');
        if (!canvas) return;

        let html = '';

        // Goal Section
        html += this.createSection('goal', '🎯 Goal / Objective', 
            'Click to write your goal... What are you trying to achieve?', 
            project.goal || '', projectId);

        // Situation Section
        html += this.createSection('situation', '🤔 Current Situation', 
            'Click to describe the current state... What\'s the problem or challenge?', 
            project.situation || '', projectId);

        // Ideas Section
        html += this.createListSection('ideas', '💡 Ideas & Options', 
            project.ideas || [], projectId, 'Add idea or option');

        // Actions Section
        html += this.createListSection('actions', '✅ Actions & Next Steps', 
            project.actions || [], projectId, 'Add action or next step');

        // Progress Section
        html += this.createListSection('progress', '📊 Progress & Updates', 
            project.progress || [], projectId, 'Log progress or update');

        // Notes Section
        html += this.createNotesSection(project.notes || '', projectId);

        canvas.innerHTML = html;
        this.updateProjectWordCount(projectId);
    },

    createSection(id, title, placeholder, content, projectId) {
        return `
            <div class="canvas-section">
                <div class="canvas-section-header">
                    <div class="canvas-section-title">${title}</div>
                </div>
                <div class="canvas-toolbar" id="${id}Toolbar">
                    ${this.createToolbarButtons(id)}
                </div>
                <div class="canvas-section-content" 
                     contenteditable="true" 
                     id="${id}Content"
                     data-placeholder="${placeholder}"
                     onfocus="Projects.showToolbar('${id}')"
                     onblur="Projects.saveField('${projectId}', '${id}', this.innerHTML)">${content}</div>
            </div>
        `;
    },

    createToolbarButtons(section) {
        return `
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'h1')">Title</button>
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'h2')">Subtitle</button>
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'h3')">Heading</button>
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'p')">Normal</button>
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'bold')">B</button>
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'italic')">/</button>
            <button class="canvas-toolbar-btn" onclick="Projects.applyFormat('${section}', 'blockquote')">Quote</button>
        `;
    },

    createListSection(type, title, items, projectId, addText) {
        const itemsHtml = items.slice().reverse().map((item, index) => {
            const realIndex = items.length - 1 - index;
            const extraClass = type === 'action' && item.done ? 'done' : '';
            const toggleBtn = type === 'actions' 
                ? `<button class="canvas-item-btn toggle-action-btn" onclick="Projects.toggleAction('${projectId}', ${realIndex})">${item.done ? '↩ Undo' : '✓ Done'}</button>`
                : '';
            
            return `
                <div class="canvas-item ${type} ${extraClass}">
                    <div class="canvas-item-content" 
                         contenteditable="true"
                         onblur="Projects.updateItem('${projectId}', '${type}', ${realIndex}, this.textContent)">${item.content}</div>
                    <div class="canvas-item-meta">
                        <span>${Formatter.formatDateInEnglish(item.timestamp.split('T')[0]).short}</span>
                        <div class="canvas-item-actions">
                            ${toggleBtn}
                            <button class="canvas-item-btn delete-item-btn" onclick="Projects.deleteItem('${projectId}', '${type}', ${realIndex})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="canvas-section">
                <div class="canvas-section-header">
                    <div class="canvas-section-title">${title}</div>
                </div>
                <div class="canvas-list-section">
                    ${itemsHtml}
                    <div class="add-item-btn" onclick="Projects.addItem('${projectId}', '${type}')">
                        + ${addText}
                    </div>
                </div>
            </div>
        `;
    },

    createNotesSection(notes, projectId) {
        return `
            <div class="canvas-section">
                <div class="canvas-section-header">
                    <div class="canvas-section-title">📝 Notes & Thoughts</div>
                </div>
                <div class="canvas-toolbar" id="notesToolbar">
                    ${this.createToolbarButtons('notes')}
                </div>
                <div class="canvas-section-content project-freeform-notes" 
                     contenteditable="true" 
                     id="notesContent"
                     spellcheck="true"
                     data-placeholder="Write freely here... reflections, random thoughts, brainstorming, anything..."
                     onfocus="Projects.showToolbar('notes')"
                     onblur="Projects.saveField('${projectId}', 'notes', this.innerHTML)"
                     oninput="Projects.updateProjectWordCount('${projectId}')"
                     style="min-height: 200px;">${notes}</div>
                <div class="project-notes-word-count" id="projectWordCount-${projectId}">0 words</div>
            </div>
        `;
    },

    // ========== TOOLBAR & FORMATTING ==========

    showToolbar(section) {
        const toolbar = document.getElementById(section + 'Toolbar');
        if (toolbar) {
            toolbar.classList.add('active');
        }
    },

    applyFormat(section, format) {
        const content = document.getElementById(section + 'Content');
        if (content) {
            Formatter.applyFormat(format, content);
        }
    },

    // ========== FIELD SAVING ==========

    saveField(projectId, field, content) {
        const project = Storage.getProject(projectId);
        if (!project) return;
        
        if (field === 'notes') {
            project[field] = content;
        } else {
            project[field] = content.trim();
        }
        
        project.updatedAt = new Date().toISOString();
        Storage.saveProject(projectId, project);
    },

    // ========== LIST ITEM MANAGEMENT ==========

    addItem(projectId, type) {
        const project = Storage.getProject(projectId);
        if (!project) return;
        
        if (!project[type]) project[type] = [];
        
        const newItem = {
            content: '',
            timestamp: new Date().toISOString()
        };
        
        if (type === 'actions') {
            newItem.done = false;
        }
        
        project[type].push(newItem);
        project.updatedAt = new Date().toISOString();
        
        Storage.saveProject(projectId, project);
        this.loadProjectCanvas(projectId);
        
        // Focus the new item
        setTimeout(() => {
            const items = document.querySelectorAll('.canvas-item-content');
            if (items.length > 0) {
                items[0].focus();
            }
        }, 100);
    },

    updateItem(projectId, type, index, content) {
        const project = Storage.getProject(projectId);
        if (!project || !project[type] || !project[type][index]) return;
        
        project[type][index].content = content.trim();
        project.updatedAt = new Date().toISOString();
        Storage.saveProject(projectId, project);
    },

    deleteItem(projectId, type, index) {
        if (!confirm('Delete this item?')) return;
        
        const project = Storage.getProject(projectId);
        if (!project) return;
        
        project[type].splice(index, 1);
        project.updatedAt = new Date().toISOString();
        
        Storage.saveProject(projectId, project);
        this.loadProjectCanvas(projectId);
    },

    toggleAction(projectId, actionIndex) {
        const project = Storage.getProject(projectId);
        if (!project || !project.actions || !project.actions[actionIndex]) return;
        
        project.actions[actionIndex].done = !project.actions[actionIndex].done;
        project.updatedAt = new Date().toISOString();
        
        Storage.saveProject(projectId, project);
        this.loadProjectCanvas(projectId);
    },

    // ========== WORD COUNT ==========

    updateProjectWordCount(projectId) {
        const notesElement = document.querySelector('.project-freeform-notes');
        const countElement = document.getElementById(`projectWordCount-${projectId}`);
        
        if (notesElement && countElement) {
            Formatter.updateWordCount(notesElement, countElement);
        }
    },

    // ========== STATS ==========

    updateStats() {
        const stats = Storage.getProjectStats();
        
        const activeElement = document.getElementById('activeProjectsCount');
        const solvedElement = document.getElementById('solvedProjectsCount');
        const ideasElement = document.getElementById('totalIdeasCount');
        
        if (activeElement) activeElement.textContent = stats.activeCount;
        if (solvedElement) solvedElement.textContent = stats.solvedCount;
        if (ideasElement) ideasElement.textContent = stats.totalIdeas;
    }
};

// Make Projects available globally
window.Projects = Projects;
