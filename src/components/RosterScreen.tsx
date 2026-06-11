import { POSITIONS } from '../data/positions';
import type { Candidate } from '../data/squads';

interface RosterScreenProps {
  team: Candidate[];
  onSimulate: () => void;
}

// Rows ordered top (attack) to bottom (goalkeeper), like a team-sheet pitch graphic.
const ROWS: number[][] = [
  [12, 13, 14], // full-forward line
  [9, 10, 11], // half-forward line
  [7, 8], // midfield
  [4, 5, 6], // half-back line
  [1, 2, 3], // full-back line
  [0], // goalkeeper
];

export function RosterScreen({ team, onSimulate }: RosterScreenProps) {
  const overall = Math.round(team.reduce((sum, p) => sum + p.rating, 0) / team.length);

  return (
    <div className="px-4 pb-12 flex flex-col items-center gap-6 animate-pop-in">
      <div className="text-center">
        <p className="text-saffron font-semibold uppercase tracking-widest text-xs sm:text-sm">
          Your Dream XV is ready
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Overall Rating: {overall}</h2>
      </div>

      <div className="w-full max-w-3xl rounded-2xl border-2 border-limerick-light/40 bg-gradient-to-b from-limerick-light/10 to-limerick-dark/40 p-3 sm:p-6 space-y-2 sm:space-y-3">
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0,1fr))` }}
          >
            {row.map((posIdx) => (
              <PlayerCard
                key={posIdx}
                candidate={team[posIdx]}
                positionShort={POSITIONS[posIdx].short}
              />
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={onSimulate}
        className="bg-saffron text-limerick-dark font-extrabold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg shadow-saffron/30 hover:scale-105 active:scale-95 transition-transform"
      >
        Simulate the Championship
      </button>
    </div>
  );
}

function PlayerCard({ candidate, positionShort }: { candidate: Candidate; positionShort: string }) {
  return (
    <div className="bg-white/10 border border-white/15 rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-center backdrop-blur-sm">
      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-saffron font-bold">
        {positionShort}
      </p>
      <p className="font-extrabold text-sm sm:text-base leading-tight mt-0.5">{candidate.name}</p>
      <p className="text-[10px] sm:text-xs text-emerald-100/70 mt-0.5">{candidate.year}</p>
      <p className="text-[10px] sm:text-xs font-bold text-saffron mt-1">{candidate.rating}</p>
    </div>
  );
}
