import React, { useEffect, useState } from 'react';
import { favoritesApi } from '../shared/api';
import { Heart, Trophy, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await favoritesApi.getFavorites();
      setFavorites(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (problemId) => {
    try {
      await favoritesApi.toggleFavorite(problemId);
      setFavorites(prev => prev.filter(p => p.id !== problemId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 flex items-center gap-3">
        <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Обрані задачі</h1>
          <p className="text-slate-400">Твій персональний список найкращих задач</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Список порожній</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Ти ще не додав жодної задачі до обраного. Переходь до каталогу та зберігай цікаві завдання!
          </p>
          <Link to="/catalog" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
            <BookOpen size={18} />
            Перейти до каталогу
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {favorites.map(problem => (
            <div key={problem.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                    {problem.category}
                  </span>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                    Рівень {problem.level}
                  </span>
                  <span className="text-xs text-slate-500">
                    Додано: {new Date(problem.created_at).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{problem.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{problem.description}</p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleRemove(problem.id)}
                  className="flex items-center justify-center p-3 md:p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors md:opacity-0 group-hover:opacity-100 flex-shrink-0"
                  title="Видалити з обраного"
                >
                  <Heart size={20} fill="currentColor" />
                </button>
                <Link
                  to={`/solve/${problem.category.toLowerCase()}`}
                  className="flex-1 md:flex-none text-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                  Розв'язати
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
