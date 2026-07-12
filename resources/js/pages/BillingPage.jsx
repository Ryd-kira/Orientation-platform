import { useQuery } from '@tanstack/react-query';
import client from '../api/client';

export default function BillingPage() {
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => client.get('/subscriptions/status').then((r) => r.data),
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Settings › Billing</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Facturation & Abonnements</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-4xl bg-white p-6 ring-1 ring-slate-200">
            <p className="text-sm font-semibold">Plan actuel</p>
            <p className="mt-3 text-lg font-semibold">{subscription?.plan_name || 'Aucun'}</p>
            <p className="mt-2 text-sm text-slate-600">{subscription?.status || 'Non abonné'}</p>
          </div>

          <div className="md:col-span-2 rounded-4xl bg-white p-6 ring-1 ring-slate-200">
            <p className="text-sm font-semibold">Historique des paiements</p>
            <div className="mt-4 text-sm text-slate-600">Aucun historique disponible.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
