import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useWizardProgress } from '../../hooks/useWizardProgress';
import WizardContainer from '../../components/wizard/WizardContainer';

const SUBSECTION_LABELS = {
  logical_matrix: 'Matrices logiques',
  numerical_series: 'Séries numériques',
  verbal_analogies: 'Analogies verbales',
  spatial_rotation: 'Rotation spatiale',
};

export default function AptitudesStep() {
  const navigate = useNavigate();
  const { completeStep } = useWizardProgress();
  const [currentTest, setCurrentTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const timedOutSubsection = useRef(null);

  const { data: latestTest, isLoading: loadingLatest, isError: latestError, refetch: refetchLatest } = useQuery({
    queryKey: ['qi-test', 'latest'],
    queryFn: () => client.get('/qi-tests/latest').then((r) => r.data),
    retry: false,
  });

  useEffect(() => {
    if (latestTest) {
      setCurrentTest(latestTest);
    }
  }, [latestTest]);

  useEffect(() => {
    if (latestTest?.status === 'completed') {
      completeStep(6, latestTest);
    }
  }, [latestTest, completeStep]);

  const startMutation = useMutation({
    mutationFn: () => client.post('/qi-tests/start').then((r) => r.data),
    onSuccess: (data) => {
      setCurrentTest(data);
      setSelectedAnswers({});
    },
  });

  const pendingSubsection = currentTest?.subsections?.find((sub) => sub.status !== 'completed');

  const { data: subsectionData, isLoading: loadingQuestions, isError: questionsError } = useQuery({
    queryKey: ['qi-test', currentTest?.id, 'subsection', pendingSubsection?.id, 'questions'],
    queryFn: () => client.get(`/qi-tests/${currentTest.id}/subsection/${pendingSubsection.id}/questions`).then((r) => r.data),
    enabled: Boolean(currentTest?.id && pendingSubsection),
    retry: false,
  });

  const questions = subsectionData?.questions ?? [];
  const displayedSeconds = secondsRemaining ?? subsectionData?.time_limit_seconds ?? 0;

  useEffect(() => {
    if (!subsectionData?.started_at) return undefined;

    const updateTimer = () => {
      const deadline = new Date(subsectionData.started_at).getTime()
        + subsectionData.time_limit_seconds * 1000;
      setSecondsRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [subsectionData?.started_at, subsectionData?.time_limit_seconds]);

  const submitMutation = useMutation({
    mutationFn: ({ testId, subsectionId, answers }) => client
      .post(`/qi-tests/${testId}/subsection/${subsectionId}/answers`, { answers })
      .then((r) => r.data),
    onSuccess: async () => {
      setSelectedAnswers({});
      await refetchLatest();
    },
  });

  useEffect(() => {
    if (secondsRemaining === 0 && subsectionData?.started_at && pendingSubsection && currentTest) {
      if (timedOutSubsection.current === pendingSubsection.id) return;
      timedOutSubsection.current = pendingSubsection.id;
      submitMutation.mutate({
        testId: currentTest.id,
        subsectionId: pendingSubsection.id,
        answers: [],
      });
    }
  }, [secondsRemaining]);

  const handleSelectOption = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const allAnswered = questions.length > 0 && questions.every((question) => selectedAnswers[question.id]);

  const handleSubmitAnswers = () => {
    if (!pendingSubsection || !currentTest) return;
    const answers = questions.map((question) => ({
      question_id: question.id,
      selected_answer: selectedAnswers[question.id],
    }));
    submitMutation.mutate({
      testId: currentTest.id,
      subsectionId: pendingSubsection.id,
      answers,
    });
  };

  const handleSkip = () => {
    completeStep(6, { skipped: true });
    navigate('/wizard/marche');
  };

  const renderSummary = () => {
    const score = currentTest.iq_score ?? currentTest.total_score ?? 'N/A';
    return (
      <div className="rounded-4xl bg-slate-50 p-8 ring-1 ring-slate-200 shadow-sm">
        <p className="text-emerald-600 font-medium">Évaluation terminée</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-950">Score estimatif : {score}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ce questionnaire d’orientation n’est pas un test psychométrique standardisé et ne constitue pas une mesure clinique du QI.
          Votre résultat est une estimation indicative basée sur vos réponses.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Voir le dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              completeStep(6, currentTest);
              navigate('/wizard/marche');
            }}
            className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500"
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  };

  const renderTestIntro = () => (
    <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 space-y-6">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Questionnaire d'aptitudes — 4 sous-sections : matrices logiques, séries numériques, analogies verbales et rotation spatiale.
        </p>
        <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-900">Préparez-vous à un questionnaire d’orientation.</p>
          <p className="mt-2 text-sm text-slate-500">Chaque sous-section est limitée à 2 minutes. Le résultat est indicatif et ne remplace pas un test standardisé.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-900">Étapes</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Matrices logiques</li>
            <li>• Séries numériques</li>
            <li>• Analogies verbales</li>
            <li>• Rotation spatiale</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-cyan-50 p-5 ring-1 ring-cyan-100">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Durée estimée</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">10 min</p>
          <p className="mt-2 text-sm text-slate-600">Chaque sous-section dispose de 2 minutes pour répondre.</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Passer cette étape
        </button>
        <button
          type="button"
          onClick={() => startMutation.mutate()}
          disabled={startMutation.isPending}
          className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-50"
        >
          {startMutation.isPending ? 'Démarrage...' : 'Démarrer le test'}
        </button>
      </div>
      {startMutation.isError && (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {startMutation.error?.response?.data?.message || 'Impossible de démarrer le test.'}
        </div>
      )}
    </div>
  );

  const renderSubsection = () => {
    if (loadingQuestions) {
      return (
        <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 text-center">
          <p className="text-sm text-slate-600">Chargement des questions...</p>
        </div>
      );
    }

    if (questionsError) {
      return (
        <div className="rounded-4xl bg-red-50 p-8 ring-1 ring-red-200 text-center text-sm text-red-700">
          Impossible de charger cette sous-section. Actualisez la page pour réessayer.
        </div>
      );
    }

    if (!pendingSubsection || questions.length === 0) {
      return (
        <div className="rounded-4xl bg-slate-50 p-8 ring-1 ring-slate-200 text-center">
          <p className="text-sm text-slate-600">Aucune sous-section disponible pour le moment.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-600">Sous-section</p>
          <h2 className="text-3xl font-semibold text-slate-950">{SUBSECTION_LABELS[pendingSubsection.type] || 'Test d’aptitudes'}</h2>
          <p className="text-sm text-slate-600">Répondez à toutes les questions pour cette sous-section avant de passer à la suivante.</p>
          <p className={`text-sm font-semibold ${displayedSeconds <= 15 ? 'text-red-700' : 'text-slate-700'}`} aria-live="polite">
            Temps restant : {Math.floor(displayedSeconds / 60)}:{String(displayedSeconds % 60).padStart(2, '0')}
          </p>
        </div>

        <div className="space-y-5">
          {questions.map((question, index) => (
            <div key={question.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">Question {index + 1}</p>
              <p className="mt-3 text-sm leading-6 text-slate-900">{question.question_text}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectOption(question.id, option)}
                    className={`rounded-3xl border px-4 py-3 text-left text-sm text-cyan-950 transition ${selectedAnswers[question.id] === option ? 'border-cyan-600 bg-cyan-50' : 'border-slate-200 bg-white hover:border-cyan-500 hover:bg-slate-50'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Passer le test
          </button>
          <button
            type="button"
            onClick={handleSubmitAnswers}
            disabled={!allAnswered || submitMutation.isPending || displayedSeconds === 0}
            className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 disabled:opacity-50"
          >
            {submitMutation.isPending ? 'Envoi...' : 'Valider cette sous-section'}
          </button>
        </div>

        {submitMutation.isError && (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {submitMutation.error?.response?.data?.message || 'Erreur lors de l’envoi des réponses.'}
          </div>
        )}
      </div>
    );
  };

  return (
    <WizardContainer>
      {currentTest?.status === 'completed' ? renderSummary() : currentTest ? renderSubsection() : renderTestIntro()}
    </WizardContainer>
  );
}
