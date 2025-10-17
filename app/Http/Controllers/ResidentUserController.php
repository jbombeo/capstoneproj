<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\User;
use App\Models\Activity;
use App\Models\Zone;
use Inertia\Inertia;


class ResidentUserController extends Controller
{
    public function home()
    {
        $activities = Activity::with('activity_photos')
            ->orderBy('dateofactivity', 'desc')
            ->get();

        return Inertia::render('resident/home', [
            'activities' => $activities,
        ]);
    }

    public function profile()
    {
        return Inertia::render('resident/profile');
    }

    public function officials()
    {
        return Inertia::render('Resident/BarangayOfficial');
    }

    public function requestDocument()
    {
        return Inertia::render('Resident/DocumentRequestResident');
    }

    public function barangayClearance()
    {
        return Inertia::render('Resident/BarangayClearance');
    }

    public function certificateIndigenous()
    {
        return Inertia::render('Resident/CertificateIndigenous');
    }

    public function blotter()
    {
        return Inertia::render('Resident/Blotter');
    }
}
