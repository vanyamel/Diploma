import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../shared/api';
import { CheckCircle, XCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setMessage('Токен відсутній. Використовуйте посилання з листа.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Пароль має містити мінімум 6 символів.');
      return;
    }

    setStatus('loading');
    try {
      const res = await authApi.resetPassword(token, password);
      setStatus('success');
      setMessage(res.data.message || 'Пароль успішно змінено!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Помилка Password reset.');
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-4 relative">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md w-full shadow-2xl relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Password reset</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Введіть новий пароль для вашого акаунту</p>
        
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <p className="text-emerald-400 font-medium mb-8">{message}</p>
            <Link to="/auth" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all w-full block">
              Перейти до входу
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Новий пароль</label>
              <input
                type="password" required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-500"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit" disabled={status === 'loading'}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all mt-4"
            >
              {status === 'loading' ? 'Оновлення...' : 'Зберегти новий пароль'}
            </button>
          </form>
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
