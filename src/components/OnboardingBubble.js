import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Sparkles } from 'lucide-react';

const QUESTIONS = [
  {
    index: 1,
    label: 'Employment',
    question: 'What is your current employment status?',
    options: ['Employed full-time', 'Employed part-time', 'Unemployed, seeking work', 'Student', 'Freelancer / Self-employed'],
  },
  {
    index: 2,
    label: 'Field',
    question: 'What field are you looking to work in?',
    options: ['Technology & IT', 'Healthcare & Medicine', 'Education & Training', 'Business & Finance', 'Creative & Arts', 'Engineering', 'Customer Service'],
  },
  {
    index: 3,
    label: 'Education',
    question: 'What is your highest level of education?',
    options: ['High school diploma', "Bachelor's degree", "Master's degree", 'Doctorate', 'Vocational / Trade certification'],
  },
  {
    index: 4,
    label: 'Accessibility',
    question: 'Do you have any accessibility needs?',
    options: ['None', 'Mobility impairment', 'Visual impairment', 'Hearing impairment', 'Cognitive / Learning disability', 'Multiple disabilities', 'Prefer not to say'],
  },
  {
    index: 5,
    label: 'Goals',
    question: 'What are your primary career goals?',
    options: ['Find my first job', 'Change careers', 'Advance in my current field', 'Return to work after a break', 'Improve my skills', 'Start my own business'],
  },
];

export default function OnboardingBubble({
  theme,
  themeMode,
  lang,
  status,
  onAnswer,
  onOpenFull,
}) {
  const [open, setOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const completed = status?.completed || 0;
  const total = status?.total || QUESTIONS.length;
  const isRtl = lang === 'ar';
  const isContrast = themeMode === 'contrast';
  const isDark = themeMode === 'dark';

  const nextQuestion = useMemo(
    () => QUESTIONS.find((question) => !(status?.answers || {})[String(question.index)]),
    [status]
  );

  if (!nextQuestion || completed >= total) return null;

  const answerQuestion = async (answer) => {
    if (saving) return;
    setSaving(true);
    try {
      await onAnswer(nextQuestion.index, answer);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`fixed z-[62] bottom-5 ${isRtl ? 'right-4 sm:right-5' : 'left-4 sm:left-5'} w-[calc(100vw-2rem)] max-w-sm`}>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.section
            key="panel"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className={`rounded-2xl overflow-hidden shadow-2xl border ${isContrast ? 'bg-black text-[#FFFF00] border-[#FFFF00]' : isDark ? 'bg-slate-950/95 text-white border-white/10' : 'bg-white/95 text-slate-900 border-slate-200'} backdrop-blur-xl`}
            role="status"
            aria-live="polite"
          >
            <div className={`px-4 py-3 flex items-center gap-3 ${isContrast ? 'border-b border-[#FFFF00]' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isContrast ? 'bg-[#FFFF00] text-black' : 'bg-white/15 text-white'}`}>
                <Sparkles size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black truncate">Finish your setup</p>
                <p className={`text-xs font-semibold ${isContrast ? 'text-[#FFFF00]' : 'text-white/75'}`}>{completed}/{total} answered</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isContrast ? 'border border-[#FFFF00]' : 'hover:bg-white/15'}`}
                aria-label="Minimize setup questions"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className={`text-[11px] font-black uppercase tracking-widest ${theme.textSecondary}`}>{nextQuestion.label}</span>
                <span className={`text-[11px] font-black ${isContrast ? 'text-[#FFFF00]' : 'text-indigo-500'}`}>Question {nextQuestion.index}</span>
              </div>
              <p className="text-sm font-black leading-snug mb-3">{nextQuestion.question}</p>

              <div className="grid gap-2 max-h-56 overflow-y-auto pr-1">
                {nextQuestion.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={saving}
                    onClick={() => answerQuestion(option)}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-bold border transition disabled:opacity-60 ${isContrast ? 'border-[#FFFF00] hover:bg-[#FFFF00] hover:text-black' : isDark ? 'border-white/10 bg-white/5 hover:border-indigo-300' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onOpenFull}
                className={`mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black ${theme.primaryBtn}`}
              >
                <Check size={14} />
                Open full setup
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.button
            key="button"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl border font-black text-sm ${isContrast ? 'bg-[#FFFF00] text-black border-black' : isDark ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'}`}
          >
            <Sparkles size={16} />
            Setup {completed}/{total}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
