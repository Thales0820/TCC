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
Route::get('/tipos/create', [DashboardTipoController::class, 'create'])->name('dashboardTipo.create');
Route::post('/tipos', [DashboardTipoController::class, 'store'])->name('dashboardTipo.store');
Route::get('/tipos/{id}/edit', [DashboardTipoController::class, 'edit'])->name('dashboardTipo.edit');
Route::put('/tipos/{id}', [DashboardTipoController::class, 'update'])->name('dashboardTipo.update');
Route::delete('/tipos/{id}', [DashboardTipoController::class, 'destroy'])->name('dashboardTipo.destroy');

Route::get('/generos', [DashboardGeneroController::class, 'index'])->name('dashboardGenero.index');
Route::get('/generos/create', [DashboardGeneroController::class, 'create'])->name('dashboardGenero.create');
Route::post('/generos', [DashboardGeneroController::class, 'store'])->name('dashboardGenero.store');
Route::get('/generos/{id}/edit', [DashboardGeneroController::class, 'edit'])->name('dashboardGenero.edit');
Route::put('/generos/{id}', [DashboardGeneroController::class, 'update'])->name('dashboardGenero.update');
Route::delete('/generos/{id}', [DashboardGeneroController::class, 'destroy'])->name('dashboardGenero.destroy');

Route::get('/estados',[DashboardEstadoController::class, 'index'])->name('dashboardEstado.index');
Route::get('/estados/create', [DashboardEstadoController::class, 'create'])->name('dashboardEstado.create');
Route::post('/estados', [DashboardEstadoController::class, 'store'])->name('dashboardEstado.store');
Route::get('/estados/{id}/edit', [DashboardEstadoController::class, 'edit'])->name('dashboardEstado.edit');
Route::put('/estados/{id}', [DashboardEstadoController::class, 'update'])->name('dashboardEstado.update');
Route::delete('/estados/{id}', [DashboardEstadoController::class, 'destroy'])->name('dashboardEstado.destroy');

Route::get('/leituras',[DashboardLeituraController::class, 'index'])->name('dashboardLeitura.index');
Route::get('/leituras/create', [DashboardLeituraController::class, 'create'])->name('dashboardLeitura.create');
Route::post('/leituras', [DashboardLeituraController::class, 'store'])->name('dashboardLeitura.store');
Route::get('/leituras/{id}/edit', [DashboardLeituraController::class, 'edit'])->name('dashboardLeitura.edit');
Route::put('/leituras/{id}', [DashboardLeituraController::class, 'update'])->name('dashboardLeitura.update');
Route::delete('/leituras/{id}', [DashboardLeituraController::class, 'destroy'])->name('dashboardLeitura.destroy');

Route::get('/perfils',[DashboardPerfilController::class, 'index'])->name('dashboardPerfil.index');
Route::get('/perfils/create', [DashboardPerfilController::class, 'create'])->name('dashboardPerfil.create');
Route::post('/perfils', [DashboardPerfilController::class, 'store'])->name('dashboardPerfil.store');
Route::get('/perfils/{id}/edit', [DashboardPerfilController::class, 'edit'])->name('dashboardPerfil.edit');
Route::put('/perfils/{id}', [DashboardPerfilController::class, 'update'])->name('dashboardPerfil.update');
Route::delete('/perfils/{id}', [DashboardPerfilController::class, 'destroy'])->name('dashboardPerfil.destroy');


Route::get('/comentarios',[DashboardComentarioController::class, 'index'])->name('dashboardComentario.index');
Route::delete('/comentarios/{id}', [DashboardComentarioController::class, 'destroy'])->name('dashboardComentario.destroy');
