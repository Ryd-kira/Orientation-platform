<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Report;
use Database\Seeders\MarketDataSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MarketDataSeeder::class);
    }

    public function test_free_user_cannot_generate_initial_pdf_report(): void
    {
        $user = User::factory()->hasProfile()->create();

        $this->actingAs($user)
            ->postJson('/api/reports/generate/initial')
            ->assertStatus(402)
            ->assertJsonPath('code', 'PREMIUM_REQUIRED');

        $this->assertDatabaseCount('reports', 0);
    }

    public function test_premium_user_can_generate_initial_pdf_report(): void
    {
        $user = User::factory()->premium()->hasProfile()->create();

        $this->actingAs($user)
            ->postJson('/api/reports/generate/initial')
            ->assertCreated()
            ->assertJsonStructure(['id', 'type', 'file_path'])
            ->assertJsonPath('premium_only', true);
    }

    public function test_free_user_cannot_generate_qi_report(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/reports/generate/qi')
            ->assertStatus(402);
    }

    public function test_free_user_cannot_download_an_existing_report(): void
    {
        $user = User::factory()->create();
        $report = Report::create([
            'user_id' => $user->id,
            'type' => 'initial',
            'file_path' => 'reports/example.pdf',
            'premium_only' => true,
            'generated_at' => now(),
        ]);

        $this->actingAs($user)
            ->get("/api/reports/{$report->id}/download")
            ->assertStatus(402)
            ->assertJsonPath('code', 'PREMIUM_REQUIRED');
    }

    public function test_premium_user_can_download_an_existing_report(): void
    {
        Storage::fake('local');
        $user = User::factory()->premium()->create();
        $report = Report::create([
            'user_id' => $user->id,
            'type' => 'initial',
            'file_path' => 'reports/example.pdf',
            'premium_only' => true,
            'generated_at' => now(),
        ]);
        Storage::disk('local')->put($report->file_path, '%PDF-1.4 test');

        $this->actingAs($user)
            ->get("/api/reports/{$report->id}/download")
            ->assertOk()
            ->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_premium_user_can_generate_complete_report(): void
    {
        $user = User::factory()->premium()->hasProfile()->create();

        $this->actingAs($user)
            ->postJson('/api/reports/generate/complete')
            ->assertCreated()
            ->assertJsonStructure(['id', 'type', 'file_path'])
            ->assertJsonPath('premium_only', true);
    }

    public function test_user_can_list_reports(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/reports')
            ->assertOk();
    }
}
