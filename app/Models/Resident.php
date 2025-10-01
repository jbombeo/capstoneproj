<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Zone;

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
        'civil_status',
        'occupation',
        'household_no',
        'religion',
        'nationality',
        'gender',
        'skills',
        'remarks',
        'image',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'monthly_income' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name
            . ($this->middle_name ? ' '.$this->middle_name : '')
            . ' '.$this->last_name;
    }
}
