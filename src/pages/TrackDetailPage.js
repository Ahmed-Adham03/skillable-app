import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TRACKS } from '../data/tracks';
import { ArrowLeft, CheckCircle2, Clock, BarChart2, BookOpen, Lock, AlertCircle } from 'lucide-react';

export default function TrackDetailPage({ theme, themeMode, currentUser }) {
  const { trackId } = useParams();
  const navigate = useNavigate();

  const track = TRACKS.find((t) => t.id === trackId);

  if (!track) {
    return (
      <div className="py-24 text-center">
        <p className="text-2xl font-bold mb-4">Track not found</p>
        <button onClick={() => navigate('/tracks')} className={`px-6 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>
          Back to Tracks
        </button>
      </div>
    );
  }

  // Placeholder: later this will be derived from currentUser profile data
  const userSkills = currentUser?.skills || [];
  const missingSkills = track.techStack.filter(
    (tech) => !userSkills.some((s) => s.toLowerCase() === tech.toLowerCase())
  );
  const ownedSkills = track.techStack.filter((tech) =>
    userSkills.some((s) => s.toLowerCase() === tech.toLowerCase())
  );

  return (
    <div className="animate-fade-in py-12 px-6 max-w-5xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate('/tracks')}
        className={`flex items-center gap-2 text-sm font-bold mb-8 hover:opacity-70 transition-opacity ${theme.textSecondary}`}
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to Tracks
      </button>

      {/* Hero */}
      <div className={`rounded-3xl overflow-hidden mb-10 ${themeMode === 'contrast' ? 'border-2 border-[#FFFF00]' : 'shadow-xl'}`}>
        <div className={`bg-gradient-to-br ${track.color} px-10 py-12`}>
          <track.Icon size={52} className="text-white/90 mb-4" aria-hidden="true" />
          <h1 className="text-4xl font-black text-white mb-3">{track.title}</h1>
          <p className="text-white/85 text-lg max-w-2xl">{track.description}</p>
          <div className="flex flex-wrap gap-6 mt-6 text-white/90 text-sm font-bold">
            <span className="flex items-center gap-2"><Clock size={15} aria-hidden="true" /> {track.duration}</span>
            <span className="flex items-center gap-2"><BarChart2 size={15} aria-hidden="true" /> {track.difficulty}</span>
            <span className="flex items-center gap-2"><BookOpen size={15} aria-hidden="true" /> {track.phases.length} phases</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left col — roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black">Learning Roadmap</h2>

          {track.phases.map((phase, idx) => (
            <div key={idx} className={`rounded-2xl p-6 ${theme.card}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-black text-base">{phase.title}</h3>
                  <span className={`text-xs font-semibold ${theme.textSecondary}`}>{phase.weeks}</span>
                </div>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                  {idx + 1}
                </span>
              </div>
              <ul className="space-y-2">
                {phase.topics.map((topic, tIdx) => (
                  <li key={tIdx} className={`flex items-start gap-2 text-sm ${theme.textSecondary}`}>
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
          <div className={`rounded-2xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-4">What you need to start</h3>
            <ul className="space-y-2">
              {track.requirements.map((req, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${theme.textSecondary}`}>
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-indigo-500" aria-hidden="true" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Gap Analysis */}
          <div className={`rounded-2xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-1">Skills gap analysis</h3>
            <p className={`text-xs mb-4 ${theme.textSecondary}`}>
              Based on your profile — what you already have vs. what this track requires.
            </p>

            {!currentUser ? (
              <div className={`flex flex-col items-center gap-3 py-4 text-center rounded-xl ${themeMode === 'contrast' ? 'border border-white' : 'bg-indigo-500/5 border border-indigo-500/20'}`}>
                <Lock size={22} className={themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-400'} aria-hidden="true" />
                <p className={`text-xs font-semibold ${theme.textSecondary}`}>
                  Sign in and complete your profile to see a personalised gap analysis.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                >
                  Sign in
                </button>
              </div>
            ) : userSkills.length === 0 ? (
              <div className={`flex flex-col items-center gap-3 py-4 text-center rounded-xl ${themeMode === 'contrast' ? 'border border-white' : 'bg-amber-500/5 border border-amber-500/20'}`}>
                <AlertCircle size={22} className="text-amber-500" aria-hidden="true" />
                <p className={`text-xs font-semibold ${theme.textSecondary}`}>
                  Complete your profile skills section to unlock gap analysis.
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                >
                  Complete profile
                </button>
              </div>
            ) : (
              <>
                {ownedSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-emerald-500 mb-2">You already know</p>
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
                    <p className={`text-xs font-bold mb-2 ${themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-amber-500'}`}>Still to learn</p>
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

          {/* Tech stack full list */}
          <div className={`rounded-2xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-4">Full tech stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {track.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${themeMode === 'contrast' ? 'border border-white' : 'bg-indigo-500/10 text-indigo-400'}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className={`rounded-2xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-4">Recommended resources</h3>
            <ul className="space-y-2">
              {track.resources.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.url}
                    className={`text-sm font-semibold underline underline-offset-2 ${themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-500 hover:text-indigo-400'}`}
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
            Browse related job paths →
          </button>
        </div>
      </div>
    </div>
  );
}
