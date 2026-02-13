import React from 'react';
import {
  Bot,
  Briefcase,
  Sparkles,
  Globe,
  Zap,
  Send
} from 'lucide-react';

export default function HomePage({
  theme,
  themeMode,
  simplifyInput,
  setSimplifyInput,
  simplifiedText,
  isSimplifying,
  handleSimplify,
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  handleChatSend,
  chatEndRef,
  setActiveTab
}) {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <header className="relative pt-16 pb-32 lg:pt-32 lg:pb-48 overflow-hidden z-10">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}><Sparkles size={14} aria-hidden="true" /><span>AI for serving humanity</span></div>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">Discover your power <br/><span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeMode === 'contrast' ? 'from-[#FFFF00]' : 'from-indigo-600 to-pink-500'}`}>Professional potential</span></h1>
            <p className={`text-lg lg:text-xl mb-10 max-w-2xl ${theme.textSecondary}`}><b>Skillable</b> is your gateway to the future. We use Gemini AI to design career paths that adapt to your abilities.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' })} className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 ${theme.primaryBtn}`}><Bot size={20} aria-hidden="true" /> Smart Assistant</button>
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
              <button onClick={handleSimplify} className={`px-8 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>{isSimplifying ? 'Processing...' : 'Simplify'}</button>
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
  );
}
