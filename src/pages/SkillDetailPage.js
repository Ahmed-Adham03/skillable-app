import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Circle, PlayCircle,
  ChevronLeft, ChevronRight, ExternalLink, BookOpen,
  Trophy, Link as LinkIcon
} from 'lucide-react';

function getEmbedUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '').trim();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return '';
  }
  return '';
}

export default function SkillDetailPage({ theme, themeMode, plan, planIndex, onBack, onToggleStep }) {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const isContrast = themeMode === 'contrast';
  const isDark = themeMode === 'dark';

  const roadmap  = useMemo(() => plan?.roadmap  || [], [plan]);
  const progress = useMemo(() => plan?.progress || [], [plan]);
  const videos   = useMemo(() => {
    const listed = Array.isArray(plan?.videos) ? plan.videos : [];
    return roadmap.map((checkpoint, idx) => {
      const existing = listed[idx];
      if (existing?.url) return { title: existing.title || checkpoint, url: existing.url };
      const query = encodeURIComponent(`${plan?.jobtitle || 'Skill'} ${checkpoint} tutorial`);
      return { title: checkpoint, url: `https://www.youtube.com/results?search_query=${query}` };
    });
  }, [plan, roadmap]);

  useEffect(() => { setCurrentVideoIndex(0); }, [plan?.jobtitle]);
  useEffect(() => {
    if (currentVideoIndex >= videos.length) setCurrentVideoIndex(Math.max(0, videos.length - 1));
  }, [currentVideoIndex, videos.length]);

  const total        = roadmap.length || 1;
  const completed    = progress.filter(Boolean).length;
  const percent      = Math.round((completed / total) * 100);
  const currentVideo = videos[currentVideoIndex] || null;
  const embedUrl     = useMemo(() => getEmbedUrl(currentVideo?.url), [currentVideo]);
  const isComplete   = percent === 100;

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <BookOpen size={40} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-400'} />
        <p className={`text-lg font-semibold ${theme.textSecondary}`}>Select a skill from the dashboard.</p>
        <button onClick={() => navigate('/dashboard')} className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div className={`px-6 pt-10 pb-20 ${isContrast ? 'border-b-2 border-[#FFFF00]' : isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950' : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800'}`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                <BookOpen size={12} /> Learning Path
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">{plan.jobtitle}</h1>
              {(plan.summary || plan.details) && (
                <p className="text-white/60 text-base max-w-2xl leading-relaxed">
                  {plan.summary || plan.details}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-6">
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                  <CheckCircle2 size={12} /> {completed} / {roadmap.length} steps done
                </span>
                {videos.length > 0 && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                    <PlayCircle size={12} /> {videos.length} videos
                  </span>
                )}
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2">
              <div className={`relative w-36 h-36 rounded-3xl flex items-center justify-center ${isContrast ? 'border-2 border-[#FFFF00]' : 'bg-white/10 border border-white/15 backdrop-blur-sm'}`}>
                <svg className="absolute inset-2 rotate-[-90deg]" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="44" fill="none"
                    stroke={isContrast ? '#FFFF00' : 'white'} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 44}
                    strokeDashoffset={2 * Math.PI * 44 * (1 - percent / 100)}
                    style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                  />
                </svg>
                <div className="text-center z-10 flex flex-col items-center leading-none gap-0.5">
                  <span className="text-2xl font-black text-white tracking-tight">{percent}%</span>
                  <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">done</span>
                </div>
              </div>
              {isComplete && (
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-emerald-400/20 text-emerald-300'}`}>
                  <Trophy size={11} /> Complete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: video player ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Video player card */}
            {currentVideo && (
              <div className={`rounded-2xl overflow-hidden ${theme.card}`}>
                {/* Player chrome bar */}
                <div className={`px-5 py-3 flex items-center justify-between ${isContrast ? 'bg-black border-b border-white' : isDark ? 'bg-slate-800' : 'bg-slate-900'}`}>
                  <div className="flex items-center gap-2">
                    <PlayCircle size={15} className="text-white/50" aria-hidden="true" />
                    <span className="text-white text-xs font-bold truncate max-w-[240px]">{currentVideo.title}</span>
                  </div>
                  <span className={`text-xs font-semibold ${isContrast ? 'text-[#FFFF00]' : 'text-white/40'}`}>
                    {currentVideoIndex + 1} / {videos.length}
                  </span>
                </div>

                {/* Video area */}
                {embedUrl ? (
                  <div className="relative w-full pt-[56.25%] bg-black">
                    <iframe
                      src={embedUrl}
                      title={currentVideo.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center gap-3 py-16 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <PlayCircle size={40} className={isContrast ? 'text-[#FFFF00]' : 'text-slate-400'} />
                    <p className={`text-sm font-semibold ${theme.textSecondary}`}>This video can't be embedded.</p>
                    <a
                      href={currentVideo.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 ${theme.primaryBtn}`}
                    >
                      Watch on YouTube <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                {/* Controls */}
                <div className="p-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleStep(planIndex, currentVideoIndex, true);
                      setCurrentVideoIndex((prev) => Math.min(videos.length - 1, prev + 1));
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${theme.primaryBtn}`}
                  >
                    <CheckCircle2 size={15} /> Mark watched & next
                  </button>
                  {embedUrl && (
                    <a
                      href={currentVideo.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border ${isContrast ? 'border-white text-white' : isDark ? 'border-slate-600 text-slate-300' : 'border-slate-300 text-slate-700'}`}
                    >
                      <ExternalLink size={14} /> Open in YouTube
                    </a>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentVideoIndex((p) => Math.max(0, p - 1))}
                      disabled={currentVideoIndex === 0}
                      aria-label="Previous video"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-opacity ${currentVideoIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-70'} ${isContrast ? 'border-white' : isDark ? 'border-slate-600' : 'border-slate-300'}`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentVideoIndex((p) => Math.min(videos.length - 1, p + 1))}
                      disabled={currentVideoIndex >= videos.length - 1}
                      aria-label="Next video"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-opacity ${currentVideoIndex >= videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-70'} ${isContrast ? 'border-white' : isDark ? 'border-slate-600' : 'border-slate-300'}`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sources */}
            {Array.isArray(plan.sources) && plan.sources.length > 0 && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h2 className="font-black text-base mb-4 flex items-center gap-2">
                  <LinkIcon size={15} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  Sources
                </h2>
                <ul className="space-y-2">
                  {plan.sources.map((source, idx) => (
                    <li key={idx}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-sm flex items-center gap-2 font-semibold underline underline-offset-2 ${isContrast ? 'text-[#FFFF00]' : isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
                      >
                        <ExternalLink size={13} /> {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Right: checklist ── */}
          <div className="space-y-5">

            {/* Completion banner */}
            {isComplete && (
              <div className={`rounded-2xl overflow-hidden ${isContrast ? 'border-2 border-[#FFFF00]' : ''}`}>
                <div className={`px-5 py-4 flex items-center gap-4 ${isContrast ? 'bg-black' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isContrast ? 'border border-[#FFFF00]' : 'bg-white/20'}`}>
                    <Trophy size={20} className={isContrast ? 'text-[#FFFF00]' : 'text-white'} />
                  </div>
                  <div>
                    <p className={`text-sm font-black ${isContrast ? 'text-[#FFFF00]' : 'text-white'}`}>Path complete!</p>
                    <p className={`text-xs mt-0.5 ${isContrast ? 'text-[#FFFF00]/70' : 'text-white/70'}`}>All steps finished.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress bar card */}
            <div className={`rounded-2xl p-5 ${theme.card}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black">Progress</span>
                <span className={`text-sm font-black ${isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'}`}>{percent}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ${isContrast ? 'bg-[#FFFF00]' : 'bg-indigo-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className={`text-xs mt-2 ${theme.textSecondary}`}>{completed} of {roadmap.length} steps completed</p>
            </div>

            {/* Checklist */}
            <div className={`rounded-2xl p-5 ${theme.card}`}>
              <h2 className="font-black text-sm mb-4">Checklist</h2>
              <ul className="space-y-2">
                {roadmap.map((step, sidx) => {
                  const done = Boolean(progress[sidx]);
                  const isActive = sidx === currentVideoIndex;
                  return (
                    <li
                      key={sidx}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${isActive ? (isContrast ? 'border border-[#FFFF00]' : isDark ? 'bg-indigo-500/15' : 'bg-indigo-50 border border-indigo-100') : ''}`}
                      onClick={() => setCurrentVideoIndex(sidx)}
                    >
                      <button
                        type="button"
                        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleStep(planIndex, sidx, !done);
                        }}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {done
                          ? <CheckCircle2 size={18} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} />
                          : <Circle size={18} className={theme.textSecondary} />
                        }
                      </button>
                      <span className={`text-xs leading-relaxed flex-1 ${done ? 'line-through opacity-50' : ''} ${theme.textSecondary}`}>
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
