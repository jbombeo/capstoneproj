<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class SKOfficial extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'position',
        'term_start',
        'term_end',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function scholarships()
    {
        return $this->hasMany(Scholarship::class);
    }
}
