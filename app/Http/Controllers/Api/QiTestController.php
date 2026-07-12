<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QiAnswer;
use App\Models\QiQuestion;
use App\Models\QiSubsection;
use App\Models\QiTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QiTestController extends Controller
{
    public function start(Request $request): JsonResponse
    {
        $existing = $request->user()->qiTests()
            ->where('status', 'in_progress')
            ->first();

        if ($existing) {
            return response()->json($existing->load('subsections'));
        }

        $test = QiTest::create([
            'user_id' => $request->user()->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $types = ['logical_matrix', 'numerical_series', 'verbal_analogies', 'spatial_rotation'];
        foreach ($types as $type) {
            QiSubsection::create([
                'qi_test_id' => $test->id,
                'type' => $type,
                'max_score' => 10,
                'status' => 'pending',
            ]);
        }

        return response()->json($test->load('subsections'), 201);
    }

    public function questions(Request $request, QiTest $test, QiSubsection $subsection): JsonResponse
    {
        if ($test->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($subsection->qi_test_id !== $test->id) {
            return response()->json(['message' => 'Sous-section invalide.'], 400);
        }

        $questions = QiQuestion::where('subsection_type', $subsection->type)
            ->inRandomOrder()
            ->limit(5)
            ->get(['id', 'question_text', 'options']);

        return response()->json($questions);
    }

    public function submitSubsection(Request $request, QiTest $test, QiSubsection $subsection): JsonResponse
    {
        if ($test->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($subsection->qi_test_id !== $test->id) {
            return response()->json(['message' => 'Sous-section invalide.'], 400);
        }

        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'answers.*.question_id' => 'required|exists:qi_questions,id',
            'answers.*.selected_answer' => 'required|string',
            'answers.*.time_spent_seconds' => 'nullable|integer|min:0',
            'time_spent_seconds' => 'nullable|integer|min:0',
        ]);

        $score = 0;
        $maxScore = 0;

        foreach ($validated['answers'] as $answerData) {
            $question = QiQuestion::findOrFail($answerData['question_id']);
            $isCorrect = $answerData['selected_answer'] === $question->correct_answer;

            QiAnswer::create([
                'qi_test_id' => $test->id,
                'qi_question_id' => $question->id,
                'selected_answer' => $answerData['selected_answer'],
                'is_correct' => $isCorrect,
                'time_spent_seconds' => $answerData['time_spent_seconds'] ?? 0,
            ]);

            if ($isCorrect) {
                $score += $question->points;
            }
            $maxScore += $question->points;
        }

        $subsection->update([
            'score' => $score,
            'max_score' => $maxScore,
            'time_spent_seconds' => $validated['time_spent_seconds'] ?? 0,
            'status' => 'completed',
        ]);

        $allCompleted = $test->subsections()->where('status', '!=', 'completed')->count() === 0;

        if ($allCompleted) {
            $totalScore = $test->subsections()->sum('score');
            $totalMaxScore = $test->subsections()->sum('max_score');

            $percentage = $totalMaxScore > 0 ? ($totalScore / $totalMaxScore) * 100 : 0;
            $iqScore = (int) round(($percentage / 100) * 60 + 70);

            $test->update([
                'status' => 'completed',
                'total_score' => $totalScore,
                'iq_score' => $iqScore,
                'standard_deviation' => 15.0,
                'percentile' => round($this->calculatePercentile($iqScore), 2),
                'completed_at' => now(),
            ]);
        }

        return response()->json($subsection->fresh());
    }

    public function results(Request $request, QiTest $test): JsonResponse
    {
        if ($test->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        return response()->json($test->load(['subsections', 'answers.question']));
    }

    public function latest(Request $request): JsonResponse
    {
        $test = $request->user()->qiTests()
            ->with(['subsections', 'answers.question'])
            ->latest()
            ->first();

        if (!$test) {
            return response()->json(['message' => 'Aucun test de QI trouvé.'], 404);
        }

        return response()->json($test);
    }

    private function calculatePercentile(int $iqScore): float
    {
        $mean = 100;
        $stdDev = 15;
        $z = ($iqScore - $mean) / $stdDev;
        return 0.5 * (1 + $this->erf($z / sqrt(2))) * 100;
    }

    private function erf(float $x): float
    {
        $sign = $x < 0 ? -1 : 1;
        $x = abs($x);
        $t = 1 / (1 + 0.3275911 * $x);
        $y = 1 - ((((1.061405429 * $t - 1.453152027) * $t) + 1.421413741) * $t - 0.284496736) * $t * exp(-$x * $x);
        return $sign * $y;
    }
}
