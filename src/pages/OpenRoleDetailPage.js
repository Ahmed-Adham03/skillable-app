import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, Clock, Layers, LockKeyhole, Mail, MapPin, Send, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { getJobLogo } from '../data/jobLogos';
import { canPostJobs } from '../auth/roles';
import { getAuthToken } from '../auth/session';
import { useTranslation } from 'react-i18next';

export default function OpenRoleDetailPage({ theme, themeMode, role, API_BASE, currentUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDark = themeMode === 'dark';
  const isContrast = themeMode === 'contrast';
  const skills = Array.isArray(role?.skills) ? role.skills : [];
  const [applicants, setApplicants] = useState([]);
  const [applicantsStatus, setApplicantsStatus] = useState('');
  const token = getAuthToken();
  const canViewApplicants = Boolean(role && canPostJobs(currentUser) && role.created_by_id === currentUser.id);

  useEffect(() => {
    if (!canViewApplicants || !token) return;
    setApplicantsStatus(t('openRoleDetails.loadingApplicants'));
    fetch(`${API_BASE}/open-jobs/${role.id}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setApplicants(Array.isArray(data) ? data : []);
        setApplicantsStatus('');
      })
      .catch(() => {
        setApplicants([]);
        setApplicantsStatus(t('openRoleDetails.unableToLoadApplicants'));
      });
  }, [API_BASE, canViewApplicants, role, token]);

  if (!role) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <BriefcaseFallback themeMode={themeMode} />
        <p className={`text-lg font-semibold ${theme.textSecondary}`}>{t('openRoleDetails.selectRole')}</p>
        <button onClick={() => navigate('/open-roles')} className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>
          Browse open roles
        </button>
      </div>
    );
  }

  const logo = getJobLogo(role.logo_key);
  const LogoIcon = logo.Icon;

  return (
    <div className="animate-fade-in">
      <div className={`px-6 pt-10 pb-16 ${isContrast ? 'border-b-2 border-[#FFFF00]' : isDark ? 'bg-slate-950 border-b border-slate-800' : 'bg-white border-b border-slate-200'}`}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/open-roles')}
            className={`flex items-center gap-2 text-sm font-bold mb-8 transition-colors ${isContrast ? 'text-[#FFFF00]' : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'}`}
          >
            <ArrowLeft size={15} /> Back to Open Roles
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black mb-4 ${isContrast ? 'border border-[#FFFF00] text-[#FFFF00]' : isDark ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                <Sparkles size={12} />
                Open employer role
              </div>
              <h1 className="text-4xl lg:text-5xl font-black leading-tight mb-3">{role.title}</h1>
              <p className={`text-lg font-bold mb-4 ${theme.textSecondary}`}>{role.company_name}</p>
              <p className={`max-w-3xl leading-relaxed ${theme.textSecondary}`}>{role.about}</p>
            </div>

            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center ${isDark ? 'bg-white/10 text-indigo-300' : isContrast ? 'border-2 border-[#FFFF00] text-[#FFFF00]' : `${logo.bg} ${logo.text}`}`}>
              <LogoIcon size={42} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className={`rounded-3xl p-6 ${theme.card}`}>
              <h2 className="text-lg font-black mb-4">{t('openRoleDetails.roleDetails')}</h2>
              <div className={`grid sm:grid-cols-2 gap-3 text-sm font-bold ${theme.textSecondary}`}>
                <Info icon={MapPin} label={t('openRoleDetails.location')} value={role.location || t('openRoleDetails.location')} />
                <Info icon={Clock} label={t('openRoleDetails.duration')} value={role.duration || t('openRoleDetails.notSpecified')} />
                <Info icon={Layers} label={t('openRoleDetails.level')} value={role.level || t('openRoleDetails.openLevel')} />
                <Info icon={Building2} label={t('openRoleDetails.workType')} value={role.job_type || t('openRoleDetails.openRole')} />
              </div>
              {role.salary_range && (
                <div className={`mt-4 p-4 rounded-2xl text-sm font-bold ${isContrast ? 'border border-white' : isDark ? 'bg-white/5' : 'bg-slate-50 text-slate-700'}`}>
                  Salary: {role.salary_range}
                </div>
              )}
            </section>

            <section className={`rounded-3xl p-6 ${theme.card}`}>
              <h2 className="text-lg font-black mb-4">{t('openRoleDetails.skillsRequested')}</h2>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill) => (
                  <span key={skill} className={`px-3 py-1.5 rounded-xl text-xs font-black ${isContrast ? 'border border-white' : isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                    {skill}
                  </span>
                )) : (
                  <p className={`text-sm ${theme.textSecondary}`}>{t('openRoleDetails.noSkills')}</p>
                )}
              </div>
            </section>

            <section className={`rounded-3xl p-6 ${theme.card}`}>
              <h2 className="text-lg font-black mb-5">{t('openRoleDetails.pipeline')}</h2>
              <div className="space-y-4">
                <PipelineStep title={t('openRoleDetails.reviewRole')} body={t('openRoleDetails.reviewRoleBody')} />
                <PipelineStep title={t('openRoleDetails.prepareCV')} body={t('openRoleDetails.prepareCVBody')} />
                <PipelineStep title={t('openRoleDetails.contactEmployer')} body={t('openRoleDetails.contactEmployerBody')} />
                <PipelineStep title={t('openRoleDetails.interview')} body={t('openRoleDetails.interviewBody')} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className={`rounded-3xl p-6 ${isContrast ? 'border-2 border-[#FFFF00]' : isDark ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-indigo-600 text-white'}`}>
              <h2 className="text-lg font-black mb-2">{t('openRoleDetails.readyToApply')}</h2>
              <p className={`text-sm mb-5 ${isContrast ? 'text-white' : isDark ? 'text-indigo-100' : 'text-white/80'}`}>
                {currentUser
                  ? t('openRoleDetails.applyLive')
                  : t('openRoleDetails.applyLocked')}
              </p>
              {currentUser ? (
                <button
                  onClick={() => navigate(`/open-roles/${role.id}/apply`)}
                  className={`w-full py-3 rounded-xl font-black inline-flex justify-center items-center gap-2 ${isContrast ? 'bg-[#FFFF00] text-black' : isDark ? 'bg-indigo-500 text-white' : 'bg-white text-indigo-700'}`}
                >
                  <Send size={16} /> Apply / contact
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    disabled
                    className={`w-full py-3 rounded-xl font-black inline-flex justify-center items-center gap-2 cursor-not-allowed ${isContrast ? 'border border-white text-white' : 'bg-white/20 text-white/70'}`}
                  >
                    <LockKeyhole size={16} /> Apply locked
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate('/login')}
                      className={`py-2.5 rounded-xl font-black text-sm ${isContrast ? 'bg-[#FFFF00] text-black' : isDark ? 'bg-white text-indigo-700' : 'bg-white text-indigo-700'}`}
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className={`py-2.5 rounded-xl font-black text-sm inline-flex items-center justify-center gap-1.5 ${isContrast ? 'border border-white text-white' : 'bg-indigo-900/30 text-white'}`}
                    >
                      <UserPlus size={14} /> Sign up
                    </button>
                  </div>
                </div>
              )}
            </div>

            {canViewApplicants && (
              <div className={`rounded-3xl p-6 ${theme.card}`}>
                <h3 className="font-black mb-2">{t('openRoleDetails.applicants')}</h3>
                <p className={`text-xs mb-4 ${theme.textSecondary}`}>{t('openRoleDetails.visibleToRecruiter')}</p>
                {applicantsStatus && <p className={`text-sm font-bold ${theme.textSecondary}`}>{applicantsStatus}</p>}
                {!applicantsStatus && applicants.length === 0 && <p className={`text-sm ${theme.textSecondary}`}>{t('openRoleDetails.noApplications')}</p>}
                <div className="space-y-3">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className={`p-4 rounded-2xl ${isContrast ? 'border border-white' : isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                      <p className="font-black text-sm">{applicant.applicant_name}</p>
                      <p className={`text-xs font-bold ${theme.textSecondary}`}>{applicant.applicant_email}</p>
                      <p className={`text-xs font-bold ${theme.textSecondary}`}>{applicant.phone_number}</p>
                      <p className={`text-xs mt-3 leading-relaxed ${theme.textSecondary}`}>{applicant.motivation}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(applicant.skills || []).slice(0, 6).map((skill) => (
                          <span key={skill} className={`px-2 py-1 rounded-lg text-[11px] font-bold ${isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>{skill}</span>
                        ))}
                      </div>
                      {applicant.accessibility_notes && applicant.accessibility_notes !== 'N/A' && (
                        <p className={`text-xs mt-3 ${theme.textSecondary}`}>{t('openRoleDetails.access')}: {applicant.accessibility_notes}</p>
                      )}
                      {applicant.cv_link && applicant.cv_link !== 'N/A' && (
                        <p className={`text-xs mt-2 ${theme.textSecondary}`}>CV: {applicant.cv_link}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={`rounded-3xl p-6 ${theme.card}`}>
              <h3 className="font-black mb-4 flex items-center gap-2">
                <ShieldCheck size={17} className={isContrast ? 'text-[#FFFF00]' : 'text-emerald-500'} />
                Before applying
              </h3>
              <ul className={`space-y-3 text-sm ${theme.textSecondary}`}>
                <ChecklistItem>{t('openRoleDetails.checkOpen')}</ChecklistItem>
                <ChecklistItem>{t('openRoleDetails.askAccess')}</ChecklistItem>
                <ChecklistItem>{t('openRoleDetails.noPayment')}</ChecklistItem>
              </ul>
            </div>

            <div className={`rounded-3xl p-6 ${theme.card}`}>
              <h3 className="font-black mb-2 flex items-center gap-2">
                <Mail size={17} className={isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'} />
                Shared by
              </h3>
              <p className={`text-sm font-bold ${theme.textSecondary}`}>{role.company_name}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs uppercase tracking-widest opacity-60">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}

function PipelineStep({ title, body }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-black text-sm">{title}</h3>
        <p className="text-sm opacity-75 leading-relaxed">{body}</p>
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

function BriefcaseFallback({ themeMode }) {
  return <BriefcaseBusinessIcon className={themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-indigo-500'} />;
}

function BriefcaseBusinessIcon({ className }) {
  return <Building2 size={40} className={className} />;
}
