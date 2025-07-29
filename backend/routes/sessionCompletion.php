<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionCompletionController;
use App\Http\Controllers\RegistrationController;

// Session Completions routes
Route::middleware('auth:sanctum')->group(function () {
    // Standard CRUD routes
    Route::apiResource('session-completions', SessionCompletionController::class);

    // Additional routes
    Route::post('session-completions/{sessionCompletion}/mark-completed', [SessionCompletionController::class, 'markCompleted']);
    Route::post('session-completions/{sessionCompletion}/generate-certificate', [SessionCompletionController::class, 'generateCertificate']);

    // Get session completion by registration - THIS IS THE MISSING ROUTE
    Route::get('registrations/{registration}/session-completion', [SessionCompletionController::class, 'getByRegistration']);

    // Get user skills
    Route::get('users/skills', [SessionCompletionController::class, 'getUserSkills']);
});
