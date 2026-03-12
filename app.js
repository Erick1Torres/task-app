let tasks = JSON.parse(localStorage.getItem('misTareas')) || [];

function saveAndRender() {
    localStorage.setItem('misTareas', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const activeFilterEl = document.querySelector('.barra-lateral li.bg-indigo-600');
    const activeFilter = activeFilterEl ? activeFilterEl.dataset.filter : 'all';
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const taskList = document.getElementById('task-list');
    
    taskList.innerHTML = '';

    const priorityWeight = { alta: 1, media: 2, baja: 3 };
    const filtered = tasks
        .filter(t => (activeFilter === 'all' || t.category === activeFilter) && t.title.toLowerCase().includes(searchText))
        .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);

    filtered.forEach(task => {
        const taskEl = createTaskElement(task);
        taskList.appendChild(taskEl);
    });

    lucide.createIcons();
}

function createTaskElement(task) {
    // Diccionario de clases Tailwind para los colores de prioridad
    const priorityClasses = {
        alta: "border-l-red-500 bg-red-50/30 dark:bg-red-900/10 text-red-700 dark:text-red-400",
        media: "border-l-amber-500 bg-amber-50/30 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400",
        baja: "border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400"
    };

    const pClass = priorityClasses[task.priority] || "border-l-slate-300 bg-slate-50";
    const div = document.createElement('div');
    
    div.className = `flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-700 border-l-4 shadow-sm transition-all group ${pClass} ${task.completed ? 'opacity-40 grayscale-[0.5]' : ''}`;
    
    div.innerHTML = `
        <div class="flex items-center gap-4">
            <input type="checkbox" ${task.completed ? 'checked' : ''} class="w-5 h-5 rounded cursor-pointer accent-indigo-600 border-slate-300">
            <div>
                <p class="font-bold ${task.completed ? 'line-through opacity-50' : 'text-slate-800 dark:text-white'}">${task.title}</p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-black uppercase tracking-widest opacity-60">${task.category}</span>
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/50 dark:bg-black/20 border border-current/10">
                        ${task.priority}
                    </span>
                </div>
            </div>
        </div>
        <button class="delete-btn opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
            <i data-lucide="trash-2" class="w-5 h-5"></i>
        </button>
    `;

    div.querySelector('input').onchange = (e) => {
        task.completed = e.target.checked;
        saveAndRender();
    };

    div.querySelector('.delete-btn').onclick = () => {
        div.animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 0.9 }], { duration: 200 }).onfinish = () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveAndRender();
        };
    };

    return div;
}

// Formulario
document.getElementById('task-form').onsubmit = (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    tasks.push({
        id: Date.now(),
        title: input.value.trim(),
        category: document.getElementById('task-category-select').value,
        priority: document.getElementById('task-priority-select').value,
        completed: false
    });
    input.value = '';
    saveAndRender();
};

// Filtros
document.querySelectorAll(".barra-lateral li").forEach(f => {
    f.onclick = () => {
        document.querySelectorAll(".barra-lateral li").forEach(btn => {
            btn.className = "flex items-center gap-3 cursor-pointer p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all outline-none";
        });
        f.className = "flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md outline-none";
        renderTasks();
    };
});

// Búsqueda
document.getElementById('search-input').oninput = renderTasks;

// Lógica de Modo Oscuro
document.getElementById('theme-toggle').onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.getElementById('theme-icon');
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    lucide.createIcons();
};

// Carga Inicial
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').setAttribute('data-lucide', 'sun');
    }
    lucide.createIcons();
    renderTasks();
});