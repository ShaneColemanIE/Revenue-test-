import { useEffect, useState } from 'react';
import { POSITIONS } from '../data/positions';
import {
  formatScore,
  type ChampionshipResult,
  type GroupTableRow,
  type MatchResult,
} from '../lib/simulate';

interface ResultScreenProps {
  result: ChampionshipResult;
  overall: number;
  onRestart: () => void;
}

type ResultItem =
  | { kind: 'group-match'; match: MatchResult }
  | { kind: 'group-table'; table: GroupTableRow[] }
  | { kind: 'knockout-match'; match: MatchResult }
  | { kind: 'summary' };

export function ResultScreen({ result, overall, onRestart }: ResultScreenProps) {
  const items: ResultItem[] = [
    ...result.groupMatches.map((match): ResultItem => ({ kind: 'group-match', match })),
    { kind: 'group-table', table: result.groupTable },
    ...result.knockout.map((match): ResultItem => ({ kind: 'knockout-match', match })),
    { kind: 'summary' },
  ];

  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= items.length) return;
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1100);
    return () => clearTimeout(timer);
  }, [visibleCount, items.length]);

  const done = visibleCount >= items.length;
  const userRank = result.groupTable.findIndex((row) => row.isUser);
  const lastKnockout = result.knockout[result.knockout.length - 1];

  return (
    <div className="px-4 pb-12 flex flex-col items-center gap-6 animate-pop-in">
      <div className="text-center">
        <p className="text-saffron font-semibold uppercase tracking-widest text-xs sm:text-sm">
          Championship Simulation
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Dream XV Overall: {overall}</h2>
      </div>

      <div className="w-full max-w-md space-y-3">
        {items.slice(0, visibleCount).map((item, i) => {
          switch (item.kind) {
            case 'group-match':
              return <RoundCard key={i} round={item.match} />;
            case 'group-table':
              return <GroupTable key={i} table={item.table} />;
            case 'knockout-match':
              return <RoundCard key={i} round={item.match} />;
            case 'summary':
              return null;
          }
        })}
      </div>

      {!done && (
        <p className="text-emerald-100/60 text-sm sm:text-base animate-pulse">
          Simulating the next round&hellip;
        </p>
      )}

      {done && (
        <div className="w-full max-w-md flex flex-col items-center gap-4 text-center animate-pop-in">
          {result.champions ? (
            <>
              <p className="text-4xl sm:text-6xl font-black animate-shine bg-clip-text text-transparent">
                ALL-IRELAND CHAMPIONS!
              </p>
              <p className="text-emerald-100/80">
                Your Dream XV brought Liam MacCarthy home to the Gaelic Grounds.
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl sm:text-4xl font-extrabold text-saffron">Championship Over</p>
              {lastKnockout ? (
                <p className="text-emerald-100/80">
                  Limerick's run ended at the {lastKnockout.round} stage, beaten by{' '}
                  {lastKnockout.opponent}.
                </p>
              ) : (
                <p className="text-emerald-100/80">
                  Limerick finished {ordinal(userRank + 1)} in the Munster Round-Robin and missed
                  out on the knockout stages.
                </p>
              )}
            </>
          )}

          <div className="w-full grid sm:grid-cols-2 gap-3">
            <StatCard
              label="Top Scorer"
              name={result.topScorer.candidate.name}
              detail={`${POSITIONS[result.topScorer.position].label} · ${result.topScorer.total} points scored`}
            />
            <StatCard
              label="Key Player"
              name={result.keyPlayer.candidate.name}
              detail={result.keyPlayer.blurb}
            />
          </div>

          <button
            onClick={onRestart}
            className="mt-2 bg-limerick-light text-white font-extrabold text-lg px-10 py-3.5 rounded-full shadow-lg shadow-limerick-light/30 hover:scale-105 active:scale-95 transition-transform"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

function RoundCard({ round }: { round: MatchResult }) {
  const borderColor =
    round.outcome === 'win'
      ? 'border-limerick-light bg-limerick-light/10'
      : round.outcome === 'draw'
        ? 'border-saffron/60 bg-saffron/10'
        : 'border-red-400/60 bg-red-500/10';

  const resultLabel =
    round.outcome === 'win' ? 'WIN' : round.outcome === 'draw' ? 'DRAW' : 'LOSS';

  const resultColor =
    round.outcome === 'win'
      ? 'text-limerick-light'
      : round.outcome === 'draw'
        ? 'text-saffron'
        : 'text-red-400';

  return (
    <div className={`rounded-xl border-2 p-4 flex items-center justify-between gap-3 animate-pop-in ${borderColor}`}>
      <div>
        <p className="text-xs uppercase tracking-wider text-saffron font-bold">{round.round}</p>
        <p className="font-bold">Limerick vs {round.opponent}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-extrabold text-lg">
          {formatScore(round.myScore)} &ndash; {formatScore(round.oppScore)}
        </p>
        <p className={`text-xs font-bold ${resultColor}`}>{resultLabel}</p>
      </div>
    </div>
  );
}

function GroupTable({ table }: { table: GroupTableRow[] }) {
  return (
    <div className="rounded-xl border-2 border-white/15 bg-white/5 p-4 animate-pop-in overflow-x-auto">
      <p className="text-xs uppercase tracking-wider text-saffron font-bold mb-2">
        Munster Round-Robin Table
      </p>
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="text-emerald-100/60 text-left">
            <th className="py-1 pr-2">Team</th>
            <th className="px-1 text-center">P</th>
            <th className="px-1 text-center">W</th>
            <th className="px-1 text-center">D</th>
            <th className="px-1 text-center">L</th>
            <th className="px-1 text-center">F-A</th>
            <th className="px-1 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr
              key={row.team}
              className={`border-t border-white/10 ${row.isUser ? 'font-extrabold text-saffron' : ''}`}
            >
              <td className="py-1 pr-2">{row.team}</td>
              <td className="px-1 text-center">{row.played}</td>
              <td className="px-1 text-center">{row.won}</td>
              <td className="px-1 text-center">{row.drawn}</td>
              <td className="px-1 text-center">{row.lost}</td>
              <td className="px-1 text-center">
                {row.for}-{row.against}
              </td>
              <td className="px-1 text-center">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, name, detail }: { label: string; name: string; detail: string }) {
  return (
    <div className="rounded-xl border-2 border-white/15 bg-white/5 p-4 text-left">
      <p className="text-xs uppercase tracking-wider text-saffron font-bold">{label}</p>
      <p className="font-extrabold text-lg leading-tight mt-1">{name}</p>
      <p className="text-emerald-100/70 text-xs sm:text-sm mt-1">{detail}</p>
    </div>
  );
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}
