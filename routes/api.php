<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Website\AuthController;
use App\Http\Controllers\Api\User\TaskController;
use App\Http\Controllers\Api\Website\WebsiteSettingController;
use App\Http\Controllers\Api\User\UserDashboardController;


Route::get('/website/settings', [WebsiteSettingController::class, 'index']);

Route::prefix('website')->name('website.')->group(function () {
    Route::prefix('auth')->name('auth.')->controller(AuthController::class)->group(function () {
        Route::post('/register', 'register')->name('register');
        Route::post('/login', 'login')->name('login');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', 'me')->name('me');
            Route::post('/logout', 'logout')->name('logout');
        });
    });
});


Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    
    Route::get('/dashboard', [UserDashboardController::class, 'index']);
    Route::apiResource('tasks', TaskController::class);
    Route::put('/profile', [UserDashboardController::class, 'updateProfile']);
});
