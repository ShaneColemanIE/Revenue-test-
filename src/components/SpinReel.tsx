import { useEffect, useMemo, useState } from 'react';
import type { Candidate } from '../data/squads';

interface SpinReelProps {
  candidates: Candidate[];
  target: Candidate | null;
  onSpinEnd: () => void;
}

const ITEM_HEIGHT = 92;
const REPEATS = 3;

export function SpinReel({ candidates, target, onSpinEnd }: SpinReelProps) {
  const [offset, setOffset] = useState(0);
  const [animate, setAnimate] = useState(false);

  const reel = useMemo<Candidate[]>(() => {
    if (!target) return [];

    const targetIdx = candidates.findIndex((c) => c.year === target.year);
    const extended: Candidate[] = [];
    for (let r = 0; r < REPEATS; r++) extended.push(...candidates);
    extended.push(...candidates.slice(0, targetIdx + 1));
    extended.push(candidates[(targetIdx + 1) % candidates.length]);
    return extended;
  }, [target, candidates]);

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
          Press <span className="text-saffron font-semibold">Spin</span> to draft a player for
          this position
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
        {reel.map((candidate, i) => (
          <ReelRow key={i} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}

function ReelRow({ candidate }: { candidate: Candidate }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-5 sm:px-6"
      style={{ height: ITEM_HEIGHT }}
    >
      <div className="text-left">
        <p className="font-extrabold text-lg sm:text-xl leading-tight">{candidate.name}</p>
        <p className="text-xs sm:text-sm text-emerald-100/70">
          {candidate.year} &middot; {candidate.status}
        </p>
      </div>
      <div className="shrink-0 w-11 h-11 rounded-full bg-saffron text-limerick-dark font-bold flex items-center justify-center text-sm">
        {candidate.rating}
      </div>
    </div>
  );
}
