<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseContentController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/course-contents', [CourseContentController::class, 'index']);
    Route::post('/course-contents', [CourseContentController::class, 'store']);
    Route::get('/course-contents/{id}', [CourseContentController::class, 'show']);
    Route::post('/course-contents/{id}', [CourseContentController::class, 'update']);
    Route::put('/course-contents/{id}', [CourseContentController::class, 'update']);
    Route::patch('/course-contents/{id}', [CourseContentController::class, 'update']);
    Route::delete('/course-contents/{id}', [CourseContentController::class, 'destroy']);
});
