<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('skOfficial.user')->latest()->get();
        return Inertia::render('Projects/Index', compact('projects'));
    }

    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'sk_official_id' => 'required|exists:sk_officials,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric',
            'status' => 'nullable|in:planned,ongoing,completed,cancelled',
        ]);

        Project::create($request->all());

        return redirect()->route('projects.index')->with('success', 'Project created.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', compact('project'));
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'location' => 'nullable|string|max:255',
            'budget' => 'nullable|numeric',
            'status' => 'nullable|in:planned,ongoing,completed,cancelled',
        ]);

        $project->update($request->all());

        return redirect()->route('projects.index')->with('success', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Project deleted.');
    }
}
