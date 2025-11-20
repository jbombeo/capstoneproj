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
        // Load all households with related residents
        $households = Household::with([
            'zone',
            'head',
            'residents' => function ($q) {
                $q->orderBy('relationto_head_of_family', 'asc');
            }
        ])->get();

        // Transform result for frontend
        $households = $households->map(function ($h) {
            return [
                'id' => $h->id,
                'household_no' => $h->household_no,
                'zone' => $h->zone,
                'household_member' => $h->residents->count(), // REAL member count

                // Head of Family
                'headOfFamily' => [
                    'id'         => $h->head?->id,
                    'first_name' => $h->head?->first_name,
                    'last_name'  => $h->head?->last_name,
                    'zone'       => $h->head?->zone,
                    'image'      => $h->head?->image,  // <-- ADDED IMAGE
                ],

                // Members for modal
                'members' => $h->residents->map(function ($m) {
                    return [
                        'id'       => $m->id,
                        'first_name' => $m->first_name,
                        'last_name'  => $m->last_name,
                        'relation'   => $m->relationto_head_of_family,
                        'gender'     => $m->gender,
                        'age'        => $m->age,
                        'image'      => $m->image, // <-- ADDED IMAGE
                    ];
                }),
            ];
        });

        // List of eligible heads (relation = Head)
        $heads = Resident::where('relationto_head_of_family', 'Head')
            ->with('zone')
            ->get();

        return Inertia::render('household', [
            'households' => $households,
            'heads' => $heads,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'household_no' => 'required|integer|unique:household,household_no',
            'head_of_family' => 'required|exists:resident,id|unique:household,head_of_family',
        ]);

        $resident = Resident::findOrFail($request->head_of_family);

        Household::create([
            'household_no' => $request->household_no,
            'zone_id' => $resident->zone_id,
            'head_of_family' => $request->head_of_family,
            'household_member' => 1,
        ]);

        return back()->with('success', 'Household added successfully!');
    }

    public function update(Request $request, Household $household)
    {
        $request->validate([
            'household_no' => 'required|integer|unique:household,household_no,' . $household->id,
        ]);

        $household->update([
            'household_no' => $request->household_no,
        ]);

        return back()->with('success', 'Household updated successfully!');
    }

    public function destroy(Household $household)
    {
        $household->delete();
        return back()->with('success', 'Household deleted.');
    }
}
