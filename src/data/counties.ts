export interface CountyOpponent {
  name: string;
  min: number;
  max: number;
}

// The four other counties in Limerick's 2026 Munster round-robin group.
export const MUNSTER_GROUP_OPPONENTS: CountyOpponent[] = [
  { name: 'Cork', min: 84, max: 95 },
  { name: 'Clare', min: 82, max: 93 },
  { name: 'Tipperary', min: 80, max: 92 },
  { name: 'Waterford', min: 76, max: 89 },
];

// Faced if Limerick finish 3rd in the Munster group and enter the qualifiers.
export const QUALIFIER_OPPONENTS: CountyOpponent[] = [
  { name: 'Wexford', min: 76, max: 89 },
  { name: 'Dublin', min: 74, max: 87 },
  { name: 'Westmeath', min: 72, max: 84 },
  { name: 'Antrim', min: 70, max: 84 },
  { name: 'Laois', min: 70, max: 82 },
  { name: 'Carlow', min: 68, max: 80 },
];

// All-Ireland Quarter-Final opponents.
export const QUARTER_FINAL_OPPONENTS: CountyOpponent[] = [
  { name: 'Galway', min: 84, max: 96 },
  { name: 'Kilkenny', min: 85, max: 97 },
  { name: 'Wexford', min: 78, max: 90 },
  { name: 'Dublin', min: 76, max: 88 },
];

// All-Ireland Semi-Final opponents.
export const SEMI_FINAL_OPPONENTS: CountyOpponent[] = [
  { name: 'Kilkenny', min: 86, max: 98 },
  { name: 'Galway', min: 85, max: 97 },
  { name: 'Cork', min: 84, max: 96 },
  { name: 'Tipperary', min: 84, max: 96 },
];

// All-Ireland Final opponents.
export const FINAL_OPPONENTS: CountyOpponent[] = [
  { name: 'Kilkenny', min: 88, max: 99 },
  { name: 'Galway', min: 87, max: 98 },
  { name: 'Cork', min: 86, max: 97 },
];
