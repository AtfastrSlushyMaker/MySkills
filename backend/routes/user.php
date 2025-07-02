<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::apiResource('users', App\Http\Controllers\UserController::class);

// Deactivate a category (soft delete)
Route::post('categories/{category}/deactivate', [App\Http\Controllers\CategoryController::class, 'deactivate']);

// Ban and deactivate a user account
Route::post('users/{user}/ban', [App\Http\Controllers\UserController::class, 'ban']);
Route::post('users/{user}/deactivate', [App\Http\Controllers\UserController::class, 'deactivate']);