/**
 * Configuración y constantes de TaskFlow Pro
 * @module config
 */

/** Clave de localStorage para las tareas */
export const STORAGE_KEY_TASKS = 'misTareas';

/** Clave de localStorage para el tema (claro/oscuro) */
export const STORAGE_KEY_THEME = 'theme';

/** Clases CSS Tailwind por nivel de prioridad */
export const PRIORITY_CLASSES = {
    alta: "border-l-red-500 bg-red-50/30 dark:bg-red-900/10 text-red-700 dark:text-red-400",
    media: "border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400",
    baja: "border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400"
};

/** Peso numérico para ordenar tareas por prioridad (menor = más urgente) */
export const PRIORITY_WEIGHT = { alta: 1, media: 2, baja: 3 };

/** Clases del botón de filtro cuando está activo */
export const FILTER_BTN_ACTIVE = "filter-btn flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

/** Clases del botón de filtro cuando está inactivo */
export const FILTER_BTN_INACTIVE = "filter-btn flex items-center gap-3 cursor-pointer p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800";

/** Longitud máxima permitida para el título de una tarea */
export const TASK_TITLE_MAX_LENGTH = 200;

/** Categorías válidas para las tareas */
export const VALID_CATEGORIES = ['trabajo', 'casa', 'estudios'];

/** Prioridades válidas para las tareas */
export const VALID_PRIORITIES = ['alta', 'media', 'baja'];
