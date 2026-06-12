import type { Candidate } from '../data/squads';
import {
  MUNSTER_GROUP_OPPONENTS,
  QUALIFIER_OPPONENTS,
  QUARTER_FINAL_OPPONENTS,
  SEMI_FINAL_OPPONENTS,
  FINAL_OPPONENTS,
  type CountyOpponent,
} from '../data/counties';

export interface Roles {
  /** Index (0-14) into the user's Dream XV */
  captain: number;
  freeTaker: number;
  penaltyTaker: number;
}

export interface ScoreLine {
  goals: number;
  points: number;
  total: number;
}

export type Outcome = 'win' | 'loss' | 'draw';

export interface Scorer {
  /** Index (0-14) into the user's Dream XV */
  index: number;
  points: number;
}

export interface MatchResult {
  round: string;
  opponent: string;
  opponentRating: number;
  myScore: ScoreLine;
  oppScore: ScoreLine;
  outcome: Outcome;
  scorers: Scorer[];
}

export interface GroupTableRow {
  team: string;
  isUser: boolean;
  rating: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  for: number;
  against: number;
  points: number;
}

export interface ChampionshipResult {
  groupMatches: MatchResult[];
  groupTable: GroupTableRow[];
  knockout: MatchResult[];
  champions: boolean;
  eliminatedAfter: string | null;
  topScorer: { candidate: Candidate; position: number; total: number };
  keyPlayer: { candidate: Candidate; position: number; blurb: string };
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

function scoreFromTotal(total: number): ScoreLine {
  const goals = Math.min(randInt(0, 3), Math.floor(total / 3));
  const points = total - goals * 3;
  return { goals, points, total };
}

function bump(score: ScoreLine, amount: number): ScoreLine {
  const points = score.points + amount;
  return { ...score, points, total: score.goals * 3 + points };
}

function decideOutcome(myRating: number, oppRating: number, allowDraw: boolean): Outcome {
  if (allowDraw && Math.random() < 0.12) return 'draw';
  const winProbability = 1 / (1 + Math.exp((oppRating - myRating) / 7));
  return Math.random() < winProbability ? 'win' : 'loss';
}

function opposite(outcome: Outcome): Outcome {
  return outcome === 'win' ? 'loss' : outcome === 'loss' ? 'win' : 'draw';
}

function genMatchScores(
  myRating: number,
  oppRating: number,
  outcome: Outcome,
): { myScore: ScoreLine; oppScore: ScoreLine } {
  let myScore = genScore(myRating);
  let oppScore = genScore(oppRating);

  if (outcome === 'draw') {
    const avg = Math.round((myScore.total + oppScore.total) / 2);
    myScore = scoreFromTotal(avg);
    oppScore = scoreFromTotal(avg);
  } else if (outcome === 'win' && myScore.total <= oppScore.total) {
    myScore = bump(myScore, oppScore.total - myScore.total + randInt(1, 3));
  } else if (outcome === 'loss' && oppScore.total <= myScore.total) {
    oppScore = bump(oppScore, myScore.total - oppScore.total + randInt(1, 3));
  }

  return { myScore, oppScore };
}

// Outfield positions (0-indexed) that can contribute scores: both midfielders
// and all six forwards. Forwards carry more attacking weight than midfielders.
const SCORING_WEIGHT: Record<number, number> = {
  7: 0.8, // Midfield
  8: 0.8, // Midfield
  9: 1.1, // Right Half-Forward
  10: 1.3, // Centre-Forward
  11: 1.1, // Left Half-Forward
  12: 1.0, // Right Corner-Forward
  13: 1.3, // Full-Forward
  14: 1.0, // Left Corner-Forward
};

function distributeScore(total: number, team: Candidate[], roles: Roles): Scorer[] {
  const entries = Object.entries(SCORING_WEIGHT).map(([key, baseWeight]) => {
    const index = Number(key);
    let weight = (team[index].rating / 90) * baseWeight;
    if (index === roles.freeTaker) weight *= 1.5;
    if (index === roles.penaltyTaker) weight *= 1.15;
    return { index, weight };
  });

  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  const shares = entries.map((e) => (e.weight / totalWeight) * total);

  const allocated = shares.map((share, i) => ({ index: entries[i].index, points: Math.floor(share) }));
  const remainder = total - allocated.reduce((sum, a) => sum + a.points, 0);

  const byFraction = shares
    .map((share, i) => ({ i, frac: share - Math.floor(share) }))
    .sort((a, b) => b.frac - a.frac);

  for (let k = 0; k < remainder; k++) {
    allocated[byFraction[k % byFraction.length].i].points += 1;
  }

  return allocated
    .filter((a) => a.points > 0)
    .sort((a, b) => b.points - a.points);
}

interface GroupTeamState {
  name: string;
  rating: number;
  isUser: boolean;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  for: number;
  against: number;
  points: number;
}

function recordResult(team: GroupTeamState, myScore: ScoreLine, oppScore: ScoreLine, outcome: Outcome) {
  team.played += 1;
  team.for += myScore.total;
  team.against += oppScore.total;
  if (outcome === 'win') {
    team.won += 1;
    team.points += 2;
  } else if (outcome === 'draw') {
    team.drawn += 1;
    team.points += 1;
  } else {
    team.lost += 1;
  }
}

function simulateGroupStage(
  myRating: number,
  team: Candidate[],
  roles: Roles,
): { matches: MatchResult[]; table: GroupTableRow[] } {
  const teams: GroupTeamState[] = [
    { name: 'Limerick', rating: myRating, isUser: true, played: 0, won: 0, drawn: 0, lost: 0, for: 0, against: 0, points: 0 },
    ...MUNSTER_GROUP_OPPONENTS.map((opp) => ({
      name: opp.name,
      rating: randInt(opp.min, opp.max),
      isUser: false,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      for: 0,
      against: 0,
      points: 0,
    })),
  ];

  const matches: MatchResult[] = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const a = teams[i];
      const b = teams[j];
      const outcomeA = decideOutcome(a.rating, b.rating, true);
      const { myScore: scoreA, oppScore: scoreB } = genMatchScores(a.rating, b.rating, outcomeA);

      recordResult(a, scoreA, scoreB, outcomeA);
      recordResult(b, scoreB, scoreA, opposite(outcomeA));

      if (a.isUser || b.isUser) {
        const userIsA = a.isUser;
        const opponent = userIsA ? b : a;
        const myScore = userIsA ? scoreA : scoreB;
        const oppScore = userIsA ? scoreB : scoreA;
        const outcome = userIsA ? outcomeA : opposite(outcomeA);

        matches.push({
          round: `Munster Round-Robin vs ${opponent.name}`,
          opponent: opponent.name,
          opponentRating: opponent.rating,
          myScore,
          oppScore,
          outcome,
          scorers: distributeScore(myScore.total, team, roles),
        });
      }
    }
  }

  const table: GroupTableRow[] = teams
    .map((t) => ({
      team: t.name,
      isUser: t.isUser,
      rating: t.rating,
      played: t.played,
      won: t.won,
      drawn: t.drawn,
      lost: t.lost,
      for: t.for,
      against: t.against,
      points: t.points,
    }))
    .sort((x, y) => y.points - x.points || (y.for - y.against) - (x.for - x.against) || y.for - x.for);

  return { matches, table };
}

interface KnockoutStage {
  round: string;
  pool: CountyOpponent[];
}

const POST_GROUP_PROGRESSION: KnockoutStage[] = [
  { round: 'All-Ireland Quarter-Final', pool: QUARTER_FINAL_OPPONENTS },
  { round: 'All-Ireland Semi-Final', pool: SEMI_FINAL_OPPONENTS },
  { round: 'All-Ireland Final', pool: FINAL_OPPONENTS },
];

function keyPlayerBlurb(position: number): string {
  if (position === 0) return 'Stood tall between the posts and kept the Dream XV in every game.';
  if (position <= 3) return 'A rock at the back, marshalling the full-back line all campaign.';
  if (position <= 6) return 'Drove the team forward from the half-back line time and again.';
  if (position <= 8) return 'Won the midfield battle and dictated the tempo of every match.';
  if (position <= 11) return 'Provided a constant supply of ball from the half-forward line.';
  return 'A clinical finisher who terrorised every defence faced.';
}

export function simulateChampionship(team: Candidate[], roles: Roles): ChampionshipResult {
  const myRating = Math.round(team.reduce((sum, p) => sum + p.rating, 0) / team.length);

  const { matches: groupMatches, table } = simulateGroupStage(myRating, team, roles);
  const userRank = table.findIndex((row) => row.isUser);

  const knockout: MatchResult[] = [];

  function playKnockout(round: string, pool: CountyOpponent[], opponentOverride?: GroupTableRow): MatchResult {
    let oppName: string;
    let oppRating: number;
    if (opponentOverride) {
      oppName = opponentOverride.team;
      oppRating = opponentOverride.rating;
    } else {
      const opp = pool[randInt(0, pool.length - 1)];
      oppName = opp.name;
      oppRating = randInt(opp.min, opp.max);
    }

    const outcome = decideOutcome(myRating, oppRating, false);
    const { myScore, oppScore } = genMatchScores(myRating, oppRating, outcome);
    const result: MatchResult = {
      round,
      opponent: oppName,
      opponentRating: oppRating,
      myScore,
      oppScore,
      outcome,
      scorers: distributeScore(myScore.total, team, roles),
    };
    knockout.push(result);
    return result;
  }

  function playProgression(stages: KnockoutStage[]): { champions: boolean; eliminatedAfter: string | null } {
    for (const stage of stages) {
      const result = playKnockout(stage.round, stage.pool);
      if (result.outcome !== 'win') {
        return { champions: false, eliminatedAfter: stage.round };
      }
    }
    return { champions: true, eliminatedAfter: null };
  }

  let champions = false;
  let eliminatedAfter: string | null;

  if (userRank <= 1) {
    // 1st or 2nd in the group -> Munster Final against the other top side.
    const munsterFinalOpponent = table[userRank === 0 ? 1 : 0];
    const result = playKnockout('Munster Final', MUNSTER_GROUP_OPPONENTS, munsterFinalOpponent);

    if (result.outcome === 'win') {
      // Munster champions go straight to the All-Ireland Semi-Final.
      ({ champions, eliminatedAfter } = playProgression(POST_GROUP_PROGRESSION.slice(1)));
    } else {
      // Munster runners-up enter at the Quarter-Final.
      ({ champions, eliminatedAfter } = playProgression(POST_GROUP_PROGRESSION));
    }
  } else if (userRank === 2) {
    // 3rd in the group -> qualifiers, winner reaches the Quarter-Final.
    const qualifier = playKnockout('Qualifier', QUALIFIER_OPPONENTS);
    if (qualifier.outcome === 'win') {
      ({ champions, eliminatedAfter } = playProgression(POST_GROUP_PROGRESSION));
    } else {
      eliminatedAfter = 'Qualifier';
    }
  } else {
    eliminatedAfter = 'Munster Round-Robin';
  }

  const totals = new Map<number, number>();
  for (const match of [...groupMatches, ...knockout]) {
    for (const scorer of match.scorers) {
      totals.set(scorer.index, (totals.get(scorer.index) ?? 0) + scorer.points);
    }
  }

  let topIndex = 9;
  let topTotal = -1;
  for (const [index, total] of totals) {
    if (total > topTotal) {
      topTotal = total;
      topIndex = index;
    }
  }
  if (topTotal < 0) topTotal = 0;

  let keyIndex = 0;
  for (let i = 1; i < team.length; i++) {
    if (team[i].rating > team[keyIndex].rating) keyIndex = i;
  }

  return {
    groupMatches,
    groupTable: table,
    knockout,
    champions,
    eliminatedAfter,
    topScorer: { candidate: team[topIndex], position: topIndex, total: topTotal },
    keyPlayer: { candidate: team[keyIndex], position: keyIndex, blurb: keyPlayerBlurb(keyIndex) },
  };
}

export function formatScore(score: ScoreLine): string {
  return `${score.goals}-${score.points}`;
}
