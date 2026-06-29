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
            ? 'bg-[#0B0F14]/85 backdrop-blur-xl border-b border-[#2A3441]/50 shadow-md'
            : 'bg-transparent'
        }`}
      >
        <a href="#" className="text-gradient-cyan font-display font-semibold text-xl tracking-[0.08em] hover:opacity-90 transition-opacity">
          SILVERLOFT
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-silver hover:text-white text-sm font-display relative group transition-colors duration-300"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#29E6F6] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="px-5 py-2 text-xs font-medium font-display text-[#29E6F6] border border-[#29E6F6]/30 rounded-lg bg-[#29E6F6]/10 hover:bg-[#29E6F6]/20 hover:shadow-[0_0_15px_rgba(41,230,246,0.25)] transition-all duration-300"
          >
            Start a Project
          </button>
        </div>

        <button
          className="md:hidden text-silver hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0F14]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-silver hover:text-white text-2xl font-display transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contact')}
            className="px-8 py-3 text-[#29E6F6] border border-[#29E6F6]/30 rounded-lg bg-[#29E6F6]/10 hover:bg-[#29E6F6]/20"
          >
            Start a Project
          </button>
        </div>
      )}
    </>
  );
}
