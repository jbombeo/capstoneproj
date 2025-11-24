<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Resident;
use App\Models\Household;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResidentApprovedMail;

class ResidentController extends Controller
{
public function index()
{
    $residents = \App\Models\Resident::with('zone')->latest()->get();
    $zones = \App\Models\Zone::all();

    return inertia('residentregistered', [
        'residents' => $residents,
        'zones' => $zones,
    ]);
}
    /**
     * Show the registration form for residents.
     */
 public function create()
{
    $zones = Zone::all();

    // Load all heads from database
    $heads = Resident::where('relationto_head_of_family', 'Head')
        ->select('id', 'zone_id', \DB::raw("CONCAT(first_name, ' ', last_name) AS full_name"))
        ->get();

    // Debug check (remove after testing)
    // dd($heads);

    return inertia('auth/residentregister', [
        'zones' => $zones,
        'heads' => $heads,
    ]);
}


    /**
     * Store a new resident registration.
     */
public function store(Request $request)
{
    $request->validate([
        'email' => [
            'required', 'email', 'max:255',
            function ($attribute, $value, $fail) {
                if (User::where('email', $value)->exists()) {
                    $fail('This email is already registered as a user.');
                }
                if (Resident::where('email', $value)->exists()) {
                    $fail('This email is already used by another pending resident.');
                }
            },
        ],
        'last_name' => 'required|string|max:50',
        'first_name' => 'required|string|max:50',
        'birth_date' => 'required|date',
        'zone_id' => 'required|exists:zone,id',
        'gender' => 'required|string|max:20',
        'relationto_head_of_family' => 'required|string|max:50',
        'family_head_id' => 'nullable|exists:resident,id',
        'image' => 'nullable|image|max:2048',
    ]);

    $data = $request->except(['image']);
    $data['status'] = 'pending';
    $data['user_id'] = null;

    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')->store('resident_images', 'public');
    }

    // =======================================================
    // CASE 1: Head of Family → CREATE NEW HOUSEHOLD
    // =======================================================
    if ($request->relationto_head_of_family === 'Head') {

        $resident = Resident::create($data);

        $nextHousehold = (Household::max('household_no') ?? 0) + 1;

        Household::create([
            'household_no' => $nextHousehold,
            'zone_id' => $resident->zone_id,
            'head_of_family' => $resident->id,
            'household_member' => 1,
        ]);

        $resident->update([
            'household_no' => $nextHousehold,
            'family_head_id' => $resident->id,
        ]);

        return redirect()->route('login')
            ->with('success', 'Registration submitted. Household created.');
    }

    // =======================================================
    // CASE 2: Not Head → MUST SELECT A HEAD
    // =======================================================
    if (!$request->family_head_id) {
        return back()->withErrors([
            'family_head_id' => 'Please select your head of family.'
        ]);
    }

    $head = Resident::find($request->family_head_id);

    if (!$head || $head->relationto_head_of_family !== 'Head') {
        return back()->withErrors([
            'family_head_id' => 'Selected family head is invalid.'
        ]);
    }

    if ($head->zone_id != $request->zone_id) {
        return back()->withErrors([
            'family_head_id' => 'Selected head belongs to another zone.'
        ]);
    }

    $household = Household::where('head_of_family', $head->id)->first();

    if (!$household) {
        return back()->withErrors([
            'family_head_id' => 'This head has no household assigned.'
        ]);
    }

    // Save resident with same household_no
    $data['household_no'] = $household->household_no;
    $data['family_head_id'] = $head->id;

    Resident::create($data);

    $household->increment('household_member');

    return redirect()->route('login')
        ->with('success', 'Registration submitted successfully.');
}


    /**
     * Admin: Show pending residents.
     */
    public function pending()
    {
        $residents = Resident::with('zone')->where('status', 'pending')->get();
        return inertia('Admin/ResidentsPending', compact('residents'));
    }

    /**
     * Admin: Approve resident registration.
     */
    // public function approve(Resident $resident)
    // {
    //     if ($resident->status !== 'pending') {
    //         return back()->with('error', 'Resident already approved.');
    //     }

    //     // Check if email already exists in users table
    //     if (User::where('email', $resident->email)->exists()) {
    //         return back()->with('error', 'Email already exists in the system.');
    //     }

    //     // Generate a random password
    //     $password = Str::random(10);

    //     // Create user account
    //     $user = User::create([
    //         'name' => $resident->first_name . ' ' . $resident->last_name,
    //         'email' => $resident->email,
    //         'password' => Hash::make($password),
    //         'role' => 'resident',
    //     ]);

    //     // Link resident to user and update status
    //     $resident->update([
    //         'user_id' => $user->id,
    //         'status' => 'approved',
    //     ]);

    //     // Send credentials via email
    //     // Mail::to($user->email)->send(new ResidentApprovedMail($user, $password));
    // Log::info("Generated password for {$resident->email}: {$password}");

    //     return back()->with('success', 'Resident approved and credentials sent.');
    // }

    /**
     * Optional: Show a resident's details (admin or user view)
     */
    public function show(Resident $resident)
    {
        return inertia('Resident/ViewResident', compact('resident'));
    }

    /**
     * Optional: Admin can reject a pending resident.
     */
    public function reject(Resident $resident)
    {
        if ($resident->status !== 'pending') {
            return back()->with('error', 'Resident already processed.');
        }

        $resident->update(['status' => 'rejected']);

        return back()->with('success', 'Resident registration rejected.');
    }



public function approve($id)
{
    $resident = Resident::findOrFail($id);

    $resident->status = 'approved';
    $resident->save();

    if (!$resident->user_id) {

        $password = Str::random(8);

        $user = User::create([
            'name' => $resident->first_name . ' ' . $resident->last_name,
            'email' => $resident->email,
            'password' => bcrypt($password),
            'role' => 'resident',
            'is_approved' => true,
        ]);

        $resident->user_id = $user->id;
        $resident->save();

        // ✔ SEND EMAIL
        Mail::to($resident->email)->send(
            new ResidentApprovedMail($resident, $password)
        );

        return response()->json([
            'message' => 'Resident approved and user created. Email sent.',
            'generatedPassword' => $password,
        ]);

    } else {

        $resident->user->is_approved = true;
        $resident->user->save();

        // ✔ SEND EMAIL EVEN IF USER ALREADY EXISTS
        Mail::to($resident->email)->send(
            new ResidentApprovedMail($resident, null)
        );

        return response()->json([
            'message' => 'Resident approved. Email sent.',
        ]);
    }
}
}
