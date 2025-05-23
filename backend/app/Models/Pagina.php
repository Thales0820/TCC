<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pagina extends Model
{
    use HasFactory;

    protected $fillable = [
        'capitulo_id',
        'numero',
        'imagem',
    ];

    // Relacionamento com Capitulo
    public function capitulo()
    {
        return $this->belongsTo(Capitulo::class, 'capitulo_id');
    }
}
