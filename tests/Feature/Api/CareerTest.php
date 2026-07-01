<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\MarketDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CareerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MarketDataSeeder::class);
    }

    public function test_user_can_get_matching(): void
    {
        $user = User::factory()->hasProfile()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/career/match');

        $response->assertStatus(200)
            ->assertJsonStructure(['matches', 'total_careers_analyzed']);
    }

    public function test_user_can_check_coherence(): void
    {
        $user = User::factory()->hasProfile()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/career/coherence?job_title=Développeur');

        $response->assertStatus(200)
            ->assertJsonStructure(['results']);
    }

    public function test_premium_user_can_generate_roadmap(): void
    {
        $user = User::factory()->premium()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/career/roadmap', ['target_job' => 'Développeur Full Stack']);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'target_job', 'roadmap_data', 'skill_gaps']);
    }

    public function test_free_user_cannot_generate_roadmap(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/career/roadmap', ['target_job' => 'Développeur']);

        $response->assertStatus(402);
    }
}
