<?php

namespace App\Http\Controllers;

use App\Models\Perfil;
use Illuminate\Http\Request;

class DashboardPerfilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perfils = Perfil::all();
        return view('dashboardPerfil.index', compact('perfils'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('dashboardPerfil.create');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        Perfil::create($request->all());

        return redirect()->route('dashboardPerfil.index');
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
    public function edit($id)
    {
        $perfil = Perfil::findOrFail($id);
        return view('dashboardPerfil.edit', compact('perfil'));
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $perfil = Perfil::findOrFail($id);
        $perfil->update($request->all());

        return redirect()->route('dashboardPerfil.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $perfil = Perfil::findOrFail($id);
        $perfil->delete();

        return redirect()->route('dashboardPerfil.index');
    }
}

