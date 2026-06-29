import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Brain, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    icon: BarChart3,
    title: 'Real-Time Dashboards',
    description: 'Live data visualization that updates in milliseconds. See your business breathe.',
  },
  {
    icon: Brain,
    title: 'Predictive Analytics',
    description: 'AI models that forecast trends before they happen. Stay three moves ahead.',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Identify bottlenecks, maximize conversions, minimize load times.',
  },
];

export default function TitanSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statNumRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label and headline
      gsap.fromTo(
        '.titan-label',
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
        '.titan-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      gsap.fromTo(
        '.titan-sub',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );

      // Cards
      const cards = sectionRef.current?.querySelectorAll('.metric-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: cards[0], start: 'top 75%' },
          }
        );
      }

      // Counter animation
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 10000,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statNumRef.current,
          start: 'top 80%',
        },
        onUpdate: () => {
          if (statNumRef.current) {
            statNumRef.current.textContent = Math.floor(counter.val).toLocaleString() + '+';
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="analytics"
      className="relative w-full min-h-screen py-24 md:py-32 z-10"
    >
      {/* Subtle Dot Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2A3441_1.5px,transparent_1.5px)] [background-size:32px_32px] pointer-events-none opacity-60" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw] relative">
        <div className="max-w-2xl mb-16">
          <div className="titan-label section-label text-data-green mb-4 px-3 py-1 rounded-full bg-data-green/5 border border-data-green/15 inline-block opacity-0">
            ANALYTICS & AI
          </div>
          <h2
            className="titan-headline font-display font-medium text-starlight mb-4 opacity-0"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.05 }}
          >
            Turn Data Into Power
          </h2>
          <p className="titan-sub font-display text-silver text-lg md:text-xl max-w-xl opacity-0">
            We don't just collect numbers. We architect intelligence systems that reveal what others miss.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {metrics.map((m) => (
            <div
              key={m.title}
              className="metric-card glass-card p-8 border-l-[3px] border-data-green opacity-0"
            >
              <m.icon className="w-8 h-8 text-data-green mb-4" strokeWidth={1.5} />
              <h3 className="font-display font-medium text-lg text-starlight mb-2">
                {m.title}
              </h3>
              <p className="font-display text-silver text-sm leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>

        {/* Big stat */}
        <div className="text-center">
          <span
            ref={statNumRef}
            className="font-display font-bold text-data-green block"
            style={{
              fontSize: 'clamp(4rem, 8vw, 8rem)',
            }}
          >
            0+
          </span>
          <span className="font-mono text-base text-muted">
            Data Points Processed Daily
          </span>
        </div>
      </div>
    </section>
  );
}
