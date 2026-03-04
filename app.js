const taskForm = document.getElementById('task-form');
        const taskList = document.getElementById('task-list');
        const searchInput = document.getElementById('search-input');
        const filtros = document.querySelectorAll(".barra-lateral li");

        // logica de almacenamiento

        // Cargar tareas al iniciar
        document.addEventListener('DOMContentLoaded', cargarTareas);

        function guardarTareas() {
            const tareas = [];
            document.querySelectorAll('.task').forEach(tareaElement => {
                tareas.push({
                    titulo: tareaElement.querySelector('.title').textContent,
                    categoria: tareaElement.dataset.category,
                    prioridad: tareaElement.classList.contains('alta') ? 'alta' : 
                               tareaElement.classList.contains('media') ? 'media' : 'baja'
                });
            });
            localStorage.setItem('misTareas', JSON.stringify(tareas));
        }

        function cargarTareas() {
            const tareasGuardadas = JSON.parse(localStorage.getItem('misTareas')) || [];
            tareasGuardadas.forEach(t => crearElementoTarea(t.titulo, t.categoria, t.prioridad));
        }

        // funciones de interfaz

        function crearElementoTarea(titulo, categoria, prioridad) {
            const newTask = document.createElement('section');
            newTask.classList.add('task', prioridad);
            newTask.dataset.category = categoria;

            newTask.innerHTML = `
                <div style="display: flex; flex-direction: column; flex-grow: 1;">
                    <span class="title"><strong>${titulo}</strong></span>
                    <small>${categoria.charAt(0).toUpperCase() + categoria.slice(1)} - Prioridad: ${prioridad}</small>
                </div>
                <button class="btn-eliminar">Eliminar</button>
            `;

            newTask.querySelector('.btn-eliminar').addEventListener('click', () => {
                newTask.remove();
                guardarTareas(); // Guardar despues de eliminar
            });

            taskList.appendChild(newTask);
        }

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('task-input').value;
            const category = document.getElementById('task-category-select').value;
            const priority = document.getElementById('task-priority-select').value;

            crearElementoTarea(title, category, priority);
            guardarTareas(); // Guardar despues de añadir
            taskForm.reset();
        });

        filtros.forEach(filtro => {
            filtro.addEventListener("click", () => {
                const cat = filtro.getAttribute("data-filter");
                filtros.forEach(btn => btn.classList.remove("active"));
                filtro.classList.add("active");
                document.querySelectorAll(".task").forEach(t => {
                    t.style.display = (cat === "all" || t.dataset.category === cat) ? "flex" : "none";
                });
            });
        });

        searchInput.addEventListener('input', (e) => {
            const texto = e.target.value.toLowerCase();
            document.querySelectorAll(".task").forEach(t => {
                const titulo = t.querySelector('.title').textContent.toLowerCase();
                t.style.display = titulo.includes(texto) ? "flex" : "none";
            });
        });