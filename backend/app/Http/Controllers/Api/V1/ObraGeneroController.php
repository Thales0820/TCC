<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ObraGenero;
use Illuminate\Http\Request;

class ObraGeneroController extends Controller
{
    public function index()
    {
        return ObraGenero::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'obra_id' => 'required|exists:obras,id',
            'genero_id' => 'required|exists:generos,id',
        ]);

        $obraGenero = ObraGenero::create($request->all());
        return response()->json($obraGenero, 201);
    }

    public function destroy($id)
    {
        $obraGenero = ObraGenero::findOrFail($id);
        $obraGenero->delete();

        return response()->json(null, 204);
    }

    public function getByObra($obraId)
    {
        return ObraGenero::where('obra_id', $obraId)->get();
    }

    public function getByGenero($generoId)
    {
        return ObraGenero::where('genero_id', $generoId)->get();
    }
}
