import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, GraduationCap, House, Mail, MapPin, Menu, MessageCircle, Phone, Quote, ShieldCheck, Sparkles, Star, Target, Users, X } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const business = {
  name: 'Super Tutors',
  phone: '+91 9993337582',
  whatsappUrl: 'https://wa.me/919993337582',
  rating: '[Confirm with client]',
  sinceYear: '[Confirm with client]',
  address: '[Address to be confirmed]',
  googleReviewsUrl: '[Google reviews URL to be added]',
  mapUrl: '[Map URL to be added]',
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/find-a-tutor', label: 'Find a tutor' },
  { href: '/join-as-tutor', label: 'Join as tutor' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const seo: Record<string, { title: string; description: string }> = {
  '/': { title: 'Super Tutors | Home tuition in Bhopal', description: 'Super Tutors helps students find tutors and tutors find teaching assignments in Bhopal.' },
  '/find-a-tutor': { title: 'Find a tutor in Bhopal | Super Tutors', description: 'Tell Super Tutors what support your student needs and start a tutor conversation on WhatsApp.' },
  '/join-as-tutor': { title: 'Join as a tutor | Super Tutors Bhopal', description: 'Tutors can share their teaching details with Super Tutors for suitable home-tuition assignments.' },
  '/services': { title: 'Home tuition services | Super Tutors', description: 'Explore the home-tuition and tutor-assignment support offered by Super Tutors in Bhopal.' },
  '/about': { title: 'About Super Tutors | Bhopal', description: 'Learn about Super Tutors, a local education partner connecting students and tutors in Bhopal.' },
  '/reviews': { title: 'Reviews | Super Tutors Bhopal', description: 'Read and find the latest public feedback for Super Tutors. Review links are kept transparent.' },
  '/faq': { title: 'FAQ | Super Tutors Bhopal', description: 'Answers to common questions about finding a home tutor and joining Super Tutors as a tutor.' },
  '/contact': { title: 'Contact Super Tutors | Bhopal', description: 'Contact Super Tutors by phone or WhatsApp for home tuition and tutor assignment enquiries.' },
};

function Seo({ path }: { path: string }) {
  useEffect(() => {
    const current = seo[path] ?? seo['/'];
    document.title = current.title;
    const setMeta = (selector: string, attribute: string, content: string) => {
      let node = document.head.querySelector(selector);
      if (!node) {
        node = document.createElement('meta');
        document.head.appendChild(node);
      }
      node.setAttribute(attribute, content);
    };
    setMeta('meta[name="description"]', 'content', current.description);
    setMeta('meta[property="og:title"]', 'content', current.title);
    setMeta('meta[property="og:description"]', 'content', current.description);
    setMeta('meta[property="og:url"]', 'content', `${window.location.origin}${path}`);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}${path}`;
    const existing = document.head.querySelector('#super-tutors-jsonld');
    existing?.remove();
    const script = document.createElement('script');
    script.id = 'super-tutors-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify([
      { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: business.name, telephone: business.phone, areaServed: 'Bhopal', url: window.location.origin },
      { '@context': 'https://schema.org', '@type': 'EducationalOrganization', name: business.name, telephone: business.phone, areaServed: 'Bhopal', url: window.location.origin },
    ]);
    document.head.appendChild(script);
  }, [path]);
  return null;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" data-testid="link-logo">
      <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#0F2747] text-white shadow-sm">
        <span className="display text-[19px] font-extrabold tracking-[-.08em]">ST</span>
      </span>
      <span className="display text-[17px] font-extrabold tracking-[-.04em] text-[#0F2747]">Super Tutors</span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className="relative z-20 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
      <div className="container-wide flex h-[74px] items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb] ${location === item.href ? 'text-[#2563eb]' : 'text-[#64748b]'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a href={`tel:${business.phone.replaceAll(' ', '')}`} data-testid="link-header-call" className="flex items-center gap-2 px-2 text-[13px] font-semibold text-[#0f2747]"><Phone size={15} /> Call us</a>
          <Link href="/find-a-tutor" data-testid="link-header-cta" className="rounded-lg bg-[#2563eb] px-4 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5">Find a tutor <ArrowRight className="ml-1 inline" size={15} /></Link>
        </div>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu" className="grid h-10 w-10 place-items-center rounded-lg border border-[#e2e8f0] text-[#0f2747] lg:hidden">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-[#e2e8f0] bg-white px-5 py-3 lg:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`block border-b border-[#f1f5f9] py-3 text-sm font-semibold ${location === item.href ? 'text-[#2563eb]' : 'text-[#172033]'}`}>{item.label}</Link>)}
          <Link href="/find-a-tutor" onClick={() => setOpen(false)} data-testid="link-mobile-cta" className="mt-3 block rounded-lg bg-[#2563eb] px-4 py-3 text-center text-sm font-bold text-white">Start a request</Link>
        </nav>
      )}
    </header>
  );
}

function MobileActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-[#dbe4ee] bg-white/95 p-3 shadow-[0_-8px_30px_rgba(15,39,71,.1)] backdrop-blur md:hidden">
      <a href={`tel:${business.phone.replaceAll(' ', '')}`} data-testid="link-mobile-call" className="flex items-center justify-center gap-2 rounded-lg border border-[#0f2747] py-3 text-sm font-bold text-[#0f2747]"><Phone size={16} /> Call</a>
      <a href={business.whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-mobile-whatsapp" className="flex items-center justify-center gap-2 rounded-lg bg-[#16a34a] py-3 text-sm font-bold text-white"><MessageCircle size={16} /> WhatsApp</a>
      <Link href="/find-a-tutor" data-testid="link-mobile-request" className="flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] py-3 text-sm font-bold text-white"><House size={16} /> Request Tutor</Link>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <div className="grain min-h-[100dvh] bg-[#f8fafc] text-[#172033]"><Seo path={location} /><Header /><main className="mobile-bottom-pad">{children}</main><MobileActions /><Footer /></div>;
}

function ButtonLink({ href, children, secondary = false, testId }: { href: string; children: ReactNode; secondary?: boolean; testId: string }) {
  return <Link href={href} data-testid={testId} className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${secondary ? 'border border-[#cbd5e1] bg-white text-[#0f2747] hover:border-[#2563eb] hover:text-[#2563eb]' : 'bg-[#2563eb] text-white shadow-[0_8px_18px_rgba(37,99,235,.18)] hover:bg-[#1d4ed8]'}`}>{children}</Link>;
}

function SectionIntro({ eyebrow, title, copy, align = 'left' }: { eyebrow: string; title: string; copy?: string; align?: 'left' | 'center' }) {
  return <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}><p className="eyebrow mb-3">{eyebrow}</p><h2 className="display text-balance text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.08] tracking-[-.045em] text-[#0f2747]">{title}</h2>{copy && <p className="mt-4 text-[16px] leading-7 text-[#64748b]">{copy}</p>}</div>;
}

function TrustStrip() {
  return <div className="border-y border-[#e2e8f0] bg-white"><div className="container-wide grid gap-0 divide-y divide-[#e2e8f0] py-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0">{[['01', 'Local to Bhopal', 'A focused home-tuition service for the city'], ['02', 'Two clear paths', 'Support for families and tutors'], ['03', 'Talk directly', 'Start with a simple WhatsApp conversation']].map(([num, title, copy]) => <div key={num} className="flex items-start gap-3 px-2 py-5 sm:px-6"><span className="display text-xs font-extrabold text-[#f59e0b]">{num}</span><div><p className="text-sm font-bold text-[#0f2747]">{title}</p><p className="mt-1 text-xs leading-5 text-[#64748b]">{copy}</p></div></div>)}</div></div>;
}

function Home() {
  return <>
    <section className="hero-wash relative overflow-hidden">
      <div className="dot-grid absolute right-[-80px] top-[-100px] h-[380px] w-[380px] rounded-full opacity-45" />
      <div className="container-wide relative grid min-h-[570px] items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
        <div className="rise">
          <p className="eyebrow mb-5 flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" /> A local education partner in Bhopal</p>
          <h1 className="display max-w-[700px] text-balance text-[clamp(43px,6.5vw,78px)] font-extrabold leading-[.98] tracking-[-.07em] text-[#0f2747]">The right support<br /><span className="text-[#2563eb]">changes the lesson.</span></h1>
          <p className="mt-7 max-w-[540px] text-[17px] leading-8 text-[#64748b]">Students find tutors. Tutors find teaching assignments. Super Tutors keeps the next step simple for families and teachers in Bhopal.</p>
          <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href="/find-a-tutor" testId="link-hero-find">Find a tutor <ArrowRight size={16} /></ButtonLink><ButtonLink href="/join-as-tutor" secondary testId="link-hero-join">Join as a tutor</ButtonLink></div>
          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-[#64748b]"><ShieldCheck size={15} className="text-[#16a34a]" /> No account needed to start a conversation.</p>
        </div>
        <div className="relative rise rise-delay-2">
          <div className="relative mx-auto max-w-[475px] overflow-hidden rounded-[28px] bg-[#0f2747] p-3 shadow-[0_28px_80px_rgba(15,39,71,.22)]">
            <div className="rounded-[20px] border border-white/10 bg-[#18365d] p-6 sm:p-8">
              <div className="mb-10 flex items-center justify-between"><span className="display text-sm font-bold text-white">Super Tutors</span><span className="rounded-full bg-[#f59e0b] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.12em] text-[#0f2747]">Bhopal</span></div>
              <div className="grid gap-3">
                <div className="rounded-xl bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#dbeafe] text-[#2563eb]"><GraduationCap size={20} /></span><div><p className="text-xs font-semibold text-[#64748b]">For families</p><p className="mt-0.5 text-sm font-bold text-[#0f2747]">Find support that fits</p></div><ChevronRight className="ml-auto text-[#94a3b8]" size={17} /></div></div>
                <div className="rounded-xl border border-white/15 bg-[#23466f] p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#fef3c7] text-[#b45309]"><BookOpen size={20} /></span><div><p className="text-xs font-semibold text-[#aec2da]">For tutors</p><p className="mt-0.5 text-sm font-bold text-white">Find your next assignment</p></div><ChevronRight className="ml-auto text-[#aec2da]" size={17} /></div></div>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs text-[#aec2da]"><span className="h-2 w-2 rounded-full bg-[#16a34a]" /> A direct, human first step</div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 hidden rounded-xl border border-[#e2e8f0] bg-white p-4 card-shadow sm:block"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#dcfce7] text-[#16a34a]"><Check size={15} /></span><span className="text-xs font-bold text-[#0f2747]">Start with a conversation</span></div></div>
        </div>
      </div>
    </section>
    <TrustStrip />
    <section className="section-pad bg-[#f8fafc]"><div className="container-wide"><SectionIntro eyebrow="A clear place to begin" title="One service. Two ways to move forward." copy="Whether you are looking for learning support or looking for a teaching assignment, Super Tutors helps you take the next useful step." /><div className="mt-12 grid gap-5 lg:grid-cols-[1fr_1.2fr]"><Link href="/find-a-tutor" data-testid="card-home-families" className="group rounded-2xl bg-[#0f2747] p-7 text-white transition-transform hover:-translate-y-1 sm:p-10"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#2563eb]"><GraduationCap /></span><ArrowRight className="transition-transform group-hover:translate-x-1" /></div><p className="mt-16 text-xs font-bold uppercase tracking-[.15em] text-[#9db4d2]">For parents and students</p><h3 className="display mt-3 text-3xl font-extrabold tracking-[-.04em]">Find a tutor for the next step.</h3><p className="mt-3 max-w-md leading-7 text-[#c1d1e3]">Share the class, subject and support you are looking for. We will use your details to start the conversation.</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#fbbf24]">Tell us what you need <ArrowRight size={15} /></span></Link><Link href="/join-as-tutor" data-testid="card-home-tutors" className="group rounded-2xl border border-[#d9e3ef] bg-white p-7 card-shadow transition-transform hover:-translate-y-1 sm:p-10"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#fff4d6] text-[#b45309]"><BookOpen /></span><ArrowRight className="text-[#94a3b8] transition-transform group-hover:translate-x-1" /></div><p className="mt-16 text-xs font-bold uppercase tracking-[.15em] text-[#64748b]">For tutors</p><h3 className="display mt-3 text-3xl font-extrabold tracking-[-.04em] text-[#0f2747]">Bring your teaching to the right assignment.</h3><p className="mt-3 max-w-md leading-7 text-[#64748b]">Share your subjects, experience and preferred area. We will keep your details ready for relevant enquiries.</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#2563eb]">Share your tutor details <ArrowRight size={15} /></span></Link></div></div></section>
    <section className="section-pad overflow-hidden bg-white"><div className="container-wide grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><SectionIntro eyebrow="How it works" title="A simple conversation can make the next step clearer." copy="No complicated portal. No long process to understand. Start with the details that matter." /><div className="grid gap-4 sm:grid-cols-3">{[['01', 'Share the need', 'Tell us about the student or your teaching profile.'], ['02', 'Start on WhatsApp', 'Your structured request opens a direct conversation.'], ['03', 'Take it forward', 'Discuss the right next step with Super Tutors.']].map(([num, title, copy]) => <div key={num} className="border-t-2 border-[#2563eb] pt-4"><p className="display text-xs font-extrabold text-[#f59e0b]">{num}</p><h3 className="mt-8 text-sm font-bold text-[#0f2747]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#64748b]">{copy}</p></div>)}</div></div></section>
    <CtaBand />
  </>;
}

function WhatsAppSuccess({ message, onReset }: { message: string; onReset: () => void }) {
  const url = `${business.whatsappUrl}?text=${encodeURIComponent(message)}`;
  return <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-6"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#16a34a] text-white"><Check size={18} /></span><div><h3 className="font-bold text-[#14532d]">Your message is ready.</h3><p className="mt-1 text-sm leading-6 text-[#166534]">WhatsApp will open with your details filled in. Review them once, then send.</p></div></div><div className="mt-5 flex flex-wrap gap-3"><a href={url} target="_blank" rel="noreferrer" data-testid="link-form-whatsapp" className="inline-flex items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2.5 text-sm font-bold text-white"><MessageCircle size={16} /> Open WhatsApp</a><button type="button" onClick={onReset} data-testid="button-form-reset" className="rounded-lg px-4 py-2.5 text-sm font-bold text-[#166534] hover:bg-[#dcfce7]">Edit details</button></div></div>;
}

function RequestForm() {
  const [form, setForm] = useState({ name: '', phone: '', className: '', subjects: '', area: '', notes: '' });
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((old) => ({ ...old, [key]: event.target.value }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name.trim() || !form.phone.trim()) { setError('Please add your name and phone number so we can respond.'); return; } setError(''); setSent(`Hello Super Tutors, I would like to find a tutor.\n\nName: ${form.name}\nPhone: ${form.phone}\nClass / grade: ${form.className || '[Not provided]'}\nSubject(s): ${form.subjects || '[Not provided]'}\nArea in Bhopal: ${form.area || '[Not provided]'}\nWhat support is needed: ${form.notes || '[Not provided]'}`); };
  if (sent) return <WhatsAppSuccess message={sent} onReset={() => setSent('')} />;
  return <form onSubmit={submit} className="space-y-5"><FormField label="Your name" id="request-name" value={form.name} onChange={update('name')} required placeholder="Parent or student name" /><div className="grid gap-5 sm:grid-cols-2"><FormField label="Phone number" id="request-phone" value={form.phone} onChange={update('phone')} required placeholder="+91 ..." type="tel" /><FormField label="Class / grade" id="request-class" value={form.className} onChange={update('className')} placeholder="For example, Class 8" /></div><div className="grid gap-5 sm:grid-cols-2"><FormField label="Subject(s)" id="request-subjects" value={form.subjects} onChange={update('subjects')} placeholder="For example, Maths" /><FormField label="Area in Bhopal" id="request-area" value={form.area} onChange={update('area')} placeholder="Neighbourhood or area" /></div><FormField label="What support is needed?" id="request-notes" value={form.notes} onChange={update('notes')} placeholder="Tell us a little about the requirement" multiline />{error && <p data-testid="status-form-error" className="rounded-lg bg-[#fef2f2] px-3 py-2 text-sm font-medium text-[#b91c1c]">{error}</p>}<button type="submit" data-testid="button-submit-request" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#1d4ed8]">Prepare WhatsApp request <ArrowRight size={16} /></button><p className="text-center text-xs leading-5 text-[#64748b]">Your details are used to prepare a message to {business.phone}. Nothing is submitted to a database.</p></form>;
}

function TutorForm() {
  const [form, setForm] = useState({ name: '', phone: '', subjects: '', experience: '', area: '', availability: '' });
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((old) => ({ ...old, [key]: event.target.value }));
  const submit = (event: FormEvent) => { event.preventDefault(); if (!form.name.trim() || !form.phone.trim()) { setError('Please add your name and phone number so we can respond.'); return; } setError(''); setSent(`Hello Super Tutors, I would like to join as a tutor.\n\nName: ${form.name}\nPhone: ${form.phone}\nSubjects / classes: ${form.subjects || '[Not provided]'}\nTeaching experience: ${form.experience || '[Not provided]'}\nPreferred area in Bhopal: ${form.area || '[Not provided]'}\nAvailability: ${form.availability || '[Not provided]'}`); };
  if (sent) return <WhatsAppSuccess message={sent} onReset={() => setSent('')} />;
  return <form onSubmit={submit} className="space-y-5"><FormField label="Your name" id="tutor-name" value={form.name} onChange={update('name')} required placeholder="Full name" /><div className="grid gap-5 sm:grid-cols-2"><FormField label="Phone number" id="tutor-phone" value={form.phone} onChange={update('phone')} required placeholder="+91 ..." type="tel" /><FormField label="Subjects / classes" id="tutor-subjects" value={form.subjects} onChange={update('subjects')} placeholder="For example, Science, Class 6–10" /></div><div className="grid gap-5 sm:grid-cols-2"><FormField label="Teaching experience" id="tutor-experience" value={form.experience} onChange={update('experience')} placeholder="A short overview" /><FormField label="Preferred area in Bhopal" id="tutor-area" value={form.area} onChange={update('area')} placeholder="Neighbourhood or area" /></div><FormField label="Availability" id="tutor-availability" value={form.availability} onChange={update('availability')} placeholder="Days or times that work" multiline />{error && <p data-testid="status-tutor-form-error" className="rounded-lg bg-[#fef2f2] px-3 py-2 text-sm font-medium text-[#b91c1c]">{error}</p>}<button type="submit" data-testid="button-submit-tutor" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f2747] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#173963]">Prepare tutor message <ArrowRight size={16} /></button><p className="text-center text-xs leading-5 text-[#64748b]">Your details are used to prepare a message to {business.phone}. Nothing is submitted to a database.</p></form>;
}

function FormField({ label, id, value, onChange, placeholder, required = false, type = 'text', multiline = false }: { label: string; id: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder: string; required?: boolean; type?: string; multiline?: boolean }) {
  return <label className="block text-sm font-semibold text-[#172033]" htmlFor={id}>{label}{required && <span className="ml-1 text-[#2563eb]" aria-hidden="true">*</span>}{multiline ? <textarea id={id} data-testid={`input-${id}`} value={value} onChange={onChange} placeholder={placeholder} rows={3} className="mt-2 block w-full resize-y rounded-lg border border-[#d8e2ed] bg-white px-3.5 py-3 text-sm font-normal outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]" /> : <input id={id} data-testid={`input-${id}`} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} className="mt-2 block w-full rounded-lg border border-[#d8e2ed] bg-white px-3.5 py-3 text-sm font-normal outline-none transition-colors placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]" />}</label>;
}

function FindTutor() {
  return <><PageHero eyebrow="For families" title="Find support for the next lesson." copy="Tell us a little about the student and the support you are looking for. We will help you start the right conversation." accent="blue" /><section className="section-pad bg-white"><div className="container-wide grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><SectionIntro eyebrow="A better first step" title="Give us the context, not a complicated brief." copy="The more useful details you share, the easier it is to talk about a suitable tutor. You can always add more on WhatsApp." /><div className="mt-8 space-y-4">{[['01', 'Student details', 'Class, subject and what kind of help is needed.'], ['02', 'Your area', 'The Bhopal neighbourhood where support is needed.'], ['03', 'A direct handoff', 'Your message opens in WhatsApp for a human conversation.']].map(([num, title, copy]) => <div key={num} className="flex gap-4 border-t border-[#e2e8f0] pt-4"><span className="display text-xs font-extrabold text-[#2563eb]">{num}</span><div><p className="text-sm font-bold text-[#0f2747]">{title}</p><p className="mt-1 text-sm leading-6 text-[#64748b]">{copy}</p></div></div>)}</div></div><div className="rounded-2xl border border-[#dbe5f0] bg-[#f8fafc] p-5 sm:p-8"><div className="mb-7 flex items-center justify-between"><div><p className="eyebrow">Start here</p><h2 className="display mt-1 text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">Tell us what you need</h2></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#dbeafe] text-[#2563eb]"><GraduationCap /></span></div><RequestForm /></div></div></section><CtaBand /></>;
}

function JoinTutor() {
  return <><PageHero eyebrow="For tutors" title="Make your teaching easier to find." copy="Share your teaching details with Super Tutors and keep the door open to relevant home-tuition assignments in Bhopal." accent="navy" /><section className="section-pad bg-[#f8fafc]"><div className="container-wide grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-start"><div className="rounded-2xl border border-[#dbe5f0] bg-white p-5 card-shadow sm:p-8"><div className="mb-7 flex items-center justify-between"><div><p className="eyebrow">Tutor profile</p><h2 className="display mt-1 text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">Share your details</h2></div><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff4d6] text-[#b45309]"><BookOpen /></span></div><TutorForm /></div><div><SectionIntro eyebrow="What to share" title="A useful tutor profile starts with the basics." copy="You do not need to write a long bio. Tell us what you teach, where you prefer to teach and when you are available." /><div className="mt-8 grid gap-3">{['Subjects and classes you teach', 'Your teaching experience', 'Preferred Bhopal area', 'Days or times you are available'].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-4 text-sm font-semibold text-[#0f2747]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#dcfce7] text-[#16a34a]"><Check size={14} /></span>{item}</div>)}</div><div className="mt-8 rounded-xl bg-[#0f2747] p-5 text-sm leading-6 text-[#d5e2f1]"><p className="flex items-center gap-2 font-bold text-white"><ShieldCheck size={16} className="text-[#fbbf24]" /> A clear, respectful start</p><p className="mt-2">We use your message to understand your tutor profile and discuss suitable next steps.</p></div></div></div></section></>;
}

function PageHero({ eyebrow, title, copy, accent }: { eyebrow: string; title: string; copy: string; accent: 'blue' | 'navy' }) {
  return <section className={`relative overflow-hidden ${accent === 'navy' ? 'bg-[#0f2747]' : 'hero-wash'}`}><div className="container-wide relative py-16 sm:py-24"><div className="max-w-3xl"><p className={`eyebrow mb-4 ${accent === 'navy' ? 'text-[#93c5fd]' : ''}`}>{eyebrow}</p><h1 className={`display text-balance text-[clamp(40px,6vw,68px)] font-extrabold leading-[1] tracking-[-.065em] ${accent === 'navy' ? 'text-white' : 'text-[#0f2747]'}`}>{title}</h1><p className={`mt-6 max-w-2xl text-lg leading-8 ${accent === 'navy' ? 'text-[#c1d1e3]' : 'text-[#64748b]'}`}>{copy}</p></div></div></section>;
}

const serviceItems = [
  { icon: House, title: 'Home tuition enquiries', copy: 'A straightforward way for families to share a student’s learning support requirement.' },
  { icon: Users, title: 'Tutor assignment enquiries', copy: 'A place for tutors to share the subjects, classes and areas they are ready to teach.' },
  { icon: Target, title: 'Requirement matching', copy: 'A human conversation around the details that matter before taking the next step.' },
];

function Services() {
  return <><PageHero eyebrow="What we do" title="Education support, without the maze." copy="Super Tutors brings two local needs into one clear service: helping students find tutors and tutors find teaching assignments." accent="blue" /><section className="section-pad bg-white"><div className="container-wide"><SectionIntro eyebrow="The service" title="A focused bridge between learning needs and teaching ability." copy="These are the ways Super Tutors is built to help. If your question is a little different, contact us directly." /><div className="mt-12 grid gap-4 lg:grid-cols-3">{serviceItems.map(({ icon: Icon, title, copy }, index) => <div key={title} className={`rounded-2xl p-7 ${index === 1 ? 'bg-[#0f2747] text-white' : 'border border-[#e2e8f0] bg-[#f8fafc]'}`}><span className={`grid h-12 w-12 place-items-center rounded-xl ${index === 1 ? 'bg-[#2563eb]' : 'bg-[#dbeafe] text-[#2563eb]'}`}><Icon size={22} /></span><h3 className={`display mt-12 text-2xl font-extrabold tracking-[-.04em] ${index === 1 ? 'text-white' : 'text-[#0f2747]'}`}>{title}</h3><p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-[#c1d1e3]' : 'text-[#64748b]'}`}>{copy}</p></div>)}</div></div></section><section className="section-pad bg-[#f8fafc]"><div className="container-wide grid gap-8 lg:grid-cols-[1fr_1fr]"><div className="rounded-2xl bg-[#fff4d6] p-8 sm:p-10"><p className="eyebrow text-[#b45309]">For families</p><h2 className="display mt-4 text-3xl font-extrabold tracking-[-.05em] text-[#0f2747]">Start with what the student needs.</h2><p className="mt-4 leading-7 text-[#64748b]">Class, subject, area and context are enough to begin.</p><ButtonLink href="/find-a-tutor" testId="link-services-family">Find a tutor <ArrowRight size={16} /></ButtonLink></div><div className="rounded-2xl bg-[#dbeafe] p-8 sm:p-10"><p className="eyebrow">For tutors</p><h2 className="display mt-4 text-3xl font-extrabold tracking-[-.05em] text-[#0f2747]">Start with what you teach.</h2><p className="mt-4 leading-7 text-[#64748b]">Subjects, experience, area and availability are enough to begin.</p><ButtonLink href="/join-as-tutor" secondary testId="link-services-tutor">Join as a tutor <ArrowRight size={16} /></ButtonLink></div></div></section></>;
}

function About() {
  return <><PageHero eyebrow="About Super Tutors" title="Local by design. Clear by default." copy="Super Tutors is a Bhopal-based home-tuition and tutor-assignment service built around one useful idea: the right conversation should be easy to start." accent="navy" /><section className="section-pad bg-white"><div className="container-wide grid gap-14 lg:grid-cols-[.85fr_1.15fr]"><div><SectionIntro eyebrow="Our point of view" title="Good education support begins with listening." copy="Families need a clear way to ask. Tutors need a clear way to introduce what they do. We bring those two moments together." /></div><div className="space-y-10"><div className="flex gap-5 border-b border-[#e2e8f0] pb-8"><span className="display text-4xl font-extrabold text-[#f59e0b]">01</span><div><h3 className="display text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">Keep it local</h3><p className="mt-2 leading-7 text-[#64748b]">The service is focused on Bhopal and the practical details that shape a home-tuition conversation.</p></div></div><div className="flex gap-5 border-b border-[#e2e8f0] pb-8"><span className="display text-4xl font-extrabold text-[#2563eb]">02</span><div><h3 className="display text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">Keep it human</h3><p className="mt-2 leading-7 text-[#64748b]">Forms prepare a message; people decide the next step. There is no complicated dashboard to learn.</p></div></div><div className="flex gap-5"><span className="display text-4xl font-extrabold text-[#f59e0b]">03</span><div><h3 className="display text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">Keep it honest</h3><p className="mt-2 leading-7 text-[#64748b]">We would rather mark a detail as {business.sinceYear} than make up a promise, count or credential.</p></div></div></div></div></section><section className="section-pad bg-[#f8fafc]"><div className="container-wide rounded-2xl bg-[#0f2747] p-8 sm:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="eyebrow text-[#93c5fd]">The line we come back to</p><p className="display mt-5 max-w-3xl text-[clamp(30px,4vw,52px)] font-extrabold leading-[1.05] tracking-[-.06em] text-white">Students find tutors.<br /><span className="text-[#fbbf24]">Tutors find teaching assignments.</span></p></div><ButtonLink href="/contact" secondary testId="link-about-contact">Talk to Super Tutors <ArrowRight size={16} /></ButtonLink></div></div></section></>;
}

function Reviews() {
  return <><PageHero eyebrow="Reviews" title="Trust should be easy to check." copy="We are keeping this page transparent: public review links belong here once the business shares the confirmed destination." accent="blue" /><section className="section-pad bg-white"><div className="container-wide grid gap-8 lg:grid-cols-[1fr_.75fr]"><div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-8 sm:p-10"><div className="flex items-center gap-2 text-[#f59e0b]"><Star size={22} fill="currentColor" /><Star size={22} fill="currentColor" /><Star size={22} fill="currentColor" /><Star size={22} fill="currentColor" /><Star size={22} fill="currentColor" /></div><h2 className="display mt-8 text-3xl font-extrabold tracking-[-.05em] text-[#0f2747]">Your experience belongs here.</h2><p className="mt-4 max-w-xl leading-7 text-[#64748b]">The current rating is marked {business.rating}. Once the public review profile is confirmed, this page can point families and tutors to the original source.</p><a href={business.googleReviewsUrl.startsWith('http') ? business.googleReviewsUrl : '#'} data-testid="link-google-reviews" className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 py-3 text-sm font-bold text-[#0f2747]">Open Google reviews <ArrowRight size={16} /></a></div><div className="rounded-2xl bg-[#0f2747] p-8 text-white sm:p-10"><Quote className="text-[#fbbf24]" size={30} /><p className="mt-6 text-xl font-semibold leading-8">“The best review is a clear next step for the person asking for help.”</p><p className="mt-8 text-sm text-[#aec2da]">A principle for building the service — not a customer testimonial.</p></div></div></section><CtaBand /></>;
}

const faqs = [
  ['What does Super Tutors help with?', 'Super Tutors helps students find tutors and tutors find teaching assignments. The service is focused on starting a clear, direct conversation around the requirement.'],
  ['How do I request a tutor?', 'Use the Find a tutor page to share your name, phone number and a few useful details. The form prepares a structured WhatsApp message to Super Tutors.'],
  ['How can I join as a tutor?', 'Use the Join as tutor page to share your teaching details, preferred area and availability. Your message will open in WhatsApp for the next conversation.'],
  ['Do I need to create an account?', 'No account is needed to start. The website is static-first and the forms prepare a WhatsApp message rather than storing submissions in a database.'],
  ['Which areas do you serve?', 'Super Tutors is Bhopal-based. Share your neighbourhood or area in your message so the requirement can be discussed clearly.'],
  ['Is the rating shown on this site confirmed?', 'The rating is currently marked [Confirm with client]. We do not publish a rating or testimonial until the source is confirmed.'],
];

function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return <><PageHero eyebrow="Questions, answered" title="The useful details, in plain language." copy="If your question is not here, contact Super Tutors directly and we will help you find the next step." accent="blue" /><section className="section-pad bg-white"><div className="container-wide grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><SectionIntro eyebrow="FAQ" title="No fine print maze." copy="These answers describe how the static-first website works today." /><div className="mt-8 rounded-xl bg-[#fff4d6] p-5"><CircleHelp className="text-[#b45309]" size={21} /><p className="mt-4 text-sm leading-6 text-[#64748b]">Still unsure? A direct WhatsApp message is often the quickest way to clarify.</p><a href={business.whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-faq-whatsapp" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0f2747]">Message Super Tutors <ArrowRight size={15} /></a></div></div><div className="divide-y divide-[#e2e8f0] border-y border-[#e2e8f0]">{faqs.map(([question, answer], index) => <div key={question}><button type="button" onClick={() => setActive(active === index ? null : index)} aria-expanded={active === index} data-testid={`button-faq-${index}`} className="flex w-full items-center justify-between gap-5 py-5 text-left"><span className="text-[15px] font-bold text-[#0f2747]">{question}</span><ChevronDown size={18} className={`shrink-0 text-[#2563eb] transition-transform ${active === index ? 'rotate-180' : ''}`} /></button>{active === index && <p data-testid={`text-faq-answer-${index}`} className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#64748b]">{answer}</p>}</div>)}</div></div></section></>;
}

function Contact() {
  return <><PageHero eyebrow="Contact" title="Let’s make the next step clear." copy="Call, WhatsApp or use the route that fits your question. Super Tutors is here for families and tutors in Bhopal." accent="navy" /><section className="section-pad bg-white"><div className="container-wide grid gap-5 md:grid-cols-3"><a href={`tel:${business.phone.replaceAll(' ', '')}`} data-testid="card-contact-call" className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-7 transition-transform hover:-translate-y-1"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#dbeafe] text-[#2563eb]"><Phone size={20} /></span><p className="mt-10 text-xs font-bold uppercase tracking-[.15em] text-[#64748b]">Call</p><h2 className="display mt-2 text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">{business.phone}</h2><p className="mt-3 text-sm text-[#64748b]">Talk through your requirement directly.</p></a><a href={business.whatsappUrl} target="_blank" rel="noreferrer" data-testid="card-contact-whatsapp" className="rounded-2xl bg-[#16a34a] p-7 text-white transition-transform hover:-translate-y-1"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><MessageCircle size={20} /></span><p className="mt-10 text-xs font-bold uppercase tracking-[.15em] text-[#dcfce7]">WhatsApp</p><h2 className="display mt-2 text-2xl font-extrabold tracking-[-.04em]">Start a message</h2><p className="mt-3 text-sm text-[#dcfce7]">Prepare a clear enquiry for the team.</p></a><div className="rounded-2xl border border-[#e2e8f0] bg-[#fff4d6] p-7"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f59e0b] text-[#0f2747]"><MapPin size={20} /></span><p className="mt-10 text-xs font-bold uppercase tracking-[.15em] text-[#b45309]">Address</p><h2 className="display mt-2 text-2xl font-extrabold tracking-[-.04em] text-[#0f2747]">{business.address}</h2><p className="mt-3 text-sm text-[#64748b]">Bhopal, Madhya Pradesh</p></div></div></section><section className="section-pad bg-[#f8fafc]"><div className="container-wide grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><SectionIntro eyebrow="Choose your route" title="A short message is enough to begin." copy="For tutor requests, use the dedicated form. For anything else, call or send a WhatsApp message." /><div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/find-a-tutor" testId="link-contact-family">Find a tutor</ButtonLink><ButtonLink href="/join-as-tutor" secondary testId="link-contact-tutor">Join as tutor</ButtonLink></div></div><div className="rounded-2xl border border-[#dbe5f0] bg-white p-6 card-shadow"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#dbeafe] text-[#2563eb]"><Clock3 size={18} /></span><div><p className="text-sm font-bold text-[#0f2747]">Business details</p><p className="text-xs text-[#64748b]">Editable configuration</p></div></div><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between gap-5 border-b border-[#eef2f7] pb-3"><span className="text-[#64748b]">Serving</span><span className="font-semibold text-[#0f2747]">Bhopal</span></div><div className="flex justify-between gap-5 border-b border-[#eef2f7] pb-3"><span className="text-[#64748b]">Since</span><span className="font-semibold text-[#0f2747]">{business.sinceYear}</span></div><div className="flex justify-between gap-5"><span className="text-[#64748b]">Response route</span><span className="font-semibold text-[#0f2747]">Phone + WhatsApp</span></div></div></div></div></section></>;
}

function CtaBand() {
  return <section className="bg-[#0f2747]"><div className="container-wide flex flex-col gap-7 py-14 sm:flex-row sm:items-center sm:justify-between"><div><p className="eyebrow text-[#93c5fd]">Ready when you are</p><h2 className="display mt-2 text-3xl font-extrabold tracking-[-.05em] text-white">Start with the part you know.</h2></div><div className="flex flex-wrap gap-3"><ButtonLink href="/find-a-tutor" testId="link-cta-find">Find a tutor <ArrowRight size={16} /></ButtonLink><ButtonLink href="/join-as-tutor" secondary testId="link-cta-join">Join as tutor</ButtonLink></div></div></section>;
}

function Footer() {
  return <footer className="border-t border-[#e2e8f0] bg-white"><div className="container-wide grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]"><div><Logo /><p className="mt-4 max-w-xs text-sm leading-6 text-[#64748b]">Students find tutors. Tutors find teaching assignments. A clear local education partner in Bhopal.</p><p className="mt-6 text-xs text-[#94a3b8]">© {new Date().getFullYear()} {business.name}. All details subject to confirmation.</p></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-[#64748b]">Explore</p><div className="grid gap-3">{navItems.slice(1, 5).map((item) => <Link key={item.href} href={item.href} data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="text-sm text-[#172033] hover:text-[#2563eb]">{item.label}</Link>)}</div></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.15em] text-[#64748b]">Talk to us</p><a href={`tel:${business.phone.replaceAll(' ', '')}`} data-testid="link-footer-phone" className="block text-sm font-semibold text-[#0f2747]">{business.phone}</a><a href={business.whatsappUrl} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp" className="mt-3 block text-sm font-semibold text-[#2563eb]">WhatsApp Super Tutors</a><p className="mt-3 text-xs text-[#64748b]">{business.address}</p></div></div></footer>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/find-a-tutor" component={FindTutor} /><Route path="/join-as-tutor" component={JoinTutor} /><Route path="/services" component={Services} /><Route path="/about" component={About} /><Route path="/reviews" component={Reviews} /><Route path="/faq" component={FAQ} /><Route path="/contact" component={Contact} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><RoutedErrorBoundary><Shell><Router /></Shell></RoutedErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;