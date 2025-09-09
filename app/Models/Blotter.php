<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blotter extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'blotters';

    protected $fillable = [
        // Complainant
        'complainant',
        'complainant_address',
        'complainant_age',
        'complainant_contact',

        // Complainee
        'complainee',
        'complainee_address',
        'complainee_age',
        'complainee_contact',

        // Complaint details
        'complaint',
        'status',
        'action',
        'incidence',

        // Dates
        'incident_datetime',
        'year_recorded',

        // Barangay handling
        'handled_by',
    ];

    protected $casts = [
        'incident_datetime' => 'datetime',
        'year_recorded' => 'integer',
    ];
}
