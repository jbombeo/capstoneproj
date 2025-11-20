<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Resident;
use App\Models\Zone;

class Zone extends Model
{
    use HasFactory;

    protected $table = 'zone';

    protected $fillable = ['zone'];

    // Zone has many residents
    public function residents()
    {
        return $this->hasMany(Resident::class, 'zone_id');
    }

    // Zone has many households
    public function households()
    {
        return $this->hasMany(Household::class, 'zone_id');
    }
}