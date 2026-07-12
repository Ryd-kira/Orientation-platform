import { Link } from 'react-router-dom';

const COURSES = [
  {
    title: 'Machine Learning for Professionals',
    provider: 'Coursera',
    duration: '8 semaines',
    match: '98% match',
    tags: ['Python', 'IA'],
  },
  {
    title: 'Strategic Communication in Tech',
    provider: 'edX',
    duration: '4 semaines',
    match: '92% match',
    tags: ['Soft Skill'],
  },
  {
    title: 'Agile Product Management',
    provider: 'Udacity',
    duration: '12 semaines',
    match: '85% match',
    tags: ['Agile', 'Scrum'],
  },
];

export default function LearningLabPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Learning Lab</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Votre apprentissage personnalisé basé sur votre profil.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Suivez un parcours de formation ajusté à vos objectifs IA, avec des recommandations claires pour progresser plus vite.
            </p>
          </div>
          <Link to="/career-roadmap" className="inline-flex rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
            Voir la roadmap
          </Link>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Compétences à acquérir</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Priorité haute</h2>
            </div>
            <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">En cours</span>
          </div>

          <div className="mt-8 space-y-5">
            {['Machine Learning Intégré', 'Gestion de Projet Agile', 'Communication Stratégique'].map((item, index) => (
              <div key={item} className="rounded-4xl bg-slate-50 p-5 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-slate-950">{item}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Priorité</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div className="h-3 rounded-full bg-linear-to-r from-indigo-600 to-cyan-500" style={{ width: `${80 - index * 15}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">Gardez votre attention sur ces compétences à fort impact pour votre évolution vers l’IA.</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Trajectoire d’expertise</p>
            <div className="mt-5 grid gap-4">
              {['Profil actuel', 'Objectif IA'].map((label) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-base font-semibold text-slate-950">
                    {label === 'Profil actuel' ? 'Data Scientist Junior' : 'Lead AI Architect'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Cours suggérés</p>
            <div className="mt-5 space-y-4">
              {COURSES.map((course) => (
                <div key={course.title} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">{course.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{course.provider} · {course.duration}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{course.match}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
