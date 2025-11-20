<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationHistory extends Model
{
    protected $fillable = [
        'scholarship_application_id',
        'status',
        'remarks',
        'user_id',
    ];

    public function application()
    {
        return $this->belongsTo(ScholarshipApplication::class, 'scholarship_application_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
