import { useState } from 'react';
import { ExperienceProvider, useExperience } from '@/context/ExperienceContext';
import { useLenis } from '@/hooks/useLenis';
import { config } from '@/data/config';

import { Backdrop } from '@/components/background/Backdrop';
import { CountdownGate } from '@/components/CountdownGate';
import { TopControls } from '@/components/TopControls';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MusicController } from '@/components/MusicController';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SecretTrigger } from '@/components/SecretTrigger';
import { SecretMessage } from '@/components/SecretMessage';
import { ShakeListener } from '@/components/ShakeListener';
import { PullReveal } from '@/components/PullReveal';
import { FlowerFall } from '@/components/effects/FlowerFall';
import { Balloons } from '@/components/effects/Balloons';

import { Hero } from '@/sections/Hero';
import { StoryFlow } from '@/sections/StoryFlow';
import { Gallery } from '@/sections/Gallery';
import { LoveLetter } from '@/sections/LoveLetter';
import { Timeline } from '@/sections/Timeline';
import { FamilyWishes } from '@/sections/FamilyWishes';
import { Surprise } from '@/sections/Surprise';
import { Finale } from '@/sections/Finale';
import { Closing } from '@/sections/Closing';

/** Decide whether the experience should start locked behind the countdown. */
function computeLocked(): boolean {
  if (!config.unlockDate) return false;
  try {
    if (new URLSearchParams(window.location.search).has('preview')) return false;
  } catch {
    /* ignore */
  }
  const target = new Date(config.unlockDate).getTime();
  return Number.isFinite(target) && Date.now() < target;
}

function Experience() {
  const { started, start } = useExperience();
  const [showLoader, setShowLoader] = useState(true);
  const [locked, setLocked] = useState(computeLocked);
  useLenis();

  return (
    <>
      <Backdrop />

      {locked ? (
        <CountdownGate onUnlock={() => setLocked(false)} />
      ) : (
        <>
          <ScrollProgress />

          {showLoader && (
            <LoadingScreen onEnter={start} onDone={() => setShowLoader(false)} />
          )}

          {started && (
            <main className="relative">
              <Hero />
              <StoryFlow />
              <Gallery />
              <LoveLetter />
              <Timeline />
              <FamilyWishes />
              <Surprise />
              <Finale />
              <Closing />
            </main>
          )}

          {/* Persistent overlays & interactions */}
          <TopControls />
          <MusicController />
          <SecretTrigger />
          <SecretMessage />
          <ShakeListener />
          <PullReveal />
          <FlowerFall />
          <Balloons />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <ExperienceProvider>
      <Experience />
    </ExperienceProvider>
  );
}
