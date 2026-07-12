import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then((r) => r.data),
    retry: false,
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => client.get('/subscriptions/status').then((r) => r.data),
    retry: false,
  });

  const readiness = profile?.ai_readiness_score ?? 115;
  const careerTarget = profile?.target_job_title || 'Data Scientist';
  const compatibility = profile?.career_match_score ?? 87;
  const financialFit = profile?.financial_fit_score ?? 45;

  const quickActions = [
    'Finaliser votre profil académique',
    'Passer le test F-QI',
    'Lancer l’analyse de métier',
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.15)] ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Bonjour, {user?.name || 'Alexandre'}</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-950">Votre parcours académique est complet à 85%.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Poursuivez vos évaluations pour affiner votre plan de carrière personnalisé et obtenir des recommandations IA précises.
            </p>
          </div>
          <div className="rounded-3xl bg-cyan-50 px-5 py-4 text-sm text-cyan-700 ring-1 ring-cyan-100">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-600">Phase</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">Phase 2 : Analyse</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-4xl border border-amber-200/70 bg-amber-50/80 p-6 shadow-sm ring-1 ring-amber-200">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-amber-700">Alerte de faisabilité</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">FT-05</h2>
              </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Budget critique
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              Votre budget est inférieur au coût moyen des études visées pour le parcours « Ingénieur IA ». Envisagez des alternatives de financement ou ajustez vos critères.
            </p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Compatibilité Projet Professionnel</p>
                <h3 className="mt-3 text-3xl font-semibold text-slate-950">{compatibility}%</h3>
                <p className="mt-2 text-sm text-slate-500">Métier cible : {careerTarget}</p>
              </div>
              <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                NLP vérifié
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Compétences Techniques</span>
                  <span>92%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-linear-to-r from-cyan-500 to-sky-500" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Soft Skills</span>
                  <span>80%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-linear-to-r from-indigo-600 to-cyan-500" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Adéquation financière</span>
                  <span>{financialFit}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: `${financialFit}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Test F-QI</p>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">Supérieur</p>
              <p className="mt-4 text-5xl font-semibold text-slate-950">{readiness}</p>
              <p className="mt-2 text-sm text-slate-500">Score global</p>
            </div>
            <Link
              to="/wizard/aptitudes"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              Voir les résultats détaillés
            </Link>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Profil académique</p>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Complet</span>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Soft Skills</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">10/10</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Rapport de synthèse</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">Téléchargement prêt</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              Télécharger (PDF)
            </button>
          </div>
        </aside>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {quickActions.map((action) => (
          <div key={action} className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md hover:ring-1 hover:ring-cyan-100 transition">
            <p className="text-sm font-semibold text-slate-950">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
