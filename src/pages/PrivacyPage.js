import React from 'react';
import { Database, EyeOff, LockKeyhole, ShieldCheck, Trash2, UserCheck } from 'lucide-react';

export default function PrivacyPage({ theme, themeMode }) {
  const isContrast = themeMode === 'contrast';
  const sections = [
    {
      Icon: Database,
      title: 'What Skillable collects',
      body: 'Skillable stores account details, profile answers, accessibility needs, skills, learning progress, CV inputs, and job application information only when they are needed to provide the service.',
    },
    {
      Icon: UserCheck,
      title: 'Why this data is used',
      body: 'Profile and accessibility information helps generate better career matches, learning recommendations, CV support, and a more comfortable interface experience.',
    },
    {
      Icon: LockKeyhole,
      title: 'How sensitive data is protected',
      body: 'Passwords are hashed. Sensitive profile fields such as phone number, address, mobility, vision, hearing, and cognitive needs are encrypted at rest by the backend before storage.',
    },
    {
      Icon: EyeOff,
      title: 'Access control',
      body: 'Users can access their own profile data after signing in. Protected backend routes require authentication, and recruiter features are separated by role.',
    },
    {
      Icon: ShieldCheck,
      title: 'What is not shared',
      body: 'Accessibility and disability-related answers are used for matching and personalization. They are not intended to be public profile information.',
    },
    {
      Icon: Trash2,
      title: 'Future user controls',
      body: 'A planned improvement is adding account deletion and data export so users can remove or retrieve their information directly from the platform.',
    },
  ];

  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className={`p-8 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${isContrast ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}>
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Privacy & Data Protection</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black mb-4">Your data should support you, not expose you</h1>
            <p className={`mb-10 max-w-3xl leading-relaxed ${theme.textSecondary}`}>
              Skillable asks for personal and accessibility-related information because it improves matching and guidance. This page explains how that data is used and protected.
            </p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sections.map(({ Icon, title, body }) => (
                <div key={title} className={`p-6 rounded-2xl border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : isContrast ? 'border-white' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${isContrast ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600/10 text-indigo-500'}`}>
                    <Icon size={20} />
                  </div>
                  <h2 className="text-lg font-black mb-2">{title}</h2>
                  <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{body}</p>
                </div>
              ))}
            </div>

            <div className={`mt-8 p-5 rounded-2xl border ${themeMode === 'dark' ? 'bg-slate-950/60 border-white/10' : isContrast ? 'border-[#FFFF00]' : 'bg-slate-50 border-slate-100'}`}>
              <p className="text-sm font-black mb-2">Important note</p>
              <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
                Names and emails remain readable because the platform needs them for account use and communication. Passwords are hashed, while sensitive profile fields are encrypted so they are not stored as plain text.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
