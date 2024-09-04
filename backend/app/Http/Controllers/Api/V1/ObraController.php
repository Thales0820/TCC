<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Obra;

class ObraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $obras = Obra::all();
        return response()->json($obras);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'capa' => 'required|string|max:255',
            'sinopse' => 'required|string',
            'autor_id' => 'required|exists:usuarios,id',
            'likes' => 'nullable|integer|min:0',
            'data_publicacao' => 'required|date',
            'data_encerramento' => 'nullable|date',
            'tipo_id' => 'required|exists:tipos,id',
            'estado_id' => 'required|exists:estados,id',
        ]);

        $obra = Obra::create([
            'titulo' => $request->titulo,
            'capa' => $request->capa,
            'sinopse' => $request->sinopse,
            'autor_id' => $request->autor_id,
            'likes' => $request->likes ?? 0,
            'data_publicacao' => $request->data_publicacao,
            'data_encerramento' => $request->data_encerramento,
            'tipo_id' => $request->tipo_id,
            'estado_id' => $request->estado_id,
        ]);

        return response()->json($obra, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $obra = Obra::find($id);

        if (!$obra) {
            return response()->json(['message' => 'Obra não encontrada'], 404);
        }

        return response()->json($obra);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $obra = Obra::find($id);

        if (!$obra) {
            return response()->json(['message' => 'Obra não encontrada'], 404);
        }

        $request->validate([
            'titulo' => 'required|string|max:255',
            'capa' => 'required|string|max:255',
            'sinopse' => 'required|string',
            'autor_id' => 'required|exists:usuarios,id',
            'likes' => 'nullable|integer|min:0',
            'data_publicacao' => 'required|date',
            'data_encerramento' => 'nullable|date',
            'tipo_id' => 'required|exists:tipos,id',
            'estado_id' => 'required|exists:estados,id',
        ]);

        $obra->update([
            'titulo' => $request->titulo,
            'capa' => $request->capa,
            'sinopse' => $request->sinopse,
            'autor_id' => $request->autor_id,
            'likes' => $request->likes ?? 0,
            'data_publicacao' => $request->data_publicacao,
            'data_encerramento' => $request->data_encerramento,
            'tipo_id' => $request->tipo_id,
            'estado_id' => $request->estado_id,
        ]);

        return response()->json($obra);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $obra = Obra::find($id);

        if (!$obra) {
            return response()->json(['message' => 'Obra não encontrada'], 404);
        }

        $obra->delete();

        return response()->json(null, 204);
    }
}
