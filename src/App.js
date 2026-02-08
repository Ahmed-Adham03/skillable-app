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
            <button className={`px-6 py-2.5 rounded-xl font-bold ${theme.primaryBtn}`}>Get Started</button>
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
      ) : (
        <CareersPage theme={theme} themeMode={themeMode} />
      )}

      <footer className={`py-12 border-t text-center opacity-50 ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200'}`}>© 2026 Skillable - Empowering Abilities</footer>
    </div>
  );
}