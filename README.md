# BI al día

Sitio estático educativo sobre fundamentos de Inteligencia de Negocios, un dashboard demostrativo aplicado a la LigaPro 2026 y un sílabo interactivo para la asignatura Sistemas de Información para la Inteligencia de Negocios. Está construido con HTML5, CSS3 y JavaScript ES6+, sin frameworks de aplicación, npm ni compilación. Bootstrap 5.3, Bootstrap Icons, Chart.js 4 y Google Fonts se cargan desde CDN, por lo que se necesita conexión a internet para esos recursos.

## Ejecutar

- En VS Code, abre `index.html` con la extensión Live Server.
- En Codespaces o en una terminal, desde la raíz del proyecto ejecuta:

```bash
python3 -m http.server 8000
```

Abre el puerto 8000 cuando Codespaces lo solicite. Las páginas son `index.html` (fundamentos y cuestionario), `ligapro.html` (folleto y dashboard) y `silabo.html` (sílabo interactivo).

## Archivos

- `index.html`: conceptos BI, pirámide DIKW, decisiones, ETL y cuestionario.
- `ligapro.html`: aplicación de BI al fútbol ecuatoriano, filtros, KPI y tabla interactiva.
- `silabo.html`: ficha visual e interactiva del sílabo, sus unidades, horas, evaluaciones, recursos y autoevaluación.
- `css/styles.css`: sistema visual responsive, temas claro/oscuro y animaciones con reducción de movimiento.
- `js/main.js`: preferencia de tema, revelado al desplazarse e interacciones ETL y Simon.
- `js/quiz-data.js`: banco de 22 preguntas de BI, decisiones y ETL.
- `js/quiz.js`: partidas, puntuación, vidas, temporizador, comodín, insignias y ranking local.
- `js/ligapro-data.js`: datos didácticos de 16 equipos y métricas ilustrativas.
- `js/ligapro.js`: KPI, gráficas Chart.js, filtros y posiciones interactivas.
- `js/silabo-data.js`: datos estructurados de la asignatura, unidades, evaluaciones, bibliografía y docente.
- `js/silabo.js`: renderizado, gráficas, calendario, búsqueda, habilidades interactivas y autoevaluación del sílabo.
- `img/bi-mark.svg`: isotipo original del sitio.

## Nota sobre datos

Las estadísticas del dashboard son ilustrativas, no oficiales. El dataset mantiene 30 partidos por equipo, calcula puntos como `3 × victorias + empates` y balancea goles a favor y en contra a nivel de torneo. Reemplaza sus valores por datos oficiales antes de usar el dashboard fuera de un contexto educativo.
