<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Resident;
use App\Models\Zone;

class Household extends Model
{
    use HasFactory;

    protected $table = 'household';

    protected $fillable = [
        'household_no',
        'zone_id',
        'household_member',
        'head_of_family',
    ];

    public function headOfFamily()
    {
        return $this->belongsTo(Resident::class, 'head_of_family');
    }

    /**
     * Zone (through head of family)
     */
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
