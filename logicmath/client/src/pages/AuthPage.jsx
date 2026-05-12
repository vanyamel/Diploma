import React, { useState, useEffect } from 'react';
import useAuthStore from '../shared/useAuthStore';
import { authApi } from '../shared/api';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [successMsg, setSuccessMsg] = useState(null);
  const { login, register, loading, error, clearError } = useAuthStore();

  useEffect(() => { clearError(); }, [mode]);

  const handleModeSwitch = (m) => {
    setMode(m);
    setSuccessMsg(null);
    clearError();
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccessMsg(null);
    useAuthStore.setState({ error: null });
    
    if (mode === 'forgot') {
      try {
        useAuthStore.setState({ loading: true });
        const res = await authApi.forgotPassword(form.email);
        setSuccessMsg(res.data.message);
      } catch (err) {
        useAuthStore.setState({ error: err.response?.data?.error || 'Помилка' });
      } finally {
        useAuthStore.setState({ loading: false });
      }
      return;
    }

    let ok;
    if (mode === 'login') {
      ok = await login(form.email, form.password);
    } else {
      ok = await register(form.email, form.username, form.password);
      if (ok?.requiresVerification) {
        setSuccessMsg('Реєстрація майже завершена! На ваш email надіслано лист для верифікації.');
        setMode('login');
        return;
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4 relative">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            LogicMath
          </h1>
          <p className="text-slate-500 text-sm mt-1">Інтерактивна математична платформа</p>
        </div>

        {/* Box */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {/* Switch mode */}
          {mode !== 'forgot' && (
            <div className="flex bg-slate-900/60 rounded-xl p-1 mb-7">
              {[['login','Вхід'],['register','Реєстрація']].map(([m, label]) => (
                <button key={m} type="button" onClick={() => handleModeSwitch(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === m
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {mode === 'forgot' && (
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Відновлення пароля</h2>
              <p className="text-sm text-slate-400">Введіть email, і ми надішлемо інструкції</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-slate-900/80 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
              />
            </div>

            {/* Username( register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Нікнейм</label>
                <input
                  name="username" type="text" required minLength={3} maxLength={20}
                  value={form.username} onChange={handleChange}
                  placeholder="MathWizard"
                  className="w-full bg-slate-900/80 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
              </div>
            )}

            {/* Password */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Пароль</label>
                <input
                  name="password" type="password" required minLength={6}
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-600 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
                
                {mode === 'login' && (
                  <div className="flex justify-end mt-2">
                    <button type="button" onClick={() => handleModeSwitch('forgot')}
                      className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors">
                      Забули пароль?
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5">📧</span><span>{successMsg}</span>
              </div>
            )}

            {/* Failure */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                <span className="mt-0.5">⚠️</span><span>{error}</span>
              </div>
            )}

            {/* Button */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Зачекайте...
                </span>
              ) : (
                mode === 'login' ? '🚀 Увійти' : mode === 'register' ? '✨ Зареєструватися' : '📨 Надіслати лист'
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-slate-600 text-xs mt-5">
            {mode === 'login'
              ? 'Не маєш акаунту? '
              : mode === 'register' ? 'Вже є акаунт? ' : 'Згадали пароль? '}
            <button type="button" onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              {mode === 'login' ? 'Зареєструватися' : 'Увійти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
