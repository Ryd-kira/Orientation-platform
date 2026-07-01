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
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/qi-tests/start');

        $response->assertStatus(201)
            ->assertJson(['status' => 'in_progress']);
    }

    public function test_user_can_submit_subsection(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $test = QiTest::create(['user_id' => $user->id, 'status' => 'in_progress', 'started_at' => now()]);
        $subsection = $test->subsections()->create([
            'type' => 'logical_matrix', 'max_score' => 10, 'status' => 'pending',
        ]);

        $questions = QiQuestion::where('subsection_type', 'logical_matrix')->take(3)->get();

        $answers = $questions->map(fn($q) => [
            'question_id' => $q->id,
            'selected_answer' => $q->correct_answer,
        ])->toArray();

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/qi-tests/{$test->id}/subsection/{$subsection->id}/answers", [
                'answers' => $answers,
                'time_spent_seconds' => 120,
            ]);

        $response->assertStatus(200);
    }
}
