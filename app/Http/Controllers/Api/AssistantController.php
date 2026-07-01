<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketData;
use App\Models\SkillGap;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssistantController extends Controller
{
    public function suggestCourses(Request $request): JsonResponse
    {
        if (!$request->user()->isPremium()) {
            return response()->json([
                'message' => 'Passez à l\'offre Premium pour accéder à l\'assistant LMS.',
                'code' => 'PREMIUM_REQUIRED',
            ], 402);
        }

        $skillGaps = $request->user()->skillGaps()
            ->whereRaw('current_level < required_level')
            ->get();

        if ($skillGaps->isEmpty()) {
            $profile = $request->user()->profile;
            $targetJob = $profile?->target_job_title;
            if ($targetJob) {
                $jobData = MarketData::byJobTitle($targetJob)->first();
                if ($jobData) {
                    foreach (($jobData->required_skills ?? []) as $skill) {
                        SkillGap::firstOrCreate([
                            'user_id' => $request->user()->id,
                            'skill_name' => $skill,
                        ], [
                            'career_roadmap_id' => null,
                            'current_level' => 1,
                            'required_level' => 5,
                            'suggested_courses' => [
                                ['name' => "Fondamentaux de $skill", 'platform' => 'Coursera', 'url' => null],
                                ['name' => "Perfectionnement en $skill", 'platform' => 'Udemy', 'url' => null],
                                ['name' => "Projet pratique : $skill", 'platform' => 'OpenClassrooms', 'url' => null],
                            ],
                        ]);
                    }
                    $skillGaps = $request->user()->skillGaps()->fresh();
                }
            }
        }

        $recommendations = $skillGaps->map(function ($gap) {
            return [
                'skill' => $gap->skill_name,
                'current_level' => $gap->current_level,
                'required_level' => $gap->required_level,
                'progress' => $gap->required_level > 0
                    ? round(($gap->current_level / $gap->required_level) * 100)
                    : 0,
                'courses' => $gap->suggested_courses ?? [],
            ];
        })->values();

        return response()->json([
            'recommendations' => $recommendations,
            'total_gaps' => $skillGaps->count(),
            'message' => $recommendations->isEmpty()
                ? 'Aucune compétence manquante identifiée. Complétez votre profil et vos tests.'
                : null,
        ]);
    }

    public function counsel(Request $request): JsonResponse
    {
        if (!$request->user()->isPremium()) {
            return response()->json([
                'message' => 'Passez à l\'offre Premium pour accéder au conseiller IA.',
                'code' => 'PREMIUM_REQUIRED',
            ], 402);
        }

        $validated = $request->validate([
            'message' => 'required|string|min:2|max:2000',
        ]);

        $context = $this->buildCounselorContext($request->user());
        $response = $this->generateCounselorResponse($validated['message'], $context);

        return response()->json([
            'user_message' => $validated['message'],
            'assistant_response' => $response,
            'context_used' => $context['summary'],
        ]);
    }

    private function buildCounselorContext(User $user): array
    {
        $profile = $user->profile;
        $personalityTest = $user->personalityTests()->with('traitResults')->where('status', 'completed')->latest()->first();
        $qiTest = $user->qiTests()->where('status', 'completed')->latest()->first();
        $dreamJob = $user->dreamJobAnalyses()->latest()->first();

        $traitsSummary = $personalityTest?->traitResults
            ->map(fn($t) => "{$t->trait_name}: {$t->score}/100")
            ->implode(', ');

        return [
            'summary' => "Profil: {$profile?->age} ans, région {$profile?->region}, budget {$profile?->budget}€. "
                . ($qiTest ? "QI: {$qiTest->iq_score}. " : "")
                . ($traitsSummary ? "Traits: [$traitsSummary]. " : "")
                . ($dreamJob ? "Métier de rêve: {$dreamJob->job_title}. " : "")
                . ($profile?->target_job_title ? "Objectif: {$profile->target_job_title}." : ""),
            'profile' => $profile,
            'personality' => $personalityTest,
            'qi' => $qiTest,
            'dreamJob' => $dreamJob,
        ];
    }

    private function generateCounselorResponse(string $message, array $context): string
    {
        $messageLower = strtolower($message);

        if (str_contains($messageLower, 'forces') || str_contains($messageLower, 'faiblesse') || str_contains($messageLower, 'qualité')) {
            $traits = $context['personality']?->traitResults;
            if ($traits && $traits->isNotEmpty()) {
                $top = $traits->sortByDesc('score')->first();
                $low = $traits->sortBy('score')->first();
                return "D'après vos tests psychométriques, votre trait le plus développé est « {$top->trait_name} » ({$top->score}/100). "
                    . "Votre axe d'amélioration serait « {$low->trait_name} » ({$low->score}/100). "
                    . "Je vous conseille de travailler ce point pour équilibrer votre profil.";
            }
            return "Pour analyser vos forces et faiblesses, complétez d'abord le test de personnalité dans votre dashboard.";
        }

        if (str_contains($messageLower, 'métier') || str_contains($messageLower, 'carrière') || str_contains($messageLower, 'orientation')) {
            $target = $context['profile']?->target_job_title;
            if ($target) {
                return "Votre objectif actuel est « $target ». "
                    . "Pour valider cette voie, je vous recommande de consulter les résultats de matching dans votre dashboard. "
                    . "Vous y verrez les métiers compatibles avec votre profil, leurs salaires et les formations nécessaires.";
            }
            return "Vous n'avez pas encore défini de métier cible. Je vous suggère de commencer par l'analyse « Métier de Rêve » "
                . "et les tests de personnalité pour mieux cerner vos aspirations.";
        }

        if (str_contains($messageLower, 'budget') || str_contains($messageLower, 'finance') || str_contains($messageLower, 'coût')) {
            $budget = $context['profile']?->budget;
            if ($budget) {
                return "Votre budget déclaré est de {$budget}€. Pour vérifier la cohérence économique de vos choix, "
                    . "utilisez la fonctionnalité « Vérification budgétaire » dans votre dashboard. "
                    . "Elle compare votre budget au coût des études pour chaque métier.";
            }
            return "Vous n'avez pas encore déclaré de budget. Renseignez-le dans votre profil pour obtenir des recommandations personnalisées.";
        }

        if (str_contains($messageLower, 'qi') || str_contains($messageLower, 'test') || str_contains($messageLower, 'intelligence')) {
            $qi = $context['qi'];
            if ($qi) {
                return "Votre score de QI est de {$qi->iq_score} (centile {$qi->percentile}%). "
                    . "Ce score est basé sur 4 dimensions : logique matricielle, suites numériques, analogies verbales et rotation spatiale. "
                    . "Vous pouvez voir le détail dans votre historique de tests.";
            }
            return "Vous n'avez pas encore complété le test de QI. Rendez-vous dans la section « Test de QI » pour le passer gratuitement.";
        }

        return "Merci pour votre message. En tant que conseiller IA, je peux vous renseigner sur :"
            . "\n- Vos forces et faiblesses (test de personnalité)"
            . "\n- Les métiers adaptés à votre profil"
            . "\n- La cohérence budgétaire de vos choix"
            . "\n- Votre score de QI et son interprétation"
            . "\n\nQue souhaitez-vous savoir précisément ?";
    }
}
