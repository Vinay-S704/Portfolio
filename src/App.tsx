import { useState } from 'react';
import BootSequence from './components/BootSequence';
import LoginScreen from './components/LoginScreen';
import Desktop from './components/Desktop';

type Stage = 'boot' | 'login' | 'desktop';

export default function App() {
  const [stage, setStage] = useState<Stage>('boot');

  return (
    <div className="h-screen w-screen overflow-hidden bg-term-bg">
      {stage === 'boot' && <BootSequence onComplete={() => setStage('login')} />}
      {stage === 'login' && <LoginScreen onLogin={() => setStage('desktop')} />}
      {stage === 'desktop' && <Desktop onExit={() => setStage('login')} />}
    </div>
  );
}
