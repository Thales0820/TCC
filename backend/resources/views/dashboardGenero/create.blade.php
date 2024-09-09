@extends('app')
@section('content')
<h1>Novo Genero</h1>
<form action="{{ route('dashboardGenero.store') }}" method="POST">
    @csrf
    <div class="mb-3">
        <label for="nome" class="form-label">Genero:</label>
        <input
        type="text"
        class="form-control"
        id="nome"
        name="nome"
        placeholder="Digite o tipo"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Enviar</button>
</form>
@endsection
