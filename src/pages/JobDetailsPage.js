import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, BookOpen, CheckCircle2,
  Zap, ChevronRight, Target, Layers, ExternalLink
} from 'lucide-react';
import { getJobLogo } from '../data/jobLogos';
import { getCourseResources, getLearningVideos } from '../data/learningCatalog';
import { useTranslation } from 'react-i18next';

export default function JobDetailsPage({ theme, themeMode, job, setActiveTab, onEnroll }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isContrast = themeMode === 'contrast';
  const isDark = themeMode === 'dark';

  if (!job) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Layers size={40} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-400'} />
        <p className={`text-lg font-semibold ${theme.textSecondary}`}>{t('jobDetails.selectCareer', 'Select a career path to see its details.')}</p>
        <button onClick={() => navigate('/careers')} className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>
          {t('jobDetails.browseCareers', 'Browse careers')}
        </button>
      </div>
    );
  }

  const matchPct = job.match_percentage ?? null;
  const roadmap  = job.roadmap     || [];
  const skills   = job.skills      || [];
  const reasons  = job.why_matched || [];
  const resources = getCourseResources(job);
  const videos = getLearningVideos(job);
  const logo = getJobLogo(job.logo_key);
  const LogoIcon = logo.Icon;

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div className={`px-6 pt-10 pb-20 ${isContrast ? 'border-b-2 border-[#FFFF00]' : isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950' : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800'}`}>
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/careers')}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> {t('jobDetails.backToPaths', 'Back to Career Paths')}
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
            <div className="flex-1">
              {/* Icon + title */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                {job.source === 'open_job' ? <LogoIcon size={12} /> : <Layers size={12} />}
                {job.source === 'open_job' ? t('jobDetails.openJob', 'Open Job') : t('jobDetails.careerPath', 'Career Path')}
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                {t(`jobs.${job.jobtitle}`, job.jobtitle)}
              </h1>
              {job.company_name && <p className="text-white/70 text-sm font-bold mb-2">{job.company_name}</p>}
              <p className="text-white/65 text-base max-w-2xl leading-relaxed">{t(`jobs.${job.summary}`, job.summary)}</p>

              {/* Quick meta */}
              <div className="flex flex-wrap gap-3 mt-6">
                {job.location && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                    <MapPin size={12} /> {t(`jobs.${job.location}`, job.location)}
                  </span>
                )}
                {skills.length > 0 && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                    <Zap size={12} /> {skills.length} {t('jobDetails.skillsRequired', 'skills required')}
                  </span>
                )}
                {roadmap.length > 0 && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                    <BookOpen size={12} /> {roadmap.length} {t('jobDetails.learningSteps', 'learning steps')}
                  </span>
                )}
                {job.duration && (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/10 text-white/70 border border-white/10'}`}>
                    <BookOpen size={12} /> {t(`jobs.${job.duration}`, job.duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Match score badge */}
            {matchPct !== null && (
              <div className={`flex-shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-3xl ${isContrast ? 'border-2 border-[#FFFF00]' : 'bg-white/10 border border-white/15 backdrop-blur-sm'}`}>
                <span className="text-4xl font-black text-white">{matchPct}%</span>
                <span className="text-xs font-semibold text-white/50 mt-1 text-center leading-tight">{t('jobDetails.profileMatch', 'profile')}<br/>{t('jobDetails.profileMatchSub', 'match')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Skills */}
            {skills.length > 0 && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h2 className="font-black text-base mb-4 flex items-center gap-2">
                  <Zap size={16} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  {t('jobDetails.skillsBuild', 'Skills you will build')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${isContrast ? 'border border-white' : isDark ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}
                    >
                      {t(`jobs.${skill}`, skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap — timeline style */}
            {roadmap.length > 0 && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h2 className="font-black text-base mb-6 flex items-center gap-2">
                  <Target size={16} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  {t('jobDetails.learningRoadmap', 'Learning roadmap')}
                </h2>
                <ol className="relative space-y-0">
                  {roadmap.map((step, i) => {
                    const isLast = i === roadmap.length - 1;
                    return (
                      <li key={i} className="flex gap-4">
                        {/* Timeline spine */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 z-10 ${isContrast ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                            {i + 1}
                          </div>
                          {!isLast && (
                            <div className={`w-px flex-1 my-1 ${isContrast ? 'bg-[#FFFF00]/30' : isDark ? 'bg-indigo-500/20' : 'bg-indigo-200'}`} style={{ minHeight: '1.5rem' }} />
                          )}
                        </div>
                        {/* Step content */}
                        <div className={`pb-5 flex-1 ${isLast ? '' : ''}`}>
                          <p className={`text-sm leading-relaxed pt-1 ${theme.textSecondary}`}>{t(`jobs.${step}`, step)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* Details */}
            {job.details && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h2 className="font-black text-base mb-3 flex items-center gap-2">
                  <BookOpen size={16} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  {t('jobDetails.aboutPath', 'About this path')}
                </h2>
                <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{t(`jobs.${job.details}`, job.details)}</p>
              </div>
            )}
          </div>

          {/* ── Right: sidebar ── */}
          <div className="space-y-5">

            {/* Enroll CTA */}
            <div className={`rounded-2xl p-6 ${isContrast ? 'border-2 border-[#FFFF00]' : isDark ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-indigo-600 text-white'}`}>
              <p className={`text-sm font-bold mb-1 ${isContrast || !isDark ? 'text-white' : 'text-indigo-200'}`}>{t('jobDetails.readyStart', 'Ready to start?')}</p>
              <p className={`text-xs mb-4 ${isContrast ? 'text-[#FFFF00]/70' : isDark ? 'text-indigo-300/70' : 'text-white/70'}`}>
                {t('jobDetails.addDashboard', 'Add this path to your dashboard and track your progress step by step.')}
              </p>
              <button
                onClick={() => onEnroll?.(job)}
                className={`w-full py-3 rounded-xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${isContrast ? 'bg-[#FFFF00] text-black' : isDark ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-white text-indigo-700 hover:bg-indigo-50'}`}
              >
                {t('jobDetails.enrollNow', 'Enroll now')} <ChevronRight size={16} />
              </button>
            </div>

            {/* Why matched */}
            {reasons.length > 0 && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h3 className="font-black text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500" aria-hidden="true" />
                  {t('jobDetails.whyMatches', 'Why this matches you')}
                </h3>
                <ul className="space-y-3">
                  {reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isContrast ? 'bg-[#FFFF00]' : 'bg-emerald-500'}`} style={{ marginTop: '6px' }} />
                      <span className={`text-xs leading-relaxed ${theme.textSecondary}`}>{t(`jobs.${reason}`, reason)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learning resource */}
            {job.learning_resource && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h3 className="font-black text-sm mb-2 flex items-center gap-2">
                  <BookOpen size={15} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  {t('jobDetails.learningResource', 'Learning resource')}
                </h3>
                <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>{t(`jobs.${job.learning_resource}`, job.learning_resource)}</p>
              </div>
            )}

            {resources.length > 0 && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h3 className="font-black text-sm mb-4 flex items-center gap-2">
                  <BookOpen size={15} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  {t('jobDetails.courseResources', 'Course resources')}
                </h3>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <a
                      key={`${resource.provider}-${resource.url}`}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`block p-4 rounded-2xl border transition-colors ${isContrast ? 'border-white hover:border-[#FFFF00]' : isDark ? 'border-white/10 hover:border-indigo-400/50 bg-white/5' : 'border-slate-200 hover:border-indigo-300 bg-slate-50'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{t(`jobs.${resource.provider}`, resource.provider)}</p>
                          <p className={`text-xs mt-1 leading-relaxed ${theme.textSecondary}`}>{t(`jobs.${resource.label}`, resource.label)}</p>
                          {resource.note && <p className={`text-[11px] mt-2 ${theme.textSecondary}`}>{t(`jobs.${resource.note}`, resource.note)}</p>}
                        </div>
                        <ExternalLink size={14} className="flex-shrink-0 opacity-60" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div className={`rounded-2xl p-6 ${theme.card}`}>
                <h3 className="font-black text-sm mb-2 flex items-center gap-2">
                  <Target size={15} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} aria-hidden="true" />
                  {t('jobDetails.suggestedVideo', 'Suggested video support')}
                </h3>
                <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>
                  {t('jobDetails.videoSupportDesc', 'After enrolling, Skillable will list helpful external videos beside your roadmap. Study on the original platform, then return here to mark checkpoints complete.')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
