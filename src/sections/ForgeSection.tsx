import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Diamond, Layers, Code2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Diamond,
    title: 'Brand Identity',
    description: 'Logo design, visual systems, brand guidelines that make you unforgettable.',
  },
  {
    icon: Layers,
    title: 'UI/UX Design',
    description: 'Interfaces that feel intuitive. Experiences that feel magical.',
  },
  {
    icon: Code2,
    title: 'Full-Stack Development',
    description: 'React, Node, Three.js — we build what others think is impossible.',
  },
];

export default function ForgeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section content animation
      gsap.fromTo(
        '.forge-label',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        '.forge-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        }
      );

      gsap.fromTo(
        '.forge-sub',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );

      // Cards stagger
      const cards = cardsRef.current?.querySelectorAll('.service-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      // Closing statement
      gsap.fromTo(
        '.forge-closing',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.forge-closing',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full min-h-screen py-24 md:py-32 z-10"
    >
      {/* Soft blue gradient background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[60vh] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw] relative">
        <div className="max-w-2xl">
          <div className="forge-label section-label text-forge-orange mb-4 px-3 py-1 rounded-full bg-forge-orange/5 border border-forge-orange/15 inline-block opacity-0">
            OUR SERVICES
          </div>
          <h2
            className="forge-headline font-display font-medium text-starlight mb-4 opacity-0"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.05 }}
          >
            Core Capabilities
          </h2>
          <p className="forge-sub font-display text-silver text-lg md:text-xl max-w-xl mb-16 opacity-0">
            From raw concept to digital masterpiece — every pixel engineered with precision.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="service-card glass-card p-8 hover:active-glow hover:-translate-y-1 transition-all duration-400 group opacity-0"
            >
              <service.icon
                className="w-10 h-10 text-core-blue mb-6 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
              />
              <h3 className="font-display font-medium text-xl text-starlight mb-3">
                {service.title}
              </h3>
              <p className="font-display text-silver text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <p className="forge-closing font-display font-medium text-xl md:text-2xl text-forge-gold italic text-center mt-16 opacity-0">
          SilverLoft engineers premier digital systems for global enterprises.
        </p>
      </div>
    </section>
  );
}
