import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: 'Ali Hassan',
    title: 'Chief Executive Officer',
    bio: 'Visionary leader with 10+ years in digital strategy. Ali founded SilverLoft with a mission to put Pakistani engineering on the global map.',
    image: '/ali-hassan.jpg',
    linkedin: '#',
  },
  {
    name: 'M. Faizan',
    title: 'Chief Technology Officer',
    bio: 'Full-stack architect and Three.js wizard. Faizan leads our technical team, pushing the boundaries of what\'s possible in browser-based 3D.',
    image: '/m-faizan.jpg',
    linkedin: '#',
  },
  {
    name: 'M. Hashir',
    title: 'Creative Director',
    bio: 'Award-winning designer with an obsession for pixel-perfect execution. Hashir ensures every project exceeds expectations.',
    image: '/m-hashir.jpg',
    linkedin: '#',
  },
];

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.team-label',
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
        '.team-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      const cards = sectionRef.current?.querySelectorAll('.team-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative w-full min-h-screen py-24 md:py-32 z-10"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw] relative">
        <div className="text-center mb-16">
          <div className="team-label section-label text-titan-violet mb-4 px-3 py-1 rounded-full bg-titan-violet/5 border border-titan-violet/15 inline-block opacity-0">
            LEADERSHIP
          </div>
          <h2
            className="team-headline font-display font-medium text-starlight opacity-0"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.05 }}
          >
            The Architects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member) => (
            <div
              key={member.name}
              className="team-card glass-panel p-6 text-center group hover:active-glow transition-all duration-400 opacity-0"
            >
              {/* Clean frame effect */}
              <div className="relative mx-auto mb-6 w-44 h-44 rounded-full overflow-hidden border border-titan-violet/10 group-hover:border-titan-violet/30 shadow-md transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-display font-semibold text-xl text-starlight mb-1">
                {member.name}
              </h3>
              <div className="font-mono text-xs uppercase text-titan-violet mb-4">
                {member.title}
              </div>
              <p className="font-display text-silver text-sm leading-relaxed mb-4">
                {member.bio}
              </p>
              <a
                href={member.linkedin}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full glass-card text-silver hover:text-core-blue transition-colors"
              >
                <Linkedin size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}
