<?php

namespace App\Http\Controllers;

use App\Models\Blotter;
use App\Models\Hotline;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ResidentBlotterController extends Controller
{
    /**
     * Display the list of blotters related to the logged-in resident.
     */
    public function index()
    {
        $user = Auth::user();

        // Fetch blotters where the resident is the complainant
        $blotters = Blotter::where('complainant', $user->name)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('resident/blotter', [
            'blotters' => $blotters,
            'user' => $user,
            'hotlines' => \App\Models\Hotline::all()   // ✅ ADD THIS
        ]);
    }

    /**
     * Store a new blotter record.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'complainant' => 'required|string|max:100',
            'complainant_address' => 'nullable|string|max:255',
            'complainant_age' => 'nullable|integer',
            'complainant_contact' => 'nullable|string|max:50',
            'complainee' => 'required|string|max:100',
            'complainee_address' => 'nullable|string|max:255',
            'complainee_age' => 'nullable|integer',
            'complainee_contact' => 'nullable|string|max:50',
            'complaint' => 'required|string',
            'incident_datetime' => 'nullable|date',
        ]);

        $data['year_recorded'] = now()->year;
        $data['status'] = 'unsettled';

        Blotter::create($data);

        return redirect()->back()->with('success', 'Blotter submitted successfully.');
    }
}