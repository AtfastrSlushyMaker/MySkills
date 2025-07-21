<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('notifications', App\Http\Controllers\NotificationController::class);
    Route::get('notifications/unread', [App\Http\Controllers\NotificationController::class, 'unread']);
    Route::get('user/notifications', [App\Http\Controllers\NotificationController::class, 'userNotifications']);
    Route::post('notifications/{notification}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/broadcast', [App\Http\Controllers\NotificationController::class, 'broadcast']);
    Route::get('notifications/stats', [App\Http\Controllers\NotificationController::class, 'stats']);
});
