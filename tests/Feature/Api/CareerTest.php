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

        $this->actingAs($user)
            ->getJson('/api/career/match')
            ->assertOk()
            ->assertJsonStructure(['matches', 'total_careers_analyzed']);
    }

    public function test_disliked_subjects_exclude_related_careers_from_matches(): void
    {
        $user = User::factory()->hasProfile()->create();
        $user->profile->update(['region' => 'France', 'target_job_title' => null]);
        $user->academicRecords()->create([
            'diploma' => 'Baccalauréat',
            'field_of_study' => 'Sciences',
            'disliked_subjects' => ['Physique-Chimie'],
        ]);

        $response = $this->actingAs($user)->getJson('/api/career/match');

        $response->assertOk()
            ->assertJsonMissing(['job_title' => 'Ingénieur chimiste']);
    }

    public function test_user_can_check_coherence(): void
    {
        $user = User::factory()->hasProfile()->create();

        $this->actingAs($user)
            ->getJson('/api/career/coherence?job_title=Développeur')
            ->assertOk()
            ->assertJsonStructure(['results']);
    }

    public function test_low_budget_produces_a_critical_alert_for_the_target_career(): void
    {
        $user = User::factory()->hasProfile()->create();
        $user->profile->update(['budget' => 1000, 'region' => 'France']);

        $this->actingAs($user)
            ->getJson('/api/career/coherence?job_title=Pilote%20de%20ligne')
            ->assertOk()
            ->assertJsonPath('has_blocking_alert', true)
            ->assertJsonPath('results.0.coherent', false);
    }

    public function test_premium_user_can_generate_roadmap(): void
    {
        $user = User::factory()->premium()->create();

        $this->actingAs($user)
            ->postJson('/api/career/roadmap', ['target_job' => 'Développeur Full Stack'])
            ->assertCreated()
            ->assertJsonStructure(['id', 'target_job', 'roadmap_data', 'skill_gaps']);
    }

    public function test_free_user_cannot_generate_roadmap(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/career/roadmap', ['target_job' => 'Développeur'])
            ->assertStatus(402);
    }
}
