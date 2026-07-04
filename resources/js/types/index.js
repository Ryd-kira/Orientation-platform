export const WIZARD_STEPS = [
  { step: 1, key: 'profile', label: 'Profil', route: '/wizard/profil' },
  { step: 2, key: 'academic', label: 'Parcours scolaire', route: '/wizard/scolaire' },
  { step: 3, key: 'interests', label: 'Centres d\'intérêt', route: '/wizard/interets' },
  { step: 4, key: 'dream_job', label: 'Métier de rêve', route: '/wizard/metier-reve' },
  { step: 5, key: 'personality', label: 'Test de personnalité', route: '/wizard/personnalite' },
  { step: 6, key: 'aptitudes', label: 'Test d\'aptitudes', route: '/wizard/aptitudes' },
  { step: 7, key: 'market', label: 'Marché et débouchés', route: '/wizard/marche' },
];

export const WIZARD_STORAGE_KEY = 'orientation_wizard_progress';
