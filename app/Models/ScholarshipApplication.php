<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScholarshipApplication extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'scholarship_id',
        'youth_id',
        'status',
        'remarks',
    ];

    public function scholarship()
    {
        return $this->belongsTo(\App\Models\Scholarship::class, 'scholarship_id');
    }

    public function youth()
    {
        return $this->belongsTo(Youth::class);
    }
    public function histories()
{
    return $this->hasMany(ApplicationHistory::class, 'scholarship_application_id')
                ->latest();
}
}
