import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, BarChart2, Headphones, Keyboard, Factory, Megaphone, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ICONS = {
  headphones: Headphones,
  keyboard: Keyboard,
  factory: Factory,
  megaphone: Megaphone,
  monitor: Monitor,
};

export default function TracksPage({ theme, themeMode, API_BASE }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tracks, setTracks] = useState([]);
  const [status, setStatus] = useState('loading');
  const textColor = themeMode === 'contrast' ? 'text-[#FFFF00]' : themeMode === 'dark' ? 'text-white' : 'text-slate-950';
  const bodyText = themeMode === 'contrast' ? 'text-[#FFFF00]' : themeMode === 'dark' ? 'text-white' : 'text-slate-950';
  const cardClass = themeMode === 'dark'
    ? 'bg-slate-900/70 border border-slate-700 hover:border-indigo-400/70 hover:bg-slate-800'
    : themeMode === 'contrast'
      ? 'bg-black border-2 border-white'
      : 'bg-white border border-slate-300 shadow-md hover:shadow-xl hover:border-indigo-300';
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
    fetch(`${API_BASE}/work-pathways?lang=${encodeURIComponent(i18n.language || 'en')}`)
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load work pathways.');
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        setTracks(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch(() => {
        if (!alive) return;
        setTracks([]);
        setStatus('error');
      });
    return () => { alive = false; };
  }, [API_BASE, i18n.language]);

  return (
    <div className="animate-fade-in py-16 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-14 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : themeMode === 'dark' ? 'bg-indigo-400/10 text-indigo-200 border-indigo-300/20' : 'bg-indigo-50 text-indigo-800 border-indigo-200'}`}>
          {t('tracks.badge')}
        </div>
        <h1 className="text-4xl lg:text-5xl font-black mb-4">{t('tracks.title')}</h1>
        <p className={`text-lg max-w-xl mx-auto ${mutedText}`}>
          {t('tracks.subtitle')}
        </p>
      </div>

      {/* Track Cards */}
      {status === 'loading' && (
        <div className={`p-8 rounded-3xl text-center font-bold ${cardClass} ${textColor}`}>
          {t('tracks.loading')}
        </div>
      )}

      {status === 'error' && (
        <div className={`p-8 rounded-3xl text-center ${cardClass} ${textColor}`}>
          <p className="font-black mb-2">{t('tracks.loadErrorTitle')}</p>
          <p className={`text-sm ${mutedText}`}>{t('tracks.loadErrorBody')}</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {status === 'ready' && tracks.map((track) => {
          const Icon = ICONS[track.icon_key] || Monitor;
          const skills = track.skills || [];
          return (
          <button
            key={track.id}
            onClick={() => navigate(`/tracks/${track.id}`)}
            className={`text-left rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${cardClass} ${textColor}`}
            aria-label={`View ${track.title} track`}
          >
            <div className={`p-7 flex flex-col gap-4 ${bodyText} ${themeMode === 'dark' ? 'bg-slate-950/10' : themeMode === 'contrast' ? 'bg-black' : 'bg-white'}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconShell}`}>
                <Icon size={23} aria-hidden="true" />
              </div>
              <div>
                <h2 className={`text-2xl font-black leading-tight mb-2 ${bodyText}`}>{track.title}</h2>
                <p className={`text-sm leading-relaxed ${mutedText}`}>{track.tagline}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className={`flex items-center gap-1 ${mutedText}`}>
                  <Clock size={13} aria-hidden="true" />
                  {track.duration}
                </span>
                <span className={`flex items-center gap-1 ${mutedText}`}>
                  <BarChart2 size={13} aria-hidden="true" />
                  {track.difficulty}
                </span>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${chipClass}`}
                  >
                    {tech}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${mutedText}`}>
                    {t('tracks.more', { count: skills.length - 5 })}
                  </span>
                )}
              </div>

              <div className={`flex items-center gap-1 text-sm font-bold mt-auto pt-2 ${themeMode === 'contrast' ? 'text-[#FFFF00]' : themeMode === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                {t('tracks.viewTrack')} <ArrowRight size={16} aria-hidden="true" />
              </div>
            </div>
          </button>
          );
        })}
      </div>
    </div>
  );
}
