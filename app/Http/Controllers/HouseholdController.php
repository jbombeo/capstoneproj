<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\Resident;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HouseholdController extends Controller
{
    public function index()
    {

        $households = Household::with(['zone', 'headOfFamily.zone'])->get();

   
        $households = $households->map(function ($h) {
            return [
                'id' => $h->id,
                'household_no' => $h->household_no,
                'household_member' => $h->household_member,
                'zone' => $h->zone,
                'headOfFamily' => $h->headOfFamily, 
            ];
        });


        $heads = Resident::with('zone')->get();

        return Inertia::render('household', [
            'households' => $households,
            'heads' => $heads,
        ]);
    }

public function store(Request $request)
{
    $request->validate([
        'household_no' => 'required|integer|unique:household,household_no',
        'household_member' => 'required|integer',
        'head_of_family' => 'required|unique:household,head_of_family',
    ]);

    $resident = \App\Models\Resident::findOrFail($request->head_of_family);

    Household::create([
        'household_no' => $request->household_no,
        'household_member' => $request->household_member,
        'head_of_family' => $request->head_of_family,
        'zone_id' => $resident->zone_id,
    ]);

    return redirect()->back()->with('success', 'Household added successfully!');
}

public function update(Request $request, Household $household)
{
    $request->validate([
        'household_no' => 'required|integer|unique:household,household_no,' . $household->id,
        'household_member' => 'required|integer',

    ]);

    $household->update([
        'household_no' => $request->household_no,
        'household_member' => $request->household_member,

    ]);

    return redirect()->back()->with('success', 'Household updated successfully!');
}

    public function destroy(Household $household)
    {
        $household->delete();
        return back();
    }
}
