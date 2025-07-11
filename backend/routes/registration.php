<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Protect coordinator actions with auth:sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('registrations/{registration}/approve', [App\Http\Controllers\RegistrationController::class, 'approve']);
    Route::post('registrations/{registration}/reject', [App\Http\Controllers\RegistrationController::class, 'reject']);
    Route::get('registrations/dashboard/stats', [App\Http\Controllers\RegistrationController::class, 'stats']);
    Route::get('registrations/session/{sessionId}', [App\Http\Controllers\RegistrationController::class, 'bySession']);
    Route::apiResource('registrations', App\Http\Controllers\RegistrationController::class);
});

// Public or less sensitive endpoints
Route::get('registrations/status/pending/{coordinatorId}', [App\Http\Controllers\RegistrationController::class, 'pending']);
Route::get('registrations/status/{userId}/{sessionId}', [App\Http\Controllers\RegistrationController::class, 'getStatusByUserAndSession']);

