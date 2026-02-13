import React from 'react';
import { Briefcase, MapPin, BookOpen } from 'lucide-react';

export default function JobDetailsPage({ theme, themeMode, job, setActiveTab }) {
  if (!job) {
    return (
      <div className="py-12 px-6 max-w-5xl mx-auto">
        <p className={theme.textSecondary}>Select a job from Career Paths to see details.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-5xl mx-auto">
      <button onClick={() => setActiveTab('careers')} className={`mb-6 font-bold ${theme.textSecondary}`}>
        ← Back to Career Paths
      </button>

      <div className={`p-8 rounded-[2rem] ${theme.card}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-lg`}>
            <Briefcase className="text-indigo-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-black">{job.jobtitle}</h1>
        </div>

        <p className={`mb-6 ${theme.textSecondary}`}>{job.summary}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-xl ${theme.glass}`}>
            <div className="flex items-center gap-2 font-bold mb-2">
              <MapPin size={16} aria-hidden="true" />
              <span>Location</span>
            </div>
            <p className={theme.textSecondary}>{job.location || 'N/A'}</p>
          </div>
          <div className={`p-4 rounded-xl ${theme.glass}`}>
            <div className="flex items-center gap-2 font-bold mb-2">
              <BookOpen size={16} aria-hidden="true" />
              <span>Learning Resource</span>
            </div>
            <p className={theme.textSecondary}>{job.learning_resource || 'N/A'}</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${theme.glass} mb-6`}>
          <h2 className="text-xl font-black mb-2">Details</h2>
          <p className={theme.textSecondary}>{job.details || 'No details available yet.'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(job.skills || []).map((skill, i) => (
            <span key={i} className={`text-xs px-3 py-1 rounded-lg border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200 dark:border-slate-700'}`}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
