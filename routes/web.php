<?php

use App\Http\Controllers\ZoneController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\RequestDocController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\CertIndigencyController;
use App\Http\Controllers\BrgyOfficialController;
use App\Http\Controllers\BrgycertificatesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


// For Official Page
Route::get('/officials', [BrgyOfficialController::class, 'index'])
    ->name('officials.index');
Route::post('/officials', [BrgyOfficialController::class, 'store'])
    ->name('officials.store'); 
Route::delete('/officials/{official}', [BrgyOfficialController::class, 'destroy'])
    ->name('officials.destroy');
Route::put('/officials/{official}', [BrgyOfficialController::class, 'update'])
    ->name('officials.update');

        
Route::get('residents', [ResidentController::class, 'index'])
    ->name('residents');
    
Route::get('brgycertificates', [BrgycertificatesController::class, 'index'])
    ->name('brgycertificates');

Route::get('certindigency', [CertIndigencyController::class, 'index'])
    ->name('certindigency');


// For Blotters Page
Route::get('/blotters', [BlotterController::class, 'index'])
    ->name('blotters.index');
Route::post('/blotters', [BlotterController::class, 'store'])
    ->name('blotters.store');
Route::get('/blotters/{blotter}/edit', [BlotterController::class, 'edit'])
    ->name('blotters.edit');
Route::put('/blotters/{blotter}', [BlotterController::class, 'update'])
    ->name('blotters.update');
Route::delete('/blotters/{blotter}', [BlotterController::class, 'destroy'])
    ->name('blotters.destroy');


Route::get('requestdoc', [RequestDocController::class, 'index'])
    ->name('requestdoc');
    
Route::get('household', [HouseholdController::class, 'index'])
    ->name('household');
        
Route::get('brgyrevenue', [RevenueController::class, 'index'])
    ->name('brgyrevenue');


// For Zone Page
Route::get('/zones', [ZoneController::class, 'index'])
    ->name('zones.index');
Route::post('/zones', [ZoneController::class, 'store'])
    ->name('zones.store');
Route::get('/zones/{zone}/edit', [ZoneController::class, 'edit'])
    ->name('zones.edit');
Route::put('/zones/{zone}', [ZoneController::class, 'update'])
    ->name('zones.update');
Route::delete('/zones/{zone}', [ZoneController::class, 'destroy'])
    ->name('zones.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
