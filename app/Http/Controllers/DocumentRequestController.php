<?php

namespace App\Http\Controllers;

use App\Models\Official;
use App\Models\Resident;
use App\Models\DocumentType;
use App\Models\DocumentRequest;
use App\Models\DocumentPayment;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB;

class DocumentRequestController extends Controller
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

    public function index()
    {
        $requests = DocumentRequest::with(['resident', 'payments', 'documentType'])
            ->latest()->get();

        $residents = Resident::orderBy('last_name')->get(['id', 'first_name', 'last_name']);
        $officials = Official::where('status', 'active')->get();
        $documentTypes = DocumentType::all();

        return Inertia::render('DocumentRequests', [
            'requests'      => $requests,
            'residents'     => $residents,
            'officials'     => $officials,
            'documentTypes' => $documentTypes,
        ]);
    }

    public function barangayClearance()
    {
        $clearances = DocumentRequest::with(['resident', 'documentType'])
            ->whereHas('documentType', fn($q) => $q->where('name', 'Barangay Clearance'))
            ->latest()->get();

        $officials = Official::where('status', 'active')->get();

        return inertia('BarangayClearance', [
            'clearances' => $clearances,
            'officials'  => $officials,
        ]);
    }

    public function certificateOfIndigency()
    {
        $certificates = DocumentRequest::with(['resident', 'documentType'])
            ->whereHas('documentType', fn($q) => $q->where('name', 'Certificate of Indigency'))
            ->latest()->get();

        $officials = Official::where('status', 'active')->get();

        return inertia('CertificateOfIndigency', [
            'requests'  => $certificates,
            'officials' => $officials,
        ]);
    }

    public function certificateOfGoodMoral()
    {
        $certificates = DocumentRequest::with(['resident', 'documentType'])
            ->whereHas('documentType', fn($q) => $q->where('name', 'Certificate of Good Moral'))
            ->latest()->get();

        $officials = Official::where('status', 'active')->get();

        return inertia('GoodMoral', [
            'docs'  => $certificates,
            'officials' => $officials,
        ]);
    }

    public function certificateOfResidency()
    {
        $certificates = DocumentRequest::with(['resident', 'documentType'])
            ->whereHas('documentType', fn($q) => $q->where('name', 'Certificate of Residency'))
            ->latest()->get();

        $officials = Official::where('status', 'active')->get();

        return inertia('Residency', [
            'requests'  => $certificates,
            'officials' => $officials,
        ]);
    }

public function store(Request $request)
{
    // -------------------
    // 1️⃣ Validate request
    // -------------------
    $request->validate([
        'resident_id'      => 'required|exists:resident,id', // ✅ plural table
        'document_type_id' => 'required|exists:document_types,id',
        'purpose'          => 'required|string|max:255',
        'payment_method'   => 'nullable|string|in:cash,gcash,free',
        'amount'           => 'nullable|numeric|min:0',
        'reference_number' => 'nullable|string|max:50',
    ]);

    // --------------------------
    // 2️⃣ Create the document request
    // --------------------------
    $doc = DocumentRequest::create([
        'user_id'          => auth()->id(), // admin creating the request
        'resident_id'      => $request->resident_id,
        'document_type_id' => $request->document_type_id,
        'purpose'          => $request->purpose,
        'status'           => 'pending',
        'request_date'     => now(),
        'qr_token'         => \Str::uuid()->toString(),
        'release_name'     => null,
    ]);

    // --------------------------
    // 3️⃣ Handle payment if provided
    // --------------------------
    if ($request->filled('payment_method') && $request->payment_method !== 'free') {
        $docType = DocumentType::find($request->document_type_id);

        $doc->payments()->create([
            'payment_method'   => $request->payment_method,
            'amount'           => $request->amount ?? ($docType?->amount ?? 0),
            'reference_number' => $request->payment_method === 'gcash' ? $request->reference_number : null,
            'or_number'        => $this->generateUniqueOrNumber(),
            'paid_at'          => now(),
        ]);
    }

    // --------------------------
    // 4️⃣ Return response with relations
    // --------------------------
    return response()->json(
        $doc->load(['resident', 'documentType', 'payments']),
        201 // HTTP Created
    );
}






    public function accept(DocumentRequest $documentRequest)
    {
        if ($documentRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be accepted.'], 400);
        }

        $documentRequest->update([
            'status' => 'on process',
            'qr_token' => $documentRequest->qr_token ?: Str::uuid()->toString(),
        ]);

        return response()->json([
            'status'  => 'on process',
            'message' => 'Request accepted and is now On Process.',
        ]);
    }

    public function markAsReady(DocumentRequest $documentRequest)
    {
        if ($documentRequest->status !== 'on process') {
            return response()->json(['message' => 'Only processing documents can be marked ready.'], 400);
        }

        $documentRequest->update(['status' => 'ready for pick-up']);
        return response()->json(['status' => 'ready for pick-up']);
    }

    public function print(DocumentRequest $documentRequest)
    {
        if ($documentRequest->status === 'on process') {
            $documentRequest->update(['status' => 'ready for pick-up']);
        }

        $qrUrl = route('documentrequests.release', $documentRequest->qr_token);
        $qrImage = base64_encode(QrCode::format('png')->size(200)->generate($qrUrl));
        $documentRequest->load(['resident', 'documentType']);

        $viewMap = [
            'Barangay Clearance'       => 'BarangayClearance',
            'Certificate of Indigency' => 'CertificateOfIndigency',
            'Certificate of Good Moral'=> 'GoodMoral',
            'Certificate of Residency' => 'Residency',
        ];

        $view = $viewMap[$documentRequest->documentType->name] ?? null;

        if (!$view) {
            return back()->with('error', 'Unknown document type.');
        }

        return Inertia::render($view, [
            'doc'     => $documentRequest,
            'qrImage' => 'data:image/png;base64,' . $qrImage,
            'print'   => true,
        ]);
    }

public function release($token)
{
    $document = DocumentRequest::where('qr_token', $token)->first();

    if (!$document) {
        return redirect()->back()->with('error', 'Invalid QR code.');
    }

    if ($document->status !== 'released') {
        $document->update(['status' => 'released']);
    }

    // Return to frontend with status
    return redirect()->back()->with('success', 'Document released!')->with('document_id', $document->id);
}



public function releaseStatus($token)
{
    $document = DocumentRequest::where('qr_token', $token)->first();

    if (!$document) {
        // Return an error view instead of JSON
        return view('documents.invalid-qr'); // create a Blade view to show an error message
    }

    // Load relations
    $document->load('resident', 'documentType');

    // Return a view with the document data
    return view('documents.release.status', [
        'document' => $document,
    ]);
}


    public function decline(DocumentRequest $documentRequest)
    {
        $documentRequest->update(['status' => 'declined']);
        return response()->json(['status' => 'declined']);
    }

    public function updateStatus(Request $request, DocumentRequest $documentRequest)
    {
        $request->validate([
            'status' => 'required|string|in:pending,on process,ready for pick-up,released,declined',
        ]);

        $documentRequest->update(['status' => $request->status]);
        return response()->json(['success' => true, 'status' => $documentRequest->status]);
    }

    public function qrcode(DocumentRequest $documentRequest)
    {
        $token = $documentRequest->qr_token ?? 'NO_TOKEN';
        $image = QrCode::format('png')->size(200)->generate(url("/documentrequests/release/{$token}"));
        return Response::make($image, 200, ['Content-Type' => 'image/png']);
    }
}
