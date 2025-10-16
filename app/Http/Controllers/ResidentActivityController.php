<?php

namespace App\Http\Controllers\Resident;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Inertia\Inertia;

class ResidentActivityController extends Controller
{
    /**
     * Display a list of activities for residents.
     */
    public function index()
    {
        // Fetch activities with their photos, newest first
        $activities = Activity::with('activity_photos')
            ->orderBy('dateofactivity', 'desc')
            ->get();

        return Inertia::render('Resident/ActivitiesDashboard', [
            'activities' => $activities,
        ]);
    }

    /**
     * Show a single activity (optional if you want a detail page)
     */
    public function show($id)
    {
        $activity = Activity::with('activity_photos')->findOrFail($id);

        return Inertia::render('Resident/ActivityDetail', [
            'activity' => $activity,
        ]);
    }
}
