<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Protect coordinator actions with auth:sanctum
Route::middleware('auth:sanctum')->group(function () {
Route::get('registrations/session/{sessionId}/confirmed-users', [App\Http\Controllers\RegistrationController::class, 'confirmedUsersBySession']);
    Route::post('registrations/{registration}/approve', [App\Http\Controllers\RegistrationController::class, 'approve']);
    Route::post('registrations/{registration}/reject', [App\Http\Controllers\RegistrationController::class, 'reject']);
    Route::get('registrations/dashboard/stats', [App\Http\Controllers\RegistrationController::class, 'stats']);
    Route::get('registrations/dashboard/global-stats', [App\Http\Controllers\RegistrationController::class, 'globalStats']);
    Route::get('registrations/session/{sessionId}', [App\Http\Controllers\RegistrationController::class, 'bySession']);
    Route::get('registrations/status/confirmed', [App\Http\Controllers\RegistrationController::class, 'getConfirmedRegistrationsLoggedInUser']);
    Route::apiResource('registrations', App\Http\Controllers\RegistrationController::class);
    Route::get('registrations/status/{sessionId}', [App\Http\Controllers\RegistrationController::class, 'getStatusByUserAndSession']);
    Route::get('registrations/session/{sessionId}', [App\Http\Controllers\RegistrationController::class, 'getRegistrationsBySession']);
});

// Public or less sensitive endpoints
Route::get('registrations/status/pending/{coordinatorId}', [App\Http\Controllers\RegistrationController::class, 'pending']);

Route::get('registrations/user/{user}', [App\Http\Controllers\RegistrationController::class, 'getRegistrationsByUser']);


