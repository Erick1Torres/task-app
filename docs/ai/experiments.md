# Registro de Experimentos

En este documento se documentará el registro de experimentos.
----------

## Tres pequeños problemas de programación.

### 1. El Filtro de Precios

```JavaScript
let precios = [10, 45, 15, 30, 5, 45, 50, 2, 90];

for (let precio of precios) {
  if (precio < 20) {
    console.log("Este es barato: " + precio); // Resultado: 10, 15, 5, 2
  }
}
```
### Ayuda con IA.

```JavaScript
const precios = [10, 45, 15, 30, 5, 45, 50, 2, 90];

// "Fíltramelo: solo quiero los que sean menores a 20"
const baratos = precios.filter(precio => precio < 20);

console.log(baratos); // [10, 15, 5, 2]
```

### 2. Contador de Letras

```JavaScript
let frase = "manzana";
let contador = 0;

for (let letra of frase) {
  if (letra === "a") {
    contador = contador + 1;
  }
}

console.log("Hay " + contador + " letras 'a'");
// Resultado: Hay 3 letras 'a'
```
### Ayuda con IA.

```JavaScript
const frase = "manzana";

// Dividimos la palabra por la letra 'a' y restamos 1 al total de trozos
const cantidadA = frase.split("a").length - 1;

console.log(`La letra 'a' aparece ${cantidadA} veces.`); // 3
```
### 3. Convertidor a Mayúsculas.

```JavaScript
let nombres = ["ana", "luis", "pedro"];

for (let nombre of nombres) {
  let grito = nombre.toUpperCase();
  console.log("¡HOLA " + grito + "!");
}
// Resultado: ¡HOLA ANA!, ¡HOLA LUIS!, ¡HOLA PEDRO!
```
### Ayuda con IA.

```JavaScript
const nombres = ["ana", "luis", "pedro"];

// "Mapea cada nombre y conviértelo a mayúsculas"
const gritones = nombres.map(nombre => nombre.toUpperCase());

console.log(gritones); // ["ANA", "LUIS", "PEDRO"]
```

**Conclución de comparación:** si hablamos de tiempo la IA tarda menos tiempo, un codigo mejorado y mas comprencible.
-------

## Tres tareas relacionadas con tu proyecto.
 **Codigo original**
 ```JavaScript
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
```

**Mejoras Realizadas por la IA**
```JavaScript
(() => {
    // 1. MEJORA: Encapsulamiento en IIFE para proteger el código.
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

    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS)) || [];
    let userColor = localStorage.getItem(STORAGE_KEYS.COLOR) || '#4f46e5';
    let currentFilter = 'all';

    // 2. MEJORA: Motor de Color Total (Header + Botón Añadir + Filtros)
    function applyThemeColor(hex) {
        userColor = hex;
        localStorage.setItem(STORAGE_KEYS.COLOR, hex);
        
        const picker = document.getElementById('custom-color-picker');
        const preview = document.getElementById('color-preview');
        if (picker) picker.value = hex;
        if (preview) preview.style.backgroundColor = hex;

        let styleTag = document.getElementById('dynamic-brand-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-brand-styles';
            document.head.appendChild(styleTag);
        }

        // 3. MEJORA: CSS Dinámico optimizado para incluir el botón de añadir y el header
        styleTag.innerHTML = `
            :root { --brand-primary: ${hex}; }
            header, .header-bg { background-color: ${hex} !important; }
            .btn-primary, #task-form button[type="submit"] { background-color: ${hex} !important; }
            .active-filter { background-color: ${hex} !important; }
            .task-check:checked { background-color: ${hex} !important; border-color: ${hex} !important; }
            .task-check { border-color: ${hex}40; }
        `;
    }
    }
```
**Mejoras Realizadas:**
- Encapsulamiento IIFE: Código protegido contra interferencias externas.

- Estado Centralizado: La lógica de datos está separada de la visual.
- Inyección CSS para el Botón Añadir: Ahora el botón de envío del formulario (#task-form button) hereda el color de la paleta.
