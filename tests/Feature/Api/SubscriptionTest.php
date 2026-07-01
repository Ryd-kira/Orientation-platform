<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_activate_subscription(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/subscriptions/activate', [
                'payment_method' => 'carte',
                'transaction_id' => 'txn_123456',
                'duration_months' => 1,
            ]);

        $response->assertStatus(201)
            ->assertJson(['plan' => 'premium', 'status' => 'active']);
    }

    public function test_user_can_check_subscription_status(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/subscriptions/status');

        $response->assertStatus(200)
            ->assertJsonStructure(['is_premium', 'status']);
    }
}
