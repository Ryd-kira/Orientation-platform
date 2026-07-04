import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Orientation IA</span>
        <div className="flex gap-4">
          <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 px-4 py-2">Connexion</Link>
          <Link to="/register" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Créer un compte</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Trouve ta voie avec l'IA
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Tests psychométriques, matching métiers, conseiller IA — tout ce dont tu as besoin pour construire ton projet d'orientation.
        </p>
        <Link to="/register" className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-medium hover:bg-indigo-700 shadow-lg">
          Commencer mon orientation →
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            { title: 'Tests psychométriques', desc: 'Personnalité, QI, aptitudes — des tests complets pour mieux te connaître.' },
            { title: 'Matching intelligent', desc: 'Nos algorithmes trouvent les métiers les plus adaptés à ton profil.' },
            { title: 'Conseiller IA', desc: 'Un assistant personnel pour répondre à toutes tes questions d\'orientation.' },
          ].map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
