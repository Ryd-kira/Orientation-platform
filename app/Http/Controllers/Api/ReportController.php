<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function __construct(
        protected ReportService $reportService
    ) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->reports()->latest()->get());
    }

    public function generate(Request $request, string $type): JsonResponse
    {
        $validTypes = ['initial', 'qi', 'complete'];
        if (!in_array($type, $validTypes)) {
            return response()->json(['message' => 'Type de rapport invalide.'], 400);
        }

        $isPremiumOnly = in_array($type, ['qi', 'complete']);

        if ($isPremiumOnly && !$request->user()->isPremium()) {
            return response()->json([
                'message' => 'Passez à l\'offre Premium pour générer ce rapport.',
                'code' => 'PREMIUM_REQUIRED',
            ], 402);
        }

        $report = $this->reportService->generate($request->user(), $type);

        return response()->json($report, 201);
    }

    public function download(Request $request, Report $report): JsonResponse
    {
        if ($report->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        if ($report->premium_only && !$request->user()->isPremium()) {
            return response()->json([
                'message' => 'Passez à l\'offre Premium pour télécharger vos rapports.',
                'code' => 'PREMIUM_REQUIRED',
            ], 402);
        }

        if (!$report->file_path || !Storage::disk('local')->exists($report->file_path)) {
            return response()->json(['message' => 'Fichier non trouvé.'], 404);
        }

        $report->increment('downloads_count');

        $fileContent = Storage::disk('local')->get($report->file_path);
        $filename = 'rapport_' . $report->type . '_' . $report->id . '.pdf';

        return response($fileContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
