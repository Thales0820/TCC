<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Leitura;

class LeituraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leituras = Leitura::all();
        return response()->json($leituras);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $leitura = Leitura::create([
            'tipo' => $request->tipo,
        ]);

        return response()->json($leitura, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $leitura = Leitura::find($id);

        if (!$leitura) {
            return response()->json(['message' => 'Leitura não encontrada'], 404);
        }

        return response()->json($leitura);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $leitura = Leitura::find($id);

        if (!$leitura) {
            return response()->json(['message' => 'Leitura não encontrada'], 404);
        }

        $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $leitura->update([
            'tipo' => $request->tipo,
        ]);

        return response()->json($leitura);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $leitura = Leitura::find($id);

        if (!$leitura) {
            return response()->json(['message' => 'Leitura não encontrada'], 404);
        }

        $leitura->delete();

        return response()->json(null, 204);
    }
}
