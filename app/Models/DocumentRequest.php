<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'resident_id',
        'document_type_id',
        'purpose',
        'request_date',
        'status',
        'release_name',
        'qr_token',
    ];

    // A request belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A request belongs to a resident
    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    // A request belongs to a document type
    public function documentType()
    {
        return $this->belongsTo(DocumentType::class);
    }

    // A request has one payment (if you only allow one)
    public function payment()
    {
        return $this->hasOne(DocumentPayment::class);
    }

    // 👉 If you expect multiple payments per request, swap to:
    public function payments()
    {
        return $this->hasMany(DocumentPayment::class);
    }
}
