/**
 * Operaciones de almacenamiento local para TaskFlow Pro
 * @module storage
 */

import { STORAGE_KEY_TASKS, STORAGE_KEY_THEME } from './config.js';

/**
 * Carga las tareas desde localStorage con manejo de errores
 * @returns {Array<Object>} Array de tareas
 */
export function loadTasks() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
        const parsed = storedTasks ? JSON.parse(storedTasks) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Error al cargar tareas desde localStorage:', error);
        return [];
    }
}

/**
 * Guarda las tareas en localStorage
 * @param {Array<Object>} taskList - Array de tareas a guardar
 */
export function saveTasks(taskList) {
    try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(taskList));
    } catch (error) {
        console.warn('Error al guardar tareas en localStorage:', error);
    }
}

/**
 * Obtiene el tema guardado (dark/light)
 * @returns {string|null} 'dark', 'light' o null
 */
export function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY_THEME);
}

/**
 * Guarda la preferencia de tema
 * @param {string} theme - 'dark' o 'light'
 */
export function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
}
