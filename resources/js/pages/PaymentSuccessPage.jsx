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
      }).then(r => r.data),
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Activation de votre abonnement...
            </h1>
            <p className="text-gray-500">Veuillez patienter.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Paiement réussi !
            </h1>
            <p className="text-gray-500">Vous êtes maintenant membre Premium. Redirection...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Erreur
            </h1>
            <p className="text-gray-500 mb-4">Une erreur est survenue. Contactez le support.</p>
            <button onClick={() => navigate('/pricing')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
              Réessayer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
