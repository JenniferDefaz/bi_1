// DATOS ILUSTRATIVOS – reemplazar con datos oficiales de LigaPro
// Valores didácticos de una fase de 30 fechas; no son resultados oficiales.
const LIGAPRO_DATA = {
  season: 2026,
  regularRounds: 30,
  teams: [
    { name: 'Independiente del Valle', region: 'Sierra', wins: 19, draws: 10, gf: 54, ga: 28, attendance: 10840, profile: { attack: 91, defense: 88, possession: 79, effectiveness: 84, discipline: 76 } },
    { name: 'Liga de Quito', region: 'Sierra', wins: 17, draws: 8, gf: 49, ga: 31, attendance: 14220, profile: { attack: 85, defense: 82, possession: 74, effectiveness: 80, discipline: 72 } },
    { name: 'Barcelona SC', region: 'Costa', wins: 16, draws: 8, gf: 46, ga: 32, attendance: 24850, profile: { attack: 83, defense: 79, possession: 71, effectiveness: 78, discipline: 68 } },
    { name: 'Universidad Católica', region: 'Sierra', wins: 15, draws: 9, gf: 45, ga: 34, attendance: 5320, profile: { attack: 80, defense: 76, possession: 75, effectiveness: 77, discipline: 81 } },
    { name: 'Emelec', region: 'Costa', wins: 14, draws: 9, gf: 42, ga: 35, attendance: 18400, profile: { attack: 77, defense: 73, possession: 70, effectiveness: 74, discipline: 69 } },
    { name: 'Aucas', region: 'Sierra', wins: 13, draws: 8, gf: 43, ga: 39, attendance: 6120, profile: { attack: 75, defense: 68, possession: 66, effectiveness: 73, discipline: 71 } },
    { name: 'Deportivo Cuenca', region: 'Sierra', wins: 12, draws: 9, gf: 40, ga: 37, attendance: 9180, profile: { attack: 72, defense: 71, possession: 68, effectiveness: 70, discipline: 77 } },
    { name: 'Macará', region: 'Sierra', wins: 11, draws: 9, gf: 38, ga: 36, attendance: 7440, profile: { attack: 69, defense: 72, possession: 64, effectiveness: 68, discipline: 75 } },
    { name: 'Orense', region: 'Costa', wins: 10, draws: 9, gf: 36, ga: 37, attendance: 4880, profile: { attack: 67, defense: 69, possession: 63, effectiveness: 66, discipline: 73 } },
    { name: 'Libertad', region: 'Sierra', wins: 9, draws: 10, gf: 34, ga: 38, attendance: 4260, profile: { attack: 64, defense: 67, possession: 61, effectiveness: 63, discipline: 70 } },
    { name: 'Mushuc Runa', region: 'Sierra', wins: 9, draws: 8, gf: 33, ga: 42, attendance: 3920, profile: { attack: 63, defense: 61, possession: 58, effectiveness: 62, discipline: 66 } },
    { name: 'Técnico Universitario', region: 'Sierra', wins: 8, draws: 9, gf: 32, ga: 41, attendance: 4980, profile: { attack: 61, defense: 62, possession: 60, effectiveness: 60, discipline: 68 } },
    { name: 'Manta FC', region: 'Costa', wins: 7, draws: 9, gf: 31, ga: 44, attendance: 5810, profile: { attack: 59, defense: 57, possession: 57, effectiveness: 58, discipline: 65 } },
    { name: 'Daquilema FC', region: 'Sierra', wins: 5, draws: 9, gf: 29, ga: 45, attendance: 3260, profile: { attack: 55, defense: 54, possession: 53, effectiveness: 55, discipline: 63 } },
    { name: 'Guayaquil City', region: 'Costa', wins: 3, draws: 8, gf: 30, ga: 49, attendance: 7030, profile: { attack: 56, defense: 49, possession: 59, effectiveness: 53, discipline: 61 } },
    { name: 'Leones FC', region: 'Sierra', wins: 2, draws: 8, gf: 27, ga: 41, attendance: 2840, profile: { attack: 51, defense: 52, possession: 50, effectiveness: 51, discipline: 59 } }
  ],
  matchResults: { homeWins: 100, draws: 70, awayWins: 70 },
  attendanceByRound: 30
};

// Calcula la tabla derivada para evitar discrepancias entre PJ, resultados y puntos.
LIGAPRO_DATA.teams = LIGAPRO_DATA.teams.map((team) => {
  const played = team.wins + team.draws + (LIGAPRO_DATA.regularRounds - team.wins - team.draws);
  const losses = LIGAPRO_DATA.regularRounds - team.wins - team.draws;
  return {
    ...team,
    played,
    losses,
    points: team.wins * 3 + team.draws,
    gd: team.gf - team.ga,
    pointsHistory: Array.from({ length: LIGAPRO_DATA.regularRounds }, (_, index) => Math.floor((team.wins * 3 + team.draws) * (index + 1) / LIGAPRO_DATA.regularRounds))
  };
});
