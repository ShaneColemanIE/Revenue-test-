export const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    rerolls: 3,
    description: "Not happy with the team you spin? Re-roll up to 3 times.",
  },
  normal: {
    label: 'Normal',
    rerolls: 1,
    description: 'One re-roll if you spin a team you really don’t fancy.',
  },
  hard: {
    label: 'Hard',
    rerolls: 0,
    description: 'No re-rolls. Whatever team you spin, you’re stuck with it.',
  },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;
