import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TRACKS } from '../data/tracks';
import { ArrowRight, Clock, BarChart2 } from 'lucide-react';

export default function TracksPage({ theme, themeMode }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in py-16 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-14 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
          Learning Tracks
        </div>
        <h1 className="text-4xl lg:text-5xl font-black mb-4">Choose your path</h1>
        <p className={`text-lg max-w-xl mx-auto ${theme.textSecondary}`}>
          Structured, step-by-step learning tracks designed to take you from zero to job-ready.
        </p>
      </div>

      {/* Track Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {TRACKS.map((track) => (
          <button
            key={track.id}
            onClick={() => navigate(`/tracks/${track.id}`)}
            className={`text-left rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme.card}`}
            aria-label={`View ${track.title} track`}
          >
            {/* Gradient header */}
            <div className={`bg-gradient-to-br ${track.color} p-8 flex flex-col gap-3`}>
              <track.Icon size={40} className="text-white/90" aria-hidden="true" />
              <h2 className="text-2xl font-black text-white leading-tight">{track.title}</h2>
              <p className="text-white/80 text-sm leading-relaxed">{track.tagline}</p>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className={`flex items-center gap-1 ${theme.textSecondary}`}>
                  <Clock size={13} aria-hidden="true" />
                  {track.duration}
                </span>
                <span className={`flex items-center gap-1 ${theme.textSecondary}`}>
                  <BarChart2 size={13} aria-hidden="true" />
                  {track.difficulty}
                </span>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {track.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${themeMode === 'contrast' ? 'border border-white' : 'bg-indigo-500/10 text-indigo-400'}`}
                  >
                    {tech}
                  </span>
                ))}
                {track.techStack.length > 5 && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${theme.textSecondary}`}>
                    +{track.techStack.length - 5} more
                  </span>
                )}
              </div>

              <div className={`flex items-center gap-1 text-sm font-bold mt-auto pt-2 ${themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-500'}`}>
                View Track <ArrowRight size={16} aria-hidden="true" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
