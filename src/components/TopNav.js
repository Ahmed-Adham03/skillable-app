import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function TopNav({
  theme,
  themeMode,
  activeTab,
  setActiveTab,
  setIsProfileOpen,
  isProfileOpen,
  currentUser,
  profileRef,
  profileButtonRef,
  signOutButtonRef,
  handleSignOut,
  toggleTheme,
  showPersonalizeHint,
  dismissPersonalizeHint,
  hasProfileAlert
}) {
  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.navBg}`} aria-label="Main">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 cursor-pointer group" aria-label="Go to home">
          <div className="p-1 rounded-xl transition-all">
            <img src="/SkillableLogo3BG0.png" alt="Skillable logo" className="w-11 h-11 object-contain" />
          </div>
          <span className="text-2xl font-black">Skillable</span>
        </button>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm">
          <button onClick={() => setActiveTab('home')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'home' ? theme.accent : theme.textSecondary}`}>Home</button>
          {currentUser && (
            <button onClick={() => setActiveTab('dashboard')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'dashboard' ? theme.accent : theme.textSecondary}`}>Dashboard</button>
          )}
          <button onClick={() => setActiveTab('cv-generator')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'cv-generator' ? theme.accent : theme.textSecondary}`}>CV Generator</button>
          <button onClick={() => setActiveTab('careers')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'careers' ? theme.accent : theme.textSecondary}`}>Career Paths</button>
          <button onClick={() => document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' })} className={`transition-colors hover:text-indigo-500 ${theme.textSecondary}`}>AI Tools</button>
          <button onClick={() => setActiveTab('accessibility-features')} className={`relative transition-colors hover:text-indigo-500 ${activeTab === 'accessibility-features' ? theme.accent : theme.textSecondary}`}>Accessibility Features</button>
        </div>

        <div className="flex items-center gap-4">
          {themeMode !== 'contrast' && (
            <button onClick={toggleTheme} className="p-2.5 rounded-full" aria-label="Darkmode">{themeMode === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</button>
          )}
          {currentUser ? (
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

              {isProfileOpen && (
                <div
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
                      <div className="text-sm font-bold">{currentUser?.full_name || 'Skillable Member'}</div>
                      <div className={`text-xs ${theme.textSecondary}`}>{currentUser?.email}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {hasProfileAlert && (
                      <div className={`rounded-xl p-3 text-xs font-semibold ${themeMode === 'contrast' ? 'border border-white' : 'border border-red-300 bg-red-50 text-red-700'}`}>
                        Profile is incomplete. Please complete personalization fields that are still set to N/A.
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
                      Personalize your experience
                    </button>
                    <button
                      onClick={handleSignOut}
                      ref={signOutButtonRef}
                      role="menuitem"
                      className={`w-full py-2.5 rounded-xl font-bold ${themeMode === 'contrast' ? 'bg-white text-black' : 'bg-slate-900 text-white'} `}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}

              {showPersonalizeHint && !isProfileOpen && (
                <div
                  className={`absolute right-0 top-full mt-3 w-72 rounded-2xl p-4 shadow-xl ${theme.glass}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="absolute -top-2 right-6 w-4 h-4 rotate-45 bg-inherit border-l border-t border-white/20" aria-hidden="true" />
                  <p className="text-sm font-bold mb-2">Let&apos;s get personalized</p>
                  <p className={`text-xs mb-3 ${theme.textSecondary}`}>
                    Complete your profile so Skillable can recommend better career matches for you.
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
                      Personalize now
                    </button>
                    <button
                      type="button"
                      onClick={dismissPersonalizeHint}
                      className={`px-3 py-2 rounded-lg text-xs font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                    >
                      Later
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => setActiveTab('login')} className={`px-5 py-2.5 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}>Sign In</button>
              <button onClick={() => setActiveTab('register')} className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
