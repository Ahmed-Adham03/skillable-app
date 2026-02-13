import React from 'react';
import { Eye } from 'lucide-react';

export default function AccessibilityStatementPage({ theme, themeMode }) {
  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className={`p-10 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}>
              <Eye size={14} aria-hidden="true" />
              <span>Accessibility Statement</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Our commitment to accessibility</h1>
            <p className={`mb-6 max-w-3xl ${theme.textSecondary}`}>
              Skillable is committed to providing an inclusive experience. We aim to align with WCAG 2.1 Level A/AA where possible and continuously improve.
            </p>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className={`p-6 rounded-2xl ${theme.card}`}>
                <h2 className="text-xl font-black mb-2">Standards we follow</h2>
                <p className={theme.textSecondary}>
                  We design and test for WCAG 2.1 A/AA success criteria, including keyboard access, text alternatives, and predictable navigation.
                </p>
              </div>
              <div className={`p-6 rounded-2xl ${theme.card}`}>
                <h2 className="text-xl font-black mb-2">Feedback & support</h2>
                <p className={theme.textSecondary}>
                  If you encounter barriers, we want to know. Share feedback and we will prioritize fixes that improve access.
                </p>
              </div>
              <div className={`p-6 rounded-2xl ${theme.card}`}>
                <h2 className="text-xl font-black mb-2">Ongoing improvements</h2>
                <p className={theme.textSecondary}>
                  Accessibility is a continuous effort. We test with assistive technologies and include accessible defaults by design.
                </p>
              </div>
              <div className={`p-6 rounded-2xl ${theme.card}`}>
                <h2 className="text-xl font-black mb-2">Contact</h2>
                <p className={theme.textSecondary}>
                  Email us at support@skillable.ai for accessibility support or alternative formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
