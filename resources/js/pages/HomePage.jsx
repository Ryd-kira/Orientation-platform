import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Posez les bases',
    description: 'Renseignez votre profil, vos études et ce qui compte pour vous.',
  },
  {
    number: '02',
    title: 'Explorez vos pistes',
    description: 'Consultez des métiers compatibles avec vos préférences et votre projet.',
  },
  {
    number: '03',
    title: 'Préparez la suite',
    description: 'Identifiez les prochaines étapes pour avancer vers votre objectif.',
  },
];

const features = [
  {
    title: 'Un profil qui vous ressemble',
    description: 'Vos réponses et votre parcours servent de point de départ à votre orientation.',
  },
  {
    title: 'Des pistes à explorer',
    description: 'Comparez des métiers selon vos préférences et les informations de votre profil.',
  },
  {
    title: 'Des résultats à votre rythme',
    description: 'Retrouvez vos questionnaires, vos pistes et vos prochaines actions dans votre espace.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f8fa] text-slate-950">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">P</span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-cyan-800">Pathfinder AI</span>
            <span className="mt-0.5 block text-sm text-slate-600">Votre orientation, étape par étape</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(8,145,178,0.65)] transition hover:bg-cyan-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 sm:px-5"
          >
            <span className="sm:hidden">Créer un compte</span>
            <span className="hidden sm:inline">Commencer mon parcours</span>
          </Link>
        </nav>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 sm:pt-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-cyan-200/40 blur-3xl" />
        <section className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.88fr] lg:gap-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
              Faites de votre prochain choix un projet concret.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Pathfinder AI vous aide à structurer votre orientation à partir de votre profil, de vos préférences et de votre projet professionnel.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_-14px_rgba(2,6,23,0.6)] transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Créer mon espace
                <span aria-hidden="true" className="ml-2 text-lg">→</span>
              </Link>
              <Link
                to="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2"
              >
                Voir les offres
              </Link>
            </div>
            <p className="mt-5 text-sm text-slate-600">Commencez par votre profil, puis avancez à votre rythme.</p>
          </div>

          <aside aria-label="Les étapes de votre parcours" className="relative">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-cyan-200/50 blur-xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_28px_70px_-32px_rgba(2,6,23,0.55)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-200">Votre parcours d’orientation</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">Un cap, une étape après l’autre.</h2>
                </div>
                <span aria-hidden="true" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.7">
                    <path d="M4 18.5 9 13l3 2.5 7-9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.5 6.5H19V11" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              <ol className="mt-8 space-y-0">
                {steps.map((step, index) => (
                  <li key={step.number} className="relative flex gap-4 pb-7 last:pb-0">
                    {index < steps.length - 1 && (
                      <span aria-hidden="true" className="absolute left-[1.05rem] top-10 h-[calc(100%-1.4rem)] w-px bg-slate-700" />
                    )}
                    <span className="relative z-10 flex h-[2.15rem] w-[2.15rem] shrink-0 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                      {step.number}
                    </span>
                    <span className="pt-0.5">
                      <span className="block font-semibold text-white">{step.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-300">{step.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-7 border-t border-slate-700 pt-5 text-xs leading-5 text-slate-400">
                Les recommandations évoluent avec les informations que vous ajoutez à votre espace.
              </p>
            </div>
          </aside>
        </section>

        <section className="relative mt-20 border-t border-slate-200 pt-10 sm:mt-24 sm:pt-12">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
            <div>
              <h2 className="max-w-sm text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                Votre orientation part de vous.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-700">
                Votre espace rassemble les informations et les résultats que vous choisissez d’y renseigner.
              </p>
            </div>
            <div className="divide-y divide-slate-200">
              {features.map((feature) => (
                <article key={feature.title} className="grid gap-2 py-5 first:pt-0 sm:grid-cols-[0.75fr_1.25fr] sm:gap-8">
                  <h3 className="font-semibold text-slate-950">{feature.title}</h3>
                  <p className="text-sm leading-6 text-slate-700">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>Pathfinder AI</span>
          <Link to="/pricing" className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-950">
            Consulter les offres
          </Link>
        </div>
      </footer>
    </div>
  );
}
