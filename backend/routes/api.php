<?php

use App\Http\Controllers\Api\v1\CapituloController;
use App\Http\Controllers\Api\v1\EstadoController;
use App\Http\Controllers\Api\v1\ObraController;
use App\Http\Controllers\Api\v1\PaginaController;
use App\Http\Controllers\Api\v1\PerfilController;
use App\Http\Controllers\Api\v1\TipoController;
use App\Http\Controllers\Api\v1\UsuarioController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\LeituraController;

use Illuminate\Support\Facades\Route;

 Route::group(['prefix' => 'v1'], function() {
    Route::apiResource('usuario', UsuarioController::class);
    Route::apiResource('tipo',TipoController::class);
    Route::apiResource('capitulo', CapituloController::class);
    Route::apiResource('leitura', LeituraController::class);
    Route::apiResource('pagina', PaginaController::class);
    Route::apiResource('perfil', PerfilController::class);
    Route::apiResource('estado', EstadoController::class);
    Route::apiResource('comentario', ComentarioController::class);
    Route::apiResource('obra', ObraController::class);

    Route::post('usuario/login',[ UsuarioController::class, 'login']);
 });
