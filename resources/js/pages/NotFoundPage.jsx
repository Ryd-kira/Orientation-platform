import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 flex items-center justify-center">
          <div className="max-w-3xl rounded-4xl bg-white p-12 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.2)] ring-1 ring-slate-200 text-center">
        <div className="mx-auto mb-8 h-44 w-44 rounded-full bg-cyan-50 flex items-center justify-center ring-1 ring-cyan-100">
          <span className="text-5xl font-bold text-cyan-600">404</span>
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Page introuvable</p>
        <h1 className="mt-6 text-4xl font-semibold text-slate-950">Path Not Found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Oups, le chemin que vous recherchez est absent. Revenez au dashboard ou contactez le support pour retrouver votre route.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/dashboard" className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Retour au dashboard
          </Link>
          <Link to="/assistant" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50">
            Contacter le support
          </Link>
        </div>
      </div>
    </div>
  );
}
