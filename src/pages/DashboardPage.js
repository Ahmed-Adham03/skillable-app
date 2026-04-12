import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, TrendingUp, CheckCircle, ChevronRight, Compass, LayoutDashboard } from 'lucide-react';

function ProgressRing({ percent, size = 64, stroke = 5, color = '#6366f1' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-slate-200 dark:text-slate-700 opacity-20" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

export default function DashboardPage({ theme, themeMode, learningPlans, setSelectedPlanIndex, setActiveTab }) {
  const navigate = useNavigate();

  const totalSteps = learningPlans.reduce((a, p) => a + (p.roadmap?.length || 0), 0);
  const completedSteps = learningPlans.reduce((a, p) => a + (p.progress?.filter(Boolean).length || 0), 0);
  const avgPercent = learningPlans.length === 0 ? 0 : Math.round(
    learningPlans.reduce((acc, plan) => {
      const total = plan.roadmap?.length || 1;
      const done = plan.progress?.filter(Boolean).length || 0;
      return acc + done / total;
    }, 0) / learningPlans.length * 100
  );

  const isContrast = themeMode === 'contrast';
  const isDark = themeMode === 'dark';

  const accentColors = [
    { ring: '#6366f1', bar: 'bg-indigo-500', text: 'text-indigo-500', soft: isDark ? 'bg-indigo-500/10' : 'bg-indigo-50' },
    { ring: '#10b981', bar: 'bg-emerald-500', text: 'text-emerald-500', soft: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
    { ring: '#f59e0b', bar: 'bg-amber-500',   text: 'text-amber-500',   soft: isDark ? 'bg-amber-500/10'  : 'bg-amber-50'  },
    { ring: '#ec4899', bar: 'bg-pink-500',    text: 'text-pink-500',    soft: isDark ? 'bg-pink-500/10'   : 'bg-pink-50'   },
  ];

  /* ── Empty state ── */
  if (learningPlans.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${isContrast ? 'border-2 border-[#FFFF00]' : 'bg-indigo-500/10'}`}>
          <Compass size={36} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} />
        </div>
        <div>
          <h1 className="text-3xl font-black mb-2">No learning paths yet</h1>
          <p className={`text-base max-w-sm mx-auto ${theme.textSecondary}`}>
            Enroll in a career path and your progress will appear here.
          </p>
        </div>
        <button
          onClick={() => navigate('/careers')}
          className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${theme.primaryBtn}`}
        >
          Browse career paths <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* ── Page header ── */}
      <div className={`px-6 pt-12 pb-16 ${isContrast ? 'border-b-2 border-[#FFFF00]' : isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard size={20} className="text-white/70" aria-hidden="true" />
            <span className="text-white/70 text-sm font-semibold tracking-wide uppercase">Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-1">Your learning journey</h1>
          <p className="text-white/60 text-sm">Track progress across all enrolled career paths.</p>

          {/* ── Stat chips ── */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: 'Enrolled paths', value: learningPlans.length, Icon: BookOpen },
              { label: 'Avg completion', value: `${avgPercent}%`, Icon: TrendingUp },
              { label: 'Steps completed', value: `${completedSteps} / ${totalSteps}`, Icon: CheckCircle },
            ].map(({ label, value, Icon }) => (
              <div key={label} className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${isContrast ? 'border border-[#FFFF00] bg-black' : 'bg-white/10 backdrop-blur-sm border border-white/10'}`}>
                <Icon size={16} className="text-white/60" aria-hidden="true" />
                <div>
                  <div className="text-white text-lg font-black leading-none">{value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-5">
        <h2 className="text-sm font-bold tracking-widest uppercase opacity-50 mb-6">Active paths</h2>

        {learningPlans.map((plan, idx) => {
          const total = plan.roadmap?.length || 1;
          const done  = plan.progress?.filter(Boolean).length || 0;
          const pct   = Math.round((done / total) * 100);
          const accent = accentColors[idx % accentColors.length];

          // Find the first incomplete step label
          const nextStepIdx = plan.progress?.findIndex((v) => !v);
          const nextStep = nextStepIdx !== -1 && plan.roadmap?.[nextStepIdx]
            ? (typeof plan.roadmap[nextStepIdx] === 'string' ? plan.roadmap[nextStepIdx] : plan.roadmap[nextStepIdx].title || plan.roadmap[nextStepIdx].step || '')
            : null;

          const statusLabel = pct === 100 ? 'Completed' : pct === 0 ? 'Not started' : 'In progress';
          const statusColor = pct === 100
            ? 'text-emerald-500 bg-emerald-500/10'
            : pct === 0
              ? `${theme.textSecondary} ${isContrast ? 'border border-white' : isDark ? 'bg-white/5' : 'bg-slate-100'}`
              : `${accent.text} ${accent.soft}`;

          return (
            <div
              key={`${plan.jobtitle}-${idx}`}
              className={`rounded-2xl overflow-hidden flex flex-col sm:flex-row ${isContrast ? 'border-2 border-white' : `border ${theme.card}`} transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl`}
            >
              {/* Left accent bar */}
              {!isContrast && <div className={`w-1.5 sm:w-2 flex-shrink-0 ${accent.bar}`} />}

              {/* Main body */}
              <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">

                {/* Progress ring */}
                <div className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center">
                  <ProgressRing percent={pct} size={64} stroke={5} color={isContrast ? '#FFFF00' : accent.ring} />
                  <span className="absolute text-xs font-black" style={{ color: isContrast ? '#FFFF00' : accent.ring }}>
                    {pct}%
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl font-black truncate">{plan.jobtitle}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                  {plan.summary && (
                    <p className={`text-sm line-clamp-1 mb-2 ${theme.textSecondary}`}>{plan.summary}</p>
                  )}
                  {/* Progress bar */}
                  <div className={`h-1.5 w-full max-w-xs rounded-full overflow-hidden ${isContrast ? 'border border-white' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isContrast ? 'bg-[#FFFF00]' : accent.bar}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {nextStep && pct < 100 && (
                    <p className={`text-xs mt-2 ${theme.textSecondary}`}>
                      Next: <span className="font-semibold">{nextStep}</span>
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    setSelectedPlanIndex(idx);
                    setActiveTab('skill-detail');
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm ${isContrast ? 'bg-[#FFFF00] text-black' : `${accent.soft} ${accent.text}`} transition-all hover:scale-105`}
                >
                  {pct === 100 ? 'Review' : pct === 0 ? 'Start' : 'Continue'}
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Browse more */}
        <div className={`mt-4 p-6 rounded-2xl border-dashed border-2 flex flex-col sm:flex-row items-center justify-between gap-4 ${isContrast ? 'border-[#FFFF00]' : isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <div>
            <p className="font-bold">Looking for more?</p>
            <p className={`text-sm ${theme.textSecondary}`}>Browse all available career paths and expand your skills.</p>
          </div>
          <button
            onClick={() => navigate('/careers')}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 ${theme.primaryBtn}`}
          >
            Browse paths <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
