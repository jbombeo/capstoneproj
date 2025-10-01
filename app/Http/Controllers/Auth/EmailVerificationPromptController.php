<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
public function __invoke(Request $request): Response|RedirectResponse
{
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        // Redirect based on role
        return match($user->role) {
            'admin' => redirect()->intended(route('dashboard')),
            'sk' => redirect()->intended(route('sk.dashboard')),
            'youth' => redirect()->intended(route('youth.dashboard')),
            'resident' => redirect()->intended(route('resident.dashboard')),
            default => redirect()->intended(route('home')),
        };
    }

    return Inertia::render('auth/verify-email', [
        'status' => $request->session()->get('status'),
    ]);
}

}
