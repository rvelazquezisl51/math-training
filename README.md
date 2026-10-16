# Math Training RVA — paquete GitHub Pages

**Autor y copyright:** © 2026 Rene M. Velazquez Avila. Todos los derechos reservados.

## Archivos
- `index.html`: versión matemática V6.7.0, siete bloques; evidencias guardadas localmente.
- `evidence-export.js`: exporta evidencias locales a JSON; no envía datos a Firebase.
- `teacher-hub.html`: visor y sincronizador docente de registros depurados (sin nombres ni respuestas).
- `firebase-config.js`: configuración pública de la aplicación web `math-training-rva`.
- `firestore.rules`: reglas propuestas para colección `teacherEvidence`.

## Antes de publicar
1. Conservar copia del repositorio anterior. Sustituir `index.html` y subir `evidence-export.js`, `teacher-hub.html`, `firebase-config.js`, `README.md` y `firestore.rules`. No borrar imágenes antiguas hasta confirmar que no son necesarias.
2. En Firebase Authentication, ya debe estar habilitado Google y autorizado `rvelazquezisl51.github.io`.
3. En `teacher-hub.html`, iniciar sesión con Google y copiar el **UID** que se muestra. Mientras las reglas estén cerradas, el login funciona pero las consultas/escrituras son denegadas.
4. En Firebase Console → Firestore → Reglas, **reemplazar** `REPLACE_WITH_TEACHER_UID` por ese UID en el contenido de `firestore.rules` y **publicar**. Esto habilita solo a ese UID a leer y crear registros depurados en `teacherEvidence`. No abrir reglas con `allow read, write: if true`.
5. Probar primero con registros ficticios y confirmar login, importación, guardado y lectura.

## Privacidad y limitaciones
- **No cargar nombres, identificadores, expedientes ni resultados reales de alumnos** sin autorización institucional. El Hub elimina campos adicionales al importar, pero la validación de privacidad debe ser revisada antes del uso escolar.
- No existe autenticación individual de estudiantes ni sincronización automática desde la actividad a Firestore. La exportación/importación es **manual** y la sincronización del Hub a Firestore está restringida al docente autorizado.
- No se ha realizado una prueba de extremo a extremo en navegador con Firebase ni auditoría pedagógica completa de los siete bloques. El paquete es una **versión candidata para pruebas**, no certificación de producción.
- El plan Spark gratuito tiene cuotas; no activar Blaze ni añadir facturación. Google/Firebase podrían requerir configurar condiciones adicionales para flujos de autenticación.
- No subir cuentas de servicio, claves privadas ni JSON con evidencias a GitHub. La configuración web `apiKey` es pública y no otorga acceso a datos por sí sola.
- La colección `teacherEvidence` usa solo operaciones de creación y lectura; no incluye borrado. La importación repetida genera duplicados: comprobar antes de repetir.
- `teacher-hub.html` se publica en una URL pública; el contenido del HTML es público, pero Firestore solo responde a un UID autorizado cuando las reglas se publican.

## Validación
1. Abrir `index.html` en GitHub Pages, ejecutar una sesión con datos ficticios y exportar JSON.
2. Abrir `teacher-hub.html`, iniciar sesión y verificar UID.
3. Publicar reglas restringidas a ese UID y probar carga de JSON, guardado y consulta.
4. Revisar cuotas y comprobar que el proyecto sigue en Spark.
