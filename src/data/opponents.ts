export interface Opponent {
  name: string;
  min: number;
  max: number;
}

// Other counties Limerick might run into on the road to Croke Park,
// roughly grouped by typical championship strength.
export const ROUND_OPPONENTS: Opponent[][] = [
  // Round 1 - Munster / provincial round
  [
    { name: 'Clare', min: 78, max: 90 },
    { name: 'Waterford', min: 76, max: 88 },
    { name: 'Tipperary', min: 80, max: 92 },
    { name: 'Cork', min: 80, max: 92 },
    { name: 'Offaly', min: 70, max: 82 },
    { name: 'Antrim', min: 68, max: 80 },
  ],
  // Quarter-Final
  [
    { name: 'Wexford', min: 76, max: 88 },
    { name: 'Dublin', min: 74, max: 86 },
    { name: 'Galway', min: 82, max: 94 },
    { name: 'Westmeath', min: 72, max: 84 },
    { name: 'Laois', min: 70, max: 82 },
  ],
  // Semi-Final
  [
    { name: 'Cork', min: 82, max: 94 },
    { name: 'Galway', min: 83, max: 95 },
    { name: 'Tipperary', min: 82, max: 94 },
    { name: 'Clare', min: 81, max: 93 },
  ],
  // Final
  [
    { name: 'Kilkenny', min: 86, max: 98 },
    { name: 'Cork', min: 85, max: 97 },
    { name: 'Galway', min: 85, max: 96 },
    { name: 'Tipperary', min: 85, max: 96 },
  ],
];

export const ROUND_NAMES = [
  'Munster Round 1',
  'All-Ireland Quarter-Final',
  'All-Ireland Semi-Final',
  'All-Ireland Final',
];
