<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usuarios = Usuario::with('perfil')->get();
        return response()->json($usuarios);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'foto_perfil' => 'required|image|mimes:jpeg,png,jpg|max:50000',
            'banner' => 'nullable|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'senha' => 'required|string',
            'perfil_id' => 'required|exists:perfils,id',
        ]);

        // Processamento do upload da foto de perfil
        $fileName = time() . '-' . $request->file('foto_perfil')->getClientOriginalName();
        $request->file('foto_perfil')->move(public_path('imagesUser'), $fileName);

        // Criação do usuário com senha hashada
        $usuario = Usuario::create([
            'nome' => $request->nome,
            'foto_perfil' => 'imagesUser/' . $fileName,
            'banner' => $request->banner,
            'email' => $request->email,
            'senha' => $request->senha,
            'perfil_id' => $request->perfil_id,
        ]);

        // Gerar o token JWT
        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'usuario' => $usuario,
            'token' => $token,
            'image_url' => asset('imagesUser/' . $fileName),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $usuario = Usuario::with('perfil')->find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        return response()->json($usuario);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $request->validate([
            'nome' => 'required|string|max:255',
            'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg|max:50000',
            'banner' => 'nullable|string|max:255',
            'email' => 'required|email|unique:usuarios,email,' . $id,
            'senha' => 'nullable|string|min:6',
            'perfil_id' => 'required|exists:perfils,id',
        ]);

        $data = $request->only(['nome', 'banner', 'email', 'perfil_id']);

        // Atualiza a foto de perfil se foi enviada uma nova
        if ($request->hasFile('foto_perfil')) {
            $fileName = time() . '-' . $request->file('foto_perfil')->getClientOriginalName();
            $request->file('foto_perfil')->move(public_path('imagesUser'), $fileName);
            $data['foto_perfil'] = 'imagesUser/' . $fileName;
        }

        // Atualiza a senha se um novo valor foi fornecido
        if ($request->filled('senha')) {
            $data['senha'] = bcrypt($request->senha);
        }

        $usuario->update($data);

        return response()->json($usuario);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(null, 204);
    }

    /**
     * Login method for authentication.
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'senha' => 'required|string',
            ]);

            $usuario = Usuario::where('email', $validated['email'])->first();

            if (!$usuario || !Hash::check($validated['senha'], $usuario->senha)) {
                return response()->json(['error' => 'Credenciais inválidas'], 401);
            }

            $token = JWTAuth::fromUser($usuario);

            return response()->json([
                'token' => $token,
                'user' => $usuario,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erro no login: ' . $e->getMessage());
            return response()->json(['error' => 'Erro no servidor'], 500);
        }
    }
}
