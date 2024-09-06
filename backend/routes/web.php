<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardObraController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
Route::delete('/dashboard/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');

Route::get('/obras', [DashboardObraController::class, 'index'])->name('dashboardObra.index');
Route::delete('/obras/{id}', [DashboardObraController::class, 'destroy'])->name('dashboardObra.destroy');
