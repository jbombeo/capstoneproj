<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\Zone;
use App\Models\User;
use App\Models\Blotter;
use App\Models\Youth;
use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // ✔ Total APPROVED residents
        $totalResidents = DB::table('resident')
            ->where('status', 'approved')
            ->count();

        // ✔ Residents by gender (APPROVED only)
        $genderCounts = DB::table('resident')
            ->where('status', 'approved')
            ->select('gender', DB::raw('COUNT(*) as count'))
            ->groupBy('gender')
            ->pluck('count', 'gender');

        // ✔ Population by zone (APPROVED only)
        $zones = DB::table('resident as r')
            ->join('zone as z', 'r.zone_id', '=', 'z.id')
            ->where('r.status', 'approved')
            ->select('z.zone as name', DB::raw('COUNT(r.id) as value'))
            ->groupBy('z.id', 'z.zone')
            ->get();

        // ✔ Youth members (Age 15–30) from APPROVED residents only
        $youthCount = DB::table('resident')
            ->where('status', 'approved')
            ->whereBetween('age', [15, 30])
            ->count();

        // ✔ Youth from SK Registration (approved only)
        $approvedYouthByGender = Youth::where('status', 'approved')
            ->select('gender', DB::raw('COUNT(*) as count'))
            ->groupBy('gender')
            ->get();

        // 🟩 NEW: Total Youth Scholars Granted
        $totalGrantedScholars = ScholarshipApplication::where('status', 'granted')->count();

        // 🟩 NEW: Senior Citizens (Approved Residents age 60+)
        $seniorCitizenCount = DB::table('resident')
            ->where('status', 'approved')
            ->where('age', '>=', 60)
            ->count();

        return Inertia::render('dashboard', [
            'totalResidents'        => $totalResidents,
            'genderCounts'          => $genderCounts,
            'zoneData'              => $zones,
            'youthCount'            => $youthCount,
            'approvedYouthByGender' => $approvedYouthByGender,

            // 🟩 Newly added dashboard cards
            'totalGrantedScholars'  => $totalGrantedScholars,
            'seniorCitizenCount'    => $seniorCitizenCount,
        ]);
    }
}
