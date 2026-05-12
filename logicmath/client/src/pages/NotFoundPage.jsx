import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 mb-6 drop-shadow-2xl opacity-80">
        404
      </div>
      <h1 className="text-4xl font-extrabold text-white mb-4">Сторінку не знайдено</h1>
      <p className="text-slate-400 text-lg mb-8 max-w-md">
        Здається, ти загубився в математичному просторі. Ця сторінка не існує або була переміщена.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all border border-slate-700 hover:border-slate-600 shadow-lg"
      >
        <Home size={20} className="text-blue-400" />
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFoundPage;
