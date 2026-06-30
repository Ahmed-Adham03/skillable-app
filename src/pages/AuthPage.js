import React, { useEffect, useRef, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { User, Sparkles, CheckCircle, Users, Award, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { normalizeRole } from '../auth/roles';
import { saveAuthToken } from '../auth/session';

// Isolated component so useGoogleLogin only mounts when a clientId exists
function GoogleLoginButton({ onSuccess, onError, className }) {
  const googleLogin = useGoogleLogin({ flow: 'implicit', onSuccess, onError });
  return (
    <button type="button" onClick={() => googleLogin()} aria-label="Sign in with Google" className={className}>
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8v5.6h7.3c4.3-3.9 6.9-9.7 6.9-16.4z"/>
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.6c-2.2 1.5-5 2.3-8.6 2.3-6.6 0-12.2-4.5-14.2-10.5H2.3v5.8C6.3 42.8 14.6 48 24 48z"/>
        <path fill="#FBBC05" d="M9.8 28.4A14.9 14.9 0 0 1 9 24c0-1.5.3-3 .8-4.4v-5.8H2.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.3 10.8l7.5-6.4z"/>
        <path fill="#EA4335" d="M24 9.5c3.7 0 7 1.3 9.6 3.8l7.2-7.2C36.9 2.1 31.5 0 24 0 14.6 0 6.3 5.2 2.3 13.2l7.5 5.8C11.8 14 17.4 9.5 24 9.5z"/>
      </svg>
      Google
    </button>
  );
}

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
  const { t } = useTranslation();
  const isLogin = variant === 'login';
  const title = isLogin ? t('auth.welcomeBack') : t('auth.createAccount');
  const subtitle = isLogin ? t('auth.signInSubtitle') : t('auth.registerSubtitle');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountRole, setAccountRole] = useState('job_seeker');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState('credentials');
  const [codeInput, setCodeInput] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef([]);
  const [pendingToken, setPendingToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');

  const [socialError, setSocialError] = useState('');

  const getCodeServiceError = async (res, fallback) => {
    const data = await res.json().catch(() => ({}));
    if (res.status === 404) {
      return `Verification code endpoint was not found at ${CODE_API}. Make sure the authenticator API is running on that port, not another service.`;
    }
    return data.detail || fallback;
  };

  const handleSocialLogin = async (endpoint, body) => {
    setSocialError('');
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'Sign-in failed.');
      }
      const data = await res.json();
      saveAuthToken(data.access_token, keepSignedIn);
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const me = await meRes.json().catch(() => null);
      if (me) {
        setCurrentUser({ ...me, role: normalizeRole(me.role) });
        if (setLearningPlans) {
          fetch(`${API_BASE}/auth/learning-plans`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          })
            .then((r) => (r.ok ? r.json() : []))
            .then((plans) => setLearningPlans(Array.isArray(plans) ? plans : []))
            .catch(() => {});
        }
        setActiveTab('home');
      }
    } catch (err) {
      setSocialError(err.message || 'Social sign-in failed.');
    }
  };

  const hasGoogleClientId = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);

  const resetCodeInputs = () => setCodeInput(['', '', '', '', '', '']);

  const startPasswordReset = () => {
    setFormError('');
    setFormSuccess('');
    setFieldErrors({});
    resetCodeInputs();
    setResetPassword('');
    setResetConfirmPassword('');
    setStep('reset-email');
  };

  const returnToSignIn = () => {
    setFormError('');
    setFieldErrors({});
    setStep('credentials');
  };

  const validateNewPassword = (nextPassword, nextConfirmPassword) => {
    const hasMin = nextPassword.length >= 8;
    const hasSpecial = /[^A-Za-z0-9]/.test(nextPassword);
    const emailLower = (email || '').toLowerCase();
    const passwordLower = nextPassword.toLowerCase();
    const containsEmail = emailLower && passwordLower.includes(emailLower);

    if (!hasMin || !hasSpecial || containsEmail) {
      const messages = [];
      if (!hasMin) messages.push('at least 8 characters');
      if (!hasSpecial) messages.push('a special character');
      if (containsEmail) messages.push('not include your email');
      return `Password must contain ${messages.join(', ')}.`;
    }
    if (nextPassword !== nextConfirmPassword) return t('auth.passwordsMismatch');
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFieldErrors({});

    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      setFormError(t('auth.fieldRequired'));
      setFieldErrors({
        firstName: !isLogin && !firstName ? t('auth.firstNameRequired') : '',
        lastName: !isLogin && !lastName ? t('auth.lastNameRequired') : '',
        email: !email ? t('auth.emailRequired') : '',
        password: !password ? t('auth.passwordRequired') : ''
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
      setFormError(t('auth.passwordsMismatch'));
      setFieldErrors({ confirmPassword: t('auth.passwordsMismatch') });
      if (speakOnFocus && speechEnabled) {
        speakText('Passwords do not match.');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/initiate-register';
      const payload = isLogin
        ? { email, password }
        : { full_name: `${firstName} ${lastName}`.trim(), email, password, role: accountRole };

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
      if (!CODE_API) throw new Error('Code verification service is not configured.');

      // Both login and register: send the code from the frontend directly
      const sendRes = await fetch(`${CODE_API}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!sendRes.ok) {
        const message = await getCodeServiceError(sendRes, 'Could not send verification code. Try again.');
        throw new Error(message);
      }
      const sendData = await sendRes.json().catch(() => ({}));
      setResendCooldown(Number.isFinite(sendData.expires_in) ? sendData.expires_in : 300);

      if (isLogin) {
        setPendingToken(data.access_token);
      } else {
        setIsNewUser(true);
      }
      setStep('code');
      setFormSuccess(t('auth.codeSent'));
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

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFieldErrors({});
    if (!email) {
      setFormError(t('auth.emailRequired'));
      setFieldErrors({ email: t('auth.emailRequired') });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(res.status === 404 ? t('auth.emailNotRegistered') : (data.detail || t('auth.passwordResetSendFail')));
      }
      resetCodeInputs();
      setStep('reset-code');
      setFormSuccess(t('auth.passwordResetCodeSent'));
    } catch (err) {
      setFormError(err.message || t('auth.passwordResetSendFail'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetCodeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const code = codeInput.join('');
    if (code.length !== 6) {
      setFormError(t('auth.codeEnterSix'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password-reset/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || t('auth.codeInvalid'));
      setStep('reset-password');
      setFormSuccess(t('auth.passwordResetVerified'));
    } catch (err) {
      setFormError(err.message || t('auth.codeInvalid'));
      resetCodeInputs();
      setTimeout(() => codeRefs.current[0]?.focus(), 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetComplete = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFieldErrors({});
    const passwordError = validateNewPassword(resetPassword, resetConfirmPassword);
    if (passwordError) {
      setFormError(passwordError);
      setFieldErrors({
        password: passwordError,
        confirmPassword: resetPassword !== resetConfirmPassword ? t('auth.passwordsMismatch') : ''
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/password-reset/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: resetPassword })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || t('auth.passwordResetFail'));
      setPassword('');
      setResetPassword('');
      setResetConfirmPassword('');
      resetCodeInputs();
      setStep('credentials');
      setFormSuccess(t('auth.passwordChanged'));
    } catch (err) {
      setFormError(err.message || t('auth.passwordResetFail'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    const code = codeInput.join('');
    if (code.length !== 6) {
      setFormError(t('auth.codeEnterSix'));
      return;
    }
    try {
      let token = pendingToken;

      if (isNewUser) {
        // Registration: backend validates code AND creates the user atomically
        const res = await fetch(`${API_BASE}/auth/complete-register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const msg = data.detail || 'Invalid or expired code.';
          setFormError(msg || t('auth.codeInvalid'));
          setCodeInput(['', '', '', '', '', '']);
          setTimeout(() => codeRefs.current[0]?.focus(), 0);
          return;
        }
        const data = await res.json();
        token = data.access_token;
      } else {
        // Login: validate code via CODE_API
        const res = await fetch(`${CODE_API}/validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code })
        });
        const data = await res.json();
        if (!data.valid) {
          setFormError(t('auth.codeInvalid'));
          setCodeInput(['', '', '', '', '', '']);
          setTimeout(() => codeRefs.current[0]?.focus(), 0);
          return;
        }
      }

      saveAuthToken(token, keepSignedIn);
      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const me = await meRes.json().catch(() => null);
      if (me) {
        setCurrentUser({ ...me, role: normalizeRole(me.role) });
        if (setLearningPlans) {
          fetch(`${API_BASE}/auth/learning-plans`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then((res) => (res.ok ? res.json() : []))
            .then((plans) => setLearningPlans(Array.isArray(plans) ? plans : []))
            .catch(() => {});
        }
        setFormSuccess(t('auth.signedIn'));
        if (speakOnFocus && speechEnabled) speakText(t('auth.signedIn'));
        setActiveTab(isNewUser ? 'onboarding' : 'home');
      }
    } catch (err) {
      setFormError(t('auth.codeValidateFail'));
    }
  };

  const handleResend = async () => {
    if (!CODE_API || resendCooldown > 0) return;
    setFormError('');
    setFormSuccess('');
    try {
      const res = await fetch(`${CODE_API}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const message = await getCodeServiceError(res, t('auth.resendFail'));
        throw new Error(message);
      }
      const data = await res.json().catch(() => ({}));
      setResendCooldown(Number.isFinite(data.expires_in) ? data.expires_in : 300);
      setFormSuccess(t('auth.newCodeSent'));
    } catch (err) {
      setFormError(t('auth.resendFail'));
    }
  };

  useEffect(() => {
    if (codeInput.join('').length !== 6) return;
    if (step === 'code') handleCodeSubmit({ preventDefault: () => {} });
    if (step === 'reset-code') handlePasswordResetCodeSubmit({ preventDefault: () => {} });
  }, [codeInput]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== 'code') return;
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div className={`p-10 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${themeMode === 'contrast' ? 'border-[#FFFF00]' : 'bg-indigo-500/10 text-indigo-300'}`}>
              <User size={14} aria-hidden="true" />
              <span>{isLogin ? t('auth.memberAccess') : t('auth.newToSkillable')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">{title}</h1>
            <p className={`mb-8 ${theme.textSecondary}`}>{subtitle}</p>

            {step === 'reset-email' ? (
              <form className="space-y-5" onSubmit={handlePasswordResetRequest}>
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor={`${variant}-reset-email`}>{t('auth.emailAddress')}</label>
                  <input
                    id={`${variant}-reset-email`}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? `${variant}-reset-email-error` : undefined}
                    className={`w-full p-4 rounded-xl border ${theme.input}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {fieldErrors.email && (
                    <div id={`${variant}-reset-email-error`} className="text-xs text-red-500 font-semibold">
                      {fieldErrors.email}
                    </div>
                  )}
                </div>
                {formError && <div role="alert" className="text-sm text-red-500 font-semibold">{t('auth.errorPrefix')}{formError}</div>}
                {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}
                <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                  {isSubmitting ? t('auth.pleaseWait') : t('auth.sendResetCode')}
                </button>
                <button
                  type="button"
                  onClick={returnToSignIn}
                  className={`w-full py-3 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                >
                  {t('auth.backToSignIn')}
                </button>
              </form>
            ) : step === 'reset-code' ? (
              <form className="space-y-5" onSubmit={handlePasswordResetCodeSubmit}>
                <div className="space-y-3">
                  <label className="text-sm font-bold">{t('auth.passwordResetCode')}</label>
                  <div className="flex gap-3 justify-center">
                    {codeInput.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (codeRefs.current[i] = el)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border ${theme.input}`}
                        value={digit}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const next = [...codeInput];
                          next[i] = val;
                          setCodeInput(next);
                          if (val && i < 5) codeRefs.current[i + 1]?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !codeInput[i] && i > 0) {
                            codeRefs.current[i - 1]?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          const next = [...codeInput];
                          pasted.split('').forEach((ch, j) => { next[j] = ch; });
                          setCodeInput(next);
                          const focusIdx = Math.min(pasted.length, 5);
                          codeRefs.current[focusIdx]?.focus();
                        }}
                      />
                    ))}
                  </div>
                </div>
                {formError && <div role="alert" className="text-sm text-red-500 font-semibold">{t('auth.errorPrefix')}{formError}</div>}
                {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}
                <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                  {isSubmitting ? t('auth.pleaseWait') : t('auth.verifyCode')}
                </button>
                <button
                  type="button"
                  onClick={handlePasswordResetRequest}
                  className={`w-full py-3 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                >
                  {t('auth.resendCode')}
                </button>
              </form>
            ) : step === 'reset-password' ? (
              <form className="space-y-5" onSubmit={handlePasswordResetComplete}>
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor={`${variant}-new-password`}>{t('auth.newPassword')}</label>
                  <div className="relative">
                    <input
                      id={`${variant}-new-password`}
                      aria-invalid={Boolean(fieldErrors.password)}
                      aria-describedby={fieldErrors.password ? `${variant}-new-password-error` : undefined}
                      className={`w-full p-4 pr-24 rounded-xl border ${theme.input}`}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? t('auth.hide') : t('auth.show')}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                    >
                      {showPassword ? t('auth.hide') : t('auth.show')}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div id={`${variant}-new-password-error`} className="text-xs text-red-500 font-semibold">
                      {fieldErrors.password}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor={`${variant}-confirm-new-password`}>{t('auth.confirmNewPassword')}</label>
                  <div className="relative">
                    <input
                      id={`${variant}-confirm-new-password`}
                      aria-invalid={Boolean(fieldErrors.confirmPassword)}
                      aria-describedby={fieldErrors.confirmPassword ? `${variant}-confirm-new-password-error` : undefined}
                      className={`w-full p-4 pr-24 rounded-xl border ${theme.input}`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? t('auth.hide') : t('auth.show')}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                    >
                      {showConfirmPassword ? t('auth.hide') : t('auth.show')}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <div id={`${variant}-confirm-new-password-error`} className="text-xs text-red-500 font-semibold">
                      {fieldErrors.confirmPassword}
                    </div>
                  )}
                </div>
                {formError && <div role="alert" className="text-sm text-red-500 font-semibold">{t('auth.errorPrefix')}{formError}</div>}
                {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}
                <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                  {isSubmitting ? t('auth.pleaseWait') : t('auth.changePassword')}
                </button>
              </form>
            ) : step === 'code' ? (
              <form className="space-y-5" onSubmit={handleCodeSubmit}>
                <div className="space-y-3">
                  <label className="text-sm font-bold">{t('auth.authenticatorCode')}</label>
                  <div className="flex gap-3 justify-center">
                    {codeInput.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (codeRefs.current[i] = el)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border ${theme.input}`}
                        value={digit}
                        inputMode="numeric"
                        maxLength={1}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const next = [...codeInput];
                          next[i] = val;
                          setCodeInput(next);
                          if (val && i < 5) codeRefs.current[i + 1]?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !codeInput[i] && i > 0) {
                            codeRefs.current[i - 1]?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          const next = [...codeInput];
                          pasted.split('').forEach((ch, j) => { next[j] = ch; });
                          setCodeInput(next);
                          const focusIdx = Math.min(pasted.length, 5);
                          codeRefs.current[focusIdx]?.focus();
                        }}
                      />
                    ))}
                  </div>
                </div>
                {formError && <div role="alert" className="text-sm text-red-500 font-semibold">{t('auth.errorPrefix')}{formError}</div>}
                {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}
                <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                  {t('auth.verifyCode')}
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className={`w-full py-3 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'} ${resendCooldown > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {resendCooldown > 0 ? t('auth.resendCodeIn', { seconds: resendCooldown }) : t('auth.resendCode')}
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor={`${variant}-first-name`}>{t('auth.firstName')}</label>
                    <input
                      id={`${variant}-first-name`}
                      aria-invalid={Boolean(fieldErrors.firstName)}
                      aria-describedby={fieldErrors.firstName ? `${variant}-first-name-error` : undefined}
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
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
                    <label className="text-sm font-bold" htmlFor={`${variant}-last-name`}>{t('auth.lastName')}</label>
                    <input
                      id={`${variant}-last-name`}
                      aria-invalid={Boolean(fieldErrors.lastName)}
                      aria-describedby={fieldErrors.lastName ? `${variant}-last-name-error` : undefined}
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
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
                <label className="text-sm font-bold" htmlFor={`${variant}-email`}>{t('auth.emailAddress')}</label>
                <input
                  id={`${variant}-email`}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${variant}-email-error` : undefined}
                  className={`w-full p-4 rounded-xl border ${theme.input}`}
                  type="email"
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
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">{t('auth.accountType')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'job_seeker', label: t('auth.jobSeeker') },
                      { value: 'job_poster', label: t('auth.jobPoster') },
                    ].map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setAccountRole(role.value)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border transition ${accountRole === role.value ? theme.primaryBtn : themeMode === 'contrast' ? 'border-white' : 'border-slate-300'}`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold" htmlFor={`${variant}-password`}>{t('auth.password')}</label>
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
                    aria-label={showPassword ? t('auth.hide') : t('auth.show')}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                  >
                    {showPassword ? t('auth.hide') : t('auth.show')}
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
                  <label className="text-sm font-bold" htmlFor={`${variant}-confirm-password`}>{t('auth.confirmPassword')}</label>
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
                      aria-label={showConfirmPassword ? t('auth.hide') : t('auth.show')}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-70"
                    >
                      {showConfirmPassword ? t('auth.hide') : t('auth.show')}
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
                <label className="flex items-center gap-2 font-semibold" htmlFor={`${variant}-keep-signed-in`}>
                  <input
                    id={`${variant}-keep-signed-in`}
                    type="checkbox"
                    className="w-4 h-4 accent-indigo-500"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                  />
                  {t('auth.keepSignedIn')}
                </label>
                {isLogin && (
                  <button type="button" onClick={startPasswordReset} className={`font-bold ${theme.accent}`}>{t('auth.forgotPassword')}</button>
                )}
              </div>

              {formError && <div role="alert" className="text-sm text-red-500 font-semibold">{t('auth.errorPrefix')}{formError}</div>}
              {formSuccess && <div role="status" className="text-sm text-green-600 font-semibold">{formSuccess}</div>}

              <button type="submit" className={`w-full py-4 rounded-xl font-bold ${theme.primaryBtn}`}>
                {isSubmitting ? t('auth.pleaseWait') : (isLogin ? t('auth.signIn') : t('auth.createAccountBtn'))}
              </button>
            </form>
            )}

            {/* Social sign-in */}
            <div className="flex items-center gap-3 mt-6">
              <hr className={`flex-1 ${themeMode === 'contrast' ? 'border-white' : 'border-slate-300'}`} />
              <span className={`text-xs font-semibold ${theme.textSecondary}`}>{t('auth.orContinueWith')}</span>
              <hr className={`flex-1 ${themeMode === 'contrast' ? 'border-white' : 'border-slate-300'}`} />
            </div>

            <div className="mt-4">
              {/* Google */}
              {hasGoogleClientId ? (
                <GoogleLoginButton
                  onSuccess={(t) => handleSocialLogin('/auth/oauth/google', { id_token: t.access_token })}
                  onError={() => setSocialError('Google sign-in was cancelled or failed.')}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm transition-opacity hover:opacity-80 ${themeMode === 'contrast' ? 'border-white text-white' : 'border-slate-300 text-slate-700 bg-white'}`}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setSocialError('Google sign-in is not configured (missing REACT_APP_GOOGLE_CLIENT_ID).')}
                  aria-label="Sign in with Google (not configured)"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-sm opacity-50 cursor-not-allowed ${themeMode === 'contrast' ? 'border-white text-white' : 'border-slate-300 text-slate-700 bg-white'}`}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8v5.6h7.3c4.3-3.9 6.9-9.7 6.9-16.4z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.6c-2.2 1.5-5 2.3-8.6 2.3-6.6 0-12.2-4.5-14.2-10.5H2.3v5.8C6.3 42.8 14.6 48 24 48z"/>
                    <path fill="#FBBC05" d="M9.8 28.4A14.9 14.9 0 0 1 9 24c0-1.5.3-3 .8-4.4v-5.8H2.3A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.3 10.8l7.5-6.4z"/>
                    <path fill="#EA4335" d="M24 9.5c3.7 0 7 1.3 9.6 3.8l7.2-7.2C36.9 2.1 31.5 0 24 0 14.6 0 6.3 5.2 2.3 13.2l7.5 5.8C11.8 14 17.4 9.5 24 9.5z"/>
                  </svg>
                  Google
                </button>
              )}
            </div>

            {socialError && (
              <div role="alert" className="mt-3 text-sm text-red-500 font-semibold text-center">
                {socialError}
              </div>
            )}

            <div className="mt-6 text-sm text-center">
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              <button
                onClick={() => setActiveTab(isLogin ? 'register' : 'login')}
                className={`ml-2 font-bold ${theme.accent}`}
              >
                {isLogin ? t('auth.createOne') : t('auth.signInLink')}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-8 rounded-3xl ${theme.card}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${themeMode === 'contrast' ? 'bg-[#FFFF00]' : 'bg-indigo-600 text-white'}`}>
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <h2 className="text-xl font-black">{t('auth.whySkillable')}</h2>
              </div>
              <p className={theme.textSecondary}>
                {t('auth.whySubtitle')}
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { icon: <CheckCircle size={18} aria-hidden="true" />, text: t('auth.benefit1') },
                { icon: <Users size={18} aria-hidden="true" />, text: t('auth.benefit2') },
                { icon: <Award size={18} aria-hidden="true" />, text: t('auth.benefit3') }
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
                <span>{t('auth.quickTour')}</span>
              </div>
              <p className={theme.textSecondary}>{t('auth.quickTourBody')}</p>
              <button
                onClick={() => setActiveTab('home')}
                className={`mt-4 px-5 py-2.5 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
              >
                {t('auth.exploreAI')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
