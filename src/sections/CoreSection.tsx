import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CoreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // 0-40%: Energy sphere rotates
          // 40-60%: Sphere splits, light builds
          // 60-80%: Logo and headline reveal
          // 80-100%: Energy explosion

          if (p > 0.1) {
            const revealP = Math.min(1, (p - 0.1) / 0.5);
            gsap.set(logoRef.current, { opacity: revealP, scale: 0.8 + revealP * 0.2 });
            gsap.set(headlineRef.current, { opacity: revealP, y: 30 * (1 - revealP) });
            gsap.set(subRef.current, { opacity: revealP, y: 20 * (1 - revealP) });
          } else {
            gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
            gsap.set(headlineRef.current, { opacity: 0 });
            gsap.set(subRef.current, { opacity: 0 });
          }

          if (p > 0.4) {
            const ctaP = Math.min(1, (p - 0.4) / 0.4);
            gsap.set(ctaRef.current, { opacity: ctaP, y: 20 * (1 - ctaP) });
            gsap.set(contactRef.current, { opacity: ctaP });
          } else {
            gsap.set(ctaRef.current, { opacity: 0 });
            gsap.set(contactRef.current, { opacity: 0 });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="bottom-cta"
      className="relative w-full h-screen z-10 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Soft gradient background blob */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(99,102,241,0.08) 40%, rgba(219,234,254,0.04) 60%, transparent 70%)',
            animation: 'spherePulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-15"
          style={{
            background: 'conic-gradient(from 0deg, #2563eb, #6366f1, #93c5fd, #2563eb)',
            animation: 'sphereRotate 10s linear infinite',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? '#2563eb' : i % 3 === 1 ? '#6366f1' : '#93c5fd',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.4,
              animation: `floatParticle ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spherePulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes sphereRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
          50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
          75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
        }
      `}</style>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div ref={logoRef} className="mb-8 opacity-0">
          <img
            src="/silverloft-logo.jpg"
            alt="SilverLoft"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-2xl"
            style={{
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.1)',
            }}
          />
        </div>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-display font-semibold text-starlight mb-6 opacity-0"
          style={{
            fontSize: 'clamp(2rem, 4vw, 4rem)',
            lineHeight: 1.1,
          }}
        >
          READY TO BUILD SOMETHING EXTRAORDINARY?
        </h2>

        {/* Subtext */}
        <p ref={subRef} className="font-display text-silver text-lg md:text-xl mb-10 opacity-0">
          Let's create something that changes everything.
        </p>

        {/* CTA Button */}
        <a
          ref={ctaRef}
          href="mailto:contact@silverloft.me"
          className="inline-block px-12 py-5 bg-core-blue text-white font-display font-semibold text-lg rounded-xl opacity-0 hover:scale-105 hover:bg-electric-blue shadow-lg shadow-blue-500/25 transition-all duration-300"
        >
          Start Your Project
        </a>

        {/* Contact info */}
        <div ref={contactRef} className="mt-10 space-y-2 opacity-0">
          <div className="font-mono text-sm text-muted">
            contact@silverloft.me
          </div>
          <div className="font-mono text-sm text-muted">
            +92-300-1234567
          </div>
          <div className="font-mono text-sm text-muted">
            Lahore, Pakistan
          </div>
        </div>
      </div>
    </section>
  );
}
