<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityPhoto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    /**
     * Display all activities
     */
    public function index()
    {
        $activities = Activity::with('activity_photos')->latest()->get();

        return Inertia::render('Activity', [
            'activities' => $activities,
        ]);
    }

    /**
     * Store a new activity
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'dateofactivity' => 'required|date',
            'activity' => 'required|string|max:255',
            'description' => 'required|string',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB
        ], [
            'photos.*.max' => 'Each photo must not exceed 2MB.',
            'photos.*.image' => 'Each file must be a valid image.',
            'photos.*.mimes' => 'Only jpeg, png, jpg, gif, and webp are allowed.',
        ]);

        $activity = Activity::create([
            'dateofactivity' => $validated['dateofactivity'],
            'activity' => $validated['activity'],
            'description' => $validated['description'],
            'users_id' => auth()->id(),
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/activity_photos', $filename);

                ActivityPhoto::create([
                    'activity_id' => $activity->id,
                    'filename' => $filename,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Activity created successfully!');
    }

    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'dateofactivity' => 'required|date',
            'activity' => 'required|string|max:255',
            'description' => 'required|string',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ], [
            'photos.*.max' => 'Each photo must not exceed 2MB.',
            'photos.*.image' => 'Each file must be a valid image.',
            'photos.*.mimes' => 'Only jpeg, png, jpg, gif, and webp are allowed.',
        ]);

        $activity->update([
            'dateofactivity' => $validated['dateofactivity'],
            'activity' => $validated['activity'],
            'description' => $validated['description'],
        ]);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/activity_photos', $filename);

                ActivityPhoto::create([
                    'activity_id' => $activity->id,
                    'filename' => $filename,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Activity updated successfully!');
    }

    /**
     * Delete an activity
     */
    public function destroy(Activity $activity)
    {
        // Delete photos from storage
        foreach ($activity->activity_photos as $photo) {
            Storage::disk('public')->delete('activity_photos/' . $photo->filename);
        }

        $activity->delete();

        return redirect()->route('activities.index')
            ->with('success', 'Activity deleted successfully.');
    }
}
