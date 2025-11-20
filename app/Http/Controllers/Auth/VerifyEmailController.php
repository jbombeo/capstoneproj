<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
public function __invoke(EmailVerificationRequest $request): RedirectResponse
{
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        // Already verified, redirect based on role
        return match($user->role) {
            'admin' => redirect()->intended(route('dashboard').'?verified=1'),
            'sk' => redirect()->intended(route('sk.dashboard').'?verified=1'),
            'youth' => redirect()->intended(route('youth.home').'?verified=1'),
            'resident' => redirect()->intended(route('resident.home').'?verified=1'),
            default => redirect()->intended(route('dashboard').'?verified=1'),
        };
    }

    // Fulfill verification
    $request->fulfill();

    // Redirect based on role after verification
    return match($user->role) {
        'admin' => redirect()->intended(route('dashboard').'?verified=1'),
        'sk' => redirect()->intended(route('sk.dashboard').'?verified=1'),
        'youth' => redirect()->intended(route('youth.home').'?verified=1'),
        'resident' => redirect()->intended(route('resident.home').'?verified=1'),
        default => redirect()->intended(route('dashboard').'?verified=1'),
    };
}

}
