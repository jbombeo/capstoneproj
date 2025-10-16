<?php

namespace App\Http\Controllers;

use App\Models\Youth;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YouthController extends Controller
{
    public function index()
    {
        $youths = Youth::with('user')->latest()->get();
        return Inertia::render('Youth/Index', compact('youths'));
    }

    public function create()
    {
        $users = User::where('role', 'youth')->get();
        return Inertia::render('Youth/Create', compact('users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:10',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'skills' => 'nullable|string',
            'interests' => 'nullable|string',
            'registration_status' => 'nullable|in:pending,approved,rejected',
        ]);

        Youth::create($request->all());

        return redirect()->route('youth.index')->with('success', 'Youth added.');
    }

    public function edit(Youth $youth)
    {
        return Inertia::render('Youth/Edit', compact('youth'));
    }

    public function update(Request $request, Youth $youth)
    {
        $request->validate([
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:10',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'skills' => 'nullable|string',
            'interests' => 'nullable|string',
            'registration_status' => 'nullable|in:pending,approved,rejected',
        ]);

        $youth->update($request->all());

        return redirect()->route('youth.index')->with('success', 'Youth updated.');
    }

    public function destroy(Youth $youth)
    {
        $youth->delete();
        return redirect()->route('youth.index')->with('success', 'Youth deleted.');
    }
}
