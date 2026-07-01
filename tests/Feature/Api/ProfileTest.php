<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_profile(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/profile', [
                'age' => 18,
                'region' => 'Île-de-France',
                'budget' => 15000,
                'target_job_title' => 'Développeur',
            ]);

        $response->assertStatus(201)
            ->assertJson(['age' => 18, 'region' => 'Île-de-France']);
    }

    public function test_user_can_get_profile(): void
    {
        $user = User::factory()->hasProfile()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/profile');

        $response->assertStatus(200)
            ->assertJson(['user_id' => $user->id]);
    }

    public function test_user_can_update_profile(): void
    {
        $user = User::factory()->hasProfile()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson('/api/profile', [
                'age' => 20,
                'budget' => 20000,
            ]);

        $response->assertStatus(200)
            ->assertJson(['age' => 20, 'budget' => 20000]);
    }
}
