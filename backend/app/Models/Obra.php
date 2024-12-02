<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Obra extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'capa',
        'sinopse',
        'autor_id',
        'likes',
        'data_publicacao',
        'tipo_id',
        'estado_id',
    ];

    public function tipo()
    {
        return $this->belongsTo(Tipo::class, 'tipo_id');
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    public function generos()
    {
        return $this->belongsToMany(Genero::class, 'genero_obras');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'autor_id');
    }

    public function likes()
    {
        return $this->belongsToMany(Usuario::class, 'obra_likes', 'obra_id', 'usuario_id')->withTimestamps();
    }
}
