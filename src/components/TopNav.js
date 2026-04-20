import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function TopNav({
  theme,
  themeMode,
  activeTab,
  setActiveTab,
  setIsProfileOpen,
  isProfileOpen,
  currentUser,
  authLoading,
  profileRef,
  profileButtonRef,
  signOutButtonRef,
  handleSignOut,
  toggleTheme,
  showPersonalizeHint,
  dismissPersonalizeHint,
  hasProfileAlert
}) {
  const { t } = useTranslation();

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.navBg}`} aria-label="Main">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 cursor-pointer group" aria-label={t('nav.goToHome')}>
          <div className="p-1 rounded-xl transition-all">
            <img src="/SkillableLogo3BG0.png" alt="Skillable logo" className="w-11 h-11 object-contain" />
          </div>
          <span className="text-2xl font-black">Skillable</span>
        </button>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm">
          <button onClick={() => setActiveTab('home')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'home' ? theme.accent : theme.textSecondary}`}>{t('nav.home')}</button>
          {currentUser && (
            <button onClick={() => setActiveTab('dashboard')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'dashboard' ? theme.accent : theme.textSecondary}`}>{t('nav.dashboard')}</button>
          )}
          {currentUser && (
            <button onClick={() => setActiveTab('cv-generator')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'cv-generator' ? theme.accent : theme.textSecondary}`}>{t('nav.cvGenerator')}</button>
          )}
          <button onClick={() => setActiveTab('careers')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'careers' ? theme.accent : theme.textSecondary}`}>{t('nav.courses')}</button>
          <button onClick={() => setActiveTab('tracks')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'tracks' ? theme.accent : theme.textSecondary}`}>{t('nav.tracks')}</button>
          <button onClick={() => setActiveTab('accessibility-features')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'accessibility-features' ? theme.accent : theme.textSecondary}`}>{t('nav.accessibilityFeatures')}</button>
        </div>

        <div className="flex items-center gap-4">
          {themeMode !== 'contrast' && (
            <button onClick={toggleTheme} className="p-2.5 rounded-full" aria-label="Darkmode">{themeMode === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</button>
          )}
          {authLoading ? null : currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsProfileOpen(false);
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsProfileOpen((prev) => !prev);
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setIsProfileOpen(true);
                    setTimeout(() => signOutButtonRef.current?.focus(), 0);
                  }
                }}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                aria-label="Account menu"
                className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}
                ref={profileButtonRef}
              >
                {(() => {
                  const name = currentUser?.full_name || '';
                  const email = currentUser?.email || '';
                  const parts = name.trim().split(/\s+/).filter(Boolean);
                  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                  return email ? email.slice(0, 2).toUpperCase() : 'SK';
                })()}
                {hasProfileAlert && (
                  <span
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white shadow"
                    aria-label="Profile incomplete"
                    title="Profile incomplete"
                  />
                )}
              </button>

              <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'top right' }}
                  className={`absolute right-0 mt-3 w-64 rounded-2xl p-4 shadow-xl ${theme.glass}`}
                  role="menu"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsProfileOpen(false);
                      setTimeout(() => profileButtonRef.current?.focus(), 0);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                      {(() => {
                        const name = currentUser?.full_name || '';
                        const email = currentUser?.email || '';
                        const parts = name.trim().split(/\s+/).filter(Boolean);
                        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                        if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                        return email ? email.slice(0, 2).toUpperCase() : 'SK';
                      })()}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{currentUser?.full_name || 'Skillable'}</div>
                      <div className={`text-xs ${theme.textSecondary}`}>{currentUser?.email}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {hasProfileAlert && (
                      <div className={`rounded-xl p-3 text-xs font-semibold ${themeMode === 'contrast' ? 'border border-white' : 'border border-red-300 bg-red-50 text-red-700'}`}>
                        {t('nav.profileIncompleteMsg')}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsProfileOpen(false);
                      }}
                      role="menuitem"
                      className={`w-full py-2.5 rounded-xl font-bold text-sm ${theme.primaryBtn}`}
                    >
                      {t('nav.personalizeExperience')}
                    </button>
                    <button
                      onClick={handleSignOut}
                      ref={signOutButtonRef}
                      role="menuitem"
                      className={`w-full py-2.5 rounded-xl font-bold ${themeMode === 'contrast' ? 'bg-white text-black' : 'bg-slate-900 text-white'} `}
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>

              {showPersonalizeHint && !isProfileOpen && (
                <div
                  className={`absolute right-0 top-full mt-3 w-72 rounded-2xl p-4 shadow-xl ${theme.glass}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="absolute -top-2 right-6 w-4 h-4 rotate-45 bg-inherit border-l border-t border-white/20" aria-hidden="true" />
                  <p className="text-sm font-bold mb-2">{t('nav.letsPersonalize')}</p>
                  <p className={`text-xs mb-3 ${theme.textSecondary}`}>
                    {t('nav.completeProfileMsg')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        dismissPersonalizeHint();
                        setActiveTab('profile');
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold ${theme.primaryBtn}`}
                    >
                      {t('nav.personalizeNow')}
                    </button>
                    <button
                      type="button"
                      onClick={dismissPersonalizeHint}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                    >
                      {t('nav.later')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => setActiveTab('login')} className={`px-5 py-2.5 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}>{t('nav.signIn')}</button>
              <button onClick={() => setActiveTab('register')} className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>{t('nav.getStarted')}</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
