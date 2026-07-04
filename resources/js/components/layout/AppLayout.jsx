import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                Orientation IA
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">Tableau de bord</Link>
                <Link to="/wizard/profil" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">Mon parcours</Link>
                <Link to="/assistant" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">Conseiller IA</Link>
                <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">Premium</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</span>
              <Link to="/profil" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600">Profil</Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Déconnexion</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
