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
    public function index(Request $request)
    {
        // Define o campo e a direção de ordenação padrão
    $orderBy = $request->query('orderBy', 'id'); // Campo de ordenação padrão: 'id'
    $order = $request->query('order', 'asc');    // Direção padrão: 'asc'

    // Validação para garantir que os parâmetros sejam válidos
    if (!in_array($orderBy, ['id', 'likes', 'titulo'])) {
        $orderBy = 'id'; // Campo padrão se o parâmetro não for válido
    }

    if (!in_array($order, ['asc', 'desc'])) {
        $order = 'asc'; // Direção padrão se o parâmetro não for válido
    }

        $obras = Obra::with(['usuario', 'generos', 'estado', 'tipo'])
        ->orderBy($orderBy, $order)
        ->get(); // Incluindo generos

        return response()->json($obras);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'capa' => 'required|image|mimes:jpeg,png,jpg|max:100000',
            'sinopse' => 'required|string',
            'autor_id' => 'required|exists:usuarios,id',
            'likes' => 'nullable|integer|min:0',
            'data_publicacao' => 'required|date',
            'tipo_id' => 'required|exists:tipos,id',
            'estado_id' => 'required|exists:estados,id',
            'generos' => 'array', // Aceitando múltiplos gêneros
            'generos.*' => 'exists:generos,id', // Validação de cada gênero
        ]);

        // Salvar a imagem como antes
        $fileName = time() . '-' . $request->file('capa')->getClientOriginalName();
        $capaPath = $request->file('capa')->move(public_path('images'), $fileName);

        // Criação da obra
        $obra = Obra::create([
            'titulo' => $request->titulo,
            'capa' => 'images/' . $fileName,
            'sinopse' => $request->sinopse,
            'autor_id' => $request->autor_id,
            'likes' => $request->likes ?? 0,
            'data_publicacao' => $request->data_publicacao,
            'tipo_id' => $request->tipo_id,
            'estado_id' => $request->estado_id,
        ]);

        // Associar gêneros à obra
        if ($request->has('generos')) {
            $obra->generos()->attach($request->generos);
        }

        return response()->json([
            'obra' => $obra->load('generos'), // Carregar gêneros junto com a obra
            'image_url' => asset('images/' . $fileName),
        ], 201);
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
            'capa' => 'nullable|string|max:255',
            'sinopse' => 'required|string',
            'autor_id' => 'required|exists:usuarios,id',
            'likes' => 'nullable|integer|min:0',
            'data_publicacao' => 'required|date',
            'tipo_id' => 'required|exists:tipos,id',
            'estado_id' => 'required|exists:estados,id',
            'generos' => 'array',
            'generos.*' => 'exists:generos,id',
        ]);

        $data = $request->only([
            'titulo',
            'sinopse',
            'autor_id',
            'likes',
            'data_publicacao',
            'tipo_id',
            'estado_id'
        ]);

        // Atualizando a imagem se necessário
        if ($request->hasFile('capa')) {
            $fileName = time() . '-' . $request->file('capa')->getClientOriginalName();
            $capaPath = $request->file('capa')->move(public_path('images'), $fileName);
            $data['capa'] = 'images/' . $fileName;
        }

        $obra->update($data);

        // Atualizar associações de gêneros
        if ($request->has('generos')) {
            $obra->generos()->sync($request->generos); // Atualizar gêneros
        }

        return response()->json($obra->load('generos')); // Retornar a obra atualizada com gêneros
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
    public function obrasLancadasRecentes()
    {
        $dataLimite = now()->subDays(5); // Define a data limite para 5 dias atrás
        $obrasRecentes = Obra::where('data_publicacao', '>=', $dataLimite)->get();

        return response()->json($obrasRecentes);
    }

    // Função show que retorna os detalhes da obra pelo ID
    public function show($id)
    {
        // Busca a obra no banco de dados com o ID fornecido
        $obra = Obra::with(['usuario', 'generos']) // Relacionamentos com autor (usuario) e gêneros
                    ->find($id);

        // Verifica se a obra foi encontrada
        if (!$obra) {
            return response()->json(['error' => 'Obra não encontrada'], 404);
        }

        // Formata a resposta da obra com os detalhes
        return response()->json([
            'id' => $obra->id,
            'titulo' => $obra->titulo,
            'sinopse' => $obra->sinopse,
            'capa' => $obra->capa,
            'usuario' => [
                'nome' => $obra->usuario->nome,
                'foto_perfil' => $obra->usuario->foto_perfil,
            ],
            'data_publicacao' => $obra->data_publicacao,
            'tipo' => $obra->tipo->nome,  // Supondo que você tenha o relacionamento tipo
            'estado' => $obra->estado->nome,  // Supondo que você tenha o relacionamento estado
            'generos' => $obra->generos->pluck('nome'), // Retorna apenas os nomes dos gêneros
            'likes' => $obra->likes, // Quantidade de likes, se houver
        ]);
    }
}
