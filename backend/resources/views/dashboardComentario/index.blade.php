@extends('app')

@section('content')
<h1 class="mb-4">Comentários</h1>

<div class="card">
    <div class="card-header">
        Lista de comentários
    </div>
    <div class="card-body">
        @if($comentarios->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum comentário encontrado.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Usuário</th>
                    <th>Obra</th>
                    <th>Comentário</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($comentarios as $comentario)
                <tr>
                    <td>{{ $comentario->usuario->nome ?? 'Usuario nao encontrado' }}</td>
                    <td>{{ $comentario->obra->titulo ?? 'Comentario nao encontrado' }}</td>
                    <td>{{ $comentario->texto }}</td>
                    <td>
                        <form action="{{ route('dashboardComentario.destroy', $comentario->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta comentario?');">
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
