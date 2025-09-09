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
}
