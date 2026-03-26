## Ecosistema de Desarrollo: Backend API
**Backend** se apoya en un stack de herramientas especializadas que garantizan su consumo, prueba, monitoreo y documentación.
---

### 1. Axios (Cliente HTTP)
Es una librería basada en promesas para realizar peticiones HTTP tanto en el navegador como en Node.js. Es la alternativa profesional a la Fetch API nativa.

##### para que se usa?

- Transformación Automática: Convierte automáticamente los datos a JSON (en `fetch` debes hacer `.json())`.

- Interceptores: Permite ejecutar código antes de que una petición salga o antes de que una respuesta llegue (ideal para inyectar tokens de seguridad o manejar errores globales).

- Soporte de Navegadores: Tiene una compatibilidad mucho más amplia con navegadores antiguos.

- Cancelación de Peticiones: Permite abortar una petición si el usuario cambia de página, optimizando el rendimiento.

---

### 2. Postman (Testing y Depuración).

Es una plataforma colaborativa para el diseño, construcción y prueba de APIs. Es el "navegador" de los desarrolladores de backend.

##### para que se usa?

- Pruebas sin Frontend: Permite probar tus endpoints de Node.js antes de haber programado una sola línea de HTML/JS.

- Colecciones: Puedes agrupar tus rutas (`GET`, `POST`, `PUT`) y compartirlas con otros desarrolladores.

- Variables de Entorno: Permite cambiar fácilmente entre `localhost:3000` (desarrollo) y `api.tuweb.com` (producción) con un solo clic.

- Automatización: Puedes escribir scripts de prueba para verificar que el servidor siempre responda un `200 OK`.

---

### 3. Swagger / OpenAPI (Documentación)
Es un conjunto de herramientas que ayudan a diseñar, construir y documentar APIs REST siguiendo el estándar OpenAPI.

##### para que se usa?

- Documentación Viva: Genera una página web interactiva donde los usuarios pueden ver qué datos recibe cada endpoint y probarlos directamente desde el navegador.

- Contrato de API: Sirve como el "manual de instrucciones" oficial entre el desarrollador de Backend y el de Frontend.

- Estandarización: Sigue reglas internacionales, lo que hace que cualquier desarrollador del mundo entienda cómo funciona tu API rápidamente.

### 4. Sentry (Monitoreo de Errores)
Es una plataforma de monitoreo de errores en tiempo real que te avisa cuando algo se rompe en tu código de producción.

##### para que se usa?

- Alertas Proactivas: Si un usuario intenta crear una tarea y el servidor falla (Error 500), Sentry te envía un correo o mensaje de Slack inmediatamente con el error exacto.

- Rastreo de Stack Trace: Te dice exactamente en qué línea de qué archivo ocurrió el fallo, incluso si el código está minificado.

- Contexto del Usuario: Te informa qué navegador usaba el usuario, qué sistema operativo tenía y qué pasos hizo antes de que ocurriera el error.
