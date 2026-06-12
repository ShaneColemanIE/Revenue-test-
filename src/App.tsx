import { useState } from 'react';
import { Header } from './components/Header';
import { IntroScreen } from './components/IntroScreen';
import { DraftScreen } from './components/DraftScreen';
import { RosterScreen } from './components/RosterScreen';
import { RolesScreen } from './components/RolesScreen';
import { ResultScreen } from './components/ResultScreen';
import { SQUADS, NUM_POSITIONS, type Candidate, type YearSquad } from './data/squads';
import { DIFFICULTIES, type Difficulty } from './data/difficulty';
import { lineOf } from './data/positions';
import { simulateChampionship, type ChampionshipResult, type Roles } from './lib/simulate';

function isSelectable(candidate: Candidate, team: (Candidate | null)[], draftedNames: string[]): boolean {
  if (draftedNames.includes(candidate.name)) return false;
  return lineOf(candidate.position).some((p) => team[p] === null);
}

type Screen = 'intro' | 'draft' | 'roster' | 'roles' | 'result';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [rerollsLeft, setRerollsLeft] = useState<number>(DIFFICULTIES.normal.rerolls);
  const [team, setTeam] = useState<(Candidate | null)[]>(Array(NUM_POSITIONS).fill(null));
  const [draftedNames, setDraftedNames] = useState<string[]>([]);
  const [pickNumber, setPickNumber] = useState(0);
  const [spunSquad, setSpunSquad] = useState<YearSquad | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Candidate | null>(null);
  const [spinAttempt, setSpinAttempt] = useState(0);
  const [championship, setChampionship] = useState<ChampionshipResult | null>(null);
  const [overall, setOverall] = useState(0);

  function startSpin() {
    const available = SQUADS.filter((squad) =>
      squad.players.some((p) => isSelectable(p, team, draftedNames)),
    );
    const pool = available.length > 0 ? available : SQUADS;
    const squad = pool[Math.floor(Math.random() * pool.length)];
    setSpunSquad(squad);
    setSelectedPlayer(null);
    setSpinning(true);
    setSpinAttempt((a) => a + 1);
  }

  function handleStart(chosenDifficulty: Difficulty) {
    setDifficulty(chosenDifficulty);
    setRerollsLeft(DIFFICULTIES[chosenDifficulty].rerolls);
    setScreen('draft');
  }

  function handleSpinEnd() {
    setSpinning(false);
  }

  function handleReroll() {
    if (rerollsLeft <= 0) return;
    setRerollsLeft((r) => r - 1);
    startSpin();
  }

  function handleSelectPlayer(candidate: Candidate) {
    setSelectedPlayer(candidate);
  }

  function handlePlacePlayer(positionIndex: number) {
    if (!selectedPlayer) return;

    const nextTeam = [...team];
    nextTeam[positionIndex] = selectedPlayer;
    setTeam(nextTeam);
    setDraftedNames((names) => [...names, selectedPlayer.name]);
    setSelectedPlayer(null);
    setSpunSquad(null);

    if (pickNumber + 1 >= NUM_POSITIONS) {
      setScreen('roster');
    } else {
      setPickNumber((p) => p + 1);
    }
  }

  function handleRolesConfirm(roles: Roles) {
    const completeTeam = team as Candidate[];
    const rating = Math.round(completeTeam.reduce((sum, p) => sum + p.rating, 0) / completeTeam.length);
    setOverall(rating);
    setChampionship(simulateChampionship(completeTeam, roles));
    setScreen('result');
  }

  function handleRestart() {
    setTeam(Array(NUM_POSITIONS).fill(null));
    setDraftedNames([]);
    setPickNumber(0);
    setSpunSquad(null);
    setSelectedPlayer(null);
    setSpinning(false);
    setSpinAttempt(0);
    setRerollsLeft(DIFFICULTIES[difficulty].rerolls);
    setChampionship(null);
    setScreen('intro');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {screen === 'intro' && <IntroScreen onStart={handleStart} />}

        {screen === 'draft' && (
          <DraftScreen
            pickNumber={pickNumber}
            team={team}
            draftedNames={draftedNames}
            spunSquad={spunSquad}
            spinning={spinning}
            selectedPlayer={selectedPlayer}
            rerollsLeft={rerollsLeft}
            spinAttempt={spinAttempt}
            onSpin={startSpin}
            onSpinEnd={handleSpinEnd}
            onReroll={handleReroll}
            onSelectPlayer={handleSelectPlayer}
            onPlacePlayer={handlePlacePlayer}
          />
        )}

        {screen === 'roster' && team.every((p): p is Candidate => p !== null) && (
          <RosterScreen team={team} onContinue={() => setScreen('roles')} />
        )}

        {screen === 'roles' && team.every((p): p is Candidate => p !== null) && (
          <RolesScreen team={team} onConfirm={handleRolesConfirm} />
        )}

        {screen === 'result' && championship && (
          <ResultScreen result={championship} overall={overall} onRestart={handleRestart} />
        )}
      </main>
      <footer className="text-center text-xs text-emerald-100/40 pb-6 px-4">
        Unofficial fan project &middot; not affiliated with the GAA or Limerick GAA. Player
        ratings and championship results are fictional and for entertainment purposes only.
      </footer>
    </div>
  );
}

export default App;
