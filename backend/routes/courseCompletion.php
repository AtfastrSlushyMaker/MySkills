<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseCompletionController;

Route::apiResource('course-completions', CourseCompletionController::class);
