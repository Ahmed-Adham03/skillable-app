import React from 'react';
import { Accessibility } from 'lucide-react';

export default function AccessibilityFeaturesPage({ theme, themeMode }) {
  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className={`p-10 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}>
              <Accessibility size={14} aria-hidden="true" />
              <span>Accessibility Features</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Built for every ability</h1>
            <p className={`mb-10 max-w-3xl ${theme.textSecondary}`}>
              Skillable is designed to be operable, perceivable, and comfortable for people with diverse needs. These features are available today.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Keyboard-first navigation',
                  body: 'Everything is reachable with Tab and usable with Enter/Space.'
                },
                {
                  title: 'Contrast controls',
                  body: 'High-contrast mode for improved readability in bright or low-vision settings.'
                },
                {
                  title: 'Text scaling',
                  body: 'Adjust text size from the accessibility bar without breaking layouts.'
                },
                {
                  title: 'Reduced motion support',
                  body: 'Respects system preferences to reduce animation and motion.'
                },
                {
                  title: 'Screen reader readiness',
                  body: 'Landmarks, labels, and ARIA attributes for consistent narration.'
                },
                {
                  title: 'Speech guidance (optional)',
                  body: 'Speak focused elements and important feedback when enabled.'
                }
              ].map((item, idx) => (
                <div key={idx} className={`p-6 rounded-2xl ${theme.card}`}>
                  <h2 className="text-xl font-black mb-2">{item.title}</h2>
                  <p className={theme.textSecondary}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
