(() => {
    // 1. Configuración y Estado Global
    const STORAGE_KEYS = {
        TASKS: 'taskflow_tasks',
        COLOR: 'taskflow_color',
        THEME: 'taskflow_theme'
    };

    const PRIORITY_MAP = {
        alta: { class: "border-l-red-500 bg-red-50/40 dark:bg-red-950/20", label: "Alta" },
        media: { class: "border-l-orange-700 bg-orange-70/50 dark:bg-orange-800/20", label: "Media" },
        baja: { class: "border-l-green-500 bg-green-50/40 dark:bg-green-950/20", label: "Baja" }
    };

    let tasks = []; 
    let userColor = localStorage.getItem(STORAGE_KEYS.COLOR) || '#4f46e5';
    let currentFilter = 'all';
    let searchQuery = ''; 

    // 2. Motor de Personalización (Color Dinámico)
    function applyThemeColor(hex) {
        userColor = hex;
        localStorage.setItem(STORAGE_KEYS.COLOR, hex);
        
        const picker = document.getElementById('custom-color-picker');
        const preview = document.getElementById('color-preview');
        
        if (picker) picker.value = hex;
        if (preview) preview.style.backgroundColor = hex;

        let styleTag = document.getElementById('dynamic-brand-styles') || document.createElement('style');
        styleTag.id = 'dynamic-brand-styles';
        styleTag.innerHTML = `
            :root { --brand-color: ${hex}; }
            .active-filter { background-color: ${hex} !important; color: white !important; }
            .task-checkbox:checked { background-color: ${hex} !important; border-color: ${hex} !important; }
            .accent-color { color: ${hex} !important; }
        `;
        if (!styleTag.parentNode) document.head.appendChild(styleTag);
    }

    // 3. Sincronización con la API (PUNTO EXTRA: Estado de Carga)
    async function syncTasks() {
        const listContainer = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        
        try {
            // Mostrar Spinner de carga antes de la petición
            emptyState.classList.add('hidden');
            listContainer.innerHTML = `
                <div id="loading-spinner" class="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    <p class="text-slate-500 font-medium italic">Sincronizando con Vercel...</p>
                </div>
            `;

            // Llamada asíncrona a la API
            const fetchedTasks = await taskApi.getAll();
            tasks = fetchedTasks;
            
            // Dibujar la lista con los datos reales
            renderTaskList();
        } catch (error) {
            console.error("Error de comunicación con la API:", error);
            listContainer.innerHTML = `
                <div class="text-center py-12 px-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800/30">
                    <i data-lucide="wifi-off" class="w-12 h-12 mx-auto text-red-400 mb-4"></i>
                    <p class="text-red-600 font-bold">Sin conexión con el servidor</p>
                    <p class="text-red-500/70 text-sm mt-2">No se pudo cargar la información. Verifica tu despliegue en Vercel.</p>
                    <button onclick="window.location.reload()" class="mt-4 text-xs underline uppercase tracking-widest font-bold text-red-600">Reintentar</button>
                </div>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    // 4. Renderizado de la Interfaz
    function renderTaskList() {
        const list = document.getElementById('task-list');
        const emptyState = document.getElementById('empty-state');
        
        // Filtrado lógico
        const filteredTasks = tasks.filter(t => {
            const matchesFilter = currentFilter === 'all' || 
                                 (currentFilter === 'active' && !t.completed) || 
                                 (currentFilter === 'completed' && t.completed);
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        list.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            filteredTasks.forEach(task => {
                const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.baja;
                const card = document.createElement('div');
                card.className = `group flex items-center gap-4 p-5 rounded-3xl border-l-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${priority.class} ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''}`;
                
                card.innerHTML = `
                    <div class="relative flex items-center justify-center">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} 
                               class="task-checkbox w-7 h-7 rounded-full border-2 border-slate-300 appearance-none cursor-pointer transition-all checked:scale-110">
                        ${task.completed ? '<i data-lucide="check" class="absolute text-white w-4 h-4 pointer-events-none"></i>' : ''}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-slate-800 dark:text-white truncate text-lg ${task.completed ? 'line-through decoration-2' : ''}">${task.title}</h3>
                        <div class="flex items-center gap-3 mt-1">
                            <span class="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-lg bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">${task.category}</span>
                            ${task.dueDate ? `<span class="text-xs text-slate-500 flex items-center gap-1 font-medium"><i data-lucide="calendar" class="w-3 h-3"></i> ${task.dueDate}</span>` : ''}
                        </div>
                    </div>
                    <button class="delete-btn opacity-0 group-hover:opacity-100 p-2.5 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-red-500 hover:shadow-lg transition-all transform hover:scale-110">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                `;

                // Evento: Cambiar estado Completado
                card.querySelector('.task-checkbox').onchange = async () => {
                    try {
                        await taskApi.update(task.id, { completed: !task.completed });
                        await syncTasks();
                    } catch (err) {
                        alert("Error al actualizar la tarea");
                    }
                };

                // Evento: Eliminar
                card.querySelector('.delete-btn').onclick = async () => {
                    card.classList.add('scale-90', 'opacity-0', 'blur-sm');
                    setTimeout(async () => {
                        try {
                            await taskApi.delete(task.id);
                            await syncTasks();
                        } catch (err) {
                            alert("No se pudo eliminar la tarea");
                            await syncTasks();
                        }
                    }, 300);
                };

                list.appendChild(card);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    // 5. Inicialización de Eventos
    function init() {
        const form = document.getElementById('task-form');
        
        // Formulario de creación
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('task-input');
            const priorityInput = document.getElementById('priority-select');
            const categoryInput = document.getElementById('category-select');
            const dateInput = document.getElementById('date-input');

            if (!titleInput.value.trim()) return;

            const newTask = {
                title: titleInput.value,
                priority: priorityInput.value,
                category: categoryInput.value,
                dueDate: dateInput.value
            };

            try {
                // Desactivar botón mientras se crea
                const btn = form.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.classList.add('opacity-50');

                await taskApi.create(newTask);
                
                titleInput.value = '';
                dateInput.value = '';
                btn.disabled = false;
                btn.classList.remove('opacity-50');
                
                await syncTasks();
            } catch (err) {
                form.classList.add('animate-shake');
                setTimeout(() => form.classList.remove('animate-shake'), 400);
            }
        });

        // Buscador en tiempo real
        document.getElementById('search-input').addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderTaskList();
        });

        // Filtros de navegación
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active-filter', 'font-bold', 'shadow-lg', 'text-white');
                    b.classList.add('text-slate-500', 'dark:text-slate-400');
                });
                this.classList.add('active-filter', 'font-bold', 'shadow-lg', 'text-white');
                this.classList.remove('text-slate-500', 'dark:text-slate-400');
                
                currentFilter = this.dataset.filter || 'all';
                renderTaskList();
            });
        });

        // Selector de color personalizado
        document.getElementById('custom-color-picker')?.addEventListener('input', (e) => {
            applyThemeColor(e.target.value);
        });

        // Toggle Modo Oscuro
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
            
            const themeIcon = document.getElementById('theme-icon');
            if (themeIcon) {
                themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // 6. Arranque de la Aplicación
    document.addEventListener('DOMContentLoaded', () => {
        // Cargar Preferencias
        const isDark = localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
        document.documentElement.classList.toggle('dark', isDark);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');

        applyThemeColor(userColor);
        init();
        syncTasks(); // Carga inicial desde la API
    });
})();