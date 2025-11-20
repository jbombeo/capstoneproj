<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Youth;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $youth = Youth::where('user_id', Auth::id())->first();
        $announcements = Announcement::latest()->get();

        return Inertia::render('youth/home', [
            'youth' => $youth,
            'announcements' => $announcements
        ]);
    }
}
