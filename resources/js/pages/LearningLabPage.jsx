import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function LearningLabPage() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then((response) => response.data).catch((error) => {
      if (error.response?.status === 404) return null;
      throw error;
    }),
    retry: false,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['assistant-courses'],
    queryFn: () => client.get('/assistant/courses').then((response) => response.data),
    retry: false,
  });

  const recommendations = data?.recommendations ?? [];
  const isPremiumRequired = error?.response?.status === 402;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-[0_24px_60px_-36px_rgba(2,6,23,0.6)] sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-200">Learning Lab</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {profile?.target_job_title
                ? `Développez les compétences pour viser ${profile.target_job_title}.`
                : 'Des pistes de formation liées à votre projet.'}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-cyan-50 sm:text-base">
              Les suggestions sont établies à partir des compétences associées à votre métier cible et de votre feuille de route.
            </p>
          </div>
          <Link to="/career-roadmap" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
            Voir ma feuille de route
          </Link>
        </div>
      </section>

      {isLoading ? (
        <p className="rounded-3xl bg-white p-6 text-sm text-slate-700 ring-1 ring-slate-200" role="status">Chargement des pistes de formation…</p>
      ) : isPremiumRequired ? (
        <section className="rounded-[1.5rem] bg-white p-7 ring-1 ring-slate-200 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">Le Learning Lab est réservé à Premium</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            Passez à Premium pour consulter les suggestions de formation reliées aux compétences de votre projet.
          </p>
          <Link to="/pricing" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-800 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2">
            Découvrir les offres
          </Link>
        </section>
      ) : isError ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6" role="alert">
          <p className="text-sm font-medium text-red-900">Les recommandations n’ont pas pu être chargées.</p>
          <button type="button" onClick={() => refetch()} className="mt-3 rounded font-semibold text-red-900 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700">
            Réessayer
          </button>
        </section>
      ) : recommendations.length === 0 ? (
        <section className="rounded-[1.5rem] bg-white p-7 ring-1 ring-slate-200 sm:p-9">
          <h2 className="text-xl font-semibold text-slate-950">Pas encore de piste de formation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            {data?.message || 'Renseignez votre métier cible et générez une feuille de route pour faire apparaître des compétences à développer.'}
          </p>
          {!profile?.target_job_title && (
            <Link to="/profil" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
              Renseigner mon métier cible
            </Link>
          )}
        </section>
      ) : (
        <>
          <section className="rounded-[1.5rem] bg-white p-6 ring-1 ring-slate-200 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950">Compétences identifiées</h2>
                <p className="mt-2 text-sm text-slate-700">À partir de votre feuille de route enregistrée.</p>
              </div>
              <span className="text-sm text-slate-600">{recommendations.length} compétence{recommendations.length > 1 ? 's' : ''}</span>
            </div>
            <ul className="mt-6 divide-y divide-slate-200">
              {recommendations.map((recommendation) => (
                <li key={recommendation.skill} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-slate-950">{recommendation.skill}</span>
                  <span className="text-sm text-slate-700">Niveau visé : {recommendation.required_level}/5</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-slate-950">Pistes de formation</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Ces pistes sont des suggestions générées depuis les compétences métier. Les catalogues et disponibilités des plateformes ne sont pas vérifiés en temps réel.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {recommendations.flatMap((recommendation) =>
                (recommendation.courses ?? []).map((course) => (
                  <article key={`${recommendation.skill}-${course.name}`} className="rounded-[1.25rem] bg-white p-6 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">{recommendation.skill}</p>
                    <h3 className="mt-3 text-lg font-semibold text-slate-950">{course.name}</h3>
                    <p className="mt-2 text-sm text-slate-700">{course.platform}</p>
                    {course.url ? (
                      <a href={course.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-10 items-center font-semibold text-cyan-900 underline decoration-cyan-300 underline-offset-4 hover:text-cyan-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
                        Consulter la formation
                      </a>
                    ) : (
                      <p className="mt-5 text-xs text-slate-600">Lien de formation non renseigné</p>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
