/**
 * Punto de entrada de TaskFlow Pro - Inicialización y coordinación de módulos
 * @module main
 */

import { loadTasks, saveTasks, getSavedTheme, saveTheme } from './storage.js';
import { renderTaskList, setupFilterButtons, refreshLucideIcons } from './task.js';
import { validateTaskForm, getFormData, resetTaskForm, showValidationError, clearValidationError } from './form.js';
import { TASK_TITLE_MAX_LENGTH } from './config.js';

/** Lista de tareas en memoria */
let tasks = loadTasks();

/**
 * Persiste las tareas y vuelve a renderizar la lista
 * @param {Function} [taskUpdater] - Función opcional que recibe las tareas actuales y devuelve las nuevas
 */
function persistAndRender(taskUpdater) {
    if (typeof taskUpdater === 'function') {
        tasks = taskUpdater(tasks);
    }
    saveTasks(tasks);
    renderTaskList(tasks, persistAndRender);
}

/**
 * Maneja el envío del formulario de nueva tarea
 * @param {Event} event - Evento submit del formulario
 */
function handleTaskFormSubmit(event) {
    event.preventDefault();
    clearValidationError();

    const { title, category, priority } = getFormData();
    const validation = validateTaskForm(title, category, priority);

    if (!validation.valid) {
        showValidationError(validation.error);
        document.getElementById('task-input')?.focus();
        return;
    }

    const safeTitle = title.length > TASK_TITLE_MAX_LENGTH ? title.slice(0, TASK_TITLE_MAX_LENGTH) : title;
    tasks.push({
        id: Date.now(),
        title: safeTitle,
        category,
        priority,
        completed: false
    });

    resetTaskForm();
    persistAndRender();
}

/**
 * Alterna entre modo oscuro y claro
 */
function handleThemeToggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    const theme = isDark ? 'dark' : 'light';
    saveTheme(theme);

    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    }
    refreshLucideIcons();
}

/**
 * Inicializa la aplicación al cargar el DOM
 */
function initApp() {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', 'sun');
        }
    }

    setupFilterButtons(() => persistAndRender());
    document.getElementById('task-form').onsubmit = handleTaskFormSubmit;
    document.getElementById('task-input').oninput = clearValidationError;
    document.getElementById('search-input').oninput = () => persistAndRender();
    document.getElementById('theme-toggle').onclick = handleThemeToggle;

    refreshLucideIcons();
    persistAndRender();
}

document.addEventListener('DOMContentLoaded', initApp);
