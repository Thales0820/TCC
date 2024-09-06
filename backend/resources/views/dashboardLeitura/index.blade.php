@extends('app')

@section('content')
<h1 class="mb-4">Leituras</h1>

<div class="card">
    <div class="card-header">
        Lista de leituras
    </div>
    <div class="card-body">
        @if($leituras->isEmpty())
        <div class="alert alert-info" role="alert">
            Nenhum leitura encontrado.
        </div>
        @else
        <table class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th>Leitura</th>
                    <th></th>

                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach($leituras as $leitura)
                <tr>
                    <td>{{ $leitura->tipo }}</td>
                    <td>
                        <form action="{{ route('dashboardLeitura.destroy', $leitura->id) }}" method="POST" onsubmit="return confirm('Tem certeza que deseja deletar esta leitura?');">
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
