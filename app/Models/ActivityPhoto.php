<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityPhoto extends Model
{
    use HasFactory;

    protected $table = 'activity_photos';

    protected $fillable = [
        'activity_id',
        'filename',
    ];

    // Include "url" in JSON/inertia output automatically
    protected $appends = ['url'];

    public function activity()
    {
        return $this->belongsTo(Activity::class, 'activity_id');
    }

    // ✅ Automatically create the public URL for the photo
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->filename);
    }
}
