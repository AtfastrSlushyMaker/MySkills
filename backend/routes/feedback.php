<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('feedbacks', App\Http\Controllers\FeedbackController::class);
// Get all feedback for a specific session
Route::get('feedbacks/session/{sessionId}', [App\Http\Controllers\FeedbackController::class, 'getFeedbackBySession']);
// Get all feedback for a specific user
Route::get('feedbacks/user/{userId}', [App\Http\Controllers\FeedbackController::class, 'getFeedbackByUser']);
