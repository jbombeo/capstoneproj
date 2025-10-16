<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $table = 'activity';

    protected $fillable = [
        'dateofactivity',
        'activity',
        'description',
    ];


    public function activity_photos()
    {
        return $this->hasMany(ActivityPhoto::class, 'activity_id');
    }
}
