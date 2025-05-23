@extends('app')

@section('content')
<h1 class="mb-4">Usuários Cadastrados</h1>
<div class="card">
    <div class="card-header">
        Lista de Usuários
    </div>
    <div class="card-body">
        @if($usuarios->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum Usuário encontrado.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Nome</th>
                    <th>Foto Perfil</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($usuarios as $usuario)
                <tr>
                    <td>{{ $usuario->nome }}</td>
                    <td><img src="{{ $usuario->foto_perfil }}" alt="Foto do {{ $usuario->nome }}" width="200px" height="auto"></td>
                    <td>{{ $usuario->email }}</td>
                    <td>{{ $usuario->perfil->tipo ?? 'Sem perfil' }}</td>
                    <td>
                        <form action="{{ route('dashboard.destroy', $usuario->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar este usuário?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Deletar</button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif
    </div>
</div>
@endsection
