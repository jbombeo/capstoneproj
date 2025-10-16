<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\DocumentTypeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');



    // Route::get('settings/services', function () {
    //     return Inertia::render('settings/services');
    // })->name('services');

    //     Route::get('settings/services', [DocumentTypeController::class, 'index'])
    //     ->name('services.index'); // Fetch & display document types

    // Route::post('settings/services', [DocumentTypeController::class, 'store'])
    //     ->name('services.store'); // Add new document type

    // Route::put('settings/services/{document_type}', [DocumentTypeController::class, 'update'])
    //     ->name('services.update'); // Update existing document type

    // Route::delete('settings/services/{document_type}', [DocumentTypeController::class, 'destroy'])
    //     ->name('services.destroy');
 // Delete document type
    // Route::get('settings/services', [DocumentTypeController::class, 'index'])
    //     ->name('services.index');
});
