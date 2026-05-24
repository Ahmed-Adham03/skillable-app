import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Mail, Plus, Send, ShieldCheck, X } from 'lucide-react';
import { getJobLogo } from '../data/jobLogos';

const skillToText = (skill) => {
  if (typeof skill === 'string') return skill.trim();
  if (skill && typeof skill === 'object') {
    return String(skill.name || skill.label || skill.title || skill.value || '').trim();
  }
  return String(skill || '').trim();
};

const cleanSkills = (skills) => {
  const seen = new Set();
  const cleaned = [];
  (Array.isArray(skills) ? skills : []).forEach((skill) => {
    const value = skillToText(skill).slice(0, 60);
    const key = value.toLowerCase();
    if (value && !seen.has(key) && cleaned.length < 30) {
      seen.add(key);
      cleaned.push(value);
    }
  });
  return cleaned;
};

const formatErrorDetail = (detail) => {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        const field = Array.isArray(item.loc) ? item.loc.filter((part) => part !== 'body').join('.') : '';
        return [field, item.msg].filter(Boolean).join(': ');
      })
      .filter(Boolean)
      .join(' ');
  }
  if (typeof detail === 'object') return detail.message || detail.msg || JSON.stringify(detail);
  return String(detail);
};

export default function OpenRoleApplyPage({ theme, themeMode, API_BASE, currentUser }) {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const isDark = themeMode === 'dark';
  const isContrast = themeMode === 'contrast';
  const [role, setRole] = useState(null);
  const [loadStatus, setLoadStatus] = useState('Loading role...');
  const [application, setApplication] = useState({
    applicant_name: currentUser?.full_name || '',
    applicant_email: currentUser?.email || '',
    phone_number: currentUser?.phone_number && currentUser.phone_number !== 'N/A' ? currentUser.phone_number : '',
    motivation: '',
    accessibility_notes: '',
    cv_link: '',
  });
  const [appSkills, setAppSkills] = useState(cleanSkills(currentUser?.skills));
  const [skillInput, setSkillInput] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/open-jobs/${roleId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setRole(data);
        setLoadStatus(data ? '' : 'Open role not found.');
      })
      .catch(() => {
        setRole(null);
        setLoadStatus('Unable to load this open role.');
      });
  }, [API_BASE, roleId]);

  const payload = useMemo(() => ({
    applicant_name: application.applicant_name.trim(),
    applicant_email: application.applicant_email.trim(),
    motivation: application.motivation.trim(),
    phone_number: application.phone_number.trim() || 'N/A',
    accessibility_notes: application.accessibility_notes.trim() || 'N/A',
    cv_link: application.cv_link.trim() || 'N/A',
    skills: cleanSkills(appSkills),
  }), [application, appSkills]);

  const update = (key) => (event) => {
    setApplication((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const addSkill = () => {
    const next = skillInput.trim();
    if (!next || appSkills.some((skill) => skill.toLowerCase() === next.toLowerCase()) || appSkills.length >= 30) return;
    setAppSkills((prev) => [...prev, next]);
    setSkillInput('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');
    try {
      const res = await fetch(`${API_BASE}/open-jobs/${role.id}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(formatErrorDetail(data.detail) || 'Could not send your application.');
      setSent(true);
      setStatus('Application sent. The recruiter can now review your contact info, skills, and notes.');
      setApplication((prev) => ({ ...prev, motivation: '', accessibility_notes: '', cv_link: '' }));
    } catch (err) {
      setError(err.message || 'Could not send your application.');
    }
  };

  if (loadStatus) {
    return (
      <div className="min-h-[60vh] px-6 flex flex-col items-center justify-center gap-4 text-center">
        <BriefcaseBusiness size={42} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} />
        <p className={`text-lg font-bold ${theme.textSecondary}`}>{loadStatus}</p>
        <button onClick={() => navigate('/open-roles')} className={`px-6 py-3 rounded-xl font-black ${theme.primaryBtn}`}>
          Back to Open Roles
        </button>
      </div>
    );
  }

  const logo = getJobLogo(role.logo_key);
  const LogoIcon = logo.Icon;

  return (
    <div className="animate-fade-in py-10 px-6 max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/open-roles')}
        className={`flex items-center gap-2 text-sm font-bold mb-8 ${theme.textSecondary}`}
      >
        <ArrowLeft size={15} /> Back to Open Roles
      </button>

      <div className="grid lg:grid-cols-[1fr_22rem] gap-7 items-start">
        <main className={`rounded-3xl p-6 md:p-8 ${theme.card}`}>
          <div className="mb-8">
            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${theme.accent}`}>Apply / contact recruiter</p>
            <h1 className="text-3xl lg:text-4xl font-black mb-3">Send your application</h1>
            <p className={`max-w-2xl ${theme.textSecondary}`}>
              Share why you are interested, how the recruiter can contact you, and any accessibility notes that help them understand your work needs.
            </p>
          </div>

          {sent ? (
            <div className={`rounded-3xl p-8 text-center ${isContrast ? 'border border-[#FFFF00]' : isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100 text-emerald-800'}`}>
              <CheckCircle2 size={44} className="mx-auto mb-4 text-emerald-500" />
              <h2 className="text-2xl font-black mb-2">Application sent</h2>
              <p className="text-sm font-semibold">{status}</p>
              <button onClick={() => navigate('/open-roles')} className={`mt-6 px-6 py-3 rounded-xl font-black ${theme.primaryBtn}`}>
                Browse more open roles
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <label className="space-y-2">
                  <span className="text-sm font-black">Your name</span>
                  <input required value={application.applicant_name} onChange={update('applicant_name')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-black">Email</span>
                  <input required type="email" value={application.applicant_email} onChange={update('applicant_email')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-black">Phone number</span>
                  <input value={application.phone_number} onChange={update('phone_number')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder="Optional" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-black">CV / portfolio link</span>
                  <input value={application.cv_link} onChange={update('cv_link')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder="Optional link" />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-black">Why do you want to join?</span>
                <textarea required minLength={20} rows={6} value={application.motivation} onChange={update('motivation')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder="Tell the recruiter why this role fits your goals, experience, and strengths." />
                <p className={`text-xs font-bold ${theme.textSecondary}`}>Write at least 20 characters so the recruiter has enough context.</p>
              </label>

              <div>
                <p className="text-sm font-black mb-2">Your skills</p>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    className={`flex-1 px-4 py-3 rounded-xl border ${theme.input}`}
                    placeholder="Excel, Arabic writing, customer support..."
                  />
                  <button type="button" onClick={addSkill} className={`px-4 py-3 rounded-xl font-bold ${theme.primaryBtn}`}><Plus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {appSkills.map((skill) => (
                    <span key={skill} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                      {skill}
                      <button type="button" onClick={() => setAppSkills((prev) => prev.filter((item) => item !== skill))}><X size={12} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-black">Accessibility notes</span>
                <textarea rows={5} value={application.accessibility_notes} onChange={update('accessibility_notes')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder="Optional: transport, screen reader, flexible hours, quieter workspace, ramp access..." />
              </label>

              {error && <p className="text-sm font-bold text-red-500">{error}</p>}

              <button type="submit" className={`w-full md:w-auto px-7 py-3 rounded-xl font-black inline-flex items-center justify-center gap-2 ${theme.primaryBtn}`}>
                <Send size={16} /> Send application
              </button>
            </form>
          )}
        </main>

        <aside className="space-y-5">
          <section className={`rounded-3xl p-6 ${theme.card}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-white/10 text-indigo-300' : isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : `${logo.bg} ${logo.text}`}`}>
              <LogoIcon size={26} />
            </div>
            <h2 className="text-xl font-black mb-1">{role.title}</h2>
            <p className={`text-sm font-bold mb-4 ${theme.textSecondary}`}>{role.company_name}</p>
            <div className={`space-y-2 text-sm font-bold ${theme.textSecondary}`}>
              <p>{role.location || 'Egypt'}</p>
              <p>{role.level || 'Open level'} · {role.duration || 'Not specified'}</p>
            </div>
          </section>

          <section className={`rounded-3xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-3 flex items-center gap-2">
              <Mail size={17} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} />
              Recruiter contact
            </h3>
            <p className={`text-sm font-bold break-words ${theme.textSecondary}`}>{role.contact_email || 'Shared through Skillable'}</p>
          </section>

          <section className={`rounded-3xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-3 flex items-center gap-2">
              <ShieldCheck size={17} className={isContrast ? 'text-[#FFFF00]' : 'text-emerald-500'} />
              Before sending
            </h3>
            <ul className={`space-y-3 text-sm ${theme.textSecondary}`}>
              <ChecklistItem>Use an email or phone number the recruiter can reach.</ChecklistItem>
              <ChecklistItem>Write a short, clear reason why this role fits you.</ChecklistItem>
              <ChecklistItem>Add accessibility notes only if you want the recruiter to know them.</ChecklistItem>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ChecklistItem({ children }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
