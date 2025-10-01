<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use App\Models\DocumentRequest;
use App\Models\DocumentPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class BrgycertificatesController extends Controller
{
    public function index()
    {
        // Fetch only Barangay Clearance requests
        $requests = DocumentRequest::with('resident')
            ->where('document_type', 'Barangay Clearance')
            ->get();

        return Inertia::render('BarangayClearances', [
            'requests' => $requests
        ]);
    }
}
