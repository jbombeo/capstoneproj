<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Scholarship extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'budget',
        'open_date',
        'close_date',
        'created_by',
    ];

    protected $casts = [
        'budget' => 'decimal:2',
        'open_date' => 'date',
        'close_date' => 'date',
    ];

    protected $appends = ['image_url'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

public function applications()
{
    return $this->hasMany(\App\Models\ScholarshipApplication::class, 'scholarship_id');
}

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

public function scholarsApplication()
{
    return $this->hasMany(\App\Models\ScholarshipApplication::class, 'scholarship_id');
}

}
