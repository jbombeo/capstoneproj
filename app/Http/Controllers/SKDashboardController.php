<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Youth;
use App\Models\Project;
use App\Models\ScholarshipApplication;
use Inertia\Inertia;
use Carbon\Carbon;

class SKDashboardController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();

        // STATISTICS (only APPROVED youth counted)
        $stats = [
            'totalYouth'          => Youth::where('status', 'approved')->count(),
            'activeProjects'      => Project::where('status', 'ongoing')->count(),
            'pendingApplications' => ScholarshipApplication::where('status', 'pending')->count(),
            'scholarshipGrants'   => ScholarshipApplication::where('status', 'approved')->count(),
        ];

        // ANNOUNCEMENTS (Latest 5)
        $announcements = Announcement::with('creator')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'id'         => $a->id,
                'title'      => $a->title,
                'excerpt'    => substr(strip_tags($a->content), 0, 120) . '...',
                'image_path' => $a->image_path ? "/storage/{$a->image_path}" : null,
                'author'     => $a->creator?->name ?? 'SK Official',
            ]);

        // PROJECTS (Ongoing only — top 6)
        $projects = Project::where('status', 'ongoing')
            ->orderBy('start_date', 'asc')
            ->take(6)
            ->get()
            ->map(function (Project $p) {

                $start = $p->start_date ? Carbon::parse($p->start_date) : null;
                $end   = $p->end_date ? Carbon::parse($p->end_date) : null;

                // Auto progress calculation
                $progress = $this->computeProgress($start, $end);

                // Duration days
                $duration_days = ($start && $end)
                    ? $start->diffInDays($end)
                    : null;

                // Days remaining until end
                $days_remaining = null;
                if ($start && $end) {
                    $now = Carbon::now();

                    if ($now->lt($start)) {
                        $days_remaining = $now->diffInDays($start);
                    } elseif ($now->between($start, $end)) {
                        $days_remaining = $now->diffInDays($end);
                    } else {
                        $days_remaining = 0; // completed
                    }
                }

                return [
                    'id'                 => $p->id,
                    'title'              => $p->title,
                    'status'             => $p->status,
                    'start_date'         => $start?->toDateString(),
                    'end_date'           => $end?->toDateString(),
                    'description'        => $p->description ?? null,
                    'budget'             => $p->budget ?? 0,
                    'progress'           => $progress,
                    'participants_count' => $p->participants()->count(),
                    'days_remaining'     => $days_remaining,
                    'duration_days'      => $duration_days,
                    'coordinator'        => $p->coordinator ?? null,
                    'image_path'         => $p->image_path ? "/storage/{$p->image_path}" : null,
                ];
            });

        return Inertia::render('sk/dashboard', [
            'user'         => $user,
            'stats'        => $stats,
            'announcements'=> $announcements,
            'projects'     => $projects,
        ]);
    }


    private function computeProgress(?Carbon $start, ?Carbon $end): int
    {
        if (!$start || !$end) return 0;

        $now = Carbon::now()->timestamp;
        $s   = $start->timestamp;
        $e   = $end->timestamp;

        if ($now < $s) return 0;
        if ($now >= $e) return 100;

        return (int) round((($now - $s) / ($e - $s)) * 100);
    }
}
