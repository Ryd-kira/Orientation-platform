<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DreamJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_analyze_dream_job(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/dream-job/analyze', [
                'job_title' => 'Développeur Web',
                'job_description' => 'Je suis passionné par le développement web, la création de sites et applications. J\'aime la technologie et la créativité.',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'job_title', 'nlp_analysis', 'compatibility_score']);
    }
}
