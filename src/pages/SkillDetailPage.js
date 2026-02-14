import React, { useEffect, useMemo, useState } from 'react';

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
  } catch (err) {
    return '';
  }
  return '';
}

export default function SkillDetailPage({ theme, themeMode, plan, planIndex, onBack, onToggleStep }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const roadmap = useMemo(() => plan?.roadmap || [], [plan]);
  const progress = useMemo(() => plan?.progress || [], [plan]);
  const videos = useMemo(() => {
    const listed = Array.isArray(plan?.videos) ? plan.videos : [];
    return roadmap.map((checkpoint, idx) => {
      const existing = listed[idx];
      if (existing?.url) {
        return {
          title: existing.title || checkpoint,
          url: existing.url
        };
      }
      const query = encodeURIComponent(`${plan?.jobtitle || "Skill"} ${checkpoint} tutorial`);
      return {
        title: checkpoint,
        url: `https://www.youtube.com/results?search_query=${query}`
      };
    });
  }, [plan, roadmap]);

  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [plan?.jobtitle]);

  useEffect(() => {
    if (currentVideoIndex >= videos.length) {
      setCurrentVideoIndex(videos.length > 0 ? videos.length - 1 : 0);
    }
  }, [currentVideoIndex, videos.length]);

  const total = roadmap.length || 1;
  const completed = progress.filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);
  const currentVideo = videos[currentVideoIndex] || null;
  const embedUrl = useMemo(() => getEmbedUrl(currentVideo?.url), [currentVideo]);

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
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className={`p-4 rounded-xl ${theme.glass} mb-6`}>
          <h2 className="text-xl font-black mb-2">Skill Overview</h2>
          <p className={theme.textSecondary}>
            {plan.details || plan.summary || 'Complete each checkpoint video and mark it watched to track progress.'}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${theme.glass} mb-6`}>
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-xl font-black">Current Video</h2>
            <span className={`text-sm font-bold ${theme.textSecondary}`}>
              {videos.length ? `${currentVideoIndex + 1} / ${videos.length}` : '0 / 0'}
            </span>
          </div>
          {currentVideo ? (
            <>
              <p className="font-semibold mb-3">{currentVideo.title}</p>
              {embedUrl ? (
                <div className={`mb-4 rounded-2xl overflow-hidden border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-300/40'}`}>
                  <div className={`px-4 py-2 flex items-center justify-between ${themeMode === 'contrast' ? 'bg-black border-b border-white' : 'bg-slate-900 text-white'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" aria-hidden="true" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold truncate max-w-[70%]">Video Window: {currentVideo.title}</span>
                  </div>
                  <div className="relative w-full pt-[56.25%] bg-black">
                    <iframe
                      src={embedUrl}
                      title={currentVideo.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                <p className={`mb-4 text-sm ${theme.textSecondary}`}>
                  This link cannot be embedded here. Use "Open Video" to watch it.
                </p>
              )}
              <a
                href={currentVideo.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-block mb-4 px-5 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}
              >
                Open Video
              </a>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onToggleStep(planIndex, currentVideoIndex, true);
                    setCurrentVideoIndex((prev) => Math.min(videos.length - 1, prev + 1));
                  }}
                  className={`px-4 py-2 rounded-lg font-bold ${theme.primaryBtn}`}
                >
                  Mark as Watched & Next
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentVideoIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentVideoIndex === 0}
                  className={`px-4 py-2 rounded-lg border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'} ${currentVideoIndex === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentVideoIndex((prev) => Math.min(videos.length - 1, prev + 1))}
                  disabled={currentVideoIndex >= videos.length - 1}
                  className={`px-4 py-2 rounded-lg border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'} ${currentVideoIndex >= videos.length - 1 ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className={theme.textSecondary}>No videos available yet for this skill.</p>
          )}
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-xl font-black mb-2">Checklist</h2>
          {roadmap.map((step, sidx) => (
            <div key={sidx} className={`p-3 rounded-xl ${theme.glass} flex items-center justify-between gap-3`}>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(progress[sidx])}
                  onChange={(e) => onToggleStep(planIndex, sidx, e.target.checked)}
                />
                <span className={theme.textSecondary}>{step}</span>
              </label>
              {videos[sidx]?.url && (
                <button
                  type="button"
                  onClick={() => setCurrentVideoIndex(sidx)}
                  className={`text-sm font-bold ${theme.accent}`}
                >
                  Open
                </button>
              )}
            </div>
          ))}
        </div>

        {percent === 100 && (
          <div className="mt-4 text-green-600 font-bold animate-pulse">
            Completed. All roadmap videos were watched.
          </div>
        )}

        {Array.isArray(plan.sources) && plan.sources.length > 0 && (
          <div className={`mt-8 p-4 rounded-xl ${theme.glass}`}>
            <h2 className="text-xl font-black mb-2">Sources</h2>
            <ul className="space-y-2">
              {plan.sources.map((source, idx) => (
                <li key={idx}>
                  <a href={source} target="_blank" rel="noreferrer" className={`underline ${theme.accent}`}>
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
