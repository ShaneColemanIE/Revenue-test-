import { useState } from 'react';
import { Header } from './components/Header';
import { IntroScreen } from './components/IntroScreen';
import { DraftScreen } from './components/DraftScreen';
import { RosterScreen } from './components/RosterScreen';
import { ResultScreen } from './components/ResultScreen';
import { candidatesForPosition, NUM_POSITIONS, type Candidate } from './data/squads';
import { simulateChampionship, type ChampionshipResult } from './lib/simulate';

type Screen = 'intro' | 'draft' | 'roster' | 'result';

function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [team, setTeam] = useState<(Candidate | null)[]>(Array(NUM_POSITIONS).fill(null));
  const [currentPosition, setCurrentPosition] = useState(0);
  const [target, setTarget] = useState<Candidate | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [championship, setChampionship] = useState<ChampionshipResult | null>(null);
  const [overall, setOverall] = useState(0);

  function handleSpin() {
    const candidates = candidatesForPosition(currentPosition);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    setTarget(chosen);
    setSpinning(true);
  }

  function handleSpinEnd() {
    setSpinning(false);
  }

  function handleContinue() {
    if (!target) return;

    const nextTeam = [...team];
    nextTeam[currentPosition] = target;
    setTeam(nextTeam);

    if (currentPosition < NUM_POSITIONS - 1) {
      setCurrentPosition(currentPosition + 1);
      setTarget(null);
    } else {
      setScreen('roster');
    }
  }

  function handleSimulate() {
    const completeTeam = team as Candidate[];
    const rating = Math.round(
      completeTeam.reduce((sum, p) => sum + p.rating, 0) / completeTeam.length,
    );
    setOverall(rating);
    setChampionship(simulateChampionship(rating));
    setScreen('result');
  }

  function handleRestart() {
    setTeam(Array(NUM_POSITIONS).fill(null));
    setCurrentPosition(0);
    setTarget(null);
    setSpinning(false);
    setChampionship(null);
    setScreen('intro');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {screen === 'intro' && <IntroScreen onStart={() => setScreen('draft')} />}

        {screen === 'draft' && (
          <DraftScreen
            currentPosition={currentPosition}
            team={team}
            target={target}
            spinning={spinning}
            onSpin={handleSpin}
            onSpinEnd={handleSpinEnd}
            onContinue={handleContinue}
          />
        )}

        {screen === 'roster' && team.every((p): p is Candidate => p !== null) && (
          <RosterScreen team={team} onSimulate={handleSimulate} />
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
