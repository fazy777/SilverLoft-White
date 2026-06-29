import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GlobeScene } from '../three/GlobeScene';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const locations = [
  { name: 'Pakistan', dot: '#ffb347', hq: true },
  { name: 'UAE', dot: '#00d4ff', hq: false },
  { name: 'UK', dot: '#00d4ff', hq: false },
  { name: 'USA', dot: '#00d4ff', hq: false },
  { name: 'Germany', dot: '#00d4ff', hq: false },
  { name: 'Australia', dot: '#00d4ff', hq: false },
  { name: 'Canada', dot: '#00d4ff', hq: false },
  { name: 'Netherlands', dot: '#00d4ff', hq: false },
  { name: 'Singapore', dot: '#00d4ff', hq: false },
  { name: 'Saudi Arabia', dot: '#00d4ff', hq: false },
  { name: 'Turkey', dot: '#00d4ff', hq: false },
  { name: '+ More', dot: '#5a6a7a', hq: false },
];

export default function GlobeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeScene | null>(null);

  useEffect(() => {
    if (!canvasRef.current || globeRef.current) return;

    const globe = new GlobeScene(canvasRef.current);
    globe.createRoutes();
    globeRef.current = globe;

    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Route activation 20-80%
          if (p > 0.2 && p < 0.8) {
            const routeProgress = (p - 0.2) / 0.6;
            globe.revealRoutes(routeProgress);
          }
          if (p >= 0.8) {
            globe.revealRoutes(1);
          }
          // Camera orbit 20-80%
          if (p > 0.2 && p < 0.8) {
            const orbitProgress = (p - 0.2) / 0.6;
            globe.setCameraOrbit(30 + orbitProgress * 120);
          }
        },
      });

      // Content animations
      gsap.fromTo(
        '.globe-label',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );

      gsap.fromTo(
        '.globe-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
        }
      );

      gsap.fromTo(
        '.globe-sub',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%' },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      globe.dispose();
      globeRef.current = null;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global"
      className="relative w-full h-screen z-10"
    >
      {/* 3D Globe Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw] h-full flex items-center">
          <div className="max-w-md pointer-events-auto">
            <div className="globe-label section-label text-core-blue mb-4 px-3 py-1 rounded-full bg-core-blue/5 border border-core-blue/15 inline-block opacity-0">
              GLOBAL REACH
            </div>
            <h2
              className="globe-headline font-display font-medium text-starlight mb-4 opacity-0"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05 }}
            >
              Pakistan to the World
            </h2>
            <p className="globe-sub font-display text-silver text-base mb-8 opacity-0">
              From Lahore to London, Dubai to New York — we deliver world-class digital experiences across 12 countries and counting.
            </p>

            {/* Location grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6">
              {locations.map((loc) => (
                <div key={loc.name} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: loc.dot }}
                  />
                  <span className="font-mono text-sm text-silver">
                    {loc.name}
                  </span>
                  {loc.hq && (
                    <span className="font-mono text-[0.6rem] text-forge-gold uppercase">
                      HQ
                    </span>
                  )}
                </div>
              ))}
            </div>

            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 text-core-blue font-display text-sm hover:underline group"
            >
              View Our Global Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
