<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DocumentPayment;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Display Barangay Revenues Report
     */
    public function revenues(Request $request)
    {
        // Optional date filters
        $minDate = $request->input('min_date');
        $maxDate = $request->input('max_date');

        $query = DocumentPayment::query()
            ->with([
                'documentRequest.documentType',
                'documentRequest.resident',
                'documentRequest.user',
            ]);

        if ($minDate) {
            $query->whereDate('paid_at', '>=', $minDate);
        }

        if ($maxDate) {
            $query->whereDate('paid_at', '<=', $maxDate);
        }

        // Fetch all filtered payments
        $payments = $query->orderBy('paid_at', 'desc')->get();

        // Transform data for frontend
        $revenues = $payments->map(function ($payment) {
            $resident = $payment->documentRequest->resident;
            $user = $payment->documentRequest->user;

            return [
                'id' => $payment->id,
                'date' => Carbon::parse($payment->paid_at)->format('Y-m-d'),
                'recipient' => "{$resident->first_name} {$resident->last_name}",
                'details' => $payment->documentRequest->documentType->name ?? 'N/A',
                'amount' => $payment->amount,
                'user' => $user->name ?? 'N/A',
            ];
        });

        return Inertia::render('report', [
            'revenues' => $revenues,
            'minDate' => $minDate,
            'maxDate' => $maxDate,
        ]);
    }
}
