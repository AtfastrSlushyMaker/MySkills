<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::apiResource('categories', App\Http\Controllers\CategoryController::class);