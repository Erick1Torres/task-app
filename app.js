/**
 * @deprecated Este archivo ha sido reemplazado por la estructura modular en js/
 * La aplicación ahora usa js/main.js como punto de entrada.
 * Este archivo se mantiene solo como referencia del código anterior.
 */

// Constantes (legacy - ver js/config.js)
const STORAGE_KEY_TASKS = 'misTareas';
const STORAGE_KEY_THEME = 'theme';

// Diccionario de clases Tailwind para los colores de prioridad
const PRIORITY_CLASSES = {
    alta: "border-l-red-500 bg-red-50/30 dark:bg-red-900/10 text-red-700 dark:text-red-400",
    media: "border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400",
    baja: "border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400"
};

const PRIORITY_WEIGHT = { alta: 1, media: 2, baja: 3 };

const FILTER_BTN_ACTIVE = "filter-btn flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800";
const FILTER_BTN_INACTIVE = "filter-btn flex items-center gap-3 cursor-pointer p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

// Carga inicial de tareas con manejo de errores
let tasks = [];
try {
    const stored = localStorage.getItem(STORAGE_KEY_TASKS);
    tasks = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(tasks)) tasks = [];
} catch (e) {
    console.warn('Error al cargar tareas desde localStorage:', e);
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveAndRender() {
    try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
        console.warn('Error al guardar tareas en localStorage:', e);
    }
    renderTasks();
}

function renderTasks() {
    const activeFilterEl = document.querySelector('.barra-lateral li[aria-pressed="true"]');
    const activeFilter = activeFilterEl ? activeFilterEl.dataset.filter : 'all';
    const searchText = document.getElementById('search-input').value.toLowerCase().trim();
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');

    taskList.innerHTML = '';

    const filtered = tasks
        .filter(t => (activeFilter === 'all' || t.category === activeFilter) && t.title.toLowerCase().includes(searchText))
        .sort((a, b) => (PRIORITY_WEIGHT[a.priority] ?? 2) - (PRIORITY_WEIGHT[b.priority] ?? 2));

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
        emptyState.textContent = tasks.length === 0
            ? 'No hay tareas. ¡Añade una para empezar!'
            : 'No hay tareas que coincidan con tu búsqueda o filtro.';
    } else {
        emptyState.classList.add('hidden');
        const fragment = document.createDocumentFragment();
        filtered.forEach(task => {
            fragment.appendChild(createTaskElement(task));
        });
        taskList.appendChild(fragment);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function createTaskElement(task) {
    const pClass = PRIORITY_CLASSES[task.priority] || "border-l-slate-300 bg-slate-50 dark:bg-slate-800/50";
    const div = document.createElement('article');
    div.className = `flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-700 border-l-4 shadow-sm transition-all group ${pClass} ${task.completed ? 'opacity-40 grayscale-[0.5]' : ''}`;
    div.setAttribute('data-task-id', task.id);

    const titleEscaped = escapeHtml(task.title);
    const categoryEscaped = escapeHtml(task.category);
    const priorityEscaped = escapeHtml(task.priority);

    div.innerHTML = `
        <div class="flex items-center gap-4">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   class="w-5 h-5 rounded cursor-pointer accent-indigo-600 border-slate-300" 
                   aria-label="Marcar tarea como ${task.completed ? 'pendiente' : 'completada'}: ${titleEscaped}">
            <div>
                <p class="font-bold ${task.completed ? 'line-through opacity-50' : 'text-slate-800 dark:text-white'}">${titleEscaped}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-black uppercase tracking-widest opacity-60">${categoryEscaped}</span>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/50 dark:bg-black/20 border border-current/10">
                        ${priorityEscaped}
                    </span>
                </div>
            </div>
        </div>
        <button type="button" class="delete-btn opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all" aria-label="Eliminar tarea: ${titleEscaped}">
            <i data-lucide="trash-2" class="w-5 h-5" aria-hidden="true"></i>
        </button>
    `;

    div.querySelector('input').onchange = (e) => {
        task.completed = e.target.checked;
        saveAndRender();
    };

    div.querySelector('.delete-btn').onclick = () => {
        div.animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9 }], { duration: 200 }).onfinish = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        };
    };

    return div;
}

// Formulario
document.getElementById('task-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const title = input.value.trim();

    if (!title) {
        input.focus();
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        category: document.getElementById('task-category-select').value,
        priority: document.getElementById('task-priority-select').value,
        completed: false
    });
    input.value = '';
    saveAndRender();
};

// Filtros
document.querySelectorAll('.barra-lateral li[data-filter]').forEach(btn => {
    const handleFilter = () => {
        document.querySelectorAll('.barra-lateral li[data-filter]').forEach(b => {
            b.className = FILTER_BTN_INACTIVE;
            b.setAttribute('aria-pressed', 'false');
        });
        btn.className = FILTER_BTN_ACTIVE;
        btn.setAttribute('aria-pressed', 'true');
        renderTasks();
    };

    btn.onclick = handleFilter;
    btn.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFilter();
        }
    };
});

// Búsqueda
document.getElementById('search-input').oninput = renderTasks;

// Modo Oscuro
document.getElementById('theme-toggle').onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
    const icon = document.getElementById('theme-icon');
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

// Carga inicial
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderTasks();
});
