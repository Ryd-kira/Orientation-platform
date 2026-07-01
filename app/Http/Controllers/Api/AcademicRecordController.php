<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->academicRecords()->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'diploma' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'institution' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'disliked_subjects' => 'nullable|array',
            'disliked_subjects.*' => 'string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['user_id'] = $request->user()->id;

        $record = AcademicRecord::create($validated);

        return response()->json($record, 201);
    }

    public function show(Request $request, AcademicRecord $academicRecord): JsonResponse
    {
        if ($academicRecord->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        return response()->json($academicRecord);
    }

    public function update(Request $request, AcademicRecord $academicRecord): JsonResponse
    {
        if ($academicRecord->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'diploma' => 'sometimes|required|string|max:255',
            'field_of_study' => 'sometimes|required|string|max:255',
            'institution' => 'nullable|string|max:255',
            'grade' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'disliked_subjects' => 'nullable|array',
            'disliked_subjects.*' => 'string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $academicRecord->update($validated);

        return response()->json($academicRecord);
    }

    public function destroy(Request $request, AcademicRecord $academicRecord): JsonResponse
    {
        if ($academicRecord->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $academicRecord->delete();

        return response()->json(['message' => 'Parcours supprimé.']);
    }
}
