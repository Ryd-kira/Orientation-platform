import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

const opportunities = [
  {
    title: 'Data Scientist',
    description: 'Forte demande sur les profils analytiques et décisionnels.',
    salary: '60k-80k €',
  },
  {
    title: 'Product Manager IA',
    description: 'Croissance des équipes produit orientées data.',
    salary: '70k-95k €',
  },
  {
    title: 'Architecte IA',
    description: 'Besoins élevés en expertise de systèmes à grande échelle.',
    salary: '90k-120k €',
  },
];

export default function MarketStep() {
  const navigate = useNavigate();
  const { completeStep } = useWizardProgress();
  const [submitted, setSubmitted] = useState(false);

  const handleFinish = () => {
    completeStep(7, { finishedAt: new Date().toISOString() });
    setSubmitted(true);
    navigate('/dashboard');
  };

  return (
    <WizardContainer>
      <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Analyse métier</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Marché & débouchés</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Explorez les opportunités les plus pertinentes en fonction de votre profil, de votre budget et de vos objectifs professionnels.
            </p>
          </div>
          <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Tendance du marché</p>
            <p className="mt-4 text-3xl font-semibold text-slate-950">+28%</p>
            <p className="mt-3 text-sm text-slate-600">Croissance annuelle des offres IA et data sur les 12 derniers mois.</p>
          </div>
        </div>

        <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Alerte de réalité</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Budget critique</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700">Étude coûteuse</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Votre budget estimé est insuffisant pour le parcours académique idéal. Explorez des alternatives de financement ou des formations plus courtes.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-950">Opportunités recommandées</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {opportunities.map((item) => (
              <div key={item.title} className="rounded-4xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">{item.title}</p>
                <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                <p className="mt-5 text-lg font-semibold text-slate-950">{item.salary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-4xl bg-slate-50 p-6 ring-1 ring-slate-200">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-600">Résumé final</p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-slate-600">
            <li>Votre profil est particulièrement adapté aux métiers data et IA.</li>
            <li>La situation financière rend un MSc classique plus difficile sans financement.</li>
            <li>Des parcours alternatifs courts peuvent accélérer votre insertion professionnelle.</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => navigate('/wizard/aptitudes')}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Précédent
          </button>
          <button
            type="button"
            onClick={handleFinish}
            className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500"
          >
            Terminer et voir mon dashboard
          </button>
        </div>
      </div>
    </WizardContainer>
  );
}
