<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capitulo extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'obra_id',
        'data_publicacao',
        'numero',
    ];

    // Relacionamento com Obra
    public function obra()
    {
        return $this->belongsTo(Obra::class, 'obra_id');
    }
}
