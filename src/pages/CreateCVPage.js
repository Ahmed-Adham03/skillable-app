import React, { useState } from 'react';
import {
  Download, User, Mail, Phone, MapPin, Briefcase,
  GraduationCap, Star, Plus, Trash2, FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DEFAULT_CV = {
  fullName: 'Alex Johnson',
  jobTitle: 'Software Developer',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 012-3456',
  address: 'Cairo, Egypt',
  summary:
    'Passionate and results-driven software developer with 3+ years of experience ' +
    'building accessible, user-friendly web applications. Dedicated to inclusive design ' +
    'and continuous learning.',
  experience: [
    {
      id: 1,
      role: 'Junior Frontend Developer',
      company: 'Tech Solutions Ltd.',
      period: '2022 - Present',
      description:
        'Built responsive UI components using React. Improved accessibility scores by 40% ' +
        'through ARIA implementation and keyboard navigation.',
    },
    {
      id: 2,
      role: 'Web Development Intern',
      company: 'Digital Agency Co.',
      period: '2021 - 2022',
      description:
        'Developed landing pages and maintained CMS content. Collaborated with UX team to ' +
        'deliver pixel-perfect designs.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.Sc. Computer Science',
      school: 'Cairo University',
      period: '2018 - 2022',
    },
  ],
  skills: ['React', 'JavaScript', 'HTML & CSS', 'Accessibility (WCAG)', 'Git', 'Node.js', 'Tailwind CSS', 'Python'],
};

function EditField({ value, onChange, multiline = false, style = {}, className = '' }) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={style}
        className={`w-full bg-transparent outline-none resize-none border-0 p-0 m-0 ${className}`}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      className={`w-full bg-transparent outline-none border-0 p-0 m-0 ${className}`}
    />
  );
}

function printCV(cv) {
  const initials = cv.fullName.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const expHTML = cv.experience
    .map(
      (e) => `
      <div class="timeline-item">
        <div class="dot"></div>
        <div class="role">${e.role}</div>
        <div class="meta"><span class="company">${e.company}</span> &nbsp;.&nbsp; <span class="period">${e.period}</span></div>
        <div class="desc">${e.description}</div>
      </div>`
    )
    .join('');
  const eduHTML = cv.education
    .map(
      (e) => `
      <div class="timeline-item">
        <div class="dot"></div>
        <div class="role">${e.degree}</div>
        <div class="meta"><span class="company">${e.school}</span> &nbsp;.&nbsp; <span class="period">${e.period}</span></div>
      </div>`
    )
    .join('');
  const skillsHTML = cv.skills
    .map((s) => `<div class="skill-item"><span class="skill-dot">●</span> ${s}</div>`)
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${cv.fullName} - CV</title>
<style>
  @page { margin: 0; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; }
  .header {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    padding: 36px 40px;
    display: flex;
    gap: 24px;
    align-items: center;
  }
  .avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 900;
    flex-shrink: 0;
  }
  .header-info { flex: 1; }
  .full-name { font-size: 32px; font-weight: 900; line-height: 1.1; margin-bottom: 4px; }
  .job-title { font-size: 15px; opacity: 0.85; margin-bottom: 10px; }
  .contacts { display: flex; flex-wrap: wrap; gap: 6px 20px; font-size: 12px; opacity: 0.9; }
  .contacts span { display: flex; align-items: center; gap: 4px; }
  .body { display: flex; min-height: calc(297mm - 144px); }
  .left {
    width: 33%;
    background: #f8fafc;
    padding: 28px 24px;
    border-right: 1px solid #e2e8f0;
  }
  .section-title {
    font-size: 10px; font-weight: 900; text-transform: uppercase;
    letter-spacing: 1.5px; color: #4f46e5;
    margin-bottom: 14px; display: flex; align-items: center; gap: 6px;
  }
  .section-title::before { content: ''; display: inline-block; width: 12px; height: 2px; background: #4f46e5; }
  .skill-item { font-size: 12.5px; margin-bottom: 7px; color: #334155; }
  .skill-dot { color: #4f46e5; margin-right: 4px; font-size: 10px; }
  .summary-text { font-size: 12px; line-height: 1.75; color: #475569; }
  .left-section { margin-bottom: 28px; }
  .right { flex: 1; padding: 28px 32px; }
  .timeline-section { margin-bottom: 28px; }
  .timeline-item { position: relative; padding-left: 18px; border-left: 2px solid #c7d2fe; margin-bottom: 18px; }
  .dot {
    position: absolute; left: -5px; top: 5px;
    width: 9px; height: 9px;
    border-radius: 50%; background: #4f46e5;
  }
  .role { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
  .meta { font-size: 12px; margin-bottom: 6px; }
  .company { font-weight: 600; color: #4f46e5; }
  .period { color: #94a3b8; }
  .desc { font-size: 12px; line-height: 1.7; color: #475569; }
</style>
</head>
<body>
  <div class="header">
    <div class="avatar">${initials}</div>
    <div class="header-info">
      <div class="full-name">${cv.fullName}</div>
      <div class="job-title">${cv.jobTitle}</div>
      <div class="contacts">
        <span><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>${cv.email}</span>
        <span><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.93 13 19.79 19.79 0 0 1 1.88 4.52A2 2 0 0 1 3.86 2.33h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.29 6.29l.62-1.12a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.5z"/></svg>${cv.phone}</span>
        <span><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${cv.address}</span>
      </div>
    </div>
  </div>
  <div class="body">
    <div class="left">
      <div class="left-section">
        <div class="section-title">${t('cv.skills', 'Skills')}</div>
        <div>${skillsHTML}</div>
      </div>
      <div class="left-section">
        <div class="section-title">${t('cv.summary', 'Summary')}</div>
        <div class="summary-text">${cv.summary}</div>
      </div>
    </div>
    <div class="right">
      <div class="timeline-section">
        <div class="section-title">${t('cv.workExperience', 'Work Experience')}</div>
        ${expHTML}
      </div>
      <div class="timeline-section">
        <div class="section-title">${t('cv.education', 'Education')}</div>
        ${eduHTML}
      </div>
    </div>
  </div>
</body>
</html>`;

  const existing = document.getElementById('__cv_print_frame__');
  if (existing) existing.remove();

  const iframe = document.createElement('iframe');
  iframe.id = '__cv_print_frame__';
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:0;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 3000);
  }, 400);
}

export default function CreateCVPage({ theme, themeMode, currentUser }) {
  const { t } = useTranslation();
  const seed = {
    ...DEFAULT_CV,
    fullName: currentUser?.full_name || DEFAULT_CV.fullName,
    email: currentUser?.email || DEFAULT_CV.email,
    phone: currentUser?.phone_number || DEFAULT_CV.phone,
    address: currentUser?.address || DEFAULT_CV.address,
  };

  const [cv, setCv] = useState(seed);

  const update = (f) => (v) => setCv((p) => ({ ...p, [f]: v }));
  const updateExp = (id, f) => (v) => setCv((p) => ({ ...p, experience: p.experience.map((e) => e.id === id ? { ...e, [f]: v } : e) }));
  const addExp = () => setCv((p) => ({ ...p, experience: [...p.experience, { id: Date.now(), role: 'New Role', company: 'Company', period: 'Year - Year', description: 'Description...' }] }));
  const removeExp = (id) => setCv((p) => ({ ...p, experience: p.experience.filter((e) => e.id !== id) }));
  const updateEdu = (id, f) => (v) => setCv((p) => ({ ...p, education: p.education.map((e) => e.id === id ? { ...e, [f]: v } : e) }));
  const addEdu = () => setCv((p) => ({ ...p, education: [...p.education, { id: Date.now(), degree: 'Degree', school: 'School', period: 'Year - Year' }] }));
  const removeEdu = (id) => setCv((p) => ({ ...p, education: p.education.filter((e) => e.id !== id) }));
  const updateSkill = (i) => (v) => setCv((p) => { const s = [...p.skills]; s[i] = v; return { ...p, skills: s }; });
  const addSkill = () => setCv((p) => ({ ...p, skills: [...p.skills, 'New Skill'] }));
  const removeSkill = (i) => setCv((p) => ({ ...p, skills: p.skills.filter((_, idx) => idx !== i) }));

  const isContrast = themeMode === 'contrast';
  const isDark = themeMode === 'dark';
  const accent = isContrast ? '#FFFF00' : '#4f46e5';
  const initials = cv.fullName.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="animate-fade-in min-h-screen">
      <section className="relative py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl text-white ${isContrast ? 'bg-yellow-400 text-black' : 'bg-indigo-600'}`}>
                  <FileText size={22} aria-hidden="true" />
                </div>
                <h1 className={`text-3xl lg:text-4xl font-black ${theme.textPrimary}`}>{t('cv.cvBuilder', 'CV Builder')}</h1>
              </div>
              <p className={`text-sm ${theme.textSecondary}`}>
                {t('cv.clickAnyField', 'Click any field to edit then hit')} <span className={`font-bold ${theme.accent}`}>{t('cv.downloadPdf', 'Download PDF')}</span>
              </p>
            </div>
            <button
              onClick={() => printCV(cv)}
              className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm shadow-lg
                transition-transform hover:scale-105 active:scale-95 ${theme.primaryBtn}`}
            >
              <Download size={18} aria-hidden="true" />
              {t('cv.downloadPdf', 'Download PDF')}
            </button>
          </div>

          <div className={`rounded-[2rem] shadow-2xl overflow-hidden ${isContrast ? 'bg-black text-[#FFFF00] border-2 border-[#FFFF00]' : isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className={`px-10 py-10 ${isContrast ? 'bg-black border-b border-[#FFFF00]' : ''}`} style={!isContrast ? { background: `linear-gradient(135deg, ${accent}dd, #7c3aed)` } : {}}>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shrink-0 ${isContrast ? 'bg-black border border-[#FFFF00] text-[#FFFF00]' : 'bg-white/20 text-white'}`}>
                  {initials}
                </div>
                <div className={`flex-1 space-y-1 ${isContrast ? 'text-[#FFFF00]' : 'text-white'}`}>
                  <EditField value={cv.fullName} onChange={update('fullName')} className={`text-4xl font-black ${isContrast ? 'text-[#FFFF00]' : 'text-white'}`} />
                  <EditField value={cv.jobTitle} onChange={update('jobTitle')} className={`text-lg ${isContrast ? 'text-[#FFFF00]' : 'text-white/80'}`} />
                  <div className={`flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm ${isContrast ? 'text-[#FFFF00]' : 'text-white/80'}`}>
                    <span className="flex items-center gap-1"><Mail size={13} /><EditField value={cv.email} onChange={update('email')} className={`text-sm w-48 ${isContrast ? 'text-[#FFFF00]' : 'text-white/80'}`} /></span>
                    <span className="flex items-center gap-1"><Phone size={13} /><EditField value={cv.phone} onChange={update('phone')} className={`text-sm w-36 ${isContrast ? 'text-[#FFFF00]' : 'text-white/80'}`} /></span>
                    <span className="flex items-center gap-1"><MapPin size={13} /><EditField value={cv.address} onChange={update('address')} className={`text-sm w-36 ${isContrast ? 'text-[#FFFF00]' : 'text-white/80'}`} /></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              <div className={`md:w-1/3 p-8 space-y-8 border-r ${isContrast ? 'bg-black border-[#FFFF00]' : isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-4" style={{ color: accent }}>
                    <Star size={13} /> {t('cv.skills', 'Skills')}
                  </h2>
                  <div className="space-y-2">
                    {cv.skills.map((sk, i) => (
                      <div key={i} className="flex items-center gap-2 group/sk">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accent }} />
                        <EditField value={sk} onChange={updateSkill(i)} className="text-sm flex-1" />
                        <button onClick={() => removeSkill(i)} className="opacity-0 group-hover/sk:opacity-100 text-red-400 hover:text-red-600 transition" aria-label={t('cv.removeSkill', 'Remove skill')}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addSkill} className="mt-3 flex items-center gap-1 text-xs font-bold opacity-50 hover:opacity-100 transition" style={{ color: accent }}>
                    <Plus size={13} /> {t('cv.addSkill', 'Add Skill')}
                  </button>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-4" style={{ color: accent }}>
                    <User size={13} /> {t('cv.summary', 'Summary')}
                  </h2>
                  <EditField value={cv.summary} onChange={update('summary')} multiline className="text-sm leading-relaxed opacity-80" />
                </div>
              </div>

              <div className={`flex-1 p-8 space-y-8 ${isContrast ? 'bg-black' : isDark ? 'bg-slate-900' : 'bg-white'}`}>
                <div>
                  <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-6" style={{ color: accent }}>
                    <Briefcase size={13} /> {t('cv.workExperience', 'Work Experience')}
                  </h2>
                  <div className="space-y-6">
                    {cv.experience.map((exp) => (
                      <div key={exp.id} className="relative pl-5 border-l-2 group/exp" style={{ borderColor: `${accent}55` }}>
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <EditField value={exp.role} onChange={updateExp(exp.id, 'role')} className="font-bold text-base" />
                            <div className="flex flex-wrap gap-2 items-center text-sm">
                              <EditField value={exp.company} onChange={updateExp(exp.id, 'company')} className="font-semibold w-36" style={{ color: accent }} />
                              <span className="opacity-30">.</span>
                              <EditField value={exp.period} onChange={updateExp(exp.id, 'period')} className="opacity-60 text-xs w-28" />
                            </div>
                            <EditField value={exp.description} onChange={updateExp(exp.id, 'description')} multiline className="text-sm opacity-75 mt-1" />
                          </div>
                          <button onClick={() => removeExp(exp.id)} className="opacity-0 group-hover/exp:opacity-100 text-red-400 hover:text-red-600 transition mt-1 shrink-0" aria-label={t('cv.removeExperience', 'Remove experience')}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={addExp} className="mt-4 flex items-center gap-1 text-xs font-bold opacity-50 hover:opacity-100 transition" style={{ color: accent }}>
                    <Plus size={13} /> {t('cv.addExperience', 'Add Experience')}
                  </button>
                </div>

                <div>
                  <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-6" style={{ color: accent }}>
                    <GraduationCap size={13} /> {t('cv.education', 'Education')}
                  </h2>
                  <div className="space-y-4">
                    {cv.education.map((edu) => (
                      <div key={edu.id} className="relative pl-5 border-l-2 group/edu" style={{ borderColor: `${accent}55` }}>
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <EditField value={edu.degree} onChange={updateEdu(edu.id, 'degree')} className="font-bold" />
                            <div className="flex flex-wrap gap-2 items-center text-sm">
                              <EditField value={edu.school} onChange={updateEdu(edu.id, 'school')} className="font-semibold w-36" style={{ color: accent }} />
                              <span className="opacity-30">.</span>
                              <EditField value={edu.period} onChange={updateEdu(edu.id, 'period')} className="opacity-60 text-xs w-28" />
                            </div>
                          </div>
                          <button onClick={() => removeEdu(edu.id)} className="opacity-0 group-hover/edu:opacity-100 text-red-400 hover:text-red-600 transition mt-1 shrink-0" aria-label={t('cv.removeEducation', 'Remove education')}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={addEdu} className="mt-4 flex items-center gap-1 text-xs font-bold opacity-50 hover:opacity-100 transition" style={{ color: accent }}>
                    <Plus size={13} /> {t('cv.addEducation', 'Add Education')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
