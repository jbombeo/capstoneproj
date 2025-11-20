<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('participants')->get();

        return Inertia::render('Youth/Projects', [
            'projects' => $projects
        ]);
    }
}
