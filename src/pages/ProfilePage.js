import React, { useEffect, useState, useRef } from 'react';
import {
  User, Phone, MapPin, X, Plus,
  CheckCircle, AlertCircle, Eye, Ear, Brain,
  PersonStanding, Pencil, Lock, Heart, Sparkles, Globe, ShieldCheck,
  Camera, Trash2
} from 'lucide-react';

const GOVERNORATES = [
  'N/A','Cairo','Giza','Alexandria','Dakahlia','Red Sea','Beheira',
  'Fayoum','Gharbia','Ismailia','Menoufia','Minya','Qalyubia',
  'New Valley','Suez','Aswan','Assiut','Beni Suef','Port Said',
  'Damietta','Sharkia','South Sinai','Kafr El Sheikh','Matrouh',
  'Luxor','Qena','North Sinai','Sohag',
];

const NEED_LEVELS = [
  { value: 'N/A',              short: 'N/A',      color: '#94a3b8' },
  { value: 'No issues',        short: 'None',     color: '#22c55e' },
  { value: 'Mild',             short: 'Mild',     color: '#84cc16' },
  { value: 'Moderate',         short: 'Moderate', color: '#f59e0b' },
  { value: 'Significant',      short: 'High',     color: '#f97316' },
  { value: 'Requires support', short: 'Support',  color: '#ef4444' },
];

const NEED_DIMS = [
  { key: 'mobility',  label: 'Mobility',      Icon: PersonStanding },
  { key: 'vision',    label: 'Vision',         Icon: Eye },
  { key: 'hearing',   label: 'Hearing',        Icon: Ear },
  { key: 'cognitive', label: 'Cognitive',      Icon: Brain },
];

const EXPERIENCE_OPTIONS = [
  { value: 'N/A',    label: 'Not set' },
  { value: 'Entry',  label: 'Entry' },
  { value: 'Mid',    label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
];

const SKILL_OPTIONS = [
  '2D Animation', '3D Modelling', 'A/B Testing', 'API Documentation', 'ARIA', 'AWS', 'Account Management',
  'Accounts Payable', 'Accounts Receivable', 'Active Directory', 'Adobe Animate', 'Adobe Audition',
  'Adobe Illustrator', 'After Effects', 'Agile', 'Ahrefs', 'Airtable', 'Amplitude', 'Analytics', 'Animation',
  'ArcGIS', 'Architecture Design', 'Assessment Design', 'Assistive Technology', 'Attention to Detail',
  'Audacity', 'Audience Growth', 'Audio Editing', 'Audit', 'Automation', 'Axe DevTools', 'Azure',
  'Backup and Recovery', 'BeautifulSoup', 'Blender', 'Bookkeeping', 'Bot Testing', 'Botpress',
  'Brand Design', 'Brand Voice', 'Budgeting', 'Bug Reporting', 'Burp Suite', 'CI/CD', 'CRM', 'CSS',
  'Calendar Management', 'Canva', 'Captioning', 'Career Coaching', 'Case Analysis', 'Case Management',
  'Character Design', 'Client Communication', 'Client Relationships', 'Cloud Computing', 'CloudFormation',
  'Coaching', 'Cold Outreach', 'Colour Grading', 'Colour Theory', 'Communication', 'Community Building',
  'Community Management', 'Compliance', 'Composition', 'Concept Art', 'Confidentiality', 'Conflict Resolution',
  'Content Optimisation', 'Content Organisation', 'Content Planning', 'Content Scheduling', 'Conversational Design',
  'Copywriting', 'Cost Optimisation', 'Curation', 'Curriculum Design', 'Customer Experience', 'Customer Service',
  'Customer Support', 'DAX', 'DaVinci Resolve', 'Data Analysis', 'Data Entry', 'Data Modelling',
  'Data Parsing', 'Data Science', 'Data Storytelling', 'Data Validation', 'Data Visualisation',
  'Data Wrangling', 'Database Design', 'Datadog', 'Design Systems', 'DevOps', 'Digital Illustration',
  'Digital Marketing', 'Docker', 'Document Review', 'Documentation', 'E-commerce Strategy', 'Editing',
  'Editorial Planning', 'Email Copywriting', 'Email Handling', 'Empathy', 'Environmental Science',
  'Excel', 'Express Scribe', 'Facilitation', 'FastAPI', 'Feature Engineering', 'Figma',
  'Financial Modelling', 'Firewalls', 'Flask', 'Forecasting', 'Frontend Development', 'GCP', 'GIS',
  'Git', 'GitHub', 'GitHub Actions', 'Google Ads', 'Google Analytics', 'Google Search Console',
  'Google Sheets', 'Grant Writing', 'Graphic Design', 'HTML', 'HR Administration', 'Hardware',
  'Help Documentation', 'HubSpot', 'ICD-10', 'Illustration', 'Incident Response', 'Infrastructure as Code',
  'Instructional Design', 'Interview Facilitation', 'JAWS', 'JavaScript', 'Jenkins', 'Jira', 'Jupyter',
  'Keyword Research', 'Kubernetes', 'LMS Administration', 'Layout', 'Learning Objectives', 'Legal Drafting',
  'Legal Research', 'Linux', 'Looker', 'MLOps', 'MLflow', 'Machine Learning', 'Manual Testing',
  'Marketing', 'Medical Coding', 'Medical Terminology', 'Microsoft 365', 'Microsoft Sentinel',
  'Miro', 'Model Deployment', 'Model Evaluation', 'Moderation', 'Motion Graphics', 'MySQL',
  'NLP', 'NVDA', 'Needs Analysis', 'Negotiation', 'Network Security', 'Networking', 'Next.js',
  'Node.js', 'Notion', 'NumPy', 'Onboarding', 'Organisation', 'Paid Ads', 'Pandas', 'Payroll Processing',
  'Performance Tuning', 'Persuasive Writing', 'Photoshop', 'PHP', 'Policy Writing', 'PostgreSQL',
  'Postman', 'Power BI', 'PowerPoint', 'Premiere Pro', 'Presentation', 'Problem Solving',
  'Process Mapping', 'Product Analytics', 'Product Knowledge', 'Product Listing', 'Product Strategy',
  'Proofreading', 'Proposal Writing', 'Prospecting', 'Prototyping', 'PyTorch', 'Python',
  'Quality Control', 'Qualtrics', 'QuickBooks', 'R', 'REST APIs', 'React', 'React Native',
  'Reconciliation', 'Recruitment Support', 'Regression Testing', 'Regular Expressions', 'Regulatory Compliance',
  'Rendering', 'Report Writing', 'Reporting', 'Research', 'Responsive Design', 'Resume Writing',
  'Risk Assessment', 'Roadmapping', 'SQL', 'SQL Server', 'Salesforce', 'Scheduling', 'Scrapy',
  'Screen readers', 'Scrum', 'Security', 'Segmentation', 'Selenium', 'SEO', 'SharePoint',
  'Shopify', 'SIEM', 'Slack', 'Social Media', 'SPSS', 'Stakeholder Communication',
  'Stakeholder Management', 'Statistical Thinking', 'Statistics', 'Storyboarding', 'Storytelling',
  'Strategy', 'Style Guides', 'Survey Design', 'Synthesis', 'Tableau', 'Tax Preparation',
  'Teaching', 'Technical Writing', 'TensorFlow', 'Terraform', 'Test Case Writing', 'Threat Analysis',
  'Time Management', 'Training Delivery', 'Troubleshooting', 'Typing Accuracy', 'Typography',
  'UI Design', 'UI/UX', 'Unity', 'Usability Testing', 'User Advocacy', 'User Behaviour Analysis',
  'User Stories', 'UX Audits', 'UX Research', 'UX Writing', 'Video Editing', 'Video Production',
  'Visual Design', 'Visual Hierarchy', 'Visual Storytelling', 'Vue.js', 'Vulnerability Assessment',
  'WCAG', 'Web Development', 'Wireframing', 'WooCommerce', 'WordPress', 'Writing',
  'Written Communication', 'Zendesk', 'Zoom', 'eLearning Authoring', 'pandas', 'scikit-learn',
];

const SKILL_OPTION_LOOKUP = new Map(SKILL_OPTIONS.map((skill) => [skill.toLowerCase(), skill]));

function DimSelector({ dim, value, onChange, themeMode }) {
  const { Icon, label, key } = dim;
  const active = NEED_LEVELS.find((l) => l.value === value) || NEED_LEVELS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: active.color }} />
        <span className="text-sm font-bold">{label}</span>
        <span className="ml-auto text-xs font-bold" style={{ color: active.color }}>{active.short}</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {NEED_LEVELS.map((lvl) => {
          const isActive = lvl.value === value;
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => onChange(key, lvl.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150"
              style={{
                borderColor: isActive ? lvl.color : 'transparent',
                background: isActive ? `${lvl.color}18` : themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                color: isActive ? lvl.color : undefined,
                opacity: isActive ? 1 : 0.55,
              }}
            >
              {lvl.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage({
  theme, themeMode, API_BASE, currentUser, setCurrentUser,
  speakOnFocus, speechEnabled, speakText,
}) {
  const [fullName,        setFullName]        = useState('N/A');
  const [profileImage,    setProfileImage]    = useState(null);
  const [phoneNumber,     setPhoneNumber]     = useState('');
  const [address,         setAddress]         = useState('N/A');
  const [needsMap,        setNeedsMap]        = useState({ mobility: 'N/A', vision: 'N/A', hearing: 'N/A', cognitive: 'N/A' });
  const [experienceLevel, setExperienceLevel] = useState('N/A');
  const [skills,          setSkills]          = useState([]);
  const [skillInput,      setSkillInput]      = useState('');
  const [status,          setStatus]          = useState('');
  const [error,           setError]           = useState('');
  const [isSaving,        setIsSaving]        = useState(false);
  const [isEditingName,   setIsEditingName]   = useState(false);
  const skillInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const norm = (v) => {
      if (!v) return 'N/A';
      if (String(v).trim().toLowerCase() === 'no issues / n/a') return 'No issues';
      return v;
    };
    setFullName(currentUser.full_name || 'N/A');
    setProfileImage(currentUser.profile_image || null);
    setPhoneNumber(currentUser.phone_number === 'N/A' ? '' : (currentUser.phone_number || ''));
    setAddress(currentUser.address || 'N/A');
    setNeedsMap({
      mobility:  norm(currentUser.mobility),
      vision:    norm(currentUser.vision),
      hearing:   norm(currentUser.hearing),
      cognitive: norm(currentUser.cognitive),
    });
    setExperienceLevel(currentUser.experience_level || 'N/A');
    setSkills(Array.isArray(currentUser.skills) ? currentUser.skills : []);
  }, [currentUser]);

  const updateNeed = (key, val) => setNeedsMap((prev) => ({ ...prev, [key]: val }));

  const addSkillValue = (value) => {
    const candidate = value.trim();
    const s = SKILL_OPTION_LOOKUP.get(candidate.toLowerCase());
    if (!candidate) return;
    if (!s) {
      setError('Please choose a skill from the dropdown list.');
      return;
    }
    if (skills.includes(s) || skills.length >= 30) return;
    setError('');
    setSkills((prev) => [...prev, s]);
    setSkillInput('');
    skillInputRef.current?.focus();
  };

  const addSkill = () => addSkillValue(skillInput);

  const removeSkill = (s) => setSkills((prev) => prev.filter((x) => x !== s));

  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Choose a PNG, JPG, WebP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile picture must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result.startsWith('data:image/')) {
        setError('Could not read that image. Please try another picture.');
        return;
      }
      setError('');
      setProfileImage(result);
    };
    reader.onerror = () => setError('Could not read that image. Please try another picture.');
    reader.readAsDataURL(file);
  };

  const handleSkillKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
    if (e.key === 'Backspace' && !skillInput && skills.length) removeSkill(skills[skills.length - 1]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setStatus('');
    setIsSaving(true);
    const token = localStorage.getItem('skillable_token');
    if (!token) { setError('Sign in to save your profile.'); setIsSaving(false); return; }
    if (phoneNumber && phoneNumber.length !== 11) { setError('Phone number must be exactly 11 digits.'); setIsSaving(false); return; }
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          full_name: fullName, phone_number: phoneNumber || 'N/A', address,
          profile_image: profileImage, ...needsMap, experience_level: experienceLevel, skills,
        }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.detail || 'Update failed.'); }
      const data = await res.json();
      setCurrentUser(data);
      setStatus('Saved.');
      if (speakOnFocus && speechEnabled) speakText('Profile saved.');
    } catch (err) {
      const msg = err.message || 'Update failed.';
      setError(msg);
      if (speakOnFocus && speechEnabled) speakText(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const filledCount = [
    needsMap.mobility !== 'N/A', needsMap.vision !== 'N/A',
    needsMap.hearing !== 'N/A', needsMap.cognitive !== 'N/A',
    experienceLevel !== 'N/A', skills.length > 0,
    phoneNumber.length === 11, address !== 'N/A',
  ].filter(Boolean).length;
  const completionPct = Math.round((filledCount / 8) * 100);

  const initials = (fullName || '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

  const cardClass = themeMode === 'dark'
    ? 'bg-white/5 border border-white/10'
    : 'bg-white border border-slate-100 shadow-sm';

  return (
    <div className="py-14 px-6 max-w-6xl mx-auto">
    <div className="flex flex-col lg:flex-row gap-8 items-start">

      {/* ── Left banner ── */}
      <aside className="lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-24">
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(160deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}
        >
          {/* Top glow orb */}
          <div className="relative px-7 pt-10 pb-6">
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle,#8b5cf640 0%,transparent 70%)', transform: 'translate(30%,-30%)' }}
            />
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              <Sparkles size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-white leading-snug mb-3">
              Every person deserves a fair shot at meaningful work.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Skillable was built on a single belief that disability should never be a barrier to a career. We match people to jobs based on what they can do, not what they can't.
            </p>
          </div>

          <div className="h-px mx-7" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Values */}
          <div className="px-7 py-6 space-y-4">
            {[
              { Icon: Heart,       text: 'Built with inclusion at the core' },
              { Icon: ShieldCheck, text: 'Your data is yours — always private' },
              { Icon: Globe,       text: 'Opportunities for every background' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(99,102,241,0.25)' }}>
                  <Icon size={13} className="text-indigo-300" />
                </div>
                <p className="text-sm text-white/70 leading-snug">{text}</p>
              </div>
            ))}
          </div>

          <div className="h-px mx-7" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Stats */}
          <div className="px-7 py-6 grid grid-cols-2 gap-4">
            {[
              { num: '18+',  label: 'Career paths' },
              { num: '100%', label: 'Free to use' },
              { num: '4',    label: 'Need dimensions' },
              { num: '∞',    label: 'Possibilities' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-white">{num}</p>
                <p className="text-xs text-white/40 font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Bottom quote */}
          <div className="px-7 pb-8">
            <p className="text-xs text-white/30 italic leading-relaxed">
              "The more complete your profile, the more accurate your matches become."
            </p>
          </div>
        </div>
      </aside>

      {/* ── Right: form ── */}
      <div className="flex-1 min-w-0">

      {/* ── Top strip: avatar + name + completion ── */}
      <div className={`mb-8 p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-6 ${cardClass}`}>
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-black text-white"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handlePictureChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border ${themeMode === 'dark' ? 'border-white/15 hover:border-indigo-300' : 'border-slate-200 hover:border-indigo-300'}`}
            >
              <Camera size={12} />
              Change pic
            </button>
            {profileImage && (
              <button
                type="button"
                onClick={() => setProfileImage(null)}
                aria-label="Remove profile picture"
                className={`w-8 h-8 rounded-lg flex items-center justify-center border text-red-500 ${themeMode === 'dark' ? 'border-white/15 hover:border-red-300' : 'border-slate-200 hover:border-red-300'}`}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Name + email */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-black leading-tight">{fullName === 'N/A' ? 'Your Profile' : fullName}</h1>
          <p className={`text-sm mt-0.5 ${theme.textSecondary}`}>{currentUser?.email || ''}</p>

          {/* Completion */}
          <div className="mt-3 flex items-center gap-3">
            <div className={`flex-1 max-w-[200px] h-1.5 rounded-full overflow-hidden ${themeMode === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${completionPct}%`,
                  background: completionPct === 100 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#6366f1,#8b5cf6)',
                }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: completionPct === 100 ? '#22c55e' : '#6366f1' }}>
              {completionPct}% complete
            </span>
          </div>
        </div>

        {/* Save button lives here on desktop */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className={`hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm flex-shrink-0 transition-all disabled:opacity-60 ${theme.primaryBtn}`}
        >
          {isSaving ? 'Saving…' : 'Save profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">

        {/* ── Column 1: Personal ── */}
        <div className={`p-6 rounded-3xl space-y-5 lg:col-span-1 ${cardClass}`}>
          <p className="text-xs font-black uppercase tracking-widest opacity-40">Personal</p>

          {/* Full name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-1.5 opacity-60" htmlFor="pf-name">
              <User size={12} /> Full name
            </label>
            <div className="flex gap-2">
              <input
                id="pf-name"
                className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all
                  ${isEditingName ? theme.input : themeMode === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                readOnly={!isEditingName}
              />
              <button
                type="button"
                onClick={() => setIsEditingName((p) => !p)}
                className={`flex-shrink-0 p-2.5 rounded-xl border text-sm transition-all
                  ${themeMode === 'dark' ? 'border-white/15 hover:border-white/35' : 'border-slate-200 hover:border-slate-400'}`}
              >
                {isEditingName ? <Lock size={13} /> : <Pencil size={13} />}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-1.5 opacity-60" htmlFor="pf-phone">
              <Phone size={12} /> Phone
            </label>
            <input
              id="pf-phone"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${theme.input}`}
              value={phoneNumber}
              placeholder="01xxxxxxxxx"
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D+/g, '').slice(0, 11))}
              inputMode="numeric"
            />
          </div>

          {/* Governorate */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold flex items-center gap-1.5 opacity-60" htmlFor="pf-gov">
              <MapPin size={12} /> Governorate
            </label>
            <select
              id="pf-gov"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${theme.input}`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            >
              {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* ── Column 2: Career + Skills ── */}
        <div className="space-y-6 lg:col-span-1">

          {/* Experience */}
          <div className={`p-6 rounded-3xl ${cardClass}`}>
            <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Experience</p>
            <div className="flex gap-2 flex-wrap">
              {EXPERIENCE_OPTIONS.map((o) => {
                const active = o.value === experienceLevel;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setExperienceLevel(o.value)}
                    className="px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150"
                    style={{
                      borderColor: active ? '#6366f1' : 'transparent',
                      background: active
                        ? '#6366f120'
                        : themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      color: active ? '#6366f1' : undefined,
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div className={`p-6 rounded-3xl ${cardClass}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Skills</p>
              <span className="text-xs font-bold opacity-40">{skills.length}/30</span>
            </div>

            {/* Tag cloud */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {skills.map((s) => (
                  <span
                    key={s}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
                      ${themeMode === 'dark' ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="opacity-50 hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input row */}
            <div className="flex gap-2">
              <input
                ref={skillInputRef}
                list="profile-skill-options"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                placeholder="Choose a skill..."
                className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${theme.input}`}
                maxLength={60}
              />
              <datalist id="profile-skill-options">
                {SKILL_OPTIONS.map((skill) => (
                  <option key={skill} value={skill} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={addSkill}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl border text-sm font-bold transition-all
                  ${themeMode === 'dark' ? 'border-white/15 hover:border-indigo-400 hover:text-indigo-400' : 'border-slate-200 hover:border-indigo-400 hover:text-indigo-500'}`}
              >
                <Plus size={14} />
              </button>
            </div>
            <select
              value=""
              onChange={(e) => {
                addSkillValue(e.target.value);
              }}
              className={`mt-2 w-full px-3 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all ${theme.input}`}
              aria-label="Choose a skill from dropdown"
            >
              <option value="">Open full skill dropdown</option>
              {SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            <p className="text-xs opacity-30 mt-2">Pick from the dropdown. Enter adds selected text. Backspace removes last.</p>
          </div>
        </div>

        {/* ── Column 3: Accessibility needs ── */}
        <div className={`p-6 rounded-3xl lg:col-span-1 ${cardClass}`}>
          <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-5">Accessibility needs</p>
          <div className="space-y-5">
            {NEED_DIMS.map((dim) => (
              <DimSelector
                key={dim.key}
                dim={dim}
                value={needsMap[dim.key]}
                onChange={updateNeed}
                themeMode={themeMode}
              />
            ))}
          </div>
        </div>

        {/* ── Feedback + mobile save ── */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`sm:hidden w-full px-8 py-3.5 rounded-xl font-black text-sm transition-all disabled:opacity-60 ${theme.primaryBtn}`}
          >
            {isSaving ? 'Saving…' : 'Save profile'}
          </button>
          {error  && <div role="alert"  className="flex items-center gap-2 text-sm font-semibold text-red-500"><AlertCircle size={14}/>{error}</div>}
          {status && <div role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-500"><CheckCircle size={14}/>{status}</div>}
        </div>
      </form>
      </div>{/* end right form */}
    </div>{/* end flex row */}
    </div>
  );
}
