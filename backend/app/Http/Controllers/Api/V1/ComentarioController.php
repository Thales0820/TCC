<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comentario;

class ComentarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comentarios = Comentario::with([
            'usuario' => function ($query) {
                $query->select('id', 'nome');
            },
            'obra' => function ($query) {
                $query->select('id', 'titulo');
            },
        ])->get();

        return response()->json($comentarios);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|integer|exists:usuarios,id',
            'obra_id' => 'required|integer|exists:obras,id',
            'texto' => 'required|string|min:1|max:500',
        ]);

        $comentario = Comentario::create($request->all());
        $comentario->load('usuario');
        return response()->json($comentario, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comentario = Comentario::find($id);

        if (!$comentario) {
            return response()->json(['message' => 'Comentário não encontrado'], 404);
        }

        return response()->json($comentario);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $comentario = Comentario::find($id);

        if (!$comentario) {
            return response()->json(['message' => 'Comentário não encontrado'], 404);
        }

        $request->validate([
            'texto' => 'required|string',
            'usuario_id' => 'required|exists:usuarios,id',
            'obra_id' => 'required|exists:obras,id',
        ]);

        $comentario->update([
            'texto' => $request->texto,
            'usuario_id' => $request->usuario_id,
            'obra_id' => $request->obra_id,
        ]);

        return response()->json($comentario);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $comentario = Comentario::find($id);

        if (!$comentario) {
            return response()->json(['message' => 'Comentário não encontrado'], 404);
        }

        $comentario->delete();

        return response()->json(null, 204);
    }
}
