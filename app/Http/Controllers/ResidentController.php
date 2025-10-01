<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\Resident;
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
        return inertia('auth/residentregister', compact('zones'));
    }

    /**
     * Store a new resident registration.
     */
    public function store(Request $request)
    {
        $request->validate([
                    'email' => [
            'required',
            'email',
            'max:255',
            function ($attribute, $value, $fail) {
                // Check in users table
                if (\App\Models\User::where('email', $value)->exists()) {
                    $fail('This email is already registered as a user.');
                }

                // Check in resident table
                if (\App\Models\Resident::where('email', $value)->exists()) {
                    $fail('This email is already used by another pending resident.');
                }
            },
        ],
            'email' => ['required','email','max:255','unique:resident,email','unique:users,email'],
            'last_name' => 'required|string|max:50',
            'first_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'birth_date' => 'required|date',
            'birth_place' => 'nullable|string|max:100',
            'age' => 'required|integer|min:0',
            'zone_id' => 'required|exists:zone,id',
            'gender' => 'required|string|max:20',
            'total_household' => 'nullable|integer|min:1',
            'relationto_head_of_family' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|max:50',
            'occupation' => 'nullable|string|max:100',
            'household_no' => 'nullable|integer',
            'religion' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:50',
            'skills' => 'nullable|string|max:100',
            'remarks' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

    $data = $request->except(['image']);

    // Handle image upload
    if ($request->hasFile('image')) {
        $data['image'] = $request->file('image')->store('resident_images', 'public');
    }

    // Default status = pending
    $data['status'] = 'pending';

    // user_id is null for pending residents
    $data['user_id'] = null;

    Resident::create($data);

    return redirect()->route('login')->with('success', 'Registration submitted. Please wait for admin approval.');
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
    public function approve(Resident $resident)
    {
        if ($resident->status !== 'pending') {
            return back()->with('error', 'Resident already approved.');
        }

        // Check if email already exists in users table
        if (User::where('email', $resident->email)->exists()) {
            return back()->with('error', 'Email already exists in the system.');
        }

        // Generate a random password
        $password = Str::random(10);

        // Create user account
        $user = User::create([
            'name' => $resident->first_name . ' ' . $resident->last_name,
            'email' => $resident->email,
            'password' => Hash::make($password),
            'role' => 'resident',
        ]);

        // Link resident to user and update status
        $resident->update([
            'user_id' => $user->id,
            'status' => 'approved',
        ]);

        // Send credentials via email
        // Mail::to($user->email)->send(new ResidentApprovedMail($user, $password));
    Log::info("Generated password for {$resident->email}: {$password}");

        return back()->with('success', 'Resident approved and credentials sent.');
    }

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
}
