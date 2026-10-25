import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import client from '../api/client';

function money(value) {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Number(value));
}

export default function CareerRoadmapPage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useQuery({
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

  const { data: roadmaps = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['career-roadmaps'],
    queryFn: () => client.get('/career/roadmaps').then((response) => response.data),
    retry: false,
  });

  const latestRoadmap = roadmaps[0];
  const roadmapData = latestRoadmap?.roadmap_data;
  const roadmapSteps = roadmapData?.steps ?? [];
  const skillGaps = latestRoadmap?.skill_gaps ?? [];
  const targetJob = profile?.target_job_title;

  const generateMutation = useMutation({
    mutationFn: () => client.post('/career/roadmap', { target_job: targetJob }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['career-roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['career-skill-gaps'] });
    },
  });

  const studyCost = roadmapData?.estimated_total_study_cost;
  const declaredBudget = roadmapData?.budget_declared;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-[0_24px_60px_-36px_rgba(2,6,23,0.6)] sm:p-10">
        <p className="text-sm font-medium text-cyan-200">Votre parcours professionnel</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {latestRoadmap ? `Une feuille de route vers ${latestRoadmap.target_job}.` : 'Construisez votre prochaine étape.'}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {latestRoadmap
                ? 'Les étapes ci-dessous proviennent de votre feuille de route enregistrée et de la fiche métier correspondante.'
                : 'Votre feuille de route sera créée à partir du métier cible renseigné dans votre profil et des données métiers disponibles.'}
            </p>
          </div>
          {latestRoadmap && (
            <p className="shrink-0 text-sm text-slate-300">
              Créée le {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(latestRoadmap.generated_at))}
            </p>
          )}
        </div>
      </section>

      {isLoading || isProfileLoading ? (
        <p className="rounded-3xl bg-white p-6 text-sm text-slate-700 ring-1 ring-slate-200" role="status">Chargement de votre parcours…</p>
      ) : isError || isProfileError ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6" role="alert">
          <p className="text-sm font-medium text-red-900">Impossible de charger votre feuille de route.</p>
          <button type="button" onClick={() => refetch()} className="mt-3 rounded font-semibold text-red-900 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700">
            Réessayer
          </button>
        </section>
      ) : !latestRoadmap ? (
        <section className="rounded-[1.5rem] bg-white p-7 ring-1 ring-slate-200 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">Aucune feuille de route pour le moment</h2>
          {targetJob ? (
            <>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                Votre métier cible est « {targetJob} ». Générez une feuille de route à partir de ce choix.
              </p>
              {subscription?.is_premium ? (
                <button
                  type="button"
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                >
                  {generateMutation.isPending ? 'Création de votre feuille de route…' : 'Générer ma feuille de route'}
                </button>
              ) : (
                isSubscriptionLoading ? (
                  <p className="mt-6 text-sm text-slate-700" role="status">Vérification de votre offre…</p>
                ) : isSubscriptionError ? (
                  <div className="mt-5">
                    <p className="text-sm text-red-800" role="alert">Impossible de vérifier votre offre.</p>
                    <button type="button" onClick={() => refetchSubscription()} className="mt-2 rounded font-semibold text-cyan-900 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <Link to="/pricing" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">
                    Découvrir les offres Premium
                  </Link>
                )
              )}
            </>
          ) : (
            <>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">Indiquez d’abord votre métier cible pour obtenir une feuille de route adaptée.</p>
              <Link to="/profil" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                Renseigner mon profil
              </Link>
            </>
          )}
          {generateMutation.isError && (
            <p className="mt-4 text-sm text-red-800" role="alert">
              {generateMutation.error?.response?.data?.message || 'La feuille de route n’a pas pu être créée. Réessayez.'}
            </p>
          )}
        </section>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">Métier visé</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{latestRoadmap.target_job}</p>
            </section>
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">Étapes définies</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{roadmapSteps.length}</p>
            </section>
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">Secteur</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{roadmapData?.sector || 'Non renseigné'}</p>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[1.5rem] bg-white p-6 ring-1 ring-slate-200 sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">Les étapes de votre parcours</h2>
              {roadmapSteps.length > 0 ? (
                <ol className="mt-7 space-y-0">
                  {roadmapSteps.map((step, index) => (
                    <li key={`${step.step}-${step.title}`} className="relative flex gap-4 pb-7 last:pb-0">
                      {index < roadmapSteps.length - 1 && (
                        <span aria-hidden="true" className="absolute left-[1.05rem] top-10 h-[calc(100%-1.4rem)] w-px bg-slate-200" />
                      )}
                      <span className="relative z-10 flex h-[2.15rem] w-[2.15rem] shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-950">
                        {step.step}
                      </span>
                      <span className="pt-0.5">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-cyan-800">{step.period}</span>
                        <span className="mt-1 block font-semibold text-slate-950">{step.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-700">{step.description}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-slate-700">Aucune étape n’est associée à cette feuille de route.</p>
              )}
              <p className="mt-7 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-600">
                Parcours indicatif calculé à partir de votre profil et des données métiers disponibles. Vérifiez les prérequis auprès des établissements concernés.
              </p>
            </section>

            <aside className="space-y-6">
              <section className="rounded-[1.5rem] bg-white p-6 ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-950">Budget études estimé</h2>
                {studyCost !== null && studyCost !== undefined ? (
                  <>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{money(studyCost)} €</p>
                    {declaredBudget !== null && declaredBudget !== undefined && (
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Budget renseigné : {money(declaredBudget)} €. {roadmapData.budget_sufficient ? 'Il couvre le coût estimé.' : 'Il peut être inférieur au coût estimé.'}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-700">Aucune estimation de coût n’est disponible pour ce métier.</p>
                )}
              </section>

              <section className="rounded-[1.5rem] bg-white p-6 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-slate-950">Compétences à développer</h2>
                  <span className="text-sm text-slate-600">{skillGaps.length}</span>
                </div>
                {skillGaps.length > 0 ? (
                  <ul className="mt-4 divide-y divide-slate-200">
                    {skillGaps.map((gap) => (
                      <li key={gap.id} className="py-3 first:pt-0 last:pb-0">
                        <p className="font-medium text-slate-900">{gap.skill_name}</p>
                        <p className="mt-1 text-sm text-slate-600">Niveau cible : {gap.required_level}/5</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-700">Aucune compétence requise n’a été fournie pour ce métier.</p>
                )}
              </section>
            </aside>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/learning-lab" className="inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-800 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">
              Voir les recommandations de formation
            </Link>
            {subscription?.is_premium && targetJob && targetJob !== latestRoadmap.target_job && (
              <button
                type="button"
                onClick={() => generateMutation.mutate()}
                disabled={generateMutation.isPending}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
              >
                Créer une feuille pour « {targetJob} »
              </button>
            )}
          </div>
          {generateMutation.isError && (
            <p className="text-sm text-red-800" role="alert">
              {generateMutation.error?.response?.data?.message || 'La feuille de route n’a pas pu être créée.'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
