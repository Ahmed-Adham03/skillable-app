import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, Briefcase, Sparkles, Send, ArrowRight,
  ChevronLeft, ChevronRight, Map, FileText, Layers,
  Brain, Eye, Ear, PersonStanding, Target
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
}) {
  const { t } = useTranslation();
  const DIMS = [
    { Icon: PersonStanding, label: t('home.dims.mobility'),  color: '#8b5cf6' },
    { Icon: Eye,            label: t('home.dims.vision'),    color: '#3b82f6' },
    { Icon: Ear,            label: t('home.dims.hearing'),   color: '#14b8a6' },
    { Icon: Brain,          label: t('home.dims.cognitive'), color: '#f97316' },
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
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
                className={`px-5 py-3 rounded-2xl flex items-center justify-center transition-opacity ${isChatLoading ? 'opacity-50 cursor-not-allowed' : ''} ${theme.primaryBtn}`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
