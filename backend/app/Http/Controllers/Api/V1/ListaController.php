<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lista;

class ListaController extends Controller
{
    public function index()
    {
        $listas = Lista::with([
            'usuario' => function ($query) {
                $query->select('id', 'nome');
            },
            'obra' => function ($query) {
                $query->select('id', 'titulo');
            },
            'leitura' => function ($query) {
                $query->select('id', 'tipo');
            }
        ])->get();

        return response()->json($listas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'obra_id' => 'required|exists:obras,id',
            'leitura_id' => 'required|exists:leituras,id',
        ]);

        $lista = Lista::create($request->all());

        return response()->json($lista, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'leitura_id' => 'required|exists:leituras,id',
        ]);

        $lista = Lista::findOrFail($id);
        $lista->leitura_id = $request-> leitura_id;
        $lista->save();

        return response()->json($lista);
    }

    public function destroy($id)
    {
        $lista = Lista::findOrFail($id);
        $lista->delete();

        return response()->json(['message' => 'Obra removido da lista com sucesso!']);
    }
}
