const taskService = require('../services/task.service');

const ObtenerTodasTareas = (req, res, next) => {
    try {
        const tasks = taskService.obtenerTodas();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

const CreaNuevaTarea = (req, res, next) => {
    try {
        const { title, priority, category, dueDate } = req.body;

        // --- VALIDACIÓN EXHAUSTIVA ---
        // 1. Título obligatorio
        if (!title || title.trim() === "") {
            const error = new Error("El título es obligatorio y no puede estar vacío.");
            error.status = 400;
            throw error;
        }

        // 2. Prioridad restringida
        const prioridadesValidas = ['baja', 'media', 'alta'];
        if (!prioridadesValidas.includes(priority)) {
            const error = new Error(`Prioridad no válida. Debe ser: ${prioridadesValidas.join(', ')}`);
            error.status = 400;
            throw error;
        }

        // 3. Categoría obligatoria
        if (!category || category.trim() === "") {
            const error = new Error("La categoría es obligatoria para organizar tus tareas.");
            error.status = 400;
            throw error;
        }

        const nuevaTarea = taskService.crearTarea({ title, priority, category, dueDate });
        res.status(201).json(nuevaTarea);
    } catch (error) {
        next(error); // Salta al middleware global en index.js
    }
};

const EliminarTarea = (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            const error = new Error("El ID de la tarea debe ser un número válido.");
            error.status = 400;
            throw error;
        }

        taskService.eliminarTarea(id);
        res.status(204).send(); // 204 significa "No Content", éxito al borrar
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            error.status = 404;
        }
        next(error);
    }
};

const actualizarTarea = (req, res, next) => {
    try {
        const { id } = req.params;
        const datos = req.body;

        if (!id || isNaN(id)) {
            const error = new Error("ID de tarea no válido.");
            error.status = 400;
            throw error;
        }

        const tareaEditada = taskService.actualizarTarea(id, datos);
        res.json(tareaEditada);
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            error.status = 404;
        }
        next(error);
    }
};

module.exports = {
    ObtenerTodasTareas,
    CreaNuevaTarea,
    EliminarTarea,
    actualizarTarea
};