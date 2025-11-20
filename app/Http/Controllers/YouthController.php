<?php

namespace App\Http\Controllers;

use App\Models\Youth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\YouthApprovedMail;

class YouthController extends Controller
{
    public function index()
    {
        $youths = Youth::latest()->get()->map(function ($youth) {
            return [
                'id' => $youth->id,
                'name' => trim("{$youth->first_name} {$youth->middle_name} {$youth->last_name}"),
                'email' => $youth->email,
                'age' => $youth->age,
                'gender' => $youth->gender,
                'phone' => $youth->contact_number,
                'skills' => $youth->skills ?? [],
                'status' => $youth->status,
                'birth_date' => $youth->birth_date,
                'birth_place' => $youth->birth_place,
                'image' => $youth->image ? asset('storage/' . $youth->image) : null,
            ];
        });

        return inertia('sk/youth', [
            'youth' => $youths,
        ]);
    }

    public function create()
    {
        return inertia('auth/youthregister');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (User::where('email', $value)->exists()) {
                        $fail('This email is already registered as a user.');
                    }
                    if (Youth::where('email', $value)->exists()) {
                        $fail('This email is already used by another pending youth.');
                    }
                },
            ],
            'last_name' => 'required|string|max:50',
            'first_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:100',
            'age' => 'required|integer|min:0',
            'gender' => 'required|string|max:20',
            'contact_number' => 'nullable|string|max:20',
            'skills' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->except('image');

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('youth_images', 'public');
        }

        $data['status'] = 'pending';
        $data['user_id'] = null;

        Youth::create($data);

        return redirect()->route('login')->with('success', 'Registration submitted. Please wait for SK approval.');
    }

public function approve($id)
{
    $youth = Youth::findOrFail($id);

    if ($youth->status !== 'pending') {
        return back()->with('error', 'This youth is already processed.');
    }

    // Generate random password
    $password = Str::random(8);

    // Create User account
    $user = User::create([
        'name' => $youth->first_name . ' ' . $youth->last_name,
        'email' => $youth->email,
        'password' => Hash::make($password),
        'role' => 'youth',
        'is_approved' => true,
    ]);

    // Update Youth record
    $youth->update([
        'user_id' => $user->id,
        'status' => 'approved',
    ]);

    try {
        // Send email with generated password
        Mail::to($youth->email)->send(new YouthApprovedMail($user, $password));

        Log::info("EMAIL SENT to {$youth->email} | Password: {$password}");
    } catch (\Exception $e) {
        Log::error("FAILED TO SEND EMAIL to {$youth->email}: " . $e->getMessage());
    }

    return response()->json([
        'message' => 'Youth approved successfully.',
        'generatedPassword' => $password,
    ]);
}


    public function reject($id)
    {
        $youth = Youth::findOrFail($id);

        if ($youth->status !== 'pending') {
            return back()->with('error', 'This youth application was already processed.');
        }

        $youth->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Youth rejected successfully.',
        ]);
    }
}
