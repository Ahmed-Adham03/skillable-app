import React, { useEffect, useMemo, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { canPostJobs, normalizeRole, ROLES } from '../auth/roles';

const getInitials = (user) => {
  const name = user?.full_name || '';
  const email = user?.email || '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return email ? email.slice(0, 2).toUpperCase() : 'SK';
};

function UserAvatar({ user, className, imageClassName = '', fallbackClassName = '' }) {
  if (user?.profile_image) {
    return (
      <img
        src={user.profile_image}
        alt=""
        className={`${className} ${imageClassName} object-cover`}
      />
    );
  }

  return (
    <span className={`${className} ${fallbackClassName}`}>
      {getInitials(user)}
    </span>
  );
}

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
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const role = normalizeRole(currentUser?.role);
  const roleLabel = role === ROLES.JOB_POSTER ? t('nav.roleJobPoster') : t('nav.roleJobSeeker');
  const roleShortLabel = role === ROLES.JOB_POSTER ? t('nav.roleJobPosterShort') : t('nav.roleJobSeekerShort');
  const avatarTone = role === ROLES.JOB_POSTER
    ? themeMode === 'contrast'
      ? 'bg-[#FFFF00] text-black border border-white'
      : 'bg-emerald-600 text-white'
    : themeMode === 'contrast'
      ? 'bg-[#FFFF00] text-black border border-white'
      : 'bg-indigo-600 text-white';
  const roleChipTone = role === ROLES.JOB_POSTER
    ? themeMode === 'contrast'
      ? 'border border-[#FFFF00] text-[#FFFF00]'
      : themeMode === 'dark'
        ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    : themeMode === 'contrast'
      ? 'border border-[#FFFF00] text-[#FFFF00]'
      : themeMode === 'dark'
        ? 'bg-indigo-500/15 text-indigo-200 border border-indigo-400/20'
        : 'bg-indigo-50 text-indigo-700 border border-indigo-100';

  const navItems = useMemo(() => ([
    { key: 'home', label: t('nav.home') },
    ...(currentUser ? [{ key: 'dashboard', label: t('nav.dashboard') }] : []),
    ...(currentUser ? [{ key: 'cv-generator', label: t('nav.cvGenerator') }] : []),
    { key: 'careers', label: t('nav.courses') },
    { key: 'open-roles', label: t('nav.openRoles') },
    { key: 'tracks', label: t('nav.tracks') },
    ...(canPostJobs(currentUser)
      ? [{ key: 'post-job', label: t('nav.postJob') }]
      : []),
    { key: 'accessibility-features', label: t('nav.accessibilityFeatures') },
  ]), [currentUser, t]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  const goToTab = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.navBg}`} aria-label="Main">
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center gap-3">
        <button onClick={() => goToTab('home')} className="flex items-center gap-2 cursor-pointer group min-w-0 flex-shrink-0" aria-label={t('nav.goToHome')}>
          <div className="p-1 rounded-xl transition-all flex-shrink-0">
            <img src="/SkillableLogo3BG0.png" alt="Skillable logo" className="w-10 h-10 xl:w-11 xl:h-11 object-contain" />
          </div>
          <span className="text-xl xl:text-2xl font-black truncate">Skillable</span>
        </button>

        <div className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-5 2xl:gap-8 font-bold text-sm">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => goToTab(item.key)}
              className={`relative whitespace-nowrap transition-colors hover:text-indigo-500 ${activeTab === item.key ? theme.accent : theme.textSecondary}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ms-auto xl:ms-0">
          {themeMode !== 'contrast' && (
            <button onClick={toggleTheme} className="p-2.5 rounded-full" aria-label="Darkmode">
              {themeMode === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
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
                aria-label={`${t('nav.accountMenu')}: ${roleLabel}`}
                className={`relative h-10 rounded-full flex items-center gap-2 font-bold max-w-[9rem] ${themeMode === 'contrast' ? 'border border-[#FFFF00] bg-black text-[#FFFF00]' : themeMode === 'dark' ? 'bg-white/5 text-white border border-white/10' : 'bg-white text-slate-900 border border-slate-200 shadow-sm'} ${isRtl ? 'pl-2 pr-1' : 'pl-1 pr-2'}`}
                ref={profileButtonRef}
              >
                <span className="relative w-8 h-8 rounded-full flex-shrink-0">
                  <UserAvatar
                    user={currentUser}
                    className="w-8 h-8 rounded-full"
                    fallbackClassName={`flex items-center justify-center text-xs ${avatarTone}`}
                  />
                  {hasProfileAlert && (
                    <span
                      className={`absolute -top-1 w-3 h-3 rounded-full bg-red-500 border border-white shadow ${isRtl ? '-left-1' : '-right-1'}`}
                      aria-label="Profile incomplete"
                      title="Profile incomplete"
                    />
                  )}
                </span>
                <span className="hidden 2xl:block truncate text-xs">{roleShortLabel}</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: -4, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, y: -4, filter: 'blur(2px)' }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: isRtl ? 'top left' : 'top right' }}
                    className={`absolute ${isRtl ? 'left-0 text-right' : 'right-0'} mt-3 w-[calc(100vw-2rem)] max-w-72 rounded-2xl p-4 shadow-xl ${theme.glass}`}
                    role="menu"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsProfileOpen(false);
                        setTimeout(() => profileButtonRef.current?.focus(), 0);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        user={currentUser}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        fallbackClassName={`flex items-center justify-center font-bold ${avatarTone}`}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-bold">{currentUser?.full_name || 'Skillable'}</div>
                        <div className={`text-xs break-all ${theme.textSecondary}`}>{currentUser?.email}</div>
                        <div className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-[0.68rem] font-black uppercase tracking-wide ${roleChipTone}`}>
                          {roleLabel}
                        </div>
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
                          goToTab('profile');
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
                  className={`absolute ${isRtl ? 'left-0 text-right' : 'right-0'} top-full mt-3 w-[calc(100vw-2rem)] max-w-72 rounded-2xl p-4 shadow-xl ${theme.glass}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className={`absolute -top-2 w-4 h-4 rotate-45 bg-inherit border-l border-t border-white/20 ${isRtl ? 'left-6' : 'right-6'}`} aria-hidden="true" />
                  <p className="text-sm font-bold mb-2">{t('nav.letsPersonalize')}</p>
                  <p className={`text-xs mb-3 ${theme.textSecondary}`}>
                    {t('nav.completeProfileMsg')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        dismissPersonalizeHint();
                        goToTab('profile');
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
              <button onClick={() => goToTab('login')} className={`hidden sm:inline-flex px-5 py-2.5 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}>{t('nav.signIn')}</button>
              <button onClick={() => goToTab('register')} className={`hidden sm:inline-flex px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>{t('nav.getStarted')}</button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`xl:hidden w-10 h-10 rounded-xl flex items-center justify-center border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : themeMode === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`xl:hidden mx-4 sm:mx-6 mb-4 rounded-3xl p-4 shadow-xl ${theme.glass}`}
          >
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => goToTab(item.key)}
                  className={`w-full px-4 py-3 rounded-2xl text-start font-black text-sm transition-colors ${activeTab === item.key ? theme.primaryBtn : themeMode === 'dark' ? 'hover:bg-white/10' : themeMode === 'contrast' ? 'border border-white' : 'hover:bg-slate-100'}`}
                >
                  {item.label}
                </button>
              ))}
              {!authLoading && !currentUser && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => goToTab('login')}
                    className={`px-4 py-3 rounded-2xl font-black text-sm border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-300'}`}
                  >
                    {t('nav.signIn')}
                  </button>
                  <button
                    onClick={() => goToTab('register')}
                    className={`px-4 py-3 rounded-2xl font-black text-sm ${theme.primaryBtn}`}
                  >
                    {t('nav.getStarted')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
