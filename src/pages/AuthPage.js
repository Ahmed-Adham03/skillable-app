import React, { useState } from 'react';
import { User, Sparkles, CheckCircle, Users, Award, Bot } from 'lucide-react';

export default function AuthPage({
  variant,
  theme,
  themeMode,
  API_BASE,
  setActiveTab,
  setCurrentUser,
  setLearningPlans,
  CODE_API,
  speakOnFocus,
  speechEnabled,
  speakText
}) {
  const isLogin = variant === 'login';
  const title = isLogin ? 'Welcome back' : 'Create your account';
  const subtitle = isLogin
    ? 'Sign in to keep building a career path that fits you.'
    : 'Join Skillable to get personalized, accessible guidance.';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState('credentials');
  const [codeInput, setCodeInput] = useState('');
  const [pendingToken, setPendingToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFieldErrors({});

    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      setFormError('Please complete all required fields.');
      setFieldErrors({
        firstName: !isLogin && !firstName ? 'First name is required.' : '',
        lastName: !isLogin && !lastName ? 'Last name is required.' : '',
        email: !email ? 'Email address is required.' : '',
        password: !password ? 'Password is required.' : ''
      });
      if (speakOnFocus && speechEnabled) {
        speakText('A required field is missing. Please complete all required fields.');
      }
      return;
    }
    if (!isLogin) {
      const hasMin = password.length >= 8;
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      const emailLower = (email || '').toLowerCase();
      const passwordLower = password.toLowerCase();
      const containsEmail = emailLower && passwordLower.includes(emailLower);

      if (!hasMin || !hasSpecial || containsEmail) {
        const messages = [];
        if (!hasMin) messages.push('at least 8 characters');
        if (!hasSpecial) messages.push('a special character');
        if (containsEmail) messages.push('not include your email');
        const message = `Password must contain ${messages.join(', ')}.`;
        setFormError(message);
        setFieldErrors({ password: message });
        if (speakOnFocus && speechEnabled) {
          speakText(message);
        }
        return;
      }
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
        : { full_name: `${firstName} ${lastName}`.trim(), email, password };

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
        setPendingToken(data.access_token);
        setStep('code');
        setFormSuccess('Enter the 6-digit code to finish sign in.');
        return;
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

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!codeInput.trim() || codeInput.trim().length !== 6) {
      setFormError('Enter the 6-digit code.');
      return;
    }
    try {
      const res = await fetch(`${CODE_API}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput.trim() })
      });
      const data = await res.json();
      if (!data.valid) {
        setFormError('Invalid or expired code.');
        return;
      }
      localStorage.setItem('skillable_token', pendingToken);
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${pendingToken}` }
      });
      const me = await meRes.json().catch(() => null);
      if (me) {
        setCurrentUser(me);
        if (setLearningPlans) {
          fetch(`${API_BASE}/auth/learning-plans`, {
            headers: { Authorization: `Bearer ${pendingToken}` }
          })
            .then((res) => (res.ok ? res.json() : []))
            .then((plans) => setLearningPlans(Array.isArray(plans) ? plans : []))
            .catch(() => {});
        }
        setFormSuccess('Signed in successfully.');
        if (speakOnFocus && speechEnabled) {
          speakText('Signed in successfully');
        }
        setActiveTab('home');
      }
    } catch (err) {
      setFormError('Unable to validate code.');
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

            {isLogin && step === 'code' ? (
              <form className="space-y-5" onSubmit={handleCodeSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor="login-code">Authenticator code</label>
                  <input
                    id="login-code"
                    className={`w-full p-4 rounded-xl border ${theme.input}`}
                    placeholder="6-digit code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.replace(/\D+/g, '').slice(0, 6))}
                    inputMode="numeric"
                    maxLength={6}
                  />
                </div>
                {formError && <div role="alert" className="text-sm text-red-500 font-semibold">Error: {formError}</div>}
                {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}
                <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                  Verify code
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor={`${variant}-first-name`}>First name</label>
                    <input
                      id={`${variant}-first-name`}
                      aria-invalid={Boolean(fieldErrors.firstName)}
                      aria-describedby={fieldErrors.firstName ? `${variant}-first-name-error` : undefined}
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      placeholder="Alex"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value.replace(/\s+/g, ''))}
                    />
                    {fieldErrors.firstName && (
                      <div id={`${variant}-first-name-error`} className="text-xs text-red-500 font-semibold">
                        {fieldErrors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor={`${variant}-last-name`}>Last name</label>
                    <input
                      id={`${variant}-last-name`}
                      aria-invalid={Boolean(fieldErrors.lastName)}
                      aria-describedby={fieldErrors.lastName ? `${variant}-last-name-error` : undefined}
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      placeholder="Morgan"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value.replace(/\s+/g, ''))}
                    />
                    {fieldErrors.lastName && (
                      <div id={`${variant}-last-name-error`} className="text-xs text-red-500 font-semibold">
                        {fieldErrors.lastName}
                      </div>
                    )}
                  </div>
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
            )}

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
