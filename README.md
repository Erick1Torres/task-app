# Taskflow Project

Este proyecto muestra cómo configurar un entorno básico de desarrollo usando Git, GitHub y Visual Studio Code.

---

## 1. Instalar Visual Studio Code

Descargar e instalar Visual Studio Code desde la página oficial:

https://code.visualstudio.com/

---

## 2. Instalación y configuración para Git

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
## 3. Crear una cuenta de github y un repositorio

- Ir a github
https://github.com
- Creas una cuenta
- Luego creas un repositorio donde dice New Repository
- Colocar el nombre en mi caso es "Task-app"
- Elegir la Opción Public
- Luego pulsar Create Repository

## 4. Crear el proyecto en el Ordenador 
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
## 5. Hacewr el primer commit
- Añadimos el archivo readme
```
git add README.md
```
- Crear el commit
```
  git commit -m "Mi Primer commit"
```
## 6. 
