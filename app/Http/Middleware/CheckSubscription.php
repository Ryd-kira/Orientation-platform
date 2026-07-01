<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isPremium()) {
            return response()->json([
                'message' => 'Action réservée aux membres Premium.',
                'code' => 'PREMIUM_REQUIRED',
            ], 402);
        }

        return $next($request);
    }
}
