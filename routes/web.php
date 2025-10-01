<?php

use Tighten\Ziggy\Ziggy;
// use App\Http\Controllers\Auth\RegisterResidentController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DocumentRequestController;
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

    // General Dashboard for Admin
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard')->middleware('role:admin');

    // General Dashboard for Secretary
    Route::get('secretary-dashboard', function () {
        return Inertia::render('secretary/dashboard');
    })->name('secretary.dashboard')->middleware('role:secretary');

    // SK Dashboard
    Route::get('sk-dashboard', function () {
        return Inertia::render('sk/dashboard');
    })->name('sk.dashboard')->middleware('role:sk');

    // Youth Dashboard
    Route::get('youth-dashboard', function () {
        return Inertia::render('youth/dashboard');
    })->name('youth.dashboard')->middleware('role:youth');

        // Resident Dashboard
    // Route::get('resident-dashboard', function () {
    //     return Inertia::render('resident/dashboard');
    // })->name('resident.dashboard')->middleware('role:resident');




    // // Admin approval
    // Route::post('/resident/{user}/approve', [RegisterResidentController::class, 'approve'])
    // ->middleware(['auth', 'can:approve-resident'])
    // ->name('residentregister.approve');

    // Route::delete('/resident/{user}/reject', [RegisterResidentController::class, 'reject'])
    // ->middleware(['auth', 'can:approve-resident'])
    // ->name('residentregister.reject');

    // For Official Page
    Route::get('/officials', [BrgyOfficialController::class, 'index'])
        ->name('officials.index')->middleware('role:admin,secretary');
    Route::post('/officials', [BrgyOfficialController::class, 'store'])
        ->name('officials.store')->middleware('role:admin,secretary'); 
    Route::delete('/officials/{official}', [BrgyOfficialController::class, 'destroy'])
        ->name('officials.destroy')->middleware('role:admin,secretary');
    Route::put('/officials/{official}', [BrgyOfficialController::class, 'update'])
        ->name('officials.update')->middleware('role:admin,secretary');

        // Resident Register
    Route::get('/residentregister', [ResidentController::class, 'create'])
        ->name('residentregister.create');

    Route::post('/residentregister', [ResidentController::class, 'store'])
        ->name('residentregister.store');

    // Admin approval
    // Route::post('/resident/{user}/approve', [ResidentController::class, 'approve'])
    // ->middleware(['auth', 'can:approve-resident'])
    // ->name('residentregister.approve');

    // Route::delete('/resident/{user}/reject', [ResidentController::class, 'reject'])
    // ->middleware(['auth', 'can:approve-resident'])
    // ->name('residentregister.reject');


    
    // Admin routes for residents
// Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    
    // List all residents
    Route::get('/residentregistereds', [ResidentController::class, 'index'])
        ->name('residentregistereds.index');

    // Pending residents
    
    Route::get('/residentregistereds/pending', [ResidentController::class, 'pending'])
        ->name('residentregistereds.pending');

    // Approve a resident
    Route::post('/residentregistereds/{resident}/approve', [ResidentController::class, 'approve'])
        ->name('residentregistereds.approve');

    // Reject a resident
    Route::post('/residentregistereds/{resident}/reject', [ResidentController::class, 'reject'])
    ->name('residentregistereds.reject');

    // Show a resident details
    Route::get('/residentregistereds/{resident}', [ResidentController::class, 'show'])
        ->name('residentregistereds.show');
// });




    //     // List all document requests (admin)
    // Route::get('/document-requests', [DocumentRequestController::class, 'index'])
    //     ->name('document-requests.index');
    // Route::post('/document-requests', [DocumentRequestController::class, 'store'])
    //     ->name('document-requests.store');

    // // Accept a request (admin) → sets status to processed & redirects to proper print page
    // Route::post('/document-requests/{documentRequest}/accept', [DocumentRequestController::class, 'accept'])
    //     ->name('document.requests.accept');

    // // Decline a request (admin)
    // Route::post('/document-requests/{documentRequest}/decline', [DocumentRequestController::class, 'decline'])
    //     ->name('document.requests.decline');

    // // Update status dynamically (used for ready_for_release or released)
    // Route::put('/document-requests/{documentRequest}/status', [DocumentRequestController::class, 'updateStatus'])
    //     ->name('document.requests.updateStatus');

    // // Print document
    // Route::get('/document-requests/{documentRequest}/print', [DocumentRequestController::class, 'print'])
    //     ->name('document.requests.print');

    // // Release document via QR scan
    // Route::post('/document-requests/{documentRequest}/release', [DocumentRequestController::class, 'releaseViaQR'])
    //     ->name('document.requests.release');



    // Route::post('/document-requests/{documentRequest}/accept', [DocumentRequestController::class, 'accept'])
    //     ->name('document-requests.accept');
    // Route::get('/document-requests/release/{qr_token}', [DocumentRequestController::class, 'releaseByQr'])
    //     ->name('document-requests.release');

    // Route::get('/BarangayClearances', [DocumentController::class, 'BarangayClearance'])
    //     ->name('barangay.clearances');
    // Route::get('/CertificateOfIndigenous', [DocumentController::class, 'CertificateOfIndigenous'])
    //     ->name('certificate.indigenous');

    // For Blotters Page
    Route::get('/blotters', [BlotterController::class, 'index'])
        ->name('blotters.index')->middleware('role:admin,secretary');
    Route::post('/blotters', [BlotterController::class, 'store'])
        ->name('blotters.store')->middleware('role:admin,secretary');
    Route::get('/blotters/{blotter}/edit', [BlotterController::class, 'edit'])
        ->name('blotters.edit')->middleware('role:admin,secretary');
    Route::put('/blotters/{blotter}', [BlotterController::class, 'update'])
        ->name('blotters.update')->middleware('role:admin,secretary');
    Route::delete('/blotters/{blotter}', [BlotterController::class, 'destroy'])
        ->name('blotters.destroy')->middleware('role:admin,secretary');

// ------------------ DOCUMENT REQUESTS ------------------

// Admin: List all document requests
// ------------------ DOCUMENT REQUESTS ------------------

// Admin: List all document requests
Route::get('/documentrequests', [DocumentRequestController::class, 'index'])
    ->name('document-requests.index');

// Resident: Submit new request
Route::post('/documentrequests', [DocumentRequestController::class, 'store'])
    ->name('document-requests.store');

// Admin: Accept request (status → on process)
Route::put('/documentrequests/{documentRequest}/accept', [DocumentRequestController::class, 'accept'])
    ->name('document-requests.accept');

// Admin: Decline request
Route::put('/documentrequests/{documentRequest}/decline', [DocumentRequestController::class, 'decline'])
    ->name('document-requests.decline');

// Admin: Update request status dynamically
Route::put('/documentrequests/{documentRequest}/status', [DocumentRequestController::class, 'updateStatus'])
    ->name('document-requests.update-status');

// QR Code generation (uses qr_token)
Route::get('/documentrequests/{documentRequest}/qrcode', [DocumentRequestController::class, 'qrcode'])
    ->name('documentrequests.qrcode');

// Release via QR scan
Route::get('/documentrequests/release/{qr_token}', [DocumentRequestController::class, 'releaseByQr'])
    ->name('documentrequests.release');

// ------------------ BARANGAY CLEARANCE ------------------

// Admin: List all Barangay Clearance requests
Route::get('/barangay-clearances', [DocumentRequestController::class, 'barangayClearance'])
    ->name('barangay.clearances');

// Print specific Barangay Clearance
Route::get('/barangay-clearances/{documentRequest}/print', [DocumentRequestController::class, 'print'])
    ->name('barangay-clearances.print');

// ------------------ CERTIFICATE OF INDIGENOUS ------------------

// Admin: List all Certificate of Indigenous requests
Route::get('/certificate-indigenous', [DocumentRequestController::class, 'certificateOfIndigenous'])
    ->name('certificate.indigenous');

// Print specific Certificate of Indigenous
Route::get('/certificate-indigenous/{documentRequest}/print', [DocumentRequestController::class, 'print'])
    ->name('certificate.indigenous.print');
    
    // Households
    Route::get('/households', [HouseholdController::class, 'index'])->name('households.index')->middleware('role:admin,secretary');
    Route::post('/households', [HouseholdController::class, 'store'])->name('households.store')->middleware('role:admin,secretary');
    Route::get('/households/{household}/edit', [HouseholdController::class, 'edit'])->name('households.edit')->middleware('role:admin,secretary');
    Route::put('/households/{household}', [HouseholdController::class, 'update'])->name('households.update')->middleware('role:admin,secretary');
    Route::delete('/households/{household}', [HouseholdController::class, 'destroy'])->name('households.destroy')->middleware('role:admin,secretary');

    // Revenue
    Route::get('brgyrevenue', [RevenueController::class, 'index'])->name('brgyrevenue')->middleware('role:admin,secretary');

    // Zones
    Route::get('/zones', [ZoneController::class, 'index'])->name('zones.index')->middleware('role:admin,secretary');
    Route::post('/zones', [ZoneController::class, 'store'])->name('zones.store')->middleware('role:admin,secretary');
    Route::get('/zones/{zone}/edit', [ZoneController::class, 'edit'])->name('zones.edit')->middleware('role:admin,secretary');
    Route::put('/zones/{zone}', [ZoneController::class, 'update'])->name('zones.update')->middleware('role:admin,secretary');
    Route::delete('/zones/{zone}', [ZoneController::class, 'destroy'])->name('zones.destroy')->middleware('role:admin,secretary');


    // --- View (everyone: admin, secretary, user) ---
Route::get('/activities', [ActivityController::class, 'index'])
    ->name('activities.index')
    ->middleware('role:admin,secretary');

Route::get('/activities/{activity}', [ActivityController::class, 'show'])
    ->name('activities.show')
    ->middleware('role:admin,secretary,user');

// --- Manage (only admin, secretary) ---
Route::get('/activities/create', [ActivityController::class, 'create'])
    ->name('activities.create')
    ->middleware('role:admin,secretary');

Route::post('/activities', [ActivityController::class, 'store'])
    ->name('activities.store')
    ->middleware('role:admin,secretary');

Route::get('/activities/{activity}/edit', [ActivityController::class, 'edit'])
    ->name('activities.edit')
    ->middleware('role:admin,secretary');

Route::put('/activities/{activity}', [ActivityController::class, 'update'])
    ->name('activities.update')
    ->middleware('role:admin,secretary');

Route::delete('/activities/{activity}', [ActivityController::class, 'destroy'])
    ->name('activities.destroy')
    ->middleware('role:admin,secretary');
    
    
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
