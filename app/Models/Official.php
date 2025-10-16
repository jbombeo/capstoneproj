<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Official extends Model
{
    use HasFactory;

    protected $table = 'official';

    protected $fillable = [
        'position',
        'complete_name',
        'contact',
        'address',
        'term_start',
        'term_end',
        'image',
        'status',
        'users_id',
    ];

    /**
     * Relationship: An official belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }

    /**
     * Always apply position ordering globally
     */
    protected static function booted()
    {
        static::addGlobalScope('position_order', function ($query) {
            $query->orderByRaw("
                CASE
                    WHEN position = 'Punong Barangay' THEN 1
                    WHEN position = 'Barangay Kagawad' THEN 2
                    WHEN position = 'SK Chairman' THEN 3
                    WHEN position = 'Secretary' THEN 4
                    ELSE 5
                END
            ");
        });
    }
}
