<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $fillable = ['texto', 'usuario_id', 'obra_id'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function obra()
    {
        return $this->belongsTo(Obra::class);
    }
}
