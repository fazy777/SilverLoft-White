import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.contact-label',
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
        '.contact-headline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      // Columns animation
      gsap.fromTo(
        '.contact-info-col',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );

      gsap.fromTo(
        '.contact-form-col',
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    // Construct mailto link
    const mailtoSubject = encodeURIComponent(subject || 'New Message from SilverLoft Website');
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailtoUrl = `mailto:contact@silverloft.me?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open user's email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
      setIsSubmitting(false);
      toast.success('Your default email client has been opened to send the message!');
      // Reset form fields
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen py-24 md:py-32 z-10 overflow-hidden"
    >
      {/* Background soft ambient light */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[60vw] h-[60vh] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1440px] mx-auto px-4 md:px-[4vw] relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="contact-label section-label text-core-blue mb-4 px-3 py-1 rounded-full bg-core-blue/5 border border-core-blue/15 inline-block opacity-0">
            GET IN TOUCH
          </div>
          <h2
            className="contact-headline font-display font-medium text-starlight opacity-0"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.05 }}
          >
            Let's Build Together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Info Column */}
          <div className="contact-info-col lg:col-span-5 flex flex-col justify-between opacity-0">
            <div>
              <h3 className="font-display font-semibold text-2xl text-starlight mb-6">
                Connect With Us
              </h3>
              <p className="font-display text-silver text-base leading-relaxed mb-8">
                Ready to take your digital presence to the next level? Fill out the form or reach out directly. Our engineering team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-core-blue/5 border border-core-blue/15 flex items-center justify-center text-core-blue shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase text-muted-foreground mb-1">
                      Email Address
                    </div>
                    <a
                      href="mailto:contact@silverloft.me"
                      className="font-display text-base text-starlight hover:text-core-blue transition-colors font-medium"
                    >
                      contact@silverloft.me
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-core-blue/5 border border-core-blue/15 flex items-center justify-center text-core-blue shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase text-muted-foreground mb-1">
                      Phone Number
                    </div>
                    <a
                      href="tel:+923001234567"
                      className="font-display text-base text-starlight hover:text-core-blue transition-colors font-medium"
                    >
                      +92-300-1234567
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-core-blue/5 border border-core-blue/15 flex items-center justify-center text-core-blue shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase text-muted-foreground mb-1">
                      Our Location
                    </div>
                    <div className="font-display text-base text-starlight font-medium">
                      Lahore, Pakistan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Info card */}
            <div className="mt-12 p-6 glass-card border border-white/60 shadow-md rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-core-blue">
                <MessageSquare size={18} />
                <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                  Response Policy
                </span>
              </div>
              <p className="font-display text-silver text-sm leading-relaxed">
                We obsess over detail. Every message receives direct attention from our leadership team. Let's create something extraordinary.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="contact-form-col lg:col-span-7 opacity-0">
            <div className="glass-panel p-8 md:p-10 border border-white/60 shadow-xl shadow-blue-500/5 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-mono text-xs uppercase text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-white/50 text-starlight placeholder:text-muted-foreground/60 outline-none focus:border-core-blue transition-colors text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-mono text-xs uppercase text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-white/50 text-starlight placeholder:text-muted-foreground/60 outline-none focus:border-core-blue transition-colors text-sm"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block font-mono text-xs uppercase text-muted-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="E.g., Brand Identity, Web Design, SaaS Development"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-white/50 text-starlight placeholder:text-muted-foreground/60 outline-none focus:border-core-blue transition-colors text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-mono text-xs uppercase text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us about your project, goals, and timeline..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 text-starlight placeholder:text-muted-foreground/60 outline-none focus:border-core-blue transition-colors text-sm resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-core-blue hover:bg-electric-blue text-white rounded-xl font-display font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 transition-all duration-300"
                >
                  {isSubmitting ? (
                    'Opening mail client...'
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
