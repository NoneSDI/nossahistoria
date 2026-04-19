import { useRef } from "react";
import type { LoveData } from "../../../lib/types";
import { SiteProvider } from "./SiteContext";
import { ParticleBackground } from "../ParticleBackground";
import { AnimatedBackground } from "../AnimatedBackground";
import { HeroSection } from "../HeroSection";
import { TimelineSection } from "../TimelineSection";
import { GallerySection } from "../GallerySection";
import { LoveLetterSection } from "../LoveLetterSection";
import { SurprisesSection } from "../SurprisesSection";
import { CounterSection } from "../CounterSection";
import { FinalSection } from "../FinalSection";
import { FooterSection } from "../FooterSection";
import { MusicPlayer } from "../MusicPlayer";

interface Props {
  data: LoveData;
  minimal?: boolean;
}

export function SiteTemplate({ data, minimal = false }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <SiteProvider data={data}>
      <div className="bg-black min-h-screen overflow-x-hidden">
        {!minimal && <AnimatedBackground />}
        {!minimal && <ParticleBackground />}
        <MusicPlayer />
        <HeroSection onStart={scrollToContent} />
        <div ref={contentRef}>
          <CounterSection />
          <TimelineSection />
          <GallerySection />
          <LoveLetterSection />
          <SurprisesSection />
          <FinalSection />
          <FooterSection />
        </div>
      </div>
    </SiteProvider>
  );
}
