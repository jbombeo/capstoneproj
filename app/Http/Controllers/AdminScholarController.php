<?php

namespace App\Http\Controllers;

use App\Models\Youth;
use App\Models\ScholarshipApplication;
use Inertia\Inertia;


class AdminScholarController extends Controller
{
public function index()
{
    $granted = \App\Models\ScholarshipApplication::with(['youth', 'scholarship'])
        ->where('status', 'granted')
        ->orderBy('updated_at', 'desc') // used as granted date
        ->get();

    return inertia('scholarship', [
        'grantedScholars' => $granted
    ]);
}


}
