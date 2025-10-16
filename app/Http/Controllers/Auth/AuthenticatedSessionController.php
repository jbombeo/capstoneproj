<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show login view.
     */
    public function create()
    {
        return inertia('auth/login'); // Inertia
        // return view('auth.login'); // Or Blade
    }

    /**
     * Handle login.
     */
    public function store(Request $request)
    {
        // Validate credentials
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt login
        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('The provided credentials do not match our records.'),
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        // Check approval for resident / sk / youth
        if (in_array($user->role, ['resident', 'sk', 'youth']) && !$user->is_approved) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => 'Your account is not yet approved by the admin.',
            ]);
        }

        // Redirect to dashboard based on role
        return match($user->role) {
            'admin' => redirect()->route('dashboard'),
            'sk' => redirect()->route('sk.dashboard'),
            'youth' => redirect()->route('youth.dashboard'),
            default => redirect()->route('resident.home'), // resident
        };
    }

    /**
     * Logout
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
