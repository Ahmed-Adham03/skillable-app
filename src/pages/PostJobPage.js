import React, { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardList, Edit3, Lock, MailCheck, Plus, RotateCcw, Send, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JOB_LOGOS } from '../data/jobLogos';
import { canPostJobs } from '../auth/roles';

const LEVELS = [
  { value: 'Beginner friendly', labelKey: 'beginner' },
  { value: 'Intermediate', labelKey: 'intermediate' },
  { value: 'Experienced', labelKey: 'experienced' },
  { value: 'Training provided', labelKey: 'trainingProvided' },
];
const DURATIONS = [
  { value: 'Full-time', labelKey: 'fullTime' },
  { value: 'Part-time', labelKey: 'partTime' },
  { value: 'Shift based', labelKey: 'shiftBased' },
  { value: 'Temporary', labelKey: 'temporary' },
  { value: 'Internship', labelKey: 'internship' },
  { value: 'Flexible', labelKey: 'flexible' },
];

const emptyForm = (email = '') => ({
  title: '',
  company_name: '',
  contact_email: email,
  about: '',
  logo_key: JOB_LOGOS[0].key,
  duration: DURATIONS[0].value,
  level: LEVELS[0].value,
  location: 'Egypt',
  job_type: 'Open role',
  salary_range: 'Not specified',
});

export default function PostJobPage({ theme, themeMode, API_BASE, currentUser, setActiveTab }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(() => emptyForm(currentUser?.email));
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [postedJobs, setPostedJobs] = useState([]);
  const [jobsStatus, setJobsStatus] = useState('');
  const [editingJobId, setEditingJobId] = useState(null);

  const isPoster = canPostJobs(currentUser);
  const token = localStorage.getItem('skillable_token');
  const textMuted = themeMode === 'dark' ? 'text-slate-300' : themeMode === 'contrast' ? 'text-white' : 'text-slate-700';

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const resetForm = () => {
    setEditingJobId(null);
    setForm(emptyForm(currentUser?.email));
    setSkills([]);
    setSkillInput('');
  };

  const refreshPostedJobs = () => {
    if (!isPoster || !token) return;
    setJobsStatus(t('postJob.manage.loading'));
    fetch(`${API_BASE}/open-jobs/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setPostedJobs(Array.isArray(data) ? data : []);
        setJobsStatus('');
      })
      .catch(() => {
        setPostedJobs([]);
        setJobsStatus(t('postJob.manage.loadFail'));
      });
  };

  useEffect(() => {
    refreshPostedJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE, isPoster, token]);

  const addSkill = () => {
    const next = skillInput.trim();
    if (!next || skills.some((s) => s.toLowerCase() === next.toLowerCase()) || skills.length >= 30) return;
    setSkills((prev) => [...prev, next]);
    setSkillInput('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    if (!isPoster) {
      setError(t('postJob.errors.posterOnly'));
      return;
    }
    try {
      const res = await fetch(editingJobId ? `${API_BASE}/open-jobs/${editingJobId}` : `${API_BASE}/open-jobs`, {
        method: editingJobId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, skills }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || t(editingJobId ? 'postJob.errors.updateFail' : 'postJob.errors.shareFail'));
      setStatus(t(editingJobId ? 'postJob.updateSuccess' : 'postJob.success'));
      resetForm();
      refreshPostedJobs();
    } catch (err) {
      setError(err.message || t(editingJobId ? 'postJob.errors.updateFail' : 'postJob.errors.shareFail'));
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job.id);
    setForm({
      title: job.title || '',
      company_name: job.company_name || '',
      contact_email: job.contact_email || currentUser?.email || '',
      about: job.about || '',
      logo_key: job.logo_key || JOB_LOGOS[0].key,
      duration: job.duration || DURATIONS[0].value,
      level: job.level || LEVELS[0].value,
      location: job.location || 'Egypt',
      job_type: job.job_type || 'Open role',
      salary_range: job.salary_range || 'Not specified',
    });
    setSkills(Array.isArray(job.skills) ? job.skills : []);
    setError('');
    setStatus(t('postJob.manage.editing', { title: job.title }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleOpen = async (job) => {
    setError('');
    setStatus('');
    try {
      const res = await fetch(`${API_BASE}/open-jobs/${job.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_open: !job.is_open }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || t('postJob.errors.statusFail'));
      setStatus(t(job.is_open ? 'postJob.manage.closedSuccess' : 'postJob.manage.reopenedSuccess'));
      refreshPostedJobs();
    } catch (err) {
      setError(err.message || t('postJob.errors.statusFail'));
    }
  };

  if (!currentUser) {
    return (
      <div className="py-16 px-6 max-w-3xl mx-auto">
        <div className={`p-8 rounded-3xl ${theme.card}`}>
          <h1 className="text-3xl font-black mb-3">{t('postJob.signInRequired')}</h1>
          <p className={`mb-6 ${theme.textSecondary}`}>{t('postJob.signInBody')}</p>
          <button onClick={() => setActiveTab('login')} className={`px-6 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>{t('postJob.signIn')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-12 px-6 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className={`text-xs font-black uppercase tracking-widest mb-2 ${theme.accent}`}>{t('postJob.badge')}</p>
        <h1 className="text-4xl font-black mb-3">{t('postJob.title')}</h1>
        <p className={`max-w-2xl ${theme.textSecondary}`}>
          {t('postJob.subtitle')}
        </p>
      </div>

      {!isPoster && (
        <div className={`mb-6 p-5 rounded-2xl ${themeMode === 'contrast' ? 'border border-white' : 'border border-amber-200 bg-amber-50 text-amber-800'}`}>
          {t('postJob.posterOnlyNotice')}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_22rem] gap-7 items-start">
        <form onSubmit={submit} className={`rounded-3xl p-6 md:p-8 ${theme.card}`}>
          <div className="grid md:grid-cols-2 gap-5">
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.jobName')}</span>
              <input required value={form.title} onChange={update('title')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder={t('postJob.placeholders.jobName')} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.companyName')}</span>
              <input required value={form.company_name} onChange={update('company_name')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder={t('postJob.placeholders.companyName')} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.contactEmail')}</span>
              <input required type="email" value={form.contact_email} onChange={update('contact_email')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder={t('postJob.placeholders.contactEmail')} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.duration')}</span>
              <select value={form.duration} onChange={update('duration')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`}>
                {DURATIONS.map((d) => <option key={d.value} value={d.value}>{t(`postJob.durations.${d.labelKey}`)}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.level')}</span>
              <select value={form.level} onChange={update('level')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`}>
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{t(`postJob.levels.${l.labelKey}`)}</option>)}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.location')}</span>
              <input value={form.location} onChange={update('location')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder={t('postJob.placeholders.location')} />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-black">{t('postJob.fields.jobType')}</span>
              <input value={form.job_type} onChange={update('job_type')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder={t('postJob.placeholders.jobType')} />
            </label>
          </div>

          <label className="block space-y-2 mt-5">
            <span className="text-sm font-black">{t('postJob.fields.about')}</span>
            <textarea required rows={5} value={form.about} onChange={update('about')} className={`w-full px-4 py-3 rounded-xl border ${theme.input}`} placeholder={t('postJob.placeholders.about')} />
          </label>

          <div className="mt-6">
            <p className="text-sm font-black mb-3">{t('postJob.fields.skills')}</p>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                className={`flex-1 px-4 py-3 rounded-xl border ${theme.input}`}
                placeholder={t('postJob.placeholders.skills')}
              />
              <button type="button" onClick={addSkill} className={`px-4 py-3 rounded-xl font-bold ${theme.primaryBtn}`}><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <span key={skill} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${themeMode === 'dark' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                  {skill}
                  <button type="button" onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-black mb-3">{t('postJob.fields.logoTheme')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {JOB_LOGOS.map(({ key, label, Icon, bg, text }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, logo_key: key }))}
                  className={`p-3 rounded-2xl border text-left transition ${form.logo_key === key ? 'border-indigo-500 ring-2 ring-indigo-300' : themeMode === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${bg} ${text}`}>
                    <Icon size={20} />
                  </div>
                  <div className={`text-xs font-bold ${textMuted}`}>{t(`postJob.logoLabels.${key}`, { defaultValue: label })}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="mt-5 text-sm font-bold text-red-500">{error}</p>}
          {status && <p className="mt-5 text-sm font-bold text-emerald-500">{status}</p>}

          <button type="submit" className={`mt-6 px-6 py-3 rounded-xl font-black inline-flex items-center gap-2 ${theme.primaryBtn}`} disabled={!isPoster}>
            <Send size={16} /> {editingJobId ? t('postJob.updateButton') : t('postJob.shareButton')}
          </button>
          {editingJobId && (
            <button type="button" onClick={resetForm} className={`mt-6 mx-3 px-6 py-3 rounded-xl font-black border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-300'}`}>
              {t('postJob.cancelEdit')}
            </button>
          )}
        </form>

        <aside className="space-y-5 lg:sticky lg:top-28">
          <section className={`rounded-3xl p-6 ${theme.card}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${themeMode === 'contrast' ? 'border border-[#FFFF00] text-[#FFFF00]' : themeMode === 'dark' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              <Users size={24} />
            </div>
            <h2 className="text-xl font-black mb-2">{t('postJob.sidebar.reachTitle')}</h2>
            <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
              {t('postJob.sidebar.reachBody')}
            </p>
          </section>

          <section className={`rounded-3xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-4">{t('postJob.sidebar.afterTitle')}</h3>
            <div className="space-y-4">
              <Feature icon={Sparkles} title={t('postJob.sidebar.liveRoleTitle')} body={t('postJob.sidebar.liveRoleBody')} theme={theme} themeMode={themeMode} />
              <Feature icon={ClipboardList} title={t('postJob.sidebar.applicantTitle')} body={t('postJob.sidebar.applicantBody')} theme={theme} themeMode={themeMode} />
              <Feature icon={MailCheck} title={t('postJob.sidebar.contactTitle')} body={t('postJob.sidebar.contactBody')} theme={theme} themeMode={themeMode} />
            </div>
          </section>

          <section className={`rounded-3xl p-6 ${theme.card}`}>
            <h3 className="font-black mb-4 flex items-center gap-2">
              <ShieldCheck size={17} className={themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-emerald-500'} />
              {t('postJob.sidebar.tipsTitle')}
            </h3>
            <ul className={`space-y-3 text-sm ${theme.textSecondary}`}>
              <Tip>{t('postJob.sidebar.tipTasks')}</Tip>
              <Tip>{t('postJob.sidebar.tipAccess')}</Tip>
              <Tip>{t('postJob.sidebar.tipRealistic')}</Tip>
            </ul>
          </section>

          <section className={`rounded-3xl p-5 ${themeMode === 'contrast' ? 'border-2 border-[#FFFF00]' : themeMode === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-slate-900 text-white'}`}>
            <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-2">{t('postJob.sidebar.bestForTitle')}</p>
            <p className="text-sm font-bold leading-relaxed">
              {t('postJob.sidebar.bestForBody')}
            </p>
          </section>

          {isPoster && (
            <section className={`rounded-3xl p-6 ${theme.card}`}>
              <h3 className="font-black mb-2">{t('postJob.manage.title')}</h3>
              <p className={`text-xs mb-4 ${theme.textSecondary}`}>{t('postJob.manage.subtitle')}</p>
              {jobsStatus && <p className={`text-sm font-bold ${theme.textSecondary}`}>{jobsStatus}</p>}
              {!jobsStatus && postedJobs.length === 0 && (
                <p className={`text-sm ${theme.textSecondary}`}>{t('postJob.manage.empty')}</p>
              )}
              <div className="space-y-3">
                {postedJobs.slice(0, 6).map((job) => (
                  <div key={job.id} className={`p-4 rounded-2xl ${themeMode === 'contrast' ? 'border border-white' : themeMode === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-black leading-tight">{job.title}</p>
                        <p className={`text-xs font-bold ${theme.textSecondary}`}>{job.company_name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${job.is_open ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                        {job.is_open ? t('postJob.manage.open') : t('postJob.manage.closed')}
                      </span>
                    </div>
                    {!job.is_open && (
                      <p className={`mt-2 text-xs font-bold ${theme.textSecondary}`}>{t('postJob.manage.closedNotice')}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button type="button" onClick={() => startEdit(job)} className={`px-3 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1 ${theme.primaryBtn}`}>
                        <Edit3 size={13} /> {t('postJob.manage.edit')}
                      </button>
                      <button type="button" onClick={() => toggleOpen(job)} className={`px-3 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1 ${themeMode === 'contrast' ? 'bg-white text-black' : job.is_open ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white'}`}>
                        {job.is_open ? <Lock size={13} /> : <RotateCcw size={13} />}
                        {job.is_open ? t('postJob.manage.close') : t('postJob.manage.reopen')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, body, theme, themeMode }) {
  return (
    <div className="flex gap-3">
      <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${themeMode === 'contrast' ? 'border border-[#FFFF00] text-[#FFFF00]' : themeMode === 'dark' ? 'bg-white/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-sm font-black">{title}</p>
        <p className={`text-xs leading-relaxed ${theme.textSecondary}`}>{body}</p>
      </div>
    </div>
  );
}

function Tip({ children }) {
  return (
    <li className="flex gap-2">
      <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
