import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accessibility } from 'lucide-react';

export default function AccessibilityFeaturesPage({ theme, themeMode }) {
  const { t } = useTranslation();
  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className={`p-10 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}>
              <Accessibility size={14} aria-hidden="true" />
              <span>{t('nav.accessibilityFeatures')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">{t('accessFeatures.title')}</h1>
            <p className={`mb-10 max-w-3xl ${theme.textSecondary}`}>
              {t('accessFeatures.subtitle')}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: t('accessFeatures.keyboardTitle'),
                  body: t('accessFeatures.keyboardBody')
                },
                {
                  title: t('accessFeatures.contrastTitle'),
                  body: t('accessFeatures.contrastBody')
                },
                {
                  title: t('accessFeatures.textTitle'),
                  body: t('accessFeatures.textBody')
                },
                {
                  title: t('accessFeatures.motionTitle'),
                  body: t('accessFeatures.motionBody')
                },
                {
                  title: t('accessFeatures.screenReaderTitle'),
                  body: t('accessFeatures.screenReaderBody')
                },
                {
                  title: t('accessFeatures.speechTitle'),
                  body: t('accessFeatures.speechBody')
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
