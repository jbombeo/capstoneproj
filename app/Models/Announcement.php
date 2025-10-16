<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'sk_official_id',
        'title',
        'content',
        'image_path', 
        'date_posted',
    ];

    // Relationships
    public function skOfficial()
    {
        return $this->belongsTo(SKOfficial::class);
    }
}
