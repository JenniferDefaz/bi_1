// Comportamientos compartidos por las dos páginas.
(() => {
  const root = document.documentElement;
  const themeKey = 'bi-al-dia-theme';

  function getSavedTheme() {
    try {
      return localStorage.getItem(themeKey);
    } catch (error) {
      return null;
    }
  }

  function setTheme(theme) {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = selectedTheme;
    root.setAttribute('data-bs-theme', selectedTheme);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const dark = selectedTheme === 'dark';
      button.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
      button.title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
      button.innerHTML = `<i class="bi ${dark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}" aria-hidden="true"></i><span>${dark ? 'Modo claro' : 'Modo oscuro'}</span>`;
    });
    try {
      localStorage.setItem(themeKey, selectedTheme);
    } catch (error) {
      // El tema sigue funcionando aunque el navegador no permita persistencia.
    }
    window.dispatchEvent(new CustomEvent('bi-theme-change', { detail: { theme: selectedTheme } }));
  }

  const savedTheme = getSavedTheme();
  const preferredTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  root.dataset.theme = preferredTheme;
  root.setAttribute('data-bs-theme', preferredTheme);
  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    const dark = preferredTheme === 'dark';
    button.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
    button.title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
    button.innerHTML = `<i class="bi ${dark ? 'bi-sun-fill' : 'bi-moon-stars-fill'}" aria-hidden="true"></i><span>${dark ? 'Modo claro' : 'Modo oscuro'}</span>`;
    button.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const phaseContent = {
    inteligencia: ['Inteligencia', 'Explorar el entorno para identificar y definir el problema. BI ayuda a detectar desviaciones y tendencias.'],
    diseno: ['Diseño', 'Formular alternativas, modelos y criterios para abordar el problema con la información disponible.'],
    eleccion: ['Elección', 'Comparar alternativas y seleccionar la opción que mejor responde a los objetivos y restricciones.'],
    implementacion: ['Implementación y revisión', 'Poner en práctica la decisión, medir sus efectos y revisar el resultado para aprender.']
  };
  const phaseButtons = Array.from(document.querySelectorAll('[data-phase]'));
  const phasePanel = document.querySelector('#phase-detail');

  function selectPhase(button, moveFocus = false) {
    const [title, description] = phaseContent[button.dataset.phase];
    phaseButtons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    phasePanel.setAttribute('aria-labelledby', button.id);
    phasePanel.innerHTML = `<h4 class="h5">${title}</h4><p class="mb-0">${description}</p>`;
    if (moveFocus) button.focus();
  }

  phaseButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectPhase(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % phaseButtons.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + phaseButtons.length) % phaseButtons.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = phaseButtons.length - 1;
      selectPhase(phaseButtons[nextIndex], true);
    });
  });

  const etlDescriptions = {
    fuentes: '<strong>Fuentes:</strong> sistemas transaccionales, archivos y servicios externos aportan los datos que necesita el análisis.',
    extraccion: '<strong>Extracción:</strong> se leen datos de las fuentes, de forma completa o incremental, con controles de acceso y trazabilidad.',
    staging: '<strong>Staging:</strong> zona temporal para recibir y revisar los datos antes de transformarlos, sin alterar las fuentes originales.',
    transformacion: '<strong>Transformación:</strong> se limpian, deduplican, estandarizan y validan registros; también se crean cálculos y agregaciones.',
    carga: '<strong>Carga:</strong> los datos preparados se insertan o actualizan en el destino, con controles para evitar duplicaciones.',
    almacen: '<strong>Data Warehouse / Data Mart:</strong> repositorios organizados para análisis histórico, integrados por tema o área del negocio.',
    analisis: '<strong>Reportes y dashboards:</strong> indicadores y visualizaciones presentan patrones, excepciones y contexto para actuar.'
  };
  const etlNodes = Array.from(document.querySelectorAll('[data-etl]'));
  const etlDetail = document.querySelector('#etl-detail');

  function selectEtl(node) {
    if (!etlDetail) return;
    etlNodes.forEach((item) => item.setAttribute('aria-pressed', String(item === node)));
    etlDetail.innerHTML = etlDescriptions[node.dataset.etl];
  }

  etlNodes.forEach((node) => {
    node.addEventListener('click', () => selectEtl(node));
    node.addEventListener('focus', () => selectEtl(node));
    node.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') selectEtl(node);
    });
  });
})();
