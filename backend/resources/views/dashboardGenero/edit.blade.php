@extends('app')
@section('content')
<h1>Editar Gênero</h1>
<form action="{{ route('dashboardGenero.update', $genero->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="mb-3">
        <label for="genero" class="form-label">Gênero:</label>
        <input
        type="text"
        class="form-control"
        id="nome"
        name="nome"
        value="{{ $genero->nome }}"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Atualizar</button>
</form>
@endsection
