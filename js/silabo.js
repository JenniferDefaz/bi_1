// Renderizado, gráficas e interacciones de la página del sílabo.
(() => {
  if (typeof SILABO_DATA === 'undefined') return;

  const data = SILABO_DATA;
  const numberFormat = new Intl.NumberFormat('es-EC');
  const charts = {};

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function renderHero() {
    setText('#silabo-title', data.course);
    setText('#hero-code', data.code);
    setText('#hero-cycle', `Ciclo ${data.cycle} · Paralelo ${data.parallel} · Curso ${data.courseType}`);
    setText('#hero-period', data.period.label);
    setText('#hero-institution', data.institution);
  }

  function renderTechnicalSheet() {
    const items = [
      { icon: 'bi-mortarboard', label: 'Carrera', value: data.career },
      { icon: 'bi-building', label: 'Facultad', value: data.faculty },
      { icon: 'bi-award', label: 'Créditos', value: String(data.credits) },
      { icon: 'bi-people', label: 'Paralelo', value: data.parallel },
      { icon: 'bi-calendar3', label: 'Período académico', value: data.period.label },
      { icon: 'bi-person-badge', label: 'Docente', value: data.teacher.name }
    ];
    document.querySelector('#technical-grid').innerHTML = items.map((item) => `<div class="col-sm-6 col-xl-4 silabo-reveal"><article class="surface technical-card"><span class="icon-box"><i class="bi ${item.icon}" aria-hidden="true"></i></span><span class="technical-label">${item.label}</span><strong>${escapeHtml(item.value)}</strong></article></div>`).join('');

    const hourItems = [
      { key: 'docencia', label: 'Docencia', icon: 'bi-easel' },
      { key: 'practicas', label: 'Prácticas', icon: 'bi-tools' },
      { key: 'autonomas', label: 'Autónomas', icon: 'bi-person-workspace' },
      { key: 'total', label: 'Total', icon: 'bi-clock-history' }
    ];
    document.querySelector('#hours-counters').innerHTML = hourItems.map((item) => `<div class="col-6 col-lg-3 silabo-reveal"><article class="hours-counter"><span><i class="bi ${item.icon}" aria-hidden="true"></i> ${item.label}</span><strong data-hour-count="${data.hours[item.key]}">0</strong><small>horas</small></article></div>`).join('');
    animateCounters();
  }

  function renderPurpose() {
    const content = [
      { icon: 'bi-info-circle', label: 'Descripción', text: data.description },
      { icon: 'bi-signpost-split', label: 'Aporte al perfil de egreso', text: data.graduateContribution },
      { icon: 'bi-bullseye', label: 'Objetivo general', text: data.objective }
    ];
    document.querySelector('#purpose-cards').innerHTML = content.map((item) => `<div class="col-lg-4 silabo-reveal"><article class="surface purpose-card"><span class="icon-box"><i class="bi ${item.icon}" aria-hidden="true"></i></span><h3>${item.label}</h3><p>${escapeHtml(item.text)}</p></article></div>`).join('');
  }

  function animateCounters() {
    document.querySelectorAll('[data-hour-count]').forEach((node) => {
      const target = Number(node.dataset.hourCount);
      const start = performance.now();
      const duration = 900;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        node.textContent = numberFormat.format(Math.round(target * (1 - (1 - progress) ** 3)));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function renderUnitTabs() {
    const tabs = document.querySelector('#unit-tabs');
    const panels = document.querySelector('#unit-panels');
    tabs.innerHTML = data.units.map((unit, index) => `<button class="unit-tab" type="button" role="tab" id="unit-tab-${index + 1}" aria-controls="unit-panel-${index + 1}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-unit-index="${index}">Unidad ${unit.number}</button>`).join('');
    panels.innerHTML = data.units.map((unit, index) => {
      const hours = unit.topics.reduce((sum, topic) => sum + topic.docencia + topic.practicas, 0) + unit.autonomousHours;
      const docencia = unit.topics.reduce((sum, topic) => sum + topic.docencia, 0);
      const practicas = unit.topics.reduce((sum, topic) => sum + topic.practicas, 0);
      const weight = hours / data.hours.total * 100;
      const rows = unit.topics.map((topic) => `<tr><th scope="row">${escapeHtml(topic.name)}${topic.href ? `<a class="topic-review-link" href="${escapeHtml(topic.href)}" aria-label="${escapeHtml(topic.linkLabel)}: ${escapeHtml(topic.name)}"><i class="bi bi-box-arrow-up-right" aria-hidden="true"></i><span>${escapeHtml(topic.linkLabel)}</span></a>` : ''}</th><td>${topic.docencia}</td><td>${topic.practicas}</td></tr>`).join('');
      return `<section class="unit-panel" id="unit-panel-${index + 1}" role="tabpanel" aria-labelledby="unit-tab-${index + 1}" tabindex="0"${index === 0 ? '' : ' hidden'}>
        <article class="surface unit-overview"><div class="unit-title-row"><div><span class="eyebrow">Unidad ${unit.number} · ${hours} horas</span><h3>${escapeHtml(unit.title)}</h3></div><span class="unit-weight-label">${weight.toFixed(1)}% del curso</span></div>
          <div class="progress unit-progress" role="progressbar" aria-label="Peso de la unidad ${unit.number} en el total de horas" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${weight.toFixed(1)}"><div class="progress-bar" style="width:${weight}%"></div></div>
          <div class="row g-3 mt-2"><div class="col-lg-6"><div class="unit-fact"><strong>Problema profesional</strong><p>${escapeHtml(unit.problem)}</p></div></div><div class="col-lg-6"><div class="unit-fact"><strong>Resultado de aprendizaje</strong><p>${escapeHtml(unit.outcome)}</p></div></div><div class="col-12"><div class="method-card"><span class="icon-box"><i class="bi bi-diagram-3" aria-hidden="true"></i></span><div><strong>${escapeHtml(unit.methodology.name)}</strong><p>${escapeHtml(unit.methodology.explanation)}</p></div></div></div></div>
          <div class="table-responsive unit-table-wrap"><table class="table table-custom mb-0"><caption class="caption-top">Temas y horas por componente</caption><thead><tr><th scope="col">Tema</th><th scope="col">Docencia</th><th scope="col">Prácticas</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><th scope="row">Subtotal de temas</th><td>${docencia}</td><td>${practicas}</td></tr><tr><th scope="row">Horas autónomas de la unidad</th><td colspan="2">${unit.autonomousHours}</td></tr></tfoot></table></div>
          <div class="unit-meta-grid"><div><h4>Estrategias</h4><div class="silabo-badges">${unit.strategies.map((strategy) => `<span class="silabo-badge">${escapeHtml(strategy)}</span>`).join('')}</div></div><div><h4>Evaluación</h4><p><strong>${escapeHtml(unit.assessment.method)}</strong><br><span class="text-muted-custom">Instrumento: ${escapeHtml(unit.assessment.instrument)}</span></p></div><div><h4>Ambientes</h4><div class="silabo-badges">${unit.environments.map((environment) => `<span class="silabo-badge silabo-badge--muted">${escapeHtml(environment)}</span>`).join('')}</div></div></div>
          <div class="unit-total-row"><span>Distribución de horas de la unidad</span><strong>Docencia ${docencia} · Prácticas ${practicas} · Autónomas ${unit.autonomousHours} · Total ${hours}</strong></div>
        </article>
      </section>`;
    }).join('');

    const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    function activateTab(index, moveFocus = false) {
      tabButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        panels.querySelector(`#unit-panel-${buttonIndex + 1}`).hidden = !active;
      });
      if (moveFocus) tabButtons[index].focus();
    }
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => activateTab(index));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabButtons.length) % tabButtons.length;
        activateTab(next, true);
      });
    });
  }

  function getChartPalette() {
    const styles = getComputedStyle(document.documentElement);
    const value = (name) => styles.getPropertyValue(name).trim();
    return {
      brand: value('--brand'),
      mutedBrand: value('--brand-strong'),
      coral: value('--coral'),
      gold: value('--gold'),
      ink: value('--chart-text'),
      grid: value('--chart-grid'),
      surface: value('--surface'),
      units: [value('--silabo-u1'), value('--silabo-u2'), value('--silabo-u3')]
    };
  }

  function renderCharts() {
    if (typeof Chart === 'undefined') return;
    Object.values(charts).forEach((chart) => chart.destroy());
    const palette = getChartPalette();
    const topicRecords = data.units.flatMap((unit, unitIndex) => unit.topics.map((topic) => ({ ...topic, unit: unit.number, color: palette.units[unitIndex] })));
    document.querySelector('#topic-legend').innerHTML = data.units.map((unit, index) => `<span><i style="--unit-color:${palette.units[index]}" aria-hidden="true"></i>Unidad ${unit.number}</span>`).join('');
    const commonPlugins = {
      legend: { labels: { color: palette.ink, usePointStyle: true, boxWidth: 10, padding: 16 } },
      tooltip: { backgroundColor: palette.surface, titleColor: palette.ink, bodyColor: palette.ink, borderColor: palette.grid, borderWidth: 1 }
    };
    charts.doughnut = new Chart(document.querySelector('#hours-doughnut'), {
      type: 'doughnut',
      data: { labels: ['Docencia', 'Prácticas', 'Autónomas'], datasets: [{ data: [data.hours.docencia, data.hours.practicas, data.hours.autonomas], backgroundColor: [palette.brand, palette.gold, palette.coral], borderColor: palette.surface, borderWidth: 3, hoverOffset: 7 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: commonPlugins }
    });
    charts.units = new Chart(document.querySelector('#hours-units'), {
      type: 'bar',
      data: {
        labels: data.units.map((unit) => `Unidad ${unit.number}`),
        datasets: [
          { label: 'Docencia', data: data.units.map((unit) => unit.topics.reduce((sum, topic) => sum + topic.docencia, 0)), backgroundColor: palette.brand, borderRadius: 3 },
          { label: 'Prácticas', data: data.units.map((unit) => unit.topics.reduce((sum, topic) => sum + topic.practicas, 0)), backgroundColor: palette.gold, borderRadius: 3 },
          { label: 'Autónomas', data: data.units.map((unit) => unit.autonomousHours), backgroundColor: palette.coral, borderRadius: 3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: commonPlugins, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: palette.ink } }, y: { stacked: true, beginAtZero: true, grid: { color: palette.grid }, ticks: { color: palette.ink, stepSize: 5 } } } }
    });
    const topicCanvas = document.querySelector('#hours-topics');
    topicCanvas.height = Math.max(470, topicRecords.length * 38);
    charts.topics = new Chart(topicCanvas, {
      type: 'bar',
      data: { labels: topicRecords.map((topic) => topic.name), datasets: [{ label: 'Horas de docencia', data: topicRecords.map((topic) => topic.docencia), backgroundColor: topicRecords.map((topic) => topic.color), borderRadius: 3, barThickness: 19 }] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { ...commonPlugins, legend: { display: false }, tooltip: { ...commonPlugins.tooltip, callbacks: { afterLabel: (context) => `Unidad ${topicRecords[context.dataIndex].unit}` } } },
        scales: {
          x: { beginAtZero: true, max: 7, grid: { color: palette.grid }, ticks: { color: palette.ink, stepSize: 1 }, title: { display: true, text: 'Horas de docencia', color: palette.ink } },
          y: { grid: { display: false }, ticks: { color: palette.ink, autoSkip: false, font: { size: 11 }, callback(value) { const label = this.getLabelForValue(value); const words = label.split(' '); const lines = []; let line = ''; words.forEach((word) => { if (`${line} ${word}`.trim().length > 26 && line) { lines.push(line); line = word; } else line = `${line} ${word}`.trim(); }); if (line) lines.push(line); return lines; } } }
        }
      }
    });
  }

  function renderTimeline() {
    const start = new Date(`${data.period.start}T00:00:00`);
    const end = new Date(`${data.period.end}T23:59:59`);
    const now = new Date();
    const totalDuration = end - start;
    const progress = Math.min(100, Math.max(0, (now - start) / totalDuration * 100));
    const upcoming = data.evaluations.find((evaluation) => new Date(evaluation.date) >= now);
    const progressBar = document.querySelector('#period-progress');
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress.toFixed(1));
    setText('#period-percent', `${progress.toFixed(0)}% transcurrido`);
    setText('#calendar-status', now < start ? 'El período aún no comienza.' : now > end ? 'El período académico ha finalizado.' : 'Porcentaje calculado sobre las fechas del período académico.');

    if (upcoming) {
      setText('#next-evaluation-title', upcoming.name);
      setText('#next-evaluation-date', upcoming.label);
    } else {
      setText('#next-evaluation-title', 'Período concluido');
      setText('#next-evaluation-date', 'No quedan evaluaciones pendientes.');
    }

    document.querySelector('#evaluation-timeline').innerHTML = data.evaluations.map((evaluation) => {
      const evaluationDate = new Date(evaluation.date);
      const position = Math.min(100, Math.max(0, (evaluationDate - start) / totalDuration * 100));
      const completed = now >= evaluationDate;
      return `<div class="timeline-event${completed ? ' is-complete' : ''}" style="--event-position:${position}%"><span class="timeline-dot" aria-hidden="true"><i class="bi ${completed ? 'bi-check-lg' : 'bi-calendar-event'}"></i></span><strong>${evaluation.name}</strong><time datetime="${evaluation.date}">${evaluation.label}</time><span class="timeline-state">${completed ? 'Completada' : 'Pendiente'}</span></div>`;
    }).join('');
    updateCountdown();
  }

  function updateCountdown() {
    const nextEvaluation = data.evaluations.find((evaluation) => new Date(evaluation.date) >= new Date());
    const node = document.querySelector('#countdown');
    if (!nextEvaluation) {
      node.innerHTML = '<span class="countdown-ended">Todas las evaluaciones están completadas.</span>';
      return;
    }
    const remaining = Math.max(0, new Date(nextEvaluation.date) - new Date());
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor(remaining % 86400000 / 3600000);
    const minutes = Math.floor(remaining % 3600000 / 60000);
    node.innerHTML = `<div><strong>${days}</strong><span>días</span></div><div><strong>${hours}</strong><span>horas</span></div><div><strong>${minutes}</strong><span>minutos</span></div>`;
  }

  function renderSkills() {
    document.querySelector('#skills-grid').innerHTML = data.softSkills.map((skill, index) => `<div class="col-sm-6 col-xl-4 silabo-reveal"><button class="skill-flip" type="button" aria-label="${escapeHtml(skill.name)}: mostrar descripción" aria-expanded="false" data-skill-index="${index}"><span class="skill-flip-inner"><span class="skill-face skill-face-front"><span class="skill-icon"><i class="bi ${skill.icon}" aria-hidden="true"></i></span><strong>${escapeHtml(skill.name)}</strong><span class="skill-hint">Activar para conocer su aplicación</span></span><span class="skill-face skill-face-back" aria-hidden="true" inert><strong>${escapeHtml(skill.name)}</strong><span>${escapeHtml(skill.definition)}</span><span class="skill-development"><b>En la asignatura</b>${escapeHtml(skill.development)}</span></span></span></button></div>`).join('');
    document.querySelectorAll('.skill-flip').forEach((button) => {
      button.addEventListener('click', () => {
        const flipped = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(flipped));
        button.setAttribute('aria-label', `${data.softSkills[button.dataset.skillIndex].name}: ${flipped ? 'ocultar descripción' : 'mostrar descripción'}`);
        button.querySelector('.skill-face-front').setAttribute('aria-hidden', String(flipped));
        button.querySelector('.skill-face-front').toggleAttribute('inert', flipped);
        button.querySelector('.skill-face-back').setAttribute('aria-hidden', String(!flipped));
        button.querySelector('.skill-face-back').toggleAttribute('inert', !flipped);
      });
    });
  }

  function renderProject() {
    setText('#project-title', data.project.name);
    setText('#project-description', data.project.description);
    document.querySelector('#project-flow').innerHTML = data.project.flow.map((step, index) => `<div class="project-flow-step"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(step)}</strong></div>`).join('');
  }

  function renderBibliography() {
    document.querySelector('#bibliography-groups').innerHTML = data.bibliography.map((group, groupIndex) => `<div class="col-lg-4 bibliography-group" data-bibliography-group="${groupIndex}"><article class="surface bibliography-card"><h3>${escapeHtml(group.group)}</h3><ul>${group.books.map((book) => `<li data-bibliography-title="${escapeHtml(book.title.toLocaleLowerCase('es'))}"><a href="${escapeHtml(book.url)}" target="_blank" rel="noopener"><span>${escapeHtml(book.title)}</span><i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></li>`).join('')}</ul></article></div>`).join('');
    document.querySelector('#bibliography-filter').addEventListener('input', (event) => {
      const query = event.target.value.trim().toLocaleLowerCase('es');
      let visibleCount = 0;
      document.querySelectorAll('[data-bibliography-title]').forEach((item) => {
        const visible = item.dataset.bibliographyTitle.includes(query);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      document.querySelectorAll('[data-bibliography-group]').forEach((group) => {
        group.hidden = !group.querySelector('[data-bibliography-title]:not([hidden])');
      });
      document.querySelector('#bibliography-empty').classList.toggle('d-none', visibleCount > 0);
    });
  }

  function renderTeacher() {
    setText('#teacher-name', data.teacher.name);
    setText('#teacher-email', data.teacher.email);
    const contact = document.querySelector('#teacher-contact');
    contact.href = `mailto:${data.teacher.email}`;
    document.querySelector('#teacher-education').innerHTML = data.teacherProfile.education.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    document.querySelector('#teacher-experience').innerHTML = data.teacherProfile.experience.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }

  function renderQuiz() {
    document.querySelector('#silabo-quiz').innerHTML = data.quiz.map((question, questionIndex) => `<fieldset class="silabo-question" data-question-index="${questionIndex}"><legend><span>${String(questionIndex + 1).padStart(2, '0')}</span>${escapeHtml(question.question)}</legend><div class="silabo-options">${question.options.map((option, optionIndex) => `<label class="silabo-option"><input type="radio" name="silabo-question-${questionIndex}" value="${optionIndex}"><span>${escapeHtml(option)}</span></label>`).join('')}</div><p class="question-feedback" aria-live="polite"></p></fieldset>`).join('');
    document.querySelector('#silabo-quiz').addEventListener('change', (event) => {
      if (!event.target.matches('input[type="radio"]')) return;
      const questionIndex = Number(event.target.name.replace('silabo-question-', ''));
      const question = data.quiz[questionIndex];
      const fieldset = event.target.closest('fieldset');
      const isCorrect = Number(event.target.value) === question.answer;
      fieldset.dataset.correct = String(isCorrect);
      const feedback = fieldset.querySelector('.question-feedback');
      feedback.className = `question-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`;
      feedback.textContent = isCorrect ? question.feedback : `Revisa esta respuesta. ${question.feedback}`;
      updateQuizScore();
    });
  }

  function updateQuizScore() {
    const answered = Array.from(document.querySelectorAll('.silabo-question'));
    const correct = answered.filter((question) => question.dataset.correct === 'true').length;
    const completed = answered.filter((question) => question.querySelector('input:checked')).length;
    setText('#silabo-score', `${correct} / ${data.quiz.length}`);
    const result = document.querySelector('#silabo-quiz-result');
    result.textContent = completed === data.quiz.length ? `Autoevaluación completada: ${correct} de ${data.quiz.length} respuestas correctas.` : `${completed} de ${data.quiz.length} preguntas respondidas.`;
  }

  function observeDynamicReveals() {
    const elements = document.querySelectorAll('.silabo-reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    elements.forEach((element) => observer.observe(element));
  }

  renderHero();
  renderTechnicalSheet();
  renderPurpose();
  renderUnitTabs();
  renderTimeline();
  renderSkills();
  renderProject();
  renderBibliography();
  renderTeacher();
  renderQuiz();
  renderCharts();
  observeDynamicReveals();

  window.addEventListener('bi-theme-change', renderCharts);
  window.setInterval(renderTimeline, 60000);
})();
