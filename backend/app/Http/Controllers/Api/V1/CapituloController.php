<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Capitulo;

class CapituloController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $capitulos = Capitulo::all();
        return response()->json($capitulos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string',
            'obra_id' => 'required|exists:obras,id',
            'data_publicacao' => 'required|date',
            'numero' => 'required|string',
        ]);

        $capitulo = Capitulo::create([
            'titulo' => $request->titulo,
            'obra_id' => $request->obra_id,
            'data_publicacao' => $request->data_publicacao,
            'numero' => $request->numero,
        ]);

        return response()->json($capitulo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $capitulo = Capitulo::find($id);

        if (!$capitulo) {
            return response()->json(['message' => 'Capítulo não encontrado'], 404);
        }

        return response()->json($capitulo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $capitulo = Capitulo::find($id);

        if (!$capitulo) {
            return response()->json(['message' => 'Capítulo não encontrado'], 404);
        }

        $request->validate([
            'titulo' => 'required|string',
            'obra_id' => 'required|exists:obras,id',
            'data_publicacao' => 'required|date',
            'numero' => 'required|string',
        ]);

        $capitulo->update([
            'titulo' => $request->titulo,
            'obra_id' => $request->obra_id,
            'data_publicacao' => $request->data_publicacao,
            'numero' => $request->numero,
        ]);

        return response()->json($capitulo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $capitulo = Capitulo::find($id);

        if (!$capitulo) {
            return response()->json(['message' => 'Capítulo não encontrado'], 404);
        }

        $capitulo->delete();

        return response()->json(null, 204);
    }
}
