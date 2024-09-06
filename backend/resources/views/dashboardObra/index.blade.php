@extends('app')

@section('content')
<h1 class="mb-4">Obras</h1>

<div class="card">
    <div class="card-header">
        LIsta de Obras
    </div>
    <div class="card-body">
        @if($obras->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhuma Obra encontrada.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Titulo</th>
                    <th>Autor</th>
                    <th>Likes</th>
                    <th>Estado</th>
                    <th>Tipo Obra</th>
                    <th>Sinopse</th>

                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($obras as $obra)
                <tr>
                    <td>{{ $obra->titulo }}</td>
                    <td>{{ $obra->usuario->nome}}</td>
                    <td>{{ $obra->likes }}</td>
                    <td>{{ $obra->estado ? $obra->estado->nome : 'Estado desconhecido' }}</td>
                    <td>{{ $obra->tipo ? $obra->tipo->nome : 'Estado desconhecido' }}</td>
                    <td>{{ $obra->sinopse }}</td>
                    <td>
                        <form action="{{ route('dashboardObra.destroy', $obra->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta obra?');">
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
