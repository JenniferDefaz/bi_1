// Información académica del sílabo en estructuras reutilizables para la página.
const SILABO_DATA = {
  institution: 'Universidad Técnica de Cotopaxi – Sede Latacunga',
  faculty: 'Ciencias de la Ingeniería y Aplicadas',
  career: 'Sistemas de Información',
  course: 'Sistemas de Información para la Inteligencia de Negocios',
  code: 'ISISI805',
  cycle: '8.º',
  parallel: 'A',
  courseType: 'Normal',
  credits: 3,
  period: { start: '2026-10-12', end: '2027-02-21', label: '12/10/2026 al 21/02/2027' },
  hours: { docencia: 48, practicas: 48, autonomas: 48, total: 144 },
  teacher: { name: 'Ing. Luis René Quisaguano Collaguazo, MSc.', email: 'luis.quisaguano1@utc.edu.ec' },
  description: 'La asignatura pertenece a la unidad de organización curricular profesional y analiza los fundamentos, características y modelamiento de la inteligencia de negocios para apoyar la toma de decisiones empresariales basadas en información obtenida del procesamiento de datos con software especializado. Se centra en reunir, almacenar, analizar y visualizar información para que las organizaciones identifiquen oportunidades de negocio integrando reportes de alto nivel de sus distintas áreas.',
  graduateContribution: 'Construir procesos de extracción, combinación, depuración y distribución de la información a los usuarios finales, clave en organizaciones con grandes volúmenes de datos que deben analizarse de forma sistematizada para apoyar decisiones inteligentes.',
  objective: 'Analizar los principales conceptos de los fundamentos, características y modelamiento de la inteligencia de negocios para entender cómo implementar estas herramientas en una organización, describiendo detalladamente las etapas necesarias para su correcta ejecución.',
  units: [
    {
      number: 1,
      title: 'Fundamentos y gestión de la Inteligencia de Negocios',
      problem: 'La gestión de la inteligencia de negocios requiere conocer los fundamentos, herramientas y componentes de BI.',
      outcome: 'Identificar los conceptos básicos, herramientas y componentes de la inteligencia de negocios aplicando herramientas de BI.',
      methodology: {
        name: 'Aprendizaje Cooperativo',
        explanation: 'Aprender en grupo formando comunidades de aprendizaje donde cada integrante asume funciones específicas para una meta común.'
      },
      topics: [
        { name: 'Conceptos básicos', docencia: 3, practicas: 3, href: 'index.html#que-es-bi', linkLabel: 'Repasar' },
        { name: 'Componentes de la Inteligencia de Negocios', docencia: 3, practicas: 3 },
        { name: 'Los sistemas de información y la generación de valor, ventaja corporativa', docencia: 3, practicas: 3 },
        { name: 'Principales herramientas de la Inteligencia de Negocios', docencia: 6, practicas: 6 }
      ],
      autonomousHours: 15,
      strategies: ['Cuadro comparativo', 'Debate', 'Lluvia de ideas', 'Mapa mental', 'Mentefactos', 'Preguntas'],
      assessment: { method: 'Redacción de ensayos, informes, reportes, artículos académicos', instrument: 'Rúbrica' },
      environments: ['Aula física', 'Aula virtual', 'Laboratorio']
    },
    {
      number: 2,
      title: 'Sistemas de soporte a la administración y Data Warehouse',
      problem: 'Dificultad para analizar el uso de bases de datos multidimensionales para la toma de decisiones.',
      outcome: 'Explotar esquemas de bases de datos multidimensionales usando herramientas de visualización, análisis y consultas con una adecuada administración.',
      methodology: {
        name: 'Aprendizaje Basado en Problemas',
        explanation: 'Enfoque inductivo: se aprende resolviendo problemas reales y complejos, similares a los del escenario profesional.'
      },
      topics: [
        { name: 'Variables de medición y análisis', docencia: 3, practicas: 3 },
        { name: 'Data Warehouse', docencia: 6, practicas: 6 },
        { name: 'Sistemas de gestión del conocimiento', docencia: 3, practicas: 3 },
        { name: 'Patrones: evaluación / interpretación / visualización', docencia: 3, practicas: 3 }
      ],
      autonomousHours: 15,
      strategies: ['Práctica de laboratorio', 'Resolución de ejercicios', 'Simulación'],
      assessment: { method: 'Portafolio', instrument: 'Lista de cotejo' },
      environments: ['Aula física', 'Aula virtual', 'Laboratorio']
    },
    {
      number: 3,
      title: 'Sistema de soporte para toma de decisiones empresariales',
      problem: 'Evaluar los objetivos de negocio implica implementar procesos para organizar grandes cantidades de datos.',
      outcome: 'Construir una solución de inteligencia de negocios para un caso práctico modelando la información organizacional.',
      methodology: {
        name: 'Aprendizaje Basado en Proyectos',
        explanation: 'Parte de una situación real que motiva a los estudiantes a generar hipótesis, investigar y desarrollar propuestas innovadoras uniendo teoría y práctica.'
      },
      topics: [
        { name: 'Vistas multidimensionales – hipercubos de datos', docencia: 3, practicas: 3 },
        { name: 'Procesos ETL', docencia: 3, practicas: 3, href: 'index.html#etl', linkLabel: 'Repasar' },
        { name: 'Reporteadores', docencia: 6, practicas: 6 },
        { name: 'Alertas, tableros de control (dashboards) e indicadores clave de desempeño (KPI) – aspectos técnicos del proyecto', docencia: 6, practicas: 6, href: 'ligapro.html#dashboard', linkLabel: 'Ver dashboard' }
      ],
      autonomousHours: 18,
      strategies: ['Juego de roles', 'Lluvia de ideas', 'Mesa redonda', 'Redacción de informes', 'Salida de campo'],
      assessment: { method: 'Proyectos', instrument: 'Rúbrica' },
      environments: ['Aula física', 'Aula virtual', 'Laboratorio', 'Territorio']
    }
  ],
  softSkills: [
    { name: 'Competencia digital', icon: 'bi-laptop', definition: 'Uso crítico, responsable y eficiente de herramientas digitales.', development: 'Usando herramientas de BI, bases multidimensionales, ETL, reporteadores y dashboards.' },
    { name: 'Creatividad', icon: 'bi-lightbulb', definition: 'Proponer ideas innovadoras.', development: 'Diseñando soluciones de BI originales, desde la selección de variables y el modelado hasta dashboards e indicadores.' },
    { name: 'Ética', icon: 'bi-shield-check', definition: 'Actuar con responsabilidad, justicia y valores.', development: 'Manejando datos sensibles de forma veraz y transparente, evitando sesgos y respetando privacidad y confidencialidad.' },
    { name: 'Liderazgo', icon: 'bi-people', definition: 'Orientar y motivar equipos.', development: 'Asumiendo el rol de líder técnico de una solución de BI, coordinando, delegando y comunicando hallazgos a nivel gerencial.' },
    { name: 'Pensamiento crítico', icon: 'bi-search', definition: 'Juzgar información con evidencias.', development: 'Evaluando la calidad de los datos, interpretando patrones y cuestionando la validez de los indicadores.' },
    { name: 'Resolución de problemas', icon: 'bi-puzzle', definition: 'Responder a situaciones reales.', development: 'Organizando grandes volúmenes de datos, aplicando ETL y diseñando dashboards o reportes que resuelvan el problema.' }
  ],
  evaluations: [
    { name: 'EVAL1', date: '2026-11-22T23:59:00', label: '22/11/2026 · 23:59' },
    { name: 'EVAL2', date: '2027-01-10T23:59:00', label: '10/01/2027 · 23:59' },
    { name: 'EVAL3', date: '2027-02-14T23:59:00', label: '14/02/2027 · 23:59' }
  ],
  project: {
    name: 'PlasTrack – Monitoreo inteligente de microplásticos mediante datos Copernicus para la conservación de ecosistemas insulares',
    description: 'La asignatura aporta los fundamentos para transformar grandes volúmenes de datos satelitales (Copernicus, CMEMS) en información estratégica: diseño de dashboards, KPI y sistemas de alerta temprana que convierten detecciones de microplásticos en reportes visuales para el sector pesquero (CEIPA) y gestores ambientales.',
    flow: ['Datos satelitales', 'ETL', 'KPI', 'Dashboard', 'Alerta temprana']
  },
  bibliography: [
    {
      group: 'Bibliografía básica',
      books: [
        { title: '¿Cómo planificar un proyecto de inteligencia de negocio?', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/58548' },
        { title: 'Base de datos', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/121283' },
        { title: 'La toma de decisiones en la práctica', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/227386' },
        { title: 'Excel y Power BI: el cóctel perfecto', url: 'https://elibro.net/es/lc/utcotopaxi/titulos/282827' }
      ]
    },
    {
      group: 'Bibliografía complementaria',
      books: [
        { title: 'Introducción al Business Intelligence', url: 'http://cursos.yura.website/wp-content/uploads/2020/03/Introduccion_al_Business_Intelligence.pdf' },
        { title: 'Análisis comparativo de herramientas web para la generación de visualizaciones interactivas', url: 'https://dialnet.unirioja.es/servlet/articulo?codigo=10387164' },
        { title: 'Desarrollo de inteligencia empresarial: análisis comparativo entre Power BI y Qlik Sense en tableros estratégicos de indicadores clave', url: 'http://technologyrain.com.ar/index.php/trj/article/view/30' }
      ]
    },
    {
      group: 'Sitios web recomendados',
      books: [
        { title: 'Aplicación de tecnologías .NET y Chart.js para el desarrollo de un tablero de indicadores clave', url: 'https://ecuciencia.utc.edu.ec/media/articulo/articulo-005-corregido.pdf' },
        { title: 'Inteligencia de negocios como alternativa de generación de valor y ventaja competitiva en las microempresas', url: 'https://investigacion.utc.edu.ec/index.php/ciya/es/article/view/391' },
        { title: 'Documentación oficial de Power BI', url: 'https://learn.microsoft.com/es-es/power-bi/' }
      ]
    }
  ],
  teacherProfile: {
    education: [
      'Magíster en Sistemas de Información (UTC, cuarto nivel)',
      'Ingeniero en Informática y Sistemas (UTC, tercer nivel)'
    ],
    experience: [
      'Docente a tiempo completo y profesor a tiempo parcial en la UTC',
      'Analista de Tecnologías de la Información y Comunicación en el GAD Municipal del Cantón Mejía',
      'Desarrollador de software en Evolution Soft',
      'Gerente de Rebian Software'
    ]
  },
  quiz: [
    {
      question: '¿Qué metodología aplica la Unidad 2?',
      options: ['Aprendizaje Cooperativo', 'Aprendizaje Basado en Problemas', 'Aprendizaje Basado en Proyectos'],
      answer: 1,
      feedback: 'La Unidad 2 aplica Aprendizaje Basado en Problemas.'
    },
    {
      question: '¿Cuántos créditos tiene la asignatura?',
      options: ['2 créditos', '3 créditos', '4 créditos'],
      answer: 1,
      feedback: 'La asignatura tiene 3 créditos.'
    },
    {
      question: '¿En qué unidad se estudian los procesos ETL?',
      options: ['Unidad 1', 'Unidad 2', 'Unidad 3'],
      answer: 2,
      feedback: 'Los procesos ETL forman parte de la Unidad 3.'
    },
    {
      question: '¿Cuándo es la EVAL2?',
      options: ['22/11/2026', '10/01/2027', '14/02/2027'],
      answer: 1,
      feedback: 'La EVAL2 es el 10/01/2027 a las 23:59.'
    },
    {
      question: '¿Cómo se evalúa la Unidad 3?',
      options: ['Portafolio / Lista de cotejo', 'Proyectos / Rúbrica', 'Ensayo / Examen'],
      answer: 1,
      feedback: 'La Unidad 3 se evalúa mediante proyectos con rúbrica.'
    }
  ]
};
