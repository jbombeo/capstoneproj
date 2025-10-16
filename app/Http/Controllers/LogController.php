<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    /**
     * Show all logs (for admin or user viewing).
     */
    public function index()
    {
        $logs = Log::with('user')
            ->latest('log_date')
            ->get();

        return Inertia::render('Logs/Index', [
            'logs' => $logs,
        ]);
    }

    /**
     * Record a user action.
     */
    public static function record($userId, $action)
    {
        Log::create([
            'user_id' => $userId,
            'action' => $action,
            'log_date' => now(),
        ]);
    }
}
