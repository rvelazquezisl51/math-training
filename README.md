# Math Training RVA — sincronización automática (revisión 1)

© 2026 Rene M. Velazquez Avila. Todos los derechos reservados.

## Qué incluye

- `index.html`: portada y siete bloques conservados, con evento de fin de sesión.
- `student-sync.js`: guarda un resumen anónimo por sesión en `studentSessions` y muestra estado visible de envío.
- `teacher-hub.html`: acceso docente por Google y consulta de sesiones automáticas.
- `firebase-config.js`: configuración pública de Firebase Web.
- `firestore.rules`: reglas limitadas por colección y UID docente.
- `math-training-welcome.webp`, `evidence-export.js`: recursos requeridos.

## Instalación segura

1. Mantén una copia de los archivos actuales de GitHub.
2. Abre `firestore.rules`, sustituye `REPLACE_WITH_TEACHER_UID` por el UID de tu cuenta docente y publica esas reglas en Firebase Console > Firestore Database > Rules. No copies la cadena literal de ejemplo.
3. Comprueba que Google y Anónimo estén habilitados en Authentication.
4. Publica TODOS los archivos del ZIP en la raíz de tu repositorio GitHub Pages (no solo index.html).
5. Entra como estudiante de prueba y termina una sesión con al menos un ejercicio registrado. Debe aparecer el aviso de guardado en Firebase.
6. En `teacher-hub.html`, inicia sesión con Google y pulsa «Consultar sesiones automáticas».

## Límites y privacidad

- Se guardan resúmenes agregados de sesión, sin nombre, correo ni respuestas individuales. No permiten identificar el avance de cada alumno.
- Los registros anónimos pueden ser enviados por cualquier visitante del sitio público; las reglas validan formato, no garantizan pertenencia al aula ni evitan abuso automatizado. Usar como piloto supervisado, no como sistema de evaluación oficial.
- No se ha efectuado prueba de escritura real contra el proyecto Firebase ni prueba de extremo a extremo en GitHub.
- La sincronización requiere conexión a Internet y no dispone todavía de cola de reintentos.
