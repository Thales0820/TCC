@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <h1 class="mb-4">Dashboard</h1>

    <div class="card">
        <div class="card-header">
            LIsta de Usuarios
        </div>
        <div class="card-body">
            @if($usuarios->isEmpty())
            <div class="alert alert-info" role="alert">
                Nenhum Usuario encontrado.
            </div>
            @else
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($usuarios as $usuario)
                    <tr>
                        <td>{{ $usuario->nome }}</td>
                        <td>{{ $usuario->email }}</td>
                        <td>{{ $usuario->perfil->tipo ?? 'Sem perfil' }}</td>
                        <td>
                            <form action="{{ route('usuarios.destroy', $usuario->id) }}" method="post">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Tem certeza?')">Deletar</button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            @endif
        </div>
    </div>
</div>
@endsection
