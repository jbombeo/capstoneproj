<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    public function index()
    {
        return Inertia::render('SK/Requests', [
            'requests' => ServiceRequest::with(['youth', 'skOfficial'])
                ->latest()
                ->paginate(20),
        ]);
    }

    public function show(ServiceRequest $requestModel)
    {
        return Inertia::render('sk/requests/Show', [
            'request' => $requestModel->load(['youth', 'skOfficial']),
        ]);
    }

    public function updateStatus(Request $request, ServiceRequest $requestModel)
    {
        $data = $request->validate([
            'status'  => 'required|in:pending,in_progress,resolved,rejected',
            'remarks' => 'nullable|string|max:500',
        ]);

        $requestModel->update([
            'status'         => $data['status'],
            'remarks'        => $data['remarks'] ?? null,
            'sk_official_id' => auth()->user()->skOfficial->id,
        ]);

        return back()->with('success', "Request updated successfully.");
    }

    public function destroy(ServiceRequest $requestModel)
    {
        $requestModel->delete();

        return back()->with('success', 'Request deleted.');
    }
}
