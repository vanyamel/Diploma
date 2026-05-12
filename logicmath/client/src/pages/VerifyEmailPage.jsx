import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../shared/api';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Токен верифікації відсутній.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    authApi.verifyEmail(token)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Email успішно підтверджено!');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Помилка підтвердження email.');
      });
  }, [token]);

  return (
    <div className="flex items-center justify-center py-20 px-4 relative">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl relative z-10">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Перевірка...</h2>
            <p className="text-slate-400">Будь ласка, зачекайте, ми перевіряємо ваш токен.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Супер!</h2>
            <p className="text-emerald-400 mb-8">{message}</p>
            <Link to="/auth" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all w-full block shadow-lg shadow-blue-500/20">
              Перейти до входу
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Помилка</h2>
            <p className="text-red-400 mb-8">{message}</p>
            <Link to="/auth" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all w-full block">
              Повернутися на головну
            </Link>
          </>
        )}
      </div>
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
