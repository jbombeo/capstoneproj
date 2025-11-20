<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Youth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $youth = Youth::where('user_id', Auth::id())->first();

        return Inertia::render('Youth/Settings', [
            'youth' => $youth
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'age' => 'nullable|integer'
        ]);

        $youth = Youth::firstOrCreate(['user_id' => Auth::id()]);
        $youth->update($request->all());

        return back()->with('success', 'Profile updated successfully.');
    }
}
