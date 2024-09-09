<?php

namespace App\Http\Controllers;

use App\Models\Genero;
use Illuminate\Http\Request;

class DashboardGeneroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $generos = Genero::all();
        return view('dashboardGenero.index', compact('generos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('dashboardGenero.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);
        Genero::create($request->all());

        return redirect()->route('dashboardGenero.index');
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
        $genero = Genero::findOrFail($id);
        return view('dashboardGenero.edit', compact('genero'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $genero = Genero::findOrFail($id);
        $genero->update($request->all());

        return redirect()->route('dashboardGenero.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $genero = Genero::findOrFail($id);
        $genero->delete();

        return redirect()->route('dashboardGenero.index');
    }
}
