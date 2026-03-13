/**
 * Utilidades generales de TaskFlow Pro
 * @module utils
 */

/**
 * Escapa HTML para prevenir ataques XSS
 * @param {string} text - Texto sin escapar
 * @returns {string} Texto escapado seguro para insertar en HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
