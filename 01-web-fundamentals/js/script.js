// Your JavaScript code will go here

console.log('JavaScript is connected!');

// Theme toggle (persisted)
(function initThemeToggle() {
    const storageKey = 'theme-preference';
    const lightTheme = 'light-minimal';

    const root = document.documentElement;
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function applyTheme(mode) {
        if (mode === 'light') {
            root.setAttribute('data-theme', lightTheme);
            btn.textContent = 'Dark mode';
            btn.setAttribute('aria-label', 'Toggle dark mode');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            root.removeAttribute('data-theme');
            btn.textContent = 'Light mode';
            btn.setAttribute('aria-label', 'Toggle light mode');
            btn.setAttribute('aria-pressed', 'false');
        }
    }

    function getStoredPreference() {
        try {
            return localStorage.getItem(storageKey);
        } catch (_) {
            return null;
        }
    }

    function setStoredPreference(value) {
        try {
            localStorage.setItem(storageKey, value);
        } catch (_) {
            // ignore
        }
    }

    const stored = getStoredPreference();
    applyTheme(stored === 'light' ? 'light' : 'dark');

    btn.addEventListener('click', function () {
        const isLight = root.getAttribute('data-theme') === lightTheme;
        const next = isLight ? 'dark' : 'light';
        applyTheme(next);
        setStoredPreference(next);
    });
})();

// ------------------------------
// Task Manager - core behavior
// ------------------------------
(function initTaskManager() {
	const form = document.getElementById('task-form');
	const titleInput = document.getElementById('task-title');
	const detailsInput = document.getElementById('task-details');
	const listEl = document.getElementById('task-list');
	const emptyStateEl = document.getElementById('empty-state');
	const activeCountEl = document.getElementById('active-count');
	const submitBtn = document.getElementById('add-task-btn');
	const filterButtons = Array.from(document.querySelectorAll('.btn-filter'));
	const clearCompletedBtn = document.getElementById('clear-completed');
	const formErrorEl = document.getElementById('form-error');

	/** @type {{ id: string; title: string; details: string; completed: boolean; createdAt: number; }[]} */
	let tasks = [];
	let editingTaskId = null; // when set, form will save changes to this task
	let currentFilter = 'all'; // 'all' | 'active' | 'completed'

	const TASKS_STORAGE_KEY = 'task-manager.tasks.v1';

	function loadTasksFromStorage() {
		try {
			const raw = localStorage.getItem(TASKS_STORAGE_KEY);
			if (!raw) return [];
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) return [];
			return parsed.filter(Boolean).map(t => ({
				id: String(t.id || ''),
				title: String(t.title || ''),
				details: String(t.details || ''),
				completed: Boolean(t.completed),
				createdAt: Number(t.createdAt || Date.now())
			}));
		} catch (_) {
			return [];
		}
	}

	function saveTasksToStorage() {
		try {
			localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
		} catch (_) {
			// ignore quota/availability errors
		}
	}

	function formatTimestamp(epochMs) {
		const d = new Date(epochMs);
		const date = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
		const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		return `${date} • ${time}`;
	}

	function updateEmptyStateAndCount() {
		const activeCount = tasks.filter(t => !t.completed).length;
		if (activeCountEl) activeCountEl.textContent = String(activeCount);
		if (emptyStateEl) emptyStateEl.hidden = tasks.length !== 0;
	}

	function createTaskItemHTML(task) {
		const checkedAttr = task.completed ? ' checked' : '';
		const completedClass = task.completed ? ' task-item-completed' : '';
		return (
			`<li class="task-item${completedClass}" data-id="${task.id}">` +
				`<label class="task-checkbox">` +
					`<input type="checkbox" class="task-complete" aria-label="Mark task complete"${checkedAttr}>` +
				`</label>` +
				`<div class="task-content">` +
					`<div class="task-title">${escapeHTML(task.title)}</div>` +
					`<div class="task-details">${escapeHTML(task.details || '')}</div>` +
					`<div class="task-meta">Added ${escapeHTML(formatTimestamp(task.createdAt))}</div>` +
				`</div>` +
				`<div class="task-actions">` +
					`<button class="btn task-edit" type="button" aria-label="Edit task">Edit</button>` +
					`<button class="btn btn-danger task-delete" type="button" aria-label="Delete task">Delete</button>` +
				`</div>` +
			`</li>`
		);
	}

	function escapeHTML(str) {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function render() {
		if (!listEl) return;
		listEl.innerHTML = tasks.map(createTaskItemHTML).join('');
		updateEmptyStateAndCount();
		applyFilterToList();
	}

	function addTask(title, details) {
		const newTask = {
			id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
			title: title.trim(),
			details: (details || '').trim(),
			completed: false,
			createdAt: Date.now()
		};
		tasks.unshift(newTask);
		saveTasksToStorage();
		render();
	}

	function startEditing(taskId) {
		const task = tasks.find(t => t.id === taskId);
		if (!task) return;
		editingTaskId = taskId;
		if (titleInput) titleInput.value = task.title;
		if (detailsInput) detailsInput.value = task.details || '';
		if (submitBtn) {
			submitBtn.textContent = 'Save Changes';
			submitBtn.setAttribute('aria-label', 'Save changes to task');
		}
		if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
		if (titleInput) titleInput.focus();
	}

	function finishEditing() {
		editingTaskId = null;
		if (submitBtn) {
			submitBtn.textContent = 'Add Task';
			submitBtn.setAttribute('aria-label', 'Add task');
		}
	}

	if (form && titleInput) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			const title = titleInput.value;
			const details = detailsInput ? detailsInput.value : '';
			if (!title || !title.trim()) {
				// Simple validation feedback
				titleInput.focus();
				titleInput.setAttribute('aria-invalid', 'true');
				titleInput.classList.add('input-error');
				if (formErrorEl) {
					formErrorEl.hidden = false;
				}
				return;
			}
			titleInput.removeAttribute('aria-invalid');
			titleInput.classList.remove('input-error');
			if (formErrorEl) {
				formErrorEl.hidden = true;
			}

			if (editingTaskId) {
				// update existing
				tasks = tasks.map(t => t.id === editingTaskId ? { ...t, title: title.trim(), details: (details || '').trim() } : t);
				saveTasksToStorage();
				render();
				finishEditing();
			} else {
				addTask(title, details);
			}
			form.reset();
			titleInput.focus();
		});
	}

	// Event delegation for complete/delete
	if (listEl) {
		listEl.addEventListener('click', function (e) {
			const target = e.target;
			if (!(target instanceof HTMLElement)) return;
			const itemEl = target.closest('.task-item');
			if (!itemEl) return;
			const taskId = itemEl.getAttribute('data-id');
			if (!taskId) return;

			if (target.classList.contains('task-delete')) {
				// animate out then remove
				itemEl.classList.add('deleting');
				setTimeout(() => {
					tasks = tasks.filter(t => t.id !== taskId);
					saveTasksToStorage();
					render();
				}, 180);
			}

			if (target.classList.contains('task-edit')) {
				startEditing(taskId);
			}
		});

		listEl.addEventListener('change', function (e) {
			const target = e.target;
			if (!(target instanceof HTMLInputElement)) return;
			if (!target.classList.contains('task-complete')) return;
			const itemEl = target.closest('.task-item');
			if (!itemEl) return;
			const taskId = itemEl.getAttribute('data-id');
			if (!taskId) return;
			tasks = tasks.map(t => t.id === taskId ? { ...t, completed: target.checked } : t);
			saveTasksToStorage();
			render();
		});
	}

	// Clear completed
	if (clearCompletedBtn) {
		clearCompletedBtn.addEventListener('click', function () {
			const hadCompleted = tasks.some(t => t.completed);
			if (!hadCompleted) return;
			tasks = tasks.filter(t => !t.completed);
			saveTasksToStorage();
			render();
		});
	}

	// Filtering
	function setFilter(filter) {
		currentFilter = filter;
		// update button styles and aria
		filterButtons.forEach(btn => {
			const isActive = btn.getAttribute('data-filter') === filter;
			btn.classList.toggle('is-active', isActive);
			btn.setAttribute('aria-selected', String(isActive));
		});
		applyFilterToList();
	}

	function applyFilterToList() {
		if (!listEl) return;
		const items = Array.from(listEl.querySelectorAll('.task-item'));
		items.forEach(item => {
			const id = item.getAttribute('data-id');
			const task = tasks.find(t => t.id === id);
			if (!task) return;
			let show = true;
			if (currentFilter === 'active') show = !task.completed;
			if (currentFilter === 'completed') show = task.completed;
			item.hidden = !show;
		});
	}

	// Filter button events
	filterButtons.forEach(btn => {
		btn.addEventListener('click', function () {
			const f = btn.getAttribute('data-filter') || 'all';
			setFilter(f);
		});
	});

	// initialize filter UI
	setFilter(currentFilter);

	// Initial load and render
	tasks = loadTasksFromStorage();
	render();

	// Minimal CSS hooks for task items (added via JS to avoid editing HTML structure)
	injectTaskItemStyles();

	function injectTaskItemStyles() {
		const style = document.createElement('style');
		style.textContent = `
			.task-list { counter-reset: task-index; }
			.task-item { display: grid; grid-template-columns: 28px 1fr auto; gap: 12px; align-items: flex-start; padding: 14px; border-radius: var(--radius-sm); background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(148,163,184,0.12); }
			.task-item + .task-item { }
			.task-checkbox { padding-top: 4px; }
			.task-content { display: grid; gap: 6px; }
			.task-title { font-weight: 600; color: var(--text); }
			.task-details { color: var(--text-dim); font-size: 14px; line-height: 1.5; }
			.task-meta { color: var(--muted); font-size: 12px; }
			.task-actions { display: flex; align-items: center; gap: 8px; }
			.task-item-completed .task-title { text-decoration: line-through; opacity: 0.8; }
			.task-item-completed .task-details { opacity: 0.8; }
			.btn-danger { border-color: rgba(239,68,68,0.35); background: linear-gradient(180deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08)); }
			.btn-danger:hover { background: linear-gradient(180deg, rgba(239,68,68,0.22), rgba(239,68,68,0.12)); }
			.task-complete { width: 18px; height: 18px; cursor: pointer; }
			@media (max-width: 640px) {
				.task-item { grid-template-columns: 24px 1fr auto; padding: 12px; }
				.task-details { font-size: 15px; }
			}
		`;
		document.head.appendChild(style);
	}
})();
