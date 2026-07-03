import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Compass, GraduationCap, HeartHandshake, Rocket,
  Check, ArrowRight, ArrowLeft, ChevronRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAuthToken } from '../auth/session';

const QUESTIONS = [
  {
    index: 1,
    Icon: Briefcase,
    label: 'Employment',
    question: 'What is your current employment status?',
    options: [
      'Employed full-time',
      'Employed part-time',
      'Unemployed, seeking work',
      'Student',
      'Freelancer / Self-employed',
    ],
  },
  {
    index: 2,
    Icon: Compass,
    label: 'Field',
    question: 'What field are you looking to work in?',
    options: [
      'Technology & IT',
      'Healthcare & Medicine',
      'Education & Training',
      'Business & Finance',
      'Creative & Arts',
      'Engineering',
      'Customer Service',
    ],
  },
  {
    index: 3,
    Icon: GraduationCap,
    label: 'Education',
    question: 'What is your highest level of education?',
    options: [
      'High school diploma',
      "Bachelor's degree",
      "Master's degree",
      'Doctorate',
      'Vocational / Trade certification',
    ],
  },
  {
    index: 4,
    Icon: HeartHandshake,
    label: 'Accessibility',
    question: 'Do you have any accessibility needs?',
    options: [
      'None',
      'Mobility impairment',
      'Visual impairment',
      'Hearing impairment',
      'Cognitive / Learning disability',
      'Multiple disabilities',
      'Prefer not to say',
    ],
  },
  {
    index: 5,
    Icon: Rocket,
    label: 'Goals',
    question: 'What are your primary career goals?',
    options: [
      'Find my first job',
      'Change careers',
      'Advance in my current field',
      'Return to work after a break',
      'Improve my skills',
      'Start my own business',
    ],
  },
];

const STEP_COLORS = [
  { from: '#6366f1', to: '#8b5cf6' },
  { from: '#3b82f6', to: '#6366f1' },
  { from: '#06b6d4', to: '#3b82f6' },
  { from: '#10b981', to: '#06b6d4' },
  { from: '#f59e0b', to: '#ef4444' },
];

export default function OnboardingPage({ theme, themeMode, setActiveTab, API_BASE }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [direction, setDirection] = useState(1);
  const [selected, setSelected] = useState(null);
  const [completing, setCompleting] = useState(false);

  const token = getAuthToken();
  const current = QUESTIONS[currentStep];
  const colors = STEP_COLORS[currentStep];
  const isDark = themeMode === 'dark' || themeMode === 'contrast';
  const { t } = useTranslation();
  const totalSteps = QUESTIONS.length;

  useEffect(() => { setSelected(answers[currentStep]); }, [currentStep, answers]);

  const saveAnswer = (questionIndex, answer) => {
    if (!answer || !token) return;
    fetch(`${API_BASE}/info/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question_index: questionIndex, answer }),
    }).catch(() => {});
  };

  const advance = (chosenAnswer) => {
    if (chosenAnswer) {
      saveAnswer(current.index, chosenAnswer);
      const next = [...answers];
      next[currentStep] = chosenAnswer;
      setAnswers(next);
    }
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      setCompleting(true);
      setTimeout(() => setActiveTab('home'), 1000);
    }
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  const skipAll = () => {
    setCompleting(true);
    setTimeout(() => setActiveTab('home'), 600);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  if (completing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6"
            style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
          >
            <Check size={36} className="text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-4xl font-black mb-3">You're all set!</h2>
          <p className={theme.textSecondary}>Taking you to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>

      {/* Background orbs — behind everything */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`orb-top-${currentStep}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="pointer-events-none absolute"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.from}28 0%, transparent 70%)`,
            top: -100,
            right: -150,
          }}
        />
      </AnimatePresence>
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.to}18 0%, transparent 70%)`,
          bottom: 0,
          left: -80,
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Page content — starts below navbar naturally */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">

        {/* Progress bar + step pills */}
        <div className="mb-10">
          {currentStep === 0 && (
            <p className={`text-sm text-center mx-auto max-w-2xl px-4 py-3 rounded-xl border font-medium
              ${isDark ? 'border-slate-700 text-slate-300 bg-slate-800/50' : 'border-slate-200 text-slate-600 bg-white/50'}
            `}>
              {t('onboarding.description')}
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            {QUESTIONS.map((_, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <motion.div
                  key={i}
                  layout
                  animate={{ width: active ? 48 : done ? 24 : 14 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="h-1.5 rounded-full"
                  style={{
                    background: done
                      ? `linear-gradient(90deg, ${STEP_COLORS[i].from}, ${STEP_COLORS[i].to})`
                      : active
                      ? `linear-gradient(90deg, ${colors.from}, ${colors.to})`
                      : isDark ? '#1e293b' : '#e2e8f0',
                  }}
                />
              );
            })}
            <span className={`ml-auto text-xs font-bold tabular-nums ${theme.textSecondary}`}>
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Animated question */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Icon + label + question */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex items-center gap-3 mb-4"
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                >
                  <current.Icon size={18} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: colors.from }}>
                  {t(`onboarding.${current.label}`)}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl lg:text-4xl font-black leading-tight"
              >
                {t(`onboarding.${current.question}`)}
              </motion.h1>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {current.options.map((opt, i) => {
                const isSelected = selected === opt;
                return (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.28 }}
                    type="button"
                    onClick={() => {
                      setSelected(opt);
                      setTimeout(() => advance(opt), 240);
                    }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group flex items-center gap-4 px-5 py-4 rounded-2xl border text-left font-semibold text-sm transition-colors duration-200 overflow-hidden"
                    style={{
                      borderColor: isSelected ? colors.from : isDark ? '#1e293b' : '#e2e8f0',
                      background: isSelected
                        ? `linear-gradient(135deg, ${colors.from}22, ${colors.to}18)`
                        : isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(8px)',
                      color: isSelected ? colors.from : undefined,
                    }}
                  >
                    {!isSelected && (
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${colors.from}0a, ${colors.to}0a)` }}
                      />
                    )}
                    <motion.span
                      animate={isSelected
                        ? { background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, borderColor: 'transparent' }
                        : {}}
                      className="relative z-10 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                      style={{ borderColor: isDark ? '#334155' : '#cbd5e1' }}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Check size={10} className="text-white" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.span>
                    <span className="relative z-10 leading-snug">{t(`onboarding.${opt}`)}</span>
                    <ChevronRight
                      size={14}
                      className="relative z-10 ml-auto opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0"
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: Prev + Skip */}
              <div className="flex items-center gap-4">
                {currentStep > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    type="button"
                    onClick={goBack}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-colors
                      ${isDark ? 'border-slate-700 text-slate-300 hover:border-slate-500' : 'border-slate-200 text-slate-600 hover:border-slate-400'}`}
                  >
                    <ArrowLeft size={14} />
                    {t('onboarding.previous')}
                  </motion.button>
                )}
                <button
                  type="button"
                  onClick={currentStep === totalSteps - 1 ? skipAll : () => advance(null)}
                  className={`text-sm font-semibold transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {currentStep < totalSteps - 1 ? t('onboarding.skip') : t('onboarding.skip_finish')}
                </button>
              </div>

              {/* Right: Next/Finish */}
              <AnimatePresence>
                {selected && (
                  <motion.button
                    initial={{ opacity: 0, x: 16, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 16, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    type="button"
                    onClick={() => advance(selected)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                  >
                    {completing ? t('onboarding.submitting') : (currentStep < totalSteps - 1 ? t('onboarding.next') : t('onboarding.finish'))}
                    <ArrowRight size={15} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
