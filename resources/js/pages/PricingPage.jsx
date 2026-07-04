import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const PLANS = [
  {
    name: 'Gratuit',
    price: '0 €',
    period: '',
    features: [
      'Profil et parcours scolaire',
      'Tests de personnalité',
      'Test de QI',
      'Matching métiers (top 15)',
      'Rapport initial PDF',
    ],
    cta: 'Commencer',
    popular: false,
  },
  {
    name: 'Premium',
    price: '14 900 FCFA',
    period: '/trimestre',
    priceId: 'price_premium_quarterly',
    durationMonths: 3,
    features: [
      'Tout le niveau Gratuit',
      'Roadmap de carrière personnalisée',
      'Conseiller IA illimité',
      'Rapports PDF complets (QI, SWOT)',
      'Analyse des écarts de compétences',
      'Suggestions de formation',
    ],
    cta: "S'abonner",
    popular: true,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');

  const checkoutMutation = useMutation({
    mutationFn: ({ priceId, durationMonths }) =>
      client.post('/subscriptions/checkout', {
        price_id: priceId,
        duration_months: durationMonths,
      }).then(r => r.data),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const handleSubscribe = (plan) => {
    if (!user) {
      navigate('/register');
      return;
    }
    checkoutMutation.mutate({
      priceId: plan.priceId,
      durationMonths: plan.durationMonths,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      {canceled && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-sm text-yellow-700 dark:text-yellow-300">
          Paiement annulé. Aucun montant n'a été débité.
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choisissez votre formule
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Accédez à des outils d'orientation personnalisés pour construire votre avenir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`rounded-xl p-6 border-2 ${
            plan.popular
              ? 'border-indigo-500 bg-white dark:bg-gray-800 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}>
            {plan.popular && (
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full mb-4">
                Populaire
              </span>
            )}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
            <p className="mt-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
              <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
            </p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => plan.popular ? handleSubscribe(plan) : navigate('/register')}
              disabled={checkoutMutation.isPending}
              className={`mt-8 w-full py-2 rounded-lg font-medium text-sm ${
                plan.popular
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {checkoutMutation.isPending ? 'Redirection vers Stripe...' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400">
          Paiement sécurisé par Stripe. Vous pouvez annuler à tout moment depuis votre profil.
        </p>
      </div>
    </div>
  );
}
