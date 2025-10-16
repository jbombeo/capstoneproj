<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role'     => 'required|in:admin,secretary,sk,youth,resident', // ✅ validate role
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role, // ✅ store role
        ]);

        event(new Registered($user));

        Auth::login($user);

        // ✅ Optional: redirect based on role
        return match ($user->role) {
            'resident'     => redirect()->route('resident.home'),
            'sk'     => redirect()->route('sk.dashboard'),
            'youth'  => redirect()->route('youth.dashboard'),
            'admin'  => redirect()->route('dashboard'), // or an admin dashboard
            default  => redirect()->intended(route('dashboard')),
        };
    }
}
