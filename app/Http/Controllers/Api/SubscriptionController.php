<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function activate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|string|max:100',
            'transaction_id' => 'required|string|max:255',
            'duration_months' => 'required|integer|in:1,3,6,12',
        ]);

        $user = $request->user();

        if ($user->isPremium()) {
            return response()->json(['message' => 'Vous êtes déjà membre Premium.'], 400);
        }

        $expiresAt = now()->addMonths($validated['duration_months']);

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => 'premium',
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => $expiresAt,
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'],
        ]);

        $user->update([
            'subscription_status' => 'premium',
            'subscription_expires_at' => $expiresAt,
        ]);

        return response()->json($subscription, 201);
    }

    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'is_premium' => $user->isPremium(),
            'status' => $user->subscription_status,
            'expires_at' => $user->subscription_expires_at,
            'subscriptions' => $user->subscriptions()->latest()->get(),
        ]);
    }
}
