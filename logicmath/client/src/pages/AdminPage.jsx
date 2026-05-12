import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../shared/api';
import { ShieldAlert, Users, Target, Activity, Trash2, CheckCircle } from 'lucide-react';
import useAuthStore from '../shared/useAuthStore';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/progress');
    } else if (currentUser?.role === 'admin') {
      fetchData();
    }
  }, [currentUser, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
      alert('Помилка завантаження даних');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (id === currentUser.id) {
      alert('Ви не можете видалити самі себе!');
      return;
    }
    if (!window.confirm(`Ви впевнені, що хочете видалити користувача ${username}? Цю дію неможливо скасувати.`)) return;

    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      setStats(prev => ({ ...prev, users: prev.users - 1 }));
    } catch (error) {
      alert(error.response?.data?.error || 'Error inидалення');
    }
  };

  if (loading || currentUser?.role !== 'admin') {
    return <div className="p-10 text-center text-white">Завантаження панелі...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <ShieldAlert className="w-10 h-10 text-emerald-500" />
        <h1 className="text-3xl font-extrabold text-white">Панель Адміністратора</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 rounded-xl"><Users className="w-8 h-8 text-blue-400" /></div>
          <div>
            <p className="text-slate-400 text-sm">Всього користувачів</p>
            <p className="text-3xl font-bold text-white">{stats?.users}</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 rounded-xl"><Target className="w-8 h-8 text-purple-400" /></div>
          <div>
            <p className="text-slate-400 text-sm">Всього задач</p>
            <p className="text-3xl font-bold text-white">{stats?.problems}</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center gap-4">
          <div className="p-4 bg-orange-500/20 rounded-xl"><Activity className="w-8 h-8 text-orange-400" /></div>
          <div>
            <p className="text-slate-400 text-sm">Спроб розв'язання</p>
            <p className="text-3xl font-bold text-white">{stats?.attempts}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Управління користувачами</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Користувач</th>
                <th className="px-6 py-4">Роль</th>
                <th className="px-6 py-4">XP</th>
                <th className="px-6 py-4">Верифікація</th>
                <th className="px-6 py-4 text-right">Дії</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.username}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{u.xp_total}</td>
                  <td className="px-6 py-4">
                    {u.is_verified ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Так</span>
                    ) : (
                      <span className="text-slate-500">Ні</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.id !== currentUser.id && (
                      <button onClick={() => handleDeleteUser(u.id, u.username)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Видалити користувача">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    Немає даних
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
