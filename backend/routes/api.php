<?php

use App\Http\Controllers\Api\v1\CapituloController;
use App\Http\Controllers\Api\v1\EstadoController;
use App\Http\Controllers\Api\v1\ObraController;
use App\Http\Controllers\Api\v1\PaginaController;
use App\Http\Controllers\Api\v1\PerfilController;
use App\Http\Controllers\Api\v1\TipoController;
use App\Http\Controllers\Api\v1\UsuarioController;
use App\Http\Controllers\Api\v1\ComentarioController;
use App\Http\Controllers\Api\v1\GeneroController;
use App\Http\Controllers\Api\v1\historicoUsuarioController;
use App\Http\Controllers\Api\v1\LeituraController;
use App\Http\Controllers\Api\v1\ListaController;
use App\Http\Controllers\Api\V1\ObraGeneroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['prefix' => 'v1'], function () {
    Route::apiResource('usuarios', UsuarioController::class);
    Route::apiResource('tipos', TipoController::class);
    Route::apiResource('capitulos', CapituloController::class);
    Route::apiResource('leituras', LeituraController::class);
    Route::apiResource('paginas', PaginaController::class);
    Route::apiResource('perfils', PerfilController::class);
    Route::apiResource('estados', EstadoController::class);
    Route::apiResource('comentarios', ComentarioController::class);
    Route::apiResource('obras', ObraController::class);
    Route::apiResource('generos', GeneroController::class);
    Route::apiResource('historico', historicoUsuarioController::class);
    Route::apiResource('obragenero', ObraGeneroController::class);
    Route::apiResource('obraslancadas', ObraController::class);
    Route::apiResource('listas', ListaController::class)->only(['index', 'store', 'destroy']);

    Route::put('/listas/{id}', [ListaController::class, 'update']);
    Route::get('/obras/{id}', [ObraController::class, 'show']);
    Route::get('paginas/{id}',[PaginaController::class, 'show']);
    Route::post('usuario/login', [UsuarioController::class, 'login']);
    Route::post('/obras/{id}/like', [ObraController::class, 'like']);
    Route::get('/obras/{id}/like-status', [ObraController::class, 'getLikeStatus']);

});

Route::get('/', function () {
    dd("dddd");
});
