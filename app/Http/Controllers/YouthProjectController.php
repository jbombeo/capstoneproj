<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Participation;
use Illuminate\Http\Request;

class YouthProjectController extends Controller
{
    // List all projects for youth
    public function index()
    {
        $youthId = auth()->user()->youth->id;

        $projects = Project::withCount('participants')
            ->get()
            ->map(function($project) use ($youthId) {

                $participation = Participation::where('project_id', $project->id)
                    ->where('youth_id', $youthId)
                    ->first();

                $project->attendance_status = $participation->attendance_status ?? "not_registered";

                return $project;
            });

        return inertia('youth/Projects', [
            'projects' => $projects
        ]);
    }


    // Youth registering for a project
    public function register(Project $project)
    {
        $youthId = auth()->user()->youth->id;

        // prevent duplicate
        $existing = Participation::where('project_id', $project->id)
            ->where('youth_id', $youthId)
            ->first();

        if ($existing) {
            return back()->with('success', 'You are already registered for this project.');
        }

        Participation::create([
            'project_id' => $project->id,
            'youth_id'   => $youthId,
            'attendance_status' => 'registered'
        ]);

        return back()->with('success', 'You have successfully registered!');
    }
}
