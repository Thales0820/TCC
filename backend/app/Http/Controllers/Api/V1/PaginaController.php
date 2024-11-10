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


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'capitulo_id' => 'required|exists:capitulos,id',
            'numero' => 'required|string|max:255',
            'imagem' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Armazenar a imagem
        $capituloId = $request->capitulo_id;
        $image = $request->file('imagem');
        $imageName = Str::random(10) . '.' . $image->getClientOriginalExtension(); // Gerar nome único
        $imagePath = $image->storeAs("public/imagemCapi/{$capituloId}", $imageName); // Armazenar na pasta capitulo_id

        // Criar o registro da página
        $pagina = Pagina::create([
            'capitulo_id' => $capituloId,
            'numero' => $request->numero,
            'imagem' => $imagePath, // Salvar o caminho da imagem no banco
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
                Storage::delete($pagina->imagem);
            }

            // Armazenar a nova imagem
            $capituloId = $request->capitulo_id;
            $image = $request->file('imagem');
            $imageName = Str::random(10) . '.' . $image->getClientOriginalExtension(); // Gerar nome único
            $imagePath = $image->storeAs("public/imagemCapi/{$capituloId}", $imageName); // Armazenar na pasta capitulo_id

            // Atualizar o campo imagem
            $pagina->imagem = $imagePath;
        }

        // Atualizar os outros campos
        $pagina->update([
            'capitulo_id' => $request->capitulo_id,
            'numero' => $request->numero,
        ]);

        return response()->json($pagina);
    }
}
