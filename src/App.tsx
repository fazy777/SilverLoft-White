import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GalaxyScene } from './three/GalaxyScene';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import ForgeSection from './sections/ForgeSection';
import TitanSection from './sections/TitanSection';
import GlobeSection from './sections/GlobeSection';
import TeamSection from './sections/TeamSection';
import ContactSection from './sections/ContactSection';
import TunnelSection from './sections/TunnelSection';
import CoreSection from './sections/CoreSection';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<GalaxyScene | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Initialize Three.js galaxy
    if (canvasContainerRef.current && !galaxyRef.current) {
      const galaxy = new GalaxyScene(canvasContainerRef.current);
      galaxyRef.current = galaxy;
    }

    // Section-based galaxy opacity/visibility
    const sections = ['#hero', '#services', '#analytics', '#global', '#team', '#process', '#contact'];
    sections.forEach((id) => {
      const el = document.querySelector(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (!galaxyRef.current) return;
          // Adjust galaxy based on section
          if (id === '#process') {
            // Hide galaxy in heavy 3D sections
            galaxyRef.current.setGalaxyOpacity(0);
          } else if (id === '#services') {
            galaxyRef.current.setGalaxyOpacity(0.6);
          } else if (id === '#analytics') {
            galaxyRef.current.setGalaxyOpacity(0.5);
          } else if (id === '#team') {
            galaxyRef.current.setGalaxyOpacity(0.4);
          } else if (id === '#contact') {
            galaxyRef.current.setGalaxyOpacity(0.3);
          } else {
            galaxyRef.current.setGalaxyOpacity(1);
          }
        },
        onEnterBack: () => {
          if (!galaxyRef.current) return;
          if (id === '#process') {
            galaxyRef.current.setGalaxyOpacity(0);
          } else if (id === '#services') {
            galaxyRef.current.setGalaxyOpacity(0.6);
          } else if (id === '#analytics') {
            galaxyRef.current.setGalaxyOpacity(0.5);
          } else if (id === '#team') {
            galaxyRef.current.setGalaxyOpacity(0.4);
          } else if (id === '#contact') {
            galaxyRef.current.setGalaxyOpacity(0.3);
          } else {
            galaxyRef.current.setGalaxyOpacity(1);
          }
        },
      });
    });

    return () => {
      lenis.destroy();
      galaxyRef.current?.dispose();
      galaxyRef.current = null;
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="relative bg-transparent">
      {/* Three.js Galaxy Background Canvas */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Page Content */}
      <main className="relative z-10">
        <HeroSection />
        <ForgeSection />
        <TitanSection />
        <GlobeSection />
        <TeamSection />
        <TunnelSection />
        <CoreSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
