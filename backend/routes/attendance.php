<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::apiResource('attendances', App\Http\Controllers\AttendanceController::class);