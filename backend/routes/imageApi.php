<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('images/upload', [App\Services\ImageService::class, 'upload']);
});

