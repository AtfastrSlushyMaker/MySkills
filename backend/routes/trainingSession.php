<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('training-sessions', App\Http\Controllers\TrainingSessionController::class);
Route::post('training-sessions/{trainingSession}/archive', [App\Http\Controllers\TrainingSessionController::class, 'archiveByCoordinator']);
Route::get('training-sessions/trainer/{trainerId}', [App\Http\Controllers\TrainingSessionController::class, 'getSessionsByTrainer']);
Route::get('training-sessions/coordinator/{coordinatorId}', [App\Http\Controllers\TrainingSessionController::class, 'getSessionsByCoordinator']);
Route::get('training-sessions/category/{categoryId}', [App\Http\Controllers\TrainingSessionController::class, 'getSessionsByCategory']);
Route::get('training-sessions/recent-activity/coordinator/{coordinatorId}', [App\Http\Controllers\TrainingSessionController::class, 'RecentActivityByCoordinator']);

