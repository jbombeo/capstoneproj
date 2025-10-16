<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentRequest;
use App\Models\DocumentPayment;
use App\Models\DocumentType;
use App\Models\Resident;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;


class DocumentRequestResidentController extends Controller
{

    protected function generateUniqueOrNumber(): string
{
    // Get the last OR number
    $lastPayment = DocumentPayment::latest('id')->first();
    $lastOrNum = $lastPayment ? intval(str_replace('OR-', '', $lastPayment->or_number)) : 1000;

    // Increment for new OR number
    $newOr = 'OR-' . str_pad($lastOrNum + 1, 5, '0', STR_PAD_LEFT);

    // Ensure uniqueness just in case
    while (DocumentPayment::where('or_number', $newOr)->exists()) {
        $lastOrNum++;
        $newOr = 'OR-' . str_pad($lastOrNum + 1, 5, '0', STR_PAD_LEFT);
    }

    return $newOr;
}
    /**
     * Show all requests of the logged-in resident
     */
    // ✅ Resident: view only their own requests
    public function index()
    {
        $requests = DocumentRequest::with(['payment', 'documentType'])
            ->where('user_id', auth()->id())
            ->get();

        $documentTypes = DocumentType::all(['id', 'name', 'amount']);

        return inertia('resident/DocumentRequestsResident', [
            'requests'      => $requests,
            'documentTypes' => $documentTypes,
        ]);
    }

public function store(Request $request)
{
    $user = auth()->user();

    if (!$user->resident) {
        return response()->json([
            'error' => 'You must complete your resident profile before making a document request.'
        ], 422);
    }

    // Validate request (lowercase in enum)
    $validated = $request->validate([
        'document_type_id' => 'required|exists:document_types,id',
        'purpose'          => 'required|string|max:255',
        'payment_method'   => 'nullable|string|in:cash,gcash,free', // lowercase
        'amount'           => 'nullable|numeric|min:0',
        'reference_number' => 'nullable|string|max:100',
    ]);

    // Create the document request
    $documentRequest = DocumentRequest::create([
        'user_id'          => $user->id,
        'resident_id'      => $user->resident->id,
        'document_type_id' => $validated['document_type_id'],
        'purpose'          => $validated['purpose'],
        'request_date'     => now(),
        'status'           => 'pending',
        'qr_token'         => Str::random(40),
    ]);

    // Attach payment if provided
    if (!empty($validated['payment_method']) && $validated['payment_method'] !== 'free') {
        $amount = $validated['amount'] ?? DocumentType::find($validated['document_type_id'])->amount ?? 0;

        $documentRequest->payments()->create([
            'payment_method'   => $validated['payment_method'],
            'amount'           => $amount,
            'reference_number' => $validated['reference_number'] ?? null,
            'or_number'        => $this->generateUniqueOrNumber(),
            'paid_at'          => now(),
        ]);
    }

    return response()->json([
        'message' => 'Document request submitted successfully.',
        'data'    => $documentRequest->load('payments'),
    ], 201);
}






    /**
     * Show single request
     */
    public function show($id)
    {
        $request = DocumentRequest::with(['documentType', 'payments'])
            ->where('resident_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('resident/DocumentRequestShow', [
            'request' => $request,
        ]);
    }

}
