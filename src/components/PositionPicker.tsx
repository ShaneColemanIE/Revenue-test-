import { PITCH_ROWS, POSITIONS } from '../data/positions';
import type { Candidate } from '../data/squads';

interface PositionPickerProps {
  team: (Candidate | null)[];
  allowedPositions: number[];
  onPlace: (positionIndex: number) => void;
}

export function PositionPicker({ team, allowedPositions, onPlace }: PositionPickerProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl border-2 border-saffron/40 bg-limerick-dark/40 p-3 sm:p-6 space-y-2 sm:space-y-3">
      {PITCH_ROWS.map((row, i) => (
        <div
          key={i}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0,1fr))` }}
        >
          {row.map((posIdx) => {
            const occupant = team[posIdx];
            const allowed = allowedPositions.includes(posIdx);
            const clickable = occupant === null && allowed;

            return (
              <button
                key={posIdx}
                disabled={!clickable}
                onClick={() => onPlace(posIdx)}
                className={`rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-center border transition-transform ${
                  clickable
                    ? 'bg-saffron/10 border-saffron/50 hover:bg-saffron/20 hover:scale-[1.03] active:scale-95 cursor-pointer'
                    : 'bg-white/5 border-white/10 opacity-40 cursor-not-allowed'
                }`}
              >
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-saffron font-bold">
                  {POSITIONS[posIdx].short}
                </p>
                {occupant ? (
                  <p className="text-xs sm:text-sm font-bold mt-0.5 truncate">{occupant.name}</p>
                ) : (
                  <p className="text-xs sm:text-sm font-bold mt-0.5 text-emerald-100/50">Empty</p>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
