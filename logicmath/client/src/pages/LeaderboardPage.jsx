import React, { useEffect, useState } from 'react';
import { leaderboardApi } from '../shared/api';
import useAuthStore from '../shared/useAuthStore';

const MEDALS = ['🥇', '🥈', '🥉'];

const LeaderboardPage = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    leaderboardApi.get()
      .then(res => setBoard(res.data.leaderboard || []))
      .catch(() => setError('Не вдалось завантажити лідерборд'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent inline-block mb-2">
            🏆 Лідерборд
          </h1>
          <p className="text-slate-500 text-sm">Топ математиків платформи</p>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-yellow-400 rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-center text-red-400 py-8">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-2">
            {board.map((entry, idx) => {
              const isMe = user && entry.id === user.id;
              const isTop3 = idx < 3;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
                    isMe
                      ? 'bg-blue-600/15 border-blue-500/40 ring-1 ring-blue-500/20'
                      : isTop3
                      ? 'bg-yellow-500/8 border-yellow-500/20'
                      : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  {/* Ranking */}
                  <div className="w-10 text-center">
                    {isTop3
                      ? <span className="text-2xl">{MEDALS[idx]}</span>
                      : <span className="text-slate-500 font-mono font-bold">#{entry.rank}</span>
                    }
                  </div>

                  {/* Avatar placeholder */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${
                    isMe ? 'bg-blue-600/40 text-blue-300' :
                    isTop3 ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {entry.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isMe ? 'text-blue-300' : isTop3 ? 'text-yellow-300' : 'text-slate-200'}`}>
                      {entry.username}
                      {isMe && <span className="ml-2 text-xs text-blue-400 font-normal">(це ти)</span>}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="text-right shrink-0">
                    <div className={`font-mono font-bold text-lg ${isTop3 ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {entry.xp_total.toLocaleString()}
                    </div>
                    <div className="text-slate-600 text-xs">XP</div>
                  </div>
                </div>
              );
            })}

            {board.length === 0 && (
              <div className="text-center text-slate-500 py-10">
                <div className="text-5xl mb-3">🏜️</div>
                <p>Лідерборд порожній. Стань першим!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
