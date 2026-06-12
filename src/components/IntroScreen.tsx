import { useState } from 'react';
import { DIFFICULTIES, type Difficulty } from '../data/difficulty';

interface IntroScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  return (
    <div className="flex flex-col items-center text-center gap-6 px-4 pb-12 animate-pop-in">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl shadow-2xl backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-saffron mb-3">How to play</h2>
        <ol className="text-left space-y-3 text-emerald-50/90 text-sm sm:text-base list-decimal list-inside">
          <li>
            Spin the wheel to reveal a Limerick team from a single season between 1990 and 2026,
            complete with that year's championship result.
          </li>
          <li>
            Pick any player from that team's lineup and slot them into whichever position you
            want on your own Dream XV. Keep spinning until all 15 positions are filled.
          </li>
          <li>
            Pick your captain, free-taker and penalty-taker, then simulate a full All-Ireland
            campaign &mdash; starting with the Munster round-robin &mdash; and see if your Dream
            XV can bring Liam MacCarthy home.
          </li>
        </ol>
        <p className="text-xs text-emerald-100/60 mt-4">
          Squads are inspired by real Limerick senior hurling panels from each era. Exact
          lineups, positions and player ratings are approximated for gameplay balance only.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-saffron mb-3">Choose your difficulty</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {Object.entries(DIFFICULTIES).map(([key, option]) => {
            const value = key as Difficulty;
            const selected = difficulty === value;
            return (
              <button
                key={value}
                onClick={() => setDifficulty(value)}
                className={`text-left rounded-xl border-2 p-4 transition-colors ${
                  selected
                    ? 'border-saffron bg-saffron/15'
                    : 'border-white/15 bg-white/5 hover:border-white/30'
                }`}
              >
                <p className={`font-extrabold text-lg ${selected ? 'text-saffron' : ''}`}>{option.label}</p>
                <p className="text-emerald-100/70 text-xs sm:text-sm mt-1">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onStart(difficulty)}
        className="bg-saffron text-limerick-dark font-extrabold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg shadow-saffron/30 hover:scale-105 active:scale-95 transition-transform"
      >
        Start the Draft
      </button>
    </div>
  );
}
