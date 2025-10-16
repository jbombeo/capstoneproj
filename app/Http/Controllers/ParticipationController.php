<?php

namespace App\Http\Controllers;

use App\Models\Participation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipationController extends Controller
{
    public function index()
    {
        $participations = Participation::with('project', 'youth.user')->latest()->get();
        return Inertia::render('Participation/Index', compact('participations'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'youth_id' => 'required|exists:youth,id',
            'attendance_status' => 'nullable|in:registered,attended,absent',
        ]);

        Participation::create($request->all());

        return back()->with('success', 'Participation recorded.');
    }

    public function update(Request $request, Participation $participation)
    {
        $request->validate([
            'attendance_status' => 'required|in:registered,attended,absent',
        ]);

        $participation->update([
            'attendance_status' => $request->attendance_status,
        ]);

        return back()->with('success', 'Attendance updated.');
    }

    public function destroy(Participation $participation)
    {
        $participation->delete();
        return back()->with('success', 'Participation removed.');
    }
}
