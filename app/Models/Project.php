<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'sk_official_id',
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'budget',
        'status',
    ];

    // Relationships
    public function skOfficial()
    {
        return $this->belongsTo(SKOfficial::class);
    }

    public function participations()
    {
        return $this->hasMany(Participation::class);
    }
}
