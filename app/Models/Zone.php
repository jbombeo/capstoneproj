<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $table = 'zone'; // explicitly mention table name
    protected $fillable = ['zone', 'username', 'password'];
}
