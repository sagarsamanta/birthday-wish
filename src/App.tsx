import { useState } from 'react';
import { ExperienceProvider, useExperience } from '@/context/ExperienceContext';
import { useLenis } from '@/hooks/useLenis';

import { Backdrop } from '@/components/background/Backdrop';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MusicController } from '@/components/MusicController';
import { ScrollProgress } from '@/components/ScrollProgress';
import { SecretTrigger } from '@/components/SecretTrigger';
import { SecretMessage } from '@/components/SecretMessage';
import { ShakeListener } from '@/components/ShakeListener';
import { PullReveal } from '@/components/PullReveal';
import { FlowerFall } from '@/components/effects/FlowerFall';

import { Hero } from '@/sections/Hero';
import { StoryFlow } from '@/sections/StoryFlow';
import { Gallery } from '@/sections/Gallery';
import { LoveLetter } from '@/sections/LoveLetter';
import { Timeline } from '@/sections/Timeline';
import { FamilyWishes } from '@/sections/FamilyWishes';
import { Surprise } from '@/sections/Surprise';
import { Finale } from '@/sections/Finale';
import { Closing } from '@/sections/Closing';

function Experience() {
  const { started, start } = useExperience();
  const [showLoader, setShowLoader] = useState(true);
  useLenis();

  return (
    <>
      <Backdrop />
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
      <MusicController />
      <SecretTrigger />
      <SecretMessage />
      <ShakeListener />
      <PullReveal />
      <FlowerFall />
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
