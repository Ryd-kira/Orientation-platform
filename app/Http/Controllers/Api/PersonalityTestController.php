<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PersonalityTest;
use App\Models\PersonalityTraitResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PersonalityTestController extends Controller
{
    public function start(Request $request): JsonResponse
    {
        $existing = $request->user()->personalityTests()
            ->where('status', 'in_progress')
            ->first();

        if ($existing) {
            return response()->json($existing->load('traitResults'));
        }

        $test = PersonalityTest::create([
            'user_id' => $request->user()->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        return response()->json($test, 201);
    }

    public function submitAnswers(Request $request, PersonalityTest $test): JsonResponse
    {
        if ($test->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'traits' => 'required|array|min:10',
            'traits.*.trait_name' => 'required|string|max:100',
            'traits.*.score' => 'required|integer|between:0,100',
            'traits.*.details' => 'nullable|array',
        ]);

        foreach ($validated['traits'] as $trait) {
            PersonalityTraitResult::create([
                'personality_test_id' => $test->id,
                'trait_name' => $trait['trait_name'],
                'score' => $trait['score'],
                'details' => $trait['details'] ?? null,
            ]);
        }

        $overallScore = (int) round(collect($validated['traits'])->avg('score'));

        $test->update([
            'status' => 'completed',
            'overall_score' => $overallScore,
            'summary' => ['trait_count' => count($validated['traits']), 'average_score' => $overallScore],
            'completed_at' => now(),
        ]);

        return response()->json($test->load('traitResults'));
    }

    public function results(Request $request, PersonalityTest $test): JsonResponse
    {
        if ($test->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        return response()->json($test->load('traitResults'));
    }

    public function latest(Request $request): JsonResponse
    {
        $test = $request->user()->personalityTests()
            ->with('traitResults')
            ->latest()
            ->first();

        if (!$test) {
            return response()->json(['message' => 'Aucun test trouvé.'], 404);
        }

        return response()->json($test);
    }
}
