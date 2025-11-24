<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class MobileActivityController extends Controller
{
    /**
     * Return all approved activities for residents.
     */
public function index()
{
    $activities = Activity::with('activity_photos')
        ->orderBy('dateofactivity', 'desc')
        ->get()
        ->map(function ($a) {
            $a->activity_photos->transform(function ($p) {
                $p->url = asset('storage/' . $p->filename); // adjust to your path
                return $p;
            });
            return $a;
        });

    return response()->json([
        'activities' => $activities,
    ]);
}

}
