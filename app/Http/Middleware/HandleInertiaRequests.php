<?php

namespace App\Http\Middleware;

use App\Models\Announcement;
use App\Models\Project;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\Participation;
use App\Models\Youth;

// Resident-side models
use App\Models\Activity;
use App\Models\Blotter;
use App\Models\DocumentRequest;
use App\Models\Feedback;
use App\Models\Official;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user     = $request->user();
        $youth    = $user ? Youth::where('user_id', $user->id)->first() : null;
        $resident = $user ? ($user->resident ?? null) : null;

        $notifications = [];

        /* ============================================================
           YOUTH NOTIFICATIONS
        ============================================================ */
        if ($user && $youth) {

            /* 1. Latest announcements (youth) */
            $announcements = Announcement::latest()
                ->take(5)
                ->get();

            foreach ($announcements as $a) {
                $notifications[] = [
                    'id'      => 'announcement-' . $a->id . '-' . $a->updated_at?->timestamp,
                    'type'    => 'Announcement',
                    'title'   => $a->title,
                    'message' => mb_strimwidth(strip_tags($a->content), 0, 80, '...'),
                    'time'    => $a->created_at->diffForHumans(),
                    'link'    => '/youth/home',
                ];
            }

            /* 2. Projects this youth joined */
            $participations = Participation::where('youth_id', $youth->id)
                ->where('attendance_status', 'registered')
                ->latest()
                ->take(5)
                ->get();

            foreach ($participations as $p) {
                $project = Project::find($p->project_id);

                if (! $project) {
                    continue;
                }

                // start_date may be a string or Carbon – handle both
                $time = null;
                if (! empty($project->start_date)) {
                    if (is_string($project->start_date)) {
                        $time = date('M d, Y', strtotime($project->start_date));
                    } else {
                        $time = $project->start_date->format('M d, Y');
                    }
                } else {
                    $time = $project->created_at?->diffForHumans();
                }

                $notifications[] = [
                    'id'      => 'project-' . $project->id . '-' . $p->updated_at?->timestamp,
                    'type'    => 'Project',
                    'title'   => 'Registered Project: ' . $project->title,
                    'message' => $project->description,
                    'time'    => $time,
                    'link'    => '/youth/projects',
                ];
            }

            /* 3. Scholarship applications */
            $applications = ScholarshipApplication::where('youth_id', $youth->id)
                ->latest()
                ->take(5)
                ->get();

            foreach ($applications as $app) {
                $scholarship = Scholarship::find($app->scholarship_id);

                $notifications[] = [
                    'id'      => 'scholarship-' . $app->id . '-' . $app->updated_at?->timestamp,
                    'type'    => 'Scholarship',
                    'title'   => 'Scholarship: ' . ($scholarship->title ?? 'N/A'),
                    'message' => 'Application status: ' . $app->status,
                    'time'    => $app->updated_at->diffForHumans(),
                    'link'    => '/youth/scholarships',
                ];
            }
        }

        /* ============================================================
           RESIDENT NOTIFICATIONS
        ============================================================ */
        if ($user) {

            // 1. Latest / upcoming activities (general for residents)
            $activities = Activity::orderBy('dateofactivity', 'desc')
                ->take(5)
                ->get();

            foreach ($activities as $a) {
                $notifications[] = [
                    'id'      => 'activity-' . $a->id . '-' . ($a->updated_at?->timestamp ?? $a->created_at?->timestamp),
                    'type'    => 'Activity',
                    'title'   => $a->activity,
                    'message' => mb_strimwidth(strip_tags($a->description ?? ''), 0, 80, '...'),
                    // dateofactivity may be string, just display as is if set
                    'time'    => $a->dateofactivity ?? $a->created_at?->diffForHumans(),
                    'link'    => '/resident/home',
                ];
            }

            // 2. Blotters where this user is complainant
            $blotters = Blotter::where('complainant', $user->name)
                ->latest()
                ->take(5)
                ->get();

            foreach ($blotters as $b) {
                $notifications[] = [
                    'id'      => 'blotter-' . $b->id . '-' . ($b->updated_at?->timestamp ?? $b->created_at?->timestamp),
                    'type'    => 'Blotter',
                    'title'   => 'Blotter Case #' . $b->id,
                    'message' => 'Status: ' . ($b->status ?? 'N/A'),
                    'time'    => $b->created_at?->diffForHumans(),
                    'link'    => '/resident/blotters',
                ];
            }

            // 3. Document requests of this user
            $documentRequests = DocumentRequest::with('documentType')
                ->where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get();

            foreach ($documentRequests as $dr) {
                $docTypeName = $dr->documentType->name ?? 'Document';

                // request_date may be a string
                $time = null;
                if (! empty($dr->request_date)) {
                    $time = date('M d, Y', strtotime($dr->request_date));
                } else {
                    $time = $dr->created_at?->diffForHumans();
                }

                $notifications[] = [
                    'id'      => 'document-' . $dr->id . '-' . ($dr->updated_at?->timestamp ?? $dr->created_at?->timestamp),
                    'type'    => 'Document Request',
                    'title'   => $docTypeName,
                    'message' => 'Request status: ' . ($dr->status ?? 'pending'),
                    'time'    => $time,
                    'link'    => '/resident/document-requests',
                ];
            }

            // 4. Feedback of this resident (if resident profile exists)
            if ($resident) {
                $feedbacks = Feedback::where('resident_id', $resident->id)
                    ->latest()
                    ->take(5)
                    ->get();

                foreach ($feedbacks as $f) {
                    $notifications[] = [
                        'id'      => 'feedback-' . $f->id . '-' . ($f->updated_at?->timestamp ?? $f->created_at?->timestamp),
                        'type'    => 'Feedback',
                        'title'   => ucfirst($f->type ?? 'Feedback'),
                        'message' => 'Status: ' . ($f->status ?? 'pending'),
                        'time'    => $f->created_at?->diffForHumans(),
                        'link'    => '/resident/feedback',
                    ];
                }
            }

            // 5. Officials (new/updated officials)
            $officials = Official::latest()
                ->take(3)
                ->get();

            foreach ($officials as $o) {
                $notifications[] = [
                    'id'      => 'official-' . $o->id . '-' . ($o->updated_at?->timestamp ?? $o->created_at?->timestamp),
                    'type'    => 'Official',
                    'title'   => $o->position . ': ' . $o->name,
                    'message' => 'Barangay official information updated.',
                    'time'    => $o->updated_at?->diffForHumans() ?? $o->created_at?->diffForHumans(),
                    'link'    => '/resident/officials',
                ];
            }
        }

        return [
            ...parent::share($request),

            'name' => config('app.name'),

            'quote' => [
                'message' => trim($message),
                'author'  => trim($author),
            ],

            'auth' => [
                'user' => $user,
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',

            // 🔔 Notification bell props
            'notifications'       => $notifications,
            'notifications_count' => count($notifications),
        ];
    }
}
