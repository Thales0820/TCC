<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    // Método para listar todos os usuários (não deletados)
    public function index()
    {
        $usuarios = Usuario::with('perfil')->get();
        return response()->json($usuarios);
    }

    // Método para criar um novo usuário
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'foto_perfil' => 'required|string|max:255',
            'banner' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios',
            'senha' => 'required|string|min:6',
            'perfil_id' => 'required|exists:perfils,id',
        ]);

        $usuario = Usuario::create([
            'nome' => $validatedData['nome'],
            'foto_perfil' => $validatedData['foto_perfil'],
            'banner' => $validatedData['banner'],
            'email' => $validatedData['email'],
            'senha' => bcrypt($validatedData['senha']),
            'perfil_id' => $validatedData['perfil_id'],
        ]);

        return response()->json($usuario, 201);
    }

    // Método para mostrar um único usuário (não deletado)
    public function show($id)
    {
        $usuario = Usuario::with('perfil')->findOrFail($id);
        return response()->json($usuario);
    }

    // Método para atualizar um usuário existente
    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $validatedData = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'foto_perfil' => 'sometimes|required|string|max:255',
            'banner' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:usuarios,email,' . $id,
            'senha' => 'sometimes|required|string|min:6',
            'perfil_id' => 'sometimes|required|exists:perfils,id',
        ]);

        $usuario->update([
            'nome' => $validatedData['nome'] ?? $usuario->nome,
            'foto_perfil' => $validatedData['foto_perfil'] ?? $usuario->foto_perfil,
            'banner' => $validatedData['banner'] ?? $usuario->banner,
            'email' => $validatedData['email'] ?? $usuario->email,
            'senha' => isset($validatedData['senha']) ? bcrypt($validatedData['senha']) : $usuario->senha,
            'perfil_id' => $validatedData['perfil_id'] ?? $usuario->perfil_id,
        ]);

        return response()->json($usuario);
    }

    // Método para deletar um usuário (soft delete)
    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete(); // Executa o soft delete

        return response()->json(null, 204);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'senha' => 'required|string'
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        $token = $usuario->createToken('authToken')->plainTextToken;

        return response()->json(['token' => $token], 200);
    }
}
