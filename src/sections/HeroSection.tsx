import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animation sequence (auto-plays on load)
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.2'
        );

      // Scroll-driven fade out
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.5) {
            const fadeProgress = (progress - 0.5) * 2;
            gsap.set([labelRef.current, headlineRef.current, subRef.current, ctaRef.current, statsRef.current], {
              opacity: 1 - fadeProgress,
              y: -fadeProgress * 50,
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center z-10"
    >
      <div className="text-center px-4 max-w-5xl mx-auto">
        <div ref={labelRef} className="section-label text-core-blue mb-6 px-4 py-1.5 rounded-full bg-core-blue/5 border border-core-blue/15 inline-block opacity-0">
          ENGINEERED DIGITAL EXPERIENCES
        </div>

        <h1
          ref={headlineRef}
          className="font-display font-medium text-starlight leading-[0.95] tracking-tight mb-6 text-shadow-glow opacity-0"
          style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
        >
          We Don't Build Websites.
          <br />
          We Engineer Universes.
        </h1>

        <p
          ref={subRef}
          className="font-display text-silver text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed opacity-0"
        >
          Premium design and development for global brands. Based in Pakistan. Delivering worldwide.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <a
            href="#services"
            className="px-10 py-4 bg-core-blue text-white font-display font-medium rounded-xl hover:bg-electric-blue hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300"
          >
            Explore Services
          </a>
          <a
            href="#contact"
            className="px-10 py-4 border border-core-blue/40 text-core-blue font-display font-medium rounded-xl hover:bg-core-blue/5 transition-all duration-300"
          >
            Start a Project
          </a>
        </div>
      </div>

      {/* Stats row */}
      <div
        ref={statsRef}
        className="absolute bottom-[4vh] left-0 right-0 flex justify-center px-4 opacity-0"
      >
        <div className="flex justify-center gap-8 md:gap-16 px-8 py-4 glass-card border border-white/60 shadow-lg shadow-blue-500/5 rounded-2xl">
          {[
            { num: '150+', label: 'Projects Delivered' },
            { num: '12', label: 'Countries Served' },
            { num: '98%', label: 'Client Retention' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-semibold text-2xl md:text-4xl text-core-blue">
                {stat.num}
              </div>
              <div className="font-mono text-[0.6875rem] uppercase text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
