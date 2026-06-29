import { Linkedin, Twitter, Dribbble, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Dribbble, href: '#', label: 'Dribbble' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full py-16 z-10 border-t border-border/50 bg-cosmic-blue/60 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-core-blue font-display font-semibold text-2xl tracking-[0.08em] mb-4 text-shadow-cyan">
              SILVERLOFT
            </div>
            <p className="font-display text-sm text-muted max-w-[280px] leading-relaxed">
              Engineering digital excellence from Pakistan to the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-mono text-xs uppercase text-muted mb-4 tracking-widest">
              Quick Links
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
              {quickLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="font-display text-sm text-silver hover:text-core-blue transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full glass-card text-silver hover:text-core-blue hover:active-glow transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-mono text-xs uppercase text-muted mb-4 tracking-widest">
              Get in Touch
            </div>
            <div className="space-y-2">
              <a
                href="mailto:contact@silverloft.me"
                className="block font-display text-sm text-core-blue hover:underline"
              >
                contact@silverloft.me
              </a>
              <div className="font-display text-sm text-silver">
                Lahore, Pakistan
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-muted">
            © 2025 SilverLoft. All rights reserved.
          </div>
          <div className="font-mono text-xs text-muted">
            Crafted with obsession.
          </div>
        </div>
      </div>
    </footer>
  );
}
