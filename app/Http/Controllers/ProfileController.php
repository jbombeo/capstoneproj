<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Resident;
use App\Models\Zone;
use Inertia\Inertia;

class ProfileController extends Controller
{
public function index()
{
    $user = Auth::user();
    $resident = Resident::with('zone')->where('user_id', $user->id)->first();
    $zones = Zone::all(); // <-- pass all zones

    return inertia('resident/profile', [
        'user' => $user,
        'resident' => $resident,
        'zones' => $zones,
    ]);
}

    public function update(Request $request)
    {
        $user = Auth::user();
        $resident = Resident::where('user_id', $user->id)->firstOrFail();

        $data = $request->validate([
            'first_name'                => 'required|string|max:50',
            'middle_name'               => 'nullable|string|max:50',
            'last_name'                 => 'required|string|max:50',
            'birth_date'                => 'nullable|date',
            'birth_place'               => 'nullable|string|max:100',
            'age'                       => 'required|integer',
            'zone_id'                   => 'required|exists:zones,id',
            'total_household'           => 'nullable|integer|min:1',
            'relationto_head_of_family' => 'nullable|string|max:50',
            'civil_status'              => 'nullable|string|max:20',
            'occupation'                => 'nullable|string|max:100',
            'household_no'              => 'nullable|integer',
            'religion'                  => 'nullable|string|max:50',
            'nationality'               => 'nullable|string|max:30',
            'gender'                    => 'required|string|max:10',
            'skills'                    => 'nullable|string|max:100',
            'remarks'                   => 'nullable|string',
            'image'                     => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('resident_images', 'public');
            $data['image'] = $path;
        }

        $resident->update($data);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

}
