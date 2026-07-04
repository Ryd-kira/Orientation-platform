<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\AcademicRecordController;
use App\Http\Controllers\Api\PersonalityTestController;
use App\Http\Controllers\Api\QiTestController;
use App\Http\Controllers\Api\DreamJobController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\AssistantController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/profile', [ProfileController::class, 'index']);
    Route::post('/profile', [ProfileController::class, 'store']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::apiResource('academic-records', AcademicRecordController::class);

    Route::prefix('personality-tests')->group(function () {
        Route::post('/start', [PersonalityTestController::class, 'start']);
        Route::post('/{test}/answers', [PersonalityTestController::class, 'submitAnswers']);
        Route::get('/{test}/results', [PersonalityTestController::class, 'results']);
        Route::get('/latest', [PersonalityTestController::class, 'latest']);
    });

    Route::prefix('qi-tests')->group(function () {
        Route::post('/start', [QiTestController::class, 'start']);
        Route::post('/{test}/subsection/{subsection}/answers', [QiTestController::class, 'submitSubsection']);
        Route::get('/{test}/results', [QiTestController::class, 'results']);
        Route::get('/latest', [QiTestController::class, 'latest']);
    });

    Route::post('/dream-job/analyze', [DreamJobController::class, 'analyze']);
    Route::get('/dream-job/latest', [DreamJobController::class, 'latest']);

    Route::prefix('career')->group(function () {
        Route::get('/match', [CareerController::class, 'match']);
        Route::get('/coherence', [CareerController::class, 'checkCoherence']);
        Route::post('/roadmap', [CareerController::class, 'roadmap'])->middleware('subscription.active');
        Route::get('/roadmaps', [CareerController::class, 'roadmaps']);
        Route::get('/skill-gaps', [CareerController::class, 'skillGaps']);
    });

    Route::prefix('assistant')->middleware('subscription.active')->group(function () {
        Route::post('/counsel', [AssistantController::class, 'counsel']);
        Route::get('/courses', [AssistantController::class, 'suggestCourses']);
    });

    Route::post('/subscriptions/checkout', [SubscriptionController::class, 'checkout']);
    Route::post('/subscriptions/activate', [SubscriptionController::class, 'activate']);
    Route::get('/subscriptions/status', [SubscriptionController::class, 'status']);

    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index']);
        Route::post('/generate/{type}', [ReportController::class, 'generate']);
        Route::get('/{report}/download', [ReportController::class, 'download'])->middleware('subscription.active');
    });
});
