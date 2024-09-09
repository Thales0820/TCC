@extends('app')

@section('content')
<h1 class="mb-4">Perfil</h1>

<div class="card">
    <div class="card-header">
        Lista de Perfil
    </div>
    <div class="card-body">
        @if($perfils->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum perfil encontrado.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Perfil</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($perfils as $perfil)
                <tr>
                    <td>{{ $perfil->tipo }}</td>
                    <td>
                        <form action="{{ route('dashboardPerfil.destroy', $perfil->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta perfil?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Deletar</button>
                        </form>
                    </td>
                    <td> <a href="{{ route('dashboardPerfil.edit', $perfil) }}" class="btn btn-warning btn-sm">Editar</a></td>
                </tr>
                @endforeach
            </tbody>

        </table>
        @endif
    </div>
</div>
<br>
<a href="{{ route('dashboardPerfil.create')}}">
    <button type="button" class="btn btn-dark">
        Novo Perfil
    </button>
</a>
@endsection
