<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // Mostrar o formulário de login
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // Processar o login do usuário
    public function login(Request $request)
    {
        // Defina as credenciais padrão
        $defaultEmail = 'admin00@gmail.com';
        $defaultPassword = 'tcc2024';

        // Validar os dados do formulário
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Tentar autenticar o usuário com as credenciais padrão
        if ($request->email === $defaultEmail && $request->password === $defaultPassword) {
            // Se a autenticação for bem-sucedida, registre o usuário
            Auth::loginUsingId(User::firstWhere('email', $defaultEmail)->id);

            // Redirecionar para o dashboard se o login for bem-sucedido
            return redirect()->intended('/');
        }

        // Redirecionar de volta com uma mensagem de erro se falhar
        return back()->withErrors([
            'email' => 'As credenciais fornecidas estão incorretas.',
        ]);
    }

    // Método para processar o logout
    public function logout(Request $request)
    {
        Auth::logout(); // Encerra a sessão do usuário atual

        // Invalida a sessão atual e regenera o token CSRF
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redireciona para a página de login
        return redirect()->route('login');
    }
}
