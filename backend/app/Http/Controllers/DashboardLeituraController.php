<?php

namespace App\Http\Controllers;

use App\Models\Leitura;
use Illuminate\Http\Request;

class DashboardLeituraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leituras = Leitura::all();
        return view('dashboardLeitura.index', compact('leituras'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('dashboardLeitura.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);
        Leitura::create($request->all());

        return redirect()->route('dashboardLeitura.index');
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
        $leitura = Leitura::findOrFail($id);
        return view('dashboardLeitura.edit', compact('leitura'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $leitura = Leitura::findOrFail($id);
        $leitura->update($request->all());

        return redirect()->route('dashboardLeitura.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $leitura = Leitura::findOrFail($id);
        $leitura->delete();

        return redirect()->route('dashboardLeitura.index');
    }
}

