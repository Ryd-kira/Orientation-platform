import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { academicRecordSchema } from '../../lib/validators';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';
import { useState } from 'react';

export default function AcademicStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { completeStep } = useWizardProgress();
  const [records, setRecords] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(academicRecordSchema),
  });

  const { data: existingRecords } = useQuery({
    queryKey: ['academic-records'],
    queryFn: () => client.get('/academic-records').then(r => r.data),
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: (data) => client.post('/academic-records', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic-records'] });
      reset({ diploma: '', field_of_study: '', institution: '', grade: '', start_date: '', end_date: '', disliked_subjects: [] });
    },
  });

  const saveAll = () => {
    completeStep(2, { records: existingRecords || [] });
    navigate('/wizard/interets');
  };

  const handleAdd = handleSubmit((data) => {
    addMutation.mutate(data);
  });

  return (
    <WizardContainer>
      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-6">
        <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-2">Diplôme</label>
            <input type="text" {...register('diploma')} placeholder="Ex: BAC Scientifique"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            {errors.diploma && <p className="mt-2 text-xs text-red-600">{errors.diploma.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Domaine</label>
            <input type="text" {...register('field_of_study')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Établissement</label>
            <input type="text" {...register('institution')}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Moyenne</label>
            <input type="text" {...register('grade')} placeholder="Ex: 14/20"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-2">Début</label>
              <input type="date" {...register('start_date')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-2">Fin</label>
              <input type="date" {...register('end_date')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={addMutation.isPending}
              className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:opacity-50">
              + Ajouter ce diplôme
            </button>
          </div>
        </form>

        {existingRecords?.length > 0 && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Diplômes enregistrés</h3>
            <ul className="space-y-2">
              {existingRecords.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-3xl bg-white p-4 ring-1 ring-slate-200">
                  <span className="text-sm text-slate-700">{r.diploma} — {r.institution}</span>
                  <span className="text-xs text-slate-500">{r.grade}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button onClick={saveAll}
            className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500">
            Suivant →
          </button>
        </div>
      </div>
    </WizardContainer>
  );
}
