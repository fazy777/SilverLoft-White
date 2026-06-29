import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-[4vw] transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-core-blue/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <a href="#" className="text-core-blue font-display font-semibold text-xl tracking-[0.08em] text-shadow-cyan">
          SILVERLOFT
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-silver text-sm font-display relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-core-blue transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="px-5 py-2 text-xs font-medium font-display text-core-blue border border-core-blue/30 rounded-lg bg-core-blue/10 hover:bg-core-blue/20 hover:shadow-glow transition-all duration-300"
          >
            Start a Project
          </button>
        </div>

        <button
          className="md:hidden text-silver"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-silver text-2xl font-display"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="px-8 py-3 text-core-blue border border-core-blue/30 rounded-lg bg-core-blue/10"
          >
            Start a Project
          </button>
        </div>
      )}
    </>
  );
}
