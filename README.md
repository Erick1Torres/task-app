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
### 5. Haceer el primer commit
- Añadimos el archivo readme
```
git add README.md
```
- Crear el commit
```
  git commit -m "Mi Primer commit"
```
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
### 7 Añadir colaborador 
Este paso no es necesario si tu github es personalmente tuyo en mi caso es un proyecto de practicas
- Entrar en el repositorio de github
- Ir a settings
- Collaborators
- pulsar add people
- Añadir colaborador ejemplo: nombre-empresa.com
-----
Eso serian todos los pasos a segir para el la creacion del contenedor del proyecto 

# Proyecto con HTML y CSS

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

