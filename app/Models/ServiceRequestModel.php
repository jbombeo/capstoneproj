<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServiceRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'youth_id',
        'type',
        'details',
        'status',
        'remarks',
    ];

    public function youth()
    {
        return $this->belongsTo(Youth::class);
    }
}
