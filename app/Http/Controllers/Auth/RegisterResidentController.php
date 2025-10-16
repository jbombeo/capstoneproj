<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Resident;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Str;

class RegisterResidentController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/residentregister', [
            'zones' => Zone::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required','email','max:255','unique:users,email'],
            'password' => ['required','confirmed', Rules\Password::defaults()],
            'last_name' => 'required|string|max:50',
            'first_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'birth_date' => 'required|date',
            'birth_place' => 'nullable|string|max:255',
            'age' => 'required|integer|min:0',
            'zone_id' => 'required|exists:zones,id',
            'gender' => 'required|string|max:20',
            'total_household' => 'nullable|string|max:50',
            'relationto_head_of_family' => 'nullable|string|max:50',
            'civil_status' => 'nullable|string|max:50',
            'occupation' => 'nullable|string|max:100',
            'household_no' => 'nullable|string|max:50',
            'religion' => 'nullable|string|max:50',
            'nationality' => 'nullable|string|max:50',
            'skills' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('residents', 'public');
        }

        $user = User::create([
            'name' => $validated['first_name'].' '.$validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'resident',
            'is_approved' => false,
        ]);

        $validated['user_id'] = $user->id;
        Resident::create($validated);

        return redirect()->route('login')
            ->with('success','Registration submitted. Wait for admin approval.');
    }

    // public function approve(User $user)
    // {
    //     $user->is_approved = true;
    //     $user->save();
    //     return back()->with('success','User approved.');
    // }

    // public function reject(User $user)
    // {
    //     $user->delete();
    //     return back()->with('success','User rejected.');
    // }

public function approve(User $user)
{
    // Generate a random password
    $plainPassword = Str::random(10);

    // Update user
    $user->password = Hash::make($plainPassword);
    $user->is_approved = true;
    $user->save();

    // Optional: send email to resident
    Mail::raw(
        "Your account has been approved.\n\nEmail: {$user->email}\nPassword: {$plainPassword}\nPlease change after first login.",
        function ($message) use ($user) {
            $message->to($user->email)
                    ->subject("Resident Account Approved");
        }
    );

    // ✅ Return JSON instead of redirect
    return response()->json([
        'generatedPassword' => $plainPassword
    ]);
}





}
