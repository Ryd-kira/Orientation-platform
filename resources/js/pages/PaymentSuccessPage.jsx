import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import client from '../api/client';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  const sessionId = searchParams.get('session_id');
  const duration = searchParams.get('duration') || '3';

  const activateMutation = useMutation({
    mutationFn: () =>
      client.post('/subscriptions/activate', {
        payment_method: 'stripe',
        transaction_id: sessionId,
        duration_months: parseInt(duration),
      }).then((r) => r.data),
    onSuccess: () => {
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    },
    onError: () => {
      setStatus('error');
    },
  });

  useEffect(() => {
    if (sessionId) {
      activateMutation.mutate();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 flex items-center justify-center">
      <div className="max-w-md w-full rounded-4xl bg-white p-10 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.16)] ring-1 ring-slate-200 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-cyan-600 mx-auto mb-5" />
            <h1 className="text-2xl font-semibold text-slate-950 mb-2">Activation de votre abonnement...</h1>
            <p className="text-slate-600">Veuillez patienter pendant que nous activons votre accès Premium.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-950 mb-2">Paiement réussi !</h1>
            <p className="text-slate-600">Votre abonnement Premium est activé. Vous serez redirigé vers le dashboard.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-slate-950 mb-2">Activation échouée</h1>
            <p className="text-slate-600 mb-5">Une erreur est survenue lors de l’activation. Veuillez réessayer ou contacter le support.</p>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500"
            >
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
