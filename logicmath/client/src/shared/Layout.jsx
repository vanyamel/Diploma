import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../shared/useAuthStore';
import useStore from '../shared/useStore';
import { BookOpen, Trophy, User, LogOut, Zap, Home, Heart, ShieldAlert, Menu, X } from 'lucide-react';
import Logo from './Logo';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const { totalXP, streak } = useStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayXP = user ? user.xp_total : totalXP;

  const closeMobile = () => setMobileOpen(false);

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
          <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobile}>
            <div className="group-hover:scale-105 transition-transform drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              <Logo className="w-9 h-9" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              LogicMath
            </span>
          </Link>

          {/* Central Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === path
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === '/favorites'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${location.pathname === '/admin'
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
              >
                <ShieldAlert size={16} />
                Адмін
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* XP badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-bold shadow-inner">
              <Zap size={14} className="fill-yellow-400" />
              {displayXP}
              {streak >= 2 && <span className="ml-1 text-orange-400">🔥{streak}</span>}
            </div>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/progress" className="flex items-center gap-2 hover:bg-slate-800 py-1.5 px-3 rounded-xl transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
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
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
              >
                <User size={16} />
                Увійти
              </Link>
            )}

            {/* mobile only */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Відкрити меню"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-slate-800 bg-slate-900/95 backdrop-blur-md">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === path
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}

            {user && (
              <Link
                to="/favorites"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/favorites'
                  ? 'bg-pink-500/10 text-pink-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
              >
                <Heart size={18} />
                Обране
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={closeMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/admin'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
              >
                <ShieldAlert size={18} />
                Адмін
              </Link>
            )}

            <div className="mt-2 pt-2 border-t border-slate-800">
              {user ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <Link
                    to="/progress"
                    onClick={closeMobile}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.username}</p>
                      <p className="text-xs text-yellow-400 flex items-center gap-1">
                        <Zap size={10} className="fill-yellow-400" />
                        {displayXP} XP
                        {streak >= 2 && <span className="ml-1 text-orange-400">🔥{streak}</span>}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); closeMobile(); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    Вийти
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 mx-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl"
                >
                  <User size={16} />
                  Увійти / Зареєструватись
                </Link>
              )}
            </div>
          </nav>
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
