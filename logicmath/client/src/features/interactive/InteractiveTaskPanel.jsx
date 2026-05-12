import React, { useState, useEffect } from 'react';
import useStore from '../../shared/useStore';
import { problemsApi, favoritesApi } from '../../shared/api';
import ErrorBoundary from '../../shared/ErrorBoundary';
import Confetti from '../../shared/Confetti';
import useAuthStore from '../../shared/useAuthStore';
import { Heart } from 'lucide-react';

import PascalTask from './tasks/PascalTask';
import FibonacciTask from './tasks/FibonacciTask';
import SequencesTask from './tasks/SequencesTask';
import FigurateTask from './tasks/FigurateTask';
import FractalsTask from './tasks/FractalsTask';
import PrimesTask from './tasks/PrimesTask';

const TASK_MAP = {
  PASCAL: PascalTask,
  FIBONACCI: FibonacciTask,
  SEQUENCES: SequencesTask,
  FIGURATE: FigurateTask,
  FRACTALS: FractalsTask,
  PRIMES: PrimesTask,
};

const HINTS = {
  PASCAL: ['Кожне число = сума двох чисел прямо над ним', 'Перший і останній елемент кожного рядка завжди 1', 'Рядок n: C(n,0), C(n,1), ..., C(n,n)'],
  FIBONACCI: ['Кожне число = сума двох попередніх', 'Починається: 1, 1, 2, 3, 5, 8, 13...', 'F(n) = F(n-1) + F(n-2)'],
  FIGURATE: ['Порахуй точки в кожному рядку', 'Трикутне T(n) = n·(n+1)/2', 'Квадратне Q(n) = n²'],
  SEQUENCES: ['Знайди різницю між сусідніми числами', 'В арифметичній прогресії різниця постійна', 'В геометричній — постійний множник'],
  FRACTALS: ['Кожна ітерація множить кількість елементів', 'Кривя Коха: на кожному кроці ×4 відрізки', 'Серпінський: на кроці n → 3ⁿ трикутників'],
  PRIMES: ['Prime number ділиться тільки на 1 і себе', '2 — єдине парне просте число', 'Алгоритм: закресли всі кратні 2, потім 3, 5...'],
};

const InteractiveTaskPanel = () => {
  const { currentProblem, answerResult, setAnswerResult, reset } = useStore();
  const isDone = answerResult !== null;
  const { syncXP } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintText, setHintText] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setAnswerResult(null);
    setHintsUsed(0);
    setHintText(null);
    setShowConfetti(false);

    let initialTime = 120;
    if (currentProblem?.xp_reward) {
      if (currentProblem.xp_reward <= 15) initialTime = 60;
      else if (currentProblem.xp_reward <= 35) initialTime = 120;
      else initialTime = 180;
    }
    setTimeLeft(initialTime);

    if (user && currentProblem?.id) {
      favoritesApi.checkFavorite(currentProblem.id).then(res => setIsFavorite(res.data.isFavorite)).catch(console.error);
    } else {
      setIsFavorite(false);
    }
  }, [currentProblem, setAnswerResult, user]);

  // Timer
  useEffect(() => {
    if (!currentProblem || isDone || timeLeft <= 0 || loading) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [currentProblem, isDone, timeLeft, loading]);

  // TimeOut
  useEffect(() => {
    if (timeLeft === 0 && !isDone && !loading) {
      handleGiveUp('TIME_OUT');
    }
  }, [timeLeft, isDone, loading]);

  // Confetti
  useEffect(() => {
    if (answerResult?.correct) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 3500);
      return () => clearTimeout(t);
    }
  }, [answerResult]);

  if (!currentProblem) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-dashed border-slate-700 text-slate-500">
        <div className="text-center">
          <div className="text-5xl mb-3">🧮</div>
          <p>Обери категорію та рівень щоб розпочати</p>
        </div>
      </div>
    );
  }

  const TaskComponent = TASK_MAP[currentProblem.category];
  const hints = HINTS[currentProblem.category] || [];

  const handleSubmit = async (answer) => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await problemsApi.checkAnswer(currentProblem.id, answer, hintsUsed);
      setAnswerResult(res.data);
      // Sync xp if authorized
      if (res.data.newXpTotal !== null) syncXP(res.data.newXpTotal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // GiveUO
  const handleGiveUp = async (reason = 'GAVE_UP') => {
    if (loading) return;
    try {
      setLoading(true);
      const submitReason = typeof reason === 'string' ? reason : 'GAVE_UP';
      const res = await problemsApi.checkAnswer(currentProblem.id, submitReason, hintsUsed);
      setAnswerResult({ ...res.data, gaveUp: true, reason: submitReason });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // Hint
  const handleHint = () => {
    if (hintsUsed >= hints.length) return;
    setHintText(hints[hintsUsed]);
    setHintsUsed(h => h + 1);
  };
  // Favorite
  const handleToggleFavorite = async () => {
    if (!user) return;
    try {
      const res = await favoritesApi.toggleFavorite(currentProblem.id);
      setIsFavorite(res.data.isFavorite);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Confetti active={showConfetti} />

      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 pt-6 pb-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
              {currentProblem.category}
            </span>
            <div className="flex items-center gap-3">
              {!isDone && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${timeLeft <= 10 ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                  <span>⏳</span>
                  <span className="font-mono text-sm font-bold">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              {!isDone && hints.length > 0 && hintsUsed < hints.length && (
                <button
                  onClick={handleHint}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg transition-all"
                  title={`-30% XP за підказку (${hints.length - hintsUsed} залишилось)`}
                >
                  💡 Підказка
                  {hintsUsed > 0 && <span className="opacity-60">({hintsUsed}/{hints.length})</span>}
                </button>
              )}
              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center p-1.5 rounded-lg transition-colors ${isFavorite ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-pink-400 hover:bg-slate-700'
                    }`}
                  title="Додати до обраного"
                >
                  <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              )}

              <span className="text-sm text-slate-400 font-mono">
                {hintsUsed > 0 ? (
                  <span className="text-yellow-400">-{hintsUsed * 30}% XP</span>
                ) : (
                  `XP: ${currentProblem.xp_reward}`
                )}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">{currentProblem.title}</h2>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">{currentProblem.description}</p>

          {hintText && (
            <div className="mt-3 flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-2.5">
              <span className="text-yellow-400 mt-0.5 shrink-0">💡</span>
              <p className="text-yellow-200/90 text-sm">{hintText}</p>
            </div>
          )}
        </div>

        <div className="p-6">
          <ErrorBoundary key={currentProblem.id}>
            {TaskComponent ? (
              <TaskComponent
                problem={currentProblem}
                onSubmit={handleSubmit}
                onGiveUp={handleGiveUp}
                isDone={isDone}
                result={answerResult}
                loading={loading}
              />
            ) : (
              <p className="text-slate-500">Тип задачі не підтримується: {currentProblem.category}</p>
            )}
          </ErrorBoundary>
        </div>

        {answerResult && (
          <div className={`mx-6 mb-6 p-4 rounded-xl border transition-all ${answerResult.correct
              ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300'
              : answerResult.gaveUp
                ? 'bg-slate-800/60 border-slate-600 text-slate-300'
                : 'bg-red-900/30 border-red-500/40 text-red-300'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <span className="text-xl">
                  {answerResult.correct ? '🎉' : answerResult.gaveUp ? (answerResult.reason === 'TIME_OUT' ? '⏳' : '🏳️') : '❌'}
                </span>
                <span>{answerResult.correct ? 'Правильно!' : answerResult.gaveUp ? (answerResult.reason === 'TIME_OUT' ? 'Час вийшов' : 'Здався') : 'Неправильно'}</span>

                {answerResult.correct && answerResult.xpEarned > 0 && (
                  <span className="text-sm font-bold bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 animate-bounce ml-2">
                    +{answerResult.xpEarned} XP
                  </span>
                )}

                {answerResult.correct && answerResult.alreadySolved && (
                  <span className="text-sm font-semibold bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded text-blue-300 ml-2">
                    🔄 Вже розв'язано (0 XP)
                  </span>
                )}
              </div>
              <button
                onClick={() => { reset(); }}
                className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all flex items-center gap-1.5"
              >
                🔄 Нова задача
              </button>
            </div>
            <p className="text-sm opacity-80 mt-1">{answerResult.message}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default InteractiveTaskPanel;
