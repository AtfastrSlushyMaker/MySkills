<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test endpoint - now in the correct file
Route::get('/test', function () {
    return response()->json([
        'message' => 'MySkills API is working!',
        'status' => 'success',
        'timestamp' => now(),
        'endpoint' => 'API route working properly'
    ]);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => 'connected',
        'app' => config('app.name')
    ]);
});

// Protected route example
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');