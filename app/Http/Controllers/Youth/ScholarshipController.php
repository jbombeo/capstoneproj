<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use Inertia\Inertia;

class ScholarshipController extends Controller
{
    public function index()
    {
        $scholarships = Scholarship::latest()->get();

        return Inertia::render('Youth/Scholarships', [
            'scholarships' => $scholarships
        ]);
    }
}
