import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { dreamJobSchema } from '../../lib/validators';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';
import { useState } from 'react';

export default function DreamJobStep() {
  const navigate = useNavigate();
  const { completeStep } = useWizardProgress();
  const [result, setResult] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(dreamJobSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => client.post('/dream-job/analyze', data).then(r => r.data),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  const handleNext = () => {
    completeStep(4, result);
    navigate('/wizard/personnalite');
  };

  return (
    <WizardContainer>
      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Décris le métier de tes rêves. Notre IA l'analysera pour évaluer sa compatibilité avec ton profil.
          </p>
          <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">Rêve de carrière</p>
            <p className="mt-2 text-sm text-slate-500">Plus vous détaillez, plus l’analyse sera pertinente.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Métier rêvé</label>
            <input type="text" {...register('job_title')} placeholder="Ex: Développeur Web"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            {errors.job_title && <p className="mt-2 text-xs text-red-600">{errors.job_title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Description (pourquoi ce métier ?)</label>
            <textarea {...register('job_description')} rows={4} placeholder="Explique ce qui t'attire dans ce métier..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <button type="submit" disabled={mutation.isPending}
            className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:opacity-50">
            {mutation.isPending ? 'Analyse...' : 'Analyser'}
          </button>
        </form>

        {mutation.isError && (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {mutation.error?.response?.data?.message || "Erreur d'analyse"}
          </div>
        )}

        {result && (
          <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="font-semibold text-slate-900">Score de compatibilité : {result.compatibility_score}%</p>
            <p className="mt-2 text-sm text-slate-600">{result.nlp_analysis?.summary || 'Analyse terminée.'}</p>
            <button onClick={handleNext}
              className="mt-4 rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500">
              Suivant →
            </button>
          </div>
        )}
      </div>
    </WizardContainer>
  );
}
