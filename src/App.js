import React, { useState, useEffect, useRef } from 'react';
import CareersPage from './careers'; // This imports your other file
import { 
  Eye, 
  Bot, 
  Accessibility, 
  Menu, 
  X, 
  Send, 
  RefreshCw, 
  CheckCircle,
  Briefcase,
  User,
  Settings,
  Moon,
  Sun,
  Sparkles,
  Zap,
  Globe,
  Award,
  Users
} from 'lucide-react';

export default function App() {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('home'); // Logic to switch pages
  const [themeMode, setThemeMode] = useState('light');
  const [fontSize, setFontSize] = useState(100);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Chat & AI Logic
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Welcome to Skillable 👋\nI am your smart assistant for career analysis. How can I help you?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Simplifier Logic
  const [simplifyInput, setSimplifyInput] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isSimplifying, setIsSimplifying] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- Theme Controls ---
  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  const activateHighContrast = () => setThemeMode(prev => prev === 'contrast' ? 'light' : 'contrast');
  const increaseFont = () => setFontSize(prev => Math.min(prev + 10, 140));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 10, 90));

  // --- API Call ---
  const callGeminiAPI = async (prompt) => {
    const apiKey = ""; 
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    } catch (error) { return "Server connection error."; }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput }]);
    setChatInput('');
    setIsChatLoading(true);
    const response = await callGeminiAPI(`Be positive and concise: ${chatInput}`);
    setChatMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsChatLoading(false);
  };

  const handleSimplify = async () => {
    if (!simplifyInput.trim()) return;
    setIsSimplifying(true);
    const response = await callGeminiAPI(`Simplify this text: ${simplifyInput}`);
    setSimplifiedText(response);
    setIsSimplifying(false);
  };

  // --- Theme Logic ---
  const getTheme = () => {
    switch (themeMode) {
      case 'dark':
        return {
          appBg: 'bg-[#0B1120]', textPrimary: 'text-white', textSecondary: 'text-slate-400', accent: 'text-indigo-400',
          navBg: scrolled ? 'bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-800' : 'bg-transparent',
          card: 'bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80',
          primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20',
          glass: 'backdrop-blur-xl bg-slate-900/60 border border-white/5',
          input: 'bg-slate-800/50 border-slate-700 text-white', blob: 'opacity-20'
        };
      case 'contrast':
        return {
          appBg: 'bg-black', textPrimary: 'text-[#FFFF00]', textSecondary: 'text-white', accent: 'text-white',
          navBg: 'bg-black border-b-2 border-[#FFFF00]', card: 'bg-black border-2 border-white mb-4',
          primaryBtn: 'bg-[#FFFF00] text-black border-2 border-white font-black hover:bg-white',
          glass: 'bg-black border-2 border-[#FFFF00]', input: 'bg-black border-2 border-white text-[#FFFF00]', blob: 'hidden'
        };
      default: // light
        return {
          appBg: 'bg-[#F8FAFC]', textPrimary: 'text-slate-900', textSecondary: 'text-slate-600', accent: 'text-indigo-600',
          navBg: scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/60' : 'bg-transparent',
          card: 'bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1',
          primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200',
          glass: 'backdrop-blur-xl bg-white/60 border border-white/20 shadow-xl',
          input: 'bg-white border-slate-200 text-slate-900', blob: 'opacity-60'
        };
    }
  };

  const theme = getTheme();
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('skillable_token');
    if (!token) return;
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCurrentUser(data);
      })
      .catch(() => {});
  }, [API_BASE]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('skillable_token');
    setCurrentUser(null);
    setIsProfileOpen(false);
    setActiveTab('home');
  };

  const AuthPage = ({ variant }) => {
    const isLogin = variant === 'login';
    const title = isLogin ? 'Welcome back' : 'Create your account';
    const subtitle = isLogin
      ? 'Sign in to keep building a career path that fits you.'
      : 'Join Skillable to get personalized, accessible guidance.';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const initials = (name, emailValue) => {
      if (name) {
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      if (emailValue) return emailValue.slice(0, 2).toUpperCase();
      return 'SK';
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');
      setFormSuccess('');

      if (!email || !password || (!isLogin && !fullName)) {
        setFormError('Please complete all required fields.');
        return;
      }
      if (!isLogin && password.length < 8) {
        setFormError('Password must be at least 8 characters.');
        return;
      }
      if (!isLogin && password !== confirmPassword) {
        setFormError('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      try {
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin
          ? { email, password }
          : { full_name: fullName, email, password };

        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || 'Request failed. Please try again.');
        }

        const data = await res.json();
        if (isLogin) {
          localStorage.setItem('skillable_token', data.access_token);
          const meRes = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${data.access_token}` }
          });
          const me = await meRes.json().catch(() => null);
          if (me) {
            setCurrentUser(me);
            setFormSuccess('Signed in successfully.');
            setActiveTab('home');
          }
        } else {
          setFormSuccess('Account created. You can sign in now.');
          setActiveTab('login');
        }
      } catch (err) {
        setFormError(err.message || 'Something went wrong.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="animate-fade-in">
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
            <div className={`p-10 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}>
                <User size={14} />
                <span>{isLogin ? 'Member Access' : 'New to Skillable'}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black mb-4">{title}</h1>
              <p className={`mb-8 ${theme.textSecondary}`}>{subtitle}</p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Full name</label>
                    <input
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      placeholder="Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold">Email address</label>
                  <input
                    className={`w-full p-4 rounded-xl border ${theme.input}`}
                    type="email"
                    placeholder="alex@skillable.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Password</label>
                  <div className="relative">
                    <input
                      className={`w-full p-4 pr-24 rounded-xl border ${theme.input}`}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Confirm password</label>
                    <div className="relative">
                      <input
                        className={`w-full p-4 pr-24 rounded-xl border ${theme.input}`}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 font-semibold">
                    <input type="checkbox" className="w-4 h-4 accent-indigo-500" />
                    Keep me signed in
                  </label>
                  <button type="button" className={`font-bold ${theme.accent}`}>Forgot password?</button>
                </div>

                {formError && <div className="text-sm text-red-500 font-semibold">{formError}</div>}
                {formSuccess && <div className="text-sm text-green-600 font-semibold">{formSuccess}</div>}

                <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                  {isSubmitting ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              <div className="mt-8 text-sm text-center">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => setActiveTab(isLogin ? 'register' : 'login')}
                  className={`ml-2 font-bold ${theme.accent}`}
                >
                  {isLogin ? 'Create one' : 'Sign in'}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-8 rounded-3xl ${theme.card}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-xl font-black">Why Skillable?</h3>
                </div>
                <p className={theme.textSecondary}>
                  We blend AI guidance with accessibility-first design so you can explore careers with confidence.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: <CheckCircle size={18} />, text: 'Personalized pathways that update with your progress.' },
                  { icon: <Users size={18} />, text: 'Community insights from inclusive employers.' },
                  { icon: <Award size={18} />, text: 'Verified accessibility tips for interviews and onboarding.' }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-5 rounded-2xl ${theme.card}`}>
                    <div className={`p-2 rounded-lg ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600/10 text-indigo-500'}`}>
                      {item.icon}
                    </div>
                    <p className="font-semibold">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-2xl ${theme.glass}`}>
                <div className="flex items-center gap-2 font-bold mb-2">
                  <Bot size={16} />
                  <span>Need a quick tour?</span>
                </div>
                <p className={theme.textSecondary}>Jump into the AI tools to see how Skillable simplifies career decisions.</p>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`mt-4 px-5 py-2.5 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                >
                  Explore the AI tools
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme.appBg} ${theme.textPrimary}`} style={{ fontSize: `${fontSize}%` }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');`}</style>
      
      {/* Dynamic Background Blobs */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${theme.blob}`}>
         <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-purple-500/30 blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-500/30 blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Accessibility Bar */}
      <div className={`relative z-50 px-6 py-2 flex justify-between items-center text-xs font-bold border-b transition-colors ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black border-black' : (themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500')}`}>
        <div className="flex items-center gap-2"><Accessibility size={14} /><span>Quick accessibility tools</span></div>
        <div className="flex items-center gap-4">
          <button onClick={activateHighContrast} className="hover:text-indigo-500 flex items-center gap-1"><Eye size={14} /> Contrast</button>
          <div className="flex gap-1"><button onClick={decreaseFont} className="px-2">A-</button><button onClick={increaseFont} className="px-2">A+</button></div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.navBg}`}>
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div onClick={() => setActiveTab('home')} className="flex items-center gap-3 cursor-pointer group">
             <div className={`p-2.5 rounded-xl transition-all ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'}`}><Bot size={24} /></div>
             <span className="text-2xl font-black">Skillable</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm">
             <button onClick={() => setActiveTab('home')} className={`relative transition-colors ${activeTab === 'home' ? theme.accent : theme.textSecondary}`}>Home</button>
             <button onClick={() => setActiveTab('careers')} className={`relative transition-colors ${activeTab === 'careers' ? theme.accent : theme.textSecondary}`}>Career Paths</button>
             <button onClick={() => document.getElementById('ai')?.scrollIntoView({behavior:'smooth'})} className={theme.textSecondary}>AI Tools</button>
          </div>

          <div className="flex items-center gap-4">
            {themeMode !== 'contrast' && (
               <button onClick={toggleTheme} className="p-2.5 rounded-full">{themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            )}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}
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
                  <div className={`absolute right-0 mt-3 w-64 rounded-2xl p-4 shadow-xl ${theme.glass}`}>
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

      {/* --- PAGE SWITCHER --- */}
      {activeTab === 'home' ? (
        <div className="animate-fade-in">
          {/* Hero Section */}
          <header className="relative pt-16 pb-32 lg:pt-32 lg:pb-48 overflow-hidden z-10">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                 <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}><Sparkles size={14} /><span>AI for serving humanity</span></div>
                 <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">Discover your power <br/><span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeMode === 'contrast' ? 'from-[#FFFF00] to-white' : 'from-indigo-600 to-pink-500'}`}>Professional potential</span></h1>
                 <p className={`text-lg lg:text-xl mb-10 max-w-2xl ${theme.textSecondary}`}><b>Skillable</b> is your gateway to the future. We use Gemini AI to design career paths that adapt to your abilities.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button onClick={() => document.getElementById('ai').scrollIntoView({behavior:'smooth'})} className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 ${theme.primaryBtn}`}><Bot size={20} /> Smart Assistant</button>
                    <button onClick={() => setActiveTab('careers')} className={`px-8 py-4 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}><Briefcase size={20} /> Browse Paths</button>
                 </div>
              </div>
              
              {/* Image Section */}
              <div className="flex-1 w-full relative">
                 <div className={`relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden ${themeMode === 'contrast' ? 'border-4 border-[#FFFF00]' : 'shadow-2xl'}`}>
                    <div className={`absolute inset-0 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-indigo-50'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className={`w-[80%] h-[80%] rounded-xl flex flex-col items-center justify-center gap-4 ${theme.glass}`}>
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-bounce ${themeMode === 'contrast' ? 'bg-[#FFFF00]' : 'bg-indigo-600 text-white'}`}><Bot size={40} /></div>
                          <div className="text-center"><h3 className="text-2xl font-black mb-1">Smart analysis</h3><p className="text-sm opacity-70">Processing abilities...</p></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </header>

          {/* Bento Grid Features */}
          <section className="py-24 container mx-auto px-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 p-10 rounded-3xl ${theme.card}`}>
                   <Bot size={28} className="mb-6 text-indigo-500" />
                   <h3 className="text-2xl font-bold mb-4">Gemini Recommendation Engine</h3>
                   <p className={theme.textSecondary}>Advanced algorithms that understand your strengths to suggest careers.</p>
                </div>
                <div className={`p-10 rounded-3xl ${theme.card}`}><Globe size={28} className="mb-6 text-green-500" /><h3 className="text-xl font-bold">Remote work</h3><p className={theme.textSecondary}>Flexible jobs for your circumstances.</p></div>
                <div className={`p-10 rounded-3xl ${theme.card}`}><Zap size={28} className="mb-6 text-pink-500" /><h3 className="text-xl font-bold">Fast access</h3><p className={theme.textSecondary}>Screen-reader friendly interface.</p></div>
             </div>
          </section>

          {/* AI Tool Section */}
          <section id="ai" className="py-24 container mx-auto px-6">
             <div className={`rounded-[2.5rem] p-10 lg:p-16 ${theme.glass} relative overflow-hidden`}>
                <div className="relative z-10 grid lg:grid-cols-2 gap-12">
                   <div><h3 className="text-3xl font-black mb-6">Text Simplifier</h3><p className={theme.textSecondary}>Convert complex job descriptions into "Easy Read" format.</p></div>
                   <div>
                      <textarea className={`w-full p-6 rounded-2xl min-h-[150px] mb-4 ${theme.input}`} value={simplifyInput} onChange={(e) => setSimplifyInput(e.target.value)} placeholder="Paste text here..." />
                      <button onClick={handleSimplify} className={`px-8 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>{isSimplifying ? "Processing..." : "Simplify"}</button>
                      {simplifiedText && <div className="mt-6 p-6 bg-green-500/10 rounded-xl border-l-4 border-green-500">{simplifiedText}</div>}
                   </div>
                </div>
             </div>
          </section>

          {/* Chat Assistant */}
          <section className="py-24 container mx-auto px-6">
             <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className={`h-[500px] rounded-[2.5rem] flex flex-col border ${theme.glass} overflow-hidden`}>
                   <div className="p-6 border-b font-bold flex items-center gap-2"><Bot size={20}/> Skillable AI</div>
                   <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'bot' ? theme.card : 'bg-indigo-600 text-white self-end ml-auto'}`}>{msg.text}</div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <div className="p-4 border-t flex gap-2">
                      <input className={`flex-1 p-3 rounded-xl ${theme.input}`} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask anything..." />
                      <button onClick={handleChatSend} className={`p-3 rounded-xl ${theme.primaryBtn}`}><Send size={20}/></button>
                   </div>
                </div>
                <div><h2 className="text-4xl font-black mb-6">Your 24/7 Companion</h2><p className={theme.textSecondary}>We use Gemini to answer questions about jobs, accessibility laws, and interview prep.</p></div>
             </div>
          </section>
        </div>
      ) : activeTab === 'careers' ? (
        <CareersPage theme={theme} themeMode={themeMode} />
      ) : activeTab === 'login' ? (
        <AuthPage variant="login" />
      ) : (
        <AuthPage variant="register" />
      )}

      <footer className={`py-12 border-t text-center opacity-50 ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200'}`}>© 2026 Skillable - Empowering Abilities</footer>
    </div>
  );
}
