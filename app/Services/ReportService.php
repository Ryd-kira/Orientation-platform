<?php

namespace App\Services;

use App\Models\Report;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ReportService
{
    public function __construct(
        protected MatchingService $matchingService
    ) {}

    public function generate(User $user, string $type): Report
    {
        $data = $this->buildReportData($user, $type);

        $html = view("reports.$type", $data)->render();

        $filename = "reports/{$user->id}/{$type}_" . now()->format('Ymd_His') . '.pdf';

        $pdf = Pdf::loadHTML($html);
        $pdf->setPaper('A4', 'portrait');
        Storage::disk('local')->put($filename, $pdf->output());

        $report = Report::create([
            'user_id' => $user->id,
            'type' => $type,
            'premium_only' => in_array($type, ['qi', 'complete']),
            'file_path' => $filename,
            'generated_at' => now(),
        ]);

        return $report;
    }

    public function buildReportData(User $user, string $type): array
    {
        $profile = $user->profile;
        $personalityTest = $user->personalityTests()->with('traitResults')->where('status', 'completed')->latest()->first();
        $qiTest = $user->qiTests()->with(['subsections', 'answers.question'])->where('status', 'completed')->latest()->first();
        $dreamJob = $user->dreamJobAnalyses()->latest()->first();
        $academicRecords = $user->academicRecords()->orderBy('sort_order')->get();

        $matching = $this->matchingService->match($user);

        $data = [
            'user' => $user,
            'profile' => $profile,
            'personalityTest' => $personalityTest,
            'qiTest' => $qiTest,
            'dreamJob' => $dreamJob,
            'academicRecords' => $academicRecords,
            'matching' => $matching,
            'generatedAt' => now()->format('d/m/Y H:i'),
        ];

        if ($type === 'complete') {
            $data['swot'] = $this->buildSwotAnalysis($user, $profile, $matching);
        }

        return $data;
    }

    public function buildSwotAnalysis(User $user, $profile, array $matching): array
    {
        $strengths = [];
        $weaknesses = [];
        $opportunities = [];
        $threats = [];

        if ($profile?->budget) {
            $strengths[] = 'Budget d\'études déclaré : ' . number_format($profile->budget, 2) . ' €';
        } else {
            $weaknesses[] = 'Aucun budget d\'études déclaré';
        }

        $personalityTest = $user->personalityTests()->with('traitResults')->where('status', 'completed')->latest()->first();
        if ($personalityTest) {
            $topTraits = $personalityTest->traitResults->sortByDesc('score')->take(3);
            foreach ($topTraits as $trait) {
                if ($trait->score >= 60) {
                    $strengths[] = "Trait de personnalité : {$trait->trait_name} ({$trait->score}/100)";
                } else {
                    $weaknesses[] = "Trait à améliorer : {$trait->trait_name} ({$trait->score}/100)";
                }
            }
        } else {
            $weaknesses[] = 'Test de personnalité non complété';
        }

        $qiTest = $user->qiTests()->where('status', 'completed')->latest()->first();
        if ($qiTest && $qiTest->iq_score) {
            if ($qiTest->iq_score >= 110) {
                $strengths[] = "QI élevé : {$qiTest->iq_score} (centile {$qiTest->percentile}%)";
            } else {
                $weaknesses[] = "Score QI : {$qiTest->iq_score} (centile {$qiTest->percentile}%)";
            }
        } else {
            $weaknesses[] = 'Test de QI non complété';
        }

        if ($profile?->target_job_title) {
            $opportunities[] = "Objectif de carrière défini : {$profile->target_job_title}";
        } else {
            $weaknesses[] = 'Aucun objectif de carrière défini';
        }

        if (!empty($matching['matches'])) {
            $opportunities[] = count($matching['matches']) . ' métiers compatibles identifiés';
            $topScore = $matching['matches'][0]['score'] ?? 0;
            if ($topScore >= 60) {
                $strengths[] = "Très bonne compatibilité avec le métier : {$matching['matches'][0]['job_title']} (score: {$topScore}%)";
            }
        } else {
            $threats[] = 'Aucun métier compatible trouvé avec le profil actuel';
        }

        $academicRecords = $user->academicRecords;
        if ($academicRecords->isNotEmpty()) {
            $strengths[] = $academicRecords->count() . ' parcours académique(s) renseigné(s)';
        } else {
            $weaknesses[] = 'Aucun parcours académique renseigné';
        }

        if ($profile?->budget) {
            foreach (($matching['matches'] ?? []) as $match) {
                if (!empty($match['alerts'])) {
                    $threats = array_merge($threats, $match['alerts']);
                }
            }
        }

        return [
            'strengths' => array_unique($strengths),
            'weaknesses' => array_unique($weaknesses),
            'opportunities' => array_unique($opportunities),
            'threats' => array_unique($threats),
        ];
    }
}
