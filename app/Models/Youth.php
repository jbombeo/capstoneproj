<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Youth extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'youth';

    protected $fillable = [
        'user_id',
        'email',
        'last_name',
        'first_name',
        'middle_name',
        'birth_date',
        'birth_place',
        'age',
        'gender',
        'contact_number',
        'skills',
        'image',
        'status',
    ];

    protected $casts = [
        'skills' => 'array',
        'birth_date' => 'date',
    ];

    /** Relationships **/

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scholarshipApplications()
    {
        return $this->hasMany(ScholarshipApplication::class);
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class);
    }

    public function applications()
{
    return $this->hasMany(ScholarshipApplication::class);
}
}
