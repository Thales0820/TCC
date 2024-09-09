@extends('app')
@section('content')
<h1>Editar Tipo</h1>
<form action="{{ route('dashboardTipo.update', $tipo->id) }}" method="POST">
    @csrf
    @method('PUT')
    <div class="mb-3">
        <label for="tipo" class="form-label">Tipo:</label>
        <input
        type="text"
        class="form-control"
        id="nome"
        name="nome"
        value="{{ $tipo->nome }}"
        required
        >
    </div>
    <button type="submit" class="btn btn-primary">Atualizar</button>
</form>
@endsection
