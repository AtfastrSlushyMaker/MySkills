<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

// Notification routes - requires authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // User notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
    
    // Admin notification routes
    Route::middleware(['admin'])->group(function () {
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::post('/notifications/broadcast', [NotificationController::class, 'broadcast']);
        Route::get('/notifications/stats', [NotificationController::class, 'stats']);
    });
});
