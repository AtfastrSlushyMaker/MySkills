<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Profile management routes (authenticated user only) - MUST come before resource routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('users/profile', [App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::post('users/change-password', [App\Http\Controllers\UserController::class, 'changePassword']);
});

Route::apiResource('users', App\Http\Controllers\UserController::class);

// Deactivate a category (soft delete)
Route::post('categories/{category}/deactivate', [App\Http\Controllers\CategoryController::class, 'deactivate']);

// Ban and deactivate a user account
Route::post('users/{user}/ban', [App\Http\Controllers\UserController::class, 'ban']);
Route::post('users/{user}/deactivate', [App\Http\Controllers\UserController::class, 'deactivate']);
