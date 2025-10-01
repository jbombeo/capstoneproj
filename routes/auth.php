<?php

use App\Http\Controllers\ResidentController;
// use App\Http\Controllers\Auth\RegisterResidentController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {

    // General registration (admin could be created separately)
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('register.store');

    // Login
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
        
    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.store');

    // Password reset
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Email verification
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Password confirmation
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('password.confirm.store');

    // Logout
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

/*
|--------------------------------------------------------------------------
| Resident / SK / Youth Registration Routes
|--------------------------------------------------------------------------
*/
// // Show resident registration form
Route::get('/resident/register', [ResidentController::class, 'create'])
    ->name('residentregister.create');

// // Store registration (unapproved by default)
Route::post('/resident/register', [ResidentController::class, 'store'])
    ->name('residentregister.store');

// Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    
    // List all residents
    // Route::get('/residents', [ResidentController::class, 'index'])
    //     ->name('residents.index');

    // // Pending residents
    // Route::get('/residents/pending', [ResidentController::class, 'pending'])
    //     ->name('residents.pending');

//     // Approve a resident
//     Route::post('/residents/{resident}/approve', [ResidentController::class, 'approve'])
//         ->name('residents.approve');

//     // Reject a resident
//     Route::post('/residents/{resident}/reject', [ResidentController::class, 'reject'])
//     ->name('residents.reject');

//     // Show a resident details
//     Route::get('/residents/{resident}', [ResidentController::class, 'show'])
//         ->name('residents.show');
// });