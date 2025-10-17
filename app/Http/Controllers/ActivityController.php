<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ActivityController extends Controller
{
    // --- Display all activities with their photos ---
    public function index()
    {
        $activities = Activity::with('activity_photos')
            ->orderBy('dateofactivity', 'asc')
            ->get();

        return Inertia::render('Activity', compact('activities'));
    }

    // --- Store a new activity with optional photos ---
    public function store(Request $request)
    {
        $request->validate([
            'dateofactivity' => 'required|date',
            'activity' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photos.*' => 'nullable|image|max:5120', // 5MB max
        ]);

        $activity = Activity::create([
            'dateofactivity' => $request->dateofactivity,
            'activity' => $request->activity,
            'description' => $request->description,
        ]);

        $this->storePhotos($request, $activity);

        return redirect()->back()->with('success', 'Activity added successfully!');
    }

    // --- Show a single activity (optional for detail page) ---
    public function show(Activity $activity)
    {
        $activity->load('activity_photos');

        return Inertia::render('ActivityShow', compact('activity'));
    }

    // --- Edit activity (for Inertia form) ---
    public function edit(Activity $activity)
    {
        $activity->load('activity_photos');

        return Inertia::render('ActivityEdit', compact('activity'));
    }

    // --- Update activity and handle new photo uploads ---
    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'dateofactivity' => 'required|date',
            'activity' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photos.*' => 'nullable|image|max:5120',
        ]);

        $activity->update([
            'dateofactivity' => $request->dateofactivity,
            'activity' => $request->activity,
            'description' => $request->description,
        ]);

        $this->storePhotos($request, $activity);

        return redirect()->route('activities.index')->with('success', 'Activity updated successfully!');
    }

    // --- Delete an activity and its photos ---
    public function destroy(Activity $activity)
    {
        foreach ($activity->activity_photos as $photo) {
            if (Storage::exists('public/' . $photo->filename)) {
                Storage::delete('public/' . $photo->filename);
            }
            $photo->delete();
        }

        $activity->delete();

        return redirect()->route('activities.index')->with('success', 'Activity deleted successfully!');
    }

    // --- Private helper to store uploaded photos ---
    private function storePhotos(Request $request, Activity $activity)
    {
        if (!$request->hasFile('photos')) return;

        foreach ($request->file('photos') as $photo) {
            $filename = Str::uuid() . '.' . $photo->getClientOriginalExtension();
            $photo->storeAs('public/activity_photos', $filename);

            ActivityPhoto::create([
                'activity_id' => $activity->id,
                'filename' => 'activity_photos/' . $filename,
            ]);
        }
    }
}
