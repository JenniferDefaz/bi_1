// Motor del cuestionario, aislado para ejecutarse solo en la página principal.
(() => {
  const startForm = document.querySelector('#quiz-start-form');
  if (!startForm || !Array.isArray(QUIZ_QUESTIONS)) return;

  const content = document.querySelector('#quiz-content');
  const scoreNode = document.querySelector('#quiz-score');
  const heading = document.querySelector('#quiz-heading');
  const subheading = document.querySelector('#quiz-subheading');
  const rankingNode = document.querySelector('#quiz-ranking');
  const pointsByDifficulty = { facil: 10, medio: 20, dificil: 30 };
  const state = { player: '', mode: 'practice', questions: [], index: 0, score: 0, correct: 0, lives: 3, streak: 0, fiftyUsed: false, failures: [], seconds: 20, timer: null, locked: false };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function readRanking() {
    try {
      const entries = JSON.parse(localStorage.getItem('bi-quiz-ranking') || '[]');
      return Array.isArray(entries) ? entries.filter((entry) => entry && typeof entry.name === 'string' && Number.isFinite(entry.score)).slice(0, 5) : [];
    } catch (error) {
      return [];
    }
  }

  function renderRanking() {
    const entries = readRanking();
    rankingNode.innerHTML = entries.length
      ? entries.map((entry) => `<li><strong>${escapeHtml(entry.name)}</strong> · ${entry.score} pts</li>`).join('')
      : '<li>Aún no hay partidas guardadas.</li>';
  }

  function saveRanking() {
    const entries = [...readRanking(), { name: state.player, score: state.score, date: Date.now() }]
      .sort((first, second) => second.score - first.score || second.date - first.date)
      .slice(0, 5);
    try {
      localStorage.setItem('bi-quiz-ranking', JSON.stringify(entries));
    } catch (error) {
      // El juego puede terminar aunque el navegador bloquee el almacenamiento.
    }
    renderRanking();
  }

  function animateScore(target) {
    const initial = Number(scoreNode.dataset.value || 0);
    const startTime = performance.now();
    const duration = 420;
    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const value = Math.round(initial + (target - initial) * eased);
      scoreNode.textContent = `${value} pts`;
      scoreNode.dataset.value = String(value);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function stopTimer() {
    if (state.timer) window.clearInterval(state.timer);
    state.timer = null;
  }

  function updateMeta() {
    const hearts = '♥'.repeat(state.lives) + '♡'.repeat(3 - state.lives);
    const modeText = state.mode === 'challenge' ? ` · ${state.seconds}s` : ' · Práctica';
    const timer = state.mode === 'challenge' ? `<div class="timer-track mt-3" aria-label="Tiempo restante"><div class="timer-fill timer-${state.seconds}" id="timer-fill"></div></div>` : '';
    return `<div class="quiz-meta"><span>Pregunta ${state.index + 1} de 10</span><span class="heart" aria-label="${state.lives} vidas">${hearts}</span><span>Racha: ${state.streak}</span><span>${modeText}</span></div>${timer}<div class="progress mt-3" role="progressbar" aria-label="Progreso del cuestionario" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${state.index}"><div class="progress-bar progress-${state.index}"></div></div>`;
  }

  function renderQuestion() {
    stopTimer();
    state.locked = false;
    if (state.index >= 10 || state.lives <= 0) {
      finishGame();
      return;
    }
    const question = state.questions[state.index];
    const prompt = `<div>${updateMeta()}<span class="badge text-bg-light mt-4 mb-2">${escapeHtml(question.difficulty)}</span><h3 class="h4 mb-4">${escapeHtml(question.question)}</h3>`;
    let answerContent = '';
    if (question.type === 'order') {
      const order = shuffle(question.items);
      answerContent = `<ol class="list-unstyled d-grid gap-2" id="order-options">${order.map((item, index) => `<li class="d-flex align-items-center gap-2"><span class="quiz-option flex-grow-1" data-order-item>${escapeHtml(item)}</span><button class="btn btn-outline-custom btn-sm" type="button" data-move="up" data-index="${index}" aria-label="Subir ${escapeHtml(item)}" ${index === 0 ? 'disabled' : ''}><i class="bi bi-arrow-up" aria-hidden="true"></i></button><button class="btn btn-outline-custom btn-sm" type="button" data-move="down" data-index="${index}" aria-label="Bajar ${escapeHtml(item)}" ${index === order.length - 1 ? 'disabled' : ''}><i class="bi bi-arrow-down" aria-hidden="true"></i></button></li>`).join('')}</ol><button class="btn btn-brand mt-2" type="button" id="submit-order">Confirmar orden</button>`;
    } else {
      const options = shuffle(question.options);
      answerContent = `<div class="d-grid gap-2" id="answer-options">${options.map((option) => `<button class="quiz-option" type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
    }
    const lifeline = question.type === 'order' ? '' : `<button class="btn btn-outline-custom btn-sm mt-3" type="button" id="fifty-button" ${state.fiftyUsed ? 'disabled' : ''}><i class="bi bi-scissors" aria-hidden="true"></i> Comodín 50/50 ${state.fiftyUsed ? '· usado' : ''}</button>`;
    content.innerHTML = `${prompt}${answerContent}${lifeline}<div class="quiz-feedback" id="quiz-feedback" aria-live="polite">${state.mode === 'challenge' ? 'El reloj empieza al cargar la pregunta.' : 'Elige una respuesta para continuar.'}</div></div>`;
    heading.textContent = state.player;
    subheading.textContent = `Reto ${state.index + 1} / 10`;
    if (state.mode === 'challenge') startTimer();
  }

  function startTimer() {
    state.seconds = 20;
    const fill = document.querySelector('#timer-fill');
    if (fill) fill.className = 'timer-fill timer-20';
    state.timer = window.setInterval(() => {
      state.seconds -= 1;
      const currentFill = document.querySelector('#timer-fill');
      if (currentFill) currentFill.className = `timer-fill timer-${Math.max(0, state.seconds)}`;
      if (state.seconds <= 0) submitAnswer(null, true);
    }, 1000);
  }

  function submitAnswer(answer, timedOut = false) {
    if (state.locked) return;
    state.locked = true;
    stopTimer();
    const question = state.questions[state.index];
    const isCorrect = Array.isArray(question.answer)
      ? Array.isArray(answer) && question.answer.every((item, index) => answer[index] === item)
      : answer === question.answer;
    const feedback = document.querySelector('#quiz-feedback');
    if (isCorrect) {
      state.correct += 1;
      state.streak += 1;
      const base = pointsByDifficulty[question.difficulty] || 10;
      const multiplier = state.streak >= 3 ? 2 : 1;
      const speedBonus = state.mode === 'challenge' ? Math.max(0, state.seconds) : 0;
      const earned = base * multiplier + speedBonus;
      state.score += earned;
      animateScore(state.score);
      feedback.innerHTML = `<strong class="text-success">¡Correcto! +${earned} puntos${multiplier === 2 ? ' · racha x2' : ''}${speedBonus ? ` · bonus +${speedBonus}` : ''}</strong><p class="mb-0 mt-1">${escapeHtml(question.explanation)}</p>`;
    } else {
      state.lives -= 1;
      state.streak = 0;
      state.failures.push({ question: question.question, explanation: question.explanation, answer: Array.isArray(question.answer) ? question.answer.join(' → ') : question.answer, timedOut });
      feedback.innerHTML = `<strong class="text-danger">${timedOut ? 'Se acabó el tiempo.' : 'No era esa respuesta.'}</strong> Respuesta: <strong>${escapeHtml(Array.isArray(question.answer) ? question.answer.join(' → ') : question.answer)}</strong><p class="mb-0 mt-1">${escapeHtml(question.explanation)}</p>`;
    }
    document.querySelectorAll('#answer-options button, #order-options button, #submit-order').forEach((button) => { button.disabled = true; });
    const nextButton = document.createElement('button');
    nextButton.className = 'btn btn-brand mt-3';
    nextButton.type = 'button';
    nextButton.textContent = state.index >= 9 || state.lives <= 0 ? 'Ver resultados' : 'Siguiente pregunta';
    nextButton.addEventListener('click', () => { state.index += 1; renderQuestion(); });
    feedback.append(nextButton);
  }

  function moveOrderItem(index, direction) {
    const list = document.querySelector('#order-options');
    const items = Array.from(list.querySelectorAll('li'));
    const destination = index + direction;
    if (destination < 0 || destination >= items.length) return;
    if (direction < 0) list.insertBefore(items[index], items[destination]);
    else list.insertBefore(items[destination], items[index]);
    list.querySelectorAll('li').forEach((item, nextIndex) => {
      item.querySelector('[data-move="up"]').disabled = nextIndex === 0;
      item.querySelector('[data-move="down"]').disabled = nextIndex === items.length - 1;
      item.querySelector('[data-move="up"]').dataset.index = String(nextIndex);
      item.querySelector('[data-move="down"]').dataset.index = String(nextIndex);
    });
  }

  function badgeForScore() {
    if (state.score >= 220) return 'Estratega de Datos';
    if (state.score >= 130) return 'Arquitecto ETL';
    return 'Analista Junior';
  }

  function celebrate() {
    if (state.score < 180 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (let index = 0; index < 70; index += 1) {
      const piece = document.createElement('span');
      piece.className = `confetti confetti-${index % 12}`;
      document.body.append(piece);
      window.setTimeout(() => piece.remove(), 3500);
    }
  }

  function finishGame() {
    stopTimer();
    saveRanking();
    const percentage = Math.round(state.correct / 10 * 100);
    const failures = state.failures.length
      ? `<h4 class="h5 mt-4">Para repasar</h4><ul class="mb-0">${state.failures.map((failure) => `<li class="mb-2"><strong>${escapeHtml(failure.question)}</strong><br><span class="text-muted-custom">Respuesta: ${escapeHtml(failure.answer)}. ${escapeHtml(failure.explanation)}</span></li>`).join('')}</ul>`
      : '<p class="mt-3">¡Sin errores en esta partida!</p>';
    content.innerHTML = `<div class="text-center"><span class="icon-box mx-auto mb-3"><i class="bi bi-trophy-fill" aria-hidden="true"></i></span><h3 class="h2">${state.score} puntos</h3><p>${state.correct} aciertos de 10 · ${percentage}%</p><span class="badge-award"><i class="bi bi-award-fill" aria-hidden="true"></i>${badgeForScore()}</span></div>${failures}<button class="btn btn-brand mt-4" type="button" id="play-again">Jugar otra vez</button>`;
    heading.textContent = 'Partida finalizada';
    subheading.textContent = `${state.player} · ${state.mode === 'challenge' ? 'Desafío' : 'Práctica'}`;
    celebrate();
    document.querySelector('#play-again').addEventListener('click', resetGame);
  }

  function resetGame() {
    scoreNode.dataset.value = '0';
    animateScore(0);
    state.questions = [];
    state.index = 0;
    state.score = 0;
    state.correct = 0;
    state.lives = 3;
    state.streak = 0;
    state.fiftyUsed = false;
    state.failures = [];
    heading.textContent = '¿Listo para el reto?';
    subheading.textContent = 'Elige tu modo y empieza cuando quieras.';
    content.innerHTML = '<form id="quiz-start-form" class="row g-3"><div class="col-md-6"><label class="form-label" for="player-name">Nombre o alias</label><input class="form-control" id="player-name" maxlength="20" autocomplete="nickname" required></div><div class="col-md-6"><label class="form-label" for="quiz-mode">Modo de juego</label><select class="form-select" id="quiz-mode"><option value="practice">Práctica · sin tiempo</option><option value="challenge">Desafío · 20 segundos</option></select></div><div class="col-12"><button class="btn btn-brand" type="submit">Comenzar partida</button></div></form>';
    content.querySelector('form').addEventListener('submit', beginGame);
  }

  function useFiftyFifty() {
    if (state.fiftyUsed) return;
    state.fiftyUsed = true;
    const question = state.questions[state.index];
    const wrongButtons = Array.from(document.querySelectorAll('#answer-options [data-answer]')).filter((button) => button.dataset.answer !== question.answer);
    shuffle(wrongButtons).slice(0, Math.max(0, wrongButtons.length - 1)).forEach((button) => { button.hidden = true; });
    const button = document.querySelector('#fifty-button');
    button.disabled = true;
    button.textContent = 'Comodín 50/50 · usado';
  }

  function beginGame(event) {
    event.preventDefault();
    const form = event.currentTarget;
    state.player = (form.querySelector('#player-name').value.trim() || 'Jugador').slice(0, 20);
    state.mode = form.querySelector('#quiz-mode').value;
    state.questions = shuffle(QUIZ_QUESTIONS).slice(0, 10);
    state.index = 0;
    state.score = 0;
    state.correct = 0;
    state.lives = 3;
    state.streak = 0;
    state.fiftyUsed = false;
    state.failures = [];
    scoreNode.dataset.value = '0';
    animateScore(0);
    renderQuestion();
  }

  content.addEventListener('click', (event) => {
    const answerButton = event.target.closest('[data-answer]');
    if (answerButton) submitAnswer(answerButton.dataset.answer);
    const moveButton = event.target.closest('[data-move]');
    if (moveButton) moveOrderItem(Number(moveButton.dataset.index), moveButton.dataset.move === 'up' ? -1 : 1);
    if (event.target.closest('#submit-order')) {
      const order = Array.from(document.querySelectorAll('#order-options [data-order-item]'), (node) => node.textContent);
      submitAnswer(order);
    }
    if (event.target.closest('#fifty-button')) useFiftyFifty();
  });

  startForm.addEventListener('submit', beginGame);
  renderRanking();
})();
