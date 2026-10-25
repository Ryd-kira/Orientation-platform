<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QiAnswer;
use App\Models\QiQuestion;
use App\Models\QiSubsection;
use App\Models\QiTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QiTestController extends Controller
{
    private const QUESTIONS_PER_SUBSECTION = 5;
    private const TIME_LIMIT_SECONDS = 120;

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

        if ($test->status !== 'in_progress' || $subsection->status === 'completed') {
            return response()->json(['message' => 'Cette sous-section est déjà terminée.'], 409);
        }

        if (!$subsection->question_ids) {
            $questionIds = QiQuestion::where('subsection_type', $subsection->type)
                ->inRandomOrder()
                ->limit(self::QUESTIONS_PER_SUBSECTION)
                ->pluck('id')
                ->all();

            if (empty($questionIds)) {
                return response()->json(['message' => 'Aucune question disponible pour cette sous-section.'], 422);
            }

            $subsection->update([
                'question_ids' => $questionIds,
                'started_at' => now(),
                'status' => 'in_progress',
            ]);
        }

        return response()->json([
            'questions' => QiQuestion::whereIn('id', $subsection->question_ids)
                ->get(['id', 'question_text', 'options']),
            'started_at' => $subsection->started_at,
            'time_limit_seconds' => self::TIME_LIMIT_SECONDS,
        ]);
    }

    public function submitSubsection(Request $request, QiTest $test, QiSubsection $subsection): JsonResponse
    {
        if ($test->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($subsection->qi_test_id !== $test->id) {
            return response()->json(['message' => 'Sous-section invalide.'], 400);
        }

        if ($test->status !== 'in_progress' || $subsection->status !== 'in_progress' || !$subsection->started_at) {
            return response()->json(['message' => 'Cette sous-section ne peut pas être soumise.'], 409);
        }

        $validated = $request->validate([
            'answers' => 'present|array',
            'answers.*.question_id' => 'required|integer|distinct',
            'answers.*.selected_answer' => 'required|string|max:255',
        ]);

        $questionIds = $subsection->question_ids ?? [];
        $answerIds = array_column($validated['answers'], 'question_id');
        if (array_diff($answerIds, $questionIds)) {
            return response()->json(['message' => 'Une réponse ne correspond pas aux questions de cette sous-section.'], 422);
        }

        $questions = QiQuestion::whereIn('id', $questionIds)->get()->keyBy('id');
        foreach ($validated['answers'] as $answerData) {
            $question = $questions->get($answerData['question_id']);
            if (!$question || !in_array($answerData['selected_answer'], $question->options, true)) {
                return response()->json(['message' => 'Une réponse sélectionnée est invalide.'], 422);
            }
        }

        $elapsedSeconds = max(0, (int) $subsection->started_at->diffInSeconds(now()));
        $expired = $elapsedSeconds >= self::TIME_LIMIT_SECONDS;
        if (!$expired && count($answerIds) !== count($questionIds)) {
            return response()->json(['message' => 'Répondez à toutes les questions avant de valider.'], 422);
        }

        $result = DB::transaction(function () use ($test, $subsection, $validated, $questions, $expired, $elapsedSeconds) {
            $score = 0;
            $maxScore = $questions->sum('points');

            if (!$expired) {
                foreach ($validated['answers'] as $answerData) {
                    $question = $questions->get($answerData['question_id']);
                    $isCorrect = $answerData['selected_answer'] === $question->correct_answer;

                    QiAnswer::create([
                        'qi_test_id' => $test->id,
                        'qi_question_id' => $question->id,
                        'selected_answer' => $answerData['selected_answer'],
                        'is_correct' => $isCorrect,
                        'time_spent_seconds' => min(self::TIME_LIMIT_SECONDS, $elapsedSeconds),
                    ]);

                    if ($isCorrect) {
                        $score += $question->points;
                    }
                }
            }

            $subsection->update([
                'score' => $score,
                'max_score' => $maxScore,
                'time_spent_seconds' => min(self::TIME_LIMIT_SECONDS, $elapsedSeconds),
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
                    'standard_deviation' => null,
                    'percentile' => null,
                    'completed_at' => now(),
                ]);
            }

            return $subsection->fresh();
        });

        return response()->json([
            'subsection' => $result,
            'timed_out' => $expired,
        ]);
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

}
