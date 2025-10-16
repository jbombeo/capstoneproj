<?php

namespace App\Http\Controllers;

use App\Models\Scholarship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScholarshipController extends Controller
{
    // List scholarships (renders scholarship.tsx)
    public function index()
    {
        $scholarships = Scholarship::latest()->get();

        return Inertia::render('sk/scholarship', [
            'scholarships' => $scholarships,
            'errors' => session('errors')
        ]);
    }

    // Store a new scholarship
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'grant_amount' => 'nullable|numeric',
        ]);

        Scholarship::create([
            'sk_official_id' => auth()->user()->skOfficial->id,
            'title' => $request->title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'grant_amount' => $request->grant_amount,
        ]);

        return redirect()->route('scholarships.index')
                         ->with('success', 'Scholarship created successfully.');
    }

    // Update scholarship inline
    public function update(Request $request, Scholarship $scholarship)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'grant_amount' => 'nullable|numeric',
        ]);

        $scholarship->update($request->only(['title', 'description', 'start_date', 'end_date', 'grant_amount']));

        return redirect()->route('scholarships.index')
                         ->with('success', 'Scholarship updated successfully.');
    }

    // Delete a scholarship
    public function destroy(Scholarship $scholarship)
    {
        $scholarship->delete();

        return redirect()->route('scholarships.index')
                         ->with('success', 'Scholarship deleted successfully.');
    }
}
