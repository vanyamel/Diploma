import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../shared/useStore';
import { Layers, Activity, Hexagon, Hash, Snowflake, Calculator } from 'lucide-react';

const CATEGORIES = [
  { id: 'PASCAL', name: "Трикутник Паскаля", icon: <Layers className="w-6 h-6" />, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'FIBONACCI', name: 'Числа Фібоначчі', icon: <Activity className="w-6 h-6" />, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'FIGURATE', name: 'Фігурні числа', icon: <Hexagon className="w-6 h-6" />, color: 'from-purple-500 to-fuchsia-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'SEQUENCES', name: 'Арифметичні прогресії', icon: <Hash className="w-6 h-6" />, color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'FRACTALS', name: 'Фрактали', icon: <Snowflake className="w-6 h-6" />, color: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'PRIMES', name: 'Прості числа', icon: <Calculator className="w-6 h-6" />, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
];

const CatalogPage = () => {
  const { progress } = useStore();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Каталог Завдань</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Обери категорію для тренування. Кожна категорія має 3 рівні складності. Збери всі зірочки!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => {
          const catProgress = progress[cat.id] || {};
          const solvedCount = Object.values(catProgress).filter(Boolean).length;
          
          return (
            <Link
              key={cat.id}
              to={`/solve/${cat.id.toLowerCase()}`}
              className={`group relative flex flex-col p-6 rounded-3xl border bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden ${cat.border}`}
            >
              {/* Background gradient hint */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${cat.color} shadow-lg`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 3, 5].map((lvl, idx) => (
                      <span key={lvl} className={`text-sm ${catProgress[lvl] ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-700'}`}>
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-slate-500 ml-2">
                      {solvedCount}/3
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto relative z-10">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${cat.color} transition-all duration-1000`} 
                    style={{ width: `${(solvedCount / 3) * 100}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CatalogPage;
