# Taskflow Project

Este proyecto muestra cómo configurar un entorno básico de desarrollo usando Git, GitHub y Visual Studio Code.

---

### 1. Instalar Visual Studio Code

Descargar e instalar Visual Studio Code desde la página oficial:

https://code.visualstudio.com/

---

### 2. Instalación y configuración para Git

Descargar Git desde:

https://git-scm.com/

Una vez instalado, abrir la terminal y configurar la identidad global:

```
git config --global user.name "Tu Nombre"
git config --global user.email "tugmail@gmail.com"
```
Estos codigos sirven para que git sepa quienes hacen los cambios 

Sabiendo esto lo sigiente es comprobar la configuración.

Comprobar si la configuración es correcta.
```
git config --list
```
----

### 3. Crear una cuenta de github y un repositorio

- Ir a github
https://github.com
- Creas una cuenta
- Luego creas un repositorio donde dice New Repository
- Colocar el nombre en mi caso es "Task-app"
- Elegir la Opción Public
- Luego pulsar Create Repository
Cuando lo creas te saldra una URL y unos codigos copiarlos y guardaroslo porque son necesarios para conectarlo con el proyecto con github se veral algo como esto
```
https://github.com/TU-USUARIO/task-app.git
git branch -M main
git push -u origin main
```
------

### 4. Crear el proyecto en el Ordenador 
- Abrir terminal y poner es codigo:
```
mkdir task-app
```
- Entrar en la carpeta:
```
cd task-app
```
- iniciar Git:
```
git init
```
- Creamos el readme
```
touch README.md
```
-----

### 5. Haceer el primer commit
- Añadimos el archivo readme
```
git add README.md
```
- Crear el commit
```
  git commit -m "Mi Primer commit"
```
-----

### 6. Conectar el Proyecto con Github 
es aqui donde ocuparemos a url y los codigos de el encabezado 3 
- Abrir la terminal y escribir el siguente codigo con la url guardada
```
git remote add origin https://github.com/TU-USUARIO/task-pp.git
```
Después 
```
git branch -M main
git push -u origin main
```
esto sube el proyecto a github

------

### 7. Añadir colaborador 
Este paso no es necesario si tu github es personalmente tuyo en mi caso es un proyecto de practicas
- Entrar en el repositorio de github
- Ir a settings
- Collaborators
- pulsar add people
- Añadir colaborador ejemplo: nombre-empresa.com
-----
Eso serian todos los pasos a segir para el la creacion del contenedor del proyecto 

-------

# Proyecto con HTML y CSS
------
### Ejercicio 1
- Estructura y diseño con HTML y CSS
Crea la estructura visual de una app y publícala en internet.
1. Crea el archivo index.html usando etiquetas (header), (main), (aside) y (section) para organizar el contenido.
2. Define variables CSS en el bloque :root para gestionar colores, fuentes y espaciados de forma centralizada.
3. Maqueta la lista de tareas utilizando display: flex para alinear títulos, categorías y badges de prioridad.
4. Implementa Media Queries para asegurar que la barra lateral se posicione correctamente en dispositivos móviles.
5. Conecta tu repositorio a Vercel para obtener una URL pública de tu proyecto.

Entregar: URL de Vercel con la maqueta responsive de la aplicación.
Bonus: Añade un efecto de transición suave al cambiar el estado de las tarjetas de tareas usando transition.

#### Proyecto
Url de la aplicacion publicada:
https://task-app-two-lake.vercel.app/

-----

### tecnologias utilizasdas
- HTML5
- CSS
- Flexbox
- Variables CSS
- Media Queries
- Vercel (deploy)

----

### 1. Estructura HTML de la aplicación

Creamos una carpeta y un archivo llamado 'index.html' utilizando etiquetas semanticas para organizar el contenido de la aplicación. Seria semanticamente de la siguiente manera:

```
<html>
<header>
<h1>Gestor de Tareas</h1>
</header>

<aside>
Barra lateral con categorías
</aside>

<main>
Lista principal de tareas
</main>

<section>
Elemento individual de tarea
</section>
</html>
```

Las etiquetas que utilizamos nes permiten organizar la interfaz de forma mas clara:
- header -> titulo
- aside -> las categorias
- main -> El contenido principal
- selection -> Cada tarea

### 2. Variables CSS
reamos un archivo CSS llamdo 'styles.css' y lo vinculamos con el html colocando las siguentes etiquetas en el 'head'
```
<head>
 <link rel="stylesheet" href="styles.css">
</head>
```

- variables dentro del selector ':root'
```
:root {
   --color-bc: #f0f2f5;
  --color-header: #282644;
  --color-background: #d5f2cf;
  --priority-high: #ef4444;
  --priority-medium: #f59e0b;
  --priority-low: #10b981;
  --corners: 24px;
  --font-main: 'Segoe UI', Tahoma, Verdana, sans-serif;
}
```
Esto Permite:
- reutilazar colores
- mantener coherencia visual
- facilitar cambios de diseño

### 3. Maquetacion de Flexbox
He utilizado el Flexbox para alinear los elementos de cada tarea de la sigiente manera
```
.task {
 display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.2s;
  border-left: 5px solid #ccc;
}
```
Esto me permite colocar en una misma línea:
- título de la tarea
- categoría
- badge de prioridad
### 4. Diseño responsive con Media Queries

Para adaptar la aplicacion para moviles se implementa Media Queries de la siguente manera:
```
@media (max-width: 650px) {

.layout-flex {
flex-direction: column;
}

.task {
flex-direction: column;
align-items: flex-start;
gap: 8px;
}
aside ul {
    display: flex;
    flex-wrap: wrap; /* Esto es lo que me permite que baje si no hay espacio*/
    gap: 10px;
  }
  
  /* el filto se expande para rellenar el ancho*/
  aside li { flex: 1; 
    text-align: center; }
}
```
Esto permite que:

- la barra lateral pase a la parte superior

- las tareas se adapten a pantallas pequeñas
### Bonus transiciones CSS
Añadiremos un efecto de transición al pasar el cursor sobre las tarjetas de tareas. 
```
.task {
transition: all 0.3s ease;
}

.task:hover {
transform: translateX(8px);
box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
```
Esto crea una interacción visual más fluida en la interfaz.

-----

### 5. Publicación del proyecto en Vercel 

El proyecto se publicó utilizando Vercel.

Pasos realizados:

- Subir el repositorio a GitHub.

- Conectar el repositorio con Vercel.

- Desplegar el proyecto automáticamente.

El resultado es una URL pública.
