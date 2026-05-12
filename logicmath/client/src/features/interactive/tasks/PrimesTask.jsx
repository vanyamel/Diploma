import React, { useState, useEffect } from 'react';


 //PrimesTask — Click on the COMPOUND numbers to cross them out.

const PrimesTask = ({ problem, onSubmit, isDone, loading }) => {
  const { numbers, primes } = problem.params_json;
  const primeSet = new Set(primes);

  const [crossed, setCrossed] = useState(new Set()); // числа, по яких клікнули
  const [checked, setChecked] = useState(null);

  useEffect(() => { setCrossed(new Set()); setChecked(null); }, [problem.id]);

  const toggleNum = (val) => {
    if (isDone || val === 1) return; // 1 не можна ні чіпати
    setCrossed(prev => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  };

  const handleCheck = () => {
    const composites = numbers.filter(n => !n.isPrime && n.value !== 1).map(n => n.value);

    const newChecked = {};
    numbers.forEach(n => {
      if (n.value === 1) { newChecked[n.value] = 'neutral'; return; }
      const shouldBeCrossed = !n.isPrime;
      const isCrossed = crossed.has(n.value);
      if (shouldBeCrossed && isCrossed)   newChecked[n.value] = 'correct-cross';
      else if (!shouldBeCrossed && !isCrossed) newChecked[n.value] = 'correct-prime';
      else if (shouldBeCrossed && !isCrossed)  newChecked[n.value] = 'missed';
      else                                     newChecked[n.value] = 'wrong-cross';
    });
    setChecked(newChecked);

    // Send numbers that the user considers prime (uncrossed out, except 1)
    const userPrimes = numbers
      .filter(n => n.value !== 1 && !crossed.has(n.value))
      .map(n => n.value)
      .sort((a, b) => a - b);
    onSubmit(userPrimes.join(','));
  };

  const getStyle = (num) => {
    const { value, isPrime } = num;
    if (value === 1) return 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50';
    const isCrossed = crossed.has(value);
    const state = checked?.[value];

    if (state === 'correct-prime') return 'bg-emerald-900/40 border-emerald-500 text-emerald-300 font-bold';
    if (state === 'correct-cross') return 'bg-slate-700 border-slate-600 text-slate-500 line-through opacity-60';
    if (state === 'missed')        return 'bg-red-900/40 border-red-400 text-red-300 ring-2 ring-red-400/50';
    if (state === 'wrong-cross')   return 'bg-orange-900/40 border-orange-400 text-orange-300 ring-2 ring-orange-400/50';

    if (isCrossed) return 'bg-slate-700 border-slate-500 text-slate-500 line-through opacity-50 hover:opacity-70';
    return 'bg-slate-800 border-slate-600 text-slate-200 hover:border-red-400 hover:bg-red-900/20 cursor-pointer';
  };

  const crossedCount = crossed.size;
  const correctCompositeCount = numbers.filter(n => !n.isPrime && n.value !== 1).length;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Hint */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-emerald-900/60 border border-emerald-500 inline-block" />
          Prime number (не чіпай)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-slate-700 border border-slate-500 inline-block" />
          Клікни щоб закреслити складене
        </span>
      </div>

      {/* Number grid */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg">
        {numbers.map(num => (
          <button
            key={num.value}
            onClick={() => toggleNum(num.value)}
            disabled={isDone}
            className={`w-12 h-12 text-lg font-mono font-bold rounded-xl border-2 transition-all select-none
              ${getStyle(num)}`}
          >
            {num.value}
          </button>
        ))}
      </div>

      {/* Progress */}
      {!checked && (
        <p className="text-slate-500 text-xs">
          Закреслено: {crossedCount} / {correctCompositeCount} складених чисел
        </p>
      )}

      {/* Legend after verification */}
      {checked && (
        <div className="flex gap-4 text-xs flex-wrap justify-center">
          <span className="text-emerald-400">✓ Правильно знайдені прості</span>
          <span className="text-red-400">⚠ Пропущено закреслення</span>
          <span className="text-orange-400">✗ Помилково закреслено</span>
        </div>
      )}

      {!isDone && (
        <button onClick={handleCheck} disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
          {loading ? 'Перевіряємо...' : '✓ Перевірити'}
        </button>
      )}
    </div>
  );
};

export default PrimesTask;
