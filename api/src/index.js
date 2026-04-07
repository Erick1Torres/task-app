const express = require('express');
const cors = require('cors');
// Mantenemos el PORT para que funcione en local (VSCode)
const { PORT } = require('./config/env'); 
const taskRouters = require('./routers/task.router');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/v1/tasks', taskRouters);

// --- MEJORA: Middleware Global de Errores ---
// Esto captura cualquier 'next(error)' de tus controladores
app.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error(`[Server Error] ${status}: ${err.message}`);
    
    res.status(status).json({
        error: true,
        status: status,
        message: err.message || "Error interno del servidor"
    });
});

// Condicional para que no explote en Vercel pero funcione en VSCode
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT || 3000, () => {
        console.log(`🚀 Servidor local: http://localhost:${PORT || 3000}`);
    });
}

module.exports = app;