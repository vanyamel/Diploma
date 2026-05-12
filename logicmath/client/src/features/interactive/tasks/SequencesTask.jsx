import React, { useState, useEffect } from 'react';


//SequencesTask — Click on the options to fill in the gaps in the progressions

const SequencesTask = ({ problem, onSubmit, isDone, loading }) => {
  const { sequence, gaps } = problem.params_json;
  const [selected, setSelected] = useState({});
  const [checked, setChecked]   = useState({});

  useEffect(() => { setSelected({}); setChecked({}); }, [problem.id]);

  const handleChoice = (gapIdx, value) => {
    if (isDone) return;
    setSelected(prev => ({ ...prev, [gapIdx]: value }));
  };

  const allSelected = gaps.every((_, i) => selected[i] !== undefined);

  const handleCheck = () => {
    const newChecked = {};
    gaps.forEach((gap, i) => {
      newChecked[i] = selected[i] === gap.correct ? 'correct' : 'wrong';
    });
    setChecked(newChecked);
    onSubmit(gaps.map((_, i) => selected[i]).join(','));
  };

  // Rendering a visual histogram
  const maxVal = Math.max(...sequence.map(c => c.value || 0));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Histogram sequence */}
      <div className="w-full overflow-x-auto">
        <div className="flex items-end gap-2 justify-center min-h-[160px] px-2 pb-2">
          {sequence.map((cell, i) => {
            const gap = gaps.find(g => g.pos === i);
            const gapIdx = gaps.findIndex(g => g.pos === i);
            const barH = Math.max(20, (cell.value / maxVal) * 130);
            const status = checked[gapIdx];

            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[40px] max-w-[64px]">
                <div
                  className={`w-full rounded-t-lg border-2 transition-all duration-300
                    ${cell.hidden
                      ? status === 'correct' ? 'bg-emerald-500/40 border-emerald-400'
                      : status === 'wrong'   ? 'bg-red-500/40 border-red-400'
                      : selected[gapIdx] !== undefined ? 'bg-blue-500/40 border-blue-400'
                      : 'bg-slate-700/60 border-dashed border-slate-500'
                      : 'bg-gradient-to-t from-blue-600 to-indigo-500 border-blue-400/0'}`}
                  style={{ height: cell.hidden
                    ? (selected[gapIdx] !== undefined ? Math.max(20, (selected[gapIdx] / maxVal) * 130) : 60)
                    : barH }}
                />
                <span className={`text-xs font-mono font-bold ${cell.hidden ? 'text-slate-400' : 'text-slate-200'}`}>
                  {cell.hidden
                    ? (selected[gapIdx] !== undefined ? selected[gapIdx] : '?')
                    : cell.value}
                </span>
                <span className="text-slate-600 text-xs">#{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Choices for each pass */}
      {gaps.map((gap, idx) => (
        <div key={idx} className="w-full max-w-md bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs mb-3 text-center">Вибери значення для позиції #{gap.pos + 1}</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {gap.choices.map((choice, ci) => (
              <button
                key={ci}
                onClick={() => handleChoice(idx, choice)}
                disabled={isDone}
                className={`px-5 py-2 rounded-xl border font-mono font-bold text-lg transition-all min-w-[56px]
                  ${selected[idx] === choice
                    ? checked[idx] === 'correct' ? 'bg-emerald-500 border-emerald-400 text-white scale-105 shadow-lg shadow-emerald-500/30'
                    : checked[idx] === 'wrong'   ? 'bg-red-500 border-red-400 text-white'
                    :                              'bg-blue-500 border-blue-400 text-white scale-105'
                    : 'bg-slate-900 border-slate-600 text-slate-200 hover:border-blue-400 hover:bg-blue-900/20 hover:scale-105'}`}
              >
                {choice}
              </button>
            ))}
          </div>
          {checked[idx] === 'wrong' && (
            <p className="text-center text-emerald-400 text-xs mt-2">Правильно: {gap.correct}</p>
          )}
        </div>
      ))}

      {!isDone && (
        <button
          onClick={handleCheck}
          disabled={!allSelected || loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Перевіряємо...' : '✓ Перевірити'}
        </button>
      )}
    </div>
  );
};

export default SequencesTask;
