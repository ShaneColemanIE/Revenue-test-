import { useEffect, useState } from 'react';
import { formatScore, type ChampionshipResult, type MatchResult } from '../lib/simulate';

interface ResultScreenProps {
  result: ChampionshipResult;
  overall: number;
  onRestart: () => void;
}

export function ResultScreen({ result, overall, onRestart }: ResultScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= result.rounds.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1100);
    return () => clearTimeout(timer);
  }, [visibleCount, result.rounds.length]);

  const done = visibleCount >= result.rounds.length;
  const lastRound = result.rounds[result.rounds.length - 1];

  return (
    <div className="px-4 pb-12 flex flex-col items-center gap-6 animate-pop-in">
      <div className="text-center">
        <p className="text-saffron font-semibold uppercase tracking-widest text-xs sm:text-sm">
          Championship Simulation
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Dream XV Overall: {overall}</h2>
      </div>

      <div className="w-full max-w-md space-y-3">
        {result.rounds.slice(0, visibleCount).map((round, i) => (
          <RoundCard key={i} round={round} />
        ))}
      </div>

      {!done && (
        <p className="text-emerald-100/60 text-sm sm:text-base animate-pulse">
          Simulating the next round&hellip;
        </p>
      )}

      {done && (
        <div className="text-center animate-pop-in">
          {result.champions ? (
            <>
              <p className="text-4xl sm:text-6xl font-black animate-shine bg-clip-text text-transparent">
                ALL-IRELAND CHAMPIONS!
              </p>
              <p className="text-emerald-100/80 mt-2">
                Your Dream XV brought Liam MacCarthy home to the Gaelic Grounds.
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl sm:text-4xl font-extrabold text-saffron">Championship Over</p>
              <p className="text-emerald-100/80 mt-2">
                Limerick's run ended at the {lastRound.round} stage, beaten by {lastRound.opponent}.
              </p>
            </>
          )}

          <button
            onClick={onRestart}
            className="mt-6 bg-limerick-light text-white font-extrabold text-lg px-10 py-3.5 rounded-full shadow-lg shadow-limerick-light/30 hover:scale-105 active:scale-95 transition-transform"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

function RoundCard({ round }: { round: MatchResult }) {
  return (
    <div
      className={`rounded-xl border-2 p-4 flex items-center justify-between gap-3 animate-pop-in ${
        round.won ? 'border-limerick-light bg-limerick-light/10' : 'border-red-400/60 bg-red-500/10'
      }`}
    >
      <div>
        <p className="text-xs uppercase tracking-wider text-saffron font-bold">{round.round}</p>
        <p className="font-bold">Limerick vs {round.opponent}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-extrabold text-lg">
          {formatScore(round.myScore)} &ndash; {formatScore(round.oppScore)}
        </p>
        <p className={`text-xs font-bold ${round.won ? 'text-limerick-light' : 'text-red-400'}`}>
          {round.won ? 'WIN' : 'LOSS'}
        </p>
      </div>
    </div>
  );
}
