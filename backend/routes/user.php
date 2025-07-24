<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Profile management routes (authenticated user only) - MUST come before resource routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/users/profile', [App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::post('users/change-password', [App\Http\Controllers\UserController::class, 'changePassword']);
});
Route::get('users/statistics', [App\Http\Controllers\UserController::class, 'getUsersStatistics']);
Route::get('users/count', [App\Http\Controllers\UserController::class, 'getUserCount']);
// Specific user routes - MUST come before resource routes to avoid conflicts
Route::get('users/trainers', [App\Http\Controllers\UserController::class, 'getAllTrainers']);
Route::get('users/coordinators', [App\Http\Controllers\UserController::class, 'getAllCoordinators']);

// Ban and deactivate a user account
Route::post('users/{user}/ban', [App\Http\Controllers\UserController::class, 'ban']);
Route::post('users/{user}/deactivate', [App\Http\Controllers\UserController::class, 'deactivate']);

Route::apiResource('users', App\Http\Controllers\UserController::class);



