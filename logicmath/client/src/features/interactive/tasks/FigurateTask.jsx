import React, { useState, useEffect } from 'react';
import ChoiceButton from '../../../shared/ChoiceButton';

const FigurateTask = ({ problem, onSubmit, isDone, loading }) => {
  const { shape, n, dots = [], choices = [] } = problem.params_json || {};
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setSelected(null); setSubmitted(false); }, [problem.id]);

  if (!dots.length || !choices.length) {
    return <p className="text-slate-500 text-center py-4">Дані задачі завантажуються...</p>;
  }

  const handleCheck = () => {
    if (selected === null) return;
    setSubmitted(true);
    onSubmit(String(selected));
  };

  // SVG visual
  const xs = dots.map(d => d.x); const ys = dots.map(d => d.y);
  const minX = Math.min(...xs); const maxX = Math.max(...xs);
  const minY = Math.min(...ys); const maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1; const rangeY = maxY - minY || 1;
  const svgSize = Math.min(280, Math.max(160, 40 + dots.length * 2.5));
  const padding = 18;
  const scaleX = x => ((x - minX) / rangeX) * (svgSize - 2 * padding) + padding;
  const scaleY = y => ((y - minY) / rangeY) * (svgSize - 2 * padding) + padding;
  const dotColor = { triangle: '#f43f5e', square: '#3b82f6', pentagon: '#a855f7', hexagon: '#10b981' }[shape] || '#60a5fa';
  const dotR = dots.length > 60 ? 3 : dots.length > 30 ? 4.5 : 6;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* SVG */}
      <div className="bg-slate-950 border border-slate-700 rounded-2xl p-3 shadow-inner">
        <svg width={svgSize} height={svgSize}>
          <defs>
            <radialGradient id={`dot-${shape}`} cx="35%" cy="35%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor={dotColor} stopOpacity="1" />
            </radialGradient>
          </defs>
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={scaleX(d.x)}
              cy={scaleY(d.y)}
              r={dotR}
              fill={`url(#dot-${shape})`}
              stroke={dotColor}
              strokeWidth="0.5"
              style={{
                opacity: 0,
                animation: `dotFade 0.25s ease-out ${Math.min(i * 12, 600)}ms forwards`
              }}
            />
          ))}
        </svg>
      </div>
      <style>{`@keyframes dotFade { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }`}</style>

      {/* Questions */}
      <p className="text-slate-300 text-sm">Скільки точок у цій фігурі?</p>

      {/* Variants */}
      <div className="flex gap-3 flex-wrap justify-center">
        {choices.map((choice, i) => (
          <ChoiceButton
            key={i}
            choice={choice}
            selected={selected}
            status={submitted && isDone ? null : null}
            onClick={setSelected}
            disabled={submitted}
            size="lg"
          />
        ))}
      </div>

      {!isDone && (
        <button
          onClick={handleCheck}
          disabled={selected === null || loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
        >
          {loading ? '⏳ Перевіряємо...' : '✓ Перевірити'}
        </button>
      )}
    </div>
  );
};

export default FigurateTask;
