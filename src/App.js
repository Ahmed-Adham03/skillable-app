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
  Users,
  Volume2
} from 'lucide-react';

function AuthPage({
  variant,
  theme,
  themeMode,
  API_BASE,
  setActiveTab,
  setCurrentUser,
  speakOnFocus,
  speechEnabled,
  speakText
}) {
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFieldErrors({});

    if (!email || !password || (!isLogin && !fullName)) {
      setFormError('Please complete all required fields.');
      setFieldErrors({
        fullName: !isLogin && !fullName ? 'Full name is required.' : '',
        email: !email ? 'Email address is required.' : '',
        password: !password ? 'Password is required.' : ''
      });
      if (speakOnFocus && speechEnabled) {
        speakText('A required field is missing. Please complete all required fields.');
      }
      return;
    }
    if (!isLogin && password.length < 8) {
      setFormError('Password must be at least 8 characters.');
      setFieldErrors({ password: 'Password must be at least 8 characters.' });
      if (speakOnFocus && speechEnabled) {
        speakText('Password must be at least 8 characters.');
      }
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      setFieldErrors({ confirmPassword: 'Passwords do not match.' });
      if (speakOnFocus && speechEnabled) {
        speakText('Passwords do not match.');
      }
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
        const message = data.detail || 'Request failed. Please try again.';
        throw new Error(message);
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
          if (speakOnFocus && speechEnabled) {
            speakText('Signed in successfully');
          }
          setActiveTab('home');
        }
      } else {
        setFormSuccess('Account created. You can sign in now.');
        setActiveTab('login');
      }
    } catch (err) {
      const message = err.message || 'Something went wrong.';
      setFormError(message);
      if (speakOnFocus && speechEnabled) {
        speakText(message);
      }
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
              <User size={14} aria-hidden="true" />
              <span>{isLogin ? 'Member Access' : 'New to Skillable'}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">{title}</h1>
            <p className={`mb-8 ${theme.textSecondary}`}>{subtitle}</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor={`${variant}-full-name`}>Full name</label>
                  <input
                    id={`${variant}-full-name`}
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={fieldErrors.fullName ? `${variant}-full-name-error` : undefined}
                    className={`w-full p-4 rounded-xl border ${theme.input}`}
                    placeholder="Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {fieldErrors.fullName && (
                    <div id={`${variant}-full-name-error`} className="text-xs text-red-500 font-semibold">
                      {fieldErrors.fullName}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold" htmlFor={`${variant}-email`}>Email address</label>
                <input
                  id={`${variant}-email`}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${variant}-email-error` : undefined}
                  className={`w-full p-4 rounded-xl border ${theme.input}`}
                  type="email"
                  placeholder="alex@skillable.ai"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && (
                  <div id={`${variant}-email-error`} className="text-xs text-red-500 font-semibold">
                    {fieldErrors.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold" htmlFor={`${variant}-password`}>Password</label>
                <div className="relative">
                  <input
                    id={`${variant}-password`}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? `${variant}-password-error` : undefined}
                    className={`w-full p-4 pr-24 rounded-xl border ${theme.input}`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {fieldErrors.password && (
                  <div id={`${variant}-password-error`} className="text-xs text-red-500 font-semibold">
                    {fieldErrors.password}
                  </div>
                )}
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor={`${variant}-confirm-password`}>Confirm password</label>
                  <div className="relative">
                    <input
                      id={`${variant}-confirm-password`}
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                      aria-describedby={fieldErrors.confirmPassword ? `${variant}-confirm-password-error` : undefined}
                      className={`w-full p-4 pr-24 rounded-xl border ${theme.input}`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <div id={`${variant}-confirm-password-error`} className="text-xs text-red-500 font-semibold">
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 font-semibold">
                  <input type="checkbox" className="w-4 h-4 accent-indigo-500" />
                  Keep me signed in
                </label>
                <button type="button" className={`font-bold ${theme.accent}`}>Forgot password?</button>
              </div>

              {formError && <div role="alert" className="text-sm text-red-500 font-semibold">Error: {formError}</div>}
              {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}

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
                <div className={`p-3 rounded-xl ${themeMode === 'contrast' ? 'bg-[#FFFF00]' : 'bg-indigo-600 text-white'}`}>
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <h2 className="text-xl font-black">Why Skillable?</h2>
              </div>
              <p className={theme.textSecondary}>
                We blend AI guidance with accessibility-first design so you can explore careers with confidence.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { icon: <CheckCircle size={18} aria-hidden="true" />, text: 'Personalized pathways that update with your progress.' },
                { icon: <Users size={18} aria-hidden="true" />, text: 'Community insights from inclusive employers.' },
                { icon: <Award size={18} aria-hidden="true" />, text: 'Verified accessibility tips for interviews and onboarding.' }
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
                <Bot size={16} aria-hidden="true" />
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
}

export default function App() {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState('home'); // Logic to switch pages
  const [themeMode, setThemeMode] = useState('light');
  const [fontSize, setFontSize] = useState(100);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [speakOnFocus, setSpeakOnFocus] = useState(() => {
    const saved = localStorage.getItem('skillable_speak_focus');
    return saved === 'true';
  });
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    const saved = localStorage.getItem('skillable_speech_enabled');
    return saved === 'true';
  });
  const [voicesReady, setVoicesReady] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');

  useEffect(() => {
    localStorage.setItem('skillable_speak_focus', String(speakOnFocus));
  }, [speakOnFocus]);

  useEffect(() => {
    localStorage.setItem('skillable_speech_enabled', String(speechEnabled));
  }, [speechEnabled]);

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

  const speakText = (text) => {
    if (!text || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.volume = 1;
      if (synth.speaking) synth.cancel();
      synth.resume();
      setTimeout(() => synth.speak(utterance), 50);
    } catch (err) {
      // Ignore speech failures to avoid breaking UI
    }
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const handleVoices = () => {
      setVoicesReady(synth.getVoices().length > 0);
    };
    synth.onvoiceschanged = handleVoices;
    handleVoices();
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!speakOnFocus || !speechEnabled) return;

    const getLabel = (el) => {
      if (!el) return '';
      const aria = el.getAttribute?.('aria-label');
      if (aria) return aria.trim();
      const ariaLabelledBy = el.getAttribute?.('aria-labelledby');
      if (ariaLabelledBy) {
        const labelEl = document.getElementById(ariaLabelledBy);
        if (labelEl?.textContent) return labelEl.textContent.trim();
      }
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        return (el.placeholder || el.value || '').trim();
      }
      return (el.textContent || '').trim();
    };

    const handleFocus = (event) => {
      const label = getLabel(event.target);
      if (!label) return;
      speakText(label);
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, [speakOnFocus, speechEnabled]);

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
  const signOutButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

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

  useEffect(() => {
    if (isProfileOpen) {
      setTimeout(() => signOutButtonRef.current?.focus(), 0);
    }
  }, [isProfileOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('skillable_token');
    setCurrentUser(null);
    setIsProfileOpen(false);
    setActiveTab('home');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme.appBg} ${theme.textPrimary}`} style={{ fontSize: `${fontSize}%` }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');`}</style>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg">
        Skip to main content
      </a>

      {/* Dynamic Background Blobs */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${theme.blob}`} aria-hidden="true">
         <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-purple-500/30 blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-500/30 blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Accessibility Bar */}
      <div className={`relative z-50 px-6 py-2 flex justify-between items-center text-xs font-bold border-b transition-colors ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black border-black' : (themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500')}`}>
        <div className="flex items-center gap-2"><Accessibility size={14} aria-hidden="true" /><span>Quick accessibility tools</span></div>
        <div className="flex items-center gap-4">
          <button onClick={activateHighContrast} className="hover:text-indigo-500 flex items-center gap-1"><Eye size={14} aria-hidden="true" /> Contrast</button>
          <button
            onClick={() => {
              const next = !speakOnFocus;
              if (next) speakText('Speech on');
              else speakText('Speech off');
              setSpeakOnFocus(next);
            }}
            className="hover:text-indigo-500 flex items-center gap-1"
            aria-pressed={speakOnFocus}
          >
            <Volume2 size={14} aria-hidden="true" /> Speak Focus {speakOnFocus ? 'On' : 'Off'}
          </button>
          {!speechEnabled && (
            <button
              onClick={() => {
                setSpeechEnabled(true);
                speakText('Speech enabled');
              }}
              className="hover:text-indigo-500 flex items-center gap-1"
            >
              Enable Speech
            </button>
          )}
          <button
            onClick={() => {
              if (!('speechSynthesis' in window)) {
                setSpeechStatus('Speech not supported in this browser.');
                return;
              }
              const synth = window.speechSynthesis;
              const voices = synth.getVoices();
              setSpeechStatus(`Voices loaded: ${voices.length} — speaking...`);
              const utterance = new SpeechSynthesisUtterance('This is a test voice');
              utterance.lang = 'en-US';
              utterance.rate = 1;
              utterance.volume = 1;
              utterance.onstart = () => setSpeechStatus(`Voices loaded: ${voices.length} — speaking...`);
              utterance.onend = () => setSpeechStatus(`Voices loaded: ${voices.length} — done`);
              utterance.onerror = (event) => {
                const errorMsg = event?.error || 'unknown error';
                if (errorMsg === 'canceled') {
                  setSpeechStatus(`Voices loaded: ${voices.length} — interrupted`);
                  return;
                }
                setSpeechStatus(`Voices loaded: ${voices.length} — error: ${errorMsg}`);
              };
              if (synth.speaking) synth.cancel();
              synth.resume();
              setTimeout(() => synth.speak(utterance), 50);
            }}
            className="hover:text-indigo-500 flex items-center gap-1"
          >
            Test Voice
          </button>
          {speechStatus && <span className="text-[10px] opacity-70">{speechStatus}</span>}
          <div className="flex gap-1"><button onClick={decreaseFont} className="px-2">A-</button><button onClick={increaseFont} className="px-2">A+</button></div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${theme.navBg}`} aria-label="Main">
          <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-3 cursor-pointer group" aria-label="Go to home">
             <div className={`p-2.5 rounded-xl transition-all ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'}`}><Bot size={24} aria-hidden="true" /></div>
             <span className="text-2xl font-black">Skillable</span>
          </button>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm">
             <button onClick={() => setActiveTab('home')} className={`relative transition-colors ${activeTab === 'home' ? theme.accent : theme.textSecondary}`}>Home</button>
             <button onClick={() => setActiveTab('careers')} className={`relative transition-colors ${activeTab === 'careers' ? theme.accent : theme.textSecondary}`}>Career Paths</button>
             <button onClick={() => document.getElementById('ai')?.scrollIntoView({behavior:'smooth'})} className={theme.textSecondary}>AI Tools</button>
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

      {/* --- PAGE SWITCHER --- */}
      <main id="main-content">
      {activeTab === 'home' ? (
        <div className="animate-fade-in">
          {/* Hero Section */}
          <header className="relative pt-16 pb-32 lg:pt-32 lg:pb-48 overflow-hidden z-10">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                 <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}><Sparkles size={14} aria-hidden="true" /><span>AI for serving humanity</span></div>
                 <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">Discover your power <br/><span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeMode === 'contrast' ? 'from-[#FFFF00] to-white' : 'from-indigo-600 to-pink-500'}`}>Professional potential</span></h1>
                 <p className={`text-lg lg:text-xl mb-10 max-w-2xl ${theme.textSecondary}`}><b>Skillable</b> is your gateway to the future. We use Gemini AI to design career paths that adapt to your abilities.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button onClick={() => document.getElementById('ai').scrollIntoView({behavior:'smooth'})} className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 ${theme.primaryBtn}`}><Bot size={20} aria-hidden="true" /> Smart Assistant</button>
                    <button onClick={() => setActiveTab('careers')} className={`px-8 py-4 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}><Briefcase size={20} aria-hidden="true" /> Browse Paths</button>
                 </div>
              </div>
              
              {/* Image Section */}
              <div className="flex-1 w-full relative">
                 <div className={`relative aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden ${themeMode === 'contrast' ? 'border-4 border-[#FFFF00]' : 'shadow-2xl'}`}>
                    <div className={`absolute inset-0 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-indigo-50'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className={`w-[80%] h-[80%] rounded-xl flex flex-col items-center justify-center gap-4 ${theme.glass}`}>
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-bounce ${themeMode === 'contrast' ? 'bg-[#FFFF00]' : 'bg-indigo-600 text-white'}`}><Bot size={40} aria-hidden="true" /></div>
                          <div className="text-center"><h2 className="text-2xl font-black mb-1">Smart analysis</h2><p className="text-sm opacity-70">Processing abilities...</p></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </header>

          {/* Bento Grid Features */}
          <section className="py-24 container mx-auto px-6">
             <h2 className="sr-only">Platform highlights</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 p-10 rounded-3xl ${theme.card}`}>
                   <Bot size={28} className="mb-6 text-indigo-500" aria-hidden="true" />
                   <h3 className="text-2xl font-bold mb-4">Gemini Recommendation Engine</h3>
                   <p className={theme.textSecondary}>Advanced algorithms that understand your strengths to suggest careers.</p>
                </div>
                <div className={`p-10 rounded-3xl ${theme.card}`}><Globe size={28} className="mb-6 text-green-500" aria-hidden="true" /><h3 className="text-xl font-bold">Remote work</h3><p className={theme.textSecondary}>Flexible jobs for your circumstances.</p></div>
                <div className={`p-10 rounded-3xl ${theme.card}`}><Zap size={28} className="mb-6 text-pink-500" aria-hidden="true" /><h3 className="text-xl font-bold">Fast access</h3><p className={theme.textSecondary}>Screen-reader friendly interface.</p></div>
             </div>
          </section>

          {/* AI Tool Section */}
          <section id="ai" className="py-24 container mx-auto px-6">
             <div className={`rounded-[2.5rem] p-10 lg:p-16 ${theme.glass} relative overflow-hidden`}>
                <div className="relative z-10 grid lg:grid-cols-2 gap-12">
                   <div><h2 className="text-3xl font-black mb-6">Text Simplifier</h2><p className={theme.textSecondary}>Convert complex job descriptions into "Easy Read" format.</p></div>
                   <div>
                      <textarea className={`w-full p-6 rounded-2xl min-h-[150px] mb-4 ${theme.input}`} value={simplifyInput} onChange={(e) => setSimplifyInput(e.target.value)} placeholder="Paste text here..." aria-label="Text to simplify" />
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
                   <div className="p-6 border-b font-bold flex items-center gap-2"><Bot size={20} aria-hidden="true" /> Skillable AI</div>
                   <div className="flex-1 p-6 overflow-y-auto space-y-4">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'bot' ? theme.card : 'bg-indigo-600 text-white self-end ml-auto'}`}>{msg.text}</div>
                      ))}
                      <div ref={chatEndRef} />
                   </div>
                   <div className="p-4 border-t flex gap-2">
                      <input className={`flex-1 p-3 rounded-xl ${theme.input}`} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Ask anything..." aria-label="Chat message" />
                      <button onClick={handleChatSend} className={`p-3 rounded-xl ${theme.primaryBtn}`} aria-label="Send message"><Send size={20} aria-hidden="true" /></button>
                   </div>
                </div>
                <div><h2 className="text-4xl font-black mb-6">Your 24/7 Companion</h2><p className={theme.textSecondary}>We use Gemini to answer questions about jobs, accessibility laws, and interview prep.</p></div>
             </div>
          </section>
        </div>
      ) : activeTab === 'careers' ? (
        <CareersPage theme={theme} themeMode={themeMode} />
      ) : activeTab === 'login' ? (
        <AuthPage
          variant="login"
          theme={theme}
          themeMode={themeMode}
          API_BASE={API_BASE}
          setActiveTab={setActiveTab}
          setCurrentUser={setCurrentUser}
          speakOnFocus={speakOnFocus}
          speechEnabled={speechEnabled}
          speakText={speakText}
        />
      ) : (
        <AuthPage
          variant="register"
          theme={theme}
          themeMode={themeMode}
          API_BASE={API_BASE}
          setActiveTab={setActiveTab}
          setCurrentUser={setCurrentUser}
          speakOnFocus={speakOnFocus}
          speechEnabled={speechEnabled}
          speakText={speakText}
        />
      )}
      </main>

      <footer className={`py-12 border-t text-center opacity-50 ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200'}`}>© 2026 Skillable - Empowering Abilities</footer>
    </div>
  );
}
