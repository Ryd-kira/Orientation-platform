import { Link } from 'react-router-dom';

const featureCards = [
  { value: '94%', label: 'Compatibilité métier' },
  { value: '8/10', label: 'Satisfaction IA' },
  { value: '5 min', label: 'Création de roadmap' },
];

const benefits = [
  {
    title: 'Tests intelligents',
    description: 'Personnalité, QI et motivations pour aligner votre profil avec le marché.',
  },
  {
    title: 'Roadmap personnalisée',
    description: 'Un plan clair vers votre métier cible avec étapes et priorités définies.',
  },
  {
    title: 'Apprentissage guidé',
    description: 'Cours et ressources adaptés à vos compétences et objectifs professionnels.',
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <div className="absolute inset-x-0 top-0 h-96 bg-linear-to-b from-cyan-100 via-transparent to-transparent" />
      <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white text-lg font-bold">P</span>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-600">Pathfinder AI</p>
            <p className="text-sm text-slate-600">Career Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-900 transition hover:border-cyan-300 hover:text-slate-950">
            Connexion
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-cyan-600 px-5 py-2 text-sm font-semibold text-white shadow-xl shadow-cyan-500/20 transition hover:bg-cyan-500">
            Création de compte
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-10">
        <section className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-8">
            <span className="inline-flex rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Nouvelle expérience d’orientation IA
            </span>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Naviguez votre futur métier avec une carrière IA claire et personnalisée.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Analyse de profil, recommandations métier, learning lab et roadmap de carrière réunis dans une expérience fluide et visuelle.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:bg-slate-800">
                Commencer maintenant
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-950 transition hover:border-cyan-300 hover:bg-slate-50">
                Découvrir les offres
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {featureCards.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white p-8 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.15),transparent_25%)]" />
            <div className="relative space-y-8">
              <div className="rounded-4xl bg-slate-50 p-8 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Votre profil IA</p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950">Analyse instantanée</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Bénéficiez d’une synthèse de carrière personnalisée et découvrez les compétences à renforcer pour atteindre vos objectifs.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Personnalité</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-950">Adapté</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Recommandation alignée à vos motivations.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Compétences</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-950">Recommandées</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Les actions prioritaires pour progresser rapidement.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-4xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Pourquoi Pathfinder AI</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950">Un accompagnement complet vers votre futur métier.</h2>
              <p className="mt-4 max-w-xl text-slate-600">
                Combinez l’intelligence artificielle, des tests métiers et une feuille de route orientée action pour construire un parcours sûr et efficace.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                'Profilage métier automatique',
                'Feuille de route claire et progressive',
                'Recommandations de formations ciblées',
              ].map((item) => (
                <div key={item} className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
                  <p className="text-sm font-semibold text-slate-950">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {benefits.map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
