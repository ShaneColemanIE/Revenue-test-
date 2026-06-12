import { useEffect, useMemo, useState } from 'react';
import type { YearSquad } from '../data/squads';

interface TeamSpinReelProps {
  squads: YearSquad[];
  target: YearSquad | null;
  onSpinEnd: () => void;
}

const ITEM_HEIGHT = 92;
const REPEATS = 3;

export function TeamSpinReel({ squads, target, onSpinEnd }: TeamSpinReelProps) {
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);

  const reel = useMemo<YearSquad[]>(() => {
    if (!target) return [];

    const targetIdx = squads.findIndex((s) => s.year === target.year);
    const extended: YearSquad[] = [];
    for (let r = 0; r < REPEATS; r++) extended.push(...squads);
    extended.push(...squads.slice(0, targetIdx + 1));
    extended.push(squads[(targetIdx + 1) % squads.length]);
    return extended;
  }, [target, squads]);

  useEffect(() => {
    if (reel.length === 0) return;

    const frame1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimate(true);
        setOffset((reel.length - 2) * ITEM_HEIGHT);
      });
    });

    return () => cancelAnimationFrame(frame1);
  }, [reel]);

  if (!target || reel.length === 0) {
    return (
      <div className="relative h-[276px] w-full max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-saffron/40 bg-limerick-dark/40 flex items-center justify-center">
        <p className="text-emerald-100/60 text-sm sm:text-base px-6 text-center">
          Press <span className="text-saffron font-semibold">Spin</span> to reveal a Limerick team
          from history
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[276px] w-full max-w-md mx-auto overflow-hidden rounded-2xl border-2 border-saffron/60 bg-limerick-dark/60 shadow-inner">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[92px] border-y-2 border-saffron pointer-events-none z-20" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-limerick-dark to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-limerick-dark to-transparent pointer-events-none z-10" />
      <div
        style={{
          transform: `translateY(-${offset}px)`,
          transition: animate ? 'transform 3.2s cubic-bezier(0.1, 0.7, 0.15, 1)' : 'none',
        }}
        onTransitionEnd={onSpinEnd}
      >
        {reel.map((squad, i) => (
          <ReelRow key={i} squad={squad} />
        ))}
      </div>
    </div>
  );
}

function ReelRow({ squad }: { squad: YearSquad }) {
  const overall = Math.round(squad.players.reduce((sum, p) => sum + p.rating, 0) / squad.players.length);

  return (
    <div className="flex items-center justify-between gap-4 px-5 sm:px-6" style={{ height: ITEM_HEIGHT }}>
      <div className="text-left">
        <p className="font-extrabold text-lg sm:text-xl leading-tight">Limerick {squad.year}</p>
        <p className="text-xs sm:text-sm text-emerald-100/70">{squad.status}</p>
      </div>
      <div className="shrink-0 w-11 h-11 rounded-full bg-saffron text-limerick-dark font-bold flex items-center justify-center text-sm">
        {overall}
      </div>
    </div>
  );
}
