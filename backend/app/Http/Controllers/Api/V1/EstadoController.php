<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Estado;

class EstadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $estados = Estado::all();
        return response()->json($estados);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $estado = Estado::create([
            'nome' => $request->nome,
        ]);

        return response()->json($estado, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $estado = Estado::find($id);

        if (!$estado) {
            return response()->json(['message' => 'Estado não encontrado'], 404);
        }

        return response()->json($estado);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $estado = Estado::find($id);

        if (!$estado) {
            return response()->json(['message' => 'Estado não encontrado'], 404);
        }

        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $estado->update([
            'nome' => $request->nome,
        ]);

        return response()->json($estado);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $estado = Estado::find($id);

        if (!$estado) {
            return response()->json(['message' => 'Estado não encontrado'], 404);
        }

        $estado->delete();

        return response()->json(['message' => 'Estado deletado com sucesso']);
    }
}
