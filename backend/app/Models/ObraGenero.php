<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObraGenero extends Model
{
    use HasFactory;

    // Defina a tabela, caso o nome não siga a convenção do Laravel
    protected $table = 'genero_obras';

    // Defina os campos que podem ser preenchidos em massa
    protected $fillable = [
        'obra_id',
        'genero_id',
    ];

    // Relacionamento com a model Obra
    public function obra()
    {
        return $this->belongsTo(Obra::class, 'obra_id');
    }

    // Relacionamento com a model Genero
    public function genero()
    {
        return $this->belongsTo(Genero::class, 'genero_id');
    }
}
