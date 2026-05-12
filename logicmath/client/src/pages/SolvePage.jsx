import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../shared/useStore';
import { problemsApi } from '../shared/api';
import InteractiveTaskPanel from '../features/interactive/InteractiveTaskPanel';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const LEVELS = [
  { value: 1, label: 'Легко', color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500' },
  { value: 3, label: 'Середньо', color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-500' },
  { value: 5, label: 'Важко', color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-500' },
];

const CATEGORY_NAMES = {
  pascal: "Pascal's Triangle",
  fibonacci: 'Числа Фібоначчі',
  figurate: 'Фігурні числа',
  sequences: 'Арифметичні прогресії',
  fractals: 'Фрактали',
  primes: 'Прості числа'
};

const SolvePage = () => {
  const { category } = useParams();
  const { setProblem, reset, currentProblem } = useStore();
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);

  const activeCategoryName = CATEGORY_NAMES[category] || category.toUpperCase();

  const generate = async (lvl) => {
    try {
      setLoading(true);
      reset();
      const res = await problemsApi.generate(category.toUpperCase(), lvl);
      setProblem(res.data);
    } catch (e) {
      console.error('Помилка генерації:', e);
    } finally {
      setLoading(false);
    }
  };

  // Autogen after category change
  useEffect(() => {
    if (category) {
      setLevel(1);
      generate(1);
    }
    return () => reset(); // clean up
  }, [category]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    generate(newLevel);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/catalog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2 text-sm font-medium">
            <ArrowLeft size={16} />
            Назад до каталогу
          </Link>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            {activeCategoryName}
            {loading && <RefreshCw size={20} className="animate-spin text-blue-400" />}
          </h1>
        </div>

        {/* Level Selector */}
        <div className="flex bg-slate-800/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-700 shadow-lg w-fit">
          {LEVELS.map(l => {
            const isActive = level === l.value;
            return (
              <button
                key={l.value}
                onClick={() => handleLevelChange(l.value)}
                disabled={loading}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${
                  isActive
                    ? `${l.bg} text-slate-950 shadow-md`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className={`transition-opacity duration-300 ${loading && !currentProblem ? 'opacity-0' : 'opacity-100'}`}>
          <InteractiveTaskPanel />
        </div>
        
        {/* Placeholder while loading */}
        {loading && !currentProblem && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-3xl z-10 border border-slate-800">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Генеруємо задачу...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolvePage;
