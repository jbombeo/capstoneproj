<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Participation extends Model
{
    use HasFactory;

    protected $table = 'participation';

    protected $fillable = [
        'project_id',
        'youth_id',
        'attendance_status',
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function youth()
    {
        return $this->belongsTo(Youth::class);
    }
}
