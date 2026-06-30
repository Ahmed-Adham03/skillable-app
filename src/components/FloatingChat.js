import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Mic, Send, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function FloatingChat({
  theme,
  themeMode,
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  handleChatSend,
  isVoiceListening,
  isVoiceSupported,
  voiceError,
  toggleVoiceInput,
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!open) return;
    const container = endRef.current?.parentElement;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, open]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(id);
  }, [open]);

  return (
    <div className={`fixed z-[70] bottom-4 sm:bottom-5 ${isRtl ? 'left-4 sm:left-5' : 'right-4 sm:right-5'}`}>
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`mb-4 w-[calc(100vw-2rem)] sm:w-[28rem] h-[min(40rem,calc(100vh-7rem))] rounded-[1.75rem] overflow-hidden shadow-[0_28px_80px_rgba(15,23,42,0.32)] flex flex-col border backdrop-blur-xl ${themeMode === 'dark' ? 'bg-slate-950/95 border-white/10' : themeMode === 'contrast' ? 'bg-black border-2 border-[#FFFF00]' : 'bg-white/95 border-slate-200'}`}
            role="dialog"
            aria-label={t('home.aiTitle')}
          >
            <header className={`px-4 py-4 flex items-center gap-3 border-b ${themeMode === 'contrast' ? 'border-[#FFFF00] bg-black' : 'border-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white'}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-white/16 text-white ring-1 ring-white/25'}`}>
                <Bot size={19} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black truncate">{t('home.aiTitle')}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-white/16 text-white'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    {t('home.aiOnline')}
                  </span>
                </div>
                <p className={`text-xs font-semibold truncate ${themeMode === 'contrast' ? 'text-[#FFFF00]' : 'text-white/72'}`}>{t('home.aiSubtitle')}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${themeMode === 'contrast' ? 'border border-[#FFFF00]' : 'hover:bg-white/15'}`}
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </header>

            <div className={`flex-1 overflow-y-auto px-4 py-5 space-y-3 ${themeMode === 'dark' ? 'bg-slate-950' : themeMode === 'contrast' ? 'bg-black' : 'bg-slate-50/90'}`}>
              {chatMessages.length === 0 && !isChatLoading && (
                <div className="h-full flex items-center justify-center text-center">
                  <div className={`max-w-[18rem] p-5 rounded-3xl border ${themeMode === 'dark' ? 'bg-white/5 border-white/10' : themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className={`mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                      <Sparkles size={18} />
                    </div>
                    <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
                    {t('home.aiEmptyMsg')}
                    </p>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    dir="auto"
                    className={`px-4 py-3 rounded-2xl max-w-[86%] text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'bot'
                      ? themeMode === 'dark' ? 'bg-white/10 border border-white/10' : themeMode === 'contrast' ? 'border border-white' : 'bg-white border border-slate-100 text-slate-800'
                      : themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${themeMode === 'dark' ? 'bg-white/10 border border-white/10' : themeMode === 'contrast' ? 'border border-white' : 'bg-white border border-slate-100'}`}>
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className={`p-3 border-t flex gap-2 ${themeMode === 'dark' ? 'bg-slate-950 border-white/10' : themeMode === 'contrast' ? 'bg-black border-[#FFFF00]' : 'bg-white border-slate-100'}`}>
              <input
                ref={inputRef}
                dir="auto"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isChatLoading) {
                    e.preventDefault();
                    handleChatSend();
                  }
                }}
                disabled={isChatLoading}
                placeholder={t('home.aiPlaceholder')}
                className={`min-w-0 flex-1 px-4 py-3 rounded-2xl text-sm outline-none border shadow-inner ${theme.input}`}
              />
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={!isVoiceSupported || isChatLoading}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isVoiceListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : themeMode === 'dark' ? 'border-white/10 hover:bg-white/10' : themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-200 hover:bg-slate-50'} ${!isVoiceSupported || isChatLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isVoiceListening ? 'Stop voice input' : 'Start voice input'}
                title={isVoiceSupported ? (isVoiceListening ? 'Recording...' : 'Voice input') : 'Voice input is not supported in this browser'}
              >
                <Mic size={16} />
              </button>
              <button
                type="button"
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-opacity ${isChatLoading || !chatInput.trim() ? 'opacity-50 cursor-not-allowed' : ''} ${theme.primaryBtn}`}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            {(isVoiceListening || voiceError) && (
              <div className={`px-4 pb-3 -mt-1 text-xs font-bold ${isVoiceListening ? 'text-red-500' : 'text-amber-500'}`}>
                {isVoiceListening ? 'Recording and transcribing... Arabic or English works.' : voiceError}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:-translate-y-1 ${theme.primaryBtn}`}
          aria-label="Open Skillable AI chat"
          aria-expanded={open}
        >
          <MessageCircle size={23} />
          <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${themeMode === 'dark' ? 'border-slate-950 bg-emerald-400' : themeMode === 'contrast' ? 'border-black bg-[#FFFF00]' : 'border-white bg-emerald-400'}`} />
        </button>
      )}
    </div>
  );
}
