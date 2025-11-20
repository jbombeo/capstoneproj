<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\Youth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function apply(Request $request, Scholarship $scholarship)
    {
        $youth = Youth::firstOrCreate(['user_id' => Auth::id()]);

        ScholarshipApplication::firstOrCreate([
            'scholarship_id' => $scholarship->id,
            'youth_id' => $youth->id
        ], [
            'status' => 'pending',
            'remarks' => $request->remarks
        ]);

        return back()->with('success', 'Scholarship application submitted.');
    }
}
