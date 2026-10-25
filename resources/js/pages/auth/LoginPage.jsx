import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validators';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fa] px-4 py-5 sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-6xl items-stretch gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="order-2 flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-slate-950 p-7 text-white shadow-[0_24px_60px_-36px_rgba(2,6,23,0.65)] sm:p-10 lg:order-1 lg:min-h-[38rem]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-950">P</span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Pathfinder AI</span>
                <span className="mt-0.5 block text-sm text-slate-300">Votre orientation, étape par étape</span>
              </span>
            </Link>
            <h1 className="mt-10 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Reprenez le fil de votre projet professionnel.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Connectez-vous pour retrouver les informations, les résultats et les pistes que vous avez enregistrés dans votre espace.
            </p>
          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <p className="text-sm font-semibold text-cyan-100">Votre espace rassemble</p>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-1">
              {['Votre profil et votre parcours', 'Vos questionnaires et résultats', 'Vos pistes et prochaines étapes'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-300/15 text-[10px] text-cyan-200">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="order-1 flex items-center rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] ring-1 ring-slate-200 sm:p-10 lg:order-2 lg:p-12">
          <div className="mx-auto w-full max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Connexion</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Entrez vos identifiants pour accéder à votre espace Pathfinder.</p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-800">Email</label>
              <input id="login-email" type="email" autoComplete="email" {...register('email')}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" />
              {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-800">Mot de passe</label>
              <input id="login-password" type="password" autoComplete="current-password" {...register('password')}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" />
              {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-50">
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Pas encore de compte ?{' '}
            <Link to="/register" className="rounded font-semibold text-cyan-800 underline decoration-cyan-300 underline-offset-4 hover:text-cyan-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700">
              Créer un compte
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
