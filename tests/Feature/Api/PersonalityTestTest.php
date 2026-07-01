<?php

namespace Tests\Feature\Api;

use App\Models\PersonalityTest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PersonalityTestTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_start_personality_test(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/personality-tests/start');

        $response->assertStatus(201)
            ->assertJson(['status' => 'in_progress']);
    }

    public function test_user_can_submit_answers(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $test = PersonalityTest::create([
            'user_id' => $user->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $traits = [];
        $traitNames = ['Ouverture', 'Conscienciosité', 'Extraversion', 'Agréabilité', 'Neurotisme',
            'Créativité', 'Rigueur', 'Sociabilité', 'Empathie', 'Adaptabilité'];
        foreach ($traitNames as $name) {
            $traits[] = ['trait_name' => $name, 'score' => rand(30, 90)];
        }

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/personality-tests/{$test->id}/answers", ['traits' => $traits]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'completed']);
    }

    public function test_user_cannot_submit_others_test(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $token1 = $user1->createToken('test')->plainTextToken;

        $test = PersonalityTest::create([
            'user_id' => $user2->id,
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token1")
            ->postJson("/api/personality-tests/{$test->id}/answers", ['traits' => []]);

        $response->assertStatus(403);
    }
}
