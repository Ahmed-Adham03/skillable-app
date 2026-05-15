import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Building2, Clock, Layers, MapPin, Search } from 'lucide-react';
import { getJobLogo } from '../data/jobLogos';

export default function OpenRolesPage({ theme, themeMode, API_BASE, currentUser, onSelectRole, setActiveTab }) {
  const [roles, setRoles] = useState([]);
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [status, setStatus] = useState('Loading open roles...');
  const isDark = themeMode === 'dark';
  const isContrast = themeMode === 'contrast';
  const canShareRole = currentUser?.role === 'job_poster' || currentUser?.role === 'admin';

  useEffect(() => {
    setStatus('Loading open roles...');
    fetch(`${API_BASE}/open-jobs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setRoles(Array.isArray(data) ? data : []);
        setStatus('');
      })
      .catch(() => {
        setRoles([]);
        setStatus('Unable to load open roles. Make sure the backend API is running.');
      });
  }, [API_BASE]);

  const levels = useMemo(() => {
    const unique = roles.map((role) => role.level).filter(Boolean);
    return ['All', ...Array.from(new Set(unique))];
  }, [roles]);

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles.filter((role) => {
      const skills = Array.isArray(role.skills) ? role.skills.join(' ') : '';
      const matchesQuery = !q || [
        role.title,
        role.company_name,
        role.about,
        role.location,
        role.job_type,
        skills,
      ].some((value) => String(value || '').toLowerCase().includes(q));
      const matchesLevel = levelFilter === 'All' || role.level === levelFilter;
      return matchesQuery && matchesLevel;
    });
  }, [roles, query, levelFilter]);

  return (
    <div className="animate-fade-in py-12 px-6 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <p className={`text-xs font-black uppercase tracking-widest mb-2 ${theme.accent}`}>Live opportunities</p>
          <h1 className="text-4xl lg:text-5xl font-black mb-3">Open roles</h1>
          <p className={`max-w-3xl text-lg ${theme.textSecondary}`}>
            Real jobs shared by employers and partners. These are separate from learning paths: browse the role, check the needed skills, then decide if it fits your accessibility needs.
          </p>
        </div>
        {canShareRole && (
          <button
            onClick={() => setActiveTab('post-job')}
            className={`px-5 py-3 rounded-xl font-black inline-flex items-center gap-2 ${theme.primaryBtn}`}
          >
            <BriefcaseBusiness size={17} />
            Share a role
          </button>
        )}
      </div>

      <div className={`mb-8 p-4 rounded-2xl flex flex-col md:flex-row gap-3 ${theme.glass}`}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={19} aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none ${theme.input}`}
            placeholder="Search by role, place, skill, or location..."
            aria-label="Search open roles"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className={`md:w-64 px-4 py-3 rounded-xl border outline-none ${theme.input}`}
          aria-label="Filter by level"
        >
          {levels.map((level) => <option key={level}>{level}</option>)}
        </select>
      </div>

      {status && <p className={`mb-6 text-sm font-bold ${theme.textSecondary}`}>{status}</p>}

      {!status && filteredRoles.length === 0 && (
        <div className={`p-8 rounded-3xl text-center ${theme.card}`}>
          <h2 className="text-2xl font-black mb-2">No open roles found</h2>
          <p className={theme.textSecondary}>Try a different search or check again when partners share new roles.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {filteredRoles.map((role) => {
          const logo = getJobLogo(role.logo_key);
          const LogoIcon = logo.Icon;
          return (
            <article key={role.id} className={`group rounded-3xl p-6 flex flex-col min-h-[24rem] transition-all duration-300 ${theme.card}`}>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/10 text-indigo-300' : isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : `${logo.bg} ${logo.text}`}`}>
                  <LogoIcon size={22} aria-hidden="true" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isContrast ? 'bg-[#FFFF00] text-black' : 'bg-emerald-100 text-emerald-700'}`}>
                  Open
                </span>
              </div>

              <h2 className="text-xl font-black leading-tight mb-2 group-hover:text-indigo-500 transition-colors">{role.title}</h2>
              <p className={`text-sm font-bold mb-4 ${theme.textSecondary}`}>{role.company_name}</p>

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold mb-4 ${isDark ? 'text-slate-300' : isContrast ? 'text-white' : 'text-slate-600'}`}>
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {role.location || 'Egypt'}</span>
                <span className="flex items-center gap-1.5"><Layers size={13} /> {role.level || 'Open level'}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} /> {role.duration || 'Not specified'}</span>
                <span className="flex items-center gap-1.5"><Building2 size={13} /> {role.job_type || 'Open role'}</span>
              </div>

              <p className={`text-sm leading-relaxed line-clamp-3 mb-5 ${theme.textSecondary}`}>{role.about}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {(Array.isArray(role.skills) ? role.skills : []).slice(0, 6).map((skill) => (
                  <span key={skill} className={`text-xs px-2.5 py-1 rounded-lg font-bold ${isContrast ? 'border border-white' : isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onSelectRole(role)}
                className={`mt-auto pt-5 border-t flex items-center gap-2 font-black text-sm ${isContrast ? 'border-white/30 text-[#FFFF00]' : 'border-dashed border-slate-200 dark:border-slate-700 text-indigo-600'}`}
              >
                View role pipeline
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
