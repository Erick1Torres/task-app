# Prompt engineering.

### Experimento 1: Experimenta con prompts donde definas un rol.

- **Prompt:** ```"Actúa como un Desarrollador Senior de Backend experto en Node.js. Genera una función para procesar pagos con tarjeta de crédito utilizando la librería Stripe"```
- Resultado:
```JavaScript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Procesa un pago de forma asíncrona.
 * Utiliza Idempotency Keys para evitar cargos duplicados.
 */
export const processPayment = async (amount, currency, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      standard_idempotency_key: `pay_${Date.now()}` // Práctica de Senior
    });
    return { success: true, id: paymentIntent.id };
  } catch (error) {
    console.error(`[Payment Error]: ${error.message}`);
    throw new Error('Payment failed at gateway');
  }
};
```
--------
### Experimento 2:Few-Shot Prompting.

- Prompt: Refactoriza funciones siguiendo estos ejemplos:

Entrada: ```function a(b) { return b * 2 }``` -> Salida: ```const doubleValue = (value) => value * 2;```

Entrada: ```function x(y, z) { return y + z }``` -> Salida: ```const addValues = (a, b) => a + b;```

Tarea: Refactoriza ```function calc(p, d) { return p - (p * d) }```

- Resultado
```JavaScript
const calculateDiscountedPrice = (price, discount) => price - (price * discount);
```
-----
### Experimento 3: Razonamiento Paso a Paso (Debugging)

- Prompt: "Tengo un error donde el total del carrito sale como '10050' en lugar de 150. Explica paso a paso por qué ocurre esto en JavaScript y cómo arreglarlo."

- Resultado:

- Identificación: El operador ```+``` en JavaScript sirve tanto para sumar números como para concatenar cadenas.

- Causa Raíz: Uno de los valores (probablemente el precio '100') es de tipo String. Al hacer ```'100' + 50```, JS prioriza la concatenación.

- Solución: Debes asegurar el tipo numérico usando ```Number()``` o el operador unario ```+```.

- Corrección:
```JavaScript
const total = Number(precio) + cantidad;
```
----
### Experimento 4: Restricciones Claras (Documentar).

- Prompt: "Documenta la función processPayment anterior. Restricciones: 1. Usa formato JSDoc. 2. No uses más de 50 palabras en la descripción. 3. Incluye una sección de 'Advertencia' sobre las llaves de API."

- Resultado:
```JavaScript
/**
 * @function processPayment
 * @description Ejecuta cobros mediante Stripe integrando validación y manejo de errores.
 * @param {number} amount - Monto en centavos.
 * Advertencia: Nunca expongas la STRIPE_SECRET_KEY en el frontend.
 */
```
-----

### Prompt Útiles:

#### 1. El Arquitecto de Sistemas (Definición de Rol)
**Prompt:** ```"Actúa como un Arquitecto de Soluciones Cloud con 20 años de experiencia. Diseña la infraestructura de servicios para una aplicación escalable de [TIPO DE APP]. Describe los componentes, la base de datos recomendada y justifica por qué esta arquitectura evitará cuellos de botella."```

- Por qué funciona: Al invocar una jerarquía alta ("Arquitecto de Soluciones"), la IA deja de dar respuestas genéricas y empieza a considerar factores como latencia, redundancia y costos, utilizando un lenguaje profesional y decisiones justificadas.

#### 2. El Transformador de Sintaxis (Few-Shot Prompting)
Prompt: ```"Convierte las siguientes funciones de ES5 a ES6+ siguiendo estos ejemplos: Input: function(a) { return a } -> Output: const fn = a => a; Input: var self = this; -> Output: (No necesario, usar arrow functions); Tarea: Convierte el siguiente bloque: [CÓDIGO]"```

- Por qué funciona: Los ejemplos (few-shot) eliminan la ambigüedad. La IA imita el patrón exacto de salida que necesitas, ahorrándote tiempo de corrección de estilo manual.

#### 3. El Debugger Analítico (Razonamiento Paso a Paso)
**Prompt:** ```"Analiza este error de ejecución: [ERROR]. No me des la solución de inmediato. Primero, explica paso a paso qué está pasando en la memoria y en el stack de ejecución de JavaScript. Segundo, identifica la línea exacta del fallo. Tercero, propón la corrección."```

- Por qué funciona: Obliga a la IA a realizar una simulación mental del código. Esto evita "parches" superficiales y te ayuda a entender la lógica subyacente del error, funcionando como una sesión de Pair Programming.

#### 4. El Auditor de Seguridad (Restricciones Claras)
**Prompt:** ```"Revisa este endpoint de Express. Restricciones: 1. Identifica solo vulnerabilidades críticas de OWASP. 2. No sugieras cambios estéticos, solo de seguridad. 3. La respuesta debe ser una lista numerada con el riesgo y la línea de código afectada."```

- Por qué funciona: Las restricciones negativas ("No sugieras...") son tan importantes como las positivas. Enfocan el poder de procesamiento de la IA en una sola tarea crítica, evitando el ruido informativo.

#### 5. El Generador de Pruebas (Edge Case Hunting)
**Prompt:** ```"Para la función adjunta, genera una suite de pruebas con Jest. Asegúrate de incluir: 1. Casos de éxito. 2. Casos de borde (null, undefined, tipos incorrectos). 3. Pruebas de estrés para arrays de más de 10,000 elementos. Razona por qué cada caso de borde es necesario."```

- Por qué funciona: La mayoría de los desarrolladores olvidan los edge cases. Al pedir razonamiento sobre ellos, la IA explora límites lógicos que a menudo pasamos por alto en el desarrollo inicial.

#### 6. El Documentador Automático (Estructura Rígida)
**Prompt:** ```"Genera la documentación técnica de este módulo. Formato obligatorio:```

Resumen

Firma de la Función

Diagrama de flujo lógico (en texto)

Notas de mantenimiento

Código: [CÓDIGO]"`

- Por qué funciona: Al definir los encabezados (##), aseguras que la documentación sea compatible con sistemas de lectura como GitHub Wiki o Notion, manteniendo un estándar en todo el repositorio.

#### 7. El Refactorizador de Rendimiento (Métricas Técnicas)
**Prompt:** ```"Refactoriza esta función para mejorar su complejidad temporal. Actualmente es O(n^2), intenta reducirla a O(n log n) o O(n). Explica el compromiso entre legibilidad y rendimiento que has tomado."```

- Por qué funciona: Al usar notación Big O, hablas el lenguaje matemático de la computación. Esto fuerza a la IA a usar estructuras de datos más eficientes (como Hash Maps en lugar de bucles anidados).

#### 8. El Mentor para Juniors (Simplificación de Conceptos)
**Prompt:** ```"Actúa como un mentor de programación. Explica qué es un 'Closure' en este código como si yo tuviera 10 años. Usa una analogía del mundo real y luego muestra un ejemplo de código extremadamente simple."```

- Por qué funciona: La capacidad de simplificar es la prueba definitiva de comprensión. Este prompt es excelente para incorporar nuevos miembros al equipo o entender librerías complejas.

#### 9. El Traductor de Stacks (Mapeo de Funcionalidades)
**Prompt:** ```"Estoy migrando de Python (Flask) a Node.js (Fastify). Traduce esta lógica de autenticación manteniendo las mismas medidas de seguridad. Explica qué librería de Node es el equivalente exacto a [LIBRERÍA PYTHON]."```

- Por qué funciona: Reduce la curva de aprendizaje al migrar proyectos, proporcionando equivalencias directas entre ecosistemas distintos.

#### 10. El Generador de Commits (Estándar de Mensajes)
**Prompt:** ```"Basado en los siguientes cambios de código, genera un mensaje de commit siguiendo el estándar 'Conventional Commits'. Debe incluir el tipo (feat, fix, docs), un título corto y un cuerpo explicando el 'porqué' y no el 'cómo'."```

- Por qué funciona: Mantiene el historial de Git limpio y profesional sin que el desarrollador tenga que dedicar tiempo mental a redactar cada cambio.
-------
