import React from 'react';


//ProgressTable
const CATEGORIES = [
  { id: 'PASCAL',    icon: '🔺', label: 'Pascal' },
  { id: 'FIBONACCI', icon: '🌀', label: 'Fibonacci' },
  { id: 'FIGURATE',  icon: '⬡',  label: 'Figurate' },
  { id: 'SEQUENCES', icon: '📈', label: 'Sequences' },
  { id: 'FRACTALS',  icon: '❄️', label: 'Fractals' },
  { id: 'PRIMES',    icon: '🔢', label: 'Primes' },
];

const LEVELS = [
  { value: 1, label: 'Легко',    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { value: 3, label: 'Середньо', color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
  { value: 5, label: 'Важко',    color: 'text-red-400',     bg: 'bg-red-500/10' },
];

const ProgressTable = ({ progress = {} }) => {
  const total = CATEGORIES.length * LEVELS.length;
  const done  = Object.values(progress).reduce((sum, cat) =>
    sum + Object.values(cat).filter(Boolean).length, 0);
  const pct = Math.round((done / total) * 100);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 mt-6">
      {/* Theme + Progress */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm tracking-wide">📋 Прогрес</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{done}/{total} задач</span>
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-slate-300 font-bold">{pct}%</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left text-slate-500 font-medium pb-2 pr-3">Категорія</th>
              {LEVELS.map(l => (
                <th key={l.value} className={`text-center pb-2 px-3 font-semibold ${l.color}`}>
                  {l.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat, ri) => (
              <tr key={cat.id} className={ri % 2 === 0 ? 'bg-slate-800/30' : ''}>
                <td className="py-2 pr-3">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span>{cat.icon}</span>
                    <span className="font-medium">{cat.label}</span>
                  </span>
                </td>
                {LEVELS.map(l => {
                  const solved = progress[cat.id]?.[l.value];
                  return (
                    <td key={l.value} className="py-2 px-3 text-center">
                      {solved ? (
                        <span className="text-base">⭐</span>
                      ) : (
                        <span className="w-5 h-5 rounded border border-slate-700 inline-block opacity-40" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgressTable;
