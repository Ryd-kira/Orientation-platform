import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { WIZARD_STEPS } from '../../types';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then(r => r.data),
    retry: false,
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => client.get('/subscriptions/status').then(r => r.data),
    retry: false,
  });

  const isPremium = subscription?.is_premium;

  const stats = [
    { label: 'Tests de personnalité', value: profile?.personality_tests_count ?? 0, link: '/wizard/personnalite' },
    { label: 'Tests de QI', value: profile?.qi_tests_count ?? 0, link: '/wizard/aptitudes' },
    { label: 'Métiers matchés', value: profile?.matched_careers ?? '—', link: '/wizard/marche' },
    { label: 'Profil complété', value: profile?.profile_completed ? 'Oui' : 'Non', link: '/wizard/profil' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bonjour, {user?.name} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isPremium ? 'Compte Premium · Merci de votre confiance' : 'Compte Gratuit · Passez à Premium pour débloquer toutes les fonctionnalités'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.link}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Mon parcours</h2>
        <div className="space-y-3">
          {WIZARD_STEPS.map((step, i) => (
            <Link key={step.step} to={step.route}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {step.step}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{step.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {i === 0 ? 'À compléter' : i < WIZARD_STEPS.length ? 'Optionnel' : 'Complété'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!isPremium && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Passez à Premium</h2>
          <p className="text-sm opacity-90 mb-4">
            Générez des roadmaps personnalisées, accédez au Conseiller IA, téléchargez des rapports complets et plus encore.
          </p>
          <Link to="/pricing"
            className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
            Voir les offres
          </Link>
        </div>
      )}
    </div>
  );
}
