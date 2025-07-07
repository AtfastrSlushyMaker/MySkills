<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Standard CRUD routes
Route::apiResource('registrations', App\Http\Controllers\RegistrationController::class);

// Coordinator-specific registration management routes
Route::post('registrations/{registration}/approve', [App\Http\Controllers\RegistrationController::class, 'approve']);
Route::post('registrations/{registration}/reject', [App\Http\Controllers\RegistrationController::class, 'reject']);
Route::get('registrations/status/pending', [App\Http\Controllers\RegistrationController::class, 'pending']);
Route::get('registrations/session/{sessionId}', [App\Http\Controllers\RegistrationController::class, 'bySession']);
Route::get('registrations/dashboard/stats', [App\Http\Controllers\RegistrationController::class, 'stats']);
