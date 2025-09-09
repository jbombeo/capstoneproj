<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlotterController extends Controller
{
    public function index()
    {
        $blotters = Blotter::all(); // fetch all data

        return Inertia::render('blotter', [
            'blotters' => $blotters
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
        $request->validate([
            'complainant' => 'required|string|max:255',
            'complainee' => 'required|string|max:255',
            'complaint' => 'required|string',
            'status' => 'required|in:unsettled,settled,scheduled',
        ]);

        $blotter->update($request->all());

        return redirect()->route('blotters.index')->with('success', 'Blotter updated successfully!');
    }

    public function destroy(Blotter $blotter)
{
    $blotter->delete();

    return redirect()->route('blotters.index')->with('success', 'Blotter deleted successfully!');
}
}
