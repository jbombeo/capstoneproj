<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ScholarshipApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'scholarship_id',
        'youth_id',
        'status',
        'remarks',
    ];

    // Relationships
    public function scholarship()
    {
        return $this->belongsTo(Scholarship::class);
    }

    public function youth()
    {
        return $this->belongsTo(Youth::class);
    }
}
