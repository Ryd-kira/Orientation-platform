<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class SubscriptionController extends Controller
{
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'price_id' => 'required|string',
            'duration_months' => 'required|integer|in:1,3,6,12',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'mode' => 'subscription',
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $validated['price_id'],
                'quantity' => 1,
            ]],
            'success_url' => config('app.frontend_url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}&duration=' . $validated['duration_months'],
            'cancel_url' => config('app.frontend_url') . '/pricing?canceled=1',
            'metadata' => [
                'user_id' => (string) $request->user()->id,
                'duration_months' => (string) $validated['duration_months'],
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

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
