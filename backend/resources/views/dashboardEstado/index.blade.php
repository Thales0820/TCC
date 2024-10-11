@extends('app')

@section('content')
<h1 class="mb-4">Estados</h1>

<div class="card">
    <div class="card-header">
        Lista de Estados
    </div>
    <div class="card-body">
        @if($estados->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum estado encontrado.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Estado</th>
                    <th>#</th>
                    <th>#</th>
                </tr>
            </thead>
            <tbody>
                @foreach($estados as $estado)
                <tr>
                    <td>{{ $estado->nome }}</td>
                    <td> <a href="{{ route('dashboardEstado.edit', $estado) }}" class="btn btn-warning">Editar</a></td>
                    <td>
                        <form action="{{ route('dashboardEstado.destroy', $estado->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta estado?');">
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
<br>
<a href="{{ route('dashboardEstado.create')}}">
    <button type="button" class="btn btn-primary">
        Novo Estado
    </button>
</a>
@endsection
