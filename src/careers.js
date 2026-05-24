import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, ArrowRight, Map, Search, MapPin, Banknote, Layers, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

export default function CareerPage({ theme, themeMode, currentUser, onSelectJob, setActiveTab }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');
  const MATCH_API = process.env.REACT_APP_MATCH_API || 'http://127.0.0.1:9000';
  const isProfileIncomplete = useMemo(() => {
    if (!currentUser) return false;
    const requiredFields = [
      currentUser.mobility,
      currentUser.vision,
      currentUser.hearing,
      currentUser.cognitive,
      currentUser.address,
      currentUser.phone_number
    ];
    return requiredFields.some((value) => {
      const normalized = String(value || '').trim().toLowerCase();
      return !normalized || normalized === 'n/a';
    });
  }, [currentUser]);

  const profilePayload = useMemo(() => {
    return {
      mobility:         currentUser?.mobility         || 'N/A',
      vision:           currentUser?.vision           || 'N/A',
      hearing:          currentUser?.hearing          || 'N/A',
      cognitive:        currentUser?.cognitive        || 'N/A',
      experience_level: currentUser?.experience_level || 'N/A',
      skills:           Array.isArray(currentUser?.skills) ? currentUser.skills : [],
      top_n: 12
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    if (isProfileIncomplete) {
      setResults([]);
      setStatus('');
      return;
    }
    const fetchMatches = async () => {
      setStatus('Loading matches...');
      try {
        const res = await fetch(`${MATCH_API}/match`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profilePayload)
        });
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setStatus('');
      } catch (err) {
        setStatus('Unable to load matches.');
      }
    };
    fetchMatches();
  }, [MATCH_API, profilePayload, currentUser, isProfileIncomplete]);

  const filtered = results.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const skills = (item.skills || []).join(' ').toLowerCase();
    return (
      (item.jobtitle || '').toLowerCase().includes(q) ||
      (item.summary || '').toLowerCase().includes(q) ||
      skills.includes(q)
    );
  });

  return (
    <div className={`py-12 px-6 max-w-7xl mx-auto`}>
      {/* Header Section */}
      <div className="mb-12 text-center lg:text-left">
        <h2 className="text-4xl lg:text-5xl font-black mb-4">
          Tailored <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeMode === 'contrast' ? 'from-[#FFFF00] to-white' : 'from-indigo-600 to-purple-600'}`}>Career Maps</span>
        </h2>
        <p className={`${theme.textSecondary} text-lg max-w-2xl`}>
          Based on your profile, we rank opportunities that align with your needs and strengths.
        </p>
      </div>

      {!currentUser && (
        <div className="relative text-center py-8 md:py-12">
          <div className={`mx-auto mb-6 w-20 h-20 rounded-[1.6rem] flex items-center justify-center ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'}`}>
            <ShieldCheck size={34} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-500/20 text-indigo-500">
            <Sparkles size={13} /> Personalized matching
          </div>
          <h3 className="text-3xl md:text-4xl font-black mb-3">Sign in or create an account to unlock career paths</h3>
          <p className={`max-w-2xl mx-auto leading-relaxed mb-7 ${theme.textSecondary}`}>
            Skillable builds matches from your accessibility needs, strengths, skills, and experience level, then explains which roles fit you best.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setActiveTab?.('register')} className={`px-7 py-3 rounded-2xl font-black inline-flex items-center gap-2 ${theme.primaryBtn}`}>
              <UserPlus size={17} /> Sign up
            </button>
            <button onClick={() => setActiveTab?.('login')} className={`px-7 py-3 rounded-2xl font-black border ${themeMode === 'contrast' ? 'border-white' : themeMode === 'dark' ? 'border-white/20' : 'border-slate-300'}`}>
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      {currentUser && !isProfileIncomplete && (
      <div className={`mb-10 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center ${theme.glass}`}>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Search by skill or industry..." 
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border transition-all ${theme.input}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search careers"
          />
        </div>
        <button className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${theme.primaryBtn}`}>
          <Map size={18} aria-hidden="true" />
          Generate New Path
        </button>
      </div>
      )}

      {status && !isProfileIncomplete && (
        <div className={`mb-8 text-sm font-semibold ${theme.textSecondary}`}>{status}</div>
      )}
      {currentUser && isProfileIncomplete && (
        <div className={`mb-8 p-4 rounded-2xl ${theme.glass}`}>
          <h3 className="text-lg font-black mb-2">Complete your profile first</h3>
          <p className={theme.textSecondary}>
            We cannot show matching jobs yet because some personalization fields are still set to N/A.
            Please complete your profile to unlock accurate career matches.
          </p>
        </div>
      )}

      {currentUser && isProfileIncomplete && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60 blur-[2px]">
        {[1, 2, 3].map((id) => (
          <div key={id} className={`group p-8 rounded-[2rem] flex flex-col h-full ${theme.card}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-lg text-2xl">
                <Briefcase className="text-indigo-600" aria-hidden="true" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-100 text-indigo-700'}`}>
                --% Match
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Career Path Preview</h3>
            <p className="text-sm font-semibold mb-6 opacity-60">
              {!currentUser ? 'Sign in to see full details' : 'Complete your profile to unlock matches'}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Skill A', 'Skill B', 'Skill C'].map((skill, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-lg border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200 dark:border-slate-700'}`}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-dashed border-slate-200 dark:border-slate-700">
              <button className="flex items-center gap-2 font-bold text-sm group/btn">
                {!currentUser ? 'Explore this path' : 'Complete profile first'}
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {currentUser && !isProfileIncomplete && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((path, idx) => {
          const tierColor = {
            Excellent: themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-emerald-100 text-emerald-700',
            Good:      themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-100 text-indigo-700',
            Fair:      themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-amber-100 text-amber-700',
            Low:       themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-slate-100 text-slate-500',
          }[path.compatibility_tier] || 'bg-indigo-100 text-indigo-700';
          const directOverlap = Array.isArray(path.skill_overlap) ? path.skill_overlap : [];
          const inferredOverlap = Array.isArray(path.inferred_overlap) ? path.inferred_overlap : [];

          return (
          <div key={`${path.jobtitle}-${idx}`} className={`group p-8 rounded-[2rem] flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${theme.card}`}>

            {/* Header row */}
            <div className="flex justify-between items-start mb-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${themeMode === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-50'}`}>
                <Briefcase size={22} className="text-indigo-500" aria-hidden="true" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${tierColor}`}>
                  {path.match_percentage}% · {path.compatibility_tier}
                </span>
                {path.category && (
                  <span className={`text-[10px] font-semibold uppercase tracking-widest opacity-50`}>
                    {path.category}
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black mb-1 group-hover:text-indigo-500 transition-colors leading-tight">
              {path.jobtitle}
            </h3>

            {/* Meta row */}
            <div className={`flex flex-wrap items-center gap-3 text-xs font-semibold mb-3 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {path.job_type && (
                <span className="flex items-center gap-1"><MapPin size={11} />{path.job_type}</span>
              )}
              {path.salary_range && (
                <span className="flex items-center gap-1"><Banknote size={11} />{path.salary_range}</span>
              )}
              {path.experience_level && (
                <span className="flex items-center gap-1"><Layers size={11} />{path.experience_level}</span>
              )}
            </div>

            <p className={`text-sm mb-5 leading-relaxed line-clamp-2 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {path.summary}
            </p>

            {/* Skill overlap */}
            {directOverlap.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1.5">Skills you have</p>
                <div className="flex flex-wrap gap-1.5">
                  {directOverlap.slice(0, 4).map((s, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${themeMode === 'dark' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>{s}</span>
                  ))}
                  {directOverlap.length > 4 && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold opacity-50 ${themeMode === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>+{directOverlap.length - 4}</span>
                  )}
                </div>
              </div>
            )}

            {inferredOverlap.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-sky-500 mb-1.5">Inferred from your skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {inferredOverlap.slice(0, 4).map((s, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${themeMode === 'dark' ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-50 text-sky-700'}`}>{s}</span>
                  ))}
                  {inferredOverlap.length > 4 && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold opacity-50 ${themeMode === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>+{inferredOverlap.length - 4}</span>
                  )}
                </div>
              </div>
            )}

            {/* Skill gaps */}
            {path.missing_skills && path.missing_skills.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1.5">Skills to build</p>
                <div className="flex flex-wrap gap-1.5">
                  {path.missing_skills.slice(0, 3).map((s, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${themeMode === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>{s}</span>
                  ))}
                  {path.missing_skills.length > 3 && (
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold opacity-50 ${themeMode === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>+{path.missing_skills.length - 3}</span>
                  )}
                </div>
              </div>
            )}

            <div className={`mt-auto pt-5 border-t ${themeMode === 'contrast' ? 'border-white/30' : 'border-dashed border-slate-200 dark:border-slate-700'}`}>
              <button className={`flex items-center gap-2 font-bold text-sm group/btn ${themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-500'}`} onClick={() => onSelectJob(path)}>
                Explore this path
                <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
