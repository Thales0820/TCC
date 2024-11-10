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
        // Carregar capítulos com a obra associada
        $capitulos = Capitulo::with('obra')->get();
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
            'data_publicacao' => 'required|date_format:Y-m-d', // Validar formato de data
            'numero' => 'required|string',
        ]);

        // Verificar se já existe um capítulo com o mesmo número na obra
        $existingCapitulo = Capitulo::where('obra_id', $request->obra_id)
                                    ->where('numero', $request->numero)
                                    ->first();

        if ($existingCapitulo) {
            return response()->json(['message' => 'Capítulo com esse número já existe para esta obra.'], 400);
        }

        // Criar o capítulo
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
        $capitulo = Capitulo::with('obra')->find($id); // Carregar obra associada ao capítulo

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
            'data_publicacao' => 'required|date', // Validar formato de data
            'numero' => 'required|string',
        ]);

        // Verificar se já existe um capítulo com o mesmo número na obra
        $existingCapitulo = Capitulo::where('obra_id', $request->obra_id)
                                    ->where('numero', $request->numero)
                                    ->where('id', '!=', $id) // Garantir que não está verificando o próprio capítulo
                                    ->first();

        if ($existingCapitulo) {
            return response()->json(['message' => 'Capítulo com esse número já existe para esta obra.'], 400);
        }

        // Atualizar o capítulo
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

        // Verificar se o capítulo tem páginas associadas
        if ($capitulo->paginas->count() > 0) {
            return response()->json(['message' => 'Este capítulo não pode ser excluído porque possui páginas associadas.'], 400);
        }

        // Excluir o capítulo
        $capitulo->delete();

        return response()->json(null, 204);
    }
}
