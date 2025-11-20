<?php

namespace App\Http\Controllers;

use App\Models\SKOfficial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SKOfficialController extends Controller
{
    /**
     * Display a listing of the SK officials.
     */
    public function index()
    {
        return Inertia::render('sk/officials', [
            'officials' => SKOfficial::orderBy('id', 'desc')->get(),
        ]);
    }

    /**
     * Show the page (handled inside modal via Inertia).
     */
    public function create()
    {
        return Inertia::render('sk/officials');
    }

    /**
     * Store a newly created SK official.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'position'      => 'required|string|max:50',
            'complete_name' => 'required|string|max:100',
            'contact'       => 'nullable|string|max:20',
            'address'       => 'nullable|string|max:150',
            'term_start'    => 'nullable|date',
            'term_end'      => 'nullable|date|after_or_equal:term_start',
            'status'        => 'nullable|string|max:20',
            'image'         => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('sk-officials', 'public');
        }

        $data['users_id'] = auth()->id();

        SKOfficial::create($data);

        return back()->with('success', 'SK Official added successfully.');
    }

    /**
     * ✅ View specific SK official details
     */
    public function show(SKOfficial $official)
    {
        return Inertia::render('sk/officials/View', [
            'official' => $official,
        ]);
    }

    /**
     * Edit a specific SK official (handled by modal in React).
     */
    public function edit(SKOfficial $official)
    {
        return Inertia::render('sk/officials/Edit', [
            'official' => $official,
        ]);
    }

    /**
     * Update a specific SK official.
     */
public function update(Request $request, SKOfficial $official)
{
    $data = $request->validate([
        'position'      => 'nullable|string|max:50',
        'complete_name' => 'nullable|string|max:100',
        'contact'       => 'nullable|string|max:20',
        'address'       => 'nullable|string|max:150',
        'term_start'    => 'nullable|date',
        'term_end'      => 'nullable|date|after_or_equal:term_start',
        'status'        => 'nullable|string|in:active,inactive,leave',
        'image'         => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
    ]);

    if ($request->hasFile('image')) {
        if ($official->image && Storage::disk('public')->exists($official->image)) {
            Storage::disk('public')->delete($official->image);
        }
        $data['image'] = $request->file('image')->store('sk-officials', 'public');
    }

    $official->update(array_filter($data)); // ✅ Update only provided fields

    return back()->with('success', 'SK Official updated successfully.');
}


    /**
     * Remove a specific SK official.
     */
    public function destroy(SKOfficial $official)
    {
        if ($official->image && Storage::disk('public')->exists($official->image)) {
            Storage::disk('public')->delete($official->image);
        }

        $official->delete();

        return back()->with('success', 'SK Official deleted successfully.');
    }
}
