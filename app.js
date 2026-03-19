/**
 * TaskFlow App - Versión Senior Final (Totalmente funcional)
 * Mejoras aplicadas y señaladas:
 */
(() => {
    // 1. MEJORA: Encapsulamiento en IIFE para proteger el código.
    const STORAGE_KEYS = {
        TASKS: 'taskflow_tasks',
        COLOR: 'taskflow_color',
        THEME: 'taskflow_theme'
    };

    const PRIORITY_MAP = {
        alta: { class: "border-l-red-500 bg-red-50/40 dark:bg-red-950/20", label: "Alta" },
        media: { class: "border-l-orange-700 bg-orange-70/50 dark:bg-orange-800/20", label: "Media" },
        baja: { class: "border-l-green-500 bg-green-50/40 dark:bg-green-950/20", label: "Baja" }
    };

    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
    let userColor = localStorage.getItem(STORAGE_KEYS.COLOR) || '#4f46e5';
    let currentFilter = 'all';

    // 2. MEJORA: Motor de Color Total (Header + Botón Añadir + Filtros)
    function applyThemeColor(hex) {
        userColor = hex;
        localStorage.setItem(STORAGE_KEYS.COLOR, hex);
        
        const picker = document.getElementById('custom-color-picker');
        const preview = document.getElementById('color-preview');
        if (picker) picker.value = hex;
        if (preview) preview.style.backgroundColor = hex;

        let styleTag = document.getElementById('dynamic-brand-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-brand-styles';
            document.head.appendChild(styleTag);
        }

        // 3. MEJORA: CSS Dinámico optimizado para incluir el botón de añadir y el header
        styleTag.innerHTML = `
            :root { --brand-primary: ${hex}; }
            header, .header-bg { background-color: ${hex} !important; }
            .btn-primary, #task-form button[type="submit"] { background-color: ${hex} !important; }
            .active-filter { background-color: ${hex} !important; }
            .task-check:checked { background-color: ${hex} !important; border-color: ${hex} !important; }
            .task-check { border-color: ${hex}40; }
        `;
    }

    function renderTaskList() {
        const list = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        if (!list) return;

        const filtered = tasks.filter(t => currentFilter === 'all' || t.category === currentFilter);
        
        list.innerHTML = '';
        if (emptyState) emptyState.classList.toggle('hidden', filtered.length > 0);

        const fragment = document.createDocumentFragment();
        const today = new Date().toISOString().split('T')[0];

        filtered.sort((a, b) => b.id - a.id).forEach(task => {
            const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
            const priorityData = PRIORITY_MAP[task.priority] || PRIORITY_MAP.media;

            const taskEl = document.createElement('div');
            taskEl.dataset.id = task.id;
            taskEl.className = `flex items-center justify-between p-5 rounded-[2rem] border-l-4 transition-all shadow-sm ${priorityData.class} ${task.completed ? 'opacity-50' : ''}`;
            
            taskEl.innerHTML = `
                <div class="flex items-center gap-4 pointer-events-none">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-check pointer-events-auto w-5 h-5 cursor-pointer appearance-none border-2 rounded-full">
                    <div>
                        <h3 class="task-title-display font-bold text-slate-800 dark:text-slate-100 ${task.completed ? 'line-through' : ''}"></h3>
                        <p class="text-[10px] text-slate-500 uppercase font-black">
                            ${task.category} • ${priorityData.label} 
                            ${task.dueDate ? `• ${task.dueDate}` : ''}
                        </p>
                    </div>
                </div>
                <button class="delete-btn text-slate-400 hover:text-red-500 p-2 transition-colors">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;

            // Insertamos el título de forma segura
            taskEl.querySelector('.task-title-display').textContent = task.title;
            fragment.appendChild(taskEl);
        });

        list.appendChild(fragment);
        if (window.lucide) lucide.createIcons();
    }

    
    function init() {
        const form = document.getElementById('task-form');
        const input = document.getElementById('task-input');

        // MEJORA: Lógica de ADVERTENCIAS 
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = input.value.trim();

            if (title.length < 3) {
                // Aplicamos las clases de advertencia de tu CSS original
                input.classList.add('border-red-500', 'animate-shake');
                const originalPlaceholder = input.placeholder;
                input.placeholder = "¡Necesitas al menos 3 caracteres!";

                // Quitamos la advertencia después de 2 segundos
                setTimeout(() => {
                    input.classList.remove('border-red-500', 'animate-shake');
                    input.placeholder = originalPlaceholder;
                }, 2000);
                return;
            }

            tasks.push({
                id: Date.now(),
                title,
                category: document.getElementById('task-category-select').value,
                priority: document.getElementById('task-priority-select').value,
                dueDate: document.getElementById('task-date-input').value,
                completed: false
            });

            input.value = '';
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
            renderTaskList();
        });

        
        document.getElementById('task-list')?.addEventListener('click', (e) => {
            const taskEl = e.target.closest('[data-id]');
            if (!taskEl) return;
            const id = Number(taskEl.dataset.id);

            if (e.target.classList.contains('task-check')) {
                const task = tasks.find(t => t.id === id);
                if (task) task.completed = e.target.checked;
                localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
                renderTaskList();
            }

            if (e.target.closest('.delete-btn')) {
                tasks = tasks.filter(t => t.id !== id);
                localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
                renderTaskList();
            }
        });

        document.querySelectorAll('.barra-lateral li').forEach(li => {
            li.addEventListener('click', () => {
                document.querySelectorAll('.barra-lateral li').forEach(l => {
                    l.className = "filter-btn flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all";
                });
                li.className = "filter-btn flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl text-white font-bold shadow-lg active-filter transition-all";
                
                currentFilter = li.dataset.filter;
                renderTaskList();
            });
        });

        document.getElementById('custom-color-picker')?.addEventListener('input', (e) => {
            applyThemeColor(e.target.value);
        });

        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
            document.getElementById('theme-icon')?.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            lucide.createIcons();
        });
    }

    window.addEventListener('load', () => {
        if (localStorage.getItem(STORAGE_KEYS.THEME) === 'dark') {
            document.documentElement.classList.add('dark');
            document.getElementById('theme-icon')?.setAttribute('data-lucide', 'sun');
        }
        applyThemeColor(userColor);
        init();
        renderTaskList();
    });
})();