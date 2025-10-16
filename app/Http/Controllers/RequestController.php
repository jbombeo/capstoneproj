<?php

namespace App\Http\Controllers;

use App\Models\RequestModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function index()
    {
        $requests = RequestModel::with('youth.user', 'skOfficial.user')->latest()->get();
        return Inertia::render('Requests/Index', compact('requests'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'youth_id' => 'required|exists:youth,id',
            'category' => 'required|in:complaint,suggestion,request',
            'description' => 'required|string',
        ]);

        RequestModel::create([
            'youth_id' => $request->youth_id,
            'category' => $request->category,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Request submitted.');
    }

    public function updateStatus(Request $request, RequestModel $requestModel)
    {
        $request->validate([
            'status' => 'required|in:pending,in_progress,resolved,rejected',
        ]);

        $requestModel->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Request status updated.');
    }

    public function destroy(RequestModel $requestModel)
    {
        $requestModel->delete();
        return back()->with('success', 'Request deleted.');
    }
}
