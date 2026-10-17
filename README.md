# Math Training RVA — S2B: registro individual y Teacher Hub

© 2026 Rene M. Velazquez Avila. Todos los derechos reservados.

## Contenido

- `index.html`: portada ilustrada original y siete bloques matemáticos; entrada manual y confirmación del código S2B.
- `student-sync.js`: autenticación anónima, reserva temporal de un código por sesión/equipo, renovación y envío automático de resultados.
- `teacher-hub.html`: Google docente, control de accesos, liberación individual o total, historial paginado, filtros, exportación CSV para Excel/Google Sheets y eliminación manual posterior a respaldo.
- `firestore.rules`: reglas actualizadas para `activeCodes`, `studentSessions` y compatibilidad con `teacherEvidence` existente.
- `firebase-config.js`: configuración web del proyecto Firebase existente.
- `math-training-welcome.webp`: imagen original de portada.

## Publicación: orden imprescindible

1. Haz una copia de seguridad del sitio actualmente publicado.
2. En `firestore.rules`, reemplaza **únicamente** `REPLACE_WITH_TEACHER_UID` por el UID de Google docente que ya funciona en tu Firebase. No publiques el marcador literal. **Estas reglas sustituyen las anteriores**; conservan lectura de registros antiguos y `teacherEvidence`.
3. En Firebase Console > Firestore Database > Rules, publica las reglas nuevas. Verifica que la autenticación anónima y Google sigan habilitadas.
4. Sube los archivos `index.html`, `student-sync.js`, `teacher-hub.html`, `firebase-config.js` y `math-training-welcome.webp` a la raíz del repositorio de GitHub Pages, sustituyendo las versiones anteriores. No es necesario subir el README ni las reglas a GitHub Pages.
5. Haz una prueba supervisada con YA01: entra, realiza un bloque, confirma la aparición del código y la sesión en Teacher Hub. En otro navegador intenta YA01: debe rechazarlo. Libera YA01 desde Teacher Hub y prueba la nueva entrada. Confirma que el historial anterior no desaparece.
6. Exporta a CSV, ábrelo en Excel o impórtalo en Google Sheets y comprueba las filas antes de considerar la opción de archivo/limpieza.

## Límites y advertencias

- El archivo CSV es compatible con Excel y Google Sheets; **no es un archivo nativo .xlsx ni crea automáticamente una hoja de Google Drive**.
- La exportación incluye los registros **cargados** y visibles con los filtros. Para exportar períodos extensos, pulsa «Cargar 200 más» hasta completar la consulta. No confundir el límite de página con capacidad de almacenamiento.
- «Archivar registros exportados» elimina los documentos seleccionados de Firebase solo después de una confirmación explícita; no comprueba técnicamente que el archivo se haya guardado o abierto. Debe seguirse la política escolar de conservación de datos.
- Los bloqueos tienen una caducidad aproximada de 3 minutos y se renuevan cada 45 segundos. Si un equipo pierde internet durante más tiempo, el código puede quedar disponible para otro. «Liberar acceso» invalida el acceso anterior sin borrar las evaluaciones.
- Los códigos son seudónimos, **no contraseñas ni una prueba de identidad**. Al tratarse de un sitio público con autenticación anónima, un tercero podría conocer un código y enviar datos falsos. Requiere supervisión, aprobación escolar y controles adicionales antes de considerarlo un sistema oficial de evaluación o cumplimiento de FERPA.
- Esta versión registra **resúmenes por sesión** (no las respuestas individuales de cada ejercicio en Firebase). El detalle de ejercicios permanece local en el navegador, sujeto a la política de almacenamiento local del equipo.
- La reconexión recupera la **reserva del código en el mismo navegador**, no restaura automáticamente ejercicios incompletos. No existe aún una cola persistente de envío si falla la conexión al finalizar: verifica el mensaje de sincronización.
- Se verificó sintaxis JavaScript y estructura de archivos localmente. **No se ha realizado prueba real de escritura/lectura en tu Firebase ni despliegue en GitHub Pages**.

## Códigos S2B

YA01 · WI02 · AD03 · EV04 · MI05 · HA06 · AU07 · AX08 · RM09 · RA10 · AS11 · ST12 · LU13 · NO14 · CH15 · LA16 · CO17 · AM18 · BE19
