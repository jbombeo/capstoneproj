<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\Zone;
use App\Models\Youth;
use App\Models\ScholarshipApplication;
use App\Models\DocumentPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Total residents
        $totalResidents = DB::table('resident')
            ->where('status', 'approved')
            ->count();

        // Gender counts
        $genderCounts = DB::table('resident')
            ->where('status', 'approved')
            ->select('gender', DB::raw('COUNT(*) as count'))
            ->groupBy('gender')
            ->pluck('count', 'gender');

        // Zone population
        $zones = DB::table('resident as r')
            ->join('zone as z', 'r.zone_id', '=', 'z.id')
            ->where('r.status', 'approved')
            ->select('z.zone as name', DB::raw('COUNT(r.id) as value'))
            ->groupBy('z.id', 'z.zone')
            ->get();

        // Youth members (15–30)
        $youthCount = DB::table('resident')
            ->where('status', 'approved')
            ->whereBetween('age', [15, 30])
            ->count();

        // Youth by gender
        $approvedYouthByGender = Youth::where('status', 'approved')
            ->select('gender', DB::raw('COUNT(*) as count'))
            ->groupBy('gender')
            ->get();

        // Scholars granted
        $totalGrantedScholars = ScholarshipApplication::where('status', 'granted')->count();

        // Seniors (60+)
        $seniorCitizenCount = DB::table('resident')
            ->where('status', 'approved')
            ->where('age', '>=', 60)
            ->count();

        // REVENUE DATA (last 30 days)
        $startDate = Carbon::now()->subDays(29)->startOfDay();
        $endDate   = Carbon::now()->endOfDay();

        $dailyRevenue = DocumentPayment::selectRaw('
                DATE(paid_at) as date,
                SUM(amount) as total,
                COUNT(id) as transactions
            ')
            ->whereBetween('paid_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($row) {
                return [
                    'date'         => $row->date,
                    'total'        => (float) $row->total,
                    'transactions' => (int) $row->transactions,
                ];
            });

        // TODAY'S REVENUE SUMMARY
        $today = Carbon::today();

        $todayRevenueRow = DocumentPayment::selectRaw('
                SUM(amount) as total,
                COUNT(id) as transactions
            ')
            ->whereDate('paid_at', $today)
            ->first();

        $todayRevenueTotal = (float) ($todayRevenueRow->total ?? 0);
        $todayRevenueTransactions = (int) ($todayRevenueRow->transactions ?? 0);

        return Inertia::render('dashboard', [
            'totalResidents'             => $totalResidents,
            'genderCounts'               => $genderCounts,
            'zoneData'                   => $zones,
            'youthCount'                 => $youthCount,
            'approvedYouthByGender'      => $approvedYouthByGender,
            'totalGrantedScholars'       => $totalGrantedScholars,
            'seniorCitizenCount'         => $seniorCitizenCount,
            'dailyRevenue'               => $dailyRevenue,
            'todayRevenueTotal'          => $todayRevenueTotal,
            'todayRevenueTransactions'   => $todayRevenueTransactions,
        ]);
    }
}
