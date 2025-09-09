<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ZoneController extends Controller
{
    public function index()
    {
        // fetch all zones
        $zones = Zone::all();

        // pass data to Inertia page
        return Inertia::render('zone', [
            'zones' => $zones
        ]);
    }

        public function store(Request $request)
    {
        $validated = $request->validate([
            'zone' => 'required|string|max:15',
            'username' => 'required|string|max:50',
            'password' => 'required|string|max:255',
        ]);

        // Create new zone
        Zone::create($validated);

        return redirect()->route('zones.index')->with('success', 'Zone created successfully!');
    }

        public function edit(Zone $zone): Response
    {
        return Inertia::render('Zone/Edit', [
            'zone' => $zone,
        ]);
    }

    public function update(Request $request, Zone $zone)
    {
        $validated = $request->validate([
            'zone' => 'required|string|max:15',
            'username' => 'required|string|max:50',
            'password' => 'required|string|max:255',
        ]);

        $zone->update($validated);

        return redirect()->route('zones.index')->with('success', 'Zone updated successfully!');
    }

    public function destroy(Zone $zone)
{
    $zone->delete();

    return redirect()->route('zones.index')
        ->with('success', 'Zone deleted successfully!');
}

}
