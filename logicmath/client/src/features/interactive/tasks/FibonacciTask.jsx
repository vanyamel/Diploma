import React, { useState, useEffect, useRef } from 'react';


// FibonacciTask — Drag & Drop Ordering

const FibonacciTask = ({ problem, onSubmit, isDone, result, loading }) => {
  if (!problem?.params_json) return <p className="text-slate-500">Завантаження...</p>;
  const type = problem.task_type;

  if (type === 'fibonacci-order') return <FibOrderTask problem={problem} onSubmit={onSubmit} isDone={isDone} loading={loading} />;
  if (type === 'fibonacci-gaps')  return <FibGapsTask  problem={problem} onSubmit={onSubmit} isDone={isDone} loading={loading} />;
  return <p className="text-slate-500">Невідомий тип: {type}</p>;
};

// Drag & Drop Ordering
const FibOrderTask = ({ problem, onSubmit, isDone, loading }) => {
  const { shuffled = [], correct = [] } = problem.params_json || {};
  const [items, setItems]     = useState([...shuffled]);
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(null);

  useEffect(() => { setItems([...shuffled]); setChecked(null); }, [problem.id]);

  const onDragStart = (i) => setDragIdx(i);
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const newItems = [...items];
    const [dragged] = newItems.splice(dragIdx, 1);
    newItems.splice(i, 0, dragged);
    setItems(newItems);
    setDragIdx(i);
  };
  const onDrop = () => setDragIdx(null);

  const handleCheck = () => {
    const isCorrect = items.every((v, i) => v === correct[i]);
    setChecked(isCorrect ? 'correct' : 'wrong');
    onSubmit(items.join(','));
  };

  const getItemStyle = (i) => {
    if (!checked) return 'bg-blue-900/30 border-blue-500/40 hover:border-blue-400 cursor-grab active:cursor-grabbing';
    return items[i] === correct[i]
      ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300'
      : 'bg-red-900/30 border-red-500 text-red-300';
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-slate-400 text-sm text-center">Перетягни числа у правильному порядку →</p>

      {/* Slots */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {items.map((num, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              draggable={!isDone}
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={onDrop}
              className={`w-16 h-16 flex items-center justify-center text-xl font-bold rounded-xl border-2 transition-all select-none
                ${getItemStyle(i)} ${dragIdx === i ? 'opacity-50 scale-95' : 'opacity-100'}`}
            >
              {num}
            </div>
            <span className="text-slate-600 text-xs">#{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Right answer */}
      {checked === 'wrong' && (
        <div className="flex items-center gap-2 flex-wrap justify-center opacity-70">
          <span className="text-slate-500 text-xs mr-2">Правильний порядок:</span>
          {correct.map((num, i) => (
            <div key={i} className="w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg border border-emerald-500/30 bg-emerald-900/20 text-emerald-400">
              {num}
            </div>
          ))}
        </div>
      )}

      {!isDone && (
        <button
          onClick={handleCheck}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          {loading ? 'Перевіряємо...' : '✓ Перевірити порядок'}
        </button>
      )}
    </div>
  );
};

// Gap Filling with choices
const FibGapsTask = ({ problem, onSubmit, isDone, loading }) => {
  const { sequence = [], gaps = [] } = problem.params_json || {};
  const [selected, setSelected] = useState({});
  const [checked, setChecked]   = useState({});

  useEffect(() => { setSelected({}); setChecked({}); }, [problem.id]);

  if (!sequence.length || !gaps.length) return <p className="text-slate-500">Дані задачі відсутні</p>;

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

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Order */}
      <div className="flex flex-wrap justify-center gap-2">
        {sequence.map((cell, i) => {
          if (!cell.hidden) {
            return (
              <div key={i} className="w-14 h-14 flex flex-col items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-white font-mono font-bold text-lg">
                {cell.value}
                <span className="text-slate-600 text-xs">F{i + 1}</span>
              </div>
            );
          }
          // Find  index of this gap in gaps array
          const gapIdx = gaps.findIndex(g => g.pos === i);
          const status = checked[gapIdx];
          return (
            <div key={i} className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-bold text-lg transition-all
              ${status === 'correct' ? 'border-emerald-400 bg-emerald-900/30 text-emerald-300' :
                status === 'wrong'   ? 'border-red-400 bg-red-900/30 text-red-300' :
                selected[gapIdx] !== undefined ? 'border-blue-400 bg-blue-900/30 text-blue-200' :
                'border-dashed border-slate-500 bg-slate-800/50 text-slate-500'}`}>
              {selected[gapIdx] !== undefined ? selected[gapIdx] : '?'}
              <span className="text-slate-600 text-xs">F{i + 1}</span>
            </div>
          );
        })}
      </div>

      {/* Choices for each pass */}
      {gaps.map((gap, idx) => (
        <div key={idx} className="w-full max-w-md">
          <p className="text-slate-400 text-xs mb-2 text-center">Пропуск #{idx + 1} (позиція {gap.pos + 1})</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {(gap.choices || []).map((choice, ci) => (
              <button
                key={ci}
                onClick={() => handleChoice(idx, choice)}
                disabled={isDone}
                className={`px-5 py-2 rounded-xl border font-mono font-bold text-lg transition-all min-w-[56px]
                  ${selected[idx] === choice
                    ? checked[idx] === 'correct' ? 'bg-emerald-500 border-emerald-400 text-white scale-105' :
                      checked[idx] === 'wrong'   ? 'bg-red-500 border-red-400 text-white' :
                                                   'bg-blue-500 border-blue-400 text-white scale-105'
                    : 'bg-slate-900 border-slate-600 text-slate-200 hover:border-blue-400 hover:bg-blue-900/20 hover:scale-105'}`}
              >
                {choice}
              </button>
            ))}
          </div>
          {checked[idx] === 'wrong' && gap.correct && (
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

export default FibonacciTask;
