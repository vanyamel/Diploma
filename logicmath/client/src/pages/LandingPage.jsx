import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Target, Trophy, ArrowRight, Zap } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
      title: 'Розвиток логіки',
      desc: 'Тренуй мозок за допомогою класичних математичних послідовностей та фракталів.',
      color: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      icon: <Target className="w-8 h-8 text-emerald-400" />,
      title: 'Інтерактивні задачі',
      desc: 'Не просто спостерігай, а взаємодій: вписуй числа, обирай варіанти, будуй фігури.',
      color: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: 'Гейміфікація',
      desc: 'Заробляй XP, підтримуй серію відповідей та змагайся з іншими в лідерборді.',
      color: 'bg-yellow-500/10 border-yellow-500/20'
    }
  ];

  return (
    <div className="flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 mb-8 backdrop-blur text-sm text-slate-300 shadow-lg">
           <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div> */}

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Математика, що <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              стає грою
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Покращуй аналітичне мислення через інтерактивні завдання. Від трикутника Паскаля до фракталів — відкрий для себе красу закономірностей.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/catalog" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl shadow-white/10 hover:scale-105">
              Почати навчання
              <ArrowRight size={20} />
            </Link>
            <Link to="/leaderboard" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-lg transition-all border border-slate-700 hover:border-slate-600 shadow-lg">
              <Trophy size={20} className="text-yellow-400" />
              Топ гравців
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/50 relative z-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Як це працює?</h2>
            <p className="text-slate-400">Три кроки до математичної майстерності</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className={`p-8 rounded-3xl border bg-slate-900/80 backdrop-blur-sm transition-transform hover:-translate-y-2 shadow-xl ${f.color}`}>
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Готовий перевірити себе?</h2>
            <p className="text-blue-200 mb-10 max-w-xl mx-auto relative z-10 text-lg">
              Доєднуйся до сотень користувачів, які щодня покращують свої навички.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 relative z-10">
              <Zap size={20} />
              Створити акаунт безкоштовно
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
