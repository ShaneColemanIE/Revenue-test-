import { POSITIONS } from '../data/positions';
import { candidatesForPosition, type Candidate } from '../data/squads';
import { SpinReel } from './SpinReel';

interface DraftScreenProps {
  currentPosition: number;
  team: (Candidate | null)[];
  target: Candidate | null;
  spinning: boolean;
  onSpin: () => void;
  onSpinEnd: () => void;
  onContinue: () => void;
}

export function DraftScreen({
  currentPosition,
  team,
  target,
  spinning,
  onSpin,
  onSpinEnd,
  onContinue,
}: DraftScreenProps) {
  const position = POSITIONS[currentPosition];
  const candidates = candidatesForPosition(currentPosition);
  const isLastPosition = currentPosition === team.length - 1;
  const hasResult = target !== null && !spinning;

  return (
    <div className="px-4 pb-12 flex flex-col items-center gap-6 animate-pop-in">
      <ProgressDots team={team} current={currentPosition} />

      <div className="text-center">
        <p className="text-saffron font-semibold uppercase tracking-widest text-xs sm:text-sm">
          Position {currentPosition + 1} of {team.length}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">{position.label}</h2>
      </div>

      <SpinReel key={currentPosition} candidates={candidates} target={target} onSpinEnd={onSpinEnd} />

      <div className="h-14 flex items-center">
        {!target && (
          <button
            onClick={onSpin}
            className="bg-saffron text-limerick-dark font-extrabold text-lg px-10 py-3.5 rounded-full shadow-lg shadow-saffron/30 hover:scale-105 active:scale-95 transition-transform"
          >
            Spin
          </button>
        )}

        {spinning && (
          <p className="text-emerald-100/60 text-sm sm:text-base animate-pulse">
            The wheel is spinning&hellip;
          </p>
        )}

        {hasResult && (
          <button
            onClick={onContinue}
            className="bg-limerick-light text-white font-extrabold text-lg px-10 py-3.5 rounded-full shadow-lg shadow-limerick-light/30 hover:scale-105 active:scale-95 transition-transform animate-pop-in"
          >
            {isLastPosition ? 'View Your Dream XV' : 'Next Position'}
          </button>
        )}
      </div>
    </div>
  );
}

function ProgressDots({ team, current }: { team: (Candidate | null)[]; current: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
      {POSITIONS.map((pos, i) => {
        const filled = team[i] !== null;
        const isCurrent = i === current;
        return (
          <div
            key={i}
            title={`${i + 1}. ${pos.label}`}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold border transition-colors ${
              filled
                ? 'bg-limerick-light border-limerick-light text-white'
                : isCurrent
                  ? 'border-saffron text-saffron animate-pulse'
                  : 'border-white/15 text-emerald-100/40'
            }`}
          >
            {pos.short}
          </div>
        );
      })}
    </div>
  );
}
