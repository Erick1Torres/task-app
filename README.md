# TaskFlow Pro - Gestor de Tareas

Aplicación para gestionar tareas personales con **fecha**, **prioridad**, **categorías**, **búsqueda**, **modo oscuro** y **personalización de color**. Todo corre del lado del navegador y guarda tus datos en `localStorage`.

## Demo en vivo

[task-app-two-lake.vercel.app](https://task-app-two-lake.vercel.app/)

## Características

- **Interfaz moderna con Tailwind CSS** (CDN).
- **Modo Oscuro (Dark Mode)** con persistencia en `localStorage`.
- **Persistencia de tareas**: no se pierden al recargar.
- **Categorías**: Trabajo, Casa y Estudios.
- **Fecha a realizar** (muestra la fecha en cada tarea).
- **Prioridad**: Baja, Media y Alta (estilo/etiqueta por prioridad).
- **Campo de búsqueda (UI)**: el input existe, pero en `app.js` no hay lógica para filtrar por texto.
- **UX con feedback visual** (transiciones, estados y alertas de validación).
- **Color de identidad** personalizable (afecta header, filtros y estilos destacados).

## Cómo funciona (datos)

La app mantiene un listado de tareas en memoria y lo sincroniza con `localStorage` usando estas claves:

- `taskflow_tasks` (lista de tareas)
- `taskflow_color` (color elegido por el usuario)
- `taskflow_theme` (modo `dark`/`light`)

Cada tarea incluye:

- `id`
- `title`
- `category`
- `priority`
- `dueDate`
- `completed`

## Inicio rápido

1. Abre `index.html` en tu navegador.
2. Crea tareas desde el formulario.
3. Cambia el **tema** y el **color** desde el panel lateral.

## Ejemplos de uso

### Crear una tarea con fecha y prioridad

1. En `¿Qué hay que hacer?`, escribe el título de la tarea (mínimo 3 caracteres).
2. Selecciona una **Fecha** en el campo `Fecha`.
3. Elige **Categoría** (Trabajo, Casa o Estudios).
4. Elige **Prioridad** (Baja, Media o Alta).
5. Presiona el botón `+` para agregarla.

La tarea se guardará en `localStorage` y aparecerá en la lista.

### Filtrar por categoría

1. En la barra lateral, haz clic en `Todas`, `Trabajo`, `Casa` o `Estudios`.
2. La lista se re-renderiza mostrando solo las tareas de esa categoría (según `currentFilter`).

### Marcar como completada

1. Busca la tarea en la lista.
2. Haz clic en el checkbox de la tarjeta.
3. La tarea se marca como completada (aplica estilo y se persiste el cambio).

### Eliminar una tarea

1. En la tarjeta de la tarea, haz clic en el ícono de `trash`.
2. Se elimina del listado y se actualiza el `localStorage`.

### Cambiar modo oscuro / tema

1. Presiona el botón del tema (ícono `moon` / `sun` en el header).
2. El modo se guarda en `localStorage` como `taskflow_theme`.

### Personalizar el color de identidad

1. En el panel lateral, abre el selector de color `Paleta`.
2. Elige un color y la UI se actualiza (header, filtros y estilos destacados).
3. El color queda persistido en `localStorage` como `taskflow_color`.

## Despliegue

Es un proyecto **estático** (`index.html` + `app.js`), por lo que puedes desplegarlo fácilmente en plataformas como **Vercel**.

## Tecnologías utilizadas

- **HTML5 semántico** (`header`, `main`, `aside`).
- **Tailwind CSS.**
- **Lucide Icons** vía `unpkg`.
- **JavaScript** para la lógica de DOM y persistencia.

## Documentación técnica (JavaScript)

Este proyecto está implementado en `app.js` y toda la lógica vive dentro de una IIFE (encapsulamiento) para evitar variables globales.

### Estado y claves

- `STORAGE_KEYS` define las claves usadas en `localStorage`.
- `tasks` es el array en memoria con las tareas cargadas/actualizadas.
- `userColor` es el color de identidad elegido por el usuario (persistido).
- `currentFilter` guarda el filtro activo de categoría (`all`, `trabajo`, `casa`, `estudios`).
- `PRIORITY_MAP` mapea cada prioridad (`alta`, `media`, `baja`) a una etiqueta visual (clases CSS + nombre).

### Funciones principales

- `applyThemeColor(hex)`: actualiza `userColor` y persiste el color en `localStorage` (`taskflow_color`); sincroniza el input `#custom-color-picker` y el preview `#color-preview`; crea/actualiza la etiqueta `<style>` dinámica `#dynamic-brand-styles` para aplicar el color a header, filtros, checkbox y estilos destacados.
- `renderTaskList()`: filtra `tasks` según `currentFilter`; renderiza el listado dentro de `#task-list`; muestra/oculta `#empty-state` cuando no hay resultados; ordena por `id` descendente; genera tarjetas con `dataset.id` para identificar la tarea al hacer click; no implementa filtrado por texto (solo por categoría y cambios de estado).
- `init()`: enlaza el `submit` del formulario `#task-form` (valida título >= 3 caracteres, crea una tarea con `title`, `category`, `priority`, `dueDate` y `completed: false`, persiste en `localStorage` y re-renderiza); enlaza el click en `#task-list` para alternar completadas vía `.task-check` y eliminar vía `.delete-btn`; enlaza clicks de filtros en `.barra-lateral li` para actualizar `currentFilter` y re-renderizar; enlaza el input de color `#custom-color-picker` para llamar a `applyThemeColor`; enlaza el toggle `#theme-toggle` para alternar la clase `dark`, persistir `taskflow_theme` y actualizar el icono de Lucide.
- Bootstrap en `window.load`: aplica el tema guardado (`taskflow_theme`) si es `dark`; llama `applyThemeColor(userColor)`; ejecuta `init()` y luego `renderTaskList()`.

## Autor

Erick Cáceres.

