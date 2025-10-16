<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Youth extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'address',
        'contact_number',
        'skills',
        'interests',
        'registration_status',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function participations()
    {
        return $this->hasMany(Participation::class);
    }

    public function requests()
    {
        return $this->hasMany(RequestModel::class);
    }

    public function scholarshipApplications()
    {
        return $this->hasMany(ScholarshipApplication::class);
    }
}
