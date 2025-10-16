<?php

namespace App\Http\Controllers;

use App\Models\SKOfficial;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SKOfficialController extends Controller
{
    public function index()
    {
        $skOfficials = SKOfficial::with('user')->latest()->get();
        return Inertia::render('SKOfficials/Index', compact('skOfficials'));
    }

    public function create()
    {
        $users = User::where('role', 'sk_official')->get();
        return Inertia::render('SKOfficials/Create', compact('users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'required|string|max:255',
            'term_start' => 'nullable|date',
            'term_end' => 'nullable|date',
        ]);

        SKOfficial::create($request->all());

        return redirect()->route('sk_officials.index')->with('success', 'SK Official added.');
    }

    public function edit(SKOfficial $skOfficial)
    {
        return Inertia::render('SKOfficials/Edit', compact('skOfficial'));
    }

    public function update(Request $request, SKOfficial $skOfficial)
    {
        $request->validate([
            'position' => 'required|string|max:255',
            'term_start' => 'nullable|date',
            'term_end' => 'nullable|date',
        ]);

        $skOfficial->update($request->only('position', 'term_start', 'term_end'));

        return redirect()->route('sk_officials.index')->with('success', 'SK Official updated.');
    }

    public function destroy(SKOfficial $skOfficial)
    {
        $skOfficial->delete();
        return redirect()->route('sk_officials.index')->with('success', 'SK Official deleted.');
    }
}
