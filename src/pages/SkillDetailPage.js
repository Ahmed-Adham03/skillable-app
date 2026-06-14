import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, CheckCircle2, Circle, ExternalLink,
  Link as LinkIcon, Trophy
} from 'lucide-react';
import { getCourseResources, getLearningVideos } from '../data/learningCatalog';

export default function SkillDetailPage({ theme, themeMode, plan, planIndex, onBack, onToggleStep }) {
  const navigate = useNavigate();
  const isContrast = themeMode === 'contrast';
  const isDark = themeMode === 'dark';

  const roadmap = useMemo(() => plan?.roadmap || [], [plan]);
  const progress = useMemo(() => plan?.progress || [], [plan]);
  const resources = useMemo(() => getCourseResources(plan), [plan]);
  const videos = useMemo(() => getLearningVideos(plan), [plan]);

  const total = roadmap.length || 1;
  const completed = progress.filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);
  const isComplete = percent === 100;

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <BookOpen size={40} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-400'} />
        <p className={`text-lg font-semibold ${theme.textSecondary}`}>Select a path from the dashboard.</p>
        <button onClick={() => navigate('/dashboard')} className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
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
                <BookOpen size={12} /> Guided Learning Path
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-3">{plan.jobtitle}</h1>
              {(plan.summary || plan.details) && (
                <p className="text-white/60 text-base max-w-2xl leading-relaxed">
                  {plan.summary || plan.details}
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-6">
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                  <CheckCircle2 size={12} /> {completed} / {roadmap.length} checkpoints done
                </span>
                {resources.length > 0 && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                    <LinkIcon size={12} /> {resources.length} course resources
                  </span>
                )}
              </div>
            </div>

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

      <div className="max-w-6xl mx-auto px-6 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <section className={`rounded-2xl p-6 ${theme.card}`}>
              <h2 className="font-black text-base mb-2 flex items-center gap-2">
                <BookOpen size={16} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} />
                How this path works
              </h2>
              <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
                Skillable does not replace Coursera, Udemy, freeCodeCamp, or YouTube. It gives you the roadmap, suggests trusted learning places, and lets you track your progress here after studying externally.
              </p>
            </section>

            {resources.length > 0 && (
              <section className={`rounded-2xl p-6 ${theme.card}`}>
                <h2 className="font-black text-base mb-4 flex items-center gap-2">
                  <LinkIcon size={15} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  Course resources
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={`${resource.provider}-${resource.url}`}
                      resource={resource}
                      theme={theme}
                      isDark={isDark}
                      isContrast={isContrast}
                    />
                  ))}
                </div>
              </section>
            )}

            {videos.length > 0 && (
              <section className={`rounded-2xl p-6 ${theme.card}`}>
                <h2 className="font-black text-base mb-4 flex items-center gap-2">
                  <ExternalLink size={15} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  Recommended video resources
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {videos.map((video) => (
                    <ResourceCard
                      key={`${video.provider}-${video.url}`}
                      resource={{
                        provider: video.provider || 'YouTube',
                        label: video.title,
                        url: video.url,
                        note: video.provider === 'freeCodeCamp' ? 'Free long-form course, useful for multiple checkpoints.' : 'External video lesson.',
                      }}
                      theme={theme}
                      isDark={isDark}
                      isContrast={isContrast}
                    />
                  ))}
                </div>
              </section>
            )}

            {Array.isArray(plan.sources) && plan.sources.length > 0 && (
              <section className={`rounded-2xl p-6 ${theme.card}`}>
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
              </section>
            )}
          </div>

          <aside className="space-y-5">
            {isComplete && (
              <div className={`rounded-2xl overflow-hidden ${isContrast ? 'border-2 border-[#FFFF00]' : ''}`}>
                <div className={`px-5 py-4 flex items-center gap-4 ${isContrast ? 'bg-black' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isContrast ? 'border border-[#FFFF00]' : 'bg-white/20'}`}>
                    <Trophy size={20} className={isContrast ? 'text-[#FFFF00]' : 'text-white'} />
                  </div>
                  <div>
                    <p className={`text-sm font-black ${isContrast ? 'text-[#FFFF00]' : 'text-white'}`}>Path complete!</p>
                    <p className={`text-xs mt-0.5 ${isContrast ? 'text-[#FFFF00]/70' : 'text-white/70'}`}>All checkpoints finished.</p>
                  </div>
                </div>
              </div>
            )}

            <section className={`rounded-2xl p-5 ${theme.card}`}>
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
              <p className={`text-xs mt-2 ${theme.textSecondary}`}>{completed} of {roadmap.length} checkpoints completed</p>
            </section>

            <section className={`rounded-2xl p-5 ${theme.card}`}>
              <h2 className="font-black text-sm mb-4">Progress checklist</h2>
              <ul className="space-y-2">
                {roadmap.map((step, index) => {
                  const done = Boolean(progress[index]);
                  const isActive = !done && index === progress.findIndex((value) => !value);
                  return (
                    <li
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${isActive ? (isContrast ? 'border border-[#FFFF00]' : isDark ? 'bg-indigo-500/15' : 'bg-indigo-50 border border-indigo-100') : ''}`}
                    >
                      <button
                        type="button"
                        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                        onClick={() => onToggleStep(planIndex, index, !done)}
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
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ resource, theme, isDark, isContrast }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className={`p-4 rounded-2xl border transition-colors ${isContrast ? 'border-white hover:border-[#FFFF00]' : isDark ? 'border-white/10 hover:border-indigo-400/50 bg-white/5' : 'border-slate-200 hover:border-indigo-300 bg-slate-50'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{resource.provider}</p>
          <p className={`text-xs mt-1 leading-relaxed ${theme.textSecondary}`}>{resource.label}</p>
          {resource.note && <p className={`text-[11px] mt-2 ${theme.textSecondary}`}>{resource.note}</p>}
        </div>
        <ExternalLink size={14} className="flex-shrink-0 opacity-60" />
      </div>
    </a>
  );
}
