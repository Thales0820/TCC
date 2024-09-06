<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Genero; // Certifique-se de ter o modelo Genero

class GeneroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $generos = Genero::all();
        return response()->json($generos, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $genero = Genero::create([
            'nome' => $request->nome,
        ]);

        return response()->json($genero, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $genero = Genero::find($id);

        if (!$genero) {
            return response()->json(['message' => 'Gênero não encontrado'], 404);
        }

        return response()->json($genero, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $genero = Genero::find($id);

        if (!$genero) {
            return response()->json(['message' => 'Gênero não encontrado'], 404);
        }

        $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $genero->update([
            'nome' => $request->nome,
        ]);

        return response()->json($genero, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $genero = Genero::find($id);

        if (!$genero) {
            return response()->json(['message' => 'Gênero não encontrado'], 404);
        }

        $genero->delete();

        return response()->json(null, 204);
    }
}
