<?php

namespace Tests\Feature\Api;

use App\Models\QiQuestion;
use App\Models\QiTest;
use App\Models\User;
use Database\Seeders\QiQuestionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QiTestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(QiQuestionSeeder::class);
    }

    public function test_user_can_start_qi_test(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/qi-tests/start')
            ->assertCreated()
            ->assertJson(['status' => 'in_progress']);
    }

    public function test_user_can_load_a_fixed_timed_subsection_and_submit_its_answers(): void
    {
        $user = User::factory()->create();
        $test = QiTest::create(['user_id' => $user->id, 'status' => 'in_progress', 'started_at' => now()]);
        $subsection = $test->subsections()->create([
            'type' => 'logical_matrix', 'max_score' => 10, 'status' => 'pending',
        ]);

        $response = $this->actingAs($user)
            ->getJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/questions");

        $response->assertOk()
            ->assertJsonPath('time_limit_seconds', 120)
            ->assertJsonCount(5, 'questions');

        $questions = collect($response->json('questions'));
        $this->assertNotNull($subsection->fresh()->started_at);
        $this->assertCount(5, $subsection->fresh()->question_ids);

        $answers = $questions->map(fn($question) => [
            'question_id' => $question['id'],
            'selected_answer' => QiQuestion::findOrFail($question['id'])->correct_answer,
        ])->all();

        $this->actingAs($user)
            ->postJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/answers", ['answers' => $answers])
            ->assertOk()
            ->assertJsonPath('timed_out', false)
            ->assertJsonPath('subsection.status', 'completed');
    }

    public function test_expired_subsection_is_completed_with_zero_points(): void
    {
        $user = User::factory()->create();
        $test = QiTest::create(['user_id' => $user->id, 'status' => 'in_progress', 'started_at' => now()]);
        $subsection = $test->subsections()->create([
            'type' => 'logical_matrix', 'max_score' => 10, 'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->getJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/questions")
            ->assertOk();

        $this->travel(121)->seconds();

        $this->actingAs($user)
            ->postJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/answers", ['answers' => []])
            ->assertOk()
            ->assertJsonPath('timed_out', true)
            ->assertJsonPath('subsection.score', 0);
    }

    public function test_completing_all_subsections_publishes_an_indicative_score_without_percentile(): void
    {
        $user = User::factory()->create();
        $startResponse = $this->actingAs($user)->postJson('/api/qi-tests/start')->assertCreated();
        $testId = $startResponse->json('id');

        foreach ($startResponse->json('subsections') as $subsection) {
            $questionsResponse = $this->actingAs($user)
                ->getJson("/api/qi-tests/{$testId}/subsection/{$subsection['id']}/questions")
                ->assertOk();

            $answers = collect($questionsResponse->json('questions'))->map(fn($question) => [
                'question_id' => $question['id'],
                'selected_answer' => QiQuestion::findOrFail($question['id'])->correct_answer,
            ])->all();

            $this->actingAs($user)
                ->postJson("/api/qi-tests/{$testId}/subsection/{$subsection['id']}/answers", ['answers' => $answers])
                ->assertOk();
        }

        $this->actingAs($user)
            ->getJson('/api/qi-tests/latest')
            ->assertOk()
            ->assertJsonPath('status', 'completed')
            ->assertJsonPath('percentile', null)
            ->assertJsonStructure(['iq_score', 'subsections']);
    }

    public function test_subsection_rejects_questions_that_were_not_assigned_to_it(): void
    {
        $user = User::factory()->create();
        $test = QiTest::create(['user_id' => $user->id, 'status' => 'in_progress', 'started_at' => now()]);
        $subsection = $test->subsections()->create([
            'type' => 'logical_matrix', 'max_score' => 10, 'status' => 'pending',
        ]);

        $this->actingAs($user)
            ->getJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/questions")
            ->assertOk();

        $unassignedQuestion = QiQuestion::where('subsection_type', 'numerical_series')->firstOrFail();

        $this->actingAs($user)
            ->postJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/answers", [
                'answers' => [[
                    'question_id' => $unassignedQuestion->id,
                    'selected_answer' => $unassignedQuestion->correct_answer,
                ]],
            ])
            ->assertUnprocessable();
    }
}
