<?php

namespace App\Http\Controllers\SK;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function index()
    {
        return Inertia::render('SK/Requests/Index', [
            'requests' => ServiceRequest::with('user')->latest()->get()
        ]);
    }

    public function show(ServiceRequest $request)
    {
        return Inertia::render('SK/Requests/Show', [
            'requestItem' => $request->load('user')
        ]);
    }

    public function updateStatus(Request $req, ServiceRequest $request)
    {
        $validated = $req->validate([
            'status'  => 'required|in:pending,in_progress,resolved,rejected',
            'remarks' => 'nullable|string'
        ]);

        $validated['processed_by'] = Auth::id();

        $request->update($validated);

        return back()->with('success', 'Request updated successfully.');
    }
}
