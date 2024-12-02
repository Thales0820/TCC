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
        $orderBy = $request->query('orderBy', 'id');
        $order = $request->query('order', 'asc');

        if (!in_array($orderBy, ['id', 'likes', 'titulo'])) {
            $orderBy = 'id';
        }

        if (!in_array($order, ['asc', 'desc'])) {
            $order = 'asc';
        }

        $obras = Obra::with(['usuario', 'generos', 'estado', 'tipo'])
            ->orderBy($orderBy, $order)
            ->get();

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
            'generos' => 'array',
            'generos.*' => 'exists:generos,id',
        ]);

        $fileName = time() . '-' . $request->file('capa')->getClientOriginalName();
        $capaPath = $request->file('capa')->move(public_path('images'), $fileName);

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

        if ($request->has('generos')) {
            $obra->generos()->attach($request->generos);
        }

        return response()->json([
            'obra' => $obra->load('generos'),
            'image_url' => asset('images/' . $fileName),
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $obra = Obra::with(['tipo', 'estado'])->find($id);


        if (!$obra) {
            return response()->json(['message' => 'Obra não encontrada'], 404);
        }

        $request->validate([
            'titulo' => 'nullable|string|max:255',
            'capa' => 'nullable|image|mimes:jpeg,png,jpg|max:100000',
            'sinopse' => 'nullable|string',
            'autor_id' => 'nullable|exists:usuarios,id',
            'likes' => 'nullable|integer|min:0',
            'data_publicacao' => 'nullable|date',
            'tipo_id' => 'nullable|exists:tipos,id',
            'estado_id' => 'nullable|exists:estados,id',
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

        if ($request->hasFile('capa')) {
            $fileName = time() . '-' . $request->file('capa')->getClientOriginalName();
            $capaPath = $request->file('capa')->move(public_path('images'), $fileName);
            $data['capa'] = 'images/' . $fileName;
        }

        $obra->update($data);

        if ($request->has('generos')) {
            $obra->generos()->sync($request->generos);
        }

        return response()->json([
            'id' => $obra->id,
            'titulo' => $obra->titulo,
            'sinopse' => $obra->sinopse,
            'capa' => $obra->capa ? url($obra->capa) : null, // URL completa da capa
            'tipo' => $obra->tipo,
            'estado' => $obra->estado,
            'generos' => $obra->generos,
        ]);
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

    /**
     * List recent works published in the last 5 days.
     */
    public function obrasLancadasRecentes()
    {
        $dataLimite = now()->subDays(5);
        $obrasRecentes = Obra::where('data_publicacao', '>=', $dataLimite)->get();

        return response()->json($obrasRecentes);
    }

    /**
     * Show details of a specific work by ID.
     */
    public function show($id)
    {
        $obra = Obra::with(['usuario', 'generos'])->find($id);

        if (!$obra) {
            return response()->json(['error' => 'Obra não encontrada'], 404);
        }

        return response()->json([
            'id' => $obra->id,
            'titulo' => $obra->titulo,
            'sinopse' => $obra->sinopse,
            'capa' => $obra->capa,
            'usuario' => [
                'autor_id' => $obra->usuario->id,
                'nome' => $obra->usuario->nome,
                'foto_perfil' => $obra->usuario->foto_perfil,
            ],
            'data_publicacao' => $obra->data_publicacao,
            'tipo' => $obra->tipo->nome,
            'estado' => $obra->estado->nome,
            'generos' => $obra->generos->pluck('nome'),
            'likes' => $obra->likes,
        ]);
    }
}
