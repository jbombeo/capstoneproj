<?php

namespace App\Http\Controllers;

use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;

class ScholarshipApplicationController extends Controller
{
    /**
     * SK OFFICIAL — View all scholarship applications
     */
    public function index()
    {
        $applications = ScholarshipApplication::with([
            'scholarship',
            'youth'
        ])
        ->latest()
        ->get()
        ->map(function ($a) {
            return [
                'id'       => $a->id,
                'status'   => $a->status,
                'remarks'  => $a->remarks,
                'created_at' => $a->created_at?->toDateString(),

                // 🔵 Include schedule for youth card
                'interview_date' => $a->interview_date,
                'interview_time' => $a->interview_time,

                'scholarship' => [
                    'id'          => $a->scholarship->id,
                    'title'       => $a->scholarship->title,
                    'description' => $a->scholarship->description,
                    'requirements'=> json_decode($a->scholarship->requirements, true) ?? [],
                ],

                'youth' => [
                    'id'            => $a->youth->id,
                    'first_name'    => $a->youth->first_name,
                    'last_name'     => $a->youth->last_name,
                    'middle_name'   => $a->youth->middle_name,
                    'email'         => $a->youth->email,
                    'contact_number'=> $a->youth->contact_number,
                    'age'           => $a->youth->age,
                    'birth_date'    => $a->youth->birth_date,
                    'birth_place'   => $a->youth->birth_place,
                    'status'        => $a->youth->status,
                    'skills'        => $a->youth->skills ?? [],
                    'image'         => $a->youth->image 
                        ? "/storage/" . $a->youth->image 
                        : null,
                ],
            ];
        });

        return inertia('sk/scholarshipapplications', [
            'applications' => $applications,
        ]);
    }

    /**
     * SK OFFICIAL — Update the status + schedule
     */
public function updateStatus(Request $request, ScholarshipApplication $application)
{
    $request->validate([
        'status'          => 'required|string|in:pending,for interview,for requirement,granted',
        'remarks'         => 'nullable|string',
        'interview_date'  => 'nullable|date',
        'interview_time'  => 'nullable',
    ]);

    // If FOR INTERVIEW → save date & time
    if ($request->status === 'for interview') {
        $application->interview_date = $request->interview_date;
        $application->interview_time = $request->interview_time;
    } else {
        // Reset schedule if changed to another status
        $application->interview_date = null;
        $application->interview_time = null;
    }

    // Update status + remarks
    $application->status  = $request->status;
    $application->remarks = $request->remarks;

    $application->save();

    return back()->with('success', 'Application updated successfully.');
}

    /**
     * Delete Scholarship Application
     */
    public function destroy(ScholarshipApplication $application)
    {
        $application->delete();

        return back()->with('success', 'Application deleted.');
    }
}
