import { PITCH_ROWS, POSITIONS } from '../data/positions';
import type { Candidate } from '../data/squads';

interface RosterScreenProps {
  team: Candidate[];
  onContinue: () => void;
}

export function RosterScreen({ team, onContinue }: RosterScreenProps) {
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
        {PITCH_ROWS.map((row, i) => (
          <div
            key={i}
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0,1fr))` }}
          >
            {row.map((posIdx) => (
              <PlayerCard key={posIdx} candidate={team[posIdx]} positionShort={POSITIONS[posIdx].short} />
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="bg-saffron text-limerick-dark font-extrabold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg shadow-saffron/30 hover:scale-105 active:scale-95 transition-transform"
      >
        Pick Your Leaders
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
