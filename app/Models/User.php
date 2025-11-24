<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function resident()
    {
        return $this->hasOne(Resident::class);
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function skOfficial()
{
    return $this->hasOne(SKOfficial::class);
}

public function youth()
{
    return $this->hasOne(Youth::class);
}

}
