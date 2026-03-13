# Flujo de Trabajo con Cursor

Guía paso a paso para el primer contacto con Cursor en el proyecto TaskFlow. Cada paso incluye qué hacer y por qué. Los atajos de teclado que se indican son para **Mac**.

---

## 1: Instala Cursor y abre el proyecto TaskFlow

- Descarga Cursor desde [cursor.com](https://cursor.com), instálalo y abre la carpeta del proyecto TaskFlow (Archivo → Abrir carpeta).

**Explicación:** Cursor es un IDE basado en VS Code que integra IA.

---

## 2: Explora la interfaz

- Revisa el explorador de archivos (izquierda), la terminal integrada (panel inferior) y las herramientas de edición. Abre el chat con **Command + L** y Composer con **Command + I** para ver cómo se presentan.

**Explicación:**

- **Explorador de archivos:** Muestra la estructura del proyecto. En TaskFlow verás `index.html`, `app.js` y la carpeta `docs`. La IA usa esta estructura para proponer cambios en archivos concretos.

- **Terminal integrada:** Sirve para ejecutar comandos (por ejemplo, un servidor local para probar la app). Cursor puede sugerir comandos según el contexto del proyecto.

- **Chat (Command + L):** Panel lateral donde haces preguntas y recibes respuestas. Es conversacional: puedes seguir preguntando. Útil para entender código o pedir explicaciones.

- **Composer (Command + I):** Ventana flotante orientada a la acción. Describes una tarea y Cursor propone cambios en uno o varios archivos. Usa el chat para entender; usa Composer para modificar.

---

## 3: Prueba el autocompletado escribiendo comentarios que describan funciones

**Qué hacer:** Abre `app.js`, ve a una línea vacía y escribe un comentario descriptivo, por ejemplo: `// Función que filtra las tareas por categoría y las ordena por prioridad`. Espera a que aparezca la sugerencia en gris y pulsa **Tab** para aceptarla.

**Explicación:** El autocompletado de Cursor predice el siguiente fragmento de código según el archivo actual y el contexto del proyecto. Los comentarios descriptivos funcionan bien porque indican claramente la intención. Si escribes "función que valida el email", Cursor suele proponer la implementación. También sirve para completar bloques repetitivos (por ejemplo, opciones de un `select` o propiedades de un objeto). Si la sugerencia no encaja, sigue escribiendo y Cursor ajustará la predicción.

---

## 4: Utiliza el chat contextual para pedir explicaciones de partes del código

**Qué hacer:** Selecciona un bloque de código en `app.js` (por ejemplo, la función `createTaskElement` o el manejador del formulario). Pulsa **Command + L** para abrir el chat y escribe: "Explica qué hace este código". La IA responderá con una explicación del bloque seleccionado.

**Explicación:** El chat usa el código seleccionado como contexto. Sin selección, la respuesta puede ser genérica. Con selección, la IA explica la lógica, las variables y el flujo. Sirve para entender código ajeno, recordar qué hace algo que escribiste hace tiempo o aclarar dudas antes de modificarlo.

---

## 5: Utiliza la edición inline para modificar funciones existentes

**Qué hacer:** Selecciona una función en `app.js` (por ejemplo, la que maneja el submit del formulario). Pulsa **Command + K**. En el cuadro que aparece, escribe: "Añade validación para que no se añadan tareas con título vacío". Revisa la propuesta y acéptala si es correcta.

**Explicación:** La edición inline (Command + K) aplica cambios en el mismo lugar donde está el código. No abre el chat; la instrucción aparece debajo de la selección. Es ideal para cambios puntuales: refactorizar una función, añadir validaciones, corregir un bug o extraer constantes.

---

## 6: Prueba Composer para generar cambios que afecten a varios archivos

**Qué hacer:** Pulsa **Command + I** para abrir Composer. Escribe: "Añade un mensaje cuando no haya tareas que coincidan con la búsqueda o el filtro". Composer propondrá cambios en `index.html` (elemento para el mensaje) y en `app.js` (lógica para mostrarlo u ocultarlo).

**Explicación:** Composer está pensado para tareas que tocan varios archivos. Puede crear archivos nuevos, modificar varios existentes y mantener la coherencia entre ellos.

---

## 7: Anota los atajos de teclado que uses con más frecuencia

- Durante el uso, toma nota de los atajos que más utilices. Estos son los esenciales en **Mac**:

| Atajo (Mac) | Acción |
|-------------|--------|
| **Command + K** | Edición inline |
| **Command + L** | Abrir chat |
| **Command + I** | Composer |
| **Tab** | Aceptar sugerencias |

-Memorizar estos atajos acelera el flujo de trabajo. **Command + K** para cambios puntuales, **Command + L** para preguntas, **Command + I** para cambios multiarchivo, **Tab** para aceptar autocompletado.

---

## 8: Documenta dos ejemplos concretos donde Cursor haya mejorado tu código


### Ejemplo 1: Diccionario de prioridades

**Antes:** Las clases Tailwind para prioridad estaban mezcladas con la lógica de `createTaskElement()`.

**Con Cursor:** Se usó **Command + K** para pedir: "Extrae las clases de prioridad a un objeto reutilizable". Cursor generó `priorityClasses` con variantes para modo claro y oscuro, dejando la función más legible.

### Ejemplo 2: Animación al eliminar tareas

**Antes:** La eliminación era instantánea, sin transición.

**Con Cursor:** Se usó **Composer** para pedir: "Añade una animación suave al eliminar una tarea". Cursor implementó la Web Animation API con `element.animate()` para una transición de opacidad y escala de 200ms antes de quitar la tarea del DOM.
