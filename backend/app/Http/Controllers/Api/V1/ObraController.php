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
        $obras = Obra::with('usuario')->get();
        return response()->json($obras);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'titulo' => 'required|string|max:255',
        'capa' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        'sinopse' => 'required|string',
        'autor_id' => 'required|exists:usuarios,id',
        'likes' => 'nullable|integer|min:0',
        'data_publicacao' => 'required|date',
        'data_encerramento' => 'nullable|date',
        'tipo_id' => 'required|exists:tipos,id',
        'estado_id' => 'required|exists:estados,id',
    ]);

    // Gera um nome único para a imagem usando o timestamp
    $fileName = time() . '-' . $request->file('capa')->getClientOriginalName();

    // Salva o arquivo na pasta public/images
    $capaPath = $request->file('capa')->move(public_path('images'), $fileName);

    // Cria a obra com os dados fornecidos
    $obra = Obra::create([
        'titulo' => $request->titulo,
        'capa' => 'images/' . $fileName, // Salva apenas o caminho relativo no banco de dados
        'sinopse' => $request->sinopse,
        'autor_id' => $request->autor_id,
        'likes' => $request->likes ?? 0,
        'data_publicacao' => $request->data_publicacao,
        'data_encerramento' => $request->data_encerramento,
        'tipo_id' => $request->tipo_id,
        'estado_id' => $request->estado_id,
    ]);


    // Retorna a obra junto com a URL da imagem
    return response()->json([
        'obra' => $obra,
        'image_url' => asset('images/' . $fileName), // Gera a URL pública da imagem
    ], 201);
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
            'capa' => 'nullable|string|max:255', // Allow updating without a new image
            'sinopse' => 'required|string',
            'autor_id' => 'required|exists:usuarios,id',
            'likes' => 'nullable|integer|min:0',
            'data_publicacao' => 'required|date',
            'data_encerramento' => 'nullable|date',
            'tipo_id' => 'required|exists:tipos,id',
            'estado_id' => 'required|exists:estados,id',
        ]);

        $data = $request->only([
            'titulo', 'sinopse', 'autor_id', 'likes',
            'data_publicacao', 'data_encerramento', 'tipo_id', 'estado_id'
        ]);

        // Handle file upload if a new file is provided
        if ($request->hasFile('capa')) {
            $capaPath = $request->file('capa')->store('public');
            $data['capa'] = $capaPath; // Update the path in the data
        }

        $obra->update($data);

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
