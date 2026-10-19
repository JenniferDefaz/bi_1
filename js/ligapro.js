// Dashboard interactivo para los datos didácticos de LigaPro.
(() => {
  const dashboard = document.querySelector('#dashboard');
  if (!dashboard || !Array.isArray(LIGAPRO_DATA?.teams)) return;

  const allTeams = LIGAPRO_DATA.teams;
  const numberFormat = new Intl.NumberFormat('es-EC');
  const currencyFormat = new Intl.NumberFormat('es-EC', { maximumFractionDigits: 0 });
  const teamFilter = document.querySelector('#team-filter');
  const roundFilter = document.querySelector('#round-filter');
  const roundOutput = document.querySelector('#round-output');
  const searchInput = document.querySelector('#team-search');
  const standingsBody = document.querySelector('#standings-body');
  const radarTeamA = document.querySelector('#radar-team-a');
  const radarTeamB = document.querySelector('#radar-team-b');
  const charts = {};
  let selectedSort = 'points';
  let sortDirection = -1;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function rankedTeams() {
    return [...allTeams].sort((first, second) => second.points - first.points || second.gd - first.gd || second.gf - first.gf);
  }

  function selectedTeam() {
    return allTeams.find((team) => team.name === teamFilter.value) || null;
  }

  function populateTeamSelects() {
    const options = allTeams.map((team) => `<option value="${escapeHtml(team.name)}">${escapeHtml(team.name)}</option>`).join('');
    teamFilter.insertAdjacentHTML('beforeend', options);
    radarTeamA.innerHTML = options;
    radarTeamB.innerHTML = options;
    radarTeamA.value = rankedTeams()[0].name;
    radarTeamB.value = rankedTeams()[1].name;
  }

  function animateNumber(node, target, formatter = numberFormat) {
    const start = performance.now();
    const duration = 650;
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * (1 - (1 - progress) ** 3));
      node.textContent = formatter.format(value);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function renderKpis() {
    const focused = selectedTeam();
    const ranking = rankedTeams();
    const totalGoals = allTeams.reduce((sum, team) => sum + team.gf, 0);
    const goalsPerGame = totalGoals / (LIGAPRO_DATA.regularRounds * allTeams.length / 2);
    const avgAttendance = allTeams.reduce((sum, team) => sum + team.attendance, 0) / allTeams.length;
    const leader = focused || ranking[0];
    const topScorer = focused || [...allTeams].sort((first, second) => second.gf - first.gf)[0];
    const strongestDefense = focused || [...allTeams].sort((first, second) => first.ga - second.ga)[0];
    const cards = [
      { icon: 'bi-dribbble', label: focused ? `Goles de ${focused.name}` : 'Goles en el torneo', value: focused ? focused.gf : totalGoals, numeric: true },
      { icon: 'bi-graph-up-arrow', label: focused ? 'Goles por partido' : 'Promedio de goles / partido', value: focused ? focused.gf / focused.played : goalsPerGame, numeric: true, decimals: 2 },
      { icon: 'bi-trophy', label: focused ? 'Posición actual' : 'Líder del torneo', value: focused ? `${ranking.findIndex((team) => team.name === focused.name) + 1}. ${focused.name}` : `${leader.name} · ${leader.points} pts` },
      { icon: 'bi-bullseye', label: focused ? 'Goles a favor' : 'Equipo más goleador', value: focused ? focused.gf : `${topScorer.name} · ${topScorer.gf}` },
      { icon: 'bi-shield-check', label: focused ? 'Goles recibidos' : 'Valla menos vencida', value: focused ? focused.ga : `${strongestDefense.name} · ${strongestDefense.ga}` },
      { icon: 'bi-people', label: focused ? 'Asistencia promedio' : 'Asistencia promedio / local', value: focused ? focused.attendance : avgAttendance, numeric: true }
    ];
    document.querySelector('#kpi-grid').innerHTML = cards.map((card) => `<div class="col-6 col-lg-4 col-xl-2 reveal is-visible"><article class="surface kpi-card"><span class="icon-box"><i class="bi ${card.icon}" aria-hidden="true"></i></span><div class="kpi-value"${card.numeric ? ` data-count="${card.value}" data-decimals="${card.decimals || 0}"` : ''}>${card.numeric ? '0' : escapeHtml(card.value)}</div><span class="kpi-label">${escapeHtml(card.label)}</span></article></div>`).join('');
    document.querySelectorAll('[data-count]').forEach((node) => {
      const target = Number(node.dataset.count);
      if (Number(node.dataset.decimals)) {
        const textNode = node;
        const start = performance.now();
        const duration = 650;
        function decimalFrame(now) {
          const progress = Math.min((now - start) / duration, 1);
          textNode.textContent = (target * (1 - (1 - progress) ** 3)).toFixed(Number(textNode.dataset.decimals));
          if (progress < 1) requestAnimationFrame(decimalFrame);
        }
        requestAnimationFrame(decimalFrame);
      } else {
        animateNumber(node, target, currencyFormat);
      }
    });
  }

  function chartPalette() {
    const styles = getComputedStyle(document.documentElement);
    return {
      brand: styles.getPropertyValue('--brand').trim(),
      lime: styles.getPropertyValue('--lime').trim(),
      coral: styles.getPropertyValue('--coral').trim(),
      gold: styles.getPropertyValue('--gold').trim(),
      ink: styles.getPropertyValue('--chart-text').trim(),
      grid: styles.getPropertyValue('--chart-grid').trim(),
      surface: styles.getPropertyValue('--surface').trim(),
      blue: '#5b8bd8'
    };
  }

  function baseOptions(palette, extra = {}) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 550 },
      plugins: {
        legend: { labels: { color: palette.ink, usePointStyle: true, boxWidth: 9, padding: 16 } },
        tooltip: { backgroundColor: palette.surface, titleColor: palette.ink, bodyColor: palette.ink, borderColor: palette.grid, borderWidth: 1 }
      },
      ...extra
    };
  }

  function axisOptions(palette, horizontal = false) {
    return {
      x: { beginAtZero: true, grid: { color: palette.grid }, ticks: { color: palette.ink }, ...(horizontal ? {} : { title: { display: true } }) },
      y: { beginAtZero: true, grid: { color: palette.grid }, ticks: { color: palette.ink, ...(horizontal ? { autoSkip: false } : {}) } }
    };
  }

  function makeChart(id, config) {
    const canvas = document.getElementById(id);
    if (!canvas || typeof Chart === 'undefined') return null;
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(canvas, config);
    return charts[id];
  }

  function renderCharts() {
    if (typeof Chart === 'undefined') return;
    const palette = chartPalette();
    const focus = selectedTeam();
    const teams = rankedTeams();
    const labels = teams.map((team) => team.name);
    const highlightColor = (team) => focus && team.name === focus.name ? palette.coral : palette.brand;

    makeChart('goals-chart', {
      type: 'bar',
      data: { labels, datasets: [
        { label: 'Goles a favor', data: teams.map((team) => team.gf), backgroundColor: teams.map(highlightColor), borderRadius: 4 },
        { label: 'Goles en contra', data: teams.map((team) => team.ga), backgroundColor: teams.map((team) => focus && team.name === focus.name ? palette.gold : `${palette.blue}b8`), borderRadius: 4 }
      ] },
      options: baseOptions(palette, { scales: axisOptions(palette), interaction: { mode: 'index', intersect: false } })
    });

    const resultValues = [LIGAPRO_DATA.matchResults.homeWins, LIGAPRO_DATA.matchResults.draws, LIGAPRO_DATA.matchResults.awayWins];
    makeChart('results-chart', {
      type: 'doughnut',
      data: { labels: ['Victorias locales', 'Empates', 'Victorias visitantes'], datasets: [{ data: resultValues, backgroundColor: [palette.brand, palette.gold, palette.coral], borderColor: palette.surface, borderWidth: 3, hoverOffset: 7 }] },
      options: baseOptions(palette, { cutout: '62%', plugins: { ...baseOptions(palette).plugins, legend: { position: 'bottom', labels: { color: palette.ink, usePointStyle: true, boxWidth: 9 } } } })
    });

    const rounds = Number(roundFilter.value);
    const lineTeams = focus ? [...teams.filter((team) => team.name !== focus.name).slice(0, 3), focus] : teams.slice(0, 4);
    const lineColors = [palette.brand, palette.coral, palette.blue, palette.gold];
    makeChart('points-chart', {
      type: 'line',
      data: { labels: Array.from({ length: rounds }, (_, index) => `F. ${index + 1}`), datasets: lineTeams.map((team, index) => ({ label: team.name, data: team.pointsHistory.slice(0, rounds), borderColor: team.name === focus?.name ? palette.coral : lineColors[index], backgroundColor: `${team.name === focus?.name ? palette.coral : lineColors[index]}22`, pointRadius: 2, pointHoverRadius: 5, tension: .28, fill: false })) },
      options: baseOptions(palette, { scales: axisOptions(palette), interaction: { mode: 'index', intersect: false } })
    });

    const attendanceTeams = [...teams].sort((first, second) => second.attendance - first.attendance);
    makeChart('attendance-chart', {
      type: 'bar',
      data: { labels: attendanceTeams.map((team) => team.name), datasets: [{ label: 'Espectadores por partido de local', data: attendanceTeams.map((team) => team.attendance), backgroundColor: attendanceTeams.map(highlightColor), borderRadius: 4 }] },
      options: baseOptions(palette, { indexAxis: 'y', scales: axisOptions(palette, true), plugins: { ...baseOptions(palette).plugins, legend: { display: false } } })
    });

    const firstTeam = allTeams.find((team) => team.name === radarTeamA.value) || teams[0];
    const secondTeam = allTeams.find((team) => team.name === radarTeamB.value) || teams[1];
    const radarLabels = ['Ataque', 'Defensa', 'Posesión', 'Efectividad', 'Disciplina'];
    const radarConfig = (team, color) => ({ label: team.name, data: [team.profile.attack, team.profile.defense, team.profile.possession, team.profile.effectiveness, team.profile.discipline], borderColor: color, backgroundColor: `${color}30`, pointBackgroundColor: color, pointRadius: 3 });
    makeChart('radar-chart', {
      type: 'radar',
      data: { labels: radarLabels, datasets: [radarConfig(firstTeam, palette.brand), radarConfig(secondTeam, palette.coral)] },
      options: baseOptions(palette, { scales: { r: { min: 0, max: 100, angleLines: { color: palette.grid }, grid: { color: palette.grid }, pointLabels: { color: palette.ink }, ticks: { color: palette.ink, backdropColor: 'transparent', stepSize: 25 } } } })
    });

    const regionGoals = ['Costa', 'Sierra'].map((region) => allTeams.filter((team) => team.region === region).reduce((sum, team) => sum + team.gf, 0));
    makeChart('region-chart', {
      type: 'polarArea',
      data: { labels: ['Costa', 'Sierra'], datasets: [{ data: regionGoals, backgroundColor: [`${palette.coral}c9`, `${palette.brand}c9`], borderColor: palette.surface, borderWidth: 2 }] },
      options: baseOptions(palette, { scales: { r: { grid: { color: palette.grid }, ticks: { color: palette.ink, backdropColor: 'transparent' } } }, plugins: { ...baseOptions(palette).plugins, legend: { position: 'bottom', labels: { color: palette.ink, usePointStyle: true, boxWidth: 9 } } } })
    });
  }

  function renderStandings() {
    const filter = searchInput.value.trim().toLocaleLowerCase('es');
    const focus = selectedTeam();
    const rows = rankedTeams().map((team, index) => ({ ...team, position: index + 1 }))
      .filter((team) => team.name.toLocaleLowerCase('es').includes(filter))
      .sort((first, second) => {
        const firstValue = first[selectedSort];
        const secondValue = second[selectedSort];
        if (typeof firstValue === 'string') return firstValue.localeCompare(secondValue, 'es') * sortDirection;
        return (firstValue - secondValue) * sortDirection;
      });
    standingsBody.replaceChildren();
    rows.forEach((team) => {
      const row = document.createElement('tr');
      row.classList.add(team.position === 1 ? 'zone-title' : team.position <= 6 ? 'zone-cup' : team.position >= 14 ? 'zone-drop' : '');
      if (focus?.name === team.name) row.classList.add('is-selected');
      [team.position, team.name, team.played, team.wins, team.draws, team.losses, team.gf, team.ga, team.gd, team.points].forEach((value) => {
        const cell = document.createElement('td');
        cell.textContent = String(value);
        row.append(cell);
      });
      standingsBody.append(row);
    });
  }

  function refreshDashboard() {
    roundOutput.value = `Fecha ${roundFilter.value}`;
    roundOutput.textContent = `Fecha ${roundFilter.value}`;
    renderKpis();
    renderCharts();
    renderStandings();
  }

  function applyChartTheme() {
    renderCharts();
  }

  document.querySelectorAll('#standings-table [data-sort]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.sort;
      if (selectedSort === key) sortDirection *= -1;
      else {
        selectedSort = key;
        sortDirection = key === 'name' || key === 'position' ? 1 : -1;
      }
      renderStandings();
    });
  });
  teamFilter.addEventListener('change', refreshDashboard);
  roundFilter.addEventListener('input', () => { roundOutput.value = `Fecha ${roundFilter.value}`; roundOutput.textContent = `Fecha ${roundFilter.value}`; renderCharts(); });
  searchInput.addEventListener('input', renderStandings);
  radarTeamA.addEventListener('change', renderCharts);
  radarTeamB.addEventListener('change', renderCharts);
  window.addEventListener('bi-theme-change', applyChartTheme);

  populateTeamSelects();
  refreshDashboard();
})();
