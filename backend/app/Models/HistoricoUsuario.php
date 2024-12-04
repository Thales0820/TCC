<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class historicoUsuario extends Model
{
    use HasFactory;
    protected $fillable = [
        'usuario_id',
        'obra_id',
        'capitulo_id',
        'viewed_at'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function obra()
    {
        return $this->belongsTo(Obra::class);
    }

    public function Capitulo()
    {
        return $this->belongsTo(Capitulo::class);
    }
}
