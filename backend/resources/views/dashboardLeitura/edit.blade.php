@extends('app')
@section('content')
<h1>Editar Leitura</h1>
<form action="{{ route('dashboardLeitura.update', $leitura->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="mb-3">
        <label for="leitura" class="form-label">Leitura:</label>
        <input
        type="text"
        class="form-control"
        id="tipo"
        name="tipo"
        value="{{ $leitura->tipo }}"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Atualizar</button>
</form>
@endsection
