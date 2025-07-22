<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseContentController;

Route::apiResource('course-contents', CourseContentController::class);
