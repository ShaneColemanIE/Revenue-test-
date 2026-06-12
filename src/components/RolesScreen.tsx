import { useState } from 'react';
import { POSITIONS } from '../data/positions';
import type { Candidate } from '../data/squads';
import type { Roles } from '../lib/simulate';

interface RolesScreenProps {
  team: Candidate[];
  onConfirm: (roles: Roles) => void;
}

const ROLE_DEFINITIONS: { key: keyof Roles; label: string; description: string }[] = [
  { key: 'captain', label: 'Captain', description: 'Leads the team out and lifts the cup if you go all the way.' },
  { key: 'freeTaker', label: 'Free-Taker', description: 'Takes the frees and 65s — a steady source of points.' },
  { key: 'penaltyTaker', label: 'Penalty-Taker', description: 'Steps up if a penalty is awarded.' },
];

export function RolesScreen({ team, onConfirm }: RolesScreenProps) {
  const [roles, setRoles] = useState<Partial<Roles>>({});

  const ready = roles.captain !== undefined && roles.freeTaker !== undefined && roles.penaltyTaker !== undefined;

  function select(key: keyof Roles, index: number) {
    setRoles((prev) => ({ ...prev, [key]: index }));
  }

  return (
    <div className="px-4 pb-12 flex flex-col items-center gap-6 animate-pop-in">
      <div className="text-center">
        <p className="text-saffron font-semibold uppercase tracking-widest text-xs sm:text-sm">
          One last thing
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Pick Your Leaders</h2>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-6">
        {ROLE_DEFINITIONS.map(({ key, label, description }) => (
          <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-saffron">{label}</h3>
            <p className="text-emerald-100/70 text-xs sm:text-sm mt-1 mb-4">{description}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {team.map((player, i) => {
                const selected = roles[key] === i;
                return (
                  <button
                    key={i}
                    onClick={() => select(key, i)}
                    className={`rounded-xl px-2 py-2 text-center border transition-colors ${
                      selected
                        ? 'bg-saffron/20 border-saffron ring-2 ring-saffron'
                        : 'bg-white/10 border-white/15 hover:bg-white/15'
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-saffron font-bold">
                      {POSITIONS[i].short}
                    </p>
                    <p className="text-xs sm:text-sm font-bold mt-0.5 truncate">{player.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!ready}
        onClick={() => ready && onConfirm(roles as Roles)}
        className={`font-extrabold text-lg sm:text-xl px-10 py-4 rounded-full shadow-lg transition-transform ${
          ready
            ? 'bg-saffron text-limerick-dark shadow-saffron/30 hover:scale-105 active:scale-95'
            : 'bg-white/10 text-emerald-100/40 cursor-not-allowed'
        }`}
      >
        Simulate the Championship
      </button>
    </div>
  );
}
