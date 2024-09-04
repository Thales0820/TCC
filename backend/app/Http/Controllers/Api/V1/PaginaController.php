<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pagina;

class PaginaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paginas = Pagina::all();
        return response()->json($paginas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'capitulo_id' => 'required|exists:capitulos,id',
            'numero' => 'required|string|max:255',
            'imagem' => 'required|string|max:255',
        ]);

        $pagina = Pagina::create([
            'capitulo_id' => $request->capitulo_id,
            'numero' => $request->numero,
            'imagem' => $request->imagem,
        ]);

        return response()->json($pagina, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pagina = Pagina::find($id);

        if (!$pagina) {
            return response()->json(['message' => 'Página não encontrada'], 404);
        }

        return response()->json($pagina);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pagina = Pagina::find($id);

        if (!$pagina) {
            return response()->json(['message' => 'Página não encontrada'], 404);
        }

        $request->validate([
            'capitulo_id' => 'required|exists:capitulos,id',
            'numero' => 'required|string|max:255',
            'imagem' => 'required|string|max:255',
        ]);

        $pagina->update([
            'capitulo_id' => $request->capitulo_id,
            'numero' => $request->numero,
            'imagem' => $request->imagem,
        ]);

        return response()->json($pagina);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pagina = Pagina::find($id);

        if (!$pagina) {
            return response()->json(['message' => 'Página não encontrada'], 404);
        }

        $pagina->delete();

        return response()->json(null, 204);
    }
}
