<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/auth.php'));
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
            Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/user.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/registration.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/feedback.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/trainingCourse.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/trainingSession.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/category.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/notification.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/sessionCompletion.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/courseContent.php'));
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/courseCompletion.php'));

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/imageApi.php'));

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/certController.php'));

        });
    }
}
