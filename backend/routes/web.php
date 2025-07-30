<?php

use Illuminate\Support\Facades\Route;


// Serve the frontend app for reset-password (for email links)
Route::get('/reset-password', function () {
    return view('welcome');
});

// Serve the frontend app for all other routes (SPA support)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');

