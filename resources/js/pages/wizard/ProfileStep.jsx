import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { profileSchema } from '../../lib/validators';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

export default function ProfileStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { completeStep, stepData } = useWizardProgress();

  const { data: existingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => client.get('/profile').then(r => r.data),
    retry: false,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: existingProfile || stepData[1] || {},
  });

  const mutation = useMutation({
    mutationFn: (data) => {
      if (existingProfile?.id) {
        return client.put('/profile', data).then(r => r.data);
      }
      return client.post('/profile', data).then(r => r.data);
    },
    onSuccess: (data) => {
      completeStep(1, data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/wizard/scolaire');
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <WizardContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Âge</label>
            <input type="number" {...register('age', { valueAsNumber: true })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            {errors.age && <p className="mt-2 text-xs text-red-600">{errors.age.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Genre</label>
            <select {...register('gender')} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100">
              <option value="">Sélectionner</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Ville</label>
            <input type="text" {...register('city')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Région</label>
            <input type="text" {...register('region')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Pays</label>
            <input type="text" {...register('country')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Budget études (€)</label>
            <input type="number" {...register('budget', { valueAsNumber: true })}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Métier cible</label>
          <input type="text" {...register('target_job_title')} placeholder="Ex: Développeur Web"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Description du métier visé</label>
          <textarea {...register('target_job_description')} rows={3}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Bio / Présentation</label>
          <textarea {...register('bio')} rows={2}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
        </div>

        {mutation.isError && (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {mutation.error?.response?.data?.message || "Erreur lors de l'enregistrement"}
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting || mutation.isPending}
            className="rounded-full bg-cyan-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:opacity-50">
            {mutation.isPending ? 'Enregistrement...' : 'Suivant →'}
          </button>
        </div>
      </form>
    </WizardContainer>
  );
}
