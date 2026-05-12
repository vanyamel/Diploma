import React, { useState, useEffect } from 'react';


//PascalTask - Inline editing of Pascal's triangle cells

const PascalTask = ({ problem, onSubmit, isDone, loading }) => {
  const { triangle, missing } = problem.params_json;
  const [answers, setAnswers]     = useState({});
  const [activeCell, setActiveCell] = useState(null);
  const [checked, setChecked]     = useState({});

  useEffect(() => {
    setAnswers({});
    setChecked({});
    setActiveCell(null);
  }, [problem.id]);

  const cellKey = (r, c) => `${r}-${c}`;

  const handleCellClick = (r, c) => {
    if (isDone) return;
    setActiveCell(cellKey(r, c));
  };

  const handleInlineInput = (key, e) => {
    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setAnswers(prev => ({ ...prev, [key]: v }));
  };

  const handleKeyDown = (key, e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      setActiveCell(null);
      // Перейти до наступної порожньої клітинки
      const missingKeys = missing.map(m => cellKey(m.row, m.col));
      const idx = missingKeys.indexOf(key);
      if (idx < missingKeys.length - 1) setActiveCell(missingKeys[idx + 1]);
    }
    if (e.key === 'Escape') setActiveCell(null);
  };

  const allFilled = missing.every(m => answers[cellKey(m.row, m.col)]);

  const handleCheck = () => {
    if (!allFilled) return;
    const newChecked = {};
    missing.forEach(m => {
      const key = cellKey(m.row, m.col);
      newChecked[key] = parseInt(answers[key]) === m.value ? 'correct' : 'wrong';
    });
    setChecked(newChecked);
    const answerStr = missing.map(m => answers[cellKey(m.row, m.col)]).join(',');
    onSubmit(answerStr);
  };

  const getCellStyle = (r, c, hidden) => {
    const key = cellKey(r, c);
    const isActive = activeCell === key;
    const state = checked[key];

    if (!hidden) return 'bg-slate-800/80 border-slate-600/60 text-slate-300';
    if (state === 'correct') return 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/20';
    if (state === 'wrong')   return 'bg-red-500/25 border-red-400 text-red-300';
    if (isActive)            return 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-400/40 shadow-sm shadow-blue-500/20';
    if (answers[key])        return 'bg-slate-700 border-blue-500/50 text-white cursor-pointer hover:border-blue-400';
    return 'bg-slate-700/60 border-slate-500 border-dashed text-slate-500 cursor-pointer hover:border-blue-400 hover:bg-slate-700';
  };

  const rows = triangle.length;
  const cellSize = rows > 7 ? 34 : rows > 5 ? 40 : 48;
  const fontSize = rows > 7 ? 'text-xs' : rows > 5 ? 'text-sm' : 'text-base';

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Triangle */}
      <div className="overflow-x-auto w-full flex flex-col items-center gap-1 py-4">
        {triangle.map((row, r) => (
          <div key={r} className="flex gap-1 justify-center">
            {row.map((cell, c) => {
              const key = cellKey(r, c);
              const isHidden = cell.hidden;
              const isActive = activeCell === key;

              return (
                <div
                  key={c}
                  onClick={() => isHidden && handleCellClick(r, c)}
                  className={`flex items-center justify-center rounded-lg border-2 transition-all duration-150 font-mono font-bold select-none relative
                    ${getCellStyle(r, c, isHidden)} ${fontSize}`}
                  style={{ width: cellSize, height: cellSize, minWidth: cellSize }}
                >
                  {isHidden ? (
                    isActive ? (
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        value={answers[key] || ''}
                        onChange={e => handleInlineInput(key, e)}
                        onKeyDown={e => handleKeyDown(key, e)}
                        onBlur={() => setActiveCell(null)}
                        className="w-full h-full bg-transparent text-center text-white font-mono font-bold focus:outline-none"
                        style={{ fontSize: 'inherit' }}
                      />
                    ) : (
                      <span className={answers[key] ? 'text-white' : 'text-slate-500 text-lg'}>
                        {answers[key] || '?'}
                      </span>
                    )
                  ) : (
                    <span>{cell.value}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Key hint */}
      {!isDone && activeCell && (
        <p className="text-slate-500 text-xs">Enter або Tab — наступна клітинка · Esc — закрити</p>
      )}

      {/* Progressbar */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Заповнено: {Object.keys(answers).filter(k => answers[k]).length} / {missing.length}</span>
        <div className="flex gap-1 ml-1">
          {missing.map((m, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
              checked[cellKey(m.row, m.col)] === 'correct' ? 'bg-emerald-400' :
              checked[cellKey(m.row, m.col)] === 'wrong'   ? 'bg-red-400' :
              answers[cellKey(m.row, m.col)] ? 'bg-blue-400' : 'bg-slate-600'
            }`} />
          ))}
        </div>
      </div>

      {/* Check button */}
      {!isDone && (
        <button
          onClick={handleCheck}
          disabled={!allFilled || loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02]"
        >
          {loading ? '⏳ Перевіряємо...' : '✓ Перевірити'}
        </button>
      )}
    </div>
  );
};

export default PascalTask;
