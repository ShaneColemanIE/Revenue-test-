interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 px-4 pb-12 animate-pop-in">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl shadow-2xl backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-saffron mb-3">How to play</h2>
        <ol className="text-left space-y-3 text-emerald-50/90 text-sm sm:text-base list-decimal list-inside">
          <li>
            Spin the wheel for each of the 15 positions on the team &mdash; from goalkeeper to
            full-forward.
          </li>
          <li>
            Every spin lands on a real Limerick player from a single season between 1990 and
            2026, complete with that year's championship result.
          </li>
          <li>
            Once your Dream XV is complete, simulate a championship run and see whether your
            mash-up of legends and modern stars can bring Liam MacCarthy back to the Gaelic
            Grounds.
          </li>
        </ol>
        <p className="text-xs text-emerald-100/60 mt-4">
          Squads are inspired by real Limerick senior hurling panels from each era. Exact
          lineups, positions and player ratings are approximated for gameplay balance only.
        </p>
      </div>
      <button
        onClick={onStart}
        className="bg-saffron text-limerick-dark font-extrabold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg shadow-saffron/30 hover:scale-105 active:scale-95 transition-transform"
      >
        Start the Draft
      </button>
    </div>
  );
}
