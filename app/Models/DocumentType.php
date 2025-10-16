<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    protected $fillable = [
        'name',
        'amount',
    ];

    // One document type can have many requests
    public function requests()
    {
        return $this->hasMany(DocumentRequest::class);
    }
}
