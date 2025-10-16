<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Official;
use Inertia\Inertia;

class ResidentOfficialController extends Controller
{
    public function index()
    {
        // Fetch all officials
        $officials = Official::all();

        // Render Inertia page
        return Inertia::render('resident/official', [ // <-- Use component name
            'officials' => $officials
        ]);
    }
}
