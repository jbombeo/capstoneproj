<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
public function store(Request $request): RedirectResponse
{
    $user = $request->user();

    if ($user->hasVerifiedEmail()) {
        // Redirect based on role
        return match($user->role) {
            'admin' => redirect()->intended(route('dashboard')),
            'sk' => redirect()->intended(route('sk.dashboard')),
            'youth' => redirect()->intended(route('youth.dashboard')),
            'resident' => redirect()->intended(route('resident.home')),
            default => redirect()->intended(route('home')),
        };
    }

    $user->sendEmailVerificationNotification();

    return back()->with('status', 'verification-link-sent');
}

}
