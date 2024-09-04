<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Tipo;
use Illuminate\Http\Request;

class TipoController extends Controller
{
    // Método para listar todos os tipos
    public function index()
    {
        $tipos = Tipo::all();
        return response()->json($tipos);
    }

    // Método para criar um novo tipo
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $tipo = Tipo::create($validatedData);

        return response()->json($tipo, 201);
    }

    // Método para mostrar um único tipo
    public function show($id)
    {
        $tipo = Tipo::findOrFail($id);
        return response()->json($tipo);
    }

    // Método para atualizar um tipo existente
    public function update(Request $request, $id)
    {
        $tipo = Tipo::findOrFail($id);

        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
        ]);

        $tipo->update($validatedData);

        return response()->json($tipo);
    }

    // Método para deletar um tipo
    public function destroy($id)
    {
        $tipo = Tipo::findOrFail($id);
        $tipo->delete();

        return response()->json(['message' => 'Tipo deletado com sucesso']);
    }
}
