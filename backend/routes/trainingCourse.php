<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('training-courses', App\Http\Controllers\TrainingCourseController::class);

// Custom route for all courses (alias for index)
Route::get('courses', [App\Http\Controllers\TrainingCourseController::class, 'index']);

// Custom route for getting courses by trainer
Route::get('courses/trainer/{trainerId}', [App\Http\Controllers\TrainingCourseController::class, 'getCoursesByTrainer']);

// Add POST, PUT, DELETE for /courses to match frontend API
Route::post('courses', [App\Http\Controllers\TrainingCourseController::class, 'store']);
Route::put('courses/{trainingCourse}', [App\Http\Controllers\TrainingCourseController::class, 'update']);
Route::delete('courses/{trainingCourse}', [App\Http\Controllers\TrainingCourseController::class, 'destroy']);
Route::get('courses/{trainingCourse}', [App\Http\Controllers\TrainingCourseController::class, 'show']);

// Toggle active status for a course
Route::patch('courses/{trainingCourse}/toggle-active', [App\Http\Controllers\TrainingCourseController::class, 'toggleActive']);
