import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function AssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre conseiller IA. Posez-moi une question pour avancer votre carrière.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const isPremium = user?.subscription?.is_premium;
  const { data: qiTest } = useQuery({
    queryKey: ['qi-test', 'latest'],
    queryFn: () => client.get('/qi-tests/latest').then((response) => response.data),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (message) => client.post('/assistant/counsel', { message }).then((r) => r.data),
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.assistant_response }]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    mutation.mutate(input);
    setInput('');
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-4xl bg-white p-10 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Conseiller IA</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Accédez à l’assistant IA premium</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Cette fonctionnalité est réservée aux membres Premium. Passez à la version pro pour poser vos questions de carrière à l’IA.
          </p>
          <Link to="/pricing" className="mt-8 inline-flex rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500">
            Voir les offres Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-4xl bg-white p-8 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-600">Conseiller IA</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Échangez sur votre projet professionnel</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">Posez vos questions sur votre profil, vos métiers cibles et votre budget.</p>
            </div>
            {qiTest?.status === 'completed' && (
              <div className="rounded-3xl bg-cyan-50 px-4 py-3 text-sm text-cyan-900 ring-1 ring-cyan-100">
                Score indicatif aux aptitudes : {qiTest.iq_score}
              </div>
            )}
          </div>
          <p className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
            L’assistant actuel s’appuie sur des règles et les informations enregistrées dans votre profil. Il ne consulte pas de modèle d’IA externe ni de données de marché en direct.
          </p>
        </div>

        <div className="rounded-4xl bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
          <div className="min-h-130 space-y-4 overflow-hidden rounded-3xl bg-slate-50 p-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-6 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-slate-950 text-white'
                    : 'bg-white text-slate-900 ring-1 ring-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {mutation.isPending && (
              <div className="flex justify-start">
                <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-500">Réflexion...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="mt-6 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez une question sur votre carrière..."
              className="flex-1 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            />
            <button
              type="submit"
              disabled={!input.trim() || mutation.isPending}
              aria-label="Envoyer la question"
              className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 hover:shadow-lg disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
