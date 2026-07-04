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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diplôme</label>
            <input type="text" {...register('diploma')} placeholder="Ex: BAC Scientifique"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            {errors.diploma && <p className="text-red-500 text-xs mt-1">{errors.diploma.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Domaine</label>
            <input type="text" {...register('field_of_study')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Établissement</label>
            <input type="text" {...register('institution')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moyenne</label>
            <input type="text" {...register('grade')} placeholder="Ex: 14/20"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Début</label>
              <input type="date" {...register('start_date')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fin</label>
              <input type="date" {...register('end_date')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={addMutation.isPending}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm">
              + Ajouter ce diplôme
            </button>
          </div>
        </form>

        {(existingRecords?.length > 0) && (
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Diplômes enregistrés</h3>
            <ul className="space-y-2">
              {existingRecords.map((r) => (
                <li key={r.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{r.diploma} — {r.institution}</span>
                  <span className="text-xs text-gray-400">{r.grade}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
          <button onClick={saveAll}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            Suivant →
          </button>
        </div>
      </div>
    </WizardContainer>
  );
}
