import { lineOf, POSITIONS } from '../data/positions';
import { SQUADS, type Candidate, type YearSquad } from '../data/squads';
import { TeamSpinReel } from './TeamSpinReel';
import { PlayerPicker } from './PlayerPicker';
import { PositionPicker } from './PositionPicker';

interface DraftScreenProps {
  pickNumber: number;
  team: (Candidate | null)[];
  draftedNames: string[];
  spunSquad: YearSquad | null;
  spinning: boolean;
  selectedPlayer: Candidate | null;
  rerollsLeft: number;
  spinAttempt: number;
  onSpin: () => void;
  onSpinEnd: () => void;
  onReroll: () => void;
  onSelectPlayer: (candidate: Candidate) => void;
  onPlacePlayer: (positionIndex: number) => void;
}

export function DraftScreen({
  pickNumber,
  team,
  draftedNames,
  spunSquad,
  spinning,
  selectedPlayer,
  rerollsLeft,
  spinAttempt,
  onSpin,
  onSpinEnd,
  onReroll,
  onSelectPlayer,
  onPlacePlayer,
}: DraftScreenProps) {
  const totalPositions = team.length;
  const hasResult = spunSquad !== null && !spinning;

  return (
    <div className="px-4 pb-12 flex flex-col items-center gap-6 animate-pop-in">
      <DraftProgress team={team} />

      <div className="text-center">
        <p className="text-saffron font-semibold uppercase tracking-widest text-xs sm:text-sm">
          Pick {pickNumber + 1} of {totalPositions}
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Spin for a Limerick Team</h2>
        {rerollsLeft > 0 && (
          <p className="text-emerald-100/60 text-xs sm:text-sm mt-1">
            Re-rolls remaining: {rerollsLeft}
          </p>
        )}
      </div>

      <TeamSpinReel key={spinAttempt} squads={SQUADS} target={spunSquad} onSpinEnd={onSpinEnd} />

      <div className="h-14 flex items-center">
        {!spunSquad && !spinning && (
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

        {hasResult && !selectedPlayer && rerollsLeft > 0 && (
          <button
            onClick={onReroll}
            className="bg-white/10 border border-white/20 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full hover:bg-white/15 active:scale-95 transition-transform animate-pop-in"
          >
            Re-roll ({rerollsLeft} left)
          </button>
        )}
      </div>

      {hasResult && !selectedPlayer && spunSquad && (
        <div className="w-full flex flex-col items-center gap-4 animate-pop-in">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-extrabold">
              Limerick {spunSquad.year} <span className="text-saffron">&middot; {spunSquad.status}</span>
            </p>
            <p className="text-emerald-100/70 text-sm mt-1">
              Pick a player from this team to add to your Dream XV
            </p>
          </div>
          <PlayerPicker
            squad={spunSquad}
            team={team}
            draftedNames={draftedNames}
            selected={selectedPlayer}
            onSelect={onSelectPlayer}
          />
        </div>
      )}

      {selectedPlayer && (
        <div className="w-full flex flex-col items-center gap-4 animate-pop-in">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-extrabold">{selectedPlayer.name}</p>
            <p className="text-emerald-100/70 text-sm mt-1">
              Choose a position in the {POSITIONS[selectedPlayer.position].short} line of your Dream XV
            </p>
          </div>
          <PositionPicker
            team={team}
            allowedPositions={lineOf(selectedPlayer.position)}
            onPlace={onPlacePlayer}
          />
        </div>
      )}
    </div>
  );
}

function DraftProgress({ team }: { team: (Candidate | null)[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
      {POSITIONS.map((pos, i) => {
        const occupant = team[i];
        return (
          <div
            key={i}
            title={`${i + 1}. ${pos.label}${occupant ? ` - ${occupant.name}` : ''}`}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold border transition-colors ${
              occupant
                ? 'bg-limerick-light border-limerick-light text-white'
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
