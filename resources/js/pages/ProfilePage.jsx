import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import client from '../api/client';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => client.get('/me').then((r) => r.data),
  });

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => client.get('/subscriptions/status').then((r) => r.data),
    retry: false,
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: user?.profile || {},
  });
  const profileFields = [
    user?.profile?.age,
    user?.profile?.city,
    user?.profile?.region,
    user?.profile?.budget,
    user?.profile?.target_job_title,
    user?.profile?.bio,
  ];
  const completedProfileFields = profileFields.filter((value) => value !== null && value !== undefined && value !== '').length;

  const updateMutation = useMutation({
    mutationFn: (data) => client.put('/profile', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  return (
    <div className="space-y-8 py-10">
      <section className="rounded-4xl bg-white p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Profil utilisateur</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">{user?.name || 'Mon profil'}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Gérez vos informations, suivez votre progression et adaptez votre parcours à vos objectifs de carrière.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Abonnement</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">{subscription?.is_premium ? 'Premium' : 'Gratuit'}</p>
            </div>
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Profil renseigné</p>
              <p className="mt-3 text-lg font-semibold text-slate-950">{completedProfileFields}/{profileFields.length} informations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-4xl bg-white p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-950">Informations personnelles</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nom</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{user?.name || '—'}</p>
            </div>
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{user?.email || '—'}</p>
            </div>
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Métier cible</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{user?.profile?.target_job_title || 'Pas encore défini'}</p>
            </div>
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Localisation</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{user?.profile?.city || 'Non renseignée'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-950">Votre parcours</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">Parcours scolaire enregistré</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{user?.academic_records?.length ?? 0}</p>
            </div>
            <div className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">Abonnement</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{subscription?.is_premium ? 'Premium' : 'Gratuit'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-4xl bg-white p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">Modifier le profil</h2>
            <p className="mt-2 text-sm text-slate-600">Mettez à jour vos critères professionnels et vos contraintes.</p>
          </div>
          <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">Dernière modification : aujourd'hui</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-600">Âge
              <input
                type="number"
                {...register('age', { valueAsNumber: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <label className="block text-sm text-slate-600">Budget études (€)
              <input
                type="number"
                {...register('budget', { valueAsNumber: true })}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-600">Ville
              <input
                type="text"
                {...register('city')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <label className="block text-sm text-slate-600">Région
              <input
                type="text"
                {...register('region')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-600">Métier cible
              <input
                type="text"
                {...register('target_job_title')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
            <label className="block text-sm text-slate-600">Objectif professionnel
              <input
                type="text"
                {...register('target_job_description')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm text-slate-600">Bio / Présentation
              <textarea
                {...register('bio')}
                rows={3}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || updateMutation.isPending}
            className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          {updateMutation.isSuccess && (
            <p className="text-sm text-emerald-600">Profil mis à jour avec succès.</p>
          )}
        </form>
      </section>
    </div>
  );
}
