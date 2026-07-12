import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../lib/validators';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await registerUser(data.name, data.email, data.password, data.password_confirmation);
      navigate('/wizard/profil');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-4xl bg-white p-10 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.2)] ring-1 ring-slate-200">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-600">Pathfinder AI</p>
          <h1 className="mt-6 text-4xl font-semibold text-slate-950">Commencez votre parcours IA dès aujourd’hui.</h1>
          <p className="mt-4 max-w-xl text-slate-600 leading-7">
            Créez votre compte pour accéder aux recommandations métiers, aux tests personnalisés et aux scénarios de carrière adaptés à votre profil.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Suivi de progression clair',
              'Accès au learning lab',
              'Rapports PDF intelligents',
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-4xl bg-white p-10 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.2)] ring-1 ring-slate-200">
          <h2 className="text-3xl font-semibold text-slate-950">Créer un compte</h2>
          <p className="mt-2 text-sm text-slate-500">Entrez vos informations pour rejoindre Pathfinder AI.</p>

          {error && (
            <div className="mt-6 rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
              <input type="text" {...register('name')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input type="email" {...register('email')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
              <input type="password" {...register('password')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer le mot de passe</label>
              <input type="password" {...register('password_confirmation')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" />
              {errors.password_confirmation && <p className="mt-2 text-xs text-red-600">{errors.password_confirmation.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50">
              {isSubmitting ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-cyan-600 hover:text-cyan-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
