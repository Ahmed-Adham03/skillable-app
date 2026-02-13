import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, ArrowRight, Map, Search } from 'lucide-react';

export default function CareerPage({ theme, themeMode, currentUser, onSelectJob }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('');
  const MATCH_API = process.env.REACT_APP_MATCH_API || 'http://127.0.0.1:9000';

  const profilePayload = useMemo(() => {
    return {
      mobility: currentUser?.mobility || 'N/A',
      vision: currentUser?.vision || 'N/A',
      hearing: currentUser?.hearing || 'N/A',
      cognitive: currentUser?.cognitive || 'N/A',
      top_n: 12
    };
  }, [currentUser]);

  useEffect(() => {
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
  }, [MATCH_API, profilePayload]);

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

      {/* Search & Filter Bar */}
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

      {status && (
        <div className={`mb-8 text-sm font-semibold ${theme.textSecondary}`}>{status}</div>
      )}
      {!currentUser && (
        <div className={`mb-8 p-4 rounded-2xl ${theme.glass}`}>
          <h3 className="text-lg font-black mb-2">Join to get your best matches</h3>
          <p className={theme.textSecondary}>
            Sign in or create an account to personalize your experience. We match careers by comparing your needs profile
            (mobility, vision, hearing, cognitive) against job requirements, then rank results by fit and explain why.
          </p>
        </div>
      )}

      {/* Career Cards Grid */}

      {!currentUser && (
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
            <p className="text-sm font-semibold mb-6 opacity-60">Sign in to see full details</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['Skill A', 'Skill B', 'Skill C'].map((skill, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-lg border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200 dark:border-slate-700'}`}>
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-6 border-t border-dashed border-slate-200 dark:border-slate-700">
              <button className="flex items-center gap-2 font-bold text-sm group/btn">
                Explore this path
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {currentUser && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((path, idx) => (
          <div key={`${path.jobtitle}-${idx}`} className={`group p-8 rounded-[2rem] flex flex-col h-full ${theme.card}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-lg text-2xl`}>
                <Briefcase className="text-indigo-600" aria-hidden="true" />
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-100 text-indigo-700'}`}>
                {path.match_percentage}% Match
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-500 transition-colors">
              {path.jobtitle}
            </h3>
            <p className={`text-sm font-semibold mb-6 opacity-60`}>
              {path.summary}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {(path.skills || []).map((skill, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-lg border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200 dark:border-slate-700'}`}>
                  {skill}
                </span>
              ))}
            </div>

            <div className="mb-6 text-xs opacity-70 space-y-1">
              {(path.why_matched || []).slice(0, 3).map((reason, i) => (
                <div key={i}>• {reason}</div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-dashed border-slate-200 dark:border-slate-700">
              <button className="flex items-center gap-2 font-bold text-sm group/btn" onClick={() => onSelectJob(path)}>
                Explore this path 
                <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
