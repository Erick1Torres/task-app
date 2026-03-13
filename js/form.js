/**
 * Validación y manejo del formulario de tareas
 * @module form
 */

import { TASK_TITLE_MAX_LENGTH, VALID_CATEGORIES, VALID_PRIORITIES } from './config.js';

/** Mensajes de error de validación */
export const VALIDATION_MESSAGES = {
    EMPTY: 'El título no puede estar vacío.',
    TOO_LONG: `El título no puede superar ${TASK_TITLE_MAX_LENGTH} caracteres.`,
    INVALID_CATEGORY: 'Categoría no válida.',
    INVALID_PRIORITY: 'Prioridad no válida.'
};

/**
 * Valida los datos del formulario de nueva tarea
 * @param {string} title - Título de la tarea
 * @param {string} category - Categoría seleccionada
 * @param {string} priority - Prioridad seleccionada
 * @returns {{ valid: boolean, error?: string }} Resultado de la validación
 */
export function validateTaskForm(title, category, priority) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
        return { valid: false, error: VALIDATION_MESSAGES.EMPTY };
    }

    if (trimmedTitle.length > TASK_TITLE_MAX_LENGTH) {
        return { valid: false, error: VALIDATION_MESSAGES.TOO_LONG };
    }

    if (!VALID_CATEGORIES.includes(category)) {
        return { valid: false, error: VALIDATION_MESSAGES.INVALID_CATEGORY };
    }

    if (!VALID_PRIORITIES.includes(priority)) {
        return { valid: false, error: VALIDATION_MESSAGES.INVALID_PRIORITY };
    }

    return { valid: true };
}

/**
 * Obtiene y normaliza los datos del formulario de tarea
 * @returns {{ title: string, category: string, priority: string }}
 */
export function getFormData() {
    const titleInput = document.getElementById('task-input');
    const categorySelect = document.getElementById('task-category-select');
    const prioritySelect = document.getElementById('task-priority-select');

    const rawTitle = titleInput?.value ?? '';
    const title = rawTitle.trim();
    const category = categorySelect?.value ?? 'trabajo';
    const priority = prioritySelect?.value ?? 'media';

    return { title, category, priority };
}

/**
 * Limpia el formulario y restablece el foco
 */
export function resetTaskForm() {
    const titleInput = document.getElementById('task-input');
    if (titleInput) {
        titleInput.value = '';
        titleInput.focus();
    }
}

/**
 * Muestra un mensaje de error al usuario (por ejemplo en el input)
 * @param {string} message - Mensaje a mostrar
 */
export function showValidationError(message) {
    const titleInput = document.getElementById('task-input');
    if (!titleInput) return;

    titleInput.setAttribute('aria-invalid', 'true');
    titleInput.setAttribute('aria-errormessage', 'task-input-error');

    let errorElement = document.getElementById('task-input-error');
    if (!errorElement) {
        errorElement = document.createElement('p');
        errorElement.id = 'task-input-error';
        errorElement.className = 'text-red-500 dark:text-red-400 text-sm mt-1';
        errorElement.setAttribute('role', 'alert');
        titleInput.parentNode?.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

/**
 * Oculta el mensaje de error de validación
 */
export function clearValidationError() {
    const titleInput = document.getElementById('task-input');
    const errorElement = document.getElementById('task-input-error');

    if (titleInput) {
        titleInput.removeAttribute('aria-invalid');
        titleInput.removeAttribute('aria-errormessage');
    }
    if (errorElement) {
        errorElement.textContent = '';
    }
}
