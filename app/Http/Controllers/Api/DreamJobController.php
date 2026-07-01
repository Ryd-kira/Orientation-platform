<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DreamJobAnalysis;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DreamJobController extends Controller
{
    public function analyze(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'job_description' => 'required|string|min:10',
        ]);

        $nlpAnalysis = $this->analyzeWithNLP($validated['job_title'], $validated['job_description']);

        $analysis = DreamJobAnalysis::create([
            'user_id' => $request->user()->id,
            'job_title' => $validated['job_title'],
            'job_description' => $validated['job_description'],
            'nlp_analysis' => $nlpAnalysis,
            'compatibility_score' => $nlpAnalysis['compatibility_score'] ?? null,
        ]);

        return response()->json($analysis, 201);
    }

    public function latest(Request $request): JsonResponse
    {
        $analysis = $request->user()->dreamJobAnalyses()
            ->latest()
            ->first();

        if (!$analysis) {
            return response()->json(['message' => 'Aucune analyse trouvée.'], 404);
        }

        return response()->json($analysis);
    }

    private function analyzeWithNLP(string $jobTitle, string $jobDescription): array
    {
        $keywords = ['passion', 'compétence', 'salaire', 'évolution', 'impact', 'créativité', 'technique', 'social'];
        $foundKeywords = [];
        foreach ($keywords as $keyword) {
            if (stripos($jobDescription, $keyword) !== false) {
                $foundKeywords[] = $keyword;
            }
        }

        $score = min(100, count($foundKeywords) * 15 + 30);

        return [
            'keywords_found' => $foundKeywords,
            'keyword_count' => count($foundKeywords),
            'compatibility_score' => $score,
            'summary' => 'Analyse basée sur ' . count($foundKeywords) . ' mots-clés détectés.',
            'sentiment' => $score >= 50 ? 'positive' : 'neutre',
            'raw_analysis' => 'Analyse NLP simulée pour le métier : ' . $jobTitle,
        ];
    }
}
