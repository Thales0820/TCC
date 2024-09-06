<?php

use App\Http\Controllers\DashboardComentarioController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardEstadoController;
use App\Http\Controllers\DashboardGeneroController;
use App\Http\Controllers\DashboardLeituraController;
use App\Http\Controllers\DashboardObraController;
use App\Http\Controllers\DashboardPerfilController;
use App\Http\Controllers\DashboardTipoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
Route::delete('/dashboard/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');

Route::get('/obras', [DashboardObraController::class, 'index'])->name('dashboardObra.index');
Route::delete('/obras/{id}', [DashboardObraController::class, 'destroy'])->name('dashboardObra.destroy');

Route::get('/tipos', [DashboardTipoController::class, 'index'])->name('dashboardTipo.index');
Route::delete('/tipos/{id}', [DashboardTipoController::class, 'destroy'])->name('dashboardTipo.destroy');

Route::get('/generos', [DashboardGeneroController::class, 'index'])->name('dashboardGenero.index');
Route::delete('/generos/{id}', [DashboardGeneroController::class, 'destroy'])->name('dashboardGenero.destroy');

Route::get('/estados',[DashboardEstadoController::class, 'index'])->name('dashboardEstado.index');
Route::delete('/estados/{id}', [DashboardEstadoController::class, 'destroy'])->name('dashboardEstado.destroy');

Route::get('/leituras',[DashboardLeituraController::class, 'index'])->name('dashboardLeitura.index');
Route::delete('/leituras/{id}', [DashboardLeituraController::class, 'destroy'])->name('dashboardLeitura.destroy');

Route::get('/perfils',[DashboardPerfilController::class, 'index'])->name('dashboardPerfil.index');
Route::delete('/perfils/{id}', [DashboardPerfilController::class, 'destroy'])->name('dashboardPerfil.destroy');

Route::get('/comentarios',[DashboardComentarioController::class, 'index'])->name('dashboardComentario.index');
Route::delete('/comentarios/{id}', [DashboardComentarioController::class, 'destroy'])->name('dashboardComentario.destroy');
