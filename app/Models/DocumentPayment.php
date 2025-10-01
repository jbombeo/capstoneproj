<?php

// app/Models/DocumentPayment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentPayment extends Model
{
    protected $fillable = ['document_request_id','payment_method','amount','or_number','paid_at'];

public function documentRequest()
{
    return $this->belongsTo(DocumentRequest::class, 'document_request_id', 'id');
}
}
