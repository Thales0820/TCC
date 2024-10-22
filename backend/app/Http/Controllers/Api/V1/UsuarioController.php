<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
        // Validação dos dados de entrada
        $request->validate([
            'nome' => 'required|string|max:255',
            'foto_perfil' => 'required|image|mimes:jpeg,png,jpg|max:50000',
            'banner' => 'nullable|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'senha' => 'required|string|min:6',
            'perfil_id' => 'required|exists:perfils,id',
        ]);

        // Processamento do upload da foto de perfil
        $fileName = time() . '-' . $request->file('foto_perfil')->getClientOriginalName();
        $request->file('foto_perfil')->move(public_path('imagesUser'), $fileName);

        // Criação do usuário
        $usuario = Usuario::create([
            'nome' => $request->nome,
            'foto_perfil' => 'imagesUser/' . $fileName,  // Caminho da foto de perfil
            'banner' => $request->banner,  // Banner pode ser nulo
            'email' => $request->email,
            'senha' => Hash::make($request->senha),  // Hash da senha
            'perfil_id' => $request->perfil_id,
        ]);

        // Resposta JSON com os dados do usuário e URL da imagem
        return response()->json([
            'usuario' => $usuario,
            'image_url' => asset('imagesUser/' . $fileName),  // URL pública da imagem
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
            'foto_perfil' => 'nullable|string|max:255', // Permitir atualização sem uma nova imagem
            'banner' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios,email,' . $id,
            'senha' => 'nullable|string|min:6',
            'perfil_id' => 'required|exists:perfils,id',
        ]);

        $data = $request->only([
            'nome', 'banner', 'email', 'perfil_id'
        ]);

        // Handle file upload if a new file is provided
        if ($request->hasFile('foto_perfil')) {
            $fileName = time() . '-' . $request->file('foto_perfil')->getClientOriginalName();
            $fotoPerfilPath = $request->file('foto_perfil')->move(public_path('imagesUser'), $fileName);
            $data['foto_perfil'] = 'imagesUser/' . $fileName; // Atualiza o caminho da imagem no banco de dados
        }

        // Verifica se a senha foi atualizada
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
        // Validação dos dados de entrada
        $validated = $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        // Buscar o usuário pelo email
        $usuario = Usuario::where('email', $validated['email'])->first();

        // Verificar se o usuário foi encontrado e a senha está correta
        if (!$usuario || !Hash::check($validated['senha'], $usuario->senha)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        // Gerar o token de autenticação
        $token = $usuario->createToken('token-name')->plainTextToken;

        // Retornar a resposta JSON com o token e os dados do usuário
        return response()->json([
            'token' => $token,
            'user' => $usuario,
        ], 200);

    } catch (\Exception $e) {
        // Log do erro e retorno de mensagem de erro
        Log::error('Erro no login: ' . $e->getMessage());
        return response()->json(['error' => 'Erro no servidor'], 500);
    }
}

}
