import { lineOf, PITCH_ROWS, POSITIONS } from '../data/positions';
import type { Candidate, YearSquad } from '../data/squads';

interface PlayerPickerProps {
  squad: YearSquad;
  team: (Candidate | null)[];
  draftedNames: string[];
  selected: Candidate | null;
  onSelect: (candidate: Candidate) => void;
}

export function PlayerPicker({ squad, team, draftedNames, selected, onSelect }: PlayerPickerProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl border-2 border-limerick-light/40 bg-gradient-to-b from-limerick-light/10 to-limerick-dark/40 p-3 sm:p-6 space-y-2 sm:space-y-3">
      {PITCH_ROWS.map((row, i) => (
        <div
          key={i}
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0,1fr))` }}
        >
          {row.map((posIdx) => {
            const candidate = squad.players[posIdx];
            const isSelected = selected === candidate;
            const alreadyDrafted = draftedNames.includes(candidate.name);
            const lineFull = lineOf(candidate.position).every((p) => team[p] !== null);
            const disabled = alreadyDrafted || lineFull;

            return (
              <button
                key={posIdx}
                disabled={disabled}
                onClick={() => onSelect(candidate)}
                className={`rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-center border transition-colors ${
                  disabled
                    ? 'bg-white/5 border-white/10 opacity-40 cursor-not-allowed'
                    : `hover:scale-[1.03] active:scale-95 ${
                        isSelected
                          ? 'bg-saffron/20 border-saffron ring-2 ring-saffron'
                          : 'bg-white/10 border-white/15 hover:bg-white/15'
                      }`
                }`}
              >
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-saffron font-bold">
                  {POSITIONS[posIdx].short}
                </p>
                <p className="font-extrabold text-sm sm:text-base leading-tight mt-0.5">{candidate.name}</p>
                {disabled ? (
                  <p className="text-[10px] sm:text-xs font-bold text-emerald-100/50 mt-1">
                    {alreadyDrafted ? 'Drafted' : 'Line Full'}
                  </p>
                ) : (
                  <p className="text-[10px] sm:text-xs font-bold text-saffron mt-1">{candidate.rating}</p>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
