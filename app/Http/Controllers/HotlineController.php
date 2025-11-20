<?php

namespace App\Http\Controllers;

use App\Models\Hotline;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotlineController extends Controller
{
    public function index()
    {
        $hotlines = Hotline::all();
        $user = auth()->user();

        // Resident view
        if ($user->role === 'resident') {
            return Inertia::render('resident/blotter', [
                'hotlines' => $hotlines,
            ]);
        }

        // Admin view
        return Inertia::render('hotline', [
            'hotlines' => $hotlines,
        ]);
    }

    public function create()
    {
        return Inertia::render('HotlineCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'number' => 'required|string|max:255',
        ]);

        Hotline::create($validated);

        return redirect()->route('hotlines.index')
            ->with('success', 'Hotline added successfully.');
    }

    public function update(Request $request, Hotline $hotline)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'number' => 'required|string|max:255',
        ]);

        $hotline->update($validated);

        return redirect()->route('hotlines.index')
            ->with('success', 'Hotline updated successfully.');
    }

    public function destroy(Hotline $hotline)
    {
        $hotline->delete();

        return redirect()->route('hotlines.index')
            ->with('success', 'Hotline deleted successfully.');
    }
}
