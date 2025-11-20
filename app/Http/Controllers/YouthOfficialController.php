<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SKOfficial;
use Inertia\Inertia;

class YouthOfficialController extends Controller
{
    public function official()
    {
        $officials = SKOfficial::all();

        return Inertia::render('youth/official', [
            'officials' => $officials
        ]);
    }
}
