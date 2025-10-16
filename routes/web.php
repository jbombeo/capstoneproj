<?php

use Tighten\Ziggy\Ziggy;
use App\Http\Controllers\ResidentActivityController;
use App\Http\Controllers\ScholarshipController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ResidentSettingsController;
use App\Http\Controllers\DocumentTypeController;
use App\Http\Controllers\ResidentOfficialController;
use App\Http\Controllers\DocumentRequestResidentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidentUserController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DocumentRequestController;
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\BrgyOfficialController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // ---------------- DASHBOARDS ----------------
    Route::get('dashboard', fn() => Inertia::render('dashboard'))
        ->name('dashboard')
        ->middleware('role:admin');

    Route::get('secretary-dashboard', fn() => Inertia::render('secretary/dashboard'))
        ->name('secretary.dashboard')
        ->middleware('role:secretary');

    Route::get('sk-dashboard', fn() => Inertia::render('sk/dashboard'))
        ->name('sk.dashboard')
        ->middleware('role:sk');

    Route::get('youth-dashboard', fn() => Inertia::render('youth/dashboard'))
        ->name('youth.dashboard')
        ->middleware('role:youth');

    Route::get('resident-dashboard', fn() => Inertia::render('resident/dashboard'))
        ->name('resident.home')
        ->middleware('role:resident');

    // ---------------- BARANGAY OFFICIALS ----------------
    Route::middleware(['role:admin,secretary'])->group(function () {
        Route::resource('officials', BrgyOfficialController::class)->except(['show', 'create', 'edit']);
    });

    // ---------------- RESIDENT REGISTRATION ----------------
    Route::get('/residentregister', [ResidentController::class, 'create'])->name('residentregister.create');
    Route::post('/residentregister', [ResidentController::class, 'store'])->name('residentregister.store');

    // Manage Registered Residents
    Route::prefix('residentregistereds')->group(function () {
        Route::get('/', [ResidentController::class, 'index'])->name('residentregistereds.index');
        Route::get('/pending', [ResidentController::class, 'pending'])->name('residentregistereds.pending');
        Route::post('/{resident}/approve', [ResidentController::class, 'approve'])->name('residentregistereds.approve');
        Route::post('/{resident}/reject', [ResidentController::class, 'reject'])->name('residentregistereds.reject');
        Route::get('/{resident}', [ResidentController::class, 'show'])->name('residentregistereds.show');
    });

    // ---------------- DOCUMENT REQUESTS (ADMIN) ----------------
    Route::prefix('documentrequests')->group(function () {
        Route::get('/', [DocumentRequestController::class, 'index'])->name('document-requests.index');
        Route::post('/', [DocumentRequestController::class, 'store'])->name('document-requests.store');

        Route::put('/{documentRequest}/accept', [DocumentRequestController::class, 'accept'])->name('document-requests.accept');
        Route::put('/{documentRequest}/decline', [DocumentRequestController::class, 'decline'])->name('document-requests.decline');
        Route::put('/{documentRequest}/status', [DocumentRequestController::class, 'updateStatus'])->name('document-requests.update-status');
        Route::put('/{documentRequest}/ready', [DocumentRequestController::class, 'markAsReady'])->name('document-requests.ready');

        // QR Code + Release
        Route::get('/{documentRequest}/qrcode', [DocumentRequestController::class, 'qrcode'])->name('documentrequests.qrcode');
        Route::post('/release/{token}', [DocumentRequestController::class, 'release'])->name('documentrequests.release');
        Route::get('/release/{token}', [DocumentRequestController::class, 'releaseStatus'])->name('documentrequests.release.status');
    });

    // ---------------- PRINTABLE DOCUMENTS ----------------
    Route::get('/barangay-clearances', [DocumentRequestController::class, 'barangayClearance'])->name('barangay.clearances');
    Route::get('/barangay-clearances/{documentRequest}/print', [DocumentRequestController::class, 'print'])->name('barangay-clearances.print');

    Route::get('/certificate-indigency', [DocumentRequestController::class, 'certificateOfIndigency'])->name('certificate.indigency');
    Route::get('/certificate-indigency/{documentRequest}/print', [DocumentRequestController::class, 'print'])->name('certificate.indigency.print');

    Route::get('/certificate-goodmoral', [DocumentRequestController::class, 'certificateOfGoodMoral'])->name('certificate.goodmoral');
    Route::get('/certificate-goodmoral/{documentRequest}/print', [DocumentRequestController::class, 'print'])->name('certificate.goodmoral.print');

    Route::get('/certificate-residency', [DocumentRequestController::class, 'certificateOfResidency'])->name('certificate.residency');
    Route::get('/certificate-residency/{documentRequest}/print', [DocumentRequestController::class, 'print'])->name('certificate.residency.print');

    // ---------------- BLOTTERS ----------------
    Route::middleware(['role:admin,secretary'])->group(function () {
        Route::resource('blotters', BlotterController::class)->except(['show', 'create']);
    });

    // ---------------- HOUSEHOLDS ----------------
    Route::middleware(['role:admin,secretary'])->group(function () {
        Route::resource('households', HouseholdController::class)->except(['show', 'create']);
    });

    // ---------------- REVENUE ----------------
    Route::get('brgyrevenue', [RevenueController::class, 'index'])->name('brgyrevenue')->middleware('role:admin,secretary');

    // ---------------- ZONES ----------------
    Route::middleware(['role:admin,secretary'])->group(function () {
        Route::resource('zones', ZoneController::class)->except(['show', 'create']);
    });

    // ---------------- ACTIVITIES ----------------
    Route::middleware(['role:admin,secretary'])->group(function () {
        Route::resource('activities', ActivityController::class)->except(['show']);
    });
    Route::get('/activities/{activity}', [ActivityController::class, 'show'])
        ->name('activities.show')
        ->middleware('role:admin,secretary,user');

    // ---------------- DOCUMENT TYPES (Services) ----------------
    Route::resource('services', DocumentTypeController::class)->except(['show', 'create', 'edit']);

    // ---------------- RESIDENT ROUTES ----------------
Route::middleware(['auth', 'role:resident'])
    ->prefix('resident')
    ->name('resident.')
    ->group(function () {
        Route::get('/home', [ResidentUserController::class, 'home'])->name('home');

        // Profile
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/profile/update/{id}', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');

        // Officials (view only)
        Route::get('/officials', [ResidentOfficialController::class, 'index'])->name('officials.index');

        // Document Requests
        Route::get('/document-requests', [DocumentRequestResidentController::class, 'index'])
            ->name('documentrequests.index');
        Route::post('/document-requests', [DocumentRequestResidentController::class, 'store'])
            ->name('documentrequests.store');
        Route::get('/document-requests/{id}', [DocumentRequestResidentController::class, 'show'])
            ->name('documentrequests.show');

        // Other resident services
        Route::get('/request', [ResidentUserController::class, 'request'])->name('request');
        Route::get('/blotter', [ResidentUserController::class, 'blotter'])->name('blotter');
        // -----------------------------
        // Activities / Events (new)
        // -----------------------------
        Route::get('/activities', [ResidentActivityController::class, 'index'])
            ->name('activities');
        Route::get('/activities/{id}', [ResidentActivityController::class, 'show'])
            ->name('activities.show');

        // Sub-pages
        Route::get('/barangay-clearance', [ResidentUserController::class, 'barangayClearance'])->name('barangay.clearance');
        Route::get('/certificate-indigenous', [ResidentUserController::class, 'certificateIndigenous'])->name('certificate.indigenous');
    });
        // ⚙️ Settings
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [ResidentSettingsController::class, 'index'])->name('index');
            Route::get('/password', [ResidentSettingsController::class, 'password'])->name('password');
            Route::put('/password', [ResidentSettingsController::class, 'update'])->name('password.update');
        });
    });



//     // Dashboard or home route
// Route::get('/dashboard', function () {
//     return Inertia\Inertia::render('Dashboard');
// })->name('dashboard')->middleware(['auth']);

// Scholarship Routes (SK Official)
Route::middleware(['auth', 'role:sk'])->group(function () {
    // Show all scholarships + inline create/edit
    Route::get('/scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');

    // Create a new scholarship
    Route::post('/scholarships', [ScholarshipController::class, 'store'])->name('scholarships.store');

    // Update an existing scholarship (inline edit)
    Route::put('/scholarships/{scholarship}', [ScholarshipController::class, 'update'])->name('scholarships.update');

    // Delete a scholarship
    Route::delete('/scholarships/{scholarship}', [ScholarshipController::class, 'destroy'])->name('scholarships.destroy');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
