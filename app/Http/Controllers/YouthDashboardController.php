<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;
use App\Models\Project;
use App\Models\Youth;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\Participation;
use Illuminate\Support\Facades\Hash;

class YouthDashboardController extends Controller
{
    /* ============================
       DASHBOARD HOME
    ============================ */
    public function index(Request $request)
    {
        $user = $request->user();

        return Inertia::render('youth/home', [
            'user' => $user,
            'announcements' => Announcement::latest()->take(5)->get(),
            'projects' => Project::latest()->take(4)->get(),
            'scholarships' => Scholarship::latest()->take(5)->get(),
        ]);
    }

    /* ============================
       PROJECT LIST PAGE
    ============================ */
    public function projects(Request $request)
    {
        $youth = Youth::where('user_id', auth()->id())->first();

        $projects = Project::withCount('participants')
            ->get()
            ->map(function ($p) use ($youth) {

                $participation = Participation::where('project_id', $p->id)
                    ->where('youth_id', $youth->id)
                    ->first();

                return [
                    'id' => $p->id,
                    'title' => $p->title,
                    'description' => $p->description,
                    'start_date' => $p->start_date,
                    'end_date' => $p->end_date,
                    'location' => $p->location ?? 'Barangay Hall',
                    'participants' => $p->participants_count,
                    'status' => $p->status,
                    'attendance_status' => $participation->attendance_status ?? 'not_registered',
                ];
            });

        return Inertia::render('youth/Projects', [
            'projects' => $projects,
        ]);
    }

    /* ============================
       PROJECT REGISTRATION
    ============================ */
    public function projectRegister($id)
    {
        $youth = Youth::where('user_id', auth()->id())->first();

        Participation::firstOrCreate([
            'project_id' => $id,
            'youth_id' => $youth->id,
        ]);

        return back()->with('success', 'Registered for project.');
    }

    /* ============================
       SCHOLARSHIPS LIST PAGE
    ============================ */
public function scholarships()
{
    $youth = Youth::where('user_id', auth()->id())->first();

    $scholarships = Scholarship::all()->map(function ($s) use ($youth) {

        $application = ScholarshipApplication::where('scholarship_id', $s->id)
            ->where('youth_id', $youth->id)
            ->first();

        return [
            'id' => $s->id,
            'title' => $s->title,
            'description' => $s->description,
            'grant_amount' => $s->budget ?? 0,
            'requirements' => json_decode($s->requirements ?? '[]'),

            // ⬇ ⬇ FIX: Send status and remarks to frontend
            'application_status' => $application->status ?? null,
            'remarks'            => $application->remarks ?? null,

            // Optional if you add columns later
            'interview_date' => $application->interview_date ?? null,
            'interview_time' => $application->interview_time ?? null,
        ];
    });

    return Inertia::render('youth/Scholarships', [
        'scholarships' => $scholarships,
    ]);
}


    /* ============================
       APPLY FOR SCHOLARSHIP
    ============================ */
    public function scholarshipApply($id)
    {
        $youth = Youth::where('user_id', auth()->id())->first();

        ScholarshipApplication::firstOrCreate([
            'scholarship_id' => $id,
            'youth_id' => $youth->id,
        ]);

        return back()->with('success', 'Scholarship application submitted.');
    }

    /* ============================
       SETTINGS PAGE
    ============================ */
    public function settings()
    {
        $youth = Youth::where('user_id', auth()->id())->first();

        return Inertia::render('youth/Settings', [
            'youth' => $youth,
        ]);
    }

    /* ============================
       UPDATE PASSWORD
    ============================ */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Incorrect current password.']);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /* ============================
       APPLY ALIAS (OLD)
    ============================ */
    public function apply($id)
    {
        $youth = auth()->user()->youth;

        if (!$youth) {
            return back()->withErrors('Youth profile not found.');
        }

        if (
            ScholarshipApplication::where('scholarship_id', $id)
                ->where('youth_id', $youth->id)
                ->exists()
        ) {
            return back()->with('message', 'You already applied for this scholarship.');
        }

        ScholarshipApplication::create([
            'scholarship_id' => $id,
            'youth_id' => $youth->id,
            'status' => 'pending',
        ]);

        return back()->with('message', 'Application submitted successfully!');
    }
}
