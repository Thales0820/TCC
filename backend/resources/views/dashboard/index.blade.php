@extends('layouts.app')

@section('content')
<div class="container mt-4">
    <h1 class="mb-4">Dashboard</h1>

    <div class="card">
        <div class="card-header">
            Estados
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
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Data de Criação</th>
                            <th>Última Atualização</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($estados as $estado)
                        <tr>
                            <td>{{ $estado->id }}</td>
                            <td>{{ $estado->nome }}</td>
                            <td>{{ $estado->created_at }}</td>
                            <td>{{ $estado->updated_at }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>
</div>
@endsection
