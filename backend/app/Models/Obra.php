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
        'data_encerramento',
        'tipo_id',
        'estado_id',
    ];
}
