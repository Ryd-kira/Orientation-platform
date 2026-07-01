<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé.'], 404);
        }

        return response()->json($profile);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'age' => 'nullable|integer|min:1|max:120',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
            'budget_currency' => 'nullable|string|size:3',
            'bio' => 'nullable|string',
            'target_job_title' => 'nullable|string|max:255',
            'target_job_description' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        $profile = UserProfile::create($validated);

        return response()->json($profile, 201);
    }

    public function update(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;

        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé.'], 404);
        }

        $validated = $request->validate([
            'age' => 'nullable|integer|min:1|max:120',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:255',
            'region' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric|min:0',
            'budget_currency' => 'nullable|string|size:3',
            'bio' => 'nullable|string',
            'target_job_title' => 'nullable|string|max:255',
            'target_job_description' => 'nullable|string',
        ]);

        $profile->update($validated);

        return response()->json($profile);
    }
}
