import React from 'react';

export default function SkillDetailPage({ theme, themeMode, plan, planIndex, onBack, onToggleStep }) {
  if (!plan) {
    return (
      <div className="py-12 px-6 max-w-6xl mx-auto">
        <p className={theme.textSecondary}>Select a skill from the dashboard.</p>
      </div>
    );
  }

  const total = plan.roadmap.length || 1;
  const completed = plan.progress.filter(Boolean).length;
  const percent = Math.round((completed / total) * 100);

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
          <h2 className="text-xl font-black mb-2">Videos & Sources</h2>
          <p className={theme.textSecondary}>
            We will ingest videos and sources here next.
          </p>
        </div>
      </div>
    </div>
  );
}
