const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const filtros = document.querySelectorAll(".barra-lateral li");
const themeToggle = document.getElementById('theme-toggle');

// --- 1. Lógica de Modo Oscuro ---
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Cargar preferencia de tema al recargar la página
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
    document.getElementById('theme-icon').textContent = '☀️';
}

// --- 2. Lógica de Tareas (Almacenamiento) ---
document.addEventListener('DOMContentLoaded', cargarTareas);

function guardarTareas() {
    const tareas = [];
    document.querySelectorAll('.task').forEach(t => {
        tareas.push({
            titulo: t.querySelector('.task-title').textContent,
            categoria: t.dataset.category,
            prioridad: t.dataset.priority
        });
    });
    localStorage.setItem('misTareas', JSON.stringify(tareas));
}

function cargarTareas() {
    const tareasGuardadas = JSON.parse(localStorage.getItem('misTareas')) || [];
    tareasGuardadas.forEach(t => crearElementoTarea(t.titulo, t.categoria, t.prioridad));
}

// --- 3. Creación de Interfaz con Tailwind ---
function crearElementoTarea(titulo, categoria, prioridad) {
    const newTask = document.createElement('section');
    newTask.dataset.category = categoria;
    newTask.dataset.priority = prioridad;
    
    // Colores de borde según prioridad usando Tailwind
    const borderColor = {
        alta: 'border-l-red-500',
        media: 'border-l-amber-500',
        baja: 'border-l-emerald-500'
    }[prioridad];

    // Clases de Tailwind para la tarjeta (Bonus: hover y transiciones)
    newTask.className = `task flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm border-l-4 ${borderColor} hover:translate-x-1 transition-all group`;

    newTask.innerHTML = `
        <div class="flex flex-col">
            <span class="task-title font-bold text-slate-800 dark:text-white">${titulo}</span>
            <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
                ${categoria} • <span class="capitalize">${prioridad}</span>
            </span>
        </div>
        <button class="btn-eliminar opacity-0 group-hover:opacity-100 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all">
            Eliminar
        </button>
    `;

    // Evento para eliminar
    newTask.querySelector('.btn-eliminar').addEventListener('click', () => {
        newTask.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            newTask.remove();
            guardarTareas();
        }, 200);
    });

    taskList.appendChild(newTask);
}

// --- 4. Eventos de Formulario y Filtros ---
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-input').value;
    const category = document.getElementById('task-category-select').value;
    const priority = document.getElementById('task-priority-select').value;

    crearElementoTarea(title, category, priority);
    guardarTareas();
    taskForm.reset();
});

filtros.forEach(filtro => {
    filtro.addEventListener("click", () => {
        const cat = filtro.getAttribute("data-filter");
        
        // Actualizar estilos visuales de los botones de filtro
        filtros.forEach(btn => {
            btn.className = "cursor-pointer p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all";
        });
        filtro.className = "active cursor-pointer p-3 rounded-xl bg-indigo-600 text-white font-bold transition-all";
        
        // Filtrado lógico
        document.querySelectorAll(".task").forEach(t => {
            const matches = (cat === "all" || t.dataset.category === cat);
            t.classList.toggle('hidden', !matches);
            t.classList.toggle('flex', matches);
        });
    });
});

searchInput.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    document.querySelectorAll(".task").forEach(t => {
        const titulo = t.querySelector('.task-title').textContent.toLowerCase();
        const matches = titulo.includes(texto);
        t.classList.toggle('hidden', !matches);
        t.classList.toggle('flex', matches);
    });
});
