<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\HistoricoUsuario; // Certifique-se de que o nome do modelo está correto
use Illuminate\Http\Request;

class HistoricoUsuarioController extends Controller
{
    public function getHistorico($usuarioId)
    {
        // Buscar o histórico do usuário por ID, carregando as relações com obras e páginas
        $historico = HistoricoUsuario::where('usuario_id', $usuarioId)
                    ->with(['obra', 'pagina']) // Melhor usar array para múltiplas relações
                    ->orderBy('viewed_at', 'desc') // Certifique-se de que 'viewed_at' está na tabela
                    ->get();

        return response()->json($historico);
    }
}
