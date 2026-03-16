// ============ CONFIGURACIÓN Y ESTADO ============
const STORAGE_KEYS = {
    TASKS: 'taskflow_tasks',
    COLOR: 'taskflow_color',
    THEME: 'taskflow_theme'
};

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
let userColor = localStorage.getItem(STORAGE_KEYS.COLOR) || '#4f46e5';

const PRIORITY_MAP = {
    alta: { class: "border-l-red-500 bg-red-50/40 dark:bg-red-950/20", label: "Alta" },
    media: { class: "border-l-orange-700 bg-orange-70/50 dark:bg-orange-800/20", label: "Media" },
    baja: { class: "border-l-green-500 bg-green-50/40 dark:bg-green-950/20", label: "Baja" }
};

// ============ MOTOR DE PERSONALIZACIÓN ============

/**
 * Aplica el color de identidad a la interfaz y actualiza el almacenamiento local.
 * Genera estilos CSS dinámicos para elementos con colores de marca.
 * @param {string} hex - El color en formato hexadecimal (ej. "#4f46e5").
 */
function applyThemeColor(hex) {
    userColor = hex;
    localStorage.setItem(STORAGE_KEYS.COLOR, hex);
    
    document.getElementById('custom-color-picker').value = hex;
    document.getElementById('color-preview').style.backgroundColor = hex;

    let styleTag = document.getElementById('dynamic-brand-styles') || document.createElement('style');
    styleTag.id = 'dynamic-brand-styles';
    styleTag.innerHTML = `
        :root { --brand-primary: ${hex}; }
        #main-header, #add-btn, .active-filter { background-color: ${hex} !important; }
        input:focus, select:focus { border-color: ${hex} !important; }
        .checked\\:bg-\\[var\\(--brand-primary\\)\\]:checked { background-color: ${hex} !important; }
    `;
    document.head.appendChild(styleTag);
}

// ============ LÓGICA DE TAREAS ============

/**
 * Filtra y renderiza la lista de tareas en el DOM basándose en la búsqueda y los filtros activos.
 * Gestiona el estado vacío y la ordenación de las tareas.
 */
function renderTaskList() {
    const list = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const activeFilter = document.querySelector('.barra-lateral li[aria-pressed="true"]')?.dataset.filter || 'all';

    const filtered = tasks.filter(t => {
        const matchesCategory = activeFilter === 'all' || t.category === activeFilter;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    list.innerHTML = '';
    
    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.sort((a, b) => b.id - a.id).forEach(task => {
            const today = new Date().toISOString().split('T')[0];
            const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
            const priorityData = PRIORITY_MAP[task.priority];

            const taskEl = document.createElement('div');
            taskEl.className = `group flex items-center justify-between p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 border-l-4 shadow-sm transition-all hover:shadow-md ${priorityData.class} ${task.completed ? 'opacity-50' : ''}`;
            
            taskEl.innerHTML = `
                <div class="flex items-center gap-5">
                    <div class="relative flex items-center">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               class="w-6 h-6 rounded-full cursor-pointer transition-all border-2 border-slate-300 appearance-none checked:bg-[var(--brand-primary)] checked:border-transparent">
                        <i data-lucide="check" class="w-4 h-4 text-white absolute left-1 pointer-events-none opacity-0 transition-opacity"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 ${task.completed ? 'line-through opacity-50' : ''}">${task.title}</h3>
                        <div class="flex flex-wrap gap-3 mt-1.5 items-center">
                            <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/60 dark:bg-black/20 rounded-lg text-slate-500">${task.category}</span>
                            <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">• ${priorityData.label}</span>
                            <span class="flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-500 font-bold animate-pulse' : 'text-slate-400 font-medium'}">
                                <i data-lucide="calendar" class="w-3 h-3"></i> ${task.dueDate || 'Sin fecha'}
                            </span>
                        </div>
                    </div>
                </div>
                <button title="Eliminar" class="delete-btn opacity-0 group-hover:opacity-100 p-3 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-all">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;

            const checkbox = taskEl.querySelector('input[type="checkbox"]');
            checkbox.onchange = () => { task.completed = checkbox.checked; saveTasks(); renderTaskList(); };
            
            taskEl.querySelector('.delete-btn').onclick = () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTaskList();
            };

            list.appendChild(itemIconFix(taskEl));
        });
    }
    lucide.createIcons();
}

/**
 * Ajusta la visibilidad del icono de verificación en elementos inyectados dinámicamente.
 * @param {HTMLElement} el - El elemento de la tarea recién creado.
 * @returns {HTMLElement} El elemento procesado.
 */
function itemIconFix(el) {
    if (window.lucide) {
        const checkIcon = el.querySelector('input:checked + i');
        if (checkIcon) checkIcon.style.opacity = "1";
    }
    return el;
}

/**
 * Sincroniza el array de tareas actual con el LocalStorage del navegador.
 */
function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// ============ INICIALIZACIÓN Y EVENTOS ============

/**
 * Manejador del evento de envío del formulario. 
 * Valida la longitud mínima del título y añade la nueva tarea al estado.
 */
document.getElementById('task-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const title = input.value.trim();

    // Validación de 3 caracteres solicitada
    if (title.length < 3) {
        input.classList.add('border-red-500', 'animate-shake');
        setTimeout(() => input.classList.remove('animate-shake'), 500);
        return;
    }
    input.classList.remove('border-red-500');

    tasks.push({
        id: Date.now(),
        title,
        dueDate: document.getElementById('task-date-input').value,
        category: document.getElementById('task-category-select').value,
        priority: document.getElementById('task-priority-select').value,
        completed: false
    });

    input.value = '';
    saveTasks();
    renderTaskList();
};

document.getElementById('search-input').oninput = renderTaskList;
document.getElementById('custom-color-picker').oninput = (e) => applyThemeColor(e.target.value);

/**
 * Configura los eventos de clic para los botones de filtrado de la barra lateral.
 */
document.querySelectorAll('.barra-lateral li').forEach(li => {
    li.onclick = () => {
        document.querySelectorAll('.barra-lateral li').forEach(l => {
            l.className = "filter-btn flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all";
            l.setAttribute('aria-pressed', 'false');
        });
        li.className = "filter-btn flex items-center gap-3 cursor-pointer p-3.5 rounded-2xl text-white font-bold shadow-lg active-filter transition-all";
        li.setAttribute('aria-pressed', 'true');
        applyThemeColor(userColor); 
        renderTaskList();
    };
});

/**
 * Alterna entre modo claro y oscuro, guardando la preferencia del usuario.
 */
document.getElementById('theme-toggle').onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    document.getElementById('theme-icon').setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    lucide.createIcons();
};

/**
 * Inicialización al cargar la página: aplica el tema y color guardados.
 */
window.onload = () => {
    if (localStorage.getItem(STORAGE_KEYS.THEME) === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    }
    applyThemeColor(userColor);
    renderTaskList();
};