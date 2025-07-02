<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return response()->json([
        'message' => 'MySkills API is working!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});
