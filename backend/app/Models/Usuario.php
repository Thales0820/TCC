<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens;
    protected $fillable = [
        'nome',
        'foto_perfil',
        'banner',
        'email',
        'senha',
        'perfil_id'

    ];

    protected $dates = ['deleted_at'];

    public function perfil()
    {
        return $this->belongsTo(perfil::class);
    }
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
}
