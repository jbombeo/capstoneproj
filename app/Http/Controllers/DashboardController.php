<?php

namespace App\Http\Controllers;


use App\Models\Resident;
use App\Models\Zone;
use App\Models\User;
use App\Models\Blotter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Total residents
        $totalResidents = DB::table('resident')->count();

        // Residents by gender
        $genderCounts = DB::table('resident')
            ->select('gender', DB::raw('COUNT(*) as count'))
            ->groupBy('gender')
            ->pluck('count', 'gender'); // ['Male' => 400, 'Female' => 600]

        // Population by zone
        $zones = DB::table('resident as r')
            ->join('zone as z', 'r.zone_id', '=', 'z.id')
            ->select('z.zone as name', DB::raw('COUNT(r.id) as value'))
            ->groupBy('z.id', 'z.zone')
            ->get();

        return Inertia::render('dashboard', [
            'totalResidents' => $totalResidents,
            'genderCounts'   => $genderCounts,
            'zoneData'       => $zones,
        ]);
    }
}