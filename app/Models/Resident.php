<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Zone;
use App\Models\Household;

class Resident extends Model
{
    use HasFactory;

    protected $table = 'resident';

    protected $fillable = [
        'user_id',
        'email',
        'last_name',
        'first_name',
        'middle_name',
        'birth_date',
        'birth_place',
        'age',
        'zone_id',
        'total_household',
        'relationto_head_of_family',
        'family_head_id',
        'household_no',
        'civil_status',
        'occupation',
        'religion',
        'nationality',
        'gender',
        'skills',
        'remarks',
        'image',
        'status',
    ];

    // A resident belongs to a zone
    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }

    // A resident belongs to a user account (after approval)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Resident belongs to a family head (SELF RELATIONSHIP)
    public function familyHead()
    {
        return $this->belongsTo(Resident::class, 'family_head_id');
    }

    // Head has many members
    public function familyMembers()
    {
        return $this->hasMany(Resident::class, 'family_head_id');
    }

    // Resident belongs to a household
    public function household()
    {
        return $this->belongsTo(Household::class, 'household_no', 'household_no');
    }
}
