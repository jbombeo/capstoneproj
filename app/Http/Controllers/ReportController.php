<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DocumentPayment;
use Carbon\Carbon;

class ReportController extends Controller
{
public function revenues(Request $request)
{
    // Read filters from frontend
    $minDate = $request->input('min_date');
    $maxDate = $request->input('max_date');

    // Sorting from frontend
    // FRONTEND sends `date`, so we convert it to actual db column `paid_at`
    $sortField = $request->input('sort', 'date');
    $direction = $request->input('direction', 'asc');

    // Map sorting keys
    $sortMap = [
        'date' => 'paid_at',
        'amount' => 'amount',
        'payment_method' => 'payment_method',
    ];

    $sort = $sortMap[$sortField] ?? 'paid_at';

    // Build query
    $query = DocumentPayment::query()
        ->with([
            'documentRequest.documentType',
            'documentRequest.resident',
        ]);

    // APPLY MIN DATE FILTER
    if ($minDate) {
        $query->whereDate('paid_at', '>=', $minDate);
    }

    // APPLY MAX DATE FILTER
    if ($maxDate) {
        $query->whereDate('paid_at', '<=', $maxDate);
    }

    // APPLY SORTING
    $query->orderBy($sort, $direction);

    // Get results
    $payments = $query->get();

    // Transform for frontend
    $revenues = $payments->map(function ($payment) {
        $resident = $payment->documentRequest->resident;

        return [
            'id' => $payment->id,
            'date' => Carbon::parse($payment->paid_at)->format('Y-m-d'),
            'recipient' => "{$resident->first_name} {$resident->last_name}",
            'details' => $payment->documentRequest->documentType->name ?? 'N/A',
            'amount' => $payment->amount,
            'payment_method' => $payment->payment_method ?? 'N/A',
        ];
    });

    return Inertia::render('report', [
        'revenues' => $revenues,
        'minDate' => $minDate,
        'maxDate' => $maxDate,
        'sort' => $sortField,
        'direction' => $direction,
    ]);
}

}
