<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pagina;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PaginaController extends Controller
{

    public function index()
    {
        // Buscar todas as páginas com os dados do capítulo
        $paginas = Pagina::with('capitulo')->get();

        // Retorna as páginas com os dados do capítulo no formato JSON
        return response()->json($paginas);
    }

    public function show($id)
    {
        // Busca a obra no banco de dados com o ID fornecido
        $pagina = Pagina::with(['capitulo']) // Relacionamentos com autor (usuario) e gêneros
            ->find($id);

        // Verifica se a obra foi encontrada
        if (!$pagina) {
            return response()->json(['error' => 'Obra não encontrada'], 404);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'capitulo_id' => 'required|exists:capitulos,id',
            'numero' => 'required|string|max:255',
            'imagem' => 'required|image|mimes:jpeg,png,jpg,gif|max:100000',
        ]);

        // Armazenar a imagem
        $capituloId = $request->capitulo_id;
        $image = $request->file('imagem');

        // Gerar um nome único para a imagem
        $imageName = Str::random(10) . '.' . $image->getClientOriginalExtension();

        // Definir o caminho de destino
        $destinationPath = public_path("images/imagemCapi/{$capituloId}");

        // Verifica se o diretório do capítulo existe, se não, cria-o
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        // Mover a imagem para o diretório desejado
        $image->move($destinationPath, $imageName);

        // Criar o registro da página com o caminho da imagem
        $pagina = Pagina::create([
            'capitulo_id' => $capituloId,
            'numero' => $request->numero,
            'imagem' => "images/imagemCapi/{$capituloId}/{$imageName}", // Caminho relativo da imagem
        ]);

        return response()->json($pagina, 201);
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
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // A imagem é opcional ao atualizar
        ]);

        // Se houver uma nova imagem
        if ($request->hasFile('imagem')) {
            // Apagar a imagem anterior, se existir
            if ($pagina->imagem) {
                $oldImagePath = public_path($pagina->imagem);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath); // Deletar a imagem anterior
                }
            }

            // Armazenar a nova imagem
            $image = $request->file('imagem');
            $imageName = Str::random(10) . '.' . $image->getClientOriginalExtension(); // Gerar nome único com o timestamp
            $destinationPath = public_path("images/imagemCapi/{$request->capitulo_id}");

            // Verificar e criar o diretório, se necessário
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            // Mover a nova imagem
            $image->move($destinationPath, $imageName);

            // Atualizar o campo imagem com o novo caminho
            $pagina->imagem = "images/imagemCapi/{$request->capitulo_id}/{$imageName}";
        }

        // Atualizar os outros campos
        $pagina->update([
            'capitulo_id' => $request->capitulo_id,
            'numero' => $request->numero,
        ]);

        return response()->json($pagina);
    }
}
