<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\MobileAuthController;
use App\Http\Controllers\API\MobileActivityController;

Route::prefix('mobile')->group(function () {

    // Public
    Route::post('/login', [MobileAuthController::class, 'login']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [MobileAuthController::class, 'me']);
        Route::post('/logout', [MobileAuthController::class, 'logout']);
        Route::get('/activities', [MobileActivityController::class, 'index']);
    });

});
