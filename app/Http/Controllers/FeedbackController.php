<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Resident: View own feedback
     */
    public function index()
    {
        $resident = auth()->user()->resident;

        $feedbacks = Feedback::where('resident_id', $resident->id)
            ->latest()
            ->get();

        return Inertia::render('resident/feedback', [
            'feedbacks' => $feedbacks,
        ]);
    }

    /**
     * Resident: Submit feedback
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:feedback,suggestion,complaint',
            'message' => 'required|string|max:2000',
            'attachment' => 'nullable|file|max:4096',
        ]);

        $path = $request->file('attachment') 
            ? $request->file('attachment')->store('feedback', 'public') 
            : null;

        Feedback::create([
            'resident_id' => auth()->user()->resident->id,
            'type' => $request->type,
            'message' => $request->message,
            'attachment' => $path,
        ]);

        return back()->with('success', 'Feedback submitted successfully.');
    }

    /**
     * ADMIN ONLY: View ALL feedback
     */
    public function adminIndex()
    {
        $feedbacks = Feedback::with('resident')
            ->latest()
            ->get();

        return Inertia::render('feedback', [
            'feedbacks' => $feedbacks,
        ]);
    }

    /**
     * ADMIN ONLY: Update feedback status
     */
    public function updateStatus(Request $request, Feedback $feedback)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,resolved',
        ]);

        $feedback->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Feedback status updated.');
    }
}
