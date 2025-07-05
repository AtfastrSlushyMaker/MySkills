<?php

use App\Http\Controllers\SessionCompletionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Session Completion Routes
|--------------------------------------------------------------------------
|
| These routes handle session completion management including creating,
| updating, and tracking training session completions and skills earned.
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    
    // Session completion CRUD
    Route::apiResource('session-completions', SessionCompletionController::class);
    
    // Additional session completion actions
    Route::post('session-completions/{sessionCompletion}/mark-completed', [SessionCompletionController::class, 'markCompleted']);
    Route::post('session-completions/{sessionCompletion}/generate-certificate', [SessionCompletionController::class, 'generateCertificate']);
    
    // Get completion by registration
    Route::get('registrations/{registration}/session-completion', [SessionCompletionController::class, 'getByRegistration']);
    
    // Get user skills
    Route::get('users/skills', [SessionCompletionController::class, 'getUserSkills']);
    
});
