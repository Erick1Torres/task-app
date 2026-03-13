/**
 * TaskFlow Pro - Gestor de tareas personales
 * @file app.js
 */

// ============ CONSTANTES ============
const STORAGE_KEY_TASKS = 'misTareas';
const STORAGE_KEY_THEME = 'theme';
const TASK_TITLE_MAX_LENGTH = 200;
const TASK_TITLE_MIN_LENGTH = 1;

/** Clases CSS por prioridad de tarea */
const PRIORITY_CLASSES = {
    alta: "border-l-red-500 bg-red-50/30 dark:bg-red-900/10 text-red-700 dark:text-red-400",
    media: "border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400",
    baja: "border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400"
};

/** Peso para ordenar tareas por prioridad (menor = más alta) */
const PRIORITY_WEIGHT = { alta: 1, media: 2, baja: 3 };

/** Clases para botón de filtro activo */
const FILTER_BTN_ACTIVE = "filter-btn flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

/** Clases para botón de filtro inactivo */
const FILTER_BTN_INACTIVE = "filter-btn flex items-center gap-3 cursor-pointer p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

// ============ ESTADO ============
let tasks = loadTasksFromStorage();

// ============ ALMACENAMIENTO ============

/**
 * Carga las tareas desde localStorage con manejo de errores.
 * @returns {Array<{id: number, title: string, category: string, priority: string, completed: boolean}>} Lista de tareas
 */
function loadTasksFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_TASKS);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Error al cargar tareas desde localStorage:', error);
        return [];
    }
}

/**
 * Guarda las tareas en localStorage.
 * @returns {boolean} true si se guardó correctamente
 */
function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.warn('Error al guardar tareas en localStorage:', error);
        return false;
    }
}

// ============ UTILIDADES ============

/**
 * Escapa HTML para prevenir ataques XSS.
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado de forma segura
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Obtiene el filtro de categoría actualmente activo.
 * @returns {string} 'all' | 'trabajo' | 'casa' | 'estudios'
 */
function getActiveCategoryFilter() {
    const activeFilterElement = document.querySelector('.barra-lateral li[aria-pressed="true"]');
    return activeFilterElement?.dataset.filter ?? 'all';
}

/**
 * Filtra y ordena las tareas según el criterio actual.
 * @param {string} categoryFilter - Filtro de categoría
 * @param {string} searchQuery - Texto de búsqueda (minúsculas)
 * @returns {Array} Tareas filtradas y ordenadas
 */
function getFilteredAndSortedTasks(categoryFilter, searchQuery) {
    return tasks
        .filter(task => {
            const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
            const matchesSearch = task.title.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        })
        .sort((taskA, taskB) =>
            (PRIORITY_WEIGHT[taskA.priority] ?? 2) - (PRIORITY_WEIGHT[taskB.priority] ?? 2)
        );
}

/**
 * Comprueba si ya existe una tarea con el mismo título (case-insensitive).
 * @param {string} title - Título a comprobar
 * @returns {boolean}
 */
function isDuplicateTask(title) {
    const normalizedTitle = title.toLowerCase().trim();
    return tasks.some(task => task.title.toLowerCase() === normalizedTitle);
}

// ============ VALIDACIÓN DE FORMULARIO ============

/**
 * Valida el título de una nueva tarea.
 * @param {string} title - Título a validar
 * @returns {{valid: boolean, message?: string}} Resultado de la validación
 */
function validateTaskTitle(title) {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < TASK_TITLE_MIN_LENGTH) {
        return { valid: false, message: 'El título no puede estar vacío.' };
    }
    if (trimmedTitle.length > TASK_TITLE_MAX_LENGTH) {
        return { valid: false, message: `Máximo ${TASK_TITLE_MAX_LENGTH} caracteres.` };
    }
    if (isDuplicateTask(trimmedTitle)) {
        return { valid: false, message: 'Ya existe una tarea con ese título.' };
    }

    return { valid: true };
}

// ============ RENDERIZADO ============

/**
 * Persiste las tareas y vuelve a renderizar la lista.
 */
function persistAndRender() {
    saveTasksToStorage();
    renderTaskList();
}

/**
 * Renderiza la lista de tareas según filtros y búsqueda actuales.
 */
function renderTaskList() {
    const categoryFilter = getActiveCategoryFilter();
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const taskListElement = document.getElementById('task-list');
    const emptyStateElement = document.getElementById('empty-state');

    const filteredTasks = getFilteredAndSortedTasks(categoryFilter, searchQuery);

    taskListElement.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyStateElement.classList.remove('hidden');
        emptyStateElement.textContent = tasks.length === 0
            ? 'No hay tareas. ¡Añade una para empezar!'
            : 'No hay tareas que coincidan con tu búsqueda o filtro.';
    } else {
        emptyStateElement.classList.add('hidden');
        const fragment = document.createDocumentFragment();
        filteredTasks.forEach(task => fragment.appendChild(buildTaskElement(task)));
        taskListElement.appendChild(fragment);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Crea el elemento DOM de una tarea.
 * @param {Object} task - Objeto tarea con id, title, category, priority, completed
 * @returns {HTMLElement} Elemento article con la tarea
 */
function buildTaskElement(task) {
    const priorityClassName = PRIORITY_CLASSES[task.priority] ?? "border-l-slate-300 bg-slate-50 dark:bg-slate-800/50";
    const completedClass = task.completed ? 'opacity-40 grayscale-[0.5]' : '';
    const titleClass = task.completed ? 'line-through opacity-50' : 'text-slate-800 dark:text-white';

    const article = document.createElement('article');
    article.className = `flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-700 border-l-4 shadow-sm transition-all group ${priorityClassName} ${completedClass}`;
    article.dataset.taskId = task.id;

    const safeTitle = escapeHtml(task.title);
    const safeCategory = escapeHtml(task.category);
    const safePriority = escapeHtml(task.priority);
    const ariaLabelCheckbox = `Marcar tarea como ${task.completed ? 'pendiente' : 'completada'}: ${safeTitle}`;
    const ariaLabelDelete = `Eliminar tarea: ${safeTitle}`;

    article.innerHTML = `
        <div class="flex items-center gap-4">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   class="w-5 h-5 rounded cursor-pointer accent-indigo-600 border-slate-300" 
                   aria-label="${ariaLabelCheckbox}">
            <div>
                <p class="font-bold ${titleClass}">${safeTitle}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-black uppercase tracking-widest opacity-60">${safeCategory}</span>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/50 dark:bg-black/20 border border-current/10">${safePriority}</span>
                </div>
            </div>
        </div>
        <button type="button" class="delete-btn opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all" aria-label="${ariaLabelDelete}">
            <i data-lucide="trash-2" class="w-5 h-5" aria-hidden="true"></i>
        </button>
    `;

    article.querySelector('input[type="checkbox"]').onchange = (event) => {
        task.completed = event.target.checked;
        persistAndRender();
    };

    article.querySelector('.delete-btn').onclick = () => {
        article.animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9 }], { duration: 200 }).onfinish = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            persistAndRender();
        };
    };

    return article;
}

// ============ MANEJADORES DE EVENTOS ============

/**
 * Muestra un mensaje de error en el formulario.
 * @param {HTMLInputElement} inputElement - Campo de entrada
 * @param {string} message - Mensaje a mostrar
 */
function showFormError(inputElement, message) {
    inputElement.setAttribute('aria-invalid', 'true');
    inputElement.setCustomValidity(message);
    const errorSpan = document.getElementById('task-input-error');
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.remove('sr-only');
    }
    inputElement.reportValidity();
}

/**
 * Limpia el estado de error del formulario.
 * @param {HTMLInputElement} inputElement - Campo de entrada
 */
function clearFormError(inputElement) {
    inputElement.setAttribute('aria-invalid', 'false');
    inputElement.setCustomValidity('');
    const errorSpan = document.getElementById('task-input-error');
    if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.add('sr-only');
    }
}

/**
 * Maneja el envío del formulario de nueva tarea.
 */
function handleTaskFormSubmit(event) {
    event.preventDefault();
    const titleInput = document.getElementById('task-input');
    const title = titleInput.value.trim();

    const validation = validateTaskTitle(title);
    if (!validation.valid) {
        showFormError(titleInput, validation.message);
        titleInput.focus();
        return;
    }

    clearFormError(titleInput);

    tasks.push({
        id: Date.now(),
        title: title,
        category: document.getElementById('task-category-select').value,
        priority: document.getElementById('task-priority-select').value,
        completed: false
    });

    titleInput.value = '';
    titleInput.setCustomValidity('');
    persistAndRender();
}

/**
 * Aplica un filtro de categoría y actualiza la UI.
 * @param {HTMLElement} clickedButton - Botón de filtro clicado
 */
function applyCategoryFilter(clickedButton) {
    document.querySelectorAll('.barra-lateral li[data-filter]').forEach(button => {
        button.className = FILTER_BTN_INACTIVE;
        button.setAttribute('aria-pressed', 'false');
    });
    clickedButton.className = FILTER_BTN_ACTIVE;
    clickedButton.setAttribute('aria-pressed', 'true');
    renderTaskList();
}

/**
 * Alterna entre modo claro y oscuro.
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
    const iconElement = document.getElementById('theme-icon');
    iconElement.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Inicializa la aplicación al cargar el DOM.
 */
function initApp() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderTaskList();
}

// ============ ENLACE DE EVENTOS ============

document.getElementById('task-form').onsubmit = handleTaskFormSubmit;

document.getElementById('task-input').oninput = () => clearFormError(document.getElementById('task-input'));

document.querySelectorAll('.barra-lateral li[data-filter]').forEach(filterButton => {
    const handleFilterClick = () => applyCategoryFilter(filterButton);
    filterButton.onclick = handleFilterClick;
    filterButton.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleFilterClick();
        }
    };
});

document.getElementById('search-input').oninput = renderTaskList;

document.getElementById('theme-toggle').onclick = toggleTheme;

document.addEventListener('DOMContentLoaded', initApp);
