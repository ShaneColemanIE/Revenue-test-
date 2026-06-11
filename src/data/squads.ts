import { POSITIONS } from './positions';

export interface Candidate {
  /** Position index, 0-14 */
  position: number;
  name: string;
  /** The season this player is drawn from */
  year: number;
  /** Flavour text describing how that season went for Limerick */
  status: string;
  /** Fictional rating, 1-99, used to work out your Dream XV's overall strength */
  rating: number;
}

export interface YearSquad {
  year: number;
  status: string;
  players: Candidate[];
}

interface EraPlayer {
  name: string;
  from: number;
  to: number;
  rating: number;
}

// Three "eras" of Limerick hurling per position, spanning 1990-2026 with no gaps.
const POSITION_PLAYERS: EraPlayer[][] = [
  // 1. Goalkeeper
  [
    { name: 'Joe Quaid', from: 1990, to: 2002, rating: 88 },
    { name: 'Brian Murray', from: 2003, to: 2014, rating: 83 },
    { name: 'Nickie Quaid', from: 2015, to: 2026, rating: 92 },
  ],
  // 2. Right Corner-Back
  [
    { name: 'Stephen McDonagh', from: 1990, to: 2002, rating: 85 },
    { name: 'Stephen Lucey', from: 2003, to: 2014, rating: 83 },
    { name: 'Sean Finn', from: 2015, to: 2026, rating: 94 },
  ],
  // 3. Full-Back
  [
    { name: 'Mike Nash', from: 1990, to: 2002, rating: 84 },
    { name: "Mark O'Riordan", from: 2003, to: 2014, rating: 81 },
    { name: 'Mike Casey', from: 2015, to: 2026, rating: 88 },
  ],
  // 4. Left Corner-Back
  [
    { name: 'Dave Clarke', from: 1990, to: 2002, rating: 83 },
    { name: 'Damien Reale', from: 2003, to: 2014, rating: 81 },
    { name: 'Richie English', from: 2015, to: 2026, rating: 87 },
  ],
  // 5. Right Half-Back
  [
    { name: 'Ger Hegarty', from: 1990, to: 2002, rating: 84 },
    { name: 'Brian Geary', from: 2003, to: 2014, rating: 82 },
    { name: 'Diarmaid Byrnes', from: 2015, to: 2026, rating: 95 },
  ],
  // 6. Centre-Back
  [
    { name: 'Ciaran Carey', from: 1990, to: 2002, rating: 90 },
    { name: 'Tom Condon', from: 2003, to: 2014, rating: 82 },
    { name: 'Declan Hannon', from: 2015, to: 2026, rating: 96 },
  ],
  // 7. Left Half-Back
  [
    { name: 'Pat Heffernan', from: 1990, to: 2002, rating: 82 },
    { name: 'Wayne McNamara', from: 2003, to: 2014, rating: 83 },
    { name: 'Kyle Hayes', from: 2015, to: 2026, rating: 93 },
  ],
  // 8. Midfield
  [
    { name: 'Mark Foley', from: 1990, to: 2002, rating: 85 },
    { name: 'Paul Browne', from: 2003, to: 2014, rating: 84 },
    { name: "Darragh O'Donovan", from: 2015, to: 2026, rating: 89 },
  ],
  // 9. Midfield
  [
    { name: 'T.J. Ryan', from: 1990, to: 2002, rating: 84 },
    { name: "Donal O'Grady", from: 2003, to: 2014, rating: 83 },
    { name: "William O'Donoghue", from: 2015, to: 2026, rating: 88 },
  ],
  // 10. Right Half-Forward
  [
    { name: 'Niall Moran', from: 1990, to: 2002, rating: 85 },
    { name: 'Ollie Moran', from: 2003, to: 2014, rating: 84 },
    { name: 'David Reidy', from: 2015, to: 2026, rating: 87 },
  ],
  // 11. Centre-Forward
  [
    { name: 'Gary Kirby', from: 1990, to: 2002, rating: 92 },
    { name: "Andrew O'Shaughnessy", from: 2003, to: 2014, rating: 87 },
    { name: 'Gearoid Hegarty', from: 2015, to: 2026, rating: 96 },
  ],
  // 12. Left Half-Forward
  [
    { name: 'Damien Quigley', from: 1990, to: 2002, rating: 83 },
    { name: 'Shane Dowling', from: 2003, to: 2014, rating: 86 },
    { name: 'Tom Morrissey', from: 2015, to: 2026, rating: 91 },
  ],
  // 13. Right Corner-Forward
  [
    { name: 'Frankie Carroll', from: 1990, to: 2002, rating: 82 },
    { name: 'Mark Keane', from: 2003, to: 2014, rating: 82 },
    { name: 'Seamus Flanagan', from: 2015, to: 2026, rating: 89 },
  ],
  // 14. Full-Forward
  [
    { name: "Leo O'Connor", from: 1990, to: 2002, rating: 81 },
    { name: 'Kevin Downes', from: 2003, to: 2014, rating: 85 },
    { name: 'Aaron Gillane', from: 2015, to: 2026, rating: 97 },
  ],
  // 15. Left Corner-Forward
  [
    { name: "Owen O'Neill", from: 1990, to: 2002, rating: 80 },
    { name: 'Graeme Mulcahy', from: 2003, to: 2014, rating: 87 },
    { name: 'Peter Casey', from: 2015, to: 2026, rating: 86 },
  ],
];

// How each Limerick championship campaign went, year by year.
const STATUS_BY_YEAR: Record<number, string> = {
  1990: 'Munster Semi-Final',
  1991: 'Munster Final',
  1992: 'Munster Semi-Final',
  1993: 'Munster Final',
  1994: 'All-Ireland Runners-Up',
  1995: 'Munster Semi-Final',
  1996: 'All-Ireland Runners-Up',
  1997: 'Munster Final',
  1998: 'Munster Semi-Final',
  1999: 'Qualifiers, Round 2',
  2000: 'Munster Semi-Final',
  2001: 'Qualifiers, Round 3',
  2002: 'Munster Final',
  2003: 'Qualifiers, Round 2',
  2004: 'Munster Semi-Final',
  2005: 'Qualifiers, Round 4',
  2006: 'Munster Semi-Final',
  2007: 'All-Ireland Runners-Up',
  2008: 'Qualifiers, Round 3',
  2009: 'Munster Semi-Final',
  2010: 'Munster Final',
  2011: 'All-Ireland Quarter-Final',
  2012: 'Munster Final',
  2013: 'All-Ireland Semi-Final',
  2014: 'Munster Semi-Final',
  2015: 'Qualifiers, Round 3',
  2016: 'All-Ireland Quarter-Final',
  2017: 'Munster Semi-Final',
  2018: 'All-Ireland Champions',
  2019: 'All-Ireland Quarter-Final',
  2020: 'All-Ireland Champions',
  2021: 'All-Ireland Champions',
  2022: 'All-Ireland Champions',
  2023: 'All-Ireland Champions',
  2024: 'All-Ireland Quarter-Final',
  2025: 'All-Ireland Semi-Final',
  2026: 'Championship in Progress',
};

const STATUS_RATING_BONUS: Record<string, number> = {
  'All-Ireland Champions': 4,
  'All-Ireland Runners-Up': 2,
  'All-Ireland Semi-Final': 1,
  'All-Ireland Quarter-Final': 0,
  'Munster Final': 0,
  'Munster Semi-Final': -1,
};

function statusBonus(status: string): number {
  return STATUS_RATING_BONUS[status] ?? -2;
}

function clampRating(value: number): number {
  return Math.max(60, Math.min(99, Math.round(value)));
}

export const FIRST_YEAR = 1990;
export const LAST_YEAR = 2026;

function buildSquads(): YearSquad[] {
  const squads: YearSquad[] = [];

  for (let year = FIRST_YEAR; year <= LAST_YEAR; year++) {
    const status = STATUS_BY_YEAR[year];
    const players: Candidate[] = POSITION_PLAYERS.map((eras, index) => {
      const era = eras.find((e) => year >= e.from && year <= e.to) ?? eras[eras.length - 1];
      // Small deterministic variation so consecutive years aren't identical.
      const jitter = (((year * (index + 7)) % 5) - 2);
      const rating = clampRating(era.rating + statusBonus(status) + jitter);
      return {
        position: index,
        name: era.name,
        year,
        status,
        rating,
      };
    });

    squads.push({ year, status, players });
  }

  return squads;
}

export const SQUADS: YearSquad[] = buildSquads();

/** All draft candidates for a given position (0-14), one per season 1990-2026. */
export function candidatesForPosition(position: number): Candidate[] {
  return SQUADS.map((squad) => squad.players[position]);
}

export const NUM_POSITIONS = POSITIONS.length;
