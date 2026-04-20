import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer({ theme, themeMode, setActiveTab }) {
  const { t } = useTranslation();
  return (
    <footer className={`py-12 border-t ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200'}`}>
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="text-lg font-black mb-2">{t('footer.accessibilityStatement')}</div>
          <p className={`text-sm ${theme.textSecondary}`}>
            {t('footer.commitment')}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <button onClick={() => setActiveTab('accessibility-statement')} className={theme.textSecondary}>{t('footer.accessibilityStatement')}</button>
          <button className={theme.textSecondary}>{t('footer.faqs')}</button>
          <button className={theme.textSecondary}>{t('footer.terms')}</button>
          <button className={theme.textSecondary}>{t('footer.privacy')}</button>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-8 text-center opacity-60 text-sm">
        {t('footer.copyright')}
      </div>
    </footer>
  );
}
