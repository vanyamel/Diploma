import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../shared/useAuthStore';
import useStore from '../shared/useStore';
import { BookOpen, Trophy, User, LogOut, Zap, LayoutDashboard, Home, Heart, ShieldAlert } from 'lucide-react';
import Logo from './Logo';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const { totalXP, streak } = useStore();
  const location = useLocation();

  const displayXP = user ? user.xp_total : totalXP;

  const navLinks = [
    { path: '/', label: 'Головна', icon: Home },
    { path: '/catalog', label: 'Каталог', icon: BookOpen },
    { path: '/leaderboard', label: 'Лідерборд', icon: Trophy },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/*Navbar*/}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              <Logo className="w-9 h-9" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              LogicMath
            </span>
          </Link>

          {/* Central Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === path
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            {user && (
              <Link
                to="/favorites"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/favorites'
                    ? 'bg-pink-500/10 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Heart size={16} className={location.pathname === '/favorites' ? 'fill-current' : ''} />
                Обране
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ShieldAlert size={16} />
                Адмін
              </Link>
            )}
          </nav>

          {/* Profile */}
          <div className="flex items-center gap-4">
            {/* XP */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold shadow-inner">
              <Zap size={14} className="fill-yellow-400" />
              {displayXP}
              {streak >= 2 && <span className="ml-1 text-orange-400">🔥{streak}</span>}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/progress" className="flex items-center gap-2 hover:bg-slate-800 py-1.5 px-3 rounded-xl transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white hidden sm:block">
                    {user.username}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Вийти"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
              >
                <User size={16} />
                <span className="hidden sm:inline">Увійти</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/*Content*/}
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>

      {/*Footer*/}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 text-center text-slate-500 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} LogicMath Platform. Всі права захищені.</p>
          <p className="mt-2 text-slate-600">Навчайся, розв'язуй, перемагай!</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
