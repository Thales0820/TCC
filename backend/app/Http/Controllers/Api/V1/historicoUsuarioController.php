<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\HistoricoUsuario; // Certifique-se de que o nome do modelo está correto
use Illuminate\Http\Request;

class HistoricoUsuarioController extends Controller
{
    public function index()
    {
        $historico = HistoricoUsuario::with([
            'usuario' => function ($query) {
                $query->select('id', 'nome');
            },
            'obra' => function ($query) {
                $query->select('id', 'titulo', 'capa');
            },
            'capitulo' => function ($query) {
                $query->select('id', 'titulo');
            }
        ])->get();

        return response()->json($historico);
    }

    public function getHistorico($usuarioId, Request $request)
    {
        $detalhado = $request->query('detalhado', false);

    if ($detalhado) {
        // Retornar informações detalhadas
        $historico = HistoricoUsuario::where('usuario_id', $usuarioId)
            ->with([
                'obra' => function ($query) {
                $query->select('id', 'titulo', 'capa');
            },
            ])
            ->get();

        return response()->json($historico);
    } else {
        // Retornar apenas IDs dos capítulos
        $historico = HistoricoUsuario::where('usuario_id', $usuarioId)
            ->pluck('capitulo_id');

        return response()->json($historico);
    }
    }

    public function addHistorico(Request $request)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'obra_id' => 'required|exists:obras,id',
            'capitulo_id' => 'required|exists:capitulos,id',
        ]);

        HistoricoUsuario::updateOrCreate(
            ['usuario_id' => $validated['usuario_id'], 'capitulo_id' => $validated['capitulo_id']],
            ['obra_id' => $validated['obra_id'], 'viewed_at' => now()]
        );

        return response()->json(['message' => 'Adicionando ao histórico']);
    }

    public function removeHistorico($usuarioId, $capituloId)
    {
        $historico = HistoricoUsuario::where('usuario_id', $usuarioId)
            ->where('capitulo_id', $capituloId)
            ->first();

        if ($historico) {
            $historico->delete();
            return response()->json(['message' => 'Removido do histórico.']);
        }

        return response()->json(['message' => 'Histórico não encontrado.'], 404);
    }
}
