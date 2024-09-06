@extends('app')

@section('content')
<h1 class="mb-4">Generos</h1>

<div class="card">
    <div class="card-header">
        LIsta de Generos
    </div>
    <div class="card-body">
        @if($generos->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum genero encontrado.
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
                    <td>{{ $genero->titulo }}</td>
                    <td>
                        <form action="{{ route('dashboardGenero.destroy', $genero->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta genero?');">
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
