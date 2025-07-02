<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('training-sessions', App\Http\Controllers\TrainingSessionController::class);