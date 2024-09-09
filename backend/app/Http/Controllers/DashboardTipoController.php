<?php

namespace App\Http\Controllers;

use App\Models\Tipo;
use Illuminate\Http\Request;

class DashboardTipoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tipos = Tipo::all();
        return view('dashboardTipo.index', compact('tipos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
       return view('dashboardTipo.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);
        Tipo::create($request->all());

        return redirect()->route('dashboardTipo.index');
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
        $tipo = Tipo::findOrFail($id);
        return view('dashboardTipo.edit', compact('tipo'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $tipo = Tipo::findOrFail($id);
        $tipo->update($request->all());

        return redirect()->route('dashboardTipo.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tipo = Tipo::findOrFail($id);
        $tipo->delete();

        return redirect()->route('dashboardTipo.index');
    }
}
