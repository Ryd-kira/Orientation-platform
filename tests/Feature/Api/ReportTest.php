<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\MarketDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MarketDataSeeder::class);
    }

    public function test_user_can_generate_initial_report(): void
    {
        $user = User::factory()->hasProfile()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/reports/generate/initial');

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'type', 'file_path']);
    }

    public function test_free_user_cannot_generate_qi_report(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/reports/generate/qi');

        $response->assertStatus(402);
    }

    public function test_premium_user_can_generate_complete_report(): void
    {
        $user = User::factory()->premium()->hasProfile()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/reports/generate/complete');

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'type', 'file_path']);
    }

    public function test_user_can_list_reports(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/reports');

        $response->assertStatus(200);
    }
}
