import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PaywallPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-4xl bg-white p-8 ring-1 ring-slate-200 text-center">
          <h1 className="text-3xl font-semibold text-slate-950">Passez à l'offre Premium</h1>
          <p className="mt-4 text-sm text-slate-600">Déverrouillez le conseiller IA illimité, les rapports PDF complets et des roadmaps personnalisées.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => navigate('/pricing')}
              className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
              Voir les offres
            </button>
            <button
              onClick={() => user ? navigate('/billing') : navigate('/register')}
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              S'abonner maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
