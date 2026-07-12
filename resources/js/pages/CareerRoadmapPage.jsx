import { Link } from 'react-router-dom';

export default function CareerRoadmapPage() {
  const steps = [
    { title: 'Junior Data Scientist', description: 'Data cleaning, exploration and modeling basics.', status: 'En cours', progress: 65 },
    { title: 'Senior ML Engineer', description: 'Optimisation modèle et production.', status: 'Étape suivante', progress: 40 },
    { title: 'Lead AI Architect', description: 'Conception de systèmes IA à l’échelle.', status: 'Objectif final', progress: 0 },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Career Roadmap</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Architecting your future with a clear plan.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Une feuille de route adaptée à votre profil et à vos contraintes, avec des alertes de réalité et des étapes visibles.
            </p>
          </div>
          <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Compatibilité IA</p>
            <p className="mt-3 text-5xl font-semibold text-slate-950">94%</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Roadmap actuelle</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Votre trajectoire vers Lead AI Architect</h2>
            </div>
            <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">Durée estimée 5-7 ans</span>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.title} className="grid gap-6 lg:grid-cols-[minmax(0,0.5fr)_1fr] items-start">
                <div className="flex flex-col items-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${index === 0 ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700'} text-lg font-semibold`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && <div className="mt-2 h-full w-px bg-slate-200" />}
                </div>
                <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      {step.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  <div className="mt-4 h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-linear-to-r from-cyan-500 to-sky-500" style={{ width: `${step.progress}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Progression estimée : {step.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Reality Filter Active</p>
            <div className="mt-4 rounded-3xl bg-cyan-50 p-5 ring-1 ring-cyan-100">
              <p className="text-sm font-semibold text-slate-950">Budget constraint</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                D’après votre budget actuel et l’étape 3 (MSc spécialisé), le coût est élevé. Explorez des alternatives comme les bootcamps ou les programmes sponsorisés.
              </p>
            </div>
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Étape actuelle</p>
            <div className="mt-5 rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">En cours</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">Junior Data Scientist</h3>
              <p className="mt-3 text-sm text-slate-600">Acquisition de compétences, modélisation prédictive et nettoyage des données.</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Compétences recommandées</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Hard & Soft skills</h2>
          </div>
          <Link to="/learning-lab" className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500">
            Aller au Learning Lab
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-950">Hard Skills</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Python / R - Avancé</li>
              <li>Machine Learning - Avancé</li>
              <li>SQL / NoSQL - Intermédiaire</li>
              <li>Data Visualization - Intermédiaire</li>
            </ul>
          </div>
          <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-950">Soft Skills</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Esprit analytique</li>
              <li>Résolution de problèmes</li>
              <li>Communication</li>
              <li>Travail en équipe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
