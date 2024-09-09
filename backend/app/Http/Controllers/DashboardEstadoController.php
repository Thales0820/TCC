<?php

namespace App\Http\Controllers;

use App\Models\Estado;
use Illuminate\Http\Request;

class DashboardEstadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $estados = Estado::all();
        return view('dashboardEstado.index', compact('estados'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('dashboardEstado.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        Estado::create($request->all());

        return redirect()->route('dashboardEstado.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $estado = Estado::findOrFail($id);
        return view('dashboardEstado.edit', compact('estado'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $estado = Estado::findOrFail($id);
        $estado->update($request->all());

        return redirect()->route('dashboardEstado.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $estado = Estado::findOrFail($id);
        $estado->delete();

        return redirect()->route('dashboardEstado.index');
    }
}

