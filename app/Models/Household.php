<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    use HasFactory;

    protected $table = 'household';

    protected $fillable = [
        'household_no',
        'zone_id',
        'head_of_family',
        'household_member',
    ];

    // Household belongs to zone
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    // REQUIRED — used by controller + React
    public function headOfFamily()
    {
        return $this->belongsTo(Resident::class, 'head_of_family');
    }

    // Optional older name — can keep or remove
    public function head()
    {
        return $this->belongsTo(Resident::class, 'head_of_family');
    }

    // All residents with this household_no
    public function residents()
    {
        return $this->hasMany(Resident::class, 'household_no', 'household_no');
    }
}
