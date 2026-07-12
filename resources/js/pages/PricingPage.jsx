import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
      }).then((r) => r.data),
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
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        {canceled && (
          <div className="rounded-3xl bg-amber-50 p-4 ring-1 ring-amber-200 text-sm text-amber-700">
            Paiement annulé. Aucun montant n'a été débité.
          </div>
        )}

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Offres</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Choisissez la formule qui accélère votre carrière</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Accédez à des outils d’orientation personnalisés pour construire votre avenir avec l’IA.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-4xl p-8 ring-1 ${
                plan.popular ? 'bg-white ring-cyan-200 shadow-[0_20px_50px_-30px_rgba(14,165,233,0.25)]' : 'bg-white ring-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
                  Populaire
                </span>
              )}
              <h2 className="mt-6 text-2xl font-bold text-slate-950">{plan.name}</h2>
              <p className="mt-4 text-4xl font-semibold text-slate-950">
                {plan.price} <span className="text-lg font-medium text-slate-500">{plan.period}</span>
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => plan.popular ? handleSubscribe(plan) : navigate('/register')}
                disabled={checkoutMutation.isPending}
                className={`mt-10 w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.popular
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200 disabled:opacity-50'
                }`}
              >
                {checkoutMutation.isPending ? 'Redirection vers Stripe...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-4xl bg-white p-6 ring-1 ring-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Paiement sécurisé par Stripe. Vous pouvez annuler à tout moment depuis votre profil.
          </p>
        </div>
      </div>
    </div>
  );
}
