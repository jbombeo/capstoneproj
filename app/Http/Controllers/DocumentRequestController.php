<?php

namespace App\Http\Controllers;

use App\Models\Official;
use App\Models\Resident;
use App\Models\DocumentRequest;
use App\Models\DocumentPayment;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class DocumentRequestController extends Controller
{
    /**
     * Admin list of all document requests
     */
public function index()
{
    $requests = DocumentRequest::with(['resident', 'payments'])
        ->latest()
        ->get();

    $residents = Resident::orderBy('last_name')
        ->get(['id', 'first_name', 'last_name']);

    // Ordering is now handled in Official model
    $officials = Official::where('status', 'active')->get();

    return Inertia::render('DocumentRequests', [
        'requests'  => $requests,
        'residents' => $residents,
        'officials' => $officials,
    ]);
}

    /**
     * Barangay Clearance list page
     */
public function barangayClearance()
{
    $clearances = DocumentRequest::with('resident')
        ->where('document_type', 'Barangay Clearance')
        ->orderByDesc('created_at')
        ->get();

    // Again, ordering handled in Official model
    $officials = Official::where('status', 'active')->get();

    return inertia('BarangayClearance', [
        'clearances' => $clearances,
        'officials'  => $officials,
    ]);
}

    /**
     * Certificate of Indigenous list page
     */
public function certificateOfIndigenous()
{
    $certificates = DocumentRequest::with('resident')
        ->where('document_type', 'Certificate of Indigenous')
        ->orderByDesc('created_at')
        ->get();

    return inertia('CertificateOfIndigenous', [
        'certificates' => $certificates,
    ]);
}
    /**
     * Resident submits new request
     */
public function store(Request $request)
{
    $request->validate([
        'resident_id'   => 'required|exists:resident,id',
        'document_type' => 'required|string|max:50',
        'purpose'       => 'required|string',
        'payment_method'=> 'nullable|string',
        'amount'        => 'nullable|numeric',
    ]);

    // Create the document request
    $doc = DocumentRequest::create([
        'resident_id'   => $request->resident_id,
        'document_type' => $request->document_type,
        'purpose'       => $request->purpose,
        'status'        => 'pending',
        'qr_token'      => Str::uuid()->toString(), // create QR token immediately
    ]);

    // Optional payment record
    if ($request->filled('payment_method') && $request->filled('amount')) {
        $doc->payments()->create([
            'payment_method' => $request->payment_method,
            'amount'         => $request->amount,
            'or_number'      => 'OR-' . rand(1000, 9999),
        ]);
    }

    // Load relationships so frontend can immediately display them
    $doc->load(['resident', 'payments']);

    // Return JSON for Axios (no redirect needed)
    return response()->json($doc);
}




    /**
     * Admin accepts a request
     */
public function accept(DocumentRequest $documentRequest)
{
    // change status to 'on process'
    $documentRequest->status = 'on process';

    // assign QR token if not yet assigned
    if (!$documentRequest->qr_token) {
        $documentRequest->qr_token = Str::uuid()->toString();
    }

    $documentRequest->save();

    return back()->with('success', 'Request accepted.');
}

    /**
     * Show the print layout page with QR code
     */
    public function print(DocumentRequest $documentRequest)
    {
        $qrUrl = route('documentrequests.release', $documentRequest->qr_token);

        $qrImage = base64_encode(
            QrCode::format('png')->size(200)->generate($qrUrl)
        );

        if ($documentRequest->document_type === 'Barangay Clearance') {
            return Inertia::render('BarangayClearance', [
                'doc'     => $documentRequest->load('resident'),
                'qrImage' => 'data:image/png;base64,' . $qrImage,
                'print'   => true,
            ]);
        }

        if ($documentRequest->document_type === 'Certificate of Indigenous') {
            return Inertia::render('CertificateOfIndigenous', [
                'doc'     => $documentRequest->load('resident'),
                'qrImage' => 'data:image/png;base64,' . $qrImage,
                'print'   => true,
            ]);
        }

        return back();
    }
    /**
     * Release by QR
     */
    public function releaseByQr($qr_token)
    {
        $documentRequest = DocumentRequest::where('qr_token', $qr_token)->firstOrFail();
        $documentRequest->update(['status' => 'released']);

        return response()->json(['status' => 'released']);
    }

    /**
     * Decline a request
     */
    public function decline(DocumentRequest $documentRequest)
    {
        $documentRequest->update(['status' => 'declined']);
        return back()->with('success', 'Document request declined.');
    }

    /**
     * Dynamic status update
     */
    public function updateStatus(Request $request, DocumentRequest $documentRequest)
    {
        $request->validate([
            'status' => 'required|string|in:pending,on process,ready for pick-up,released,declined',
        ]);

        $documentRequest->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'status'  => $documentRequest->status,
        ]);
    }

    public function qrcode($id)
    {
        // Fetch the document request
        $request = DocumentRequest::findOrFail($id);

        // The URL or data you want to encode in the QR code
        $url = route('documentrequests.show', $request->id);

        // Generate QR code in PNG format
        $qrImage = QrCode::format('png')->size(300)->generate($url);

        // Return the QR code as an image response
        return response($qrImage)->header('Content-Type', 'image/png');
    }


}
