<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    /**
     * Confirm the user's password.
     */
public function store(Request $request): RedirectResponse
{
    if (! Auth::guard('web')->validate([
        'email' => $request->user()->email,
        'password' => $request->password,
    ])) {
        throw ValidationException::withMessages([
            'password' => __('auth.password'),
        ]);
    }

    $request->session()->put('auth.password_confirmed_at', time());

    // Redirect based on user role
    $user = $request->user();
    return match($user->role) {
        'admin' => redirect()->intended(route('dashboard')),
        'sk' => redirect()->intended(route('sk.dashboard')),
        'youth' => redirect()->intended(route('youth.dashboard')),
        'resident' => redirect()->intended(route('resident.home')),
        default => redirect()->intended(route('dashboard')),
    };
}

}
