<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test endpoint - now in the correct file
Route::get('/test', function () {
    return response()->json([
        'message' => 'MySkills API is working!',
        'status' => 'success',
        'timestamp' => now(),
        'endpoint' => 'API route working properly'
    ]);
});

// Health check

// Store server boot time if not already set
if (!\Cache::has('server_boot_time')) {
    \Cache::forever('server_boot_time', now()->toDateTimeString());
}

// System Health endpoint
Route::get('/system-health', function () {
    // Server status: check if PHP process is running
    $serverStatus = 'Unavailable';
    if (function_exists('posix_getpid')) {
        $serverStatus = posix_getpid() ? 'online' : 'offline';
    } else {
        $serverStatus = 'online'; // fallback for Windows
    }

    // Server uptime: calculate from boot time in cache
    $serverUptime = 'Unavailable';
    $bootTime = \Cache::get('server_boot_time');
    if ($bootTime) {
        $bootTimestamp = strtotime($bootTime);
        $nowTimestamp = strtotime(now()->toDateTimeString());
        $uptimeSeconds = $nowTimestamp - $bootTimestamp;
        if ($uptimeSeconds > 0) {
            $hours = floor($uptimeSeconds / 3600);
            $minutes = floor(($uptimeSeconds % 3600) / 60);
            $serverUptime = $hours . 'h ' . $minutes . 'm';
        }
    }

    // Database status
    try {
        \DB::connection()->getPdo();
        $databaseStatus = 'connected';
    } catch (Exception $e) {
        $databaseStatus = 'Unavailable';
    }

    // API response time (real)
    $apiResponseTime = 'Unavailable';
    $startTime = microtime(true);
    try {
        \DB::select('SELECT 1');
        $endTime = microtime(true);
        $apiResponseTime = round(($endTime - $startTime) * 1000, 2) . ' ms';
    } catch (Exception $e) {
        $apiResponseTime = 'Unavailable';
    }

    // Storage usage
    $diskTotal = @disk_total_space(base_path());
    $diskFree = @disk_free_space(base_path());
    $diskUsed = ($diskTotal !== false && $diskFree !== false) ? $diskTotal - $diskFree : null;
    $storagePercent = ($diskTotal > 0 && $diskUsed !== null) ? round(($diskUsed / $diskTotal) * 100, 1) : 'Unavailable';

    return response()->json([
        'server' => [
            'status' => $serverStatus,
            'uptime' => $serverUptime,
        ],
        'database' => [
            'status' => $databaseStatus,
        ],
        'api' => [
            'response_time' => $apiResponseTime,
        ],
        'storage' => [
            'used_percent' => $storagePercent,
            'total' => $diskTotal,
            'free' => $diskFree,
        ],
        'timestamp' => now(),
    ]);
});

// Authentication routes
require __DIR__.'/auth.php';

// Resource routes for all models
require __DIR__.'/user.php';
require __DIR__.'/category.php';
require __DIR__.'/trainingCourse.php';
require __DIR__.'/trainingSession.php';
require __DIR__.'/registration.php';
require __DIR__.'/courseContent.php';
require __DIR__.'/courseCompletion.php';
require __DIR__.'/feedback.php';
require __DIR__.'/sessionCompletion.php';
require __DIR__.'/notification.php';
require __DIR__.'/imageApi.php';



