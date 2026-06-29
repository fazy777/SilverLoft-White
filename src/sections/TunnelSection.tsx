import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, MapPin, Palette, Code, TestTube, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    num: '01',
    name: 'Discovery',
    color: '#2563eb',
    icon: Search,
    description: 'We dig deep. Understanding your business, audience, and goals before a single pixel is placed.',
    steps: ['Research', 'Competitive Analysis', 'User Interviews', 'Requirement Mapping'],
  },
  {
    num: '02',
    name: 'Strategy',
    color: '#3b82f6',
    icon: MapPin,
    description: 'Every decision is data-backed. We architect a roadmap that ensures success.',
    steps: ['Information Architecture', 'UX Strategy', 'Technical Planning', 'Timeline'],
  },
  {
    num: '03',
    name: 'Design',
    color: '#6366f1',
    icon: Palette,
    description: 'Where art meets engineering. We craft interfaces that are beautiful and functional.',
    steps: ['Wireframing', 'Visual Design', 'Prototyping', 'Motion Design'],
  },
  {
    num: '04',
    name: 'Development',
    color: '#0d9488',
    icon: Code,
    description: 'The magic happens here. Clean code, cutting-edge tech, pixel-perfect implementation.',
    steps: ['Frontend', 'Backend', '3D/WebGL', 'API Integration'],
  },
  {
    num: '05',
    name: 'Testing',
    color: '#f59e0b',
    icon: TestTube,
    description: 'We break things so your users won\'t. Rigorous QA across devices and scenarios.',
    steps: ['Performance Testing', 'Cross-Browser QA', 'Security Audit', 'UAT'],
  },
  {
    num: '06',
    name: 'Launch',
    color: '#ef4444',
    icon: Rocket,
    description: 'The moment of truth. We deploy with confidence and monitor everything.',
    steps: ['Deployment', 'Analytics Setup', 'Monitoring', 'Post-Launch Support'],
  },
];

export default function TunnelSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const stageIdx = Math.min(5, Math.floor(p * 6));
          setActiveStage(stageIdx);
        },
      });

      gsap.fromTo(
        '.tunnel-label',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );

      gsap.fromTo(
        '.tunnel-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stage = stages[activeStage];

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full h-screen z-10 overflow-hidden"
    >
      {/* Tunnel visual effect - CSS rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-core-blue/10"
              style={{
                width: `${30 + i * 15}%`,
                height: `${30 + i * 15}%`,
                opacity: 0.3 - i * 0.03,
                animation: `tunnelPulse ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-core-blue/30 to-transparent"
            style={{
              width: `${50 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `speedline ${1 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes tunnelPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.2; }
        }
        @keyframes speedline {
          0% { transform: translateX(-100vw); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw] h-full flex flex-col items-center justify-center relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="tunnel-label section-label text-core-blue mb-4 px-3 py-1 rounded-full bg-core-blue/5 border border-core-blue/15 inline-block opacity-0">
            OUR PROCESS
          </div>
          <h2
            className="tunnel-headline font-display font-medium text-starlight opacity-0"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.05 }}
          >
            Our Engineering Process
          </h2>
        </div>

        {/* Active Stage */}
        <div className="text-center max-w-lg">
          <div className="font-mono text-sm text-muted mb-4">
            STAGE {stage.num}/06
          </div>

          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: `${stage.color}15`,
              border: `1px solid ${stage.color}40`,
              boxShadow: `0 0 30px ${stage.color}20`,
            }}
          >
            <stage.icon className="w-10 h-10" style={{ color: stage.color }} strokeWidth={1.5} />
          </div>

          <h3
            className="font-display font-semibold text-3xl md:text-5xl mb-4"
            style={{ color: stage.color }}
          >
            {stage.name}
          </h3>

          <p className="font-display text-silver text-base md:text-lg mb-8 leading-relaxed">
            {stage.description}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {stage.steps.map((step) => (
              <span
                key={step}
                className="px-4 py-2 text-sm font-mono glass-card rounded-full text-silver"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex items-center gap-3 mt-12">
          {stages.map((s, i) => (
            <div
              key={s.num}
              className="transition-all duration-300"
              style={{
                width: i === activeStage ? 32 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === activeStage ? s.color : i < activeStage ? s.color + '60' : '#5a6a7a',
                boxShadow: i === activeStage ? `0 0 12px ${s.color}60` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
