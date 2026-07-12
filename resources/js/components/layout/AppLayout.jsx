import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Assistant IA', to: '/assistant' },
  { label: 'Roadmap carrière', to: '/career-roadmap' },
  { label: 'Learning Lab', to: '/learning-lab' },
  { label: 'Profil', to: '/profil' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden lg:flex lg:w-80 lg:flex-col border-r border-slate-200 bg-white shadow-sm">
          <div className="px-8 py-8">
            <Link to="/dashboard" className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white text-lg font-bold">P</span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Career Intelligence</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">Pathfinder AI</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-6 py-4 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-3xl px-5 py-4 text-sm font-semibold transition ${
                    active
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-200/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 pb-8">
            <div className="rounded-4xl bg-linear-to-r from-cyan-600 via-slate-900 to-cyan-600 p-6 text-white shadow-xl shadow-slate-300/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">Premium</p>
              <p className="mt-3 text-sm leading-6 text-slate-200/90">Passez Premium pour débloquer le conseiller IA, des roadmaps sur-mesure et un accompagnement prioritaire.</p>
              <button
                type="button"
                onClick={() => navigate('/pricing')}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm">
                Voir les offres
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
              Se déconnecter
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <Link to="/dashboard" className="text-lg font-semibold text-slate-950">Pathfinder AI</Link>
              <button
                onClick={() => navigate('/pricing')}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                Premium
              </button>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="rounded-4xl bg-white p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.25)] ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Tableau de bord</p>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-950">Bonjour, {user?.name}</h1>
                    <p className="mt-2 text-sm text-slate-600">Votre espace Pathfinder AI pour suivre vos tests, votre roadmap et votre conseiller.</p>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    {user?.subscription?.is_premium ? 'Premium activé' : 'Plan Gratuit'}
                  </div>
                </div>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
