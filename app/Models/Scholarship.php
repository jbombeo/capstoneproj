<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'sk_official_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'grant_amount',
    ];

    // Relationships
    public function skOfficial()
    {
        return $this->belongsTo(SKOfficial::class);
    }

    public function applications()
    {
        return $this->hasMany(ScholarshipApplication::class);
    }
}
