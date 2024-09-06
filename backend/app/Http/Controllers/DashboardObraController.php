<?php

namespace App\Http\Controllers;

use App\Models\Estado;
use App\Models\Obra;
use App\Models\Tipo;
use App\Models\Usuario;
use Illuminate\Http\Request;

class DashboardObraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $obras = Obra::all();
        return view('dashboardObra.index', compact('obras'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $obra = Obra::findOrFail($id);
        $obra->delete();

        return redirect()->route('dashboardObra.index');
    }
}
