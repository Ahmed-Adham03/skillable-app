import React from 'react';
import {
  Bot,
  Moon,
  Sun
} from 'lucide-react';

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
  toggleTheme
}) {
  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.navBg}`} aria-label="Main">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-3 cursor-pointer group" aria-label="Go to home">
          <div className={`p-2.5 rounded-xl transition-all ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'}`}><Bot size={24} aria-hidden="true" /></div>
          <span className="text-2xl font-black">Skillable</span>
        </button>

        <div className="hidden md:flex items-center gap-8 font-bold text-sm">
          <button onClick={() => setActiveTab('home')} className={`relative transition-colors ${activeTab === 'home' ? theme.accent : theme.textSecondary}`}>Home</button>
          <button onClick={() => setActiveTab('careers')} className={`relative transition-colors ${activeTab === 'careers' ? theme.accent : theme.textSecondary}`}>Career Paths</button>
          <button onClick={() => document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' })} className={theme.textSecondary}>AI Tools</button>
          <button onClick={() => setActiveTab('accessibility-features')} className={`relative transition-colors ${activeTab === 'accessibility-features' ? theme.accent : theme.textSecondary}`}>Accessibility Features</button>
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
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}
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
                  <div className="mt-4">
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
