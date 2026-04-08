import React from 'react';

export default function Footer({ theme, themeMode, setActiveTab }) {
  return (
    <footer className={`py-12 border-t ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200'}`}>
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="text-lg font-black mb-2">Accessibility Statement</div>
          <p className={`text-sm ${theme.textSecondary}`}>
            Skillable is committed to providing an inclusive experience. We aim to align with WCAG 2.1 Level A/AA where possible and continuously improve.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <button onClick={() => setActiveTab('accessibility-statement')} className={theme.textSecondary}>Accessibility Statement</button>
          <button className={theme.textSecondary}>FAQs</button>
          <button className={theme.textSecondary}>Terms</button>
          <button className={theme.textSecondary}>Privacy Policy</button>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-8 text-center opacity-60 text-sm">
        © 2026 Skillable - Empowering Abilities
      </div>
    </footer>
  );
}
