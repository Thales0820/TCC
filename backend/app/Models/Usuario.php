<?php

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject, CanResetPassword
{
    use HasFactory, HasApiTokens, Notifiable, SoftDeletes;

    protected $fillable = [
        'nome',
        'foto_perfil',
        'banner',
        'email',
        'senha',
        'perfil_id'
    ];

    protected $dates = ['deleted_at'];

    // Implementando o método da interface JWTSubject
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Retorna a chave primária do usuário
    }

    // Implementando o método da interface JWTSubject
    public function getJWTCustomClaims(array $extraClaims = [])
    {
        return []; // Aqui você pode adicionar claims personalizadas, se necessário
    }

    public function perfil()
    {
        return $this->belongsTo(Perfil::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    // Mutator para garantir que a senha seja sempre hashed ao salvar
    public function setSenhaAttribute($value)
    {
        $this->attributes['senha'] = bcrypt($value);
    }

    // Accessor para permitir que o Laravel utilize 'password'
    public function getPasswordAttribute()
    {
        return $this->attributes['senha'];
    }

    public function likedObras()
    {
        return $this->belongsToMany(Obra::class, 'obra_likes', 'usuario_id', 'obra_id')->withTimestamps();
    }
}
