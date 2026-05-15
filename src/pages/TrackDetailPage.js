import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Clock, BarChart2, BookOpen, Lock, AlertCircle,
  Headphones, Keyboard, Factory, Megaphone, Monitor
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICONS = {
  headphones: Headphones,
  keyboard: Keyboard,
  factory: Factory,
  megaphone: Megaphone,
  monitor: Monitor,
};

export default function TrackDetailPage({ theme, themeMode, currentUser, API_BASE }) {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [track, setTrack] = useState(null);
  const [status, setStatus] = useState('loading');
  const textColor = themeMode === 'contrast' ? 'text-[#FFFF00]' : themeMode === 'dark' ? 'text-white' : 'text-slate-950';
  const strongText = themeMode === 'contrast' ? 'text-[#FFFF00]' : themeMode === 'dark' ? 'text-white' : 'text-slate-950';
  const panelClass = themeMode === 'dark'
    ? 'bg-slate-900/70 border border-slate-700'
    : themeMode === 'contrast'
      ? 'bg-black border-2 border-white'
      : 'bg-white border border-slate-300 shadow-md';
  const mutedText = themeMode === 'dark' ? 'text-slate-300' : themeMode === 'contrast' ? 'text-white' : 'text-slate-700';
  const chipClass = themeMode === 'contrast'
    ? 'border border-white text-[#FFFF00]'
    : themeMode === 'dark'
      ? 'bg-indigo-400/10 text-indigo-200 border border-indigo-300/20'
      : 'bg-indigo-50 text-indigo-800 border border-indigo-200';
  const iconShell = themeMode === 'contrast'
    ? 'border border-white text-[#FFFF00]'
    : themeMode === 'dark'
      ? 'bg-indigo-400/10 text-indigo-200 border border-indigo-300/20'
      : 'bg-indigo-50 text-indigo-700 border border-indigo-200';

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    fetch(`${API_BASE}/work-pathways/${trackId}?lang=${encodeURIComponent(i18n.language || 'en')}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Unable to load work pathway.');
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        setTrack(data);
        setStatus(data ? 'ready' : 'not-found');
      })
      .catch(() => {
        if (!alive) return;
        setTrack(null);
        setStatus('error');
      });
    return () => { alive = false; };
  }, [API_BASE, trackId, i18n.language]);

  if (status === 'loading') {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold">{t('tracks.pathwayLoading')}</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold mb-4">{t('tracks.pathwayErrorTitle')}</p>
        <p className={`mb-4 ${mutedText}`}>{t('tracks.loadErrorBody')}</p>
        <button onClick={() => navigate('/tracks')} className={`px-6 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>
          {t('tracks.back')}
        </button>
      </div>
    );
  }

  if (!track || status === 'not-found') {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold mb-4">{t('tracks.pathwayNotFound')}</p>
        <button onClick={() => navigate('/tracks')} className={`px-6 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>
          {t('tracks.back')}
        </button>
      </div>
    );
  }

  // Placeholder: later this will be derived from currentUser profile data
  const userSkills = currentUser?.skills || [];
  const skills = track.skills || [];
  const Icon = ICONS[track.icon_key] || Monitor;
  const missingSkills = skills.filter(
    (tech) => !userSkills.some((s) => s.toLowerCase() === tech.toLowerCase())
  );
  const ownedSkills = skills.filter((tech) =>
    userSkills.some((s) => s.toLowerCase() === tech.toLowerCase())
  );

  return (
    <div className="animate-fade-in py-12 px-6 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/tracks')}
        className={`flex items-center gap-2 text-sm font-bold mb-8 hover:opacity-70 transition-opacity ${mutedText}`}
      >
        <ArrowLeft size={16} aria-hidden="true" /> {t('tracks.back')}
      </button>

      {/* Hero */}
      <div className={`rounded-3xl overflow-hidden mb-10 p-8 md:p-10 ${panelClass} ${strongText}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${iconShell}`}>
            <Icon size={30} aria-hidden="true" />
          </div>
          <h1 className={`text-4xl font-black mb-3 ${strongText}`}>{track.title}</h1>
          <p className={`text-lg max-w-2xl ${mutedText}`}>{track.description}</p>
          <div className={`flex flex-wrap gap-6 mt-6 text-sm font-bold ${mutedText}`}>
            <span className="flex items-center gap-2"><Clock size={15} aria-hidden="true" /> {track.duration}</span>
            <span className="flex items-center gap-2"><BarChart2 size={15} aria-hidden="true" /> {track.difficulty}</span>
            <span className="flex items-center gap-2"><BookOpen size={15} aria-hidden="true" /> {t('tracks.phases', { count: (track.phases || []).length })}</span>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left col — roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className={`text-2xl font-black ${strongText}`}>{t('tracks.roadmap')}</h2>

          {(track.phases || []).map((phase, idx) => (
            <div key={idx} className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className={strongText}>
                  <h3 className="font-black text-base">{phase.title}</h3>
                  <span className={`text-xs font-semibold ${mutedText}`}>{phase.weeks}</span>
                </div>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                  {idx + 1}
                </span>
              </div>
              <ul className="space-y-2">
                {phase.topics.map((topic, tIdx) => (
                  <li key={tIdx} className={`flex items-start gap-2 text-sm ${mutedText} ${themeMode === 'light' ? 'text-slate-800' : ''}`}>
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-emerald-500" aria-hidden="true" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Right col — sidebar */}
        <div className="space-y-6">
          {/* Requirements */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-4 ${strongText}`}>{t('tracks.requirements')}</h3>
            <ul className="space-y-2">
              {(track.requirements || []).map((req, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${mutedText} ${themeMode === 'light' ? 'text-slate-800' : ''}`}>
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Suitable workplaces */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-4 ${strongText}`}>{t('tracks.workplaces')}</h3>
            <ul className="space-y-2">
              {(track.workplace_types || []).map((place, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${mutedText} ${themeMode === 'light' ? 'text-slate-800' : ''}`}>
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-emerald-500" aria-hidden="true" />
                  {place}
                </li>
              ))}
            </ul>
          </div>

          {/* Real places */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-4 ${strongText}`}>{t('tracks.realPlaces')}</h3>
            <div className="space-y-3">
              {(track.real_places || []).map((place, i) => (
                <a
                  key={`${place.name}-${i}`}
                  href={place.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`block rounded-xl p-3 border transition-colors ${themeMode === 'contrast' ? 'border-white hover:bg-white hover:text-black' : themeMode === 'dark' ? 'border-slate-700 hover:border-indigo-300/50 hover:bg-white/5' : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/60'}`}
                >
                  <div className={`text-sm font-black mb-1 ${strongText}`}>{place.name}</div>
                  <p className={`text-xs leading-relaxed ${mutedText}`}>{place.note}</p>
                  <span className={`mt-2 inline-flex text-xs font-bold ${themeMode === 'contrast' ? 'text-current' : themeMode === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    {t('tracks.openPlace')}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Accessibility fit */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-4 ${strongText}`}>{t('tracks.accessibilityFit')}</h3>
            <ul className="space-y-2">
              {(track.accessibility_fit || []).map((fit, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${mutedText} ${themeMode === 'light' ? 'text-slate-800' : ''}`}>
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                  {fit}
                </li>
              ))}
            </ul>
          </div>

          {/* Gap Analysis */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-1 ${strongText}`}>{t('tracks.gapTitle')}</h3>
            <p className={`text-xs mb-4 ${mutedText}`}>
              {t('tracks.gapBody')}
            </p>

            {!currentUser ? (
              <div className={`flex flex-col items-center gap-3 py-4 text-center rounded-xl ${themeMode === 'contrast' ? 'border border-white' : themeMode === 'dark' ? 'bg-indigo-400/5 border border-indigo-300/20' : 'bg-indigo-50 border border-indigo-200'}`}>
                <Lock size={22} className={themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-400'} aria-hidden="true" />
                <p className={`text-xs font-semibold ${mutedText}`}>
                  {t('tracks.signInGap')}
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                >
                  {t('tracks.signIn')}
                </button>
              </div>
            ) : userSkills.length === 0 ? (
              <div className={`flex flex-col items-center gap-3 py-4 text-center rounded-xl ${themeMode === 'contrast' ? 'border border-white' : themeMode === 'dark' ? 'bg-amber-400/5 border border-amber-300/20' : 'bg-amber-50 border border-amber-200'}`}>
                <AlertCircle size={22} className="text-amber-500" aria-hidden="true" />
                <p className={`text-xs font-semibold ${mutedText}`}>
                  {t('tracks.completeSkills')}
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                >
                  {t('tracks.completeProfile')}
                </button>
              </div>
            ) : (
              <>
                {ownedSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-emerald-500 mb-2">{t('tracks.ownedSkills')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ownedSkills.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {missingSkills.length > 0 && (
                  <div>
                    <p className={`text-xs font-bold mb-2 ${themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-amber-500'}`}>{t('tracks.missingSkills')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((s) => (
                        <span key={s} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${themeMode === 'contrast' ? 'border border-white' : 'bg-amber-500/10 text-amber-600'}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Skills full list */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-4 ${strongText}`}>{t('tracks.skillsBuild')}</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${chipClass}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className={`rounded-2xl p-6 ${panelClass} ${textColor}`}>
            <h3 className={`font-black mb-4 ${strongText}`}>{t('tracks.resources')}</h3>
            <ul className="space-y-2">
              {(track.resources || []).map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    className={`text-sm font-semibold underline underline-offset-2 ${themeMode === 'contrast' ? 'text-[#FFFF00]' : themeMode === 'dark' ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-700 hover:text-indigo-900'}`}
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/careers')}
            className={`w-full py-3 rounded-2xl font-bold text-sm ${theme.primaryBtn}`}
          >
            {t('tracks.browseRelated')}
          </button>
        </div>
      </div>
    </div>
  );
}
