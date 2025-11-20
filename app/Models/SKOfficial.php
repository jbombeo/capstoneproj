<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SKOfficial extends Model
{
    protected $table = 'sk_officials';

    protected $fillable = [
        'users_id',
        'position',
        'complete_name',
        'contact',
        'address',
        'term_start',
        'term_end',
        'status',
        'image',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

        public function user()
    {
        return $this->belongsTo(User::class, 'users_id');
    }
}

