<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Participation;
use App\Models\Youth;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ParticipationController extends Controller
{
    public function register(Project $project)
    {
        $youth = Youth::firstOrCreate(['user_id' => Auth::id()]);

        Participation::firstOrCreate([
            'project_id' => $project->id,
            'youth_id' => $youth->id
        ], [
            'attendance_status' => 'registered'
        ]);

        return back()->with('success', 'Registered successfully.');
    }
}
