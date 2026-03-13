/**
 * Lógica de tareas: filtrado, ordenación y renderizado DOM
 * @module task
 */

import { PRIORITY_CLASSES, PRIORITY_WEIGHT, FILTER_BTN_ACTIVE, FILTER_BTN_INACTIVE } from './config.js';
import { escapeHtml } from './utils.js';
import { saveTasks } from './storage.js';

/**
 * Filtra y ordena las tareas según el filtro activo y el texto de búsqueda
 * @param {Array<Object>} taskList - Lista completa de tareas
 * @param {string} activeFilter - Filtro activo ('all', 'trabajo', 'casa', 'estudios')
 * @param {string} searchQuery - Texto de búsqueda en minúsculas
 * @returns {Array<Object>} Tareas filtradas y ordenadas
 */
export function getFilteredAndSortedTasks(taskList, activeFilter, searchQuery) {
    return taskList
        .filter(task => matchesFilter(task, activeFilter) && matchesSearch(task, searchQuery))
        .sort((taskA, taskB) => (PRIORITY_WEIGHT[taskA.priority] ?? 2) - (PRIORITY_WEIGHT[taskB.priority] ?? 2));
}

/**
 * Comprueba si una tarea coincide con el filtro de categoría
 * @param {Object} task - Tarea a evaluar
 * @param {string} activeFilter - Filtro activo
 * @returns {boolean}
 */
function matchesFilter(task, activeFilter) {
    return activeFilter === 'all' || task.category === activeFilter;
}

/**
 * Comprueba si una tarea coincide con la búsqueda
 * @param {Object} task - Tarea a evaluar
 * @param {string} searchQuery - Texto de búsqueda
 * @returns {boolean}
 */
function matchesSearch(task, searchQuery) {
    return task.title.toLowerCase().includes(searchQuery);
}

/**
 * Obtiene el filtro actualmente activo en la UI
 * @returns {string} Nombre del filtro activo
 */
export function getActiveFilter() {
    const activeFilterButton = document.querySelector('.barra-lateral li[aria-pressed="true"]');
    return activeFilterButton?.dataset.filter ?? 'all';
}

/**
 * Obtiene el texto de búsqueda actual
 * @returns {string} Texto en minúsculas y sin espacios extra
 */
export function getSearchQuery() {
    const searchInput = document.getElementById('search-input');
    return (searchInput?.value ?? '').toLowerCase().trim();
}

/**
 * Crea el elemento DOM de una tarea con sus event handlers
 * @param {Object} task - Objeto tarea
 * @param {Function} onTaskChange - Callback al modificar/eliminar (recibe la lista actualizada)
 * @returns {HTMLElement} Elemento article de la tarea
 */
export function createTaskElement(task, onTaskChange) {
    const priorityClass = PRIORITY_CLASSES[task.priority] ?? "border-l-slate-300 bg-slate-50 dark:bg-slate-800/50";
    const completedClass = task.completed ? 'opacity-40 grayscale-[0.5]' : '';
    const titleClass = task.completed ? 'line-through opacity-50' : 'text-slate-800 dark:text-white';

    const titleEscaped = escapeHtml(task.title);
    const categoryEscaped = escapeHtml(task.category);
    const priorityEscaped = escapeHtml(task.priority);

    const article = document.createElement('article');
    article.className = `flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-700 border-l-4 shadow-sm transition-all group ${priorityClass} ${completedClass}`;
    article.setAttribute('data-task-id', task.id);

    article.innerHTML = `
        <div class="flex items-center gap-4">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   class="w-5 h-5 rounded cursor-pointer accent-indigo-600 border-slate-300" 
                   aria-label="Marcar tarea como ${task.completed ? 'pendiente' : 'completada'}: ${titleEscaped}">
            <div>
                <p class="font-bold ${titleClass}">${titleEscaped}</p>
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

    bindTaskEventHandlers(article, task, onTaskChange);
    return article;
}

/**
 * Asocia los event handlers a los controles de una tarea
 * @param {HTMLElement} taskElement - Elemento DOM de la tarea
 * @param {Object} task - Objeto tarea
 * @param {Function} onTaskChange - Callback al modificar/eliminar
 */
function bindTaskEventHandlers(taskElement, task, onTaskChange) {
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    const deleteButton = taskElement.querySelector('.delete-btn');

    checkbox.onchange = (event) => {
        task.completed = event.target.checked;
        onTaskChange();
    };

    deleteButton.onclick = () => {
        taskElement.animate(
            [{ opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9 }],
            { duration: 200 }
        ).onfinish = () => {
            onTaskChange((currentTasks) => currentTasks.filter(t => t.id !== task.id));
        };
    };
}

/**
 * Renderiza la lista de tareas en el DOM
 * @param {Array<Object>} taskList - Lista de tareas
 * @param {Function} onTaskChange - Callback cuando se modifica una tarea (recibe opcionalmente función para actualizar lista)
 */
export function renderTaskList(taskList, onTaskChange) {
    const taskListContainer = document.getElementById('task-list');
    const emptyStateElement = document.getElementById('empty-state');

    const activeFilter = getActiveFilter();
    const searchQuery = getSearchQuery();
    const filteredTasks = getFilteredAndSortedTasks(taskList, activeFilter, searchQuery);

    taskListContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyStateElement.classList.remove('hidden');
        emptyStateElement.textContent = taskList.length === 0
            ? 'No hay tareas. ¡Añade una para empezar!'
            : 'No hay tareas que coincidan con tu búsqueda o filtro.';
    } else {
        emptyStateElement.classList.add('hidden');
        const fragment = document.createDocumentFragment();
        filteredTasks.forEach(task => {
            fragment.appendChild(createTaskElement(task, onTaskChange));
        });
        taskListContainer.appendChild(fragment);
    }

    refreshLucideIcons();
}

/**
 * Actualiza los iconos de Lucide en el DOM
 */
export function refreshLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Configura los botones de filtro con sus event handlers
 * @param {Function} onFilterChange - Callback al cambiar el filtro
 */
export function setupFilterButtons(onFilterChange) {
    const filterButtons = document.querySelectorAll('.barra-lateral li[data-filter]');

    filterButtons.forEach(button => {
        const handleFilterClick = () => {
            filterButtons.forEach(btn => {
                btn.className = FILTER_BTN_INACTIVE;
                btn.setAttribute('aria-pressed', 'false');
            });
            button.className = FILTER_BTN_ACTIVE;
            button.setAttribute('aria-pressed', 'true');
            onFilterChange();
        };

        button.onclick = handleFilterClick;
        button.onkeydown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleFilterClick();
            }
        };
    });
}
