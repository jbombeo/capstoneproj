<?php

use Tighten\Ziggy\Ziggy;

use App\Http\Controllers\AdminScholarController;
use App\Http\Controllers\HotlineController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\YouthOfficialController;
use App\Http\Controllers\YouthProjectController;
use App\Http\Controllers\YouthDashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ScholarshipController;
use App\Http\Controllers\SKOfficialController;
use App\Http\Controllers\ScholarshipApplicationController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\YouthController;
use App\Http\Controllers\SKDashboardController;
use App\Http\Controllers\ResidentBlotterController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ResidentActivityController;
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
// use App\Http\Controllers\RevenueController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\BlotterController;
use App\Http\Controllers\BrgyOfficialController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/mobile/webview/login', function (Request $request) {

    $token = $request->query('token');

    if (!$token) {
        return abort(401, "Missing token.");
    }

    $accessToken = PersonalAccessToken::findToken($token);

    if (!$accessToken) {
        return abort(401, "Invalid token.");
    }

    $user = $accessToken->tokenable;

    if ($user->role !== 'resident') {
        return abort(403, "Only resident accounts can access this dashboard.");
    }

    Auth::login($user);

    return redirect()->route('resident.home');
});


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

    Route::get('resident-dashboard', fn() => Inertia::render('resident/home'))
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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
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

    Route::get('/feedback', [FeedbackController::class, 'adminIndex'])->name('admin.feedback');
    Route::patch('/feedback/{feedback}', [FeedbackController::class, 'updateStatus'])
        ->name('admin.feedback.update');


Route::get('/hotlines', [HotlineController::class, 'index'])
    ->name('hotlines.index');

// ---------------- HOTLINES ----------------

// Everyone can view (resident + admin)
Route::get('/hotlines', [HotlineController::class, 'index'])
    ->name('hotlines.index');

// Admin only for CRUD
Route::middleware(['role:admin'])->group(function () {

    Route::get('/hotlines/create', [HotlineController::class, 'create'])
        ->name('hotlines.create');

    Route::post('/hotlines', [HotlineController::class, 'store'])
        ->name('hotlines.store');

    Route::put('/hotlines/{hotline}', [HotlineController::class, 'update'])
        ->name('hotlines.update');

    Route::delete('/hotlines/{hotline}', [HotlineController::class, 'destroy'])
        ->name('hotlines.destroy');

    Route::get('/scholars/granted', [ScholarshipController::class, 'index'])
        ->name('scholars.granted');

    Route::get('/scholarships', [AdminScholarController::class, 'index'])
        ->name('scholarships.index');
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
   Route::get('/report/revenues', [ReportController::class, 'revenues'])
    ->name('report.revenues')

    
    ->middleware('role:admin,secretary');

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

    // ⚙️ Settings under /resident/settings
    // Route::prefix('settings')->name('resident.settings.')->group(function () {
    //     Route::get('/', [ResidentSettingsController::class, 'index'])->name('index');
    //     Route::get('/password', [ResidentSettingsController::class, 'password'])->name('password');
    //     Route::put('/password', [ResidentSettingsController::class, 'update'])->name('password.update');
    // });
    });



//     // Dashboard or home route
// Route::get('/dashboard', function () {
//     return Inertia\Inertia::render('Dashboard');
// })->name('dashboard')->middleware(['auth']);

// Scholarship Routes (SK Official)
// Route::middleware(['auth', 'role:sk'])->group(function () {
//     // Show all scholarships + inline create/edit
//     Route::get('/scholarships', [ScholarshipController::class, 'index'])->name('scholarships.index');

//     // Create a new scholarship
//     Route::post('/scholarships', [ScholarshipController::class, 'store'])->name('scholarships.store');

//     // Update an existing scholarship (inline edit)
//     Route::put('/scholarships/{scholarship}', [ScholarshipController::class, 'update'])->name('scholarships.update');

//     // Delete a scholarship
//     Route::delete('/scholarships/{scholarship}', [ScholarshipController::class, 'destroy'])->name('scholarships.destroy');
// });


Route::middleware(['auth', 'role:sk'])
    ->prefix('sk')
    ->name('sk.')
    ->group(function () {

    // 🏠 SK Dashboard
    Route::get('/dashboard', SKDashboardController::class)->name('sk.dashboard');

    // 👥 Youth Management
    Route::get('/youth', [YouthController::class, 'index'])->name('youth.index');
    Route::get('/youth/{youth}', [YouthController::class, 'show'])->name('youth.show');
    Route::post('/youth/{youth}/approve', [YouthController::class, 'approve'])->name('youth.approve');
    Route::post('/youth/{youth}/reject', [YouthController::class, 'reject'])->name('youth.reject');

    // 🎓 Scholarship Applications
Route::get('/scholarship-applications', [ScholarshipApplicationController::class, 'index'])
    ->name('scholarship-applications.index');
    Route::get('/scholarship-applications/{application}', [ScholarshipApplicationController::class, 'show'])
        ->name('scholarship-applications.show');
Route::patch('/scholarship-applications/{application}/status', [ScholarshipApplicationController::class, 'updateStatus'])
    ->name('scholarship-applications.update-status');
    Route::delete('/scholarship-applications/{application}', [ScholarshipApplicationController::class, 'destroy'])
        ->name('scholarship-applications.destroy');

    // 📋 Service Requests
    Route::get('/requests', [ServiceRequestController::class, 'index'])->name('requests.index');
    Route::get('/requests/{requestModel}', [ServiceRequestController::class, 'show'])->name('requests.show');
    Route::patch('/requests/{requestModel}/status', [ServiceRequestController::class, 'updateStatus'])
        ->name('requests.update-status');
    Route::delete('/requests/{requestModel}', [ServiceRequestController::class, 'destroy'])
        ->name('requests.destroy');

    // 📢 Announcements
    Route::resource('announcements', AnnouncementController::class);

    // 🏗️ Projects
    Route::resource('projects', ProjectController::class);

    // 🧑‍⚖️ SK Officials
    Route::resource('officials', SKOfficialController::class);

    // 🎓 Scholarships
    Route::resource('scholarships', ScholarshipController::class);
    Route::post('/scholarships/{id}/restore', [ScholarshipController::class, 'restore'])
        ->name('scholarships.restore');
});

Route::middleware(['auth', 'role:youth'])
    ->prefix('youth')
    ->name('youth.')
    ->group(function () {
    Route::get('/home', [YouthDashboardController::class, 'index'])->name('home');

        Route::get('/projects', [YouthDashboardController::class, 'projects'])->name('projects');
    Route::post('/projects/register/{id}', [YouthDashboardController::class, 'projectRegister'])->name('projects.register');

    // List of projects
    Route::get('/projects', [YouthProjectController::class, 'index']);

    // Register for a project
    Route::post('/projects/register/{project}', [YouthProjectController::class, 'register']);

    Route::get('/scholarships', [YouthDashboardController::class, 'scholarships'])->name('scholarships');
    // Route::post('/scholarships/apply/{id}', [YouthDashboardController::class, 'scholarshipApply'])->name('scholarships.apply');
Route::post('/scholarships/{id}/apply', [YouthDashboardController::class, 'apply'])
    ->name('scholarships.apply');

    Route::get('/official', [YouthOfficialController::class, 'official'])
        ->name('officials');
    Route::get('/settings', [YouthDashboardController::class, 'settings'])->name('settings');
    Route::post('/settings/update-password', [YouthDashboardController::class, 'updatePassword'])->name('settings.updatePassword');
    
});


// RESIDENT ROUTES - WebView will work now
Route::middleware(['auth', 'role:resident'])
    ->prefix('resident')
    ->name('resident.')
    ->group(function () {

        Route::get('/home', [ResidentUserController::class, 'home'])->name('home');

        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::put('/profile/update/{id}', [ProfileController::class, 'update'])->name('profile.update');
        Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');

        Route::get('/officials', [ResidentOfficialController::class, 'index'])->name('officials.index');

        Route::get('/document-requests', [DocumentRequestResidentController::class, 'index'])
            ->name('documentrequests.index');

        Route::post('/document-requests', [DocumentRequestResidentController::class, 'store'])
            ->name('documentrequests.store');

        Route::get('/document-requests/{id}', [DocumentRequestResidentController::class, 'show'])
            ->name('documentrequests.show');

        Route::get('/request', [ResidentUserController::class, 'request'])->name('request');

        Route::get('/blotters', [ResidentBlotterController::class, 'index'])->name('blotters');
        Route::post('/blotters', [ResidentBlotterController::class, 'store'])->name('blotters.store');

        Route::get('/activities', [ResidentActivityController::class, 'index'])->name('activities');
        Route::get('/activities/{id}', [ResidentActivityController::class, 'show'])->name('activities.show');

        Route::get('/feedback', [FeedbackController::class, 'index'])->name('resident.feedback');
        Route::post('/feedback/store', [FeedbackController::class, 'store'])->name('resident.feedback.store');

        Route::get('/settings', [ResidentSettingsController::class, 'index'])->name('resident.settings.index');
        Route::put('/settings', [ResidentSettingsController::class, 'update'])->name('resident.settings.update');

        Route::get('/barangay-clearance', [ResidentUserController::class, 'barangayClearance'])->name('barangay.clearance');
        Route::get('/certificate-indigenous', [ResidentUserController::class, 'certificateIndigenous'])->name('certificate.indigenous');

    });



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
