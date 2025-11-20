<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'budget',
        'start_date',
        'end_date',
        'image_path',
        'created_by',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
{
    return $this->hasMany(\App\Models\Participation::class);
}
}
