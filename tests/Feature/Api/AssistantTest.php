<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Database\Seeders\MarketDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssistantTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MarketDataSeeder::class);
    }

    public function test_premium_user_gets_course_suggestions_for_their_target_job(): void
    {
        $user = User::factory()->premium()->hasProfile()->create();
        $user->profile->update(['target_job_title' => 'Data Scientist']);

        $this->actingAs($user)
            ->getJson('/api/assistant/courses')
            ->assertOk()
            ->assertJsonPath('total_gaps', 6)
            ->assertJsonPath('recommendations.0.skill', 'Python')
            ->assertJsonPath('recommendations.0.courses.0.name', 'Fondamentaux de Python');
    }

    public function test_free_user_cannot_get_course_suggestions(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/assistant/courses')
            ->assertStatus(402)
            ->assertJsonPath('code', 'PREMIUM_REQUIRED');
    }
}
