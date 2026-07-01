<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CareerRoadmapService;
use App\Services\MatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    public function __construct(
        protected MatchingService $matchingService,
        protected CareerRoadmapService $careerRoadmapService
    ) {}

    public function match(Request $request): JsonResponse
    {
        $result = $this->matchingService->match($request->user());

        return response()->json($result);
    }

    public function checkCoherence(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'job_title' => 'nullable|string|max:255',
        ]);

        $result = $this->matchingService->checkEconomicCoherence(
            $request->user(),
            $validated['job_title'] ?? null
        );

        return response()->json($result);
    }

    public function roadmap(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'target_job' => 'required|string|max:255',
        ]);

        if (!$request->user()->isPremium()) {
            return response()->json([
                'message' => 'Passez à l\'offre Premium pour générer une roadmap de carrière.',
                'code' => 'PREMIUM_REQUIRED',
            ], 402);
        }

        $roadmap = $this->careerRoadmapService->generate(
            $request->user(),
            $validated['target_job']
        );

        return response()->json($roadmap, 201);
    }

    public function roadmaps(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->careerRoadmaps()->with('skillGaps')->latest()->get()
        );
    }

    public function skillGaps(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->skillGaps()->with('careerRoadmap')->latest()->get()
        );
    }
}
