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
    // --- Display all activities ---
    public function index()
    {
        // Each photo now automatically includes its "url" attribute from the model
        $activities = Activity::with('activity_photos')->get();

        return inertia('Activity', compact('activities'));
    }

    // --- Store new activity ---
    public function store(Request $request)
    {
        $request->validate([
            'dateofactivity' => 'required|date',
            'activity' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photos.*' => 'nullable|image|max:2048',
        ]);

        // Create new activity record
        $activity = Activity::create([
            'dateofactivity' => $request->dateofactivity,
            'activity' => $request->activity,
            'description' => $request->description,
        ]);

        // Store uploaded photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $filename = Str::uuid() . '.' . $photo->getClientOriginalExtension();
                $photo->storeAs('public/activity_photos', $filename);

                ActivityPhoto::create([
                    'activity_id' => $activity->id,
                    'filename' => 'activity_photos/' . $filename,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Activity added successfully!');
    }

    // --- Show single activity (optional) ---
    public function show(Activity $activity)
    {
        $activity->load('activity_photos');

        return Inertia::render('ActivityShow', [
            'activity' => $activity,
        ]);
    }

    // --- Edit form (optional if using modal edit in React) ---
    public function edit(Activity $activity)
    {
        $activity->load('activity_photos');
        return Inertia::render('ActivityEdit', compact('activity'));
    }

    // --- Update existing activity ---
    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'dateofactivity' => 'required|date',
            'activity' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photos.*' => 'nullable|image|max:2048',
        ]);

        $activity->update([
            'dateofactivity' => $request->dateofactivity,
            'activity' => $request->activity,
            'description' => $request->description,
        ]);

        // Handle new photos if uploaded
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $filename = Str::uuid() . '.' . $photo->getClientOriginalExtension();
                $photo->storeAs('public/activity_photos', $filename);

                ActivityPhoto::create([
                    'activity_id' => $activity->id,
                    'filename' => 'activity_photos/' . $filename,
                ]);
            }
        }

        return redirect()->route('activities.index')->with('success', 'Activity updated successfully!');
    }

    // --- Delete an activity and its photos ---
    public function destroy(Activity $activity)
    {
        foreach ($activity->activity_photos as $photo) {
            // Delete physical file if it exists
            if (Storage::exists('public/' . $photo->filename)) {
                Storage::delete('public/' . $photo->filename);
            }

            $photo->delete();
        }

        $activity->delete();

        return redirect()->route('activities.index')->with('success', 'Activity deleted successfully!');
    }
}
