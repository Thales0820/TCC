@extends('app')

@section('content')
<h1 class="mb-4">Gêneros</h1>

<div class="card">
    <div class="card-header">
        LIsta de Gêneros
    </div>
    <div class="card-body">
        @if($generos->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum gênero encontrado.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Genero</th>
                    <th></th>

                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($generos as $genero)
                <tr>
                    <td>{{ $genero->nome }}</td>
                    <td>
                        <form action="{{ route('dashboardGenero.destroy', $genero->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta genero?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger">Deletar</button>
                        </form>
                    </td>
                    <td> <a href="{{ route('dashboardGenero.edit', $genero) }}" class="btn btn-warning btn-sm">Editar</a></td>
                </tr>
                @endforeach
            </tbody>

        </table>
        @endif
    </div>
</div>
<br>
<a href="{{ route('dashboardGenero.create')}}">
    <button type="button" class="btn btn-dark">
        Novo gênero
    </button>
</a>
@endsection
