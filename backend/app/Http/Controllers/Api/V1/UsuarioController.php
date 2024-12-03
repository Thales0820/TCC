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

    public function show(string $id)
    {
        $usuario = Usuario::with('perfil')->find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        return response()->json($usuario);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'foto_perfil' => 'required|image|mimes:jpeg,png,jpg|max:50000',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg|max:50000',
            'email' => 'required|email|unique:usuarios,email',
            'senha' => 'required|string',
            'perfil_id' => 'required|exists:perfils,id',
        ]);

        // Processamento do upload da foto de perfil
        $fotoPerfilName = time() . '-' . $request->file('foto_perfil')->getClientOriginalName();
        $request->file('foto_perfil')->move(public_path('imagesUser'), $fotoPerfilName);

        // Processamento do upload do banner, se fornecido
        $bannerName = null;
        if ($request->hasFile('banner')) {
            $bannerName = time() . '-' . $request->file('banner')->getClientOriginalName();
            $request->file('banner')->move(public_path('imageBanner'), $bannerName);
        }

        // Criação do usuário com senha hashada
        $usuario = Usuario::create([
            'nome' => $request->nome,
            'foto_perfil' => 'imagesUser/' . $fotoPerfilName,
            'banner' => $bannerName ? 'imageBanner/' . $bannerName : null,
            'email' => $request->email,
            'senha' => $request->senha,
            'perfil_id' => $request->perfil_id,
        ]);

        // Gerar o token JWT
        $token = JWTAuth::fromUser($usuario);

        return response()->json([
            'usuario' => $usuario,
            'token' => $token,
            'image_url' => asset('imagesUser/' . $fotoPerfilName),
            'banner_url' => $bannerName ? asset('imageBanner/' . $bannerName) : null,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $request->validate([
            'nome' => 'nullable|string|max:255',
            'foto_perfil' => 'nullable|image|mimes:jpeg,png,jpg|max:50000',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg|max:50000',
            'email' => 'nullable|email|unique:usuarios,email,' . $id,
            'senha' => 'nullable|string|min:6',
            'perfil_id' => 'nullable|exists:perfils,id',
        ]);

        $data = $request->only(['nome', 'email', 'perfil_id']);

        // Atualiza a foto de perfil se foi enviada uma nova
        if ($request->hasFile('foto_perfil')) {
            $fotoPerfilName = time() . '-' . $request->file('foto_perfil')->getClientOriginalName();
            $request->file('foto_perfil')->move(public_path('imagesUser'), $fotoPerfilName);
            $data['foto_perfil'] = 'imagesUser/' . $fotoPerfilName;
        }

        // Atualiza o banner se foi enviado um novo
        if ($request->hasFile('banner')) {
            $bannerName = time() . '-' . $request->file('banner')->getClientOriginalName();
            $request->file('banner')->move(public_path('imageBanner'), $bannerName);
            $data['banner'] = 'imageBanner/' . $bannerName;
        }

        // Atualiza a senha se um novo valor foi fornecido
        if ($request->filled('senha')) {
            $data['senha'] = $request->senha;
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

    public function disableAccount($id)
    {
        $user = Usuario::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        $user->delete(); // Marca como "deletado"
        return response()->json(['message' => 'Conta desativada com sucesso']);
    }

    public function activateAccount($id)
    {
        $usuario = Usuario::withTrashed()->find($id); // Inclui usuários desativados (soft-deleted)

        if (!$usuario) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }

        if ($usuario->trashed()) {
            $usuario->restore(); // Restaura a conta
            return response()->json(['message' => 'Conta ativada com sucesso.']);
        }

        return response()->json(['message' => 'A conta já está ativa.'], 400);
    }
}
