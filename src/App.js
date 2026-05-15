import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import CareersPage from './careers';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AccessibilityFeaturesPage from './pages/AccessibilityFeaturesPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';
import ProfilePage from './pages/ProfilePage';
import JobDetailsPage from './pages/JobDetailsPage';
import SkillDetailPage from './pages/SkillDetailPage';
import CreateCVPage from './pages/CreateCVPage';
import TracksPage from './pages/TracksPage';
import TrackDetailPage from './pages/TrackDetailPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import PostJobPage from './pages/PostJobPage';
import OpenRolesPage from './pages/OpenRolesPage';
import OpenRoleDetailPage from './pages/OpenRoleDetailPage';
import OpenRoleApplyPage from './pages/OpenRoleApplyPage';
import { Eye, Accessibility, Volume2, Languages } from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem('skillable_lang') || 'en');

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    i18n.changeLanguage(next);
    localStorage.setItem('skillable_lang', next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';
  const CODE_API = process.env.REACT_APP_CODE_API || 'http://127.0.0.1:9100';
  const OAUTH_REDIRECT_URI = process.env.REACT_APP_OAUTH_REDIRECT_URI || window.location.origin;
  // --- Routing ---
  const navigate = useNavigate();
  const location = useLocation();

  const TAB_TO_PATH = {
    home: '/',
    careers: '/careers',
    'job-details': '/job-details',
    'open-roles': '/open-roles',
    'open-role-details': '/open-role-details',
    tracks: '/tracks',
    dashboard: '/dashboard',
    'skill-detail': '/skill-detail',
    'accessibility-features': '/accessibility-features',
    'accessibility-statement': '/accessibility-statement',
    'cv-generator': '/cv-generator',
    profile: '/profile',
    'post-job': '/post-job',
    login: '/login',
    register: '/register',
    onboarding: '/onboarding',
  };

  const PATH_TO_TAB = Object.fromEntries(
    Object.entries(TAB_TO_PATH).map(([k, v]) => [v, k])
  );

  const activeTab = location.pathname.startsWith('/open-roles')
    ? 'open-roles'
    : PATH_TO_TAB[location.pathname] ?? 'home';
  const setActiveTab = (tab) => navigate(TAB_TO_PATH[tab] ?? '/');

  // --- State Management ---
  const [themeMode, setThemeMode] = useState('light');
  const [fontSize, setFontSize] = useState(100);
  const [scrolled, setScrolled] = useState(false);
  const [speakOnFocus, setSpeakOnFocus] = useState(() => {
    const saved = localStorage.getItem('skillable_speak_focus');
    return saved === 'true';
  });
  const [speechEnabled, setSpeechEnabled] = useState(() => {
    const saved = localStorage.getItem('skillable_speech_enabled');
    return saved === 'true';
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('skillable_reduced_motion');
    return saved === 'true';
  });
  const [speechStatus, setSpeechStatus] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedOpenRole, setSelectedOpenRole] = useState(null);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    localStorage.setItem('skillable_speak_focus', String(speakOnFocus));
  }, [speakOnFocus]);

  useEffect(() => {
    localStorage.setItem('skillable_speech_enabled', String(speechEnabled));
  }, [speechEnabled]);

  useEffect(() => {
    localStorage.setItem('skillable_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  // Chat & AI Logic
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Welcome to Skillable.\nI am your smart assistant for career analysis. How can I help you?' }
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
      synth.getVoices();
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
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  // Handle OAuth redirect callbacks (LinkedIn, Facebook)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (!code || !['linkedin', 'facebook'].includes(state)) return;

    // Clear the OAuth params from the URL immediately
    navigate('/', { replace: true });

    const endpoint = `${API_BASE}/auth/oauth/${state}`;
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: OAUTH_REDIRECT_URI }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.detail || 'OAuth failed'); });
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('skillable_token', data.access_token);
        return fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });
      })
      .then((res) => (res.ok ? res.json() : null))
      .then((me) => {
        if (me) {
          setCurrentUser(me);
          setActiveTab('home');
        }
      })
      .catch(() => {
        // If OAuth callback fails, send to login page so user sees the error
        setActiveTab('login');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('skillable_token');
    if (!token) return;
    fetch(`${API_BASE}/auth/learning-plans`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setLearningPlans(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [API_BASE]);

  const persistLearningPlans = (plans) => {
    const token = localStorage.getItem('skillable_token');
    if (!token) return;
    fetch(`${API_BASE}/auth/learning-plans`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(plans)
    }).catch(() => {});
  };

  useEffect(() => {
    if (chatMessages.length <= 1) return;
    const container = chatEndRef.current?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [chatMessages]);

  // --- Theme Controls ---
  const toggleTheme = () => setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  const activateHighContrast = () => setThemeMode(prev => prev === 'contrast' ? 'light' : 'contrast');
  const increaseFont = () => setFontSize(prev => Math.min(prev + 10, 140));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 10, 90));

  // --- API Call ---
  const callGeminiAPI = async (payload, isChat = false) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyB9yuEG9Z7RMVJwmaHwpM95uKDnmT2367M";

    const systemPrompt = `أنت المساعد الذكي المدمج والخاص بمنصة "Skillable". أنت جزء من الموقع تتحدث مع المستخدم من داخله. تحلى باللطف الشديد، الإيجابية، ورد بنفس لغة المستخدم (عربي أو إنجليزي).
تجنب تماماً أن تتحدث كأنك من خارج الموقع (لا تقل ابحث عن زر كذا أو اذهب لموقعنا)، بل قل "يمكنك عمل كذا من خلال موقعنا هنا". تجنب الترحيب في كل رسالة؛ رحب في أول رسالة فقط. 
مهم جداً: لا تستخدم تنسيق Markdown أبداً (مثل ** أو * أو #). اجعل الإجابات سريعة ومختصرة، واستخدم أسطر جديدة واضحة (New lines) وإيموجيز (Emojis) لترتيب النقاط بدلاً من الشرطات أو النجوم لتكون القراءة مريحة جداً وسهلة.

عن منصة Skillable:
منصة تعتمد على الذكاء الاصطناعي لمساعدة ذوي الاحتياجات الخاصة (أصحاب الهمم) للحصول على المهارات المهنية المناسبة. حيث يدخل المستخدم نوع الإعاقة والمهارات التي يمتلكها أو يريدها، ليقترح النظام له مسارات تعليمية وتدريبات تفاعلية لتطوير مهاراته والاستعداد لسوق العمل.

صفحات الموقع والمميزات التي يمكنك إرشاد المستخدم إليها (هي متوفرة أعلى واجهة الموقع دائماً):
- الصفحة الرئيسية (Home): بها أداة مساعدة لتبسيط النصوص (Text Simplifier).
- صفحة المسارات (Browse Paths): لاستكشاف مجالات العمل المتاحة والتسجيل فيها.
- لوحة التحكم (Dashboard): تعرض تقدم نسبة الإنجاز في المسارات المنتسب إليها المستخدم.
- إنشاء السيرة الذاتية (CV Generator): أداة ذكية بداخل موقعنا لعمل CV و Resume احترافي (يتطلب تسجيل الدخول).
- الملف الشخصي (Profile): المكان الذي يدخل فيه المستخدم إعاقته وقدراته (البصرية، الحركية، السمعية، الإدراكية) كي نفهم حالته ونقدم التوصيات له.
- أدوات الوصول (Accessibility Toolbar): شريط أعلى الموقع لتفعيل القارئ الصوتي (Speak Focus)، ألوان التباين (Contrast)، تغيير حجم الخط، وتقليل الحركة.`;

    let requestBody = {};
    if (isChat) {
      // 1. Strip out any 'bot' messages at the beginning of the history
      let validHistory = payload;
      while (validHistory.length > 0 && validHistory[0].role === 'bot') {
        validHistory = validHistory.slice(1);
      }
      
      // 2. Format to strictly alternating roles
      const formattedContents = [];
      for (const msg of validHistory) {
        const apiRole = msg.role === 'bot' ? 'model' : 'user';
        if (formattedContents.length > 0 && formattedContents[formattedContents.length - 1].role === apiRole) {
           formattedContents[formattedContents.length - 1].parts[0].text += '\n' + msg.text;
        } else {
           formattedContents.push({ role: apiRole, parts: [{ text: msg.text }] });
        }
      }

      requestBody = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: formattedContents.length > 0 ? formattedContents : [{ role: 'user', parts: [{ text: 'Hello' }] }]
      };
    } else {
      requestBody = { contents: [{ parts: [{ text: payload }] }] };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Gemini API error:", data);
        if (response.status === 429) {
           return "عذراً! وصلنا للحد الأقصى لعدد الرسائل المسموحة حالياً، يرجى الانتظار دقيقة واحدة والمحاولة مرة أخرى.";
        }
        return "Sorry, I couldn't process that.";
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    } catch (error) {
      console.error("Gemini fetch error:", error);
      return "Server connection error.";
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    
    const newChatHistory = [...chatMessages, { role: 'user', text: chatInput }];
    setChatMessages(newChatHistory);
    setChatInput('');
    setIsChatLoading(true);

    const response = await callGeminiAPI(newChatHistory, true);
    setChatMessages(prev => [...prev, { role: 'bot', text: response }]);
    setIsChatLoading(false);
  };

  const handleSimplify = async () => {
    if (!simplifyInput.trim()) return;
    setIsSimplifying(true);
    const response = await callGeminiAPI(`Simplify this text: ${simplifyInput}`, false);
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
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPersonalizeHint, setShowPersonalizeHint] = useState(false);
  const profileRef = useRef(null);
  const signOutButtonRef = useRef(null);
  const profileButtonRef = useRef(null);

  const isProfileIncomplete = (user) => {
    if (!user) return false;
    const fields = [
      user.mobility,
      user.vision,
      user.hearing,
      user.cognitive,
      user.address,
      user.phone_number
    ];
    return fields.some((value) => {
      const normalized = String(value || '').trim().toLowerCase();
      return !normalized || normalized === 'n/a';
    });
  };
  const hasProfileAlert = Boolean(currentUser && isProfileIncomplete(currentUser));

  useEffect(() => {
    const token = localStorage.getItem('skillable_token');
    if (!token) { setAuthLoading(false); return; }
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCurrentUser(data);
        setAuthLoading(false);
      })
      .catch(() => { setAuthLoading(false); });
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
    if (!currentUser?.email) {
      setShowPersonalizeHint(false);
      return;
    }
    const key = `skillable_personalize_hint_seen_${currentUser.email.toLowerCase()}`;
    const seen = localStorage.getItem(key) === 'true';
    if (!seen && isProfileIncomplete(currentUser)) {
      setShowPersonalizeHint(true);
      return;
    }
    setShowPersonalizeHint(false);
  }, [currentUser]);

  const dismissPersonalizeHint = () => {
    if (currentUser?.email) {
      const key = `skillable_personalize_hint_seen_${currentUser.email.toLowerCase()}`;
      localStorage.setItem(key, 'true');
    }
    setShowPersonalizeHint(false);
  };

  useEffect(() => {
    if (isProfileOpen) {
      setTimeout(() => signOutButtonRef.current?.focus(), 0);
    }
  }, [isProfileOpen]);

  const handleSignOut = () => {
    localStorage.removeItem('skillable_token');
    setCurrentUser(null);
    setIsProfileOpen(false);
    setShowPersonalizeHint(false);
    setActiveTab('home');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme.appBg} ${theme.textPrimary}`} style={{ fontSize: `${fontSize}%` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Inter:wght@300;400;600;700;800&display=swap');
        :root { font-family: ${lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif"}; }
      `}</style>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg">
        {t('accessibility.skipToMain')}
      </a>

      {/* Dynamic Background Blobs */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${theme.blob}`} aria-hidden="true">
         <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-purple-500/30 blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-500/30 blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Accessibility Bar */}
      <div className={`relative z-50 px-6 py-2 flex justify-between items-center text-xs font-bold border-b transition-colors ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black border-black' : (themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500')}`}>
        <div className="flex items-center gap-2"><Accessibility size={14} aria-hidden="true" /><span>{t('accessibility.quickTools')}</span></div>
        <div className="flex items-center gap-4">
          <button onClick={activateHighContrast} className="hover:text-indigo-500 flex items-center gap-1"><Eye size={14} aria-hidden="true" /> {t('accessibility.contrast')}</button>
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
            <Volume2 size={14} aria-hidden="true" /> {t('accessibility.speakFocus')} {speakOnFocus ? t('accessibility.on') : t('accessibility.off')}
          </button>
          {!speechEnabled && (
            <button
              onClick={() => {
                setSpeechEnabled(true);
                speakText('Speech enabled');
              }}
              className="hover:text-indigo-500 flex items-center gap-1"
            >
              {t('accessibility.enableSpeech')}
            </button>
          )}
          <button
            onClick={() => setReducedMotion((prev) => !prev)}
            className="hover:text-indigo-500 flex items-center gap-1"
            aria-pressed={reducedMotion}
          >
            {reducedMotion ? t('accessibility.reduceMotionOn') : t('accessibility.reduceMotionOff')}
          </button>
          <div className="flex gap-1"><button onClick={decreaseFont} className="px-2">A-</button><button onClick={increaseFont} className="px-2">A+</button></div>
          <button
            onClick={toggleLanguage}
            className="hover:text-indigo-500 flex items-center gap-1 border rounded px-2 py-0.5"
            aria-label="Toggle language"
          >
            <Languages size={13} aria-hidden="true" /> {t('language.toggle')}
          </button>
        </div>
      </div>

      <TopNav
        theme={theme}
        themeMode={themeMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setIsProfileOpen={setIsProfileOpen}
        isProfileOpen={isProfileOpen}
        currentUser={currentUser}
        authLoading={authLoading}
        profileRef={profileRef}
        profileButtonRef={profileButtonRef}
        signOutButtonRef={signOutButtonRef}
        handleSignOut={handleSignOut}
        toggleTheme={toggleTheme}
        showPersonalizeHint={showPersonalizeHint}
        dismissPersonalizeHint={dismissPersonalizeHint}
        hasProfileAlert={hasProfileAlert}
      />

      {/* --- PAGE SWITCHER --- */}
      <main id="main-content">
        <Routes>
          <Route path="/" element={
            <HomePage
              theme={theme}
              themeMode={themeMode}
              simplifyInput={simplifyInput}
              setSimplifyInput={setSimplifyInput}
              simplifiedText={simplifiedText}
              isSimplifying={isSimplifying}
              handleSimplify={handleSimplify}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              isChatLoading={isChatLoading}
              handleChatSend={handleChatSend}
              chatEndRef={chatEndRef}
              setActiveTab={setActiveTab}
            />
          } />
          <Route path="/careers" element={
            <CareersPage
              theme={theme}
              themeMode={themeMode}
              currentUser={currentUser}
              onSelectJob={(job) => {
                setSelectedJob(job);
                setActiveTab('job-details');
              }}
            />
          } />
          <Route path="/open-roles" element={
            <OpenRolesPage
              theme={theme}
              themeMode={themeMode}
              API_BASE={API_BASE}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              onSelectRole={(role) => {
                setSelectedOpenRole(role);
                setActiveTab('open-role-details');
              }}
            />
          } />
          <Route path="/open-role-details" element={
            <OpenRoleDetailPage
              theme={theme}
              themeMode={themeMode}
              API_BASE={API_BASE}
              currentUser={currentUser}
              role={selectedOpenRole}
            />
          } />
          <Route path="/open-roles/:roleId/apply" element={
            <OpenRoleApplyPage
              theme={theme}
              themeMode={themeMode}
              API_BASE={API_BASE}
              currentUser={currentUser}
            />
          } />
          <Route path="/job-details" element={
            <JobDetailsPage
              theme={theme}
              themeMode={themeMode}
              job={selectedJob}
              setActiveTab={setActiveTab}
              onEnroll={(job) => {
                if (!job) return;
                setLearningPlans((prev) => {
                  const exists = prev.find((p) => p.jobtitle === job.jobtitle);
                  if (exists) return prev;
                  const next = [
                    ...prev,
                    {
                      jobtitle: job.jobtitle,
                      summary: job.summary || '',
                      details: job.details || '',
                      roadmap: job.roadmap || [],
                      videos: job.videos || [],
                      sources: job.sources || [],
                      progress: (job.roadmap || []).map(() => false)
                    }
                  ];
                  persistLearningPlans(next);
                  return next;
                });
                setActiveTab('dashboard');
              }}
            />
          } />
          <Route path="/dashboard" element={
            <DashboardPage
              theme={theme}
              themeMode={themeMode}
              learningPlans={learningPlans}
              setSelectedPlanIndex={setSelectedPlanIndex}
              setActiveTab={setActiveTab}
            />
          } />
          <Route path="/post-job" element={
            authLoading ? (
              <div className="py-16 px-6 max-w-3xl mx-auto">
                <div className={`p-8 rounded-3xl ${theme.card}`}>
                  <p className={`text-sm font-bold ${theme.textSecondary}`}>{t('postJob.checkingAccess')}</p>
                </div>
              </div>
            ) : !currentUser ? (
              <Navigate to="/login" replace />
            ) : currentUser.role !== 'job_poster' && currentUser.role !== 'admin' ? (
              <Navigate to="/open-roles" replace />
            ) : (
              <PostJobPage
                theme={theme}
                themeMode={themeMode}
                API_BASE={API_BASE}
                currentUser={currentUser}
                setActiveTab={setActiveTab}
              />
            )
          } />
          <Route path="/skill-detail" element={
            <SkillDetailPage
              theme={theme}
              themeMode={themeMode}
              plan={selectedPlanIndex !== null ? learningPlans[selectedPlanIndex] : null}
              planIndex={selectedPlanIndex}
              onBack={() => setActiveTab('dashboard')}
              onToggleStep={(planIndex, stepIndex, checked) => {
                setLearningPlans((prev) => {
                  const next = [...prev];
                  const updated = { ...next[planIndex] };
                  const progress = [...updated.progress];
                  progress[stepIndex] = checked;
                  updated.progress = progress;
                  next[planIndex] = updated;
                  persistLearningPlans(next);
                  return next;
                });
              }}
            />
          } />
          <Route path="/onboarding" element={
            <OnboardingPage theme={theme} themeMode={themeMode} setActiveTab={setActiveTab} API_BASE={API_BASE} />
          } />
          <Route path="/tracks" element={
            <TracksPage theme={theme} themeMode={themeMode} API_BASE={API_BASE} />
          } />
          <Route path="/tracks/:trackId" element={
            <TrackDetailPage theme={theme} themeMode={themeMode} currentUser={currentUser} API_BASE={API_BASE} />
          } />
          <Route path="/accessibility-features" element={
            <AccessibilityFeaturesPage theme={theme} themeMode={themeMode} />
          } />
          <Route path="/accessibility-statement" element={
            <AccessibilityStatementPage theme={theme} themeMode={themeMode} />
          } />
          <Route path="/cv-generator" element={
            currentUser ? (
              <CreateCVPage
                theme={theme}
                themeMode={themeMode}
                currentUser={currentUser}
              />
            ) : (
              <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className={`p-8 rounded-[2rem] ${theme.card}`}>
                  <h1 className="text-3xl font-black mb-3">{t('cv.signInRequired')}</h1>
                  <p className={`mb-6 ${theme.textSecondary}`}>
                    {t('cv.signInBody')}
                  </p>
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`px-6 py-3 rounded-xl font-bold ${theme.primaryBtn}`}
                  >
                    {t('cv.goToSignIn')}
                  </button>
                </div>
              </div>
            )
          } />
          <Route path="/profile" element={
            <ProfilePage
              theme={theme}
              themeMode={themeMode}
              API_BASE={API_BASE}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              speakOnFocus={speakOnFocus}
              speechEnabled={speechEnabled}
              speakText={speakText}
            />
          } />
          <Route path="/login" element={
            <AuthPage
              variant="login"
              theme={theme}
              themeMode={themeMode}
              API_BASE={API_BASE}
              CODE_API={CODE_API}
              OAUTH_REDIRECT_URI={OAUTH_REDIRECT_URI}
              setActiveTab={setActiveTab}
              setCurrentUser={setCurrentUser}
              setLearningPlans={setLearningPlans}
              speakOnFocus={speakOnFocus}
              speechEnabled={speechEnabled}
              speakText={speakText}
            />
          } />
          <Route path="/register" element={
            <AuthPage
              variant="register"
              theme={theme}
              themeMode={themeMode}
              API_BASE={API_BASE}
              CODE_API={CODE_API}
              OAUTH_REDIRECT_URI={OAUTH_REDIRECT_URI}
              setActiveTab={setActiveTab}
              setCurrentUser={setCurrentUser}
              setLearningPlans={setLearningPlans}
              speakOnFocus={speakOnFocus}
              speechEnabled={speechEnabled}
              speakText={speakText}
            />
          } />
          <Route path="*" element={
            <HomePage
              theme={theme}
              themeMode={themeMode}
              simplifyInput={simplifyInput}
              setSimplifyInput={setSimplifyInput}
              simplifiedText={simplifiedText}
              isSimplifying={isSimplifying}
              handleSimplify={handleSimplify}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              isChatLoading={isChatLoading}
              handleChatSend={handleChatSend}
              chatEndRef={chatEndRef}
              setActiveTab={setActiveTab}
            />
          } />
        </Routes>
      </main>

      {location.pathname !== '/onboarding' && <Footer theme={theme} themeMode={themeMode} setActiveTab={setActiveTab} />}

    </div>
  );
}
