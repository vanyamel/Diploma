import React from 'react';
import useAuthStore from '../shared/useAuthStore';
import useStore from '../shared/useStore';
import ProgressTable from '../shared/ProgressTable';
import { Trophy, Zap, Target, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgressPage = () => {
  const { user } = useAuthStore();
  const { totalXP, streak, progress } = useStore();

  const displayXP = user ? user.xp_total : totalXP;
  
  // Summ of solved
  let solvedCount = 0;
  Object.values(progress).forEach(catProgress => {
    Object.values(catProgress).forEach(isSolved => {
      if (isSolved) solvedCount++;
    });
  });
  
  // Totaltasks 18
  const totalTasks = 18;
  const progressPercent = Math.round((solvedCount / totalTasks) * 100);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Особистий кабінет</h1>
        <p className="text-slate-400">Твій прогрес та досягнення</p>
      </div>

      {!user && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-1">Збережи свій прогрес!</h3>
            <p className="text-blue-200/70 text-sm">Ти граєш як гість. Якщо ти оновиш сторінку чи закриєш браузер, твої досягнення зникнуть.</p>
          </div>
          <Link to="/auth" className="whitespace-nowrap px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
            Створити акаунт
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
            <Zap className="text-yellow-400 w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{displayXP}</div>
            <div className="text-slate-400 text-sm">Усього XP</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Trophy className="text-orange-400 w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{streak}</div>
            <div className="text-slate-400 text-sm">Серія (Streak)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Target className="text-emerald-400 w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{progressPercent}%</div>
            <div className="text-slate-400 text-sm">Завершено</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Star className="text-blue-400 w-7 h-7" />
          </div>
          <div>
            <div className="text-3xl font-bold text-white">{solvedCount}/{totalTasks}</div>
            <div className="text-slate-400 text-sm">Зірочок зібрано</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Детальна статистика</h2>
        <ProgressTable progress={progress} />
      </div>
    </div>
  );
};

export default ProgressPage;
