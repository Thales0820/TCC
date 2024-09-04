<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Perfil;

class PerfilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $perfils = Perfil::all();
        return response()->json($perfils);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $perfil = Perfil::create([
            'tipo' => $request->tipo,
        ]);

        return response()->json($perfil, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $perfil = Perfil::find($id);

        if (!$perfil) {
            return response()->json(['message' => 'Perfil não encontrado'], 404);
        }

        return response()->json($perfil);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $perfil = Perfil::find($id);

        if (!$perfil) {
            return response()->json(['message' => 'Perfil não encontrado'], 404);
        }

        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $perfil->update([
            'tipo' => $request->tipo,
        ]);

        return response()->json($perfil);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $perfil = Perfil::find($id);

        if (!$perfil) {
            return response()->json(['message' => 'Perfil não encontrado'], 404);
        }

        $perfil->delete();

        return response()->json(null, 204);
    }
}
