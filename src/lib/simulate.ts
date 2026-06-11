import { ROUND_NAMES, ROUND_OPPONENTS, type Opponent } from '../data/opponents';

export interface ScoreLine {
  goals: number;
  points: number;
  total: number;
}

export interface MatchResult {
  round: string;
  opponent: string;
  opponentRating: number;
  myScore: ScoreLine;
  oppScore: ScoreLine;
  won: boolean;
}

export interface ChampionshipResult {
  rounds: MatchResult[];
  champions: boolean;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genScore(rating: number): ScoreLine {
  const base = 14 + (rating - 70) * 0.45;
  const total = Math.max(8, Math.round(base + (Math.random() * 10 - 5)));
  const goals = randInt(0, 3);
  const points = Math.max(0, total - goals * 3);
  return { goals, points, total: goals * 3 + points };
}

function bump(score: ScoreLine, amount: number): ScoreLine {
  const points = score.points + amount;
  return { ...score, points, total: score.goals * 3 + points };
}

function simulateMatch(myRating: number, opponent: Opponent, round: string): MatchResult {
  const opponentRating = randInt(opponent.min, opponent.max);
  const winProbability = 1 / (1 + Math.exp((opponentRating - myRating) / 7));
  const won = Math.random() < winProbability;

  let myScore = genScore(myRating);
  let oppScore = genScore(opponentRating);

  if (won && myScore.total <= oppScore.total) {
    myScore = bump(myScore, oppScore.total - myScore.total + randInt(1, 3));
  } else if (!won && oppScore.total <= myScore.total) {
    oppScore = bump(oppScore, myScore.total - oppScore.total + randInt(1, 3));
  }

  return { round, opponent: opponent.name, opponentRating, myScore, oppScore, won };
}

export function simulateChampionship(myRating: number): ChampionshipResult {
  const rounds: MatchResult[] = [];

  for (let i = 0; i < ROUND_OPPONENTS.length; i++) {
    const candidates = ROUND_OPPONENTS[i];
    const opponent = candidates[randInt(0, candidates.length - 1)];
    const result = simulateMatch(myRating, opponent, ROUND_NAMES[i]);
    rounds.push(result);
    if (!result.won) break;
  }

  const champions = rounds.length === ROUND_OPPONENTS.length && rounds[rounds.length - 1].won;
  return { rounds, champions };
}

export function formatScore(score: ScoreLine): string {
  return `${score.goals}-${score.points}`;
}
