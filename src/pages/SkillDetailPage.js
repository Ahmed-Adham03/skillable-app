import React, { useMemo, useState } from 'react';

export default function SkillDetailPage({ theme, themeMode, plan, planIndex, onBack, onToggleStep }) {
  const [videoIndex, setVideoIndex] = useState(0);
  const safePlan = plan || { roadmap: [], progress: [], details: '', videos: [], sources: [], jobtitle: '' };
  const total = safePlan.roadmap.length || 1;
  const completed = safePlan.progress.filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);
  const videos = safePlan.videos || [];
  const sources = safePlan.sources || [];
  const currentVideo = useMemo(() => videos[videoIndex], [videos, videoIndex]);

  if (!plan) {
    return (
      <div className="py-12 px-6 max-w-6xl mx-auto">
        <p className={theme.textSecondary}>Select a skill from the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">
      <button onClick={onBack} className={`mb-6 font-bold ${theme.textSecondary}`}>
        ← Back to Dashboard
      </button>
      <div className={`p-6 rounded-2xl ${theme.card}`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-black">{plan.jobtitle}</h1>
          <span className="text-sm font-bold">{percent}%</span>
        </div>
        <p className={`mb-4 ${theme.textSecondary}`}>{plan.details || 'No description available yet.'}</p>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="space-y-2 mb-8">
          {plan.roadmap.map((step, sidx) => (
            <label key={sidx} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={plan.progress[sidx]}
                onChange={(e) => onToggleStep(planIndex, sidx, e.target.checked)}
              />
              <span className={theme.textSecondary}>{step}</span>
            </label>
          ))}
        </div>

        {percent === 100 && (
          <div className="mt-4 text-green-600 font-bold animate-pulse">
            🎉 Completed! Great work.
          </div>
        )}

        <div className={`mt-8 p-4 rounded-xl ${theme.glass}`}>
          <h2 className="text-xl font-black mb-3">Video Lessons</h2>
          {currentVideo ? (
            <div>
              <div className="font-bold mb-2">{currentVideo.title}</div>
              <div className="aspect-video w-full mb-4">
                <iframe
                  title={currentVideo.title}
                  src={currentVideo.url}
                  className="w-full h-full rounded-xl border"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVideoIndex((i) => Math.max(i - 1, 0))}
                  className={`px-4 py-2 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                  disabled={videoIndex === 0}
                >
                  Previous
                </button>
                <button
                  onClick={() => setVideoIndex((i) => Math.min(i + 1, videos.length - 1))}
                  className={`px-4 py-2 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                  disabled={videoIndex >= videos.length - 1}
                >
                  Next
                </button>
                <span className={`text-sm ${theme.textSecondary}`}>Video {videoIndex + 1} of {videos.length}</span>
              </div>
            </div>
          ) : (
            <p className={theme.textSecondary}>No videos available yet.</p>
          )}
        </div>

        <div className={`mt-6 p-4 rounded-xl ${theme.glass}`}>
          <h2 className="text-xl font-black mb-3">Sources</h2>
          {sources.length ? (
            <ul className="space-y-2">
              {sources.map((source, i) => (
                <li key={i}>
                  <a className="underline" href={source.url} target="_blank" rel="noreferrer">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={theme.textSecondary}>No sources available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
