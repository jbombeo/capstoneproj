<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlotterController extends Controller
{
    public function index()
    {
        $blotters = Blotter::orderBy('created_at', 'desc')->get();

        return Inertia::render('blotter', [
            'blotters' => $blotters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'complainant' => 'required|string|max:255',
            'complainee' => 'required|string|max:255',
            'complaint' => 'required|string',
            'status' => 'required|in:unsettled,settled,scheduled',
            'handled_by' => 'nullable|string|max:255',
            'incident_datetime' => 'nullable|date',
        ]);

        Blotter::create($validated);

        return redirect()->back()->with('success', 'Blotter added successfully.');
    }
    public function edit(Blotter $blotter)
    {
        return Inertia::render('Blotters/Edit', [
            'blotter' => $blotter
        ]);
    }

    public function update(Request $request, Blotter $blotter)
    {
        // If the request only contains status (from dropdown)
        if ($request->has('status') && count($request->all()) === 1) {
            $request->validate([
                'status' => 'required|in:unsettled,settled,scheduled',
            ]);

            $blotter->update(['status' => $request->status]);

            // Return JSON to avoid full page reload for dropdown updates
            return response()->json(['message' => 'Status updated successfully']);
        }

        // Full validation for normal edits
        $validated = $request->validate([
            'complainant' => 'required|string|max:255',
            'complainee' => 'required|string|max:255',
            'complaint' => 'required|string',
            'status' => 'required|in:unsettled,settled,scheduled',
            'handled_by' => 'nullable|string|max:255',
            'incident_datetime' => 'nullable|date',
        ]);

        $blotter->update($validated);

        return redirect()->route('blotters.index')->with('success', 'Blotter updated successfully!');
    }


    public function destroy(Blotter $blotter)
{
    $blotter->delete();

    return redirect()->route('blotters.index')->with('success', 'Blotter deleted successfully!');
}
}
