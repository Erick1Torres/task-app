# **Conectar servidores MCP**

## MCP

Es un estándar diseñado para que los modelos de inteligencia artificial puedan conectarse de forma estructurada y segura a herramientas, datos y servicios externos.

MCP define cómo una IA **“habla”** con el mundo exterior.

En lugar de integrar cada API o herramienta de forma personalizada, MCP crea un lenguaje común para que el modelo pueda:

- Consultar bases de datos
- Llamar APIs
- Usar herramientas (como calendarios, buscadores, código, etc.)
- Ejecutar acciones

## Configuración de MCP en cursor 
- Acceder a settings luego dirigirse a apartado que dice:
**Tools y MCP**, luego Clickear el boton Add custom MCP.

Eso creara un documento json que se vera de la siguiente manera:
```json
{
  "mcpServers": [
    {
      "name": "github",
      "type": "command",
      "command": "bash npx -y @modelcontextprotocol/server-github",
      "claves": ["GITHUB_PERSONAL_ACCESS_TOKEN"],
      "valores": ["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"]
    }
  ]
}
```
Esto le permite a la IA hacer muchas cosas como las de acontinuación:
- Acceder a datos externos.
- Ejecutar funciones concretas.
- Automatizar flujos de trabajo.
- Validar datos y parámetros.
- Respetar permisos.
- Explicar funciones existentes.
------

### Puebas 

Para comprobar que todo este bien realizaremos puebas.

- 1. ¿Qué archivos y carpetas hay en la raíz del proyecto?
La ia indentifico y los arcivos y las carpetas que estan en el repositorio

- 2. Qué hay dentro de docs/ y para qué sirve
la ia identifico todos los archivos que estaba dentro de la carpeta docs y ademas medio una breve esplicacion de lo que habia dentro de cada carpeta

- 3. Muéstrame el contenido de cursor/mcp.json y explícame qué configura.
no solo me enseño lo que hay dentro sino que tambien me explico el codigo desguesandolo por partes y explicando que es cada cosa

- 4. ¿Hay variables/secretos en archivos de configuración que no deberían estar en el repo?
esta parte de aqui es la que me ayudo demaciad ya que yo habia cometido el erro de enseñar mi api_key y la ia me enseño a como esconderlo y me explico porque tena que hacerlo.

- 5. Resume qué hace app.js y cuáles son sus funciones principales.
La ia me explico que hace cada variable y cada linea de codigo y que hacia cada una de ellas
----
### Casos reales donde el MCP pueda ser util
- Automatizar trabajo en GitHub
- Revisar PRs de forma inteligente
- Integración con herramientas internas
- Asistentes ‘con contexto’ y menos copy/paste
- Triaging de bugs



  
