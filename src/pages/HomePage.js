import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Briefcase, Sparkles, Send, ArrowRight,
  ChevronLeft, ChevronRight, Map, FileText, Layers,
  Brain, Eye, Ear, PersonStanding, Target, Mic,
  CheckCircle2, Users, Building2,
  Landmark, Handshake, Globe2, Compass, Route, BadgeCheck, SearchCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FEATURE_META = [
  { key: 'matching', Icon: Target, bg: 'linear-gradient(135deg,#0f0c29,#302b63,#5b21b6)', accent: '#8b5cf6', tab: 'careers', image: '/dayoftheyear.jpg' },
  { key: 'tracks',   Icon: Layers,  bg: 'linear-gradient(135deg,#042f2e,#134e4a,#0f766e)', accent: '#14b8a6', tab: 'tracks', image: '/People%20of%20Determination.jpg' },
  { key: 'ai',       Icon: Bot,     bg: 'linear-gradient(135deg,#1c0a00,#7c2d12,#c2410c)', accent: '#f97316', tab: 'home', scrollTo: 'ai', image: '/condifenece.webp' },
  { key: 'cv',       Icon: FileText,bg: 'linear-gradient(135deg,#1a0533,#4a1772,#7e22ce)', accent: '#a855f7', tab: 'cv-generator', image: '/workingonscreen.jpg' },
];

function FeatureCarousel({ themeMode, setActiveTab }) {
  const { t } = useTranslation();
  const FEATURES = FEATURE_META.map((m) => ({
    ...m,
    tag: t(`home.features.${m.key}.tag`),
    title: t(`home.features.${m.key}.title`),
    body: t(`home.features.${m.key}.body`),
    cta: t(`home.features.${m.key}.cta`),
  }));

  const [active, setActive]   = useState(0);
  const [visible, setVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const startX  = useRef(0);
  const pending = useRef(null);

  const changeTo = (idx) => {
    setVisible(false);
    pending.current = idx;
  };

  // once fade-out finishes (300ms), swap content and fade back in
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => {
      setActive(pending.current);
      setVisible(true);
    }, 280);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const sync = () => setIsPhone(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);

  const prev = () => changeTo((active - 1 + FEATURES.length) % FEATURES.length);
  const next = () => changeTo((active + 1) % FEATURES.length);

  const onMouseDown  = (e) => { startX.current = e.clientX; };
  const onMouseUp    = (e) => { const dx = e.clientX - startX.current; if (Math.abs(dx) > 40) dx < 0 ? next() : prev(); };
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => { const dx = e.changedTouches[0].clientX - startX.current; if (Math.abs(dx) > 40) dx < 0 ? next() : prev(); };

  const f = FEATURES[active];
  const imagePosition = isPhone && active !== 0 ? 'center center' : 'center right';

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card shell — background transitions smoothly */}
      <div
        className="rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
        style={{
          background: f.image
            ? `linear-gradient(90deg, rgba(8,13,28,0.72) 0%, rgba(8,13,28,0.48) 45%, rgba(8,13,28,0.12) 100%), url(${f.image}) ${imagePosition} / cover no-repeat`
            : f.bg,
          minHeight: 320,
          transition: 'background 0.5s ease'
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 0%,${f.accent}30 0%,transparent 60%)`, transition: 'background 0.5s ease' }}
        />

        {/* Fading content layer */}
        <div
          className="relative z-10 p-6 md:px-7 md:py-10 flex flex-col md:flex-row gap-6 items-start md:items-center"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.28s ease' }}
        >
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: f.accent }}>{f.tag}</span>
            <h3 className="text-xl md:text-2xl font-black text-white leading-snug mb-2">{f.title}</h3>
            <p className="text-sm text-white/75 leading-relaxed max-w-xl">{f.body}</p>
          </div>

          <button
            type="button"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white border border-white/20 hover:border-white/50 transition-all"
            onClick={() => {
              if (f.scrollTo) { setActiveTab(f.tab); setTimeout(() => document.getElementById(f.scrollTo)?.scrollIntoView({ behavior: 'smooth' }), 100); }
              else setActiveTab(f.tab);
            }}
          >
            {f.cta} <ArrowRight size={13} />
          </button>
        </div>

        {/* Dot strip */}
        <div className="relative z-10 px-8 md:px-10 pb-5 flex items-center gap-1.5">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); changeTo(i); }}
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === active ? 24 : 7, background: i === active ? f.accent : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
      </div>

      {/* Arrows — fade in on hover */}
      {['left', 'right'].map((side) => (
        <button
          key={side}
          type="button"
          onClick={(e) => { e.stopPropagation(); side === 'left' ? prev() : next(); }}
          className="absolute top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm"
          style={{
            [side]: 12,
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            transition: 'opacity 0.2s ease',
          }}
        >
          {side === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      ))}
    </div>
  );
}

export default function HomePage({
  theme, themeMode,
  chatMessages, chatInput, setChatInput, isChatLoading, handleChatSend, chatEndRef,
  setActiveTab,
  isVoiceListening, isVoiceSupported, voiceError, toggleVoiceInput,
}) {
  const { t } = useTranslation();
  const DIMS = [
    { Icon: PersonStanding, label: t('home.dims.mobility'),  color: '#8b5cf6' },
    { Icon: Eye,            label: t('home.dims.vision'),    color: '#3b82f6' },
    { Icon: Ear,            label: t('home.dims.hearing'),   color: '#14b8a6' },
    { Icon: Brain,          label: t('home.dims.cognitive'), color: '#f97316' },
  ];
  const IMPACT = [
    { value: t('home.impact.values.accessible'), label: t('home.impact.labels.accessible') },
    { value: t('home.impact.values.dimensions'), label: t('home.impact.labels.dimensions') },
    { value: t('home.impact.values.pathways'), label: t('home.impact.labels.pathways') },
  ];
  const TODAY = [
    { Icon: Compass, title: t('home.today.match.title'), body: t('home.today.match.body'), tab: 'careers', accent: '#6366f1' },
    { Icon: Route, title: t('home.today.learn.title'), body: t('home.today.learn.body'), tab: 'tracks', accent: '#14b8a6' },
    { Icon: BadgeCheck, title: t('home.today.cv.title'), body: t('home.today.cv.body'), tab: 'cv-generator', accent: '#a855f7' },
    { Icon: SearchCheck, title: t('home.today.roles.title'), body: t('home.today.roles.body'), tab: 'open-roles', accent: '#f97316' },
  ];
  const ACCESS_POINTS = [
    t('home.accessPoints.profile'),
    t('home.accessPoints.matching'),
    t('home.accessPoints.tools'),
    t('home.accessPoints.language'),
  ];
  const VISION_PILLARS = [
    { Icon: Landmark, title: t('home.vision.pillars.policy.title'), body: t('home.vision.pillars.policy.body') },
    { Icon: Handshake, title: t('home.vision.pillars.partnership.title'), body: t('home.vision.pillars.partnership.body') },
    { Icon: Globe2, title: t('home.vision.pillars.scale.title'), body: t('home.vision.pillars.scale.body') },
  ];
  return (
    <div className="animate-fade-in">

      {/* ── Hero + Carousel (single viewport) ── */}
      <section className="relative pt-10 pb-12 overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle,#6366f118 0%,transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle,#8b5cf614 0%,transparent 70%)' }} />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-10 items-center">

          {/* ── Left: headline ── */}
          <div className="lg:w-[42%] flex-shrink-0">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border ${themeMode === 'contrast' ? 'border-[#FFFF00] text-[#FFFF00]' : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'}`}>
              <Sparkles size={12} /> {t('home.heroBadge')}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-[1.08] tracking-tight">
              {t('home.heroTitle1')}{' '}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeMode === 'contrast' ? 'from-[#FFFF00] to-white' : 'from-indigo-500 to-violet-500'}`}>
                {t('home.heroTitleHighlight')}
              </span>
            </h1>
            <p className={`text-base mb-6 max-w-md leading-relaxed ${theme.textSecondary}`}>
              {t('home.heroSubtitle')}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setActiveTab('careers')}
                className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm ${theme.primaryBtn}`}
              >
                <Map size={16} /> {t('home.findMatch')}
              </button>
              <button
                onClick={() => setActiveTab('tracks')}
                className={`px-6 py-3 rounded-2xl font-bold border flex items-center gap-2 text-sm ${themeMode === 'contrast' ? 'border-white' : themeMode === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-slate-300 hover:border-slate-500'} transition-all`}
              >
                <Layers size={16} /> {t('home.learningTracks')}
              </button>
            </div>

            {/* Dim chips */}
            <div className="flex flex-wrap gap-2">
              {DIMS.map(({ Icon, label, color }) => (
                <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <Icon size={12} style={{ color }} />
                  {label}
                </div>
              ))}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                <Briefcase size={12} style={{ color: '#6366f1' }} />
                {t('home.dims.skillsExperience')}
              </div>
            </div>
          </div>

          {/* ── Right: carousel ── */}
          <div className="flex-1 w-full min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{t('home.whatSkillableDoes')}</p>
            <FeatureCarousel themeMode={themeMode} setActiveTab={setActiveTab} />
          </div>

        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 container mx-auto px-6">
        <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-1 text-center">{t('home.howItWorks')}</p>
        <h2 className="text-2xl font-black text-center mb-12">{t('home.threeSteps')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: '01', title: t('home.steps.01.title'), body: t('home.steps.01.body'), color: '#6366f1' },
            { n: '02', title: t('home.steps.02.title'), body: t('home.steps.02.body'), color: '#14b8a6' },
            { n: '03', title: t('home.steps.03.title'), body: t('home.steps.03.body'), color: '#f97316' },
          ].map(({ n, title, body, color }) => (
            <div key={n} className={`p-7 rounded-3xl relative overflow-hidden ${themeMode === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-100 shadow-sm'}`}>
              <div className="absolute top-5 right-5 text-6xl font-black opacity-[0.06] leading-none select-none">{n}</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18` }}>
                <span className="text-sm font-black" style={{ color }}>{n}</span>
              </div>
              <h3 className="text-lg font-black mb-2">{title}</h3>
              <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Built for real journeys ── */}
      <section className={`py-16 ${themeMode === 'dark' ? 'bg-slate-950/60' : 'bg-white/70'}`}>
        <div className="container mx-auto px-6 grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-3">{t('home.realWorld.badge')}</p>
            <h2 className="text-3xl lg:text-4xl font-black mb-5 leading-tight">{t('home.realWorld.title')}</h2>
            <p className={`text-base leading-relaxed max-w-2xl mb-8 ${theme.textSecondary}`}>
              {t('home.realWorld.body')}
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {IMPACT.map((item) => (
                <div key={item.label} className={`p-5 rounded-2xl border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-2xl font-black mb-1">{item.value}</p>
                  <p className={`text-xs font-bold leading-snug ${theme.textSecondary}`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px] rounded-3xl overflow-hidden">
            <img
              src="/skillableForPeople.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute left-6 right-6 bottom-6 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">{t('home.realWorld.imageTag')}</p>
              <p className="text-xl font-black leading-snug">{t('home.realWorld.imageText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What users can do today ── */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-9">
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">{t('home.today.badge')}</p>
            <h2 className="text-3xl font-black">{t('home.today.title')}</h2>
          </div>
          <p className={`max-w-xl text-sm leading-relaxed ${theme.textSecondary}`}>{t('home.today.body')}</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {TODAY.map(({ Icon, title, body, tab, accent }) => (
            <button
              key={title}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`text-left p-6 rounded-3xl border transition-all hover:-translate-y-1 ${themeMode === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : ''}`}
                style={themeMode === 'contrast' ? undefined : { background: `${accent}18`, color: accent, boxShadow: `0 18px 35px ${accent}18` }}
              >
                <Icon size={22} strokeWidth={2.4} />
              </div>
              <h3 className="font-black mb-2">{title}</h3>
              <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{body}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── Inclusion layer ── */}
      <section className={`py-16 ${themeMode === 'dark' ? 'bg-white/5' : 'bg-slate-900 text-white'}`}>
        <div className="container mx-auto px-6 grid lg:grid-cols-[0.9fr_1fr] gap-10 items-start">
          <div>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-2xl ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 shadow-emerald-500/25'}`}
            >
              <BadgeCheck size={25} strokeWidth={2.6} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">{t('home.inclusion.badge')}</p>
            <h2 className="text-3xl font-black leading-tight mb-4">{t('home.inclusion.title')}</h2>
            <p className={`leading-relaxed ${themeMode === 'dark' ? 'text-slate-300' : 'text-white/70'}`}>
              {t('home.inclusion.body')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {ACCESS_POINTS.map((point) => (
              <div key={point} className={`p-5 rounded-2xl border flex gap-3 ${themeMode === 'dark' ? 'bg-slate-950/50 border-white/10' : 'bg-white/5 border-white/10'}`}>
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-300" />
                <p className="text-sm font-semibold leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-16 container mx-auto px-6">
        <div className={`relative overflow-hidden rounded-3xl border ${themeMode === 'dark' ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: themeMode === 'dark' ? 'radial-gradient(circle at 15% 15%, rgba(99,102,241,0.22), transparent 38%), radial-gradient(circle at 90% 20%, rgba(20,184,166,0.18), transparent 34%)' : 'radial-gradient(circle at 15% 15%, rgba(99,102,241,0.12), transparent 38%), radial-gradient(circle at 90% 20%, rgba(20,184,166,0.12), transparent 34%)' }} />
          <div className="relative z-10 p-7 md:p-10 lg:p-12">
            <div className="grid lg:grid-cols-[0.95fr_1.15fr] gap-10 items-start">
              <div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest mb-6 ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                  <Sparkles size={14} />
                  {t('home.vision.badge')}
                </div>
                <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-5">{t('home.vision.title')}</h2>
                <p className={`text-base leading-relaxed mb-6 ${theme.textSecondary}`}>
                  {t('home.vision.body')}
                </p>
                <div className={`p-5 rounded-2xl border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-sm font-black mb-2">{t('home.vision.statementTitle')}</p>
                  <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{t('home.vision.statementBody')}</p>
                </div>
              </div>

              <div className="grid gap-4">
                {VISION_PILLARS.map(({ Icon, title, body }) => (
                  <div key={title} className={`p-5 rounded-2xl border flex gap-4 ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-100 shadow-sm'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600/10 text-indigo-500'}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-black mb-1">{title}</h3>
                      <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two audiences ── */}
      <section className="py-16 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {[
            { Icon: Users, title: t('home.audiences.seekers.title'), body: t('home.audiences.seekers.body'), cta: t('home.audiences.seekers.cta'), tab: 'careers' },
            { Icon: Building2, title: t('home.audiences.employers.title'), body: t('home.audiences.employers.body'), cta: t('home.audiences.employers.cta'), tab: 'open-roles' },
          ].map(({ Icon, title, body, cta, tab }) => (
            <div key={title} className={`p-8 rounded-3xl border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
              <Icon size={28} className={themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-500'} />
              <h2 className="text-2xl font-black mt-5 mb-3">{title}</h2>
              <p className={`leading-relaxed mb-6 ${theme.textSecondary}`}>{body}</p>
              <button onClick={() => setActiveTab(tab)} className={`px-5 py-3 rounded-2xl font-bold inline-flex items-center gap-2 ${theme.primaryBtn}`}>
                {cta} <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Tools ── */}
      <section id="ai" className="py-16 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">

          {/* Chat */}
          <div className={`rounded-3xl flex flex-col overflow-hidden border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`} style={{ minHeight: 620 }}>
            <div className={`px-7 py-5 flex items-center gap-4 border-b ${themeMode === 'dark' ? 'border-white/10' : 'border-slate-100'}`}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#6366f118' }}>
                <Bot size={18} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-base font-black">{t('home.aiTitle')}</p>
                <p className="text-sm opacity-50">{t('home.aiSubtitle')}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs opacity-50">{t('home.aiOnline')}</span>
              </div>
            </div>
            <div className="flex-1 px-6 md:px-8 py-6 overflow-y-auto space-y-4">
              {chatMessages.length === 0 && !isChatLoading && (
                <div className="h-full flex items-center justify-center">
                  <p className={`text-sm text-center max-w-[200px] leading-relaxed ${theme.textSecondary}`}>
                    {t('home.aiEmptyMsg')}
                  </p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    dir="auto"
                    className={`px-5 py-3.5 rounded-2xl max-w-[88%] md:max-w-[72%] text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.role === 'bot'
                        ? themeMode === 'dark' ? 'bg-white/10' : 'bg-slate-100'
                        : 'bg-indigo-600 text-white'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className={`px-5 py-3.5 rounded-2xl text-sm ${themeMode === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className={`px-5 md:px-7 py-5 border-t flex gap-3 ${themeMode === 'dark' ? 'border-white/10' : 'border-slate-100'}`}>
              <input
                dir="auto"
                className={`flex-1 px-5 py-3 rounded-2xl text-sm outline-none transition-all ${theme.input}`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !isChatLoading) { e.preventDefault(); handleChatSend(); } }}
                placeholder={t('home.aiPlaceholder')}
                disabled={isChatLoading}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={!isVoiceSupported || isChatLoading}
                className={`px-4 py-3 rounded-2xl flex items-center justify-center transition-all border ${isVoiceListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : themeMode === 'dark' ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-50'} ${!isVoiceSupported || isChatLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isVoiceListening ? 'Stop voice input' : 'Start voice input'}
                title={isVoiceSupported ? (isVoiceListening ? 'Recording...' : 'Voice input') : 'Voice input is not supported in this browser'}
              >
                <Mic size={16} />
              </button>
              <button
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
                className={`px-5 py-3 rounded-2xl flex items-center justify-center transition-opacity ${isChatLoading ? 'opacity-50 cursor-not-allowed' : ''} ${theme.primaryBtn}`}
              >
                <Send size={16} />
              </button>
            </div>
            {(isVoiceListening || voiceError) && (
              <div className={`px-7 pb-4 -mt-2 text-xs font-bold ${isVoiceListening ? 'text-red-500' : 'text-amber-500'}`}>
                {isVoiceListening ? 'Recording and transcribing... speak in Arabic or English.' : voiceError}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
