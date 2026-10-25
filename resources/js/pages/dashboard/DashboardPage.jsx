import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);
  const [reportError, setReportError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then((response) => response.data).catch((error) => {
      if (error.response?.status === 404) return null;
      throw error;
    }),
    retry: false,
  });

  const { data: subscription, isLoading: isSubscriptionLoading, isError: isSubscriptionError, refetch: refetchSubscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => client.get('/subscriptions/status').then((response) => response.data),
    retry: false,
  });

  const { data: qiTest, isLoading: isQiLoading, isError: isQiError, refetch: refetchQi } = useQuery({
    queryKey: ['qi-test', 'latest'],
    queryFn: () => client.get('/qi-tests/latest').then((response) => response.data).catch((error) => {
      if (error.response?.status === 404) return null;
      throw error;
    }),
    retry: false,
  });

  const { data: careerMatches, isLoading: isCareerLoading, isError: isCareerError, refetch: refetchCareers } = useQuery({
    queryKey: ['career-match'],
    queryFn: () => client.get('/career/match').then((response) => response.data),
    retry: false,
  });

  const { data: coherence, isError: isCoherenceError } = useQuery({
    queryKey: ['career-coherence', profile?.target_job_title],
    queryFn: () => client.get('/career/coherence', {
      params: { job_title: profile?.target_job_title },
    }).then((response) => response.data),
    enabled: Boolean(profile?.target_job_title),
    retry: false,
  });

  const { data: reports, isLoading: areReportsLoading, isError: areReportsError, refetch: refetchReports } = useQuery({
    queryKey: ['reports'],
    queryFn: () => client.get('/reports').then((response) => response.data),
    retry: false,
  });

  const exportReport = async () => {
    if (isSubscriptionLoading) return;

    if (isSubscriptionError) {
      setReportError('Impossible de vérifier votre abonnement. Réessayez avant de lancer un export.');
      await refetchSubscription();
      return;
    }

    if (!subscription?.is_premium) {
      setShowPaywall(true);
      return;
    }

    setIsExporting(true);
    setReportError('');
    try {
      const { data: report } = await client.post('/reports/generate/initial');
      const { data: pdf } = await client.get(`/reports/${report.id}/download`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_orientation_${report.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response?.status === 402) {
        setShowPaywall(true);
      } else {
        setReportError(error.response?.data?.message || 'Impossible de générer le rapport. Réessayez.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const iqScore = qiTest?.status === 'completed' ? qiTest.iq_score : null;
  const targetJob = profile?.target_job_title;
  const targetMatches = careerMatches?.matches ?? [];
  const topMatch = targetMatches[0];
  const criticalAlerts = coherence?.results?.filter((item) => !item.coherent) ?? [];
  const latestReport = reports?.[0];

  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-white p-8 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.15)] ring-1 ring-slate-200">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">Bonjour, {user?.name || 'Bienvenue'}</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">Votre orientation, en un coup d’œil</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Retrouvez vos résultats, vos pistes de carrière et les prochaines étapes de votre parcours.
        </p>
      </section>

      {criticalAlerts.length > 0 && (
        <section className="rounded-4xl border border-amber-300 bg-amber-50 p-6 ring-1 ring-amber-200" role="alert">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-900">Alerte de faisabilité budgétaire</p>
          <ul className="mt-3 space-y-2 text-sm text-amber-950">
            {criticalAlerts.map((alert) => (
              <li key={alert.job_title}>
                <strong>{alert.job_title} :</strong> {alert.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">Compatibilité métier</p>
          {isProfileLoading || isCareerLoading ? (
            <p className="mt-4 text-sm text-slate-600" role="status">Chargement de vos pistes de métiers…</p>
          ) : isProfileError || isCareerError ? (
            <div className="mt-4">
              <p className="text-sm text-red-800" role="alert">Vos pistes n’ont pas pu être chargées.</p>
              <button type="button" onClick={() => { refetchProfile(); refetchCareers(); }} className="mt-3 rounded font-semibold text-cyan-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
                Réessayer
              </button>
            </div>
          ) : topMatch ? (
            <>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">{targetJob || topMatch.job_title}</h2>
              <p className="mt-2 text-slate-600">Piste la plus compatible : {topMatch.job_title}</p>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{topMatch.score}%</p>
              <p className="mt-1 text-sm text-slate-600">{topMatch.compatibility_label}</p>
              <p className="mt-3 text-xs leading-5 text-slate-600">Estimation calculée à partir de votre profil et de la base métier disponible, pas d’une analyse du marché en temps réel.</p>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-slate-600">{careerMatches?.message || 'Complétez votre profil pour obtenir des recommandations de carrière personnalisées.'}</p>
              <Link to="/profil" className="mt-4 inline-flex font-semibold text-cyan-800 underline">Compléter mon profil</Link>
            </div>
          )}
        </section>

        <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">Test d’aptitudes gratuit</p>
          {isQiLoading ? (
            <p className="mt-4 text-sm text-slate-600" role="status">Chargement de vos résultats…</p>
          ) : isQiError ? (
            <div className="mt-4">
              <p className="text-sm text-red-800" role="alert">Le résultat du questionnaire n’a pas pu être chargé.</p>
              <button type="button" onClick={() => refetchQi()} className="mt-3 rounded font-semibold text-cyan-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
                Réessayer
              </button>
            </div>
          ) : iqScore !== null ? (
            <>
              <p className="mt-4 text-5xl font-semibold text-slate-950">{iqScore}</p>
              <p className="mt-2 text-sm text-slate-600">Score indicatif du questionnaire d’aptitudes</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Ce questionnaire n’est pas un test psychométrique standardisé et ne constitue pas une mesure clinique du QI.
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Vous n’avez pas encore terminé le questionnaire d’aptitudes.</p>
          )}
          <Link
            to="/wizard/aptitudes"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-cyan-700 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            {iqScore !== null ? 'Voir mes résultats' : 'Passer le questionnaire'}
          </Link>
        </section>
      </div>

      <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-700">Rapport de synthèse PDF</p>
            <p className="mt-2 text-sm text-slate-600">
              {areReportsLoading
                ? 'Chargement de vos rapports…'
                : areReportsError
                  ? 'Vos rapports ne sont pas disponibles pour le moment.'
                  : latestReport
                    ? 'Générez un rapport actualisé à partir de votre profil.'
                    : 'Exportez votre synthèse personnalisée au format PDF.'}
            </p>
          </div>
          {isSubscriptionLoading ? (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700" role="status">Vérification de l’abonnement…</span>
          ) : isSubscriptionError ? (
            <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950">Abonnement indisponible</span>
          ) : !subscription?.is_premium && (
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">Réservé à Premium</span>
          )}
        </div>
        <button
          type="button"
          onClick={exportReport}
          disabled={isExporting || isSubscriptionLoading || isSubscriptionError}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-cyan-800 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-900 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 sm:w-auto"
        >
          {isExporting
            ? 'Génération du rapport…'
            : isSubscriptionLoading
              ? 'Vérification de l’abonnement…'
              : 'Télécharger mon rapport PDF'}
        </button>
        {reportError && <p className="mt-3 text-sm text-red-700" role="alert">{reportError}</p>}
        {isSubscriptionError && (
          <button type="button" onClick={() => refetchSubscription()} className="mt-3 ml-3 rounded font-semibold text-cyan-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
            Réessayer
          </button>
        )}
        {isCoherenceError && targetJob && (
          <p className="mt-3 text-sm text-amber-950" role="status">La vérification budgétaire du métier choisi est momentanément indisponible.</p>
        )}
        {areReportsError && (
          <button type="button" onClick={() => refetchReports()} className="mt-3 block rounded font-semibold text-cyan-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
            Recharger mes rapports
          </button>
        )}
      </section>

      <nav aria-label="Actions rapides" className="grid gap-4 sm:grid-cols-3">
        <Link to="/profil" className="rounded-4xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">Compléter mon profil</Link>
        <Link to="/wizard/scolaire" className="rounded-4xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">Ajouter mon parcours scolaire</Link>
        <Link to="/wizard/metier-reve" className="rounded-4xl border border-slate-200 bg-white p-5 font-semibold text-slate-900 hover:border-cyan-300">Analyser mon métier de rêve</Link>
      </nav>

      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowPaywall(false);
        }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-paywall-title"
            className="w-full max-w-md rounded-4xl bg-white p-8 shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">Fonctionnalité Premium</p>
            <h2 id="report-paywall-title" className="mt-3 text-2xl font-semibold text-slate-950">Débloquez vos rapports PDF</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">L’export de vos synthèses est réservé aux membres Premium.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowPaywall(false)} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800">
                Plus tard
              </button>
              <Link to="/pricing" onClick={() => setShowPaywall(false)} className="rounded-full bg-cyan-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-cyan-800">
                Découvrir Premium
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
