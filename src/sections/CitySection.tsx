import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    name: 'Aura Finance',
    category: 'Fintech Dashboard',
    image: '/aura-finance.jpg',
    description: 'Complete redesign of a trading platform serving 50K+ daily users.',
    challenge: 'Complex data visualization with real-time updates.',
    strategy: 'Modular component system with WebSocket integration.',
    results: '340% increase in user engagement',
    tags: ['React', 'Three.js', 'Node.js', 'AWS'],
    accent: '#00d4ff',
  },
  {
    id: 2,
    name: 'Nomad Studios',
    category: 'Creative Agency',
    image: '/nomad-studios.jpg',
    description: 'Brand identity and immersive portfolio for a gaming studio.',
    challenge: 'Stand out in a saturated market.',
    strategy: 'Cinematic 3D experience with scroll-driven narrative.',
    results: 'Featured on Awwwards',
    tags: ['React', 'WebGL', 'Figma'],
    accent: '#7c3aed',
  },
  {
    id: 3,
    name: 'MediLink',
    category: 'Healthcare Platform',
    image: '/medilink.jpg',
    description: 'Patient management system for a network of 24 clinics.',
    challenge: 'HIPAA compliance + usability.',
    strategy: 'Security-first UX with end-to-end encryption.',
    results: '60% reduction in admin time',
    tags: ['Next.js', 'TypeScript', 'AWS'],
    accent: '#00ff88',
  },
  {
    id: 4,
    name: 'LuxeMarket',
    category: 'E-commerce',
    image: '/luxemarket.jpg',
    description: 'Premium marketplace for luxury goods with AR try-on.',
    challenge: 'High-end feel + performance.',
    strategy: 'Progressive enhancement with image optimization.',
    results: '$2.4M in first quarter sales',
    tags: ['React', 'Node.js', 'Figma'],
    accent: '#ff6b35',
  },
  {
    id: 5,
    name: 'EduVerse',
    category: 'EdTech Platform',
    image: '/eduverse.jpg',
    description: 'Virtual classroom environment for 12,000 students.',
    challenge: 'Real-time collaboration at scale.',
    strategy: 'WebRTC + custom 3D virtual spaces.',
    results: '99.7% uptime, 4.8/5 rating',
    tags: ['React', 'Three.js', 'WebRTC'],
    accent: '#ffb347',
  },
];

export default function CitySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<typeof projects[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.city-label',
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
        '.city-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      // Project cards stagger
      const cards = sectionRef.current?.querySelectorAll('.project-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
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
      id="portfolio"
      className="relative w-full min-h-screen py-24 md:py-32 z-10"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw]">
        <div className="mb-16">
          <div className="city-label section-label text-core-blue mb-4 opacity-0">
            SELECTED WORK
          </div>
          <h2
            className="city-headline font-display font-medium text-starlight opacity-0"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.05 }}
          >
            The Digital City
          </h2>
        </div>

        {/* Project grid - city layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className={`project-card group relative overflow-hidden rounded-xl cursor-pointer opacity-0 ${
                idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setActiveProject(project)}
            >
              <div className={`relative ${idx === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Glow border on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${project.accent}40, 0 0 30px ${project.accent}20`,
                  }}
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div
                    className="font-mono text-[0.6875rem] uppercase tracking-widest mb-2"
                    style={{ color: project.accent }}
                  >
                    {project.category}
                  </div>
                  <h3 className="font-display font-medium text-xl md:text-2xl text-starlight mb-2 group-hover:translate-y-0 transition-transform">
                    {project.name}
                  </h3>
                  <p className="font-display text-silver text-sm line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Building-like accent line */}
                <div
                  className="absolute top-0 left-4 w-px h-0 group-hover:h-16 transition-all duration-500"
                  style={{ backgroundColor: project.accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveProject(null)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
          <div
            className="relative glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full glass-card text-silver hover:text-core-blue transition-colors"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-3">
                <img
                  src={activeProject.image}
                  alt={activeProject.name}
                  className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                />
              </div>
              <div className="md:col-span-2 p-6 md:p-8">
                <div
                  className="font-mono text-xs uppercase tracking-widest mb-2"
                  style={{ color: activeProject.accent }}
                >
                  {activeProject.category}
                </div>
                <h3 className="font-display font-medium text-2xl text-starlight mb-4">
                  {activeProject.name}
                </h3>
                <p className="font-display text-silver text-sm mb-6">
                  {activeProject.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="font-mono text-xs uppercase text-muted mb-1">Challenge</div>
                    <p className="font-display text-silver text-sm">{activeProject.challenge}</p>
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase text-muted mb-1">Strategy</div>
                    <p className="font-display text-silver text-sm">{activeProject.strategy}</p>
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase text-muted mb-1">Results</div>
                    <p className="font-display text-sm" style={{ color: activeProject.accent }}>
                      {activeProject.results}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-mono glass-card rounded-full text-silver"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-core-blue font-display text-sm hover:underline"
                >
                  View Live Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
