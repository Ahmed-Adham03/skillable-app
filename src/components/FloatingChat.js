import React, { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
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
}) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ block: 'end' });
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
            className={`mb-4 w-[calc(100vw-2.5rem)] max-w-[24rem] h-[32rem] max-h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl flex flex-col border ${themeMode === 'dark' ? 'bg-slate-950 border-white/10' : themeMode === 'contrast' ? 'bg-black border-2 border-[#FFFF00]' : 'bg-white border-slate-200'}`}
            role="dialog"
            aria-label={t('home.aiTitle')}
          >
            <header className={`px-4 py-3 flex items-center gap-3 border-b ${themeMode === 'dark' ? 'border-white/10' : themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${themeMode === 'contrast' ? 'bg-[#FFFF00] text-black' : 'bg-indigo-600 text-white'}`}>
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate">{t('home.aiTitle')}</p>
                <p className={`text-xs font-semibold ${theme.textSecondary}`}>{t('home.aiOnline')}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`ml-auto w-9 h-9 rounded-full flex items-center justify-center ${themeMode === 'contrast' ? 'border border-[#FFFF00]' : themeMode === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
                aria-label="Close chat"
              >
                <X size={17} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chatMessages.length === 0 && !isChatLoading && (
                <div className="h-full flex items-center justify-center text-center">
                  <p className={`text-sm max-w-[14rem] leading-relaxed ${theme.textSecondary}`}>
                    {t('home.aiEmptyMsg')}
                  </p>
                </div>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}>
                  <div
                    dir="auto"
                    className={`px-4 py-3 rounded-2xl max-w-[86%] text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'bot'
                      ? themeMode === 'dark' ? 'bg-white/10' : themeMode === 'contrast' ? 'border border-white' : 'bg-slate-100'
                      : 'bg-indigo-600 text-white'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className={`px-4 py-3 rounded-2xl ${themeMode === 'dark' ? 'bg-white/10' : themeMode === 'contrast' ? 'border border-white' : 'bg-slate-100'}`}>
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

            <div className={`p-3 border-t flex gap-2 ${themeMode === 'dark' ? 'border-white/10' : themeMode === 'contrast' ? 'border-[#FFFF00]' : 'border-slate-100'}`}>
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
                className={`min-w-0 flex-1 px-4 py-3 rounded-2xl text-sm outline-none border ${theme.input}`}
              />
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
          </motion.section>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl ${theme.primaryBtn}`}
          aria-label="Open Skillable AI chat"
          aria-expanded={open}
        >
          <MessageCircle size={23} />
        </button>
      )}
    </div>
  );
}
