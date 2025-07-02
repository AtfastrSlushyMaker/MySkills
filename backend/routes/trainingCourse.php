<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('training-courses', App\Http\Controllers\TrainingCourseController::class);