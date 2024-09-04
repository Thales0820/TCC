<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genero extends Model
{
    use HasFactory;
    protected $fillable = [
        'nome'
    ];
    public function obra()
    {
        return $this->belongsToMany(Obra::class, 'obra_genero');
    }
}
