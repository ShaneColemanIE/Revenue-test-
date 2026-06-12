// The 15 starting positions in a hurling team, numbered 1-15 by convention.
export const POSITIONS: { label: string; short: string }[] = [
  { label: 'Goalkeeper', short: 'GK' },
  { label: 'Right Corner-Back', short: 'RCB' },
  { label: 'Full-Back', short: 'FB' },
  { label: 'Left Corner-Back', short: 'LCB' },
  { label: 'Right Half-Back', short: 'RHB' },
  { label: 'Centre-Back', short: 'CB' },
  { label: 'Left Half-Back', short: 'LHB' },
  { label: 'Midfield', short: 'MF' },
  { label: 'Midfield', short: 'MF' },
  { label: 'Right Half-Forward', short: 'RHF' },
  { label: 'Centre-Forward', short: 'CF' },
  { label: 'Left Half-Forward', short: 'LHF' },
  { label: 'Right Corner-Forward', short: 'RCF' },
  { label: 'Full-Forward', short: 'FF' },
  { label: 'Left Corner-Forward', short: 'LCF' },
];

// Position indices (0-14) grouped into rows for a "pitch" layout,
// ordered top (attack) to bottom (goalkeeper).
export const PITCH_ROWS: number[][] = [
  [12, 13, 14], // full-forward line
  [9, 10, 11], // half-forward line
  [7, 8], // midfield
  [4, 5, 6], // half-back line
  [1, 2, 3], // full-back line
  [0], // goalkeeper
];

/** The line (row of PITCH_ROWS) a position belongs to, e.g. RHB/CB/LHB. */
export function lineOf(position: number): number[] {
  return PITCH_ROWS.find((row) => row.includes(position)) ?? [position];
}
