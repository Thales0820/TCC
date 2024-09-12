<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;
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
