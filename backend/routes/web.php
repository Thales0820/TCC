<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardGeneroController;
use App\Http\Controllers\DashboardObraController;
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
