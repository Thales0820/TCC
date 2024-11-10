<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lista extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'obra_id',
        'leitura_id',
    ];

    // Relacionamento com Usuário
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    // Relacionamento com Obra
    public function obra()
    {
        return $this->belongsTo(Obra::class);
    }

    // Relacionamento com Leitura (se existir uma tabela de leituras)
    public function leitura()
    {
        return $this->belongsTo(Leitura::class);
    }
}
