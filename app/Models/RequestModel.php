<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RequestModel extends Model
{
    use HasFactory;

    protected $table = 'requests';

    protected $fillable = [
        'youth_id',
        'sk_official_id',
        'category',
        'description',
        'status',
        'date_submitted',
    ];

    // Relationships
    public function youth()
    {
        return $this->belongsTo(Youth::class);
    }

    public function skOfficial()
    {
        return $this->belongsTo(SKOfficial::class);
    }
}
