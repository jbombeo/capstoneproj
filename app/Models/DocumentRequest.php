<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentRequest extends Model
{
    use HasFactory;

    // Include status so it can be mass-assigned
    protected $fillable = [
        'resident_id',
        'document_type',
        'purpose',
        'request_date',
        'status',           // ✅ new column
        'qr_token',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }   

public function payments()
{
    return $this->hasMany(DocumentPayment::class, 'document_request_id', 'id');
}
}
