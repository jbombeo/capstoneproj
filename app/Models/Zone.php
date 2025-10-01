<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Resident;
use App\Models\Zone;

class Zone extends Model
{
    use HasFactory;

    // Explicit table name
    protected $table = 'zone';

    // Mass assignable fields
    protected $fillable = [
        'zone',
        'username',
        'password', // only if necessary
    ];

    /**
     * Relationship: A zone has many residents
     */
    public function residents()
    {
        return $this->hasMany(Resident::class, 'zone_id');
    }

    public function households()
    {
        return $this->hasMany(Household::class, 'zone_id');
    }
    
}
