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

// Authentication routes
require __DIR__.'/auth.php';

// Resource routes for all models
require __DIR__.'/user.php';
require __DIR__.'/category.php';
require __DIR__.'/trainingCourse.php';
require __DIR__.'/trainingSession.php';
require __DIR__.'/registration.php';
require __DIR__.'/attendance.php';
require __DIR__.'/feedback.php';
require __DIR__.'/sessionCompletion.php';
require __DIR__.'/notification.php';

// Registration status by user and session

