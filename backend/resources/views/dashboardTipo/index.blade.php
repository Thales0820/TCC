@extends('app')

@section('content')
    <h1 class="mb-4">Tipos de Obras Cadastrados</h1>

    <div class="card">
        <div class="card-header">
            Lista de Tipos
        </div>
        <div class="card-body">
            @if($tipos->isEmpty())
            <div class="alert alert-info" role="alert">
                Nenhum tipo encontrado.
            </div>
            @else
            <table class="table table-striped table-bordered">
                <thead class="thead-dark">
                    <tr>
                        <th>tipo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($tipos as $tipo)
                    <tr>
                        <td>{{ $tipo->nome }}</td>
                        <td>
                        <form action="{{ route('dashboard.destroy', $tipo->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar este usuário?');">
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
