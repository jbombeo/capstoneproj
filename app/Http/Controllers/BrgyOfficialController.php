<?php

namespace App\Http\Controllers;

use App\Models\Official;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrgyOfficialController extends Controller
{
    public function index()
    {
        // Eager load related user if you want user data also
        $officials = Official::with('user')->get();

        return Inertia::render('official', [
            'officials' => $officials
        ]);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'position'      => 'required|string|max:50',
        'complete_name' => 'required|string|max:255',
        'contact'       => 'required|string|max:50',
        'address'       => 'required|string|max:255',
        'term_start'    => 'required|date',
        'term_end'      => 'required|date',
        'status'        => 'required|string',
        'image'         => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // new
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('officials', 'public');
        $validated['image'] = $path;
    }

    $validated['users_id'] = auth()->id();

    Official::create($validated);

    return redirect()->route('officials.index')
        ->with('success', 'Official added successfully!');
}

public function update(Request $request, Official $official)
{
    $validated = $request->validate([
        'position' => 'required|string|max:255',
        'complete_name' => 'required|string|max:255',
        'contact' => 'required|string|max:20',
        'address' => 'required|string|max:255',
        'term_start' => 'required|date',
        'term_end' => 'required|date|after_or_equal:term_start',
        'status' => 'required|in:Active,Inactive,Leave',
        'image'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // new
    ]);

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('officials', 'public');
        $validated['image'] = $path;
    }

    $official->update($validated);

    return redirect()->route('officials.index')->with('success', 'Official updated successfully.');
}


public function destroy(Official $official)
{
    $official->delete();

    return redirect()->route('officials.index')
        ->with('success', 'Official deleted successfully!');
}


}
