import React, { useState, useEffect, useRef, useCallback } from 'react';


//FractalsTask — Slider of iterations + answer
const FractalsTask = ({ problem, onSubmit, isDone, loading }) => {
  const { maxStep, targetStep, type, maxIter, targetIter } = problem.params_json;
  const isKoch = type === 'koch';
  const maxSlider = isKoch ? (maxIter || 5) : (maxStep || 4);

  const [sliderVal, setSliderVal] = useState(1);
  const [answer, setAnswer] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    setSliderVal(1); // Display the first step 
    setAnswer('');
  }, [problem.id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isKoch) drawKoch(ctx, canvas.width, canvas.height, sliderVal);
    else drawSierpinski(ctx, canvas.width, canvas.height, sliderVal);
  }, [sliderVal, isKoch]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
  };

  const target = isKoch ? (targetIter || 3) : (targetStep || 2);
  const correctCount = isKoch ? 4 ** target : 3 ** target;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Canvas */}
      <div className="bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden">
        <canvas ref={canvasRef} width={460} height={280} />
      </div>

      {/* Slider */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Крок 0</span>
          <span className="text-blue-400 font-bold">Крок {sliderVal}</span>
          <span>Крок {maxSlider}</span>
        </div>
        <input type="range" min={0} max={maxSlider} value={sliderVal}
          onChange={e => setSliderVal(Number(e.target.value))}
          className="w-full h-2 rounded-full accent-blue-500 cursor-pointer" />
      </div>

      {/* Questions */}
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
        <p className="text-slate-300 text-sm mb-3">
          {isKoch
            ? `Скільки відрізків на ітерації ${target}?`
            : `Скільки зафарбованих трикутників на кроці ${target}?`}
        </p>
        {!isDone ? (
          <div className="flex gap-2 justify-center">
            <input
              type="number"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="Введи відповідь..."
              className="w-36 bg-slate-900 border border-slate-600 focus:border-blue-500 text-white text-center rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            />
            <button onClick={handleSubmit} disabled={!answer.trim() || loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl transition-all">
              ✓
            </button>
          </div>
        ) : (
          <p className="text-emerald-400 font-bold">Правильна відповідь: {correctCount}</p>
        )}
      </div>
    </div>
  );
};

//Canvas renderers 

function drawSierpinski(ctx, w, h, step) {
  ctx.fillStyle = '#6366f1';
  const size = Math.min(w, h) * 0.85;
  const sx = (w - size) / 2;
  const sy = h - (h - size * Math.sqrt(3) / 2) / 2 - 10;
  const drawTri = (x, y, s, depth) => {
    if (depth === 0) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x + s / 2, y - s * Math.sqrt(3) / 2);
      ctx.closePath();
      ctx.fill();
      return;
    }
    const ns = s / 2;
    drawTri(x, y, ns, depth - 1);
    drawTri(x + ns, y, ns, depth - 1);
    drawTri(x + ns / 2, y - ns * Math.sqrt(3) / 2, ns, depth - 1);
  };
  drawTri(sx, sy, size, step);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`Крок ${step}`, 16, 24);
}

function drawKoch(ctx, w, h, iter) {
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = Math.max(1, 3 - iter * 0.4);
  ctx.lineCap = 'round';
  const p1 = { x: 30, y: h / 2 + 60 };
  const p2 = { x: w - 30, y: h / 2 + 60 };
  const pts = [p1];
  kochCollect(p1, p2, iter, pts);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`Ітерація ${iter} →`, 16, 24);
}

function kochCollect(a, b, iter, pts) {
  if (iter === 0) { pts.push(b); return; }
  const dx = b.x - a.x; const dy = b.y - a.y;
  const p1 = { x: a.x + dx / 3, y: a.y + dy / 3 };
  const p3 = { x: a.x + 2 * dx / 3, y: a.y + 2 * dy / 3 };
  const angle = -Math.PI / 3;
  const p2 = {
    x: p1.x + Math.cos(angle) * (dx / 3) - Math.sin(angle) * (dy / 3),
    y: p1.y + Math.sin(angle) * (dx / 3) + Math.cos(angle) * (dy / 3)
  };
  kochCollect(a, p1, iter - 1, pts);
  kochCollect(p1, p2, iter - 1, pts);
  kochCollect(p2, p3, iter - 1, pts);
  kochCollect(p3, b, iter - 1, pts);
}

export default FractalsTask;
